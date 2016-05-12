import $ from 'jquery';
import React, { PropTypes } from 'react';
import { Motion, spring } from 'react-motion';

// decorators
import Radium from 'radium';

import '../css/timeline.css';
import TimelineDot from './TimelineDot';
import HorizontalTimelineButtons from './HorizontalTimelineButtons';

const DAY = 86400000;
const MAX_NORMALISED_SEPERATION = 6;
const MIN_TIMELINE_WIDTH = 750;
const DATE_WIDTH = 85;

let daydiff = (first, second) => Math.round((second - first));

/**
 * Determines the minimum distance between events
 * @param  {[array]} dates [the array containing all the dates]
 * @return {[number]}       [the minimum distance between events]
 */
const __minDistanceEvents__ = (dates) => {
  // determine the minimum distance among events
  let dateDistances = [];
  for (let i = 1; i < dates.length; i += 1) {
    let distance = daydiff(dates[i - 1], dates[i]);
    dateDistances.push(distance);
  }

  // return the minimum distance between two dates but considering that all dates
  // are the same then return the distance between 2 days i.e. 86400000
  return Math.max(Math.min.apply(null, dateDistances), DAY);
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
    this.state = {
      position: 0,
      selected: 0,
      filledValue: 0,
      maxPosition: 0
    };
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

  __setUpState__ = (nextProps) => {
    // parsing the dates from all valid formats that the constructor for Date accepts.
    let dates = nextProps.values.map((value) => new Date(value));
    // Calculating the minimum seperation between events
    this.eventsMinLapse = __minDistanceEvents__(dates);

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

    // The new state of the horizontal timeline.
    let state = {
      // the distances from the origin of the the timeline
      distanceFromOrigin: distances,
      // parsed format of the dates
      timelineDates: dates,
      // the exact value of the width of the timeline
      timelineTotWidth: Math.max(MIN_TIMELINE_WIDTH, distances[distances.length - 1] + 100)
    };

    // set selected value only if index value is present
    if (nextProps.index) {
      state.selected = nextProps.index;
    }
    this.setState(state, () => {
      this.__updateFilling__(this.state.selected);
    });
  };

  __updateFilling__ = (selected) => {
    // filled value = distane from origin to the selected event + half the space occupied by the date string on screen
    let filledValue = (this.state.distanceFromOrigin[selected] + DATE_WIDTH / 2) / this.state.timelineTotWidth;

    // right now the filledValue contains the value of the transform
    this.setState({
      selected: selected,
      filledValue: filledValue
    });
  };

  updateSlide = (string) => {
    // the width of the timeline component between the two buttons (prev and next)
    let	wrapperWidth = Number($('.events-wrapper').css('width').replace('px', ''));

    //  translate the timeline to the left('next')/right('prev')
    if (string === 'right') {
      this.setState({
        position: Math.max(this.state.position - wrapperWidth + this.props.eventsMinDistance,
                            wrapperWidth - this.state.timelineTotWidth),
        maxPosition: wrapperWidth - this.state.timelineTotWidth
      });
    } else if (string === 'left') {
      this.setState({ position: Math.min(0, this.state.position + wrapperWidth - this.props.eventsMinDistance) });
    }
  };

  handleDateClick = (index) => {
    this.props.indexClick(index);
    this.__updateFilling__(index);
  };

  render() {
    //  creating an array of list items that have an onClick handler into which
    //  passing the index of the clicked entity.
    // NOTE: Improve timeline dates handeling and eventsMinLapse handling
    let valuesList = this.props.values.map((date, index) => (
        <TimelineDot
          distanceFromOrigin={this.state.distanceFromOrigin[index]}
          eventDate={this.state.timelineDates[index]}
          index={index}
          key={index}
          onClick={this.handleDateClick}
          selected={this.state.selected}
          styles={this.props.styles}
        />
      )
    );

    return (
      <div className='cd-horizontal-timeline loaded' >
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
          <HorizontalTimelineButtons
            maxPosition={this.state.maxPosition}
            position={this.state.position}
            styles={this.props.styles}
            updateSlide={this.updateSlide}
          />
        </div>
      </div>
    );
  }
}

export default Radium(HorizontalTimeline);
