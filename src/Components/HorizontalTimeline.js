import $ from 'jquery';
import React, { PropTypes } from 'react';
import { Motion, spring } from 'react-motion';

// decorators
import Radium from 'radium';
import autobind from 'autobind-decorator';

// icons
import FaAngleLeft from 'react-icons/lib/fa/angle-left';
import FaAngleRight from 'react-icons/lib/fa/angle-right';

import {} from '../css/timeline.css';

const DAY = 86400000;
const MAX_NORMALISED_SEPERATION = 6;
const MIN_TIMELINE_WIDTH = 750;
const DATE_WIDTH = 85;

let daydiff = (first, second) => Math.round((second - first));

/**
* This is the Horizontal Timeline. This component expects an array of dates
* just as strings (e.g. 1/1/1993) and layes them horizontaly on the the screen
* also expects a callback which is activated when that particular index is
* clicked passing that index along
*/
@Radium
export default class HorizontalTimeline extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      position: 0,
      selected: 0,
      filledValue: 0
    };
  }

  /**
   * The expected properties from the parent
   * @type {Object}
   */
  static propTypes = {
    //  array containing the dates
    values: PropTypes.array.isRequired,
    //  function that takes the index of the array as argument
    indexClick: PropTypes.func.isRequired,
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
      background: '#dfdfdf',
      foreground: '#7b9d6f',
      maxSize: 800
    },
    fillingMotion: { stiffness: 150, damping: 25 },
    slidingMotion: { stiffness: 150, damping: 25 }
  };

  componentWillMount() {
    this.__setUpState__(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.__setUpState__(nextProps);
  }

  /**
  * Determines the minimum distance between events
  * @param  {[array]} dates [the array containing all the dates]
  * @return {[number]}       [the minimum distance between events]
  */
  @autobind
  __minDistanceEvents__(dates) {
    // determine the minimum distance among events
    let dateDistances = [];
    for (let i = 1; i < dates.length; i += 1) {
      let distance = daydiff(dates[i - 1], dates[i]);
      dateDistances.push(distance);
    }

    // return the minimum distance between two dates but considering that all dates
    // are the same then return the distance between 2 days i.e. 86400000
    return Math.max(Math.min.apply(null, dateDistances), DAY);
  }

  @autobind
  __setUpState__(nextProps) {
    // parsing the dates from all valid formats that the constructor for Date accepts.
    let dates = nextProps.values.map((value) => new Date(value));
    // Calculating the minimum seperation between events
    this.eventsMinLapse = this.__minDistanceEvents__(dates);

    // using dynamic programming to set up the distance from the origin of the timeline.
    let distances = new Array(dates.length);
    distances[0] = nextProps.eventsMinDistance;

    for (let index = 1; index < distances.length; index += 1) {
      let distance = daydiff(dates[index - 1], dates[index]);
      // NOTE: for now just setting a hard limit on the value of normalised distanceNorm
      // i.e. distances will grow linearly and reach a max point then stop to increase
      // an elegent mathametical calculation opertunity here.
      let distanceFromPrevious = Math.min(Math.round(distance / this.eventsMinLapse) + 1, MAX_NORMALISED_SEPERATION);
      // the distance_from_origin(n) = distance_from_origin(n-1) + distance between n and n - 1.
      distances[index] = distances[index - 1] + distanceFromPrevious * nextProps.eventsMinDistance;
    }

    // set selected value only if index value is present
    if (nextProps.index !== null) {
      this.setState({ selected: nextProps.index });
    }

    // needs to be done after setting up selected
    this.setState({
      // the distances from the origin of the the timeline
      distanceFromOrigin: distances,
      // parsed format of the dates
      timelineDates: dates,
      // the exact value of the width of the timeline
      timelineTotWidth: Math.max(MIN_TIMELINE_WIDTH, distances[distances.length - 1] + 100)
    }, () => {
      this.__updateFilling__(this.state.selected);
    });
  }

  @autobind
  __updateFilling__(selected) {
    // filled value = distane from origin to the selected event + half the space occupied by the date string on screen
    let filledValue = (this.state.distanceFromOrigin[selected] + DATE_WIDTH / 2) / this.state.timelineTotWidth;

    // right now the filledValue contains the value of the transform
    this.setState({
      selected: selected,
      filledValue: filledValue
    });
  }

  @autobind
  __updateSlide__(string) {
    // the width of the timeline component between the two buttons (prev and next)
    let	wrapperWidth = Number($('.events-wrapper').css('width').replace('px', ''));

    //  translate the timeline to the left('next')/right('prev')
    if (string === 'next') {
      this.setState({
        position: Math.max(this.state.position - wrapperWidth + this.props.eventsMinDistance,
                            wrapperWidth - this.state.timelineTotWidth),
        maxPosition: wrapperWidth - this.state.timelineTotWidth
      });
    } else if (string === 'prev') {
      this.setState({ position: Math.min(0, this.state.position + wrapperWidth - this.props.eventsMinDistance) });
    }
  }

  render() {
    //  creating an array of list items that have an onClick handler into which
    //  passing the index of the clicked entity.
    // NOTE: Improve timeline dates handeling and eventsMinLapse handling
    let valuesList = this.props.values.map((date, index) => {
      // decide the classname of the events being displayed on the timeline
      // older-event: displayed as a circle

      let dots = {
        base: {
          position: 'absolute',
          left: this.state.distanceFromOrigin[index] + (DATE_WIDTH - 2) / 2,
          bottom: -5,
          height: 12,
          width: 12,
          borderRadius: '50%',
          zIndex: 2
        },
        none: {
          border: `2px solid ${this.props.styles.background}`,
          backgroundColor: '#f8f8f8'
        },
        older: {
          backgroundColor: '#f8f8f8',
          border: `2px solid ${this.props.styles.foreground}`
        },
        selected: {
          backgroundColor: this.props.styles.foreground,
          borderColor: this.props.styles.foreground
        }
      };

      return (
        <li key={ index }
          onClick={ this.props.indexClick.bind(null, index) }>
          <a
            className='text-center'
            data-date={ date }
            onClick={ this.__updateFilling__.bind(this.state.selected, index) }
            ref={ this.state.timelineDates[index] }
            style={{ left: this.state.distanceFromOrigin[index], cursor: 'pointer', width: DATE_WIDTH }} >
            { this.state.timelineDates[index].toDateString().substring(4) }
          </a>
          <span style={[
            dots.base,
            (this.state.selected < index) && dots.none,
            (this.state.selected > index) && dots.older,
            (this.state.selected === index) && dots.selected
          ]}>
          </span>
        </li>
      );
    });

    // this handles the rendering part of the buttons that appear on either side of
    // the timeline.

    let styles = {
      both: {
        position: 'absolute',
        zIndex: 2,
        top: '50%',
        bottom: 'auto',
        transform: 'translateY(-50%)',
        height: 20,
        width: 29
      },
      active: {
        color: this.props.styles.foreground,
        cursor: 'pointer'
      },
      inactive: {
        color: '#dfdfdf',
        cursor: 'not-allowed'
      }
    };

    let buttons = (
      <ul className='cd-timeline-navigation' style={{ listStyle: 'none' }} >
        <li onClick={ this.__updateSlide__.bind(null, 'prev')}>
          <a
            key='left'
            style={[
              { ':hover': { border: `2px solid ${this.props.styles.foreground}` }, left: 0 },
              (this.state.position === 0) ? styles.inactive : styles.active
            ]}>
            <FaAngleLeft style={ styles.both } />
          </a>
        </li>
        <li onClick={ this.__updateSlide__.bind(null, 'next')}>
          <a
            key='right'
            style={[
              { ':hover': { border: `2px solid ${this.props.styles.foreground}` }, right: 0 },
              (this.state.position === this.state.maxPosition) ? styles.inactive : styles.active
            ]}>
            <FaAngleRight style={ styles.both } />
          </a>
        </li>
      </ul>
    );

    return (
      <div className='cd-horizontal-timeline loaded'>
        <div className='timeline' style={{
          maxWidth: this.props.styles.maxSize
        }}>
          <div className='events-wrapper'>

            <Motion style={{ X: spring(this.state.position, this.props.slidingMotion) }}>
              {({ X }) =>
              <div className='events'
                style={{
                  width: this.state.timelineTotWidth,
                  WebkitTransform: `translate3d(${X}, 0, 0)px`,
                  transform: `translate3d(${X}px, 0, 0)`
                }}>
                <ol style={{ listStyle: 'none' }} >
                  { valuesList }
                </ol>

                <Motion style={{ tX: spring(this.state.filledValue, this.props.fillingMotion) }}>
                  {({ tX }) =>
                  <span
                    aria-hidden='true'
                    className='filling-line'
                    style={{
                      backgroundColor: this.props.styles.foreground,
                      WebkitTransform: `scaleX(${tX})`,
                      transform: `scaleX(${tX})`
                    }}>
                  </span>
                }
              </Motion>
            </div>
            }
            </Motion>
          </div>
          { buttons }
        </div>
      </div>
    );
  }
}
