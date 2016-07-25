import React, {PropTypes} from 'react';
import {Motion, spring} from 'react-motion';

// decorators
import Radium from 'radium';

import {zip, daydiff, cummulativeSeperation} from '../helpers';
import Constants from '../Constants';

import TimelineEvents from './TimelineEvents';

const defaultCalcLabel = (value) => (new Date(value)).toDateString().substring(4);

const transformEvents = (Component) => {

    const EventsTransform = ({values, getLabel, eventsMinDistance, ...props}) => {
        //Default label calculation
        const calcLabel = getLabel || defaultCalcLabel;
        const minDistance = eventsMinDistance || 80;

        const dates = values.map((value) => new Date(value));
        const distances = cummulativeSeperation(dates, minDistance, Constants.DAY, Constants.MAX_NORMALISED_SEPERATION);
        const events = distances.map((distance, index) => ({
            distance,
            label: calcLabel(values[index]),
        }));

        return (
            <Component
                events={events}
                eventsMinDistance={minDistance}
                {...props}
            />
        );
    };

    EventsTransform.propTypes = {
        //  array containing the sorted date strings
        values: PropTypes.arrayOf(PropTypes.string).isRequired,
        // The minimum distance between consecutive events
        eventsMinDistance: PropTypes.number,
    }

    return EventsTransform;

};

/*
 * This is the Horizontal Timeline. This component expects an array of dates
 * just as strings (e.g. 1/1/1993) and layes them horizontaly on the the screen
 * also expects a callback which is activated when that particular index is
 * clicked passing that index along
 */
class HorizontalTimeline extends React.Component {

    constructor(props) {
        super(props);
        this.touch = {
            coors: {
                x: 0,
                y: 0
            },
            isSwiping: false,
            started: false,
            threshold: 3
        }

        this.__storeMainDiv__ = this.__storeMainDiv__.bind(this);
    }

    /**
   * The expected properties from the parent
   * @type {Object}
   */
    static propTypes = {
        index: PropTypes.number,
        //  array containing the events
        events: PropTypes.arrayOf(PropTypes.shape({
            distance: PropTypes.number.isRequired,
            label: PropTypes.string.isRequired,
        })).isRequired,
        //  function that takes the index of the array as argument
        indexClick: PropTypes.func,
        // The minimum distance between consecutive events
        eventsMinDistance: PropTypes.number,
        styles: PropTypes.object,
        fillingMotion: PropTypes.object,
        slidingMotion: PropTypes.object
    };

    /**
   * The values that the properties will take if they are not provided
   * by the user.
   * @type {Object}
   */
    static defaultProps = {
        styles: {
            outline: '#dfdfdf',
            background: '#f8f8f8',
            foreground: '#7b9d6f'
        },
        fillingMotion: {
            stiffness: 150,
            damping: 25
        },
        slidingMotion: {
            stiffness: 150,
            damping: 25
        },
        isTouchEnabled: true
    };

    componentWillMount() {
        document.body.addEventListener('keydown', this.__move__);
        window.addEventListener('resize', this.handleResize);
    }

    componentDidMount() {
        this.__setUpState__(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.__setUpState__(nextProps);
    }

    componentWillUnmount() {
        document.body.removeEventListener('keydown', this.__move__);
        window.removeEventListener('resize', this.handleResize);
    }

    handleTouchStart = (event) => {
        const touchObj = event.touches[0];

        this.touch.coors.x = touchObj.pageX;
        this.touch.coors.y = touchObj.pageY;
        this.touch.isSwiping = false;
        this.touch.started = true;
    };

    handleTouchMove = (event) => {
        const wrapperWidth = Number(getComputedStyle(document.getElementsByClassName('events-wrapper')[0])['width'].replace('px', ''));
        if (!this.touch.started) {
            this.handleTouchStart(event);
            return;
        }

        const touchObj = event.touches[0];
        const dx = Math.abs(this.touch.coors.x - touchObj.pageX);
        const dy = Math.abs(this.touch.coors.y - touchObj.pageY);

        const isSwiping = dx > dy && dx > this.touch.threshold;

        if (isSwiping === true || dx > this.touch.threshold || dy > this.touch.threshold) {
            this.touch.isSwiping = isSwiping;
            const dX = this.touch.coors.x - touchObj.pageX; // amount scrolled
            this.touch.coors.x = touchObj.pageX;
            this.setState({
                position: this.state.position - (dX) // set new position
            });
        }
        if (this.touch.isSwiping !== true) {
            return;
        }
        // Prevent native scrolling
        event.preventDefault();
    };

    handleTouchEnd = (event) => {
        const wrapperWidth = Number(getComputedStyle(document.getElementsByClassName('events-wrapper')[0])['width'].replace('px', ''));
        const barWidth = Number(getComputedStyle(document.getElementsByClassName('events-bar')[0])['width'].replace('px', ''));
        if (this.state.position > 0) { // if already at start
            this.setState({position: 0});
        } else if ((barWidth - wrapperWidth + this.state.position) < 0) {
            // if scrolled more than the available space
            const pos = wrapperWidth - barWidth;
            this.setState({position: pos});
        }
        this.touch.coors.x = 0;
        this.touch.coors.y = 0;
        this.touch.isSwiping = false;
        this.touch.started = false;
    };

    handleResize = () => {
        this.__setUpState__(this.props);
    }

   /**
    * Movement in the horizontal timeline based on the movent from arrow keys
    *
    * @param  {object} event The keypress event
    * @return {undefind} modifies the state (either by translating the timeline or by updateing the
    * dot)
    */
    __move__ = (event) => {
        if (event.keyCode === Constants.LEFT_KEY || event.keyCode === Constants.RIGHT_KEY) {
            this.updateSlide(Constants.KEYMAP[event.keyCode]);
        } else if (event.keyCode === Constants.UP_KEY) {
            this.handleDateClick(Math.min(this.state.selected + 1, this.props.events.length - 1));
        } else if (event.keyCode === Constants.DOWN_KEY) {
            this.handleDateClick(Math.max(this.state.selected - 1, 0));
        }
    }

    __setUpState__ = (props) => {
        if (this.mainDiv) {
            const fullWidth = Number(getComputedStyle(this.mainDiv)['width'].replace('px', '')) - 80;
            // The new state of the horizontal timeline.
            const state = {
                // the exact value of the width of the timeline
                totalWidth: Math.max(this.props.events[this.props.events.length - 1].distance + 100, fullWidth),
            };

            //Update the state and go to the selected event afterwards
            this.setState(state);
        }
    };

    /**
     * Handler to store the main div so we can reference it later
     */
    __storeMainDiv__(ref) {
        this.mainDiv = ref;
        this.__setUpState__(this.props);
    }

    render() {
        //  creating an array of list items that have an onClick handler into which
        //  passing the index of the clicked entity.
        // NOTE: Improve timeline dates handeling and eventsMinLapse handling
        const touchEvents = this.props.isTouchEnabled
            ? {
                onTouchStart: this.handleTouchStart,
                onTouchMove: this.handleTouchMove,
                onTouchEnd: this.handleTouchEnd
            }
            : {};
        return (
            <div
                ref={this.__storeMainDiv__}
                style={{
                    position: 'relative',
                    height: '100%',
                    width: '100%'
                }}
                {...touchEvents}
            >
                {this.state.totalWidth
                    ? <TimelineEvents
                        events={this.props.events}
                        selectedIndex={this.props.index}
                        totalWidth={this.state.totalWidth}
                        minDistance={this.props.eventsMinDistance}
                        minSeperation={Constants.DAY}
                        maxSeperation={Constants.MAX_NORMALISED_SEPERATION}
                        labelWidth={Constants.DATE_WIDTH}
                        handleDateClick={this.props.indexClick}
                        fillingMotion={this.props.fillingMotion}
                        slidingMotion={this.props.slidingMotion}
                        styles={this.props.styles}
                      />
                    : undefined
                }
            </div>
        );
    }
}

export default transformEvents(Radium(HorizontalTimeline));
