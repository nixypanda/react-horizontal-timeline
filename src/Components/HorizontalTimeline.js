import React, { PropTypes } from 'react';
import { Motion, spring } from 'react-motion';
import ReactDOM from 'react-dom';
import $ from 'jquery';

let daydiff = (first, second) => Math.round((second - first));

/**
* This is the Horizontal Timeline. This component expects an array of dates
* just as strings (e.g. 1/1/1993) and layes them horizontaly on the the screen
* also expects a callback which is activated when that particular index is
* clicked passing that index along
*/
export default class HorizontalTimeline extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      position: 0,
      selected: 0,
      filledValue: 0,
      timelineTranslate: 0
    };

    this.timelineComponents = {};

    this.__updateSlide__ = this.__updateSlide__.bind(this);
    this.__onLinkClick__ = this.__onLinkClick__.bind(this);
    this.__updateFilling__ = this.__updateFilling__.bind(this);
    this.__setTimelineWidth__ = this.__setTimelineWidth__.bind(this);
    this.__minDistanceEvents__ = this.__minDistanceEvents__.bind(this);
    this.__translateTimeline__ = this.__translateTimeline__.bind(this);
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
    eventsMinDistance: 120
  };

  componentWillMount() {
    this.timelineDates = this.props.values.map((value) => new Date(value));
    this.eventsMinLapse = this.__minDistanceEvents__(this.timelineDates);
    this.timelineTotWidth = this.__setTimelineWidth__();
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

  __updateFilling__(selectedEvent) {
    // change .filling-line length according to the selected event
    let eventStyle = window.getComputedStyle(selectedEvent.get(0), null);
    let eventLeft = eventStyle.getPropertyValue('left');
    let eventWidth = eventStyle.getPropertyValue('width');
    eventLeft = Number(eventLeft.replace('px', '')) + Number(eventWidth.replace('px', '')) / 2;
    let filledValue = eventLeft / this.timelineTotWidth;
    // right now the filledValue contains the value of the transform
    this.setState({filledValue: filledValue});
  }

  __setTimelineWidth__() {
    let timeSpan = daydiff(this.timelineDates[0], this.timelineDates[this.timelineDates.length - 1]);
    return (Math.round(timeSpan / this.eventsMinLapse) + 4) * this.props.eventsMinDistance;
  }

  __updateSlide__(string) {
    if (!string) {
      return;
    }

    let translateValue = this.state.timelineTranslate;
    let	wrapperWidth = Number(this.timelineComponents.timelineWrapper.css('width').replace('px', ''));

    //  translate the timeline to the left('next')/right('prev')
    if (string === 'next') {
      this.__translateTimeline__(translateValue - wrapperWidth + this.props.eventsMinDistance,
        wrapperWidth - this.timelineTotWidth);
    } else if (string === 'prev') {
      this.__translateTimeline__(translateValue + wrapperWidth - this.props.eventsMinDistance);
    }
  }

  // translates the timeline on the click of left or right arrow
  // change it to onClick handling on the specified buttons
  __translateTimeline__(val, totWidth) {
    let value = val;
    value = (value > 0) ? 0 : value; // only negative translate value
    // do not translate more than timeline width
    value = ( !(typeof totWidth === 'undefined') && value < totWidth ) ? totWidth : value;
    // set the position of the computend value to the state
    this.setState({ position: value, maxPosition: totWidth, timelineTranslate: value });
  }

  /**
  * Determines the minimum distance between events
  * @param  {[array]} dates [the array containing all the dates]
  * @return {[number]}       [the minimum distance between events]
  */
  __minDistanceEvents__(dates) {
    // determine the minimum distance among events
    let dateDistances = [];
    for (let i = 1; i < dates.length; i++) {
      let distance = daydiff(dates[i - 1], dates[i]);
      dateDistances.push(distance);
    }
    return Math.min.apply(null, dateDistances);
  }


  __onLinkClick__(next, ref) {
    // expecting the ref of the link here.
    this.setState({ selected: next }, this.__updateFilling__($(ReactDOM.findDOMNode(this.refs[ref]))));
  }

  render() {
    //  creating an array of list items that have an onClick handler into which
    //  passing the index of the clicked entity.
    // NOTE: Improve timeline dates handeling and eventsMinLapse handling
    let valuesList = this.props.values.map((date, index) => {
      let parsedDate = new Date(date);
      let distance = daydiff(this.timelineDates[0], this.timelineDates[index]);
      let distanceNorm = Math.round(distance / this.eventsMinLapse) + 2;
      // decide the classname of the events being displayed on the timeline
      // older-event: displayed as a circle
      // selected: displayed as a filled-circle.
      let classname = '';
      classname += index < this.state.selected ? 'older-event' : '';
      classname += index === this.state.selected ? ' selected' : '';

      return (
        <li key={ index }
          onClick={ this.props.indexClick.bind(null, index) }>
          <a href='#0'
            ref={ date }
            onClick={ this.__onLinkClick__.bind(this.state.selected, index, date) }
            className={ classname }
            style={{ left: distanceNorm * this.props.eventsMinDistance }}
            data-date={ date }>
            { parsedDate.toDateString() }
          </a>
        </li>
      );
    });

    // this handles the rendering part of the buttons that appear on either side of
    // the timeline.
    let buttons = (
      <ul className='cd-timeline-navigation'>
        <li onClick={ this.__updateSlide__.bind(null, 'prev')}>
          <a href='#0' className={ this.state.position === 0 ? 'prev inactive' : 'prev' }>
            { '<' }
          </a>
        </li>
        <li onClick={ this.__updateSlide__.bind(null, 'next')}>
          <a href='#0' className={ this.state.position === this.state.maxPosition ? 'next inactive' : 'next' }>
            { '>' }
          </a>
        </li>
      </ul>
    );

    let timeline = (
      <div className='cd-horizontal-timeline loaded'>
        <div className='timeline'>
          <div className='events-wrapper'>
            { /* Use react motion here to control what happens on click of next or prev */ }
            <Motion style={{ X: spring(this.state.timelineTranslate, {stiffness: 180, damping: 12})}}>
              {({X}) =>
              <div className='events'
                style={{
                  width: this.timelineTotWidth,
                  WebkitTransform: `translateX(${X})px`,
                  transform: `translateX(${X}px)`
                }}>
                <ol>
                  { valuesList }
                </ol>
                { /* Using react-motion here to simplify a lot of the code */ }
                <Motion style={{ tX: spring(this.state.filledValue, {stiffness: 210, damping: 20}) }}>
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
