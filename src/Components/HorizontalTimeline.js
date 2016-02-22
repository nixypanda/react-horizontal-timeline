import React, { PropTypes } from 'react';
import { Motion, spring } from 'react-motion';
import ReactDOM from 'react-dom';
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

    this.timelineComponents = {};
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
    eventsMinDistance: PropTypes.number
  };

  /**
  * The values that the properties will take if they are not provided
  * by the user.
  * @type {Object}
  */
  static defaultProps = {
    eventsMinDistance: 80,
    eventsMaxDistance: 360
  };

  componentWillMount() {
    let dates = this.props.values.map((value) => new Date(value));
    this.eventsMinLapse = this.__minDistanceEvents__(dates);
    let width = this.__setTimelineWidth__(dates);
    this.setState({
      timelineDates: dates,
      timelineTotWidth: width
    });
  }

  /**
  * This shity method needs to change
  * @return {[type]} [description]
  */
  componentDidMount() {
    let timelines = $('.cd-horizontal-timeline');
    let timeline = $(timelines[0]);

    this.timelineComponents.timelineWrapper = timeline.find('.events-wrapper');
    this.timelineComponents.eventsWrapper = this.timelineComponents.timelineWrapper.children('.events');

    this.__updateFilling__(this.timelineComponents.eventsWrapper.find('a.selected'));
  }

  componentWillReceiveProps(nextProps) {
    let dates = nextProps.values.map((value) => new Date(value));
    this.eventsMinLapse = this.__minDistanceEvents__(dates);
    let width = this.__setTimelineWidth__(dates);
    this.setState({
      timelineDates: dates,
      timelineTotWidth: width
    });
  }

  @autobind
  __updateFilling__(selectedEvent) {
    // change .filling-line length according to the selected event
    let eventStyle = window.getComputedStyle(selectedEvent.get(0), null);
    let eventLeft = eventStyle.getPropertyValue('left');
    let eventWidth = eventStyle.getPropertyValue('width');
    eventLeft = Number(eventLeft.replace('px', '')) + Number(eventWidth.replace('px', '')) / 2;
    let filledValue = eventLeft / this.state.timelineTotWidth;
    // right now the filledValue contains the value of the transform
    this.setState({ filledValue: filledValue });
  }

  @autobind
  __setTimelineWidth__(dates) {
    let timeSpan = daydiff(dates[0], dates[dates.length - 1]);
    let width = (Math.round(timeSpan / this.eventsMinLapse) + 6) * this.props.eventsMinDistance;
    let maxDist = 0;
    for (let i = 1; i < dates.length; i++) {
      let spanAdjacent = daydiff(dates[i - 1], dates[i]);
      maxDist += Math.min(Math.round(spanAdjacent / this.eventsMinLapse) + 1, 6);
    }
    width = Math.min(width, maxDist * this.props.eventsMinDistance);
    // NOTE: Hardcoded minimum length of the timeline
    return Math.max(750, width);
  }

  @autobind
  __updateSlide__(string) {
    let	wrapperWidth = Number(this.timelineComponents.timelineWrapper.css('width').replace('px', ''));

    //  translate the timeline to the left('next')/right('prev')
    if (string === 'next') {
      this.__translateTimeline__(this.state.position - wrapperWidth + this.props.eventsMinDistance,
        wrapperWidth - this.state.timelineTotWidth);
    } else if (string === 'prev') {
      this.__translateTimeline__(this.state.position + wrapperWidth - this.props.eventsMinDistance);
    }
  }

  // translates the timeline on the click of left or right arrow
  // change it to onClick handling on the specified buttons
  @autobind
  __translateTimeline__(val, totWidth) {
    let value = val;
    value = (value > 0) ? 0 : value; // only negative translate value
    // do not translate more than timeline width
    value = ( !(typeof totWidth === 'undefined') && value < totWidth ) ? totWidth : value;
    // set the position of the computend value to the state
    this.setState({ position: value, maxPosition: totWidth });
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
  __onLinkClick__(next, ref) {
    // expecting the ref of the link here.
    this.setState({ selected: next }, this.__updateFilling__($(this.refs[ref])));
  }

  render() {
    //  creating an array of list items that have an onClick handler into which
    //  passing the index of the clicked entity.
    // NOTE: Improve timeline dates handeling and eventsMinLapse handling
    let valuesList = this.props.values.map((date, index) => {
      let parsedDate = new Date(date);
      let distance = daydiff(this.state.timelineDates[0], this.state.timelineDates[index]);
      // NOTE: for now just setting a hard limit on the value of normalised distanceNorm
      // i.e. distances will grow linearly and reach a max point then stop to increase
      // an elegent mathametical calculation opertunity here.
      let distanceNorm = Math.min(Math.round(distance / this.eventsMinLapse) + 1, 6);

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
            ref={ date }
            onClick={ this.__onLinkClick__.bind(this.state.selected, index, date) }
            className={ classname }
            style={{ left: (distanceNorm + index) * this.props.eventsMinDistance, cursor: 'pointer' }}
            data-date={ date }>
            { parsedDate.toDateString().substring(4) }
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

    let timeline = (
      <div className='cd-horizontal-timeline loaded'>
        <div className='timeline'>
          <div className='events-wrapper'>
            { /* Use react motion here to control what happens on click of next or prev */ }
            <Motion style={{ X: spring(this.state.position, {stiffness: 500}) }}>
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
                <Motion style={{ tX: spring(this.state.filledValue, {stiffness: 300, damping: 20}) }}>
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

    return (
      <div>
        { timeline }
      </div>
    );
  }
}
