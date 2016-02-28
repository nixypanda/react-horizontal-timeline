import React, { PropTypes } from 'react';
import { Motion, spring } from 'react-motion';
import $ from 'jquery';

// decorators
import Radium from 'radium';
import autobind from 'autobind-decorator';

import FaAngleLeft from 'react-icons/lib/fa/angle-left';
import FaAngleRight from 'react-icons/lib/fa/angle-right';


let daydiff = (first, second) => Math.round((second - first));

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
  left: {
    cursor: 'pointer',
    left: 0
  },
  right: {
    cursor: 'pointer',
    right: 0
  },
  inactive: {
    color: '#dfdfdf',
    cursor: 'not-allowed'
  }
};

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
    for (let i = 1; i < dates.length; i++) {
      let distance = daydiff(dates[i - 1], dates[i]);
      dateDistances.push(distance);
    }

    // return the minimum distance between two dates but considering that all dates
    // are the same then return the distance between 2 days i.e. 86400000
    return Math.max(Math.min.apply(null, dateDistances), 86400000);
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

    for (let index = 1; index < distances.length; index++) {
      let distance = daydiff(dates[index - 1], dates[index]);
      // NOTE: for now just setting a hard limit on the value of normalised distanceNorm
      // i.e. distances will grow linearly and reach a max point then stop to increase
      // an elegent mathametical calculation opertunity here.
      let distanceFromPrevious = Math.min(Math.round(distance / this.eventsMinLapse) + 1, 6);
      // the distance_from_origin(n) = distance_from_origin(n-1) + distance between n and n - 1.
      distances[index] = distances[index - 1] + distanceFromPrevious * nextProps.eventsMinDistance;
    }

    this.setState({
      // the distances from the origin of the the timeline
      distanceFromOrigin: distances,
      // parsed format of the dates
      timelineDates: dates,
      // the exact value of the width of the timeline
      timelineTotWidth: Math.max(750, distances[distances.length - 1] + 100)
    });

    // also translate timeline to the position of the new selected event
  }

  /**
  * This shity method needs to change
  * @return {[type]} [description]
  */
  componentDidMount() {
    // have the initial event selected.
    this.__updateFilling__(0);
  }

  @autobind
  __updateFilling__(selected) {
    // change .filling-line length according to the selected event
    let eventStyle = window.getComputedStyle($(this.refs[this.state.timelineDates[selected]]).get(0), null);
    // The half the space occupied by the the string showing the date
    let eventWidth = Number(eventStyle.getPropertyValue('width').replace('px', '')) / 2;
    // filled value = distane from origin to the selected event + half the space occupied by the date string on screen
    let filledValue = (this.state.distanceFromOrigin[selected] + eventWidth) / this.state.timelineTotWidth;

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
      // selected: displayed as a filled-circle.
      let classname = '';
      classname += index < this.state.selected ? 'older-event' : '';
      classname += index === this.state.selected ? ' selected' : '';

      return (
        <li key={ index }
          onClick={ this.props.indexClick.bind(null, index) }>
          <a
            ref={ this.state.timelineDates[index] }
            onClick={ this.__updateFilling__.bind(this.state.selected, index) }
            className={ classname }
            style={{ left: this.state.distanceFromOrigin[index], cursor: 'pointer' }}
            data-date={ date }>
            { this.state.timelineDates[index].toDateString().substring(4) }
          </a>
        </li>
      );
    });

    // this handles the rendering part of the buttons that appear on either side of
    // the timeline.

    let buttons = (
      <ul className='cd-timeline-navigation' style={{listStyle: 'none'}} >
        <li onClick={ this.__updateSlide__.bind(null, 'prev')}>
          <a
            style={[
              styles.left,
              (this.state.position === 0) && styles.inactive
            ]}>
            <FaAngleLeft style={ styles.both } />
          </a>
        </li>
        <li onClick={ this.__updateSlide__.bind(null, 'next')}>
          <a
            style={[
              styles.right,
              (this.state.position === this.state.maxPosition) && styles.inactive
            ]}>
            <FaAngleRight style={ styles.both } />
          </a>
        </li>
      </ul>
    );

    return (
      <div className='cd-horizontal-timeline loaded'>
        <div className='timeline'>
          <div className='events-wrapper'>

            { /* Use react motion here to control what happens on click of next or prev */ }
            <Motion style={{ X: spring(this.state.position, this.props.slidingMotion) }}>
              {({X}) =>
              <div className='events'
                style={{
                  width: this.state.timelineTotWidth,
                  WebkitTransform: `translate3d(${X}, 0, 0)px`,
                  transform: `translate3d(${X}px, 0, 0)`
                }}>
                <ol style={{listStyle: 'none'}} >
                  { valuesList }
                </ol>

                { /* Using react-motion here to simplify a lot of the code */ }
                <Motion style={{ tX: spring(this.state.filledValue, this.props.fillingMotion) }}>
                  {({tX}) =>
                  <span className='filling-line' aria-hidden='true'
                    style={{ WebkitTransform: `scaleX(${tX})`, transform: `scaleX(${tX})` }}></span>
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
