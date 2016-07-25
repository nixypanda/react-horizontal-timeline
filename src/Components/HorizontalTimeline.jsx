import React, {PropTypes} from 'react';
import {Motion, spring} from 'react-motion';

// decorators
import Radium from 'radium';

import {zip, daydiff, cummulativeSeperation} from '../helpers';
import Constants from '../Constants';
import TimelineDot from './TimelineDot';
import HorizontalTimelineButtons from './HorizontalTimelineButtons';
import Faders from './Faders';

/*
 * This is the Horizontal Timeline. This component expects an array of dates
 * just as strings (e.g. 1/1/1993) and layes them horizontaly on the the screen
 * also expects a callback which is activated when that particular index is
 * clicked passing that index along
 */
class HorizontalTimeline extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            position: 0,
            selected: 0,
            filledValue: 0
        };
        this.touch = {
            coors: {
                x: 0,
                y: 0
            },
            isSwiping: false,
            started: false,
            threshold: 3
        }
    }

    /**
   * The expected properties from the parent
   * @type {Object}
   */
    static propTypes = {
        index: PropTypes.number,
        //  array containing the dates
        values: PropTypes.array.isRequired,
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
        eventsMinDistance: 80,
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
        this.__setUpState__(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.__setUpState__(nextProps);
    }

    componentWillUnmount() {
        document.body.removeEventListener('keydown', this.__move__);
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
            this.handleDateClick(Math.min(this.state.selected + 1, this.state.timelineDates.length - 1));
        } else if (event.keyCode === Constants.DOWN_KEY) {
            this.handleDateClick(Math.max(this.state.selected - 1, 0));
        }
    }

    __setUpState__ = (nextProps) => {
        // parsing the dates from all valid formats that the constructor for Date accepts.
        const dates = nextProps.values.map((value) => new Date(value));
        const distances = cummulativeSeperation(dates, nextProps.eventsMinDistance, Constants.DAY, Constants.MAX_NORMALISED_SEPERATION);

        //TODO We need the full width of the bar here to correctly determine the totalWidth
        const fullWidth = 2000;

        // The new state of the horizontal timeline.
        const state = {
            // the distances from the origin of the the timeline
            distanceFromOrigin: distances,
            // parsed format of the dates
            timelineDates: dates,
            // the exact value of the width of the timeline
            totalWidth: Math.max(nextProps.styles.maxSize, distances[distances.length - 1] + 100, fullWidth)
        };

        // set selected value only if index value is present
        if (nextProps.index) {
            state.selected = nextProps.index;
        }

        this.setState(state,
        // after setting the state go to the selected event
        () => {
            this.__updateFilling__(this.state.selected);
        });
    };

    /**
   * Updates the the value of the position that the filling bar should take.
   * @param  {number} selected The index of the dot upto which the filling needs to be done.
   * @return {undefind} Nothing just modifies the state withe the new filling value.
   */
    __updateFilling__ = (selected) => {
        // filled value = distane from origin to the selected event + half the space occupied by the
        // date string on screen
        const filledValue = (this.state.distanceFromOrigin[selected] + Constants.DATE_WIDTH / 2) / this.state.totalWidth;

        // right now the filledValue contains the value of the transform
        this.setState({selected: selected, filledValue: filledValue});
    };

    /**
   * This method translates the timeline by a certaing amount depending on if the direction passed
   * is left or right.
   *
   * @param  {string} direction The direction towards which the timeline will translates
   * @return {undefind} Just modifies the value by which we need to translate the timeline in place
   */
    updateSlide = (direction) => {
        // the width of the timeline component between the two buttons (prev and next)
        const wrapperWidth = Number(getComputedStyle(document.getElementsByClassName('events-wrapper')[0])['width'].replace('px', ''));

        //  translate the timeline to the left('next')/right('prev')
        if (direction === Constants.RIGHT) {
            this.setState({
                position: Math.max(this.state.position - wrapperWidth + this.props.eventsMinDistance, wrapperWidth - this.state.totalWidth),
                maxPosition: wrapperWidth - this.state.totalWidth
            });
        } else if (direction === Constants.LEFT) {
            this.setState({
                position: Math.min(0, this.state.position + wrapperWidth - this.props.eventsMinDistance)
            });
        }
    };

    /**
   * Invokes the parent prop indexClick with the passed value of the index and then updates the
   * filling bar by calling
   * the __updateFilling__ method.
   *
   * @param  {number} index The index of the timeline dot that we need to go to
   * @return {undefind} modifies the state
   */
    handleDateClick = (index) => {
        this.props.indexClick(index);
        this.__updateFilling__(index);
    };

    render() {
        //  creating an array of list items that have an onClick handler into which
        //  passing the index of the clicked entity.
        // NOTE: Improve timeline dates handeling and eventsMinLapse handling
        const valuesList = this.props.values.map((date, index) => (<TimelineDot distanceFromOrigin={this.state.distanceFromOrigin[index]} eventDate={this.state.timelineDates[index]} index={index} key={index} onClick={this.handleDateClick} selected={this.state.selected} styles={this.props.styles}/>));
        const touchEvents = this.props.isTouchEnabled
            ? {
                onTouchStart: this.handleTouchStart,
                onTouchMove: this.handleTouchMove,
                onTouchEnd: this.handleTouchEnd
            }
            : {};
        return (
            <div {...touchEvents}>
                <div style={{
                    position: 'relative',
                    height: 100,
                    margin: '0 auto',
                    width: '100%'
                }}>
                    <div className='events-wrapper' style={{
                        position: 'relative',
                        height: '100%',
                        margin: '0 40px',
                        overflow: 'hidden'
                    }}>
                        <Motion style={{
                            X: spring(this.state.position, this.props.slidingMotion)
                        }}>
                            {({X}) =>
                              <div className='events' style={{
                                  position: 'absolute',
                                  zIndex: 1,
                                  left: 0,
                                  top: 49,
                                  height: 2,
                                  background: this.props.styles.outline,
                                  width: 100 %,
                                  WebkitTransform: `translate3d(${X}, 0, 0)px`,
                                  transform: `translate3d(${X}px, 0, 0)`
                              }}>
                                <ol className='events-bar' style={{
                                    listStyle: 'none'
                                }}>
                                    {valuesList}
                                </ol>

                                <Motion style={{
                                    tX: spring(this.state.filledValue, this.props.fillingMotion)
                                }}>
                                    {({tX}) =>
                                      <span aria-hidden='true' className='filling-line' style={{
                                        position: 'absolute',
                                        zIndex: 1,
                                        left: 0,
                                        top: 0,
                                        height: '100%',
                                        width: '100%',
                                        transformOrigin: 'left center',
                                        backgroundColor: this.props.styles.foreground,
                                        WebkitTransform: `scaleX(${tX})`,
                                        transform: `scaleX(${tX})`
                                    }}></span>
                                  }
                                </Motion>
                              </div>
                            }
                        </Motion>
                    </div>
                    <Faders styles={this.props.styles}/>
                    <HorizontalTimelineButtons maxPosition={this.state.maxPosition} position={this.state.position} styles={this.props.styles} updateSlide={this.updateSlide}/>
                </div>
            </div>
        );
    }
}

export default Radium(HorizontalTimeline);
