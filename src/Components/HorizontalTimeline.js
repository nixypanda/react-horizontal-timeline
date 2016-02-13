import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

let daydiff = (first, second) => Math.round((second - first));

let setTransformValue = (element, property, value) => {
  element.style['-webkit-transform'] = property + '(' + value + ')';
  element.style['-moz-transform'] = property + '(' + value + ')';
  element.style['-ms-transform'] = property + '(' + value + ')';
  element.style['-o-transform'] = property + '(' + value + ')';
  element.style['transform'] = property + '(' + value + ')';
};


let getTranslateValue = (timeline) => {
  let translateValue = 0;
  let timelineStyle = window.getComputedStyle(timeline.get(0), null);
  let timelineTranslate = timelineStyle.getPropertyValue('-webkit-transform') ||
  timelineStyle.getPropertyValue('-moz-transform') ||
  timelineStyle.getPropertyValue('-ms-transform') ||
  timelineStyle.getPropertyValue('-o-transform') ||
  timelineStyle.getPropertyValue('transform');

  if (timelineTranslate.indexOf('(') >= 0) {
    timelineTranslate = timelineTranslate.split('(')[1];
    timelineTranslate = timelineTranslate.split(')')[0];
    timelineTranslate = timelineTranslate.split(',');
    translateValue = timelineTranslate[4];
  }

  return Number(translateValue);
};


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
      selected: 0
    };

    this.timelineComponents = {};

    this.__updateSlide__ = this.__updateSlide__.bind(this);
    this.__onLinkClick__ = this.__onLinkClick__.bind(this);
    this.__updateFilling__ = this.__updateFilling__.bind(this);
    this.__setTimelineWidth__ = this.__setTimelineWidth__.bind(this);
    this.__minDistanceEvents__ = this.__minDistanceEvents__.bind(this);
    this.__translateTimeline__ = this.__translateTimeline__.bind(this);
    this.__updateTimelinePosition__ = this.__updateTimelinePosition__.bind(this);

    this.timelineDates = this.props.values.map((value) => new Date(value));
    this.eventsMinLapse = this.__minDistanceEvents__(this.timelineDates);
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

  /**
  * This shity method needs to change
  * @return {[type]} [description]
  */
  componentDidMount() {
    let timelines = $('.cd-horizontal-timeline');
    let timeline = $(timelines[0]);

    this.timelineComponents.timelineWrapper = timeline.find('.events-wrapper');
    this.timelineComponents.eventsWrapper = this.timelineComponents.timelineWrapper.children('.events');
    this.timelineComponents.fillingLine = this.timelineComponents.eventsWrapper.children('.filling-line');
    this.timelineComponents.timelineEvents = this.timelineComponents.eventsWrapper.find('a');
    // creating date array
    this.timelineTotWidth = this.__setTimelineWidth__(this.props.eventsMinDistance);
  }


  __updateFilling__(selectedEvent) {
    // change .filling-line length according to the selected event
    let eventStyle = window.getComputedStyle(selectedEvent.get(0), null);
    let eventLeft = eventStyle.getPropertyValue('left');
    let eventWidth = eventStyle.getPropertyValue('width');
    eventLeft = Number(eventLeft.replace('px', '')) + Number(eventWidth.replace('px', '')) / 2;
    let scaleValue = eventLeft / this.timelineTotWidth;
    setTransformValue(this.timelineComponents.fillingLine.get(0), 'scaleX', scaleValue);
  }

  __updateTimelinePosition__(string, event) {
    // translate timeline to the left/right according to the position of the selected event
    let eventStyle = window.getComputedStyle(event.get(0), null);
    let eventLeft = Number(eventStyle.getPropertyValue('left').replace('px', ''));

    let timelineWidth = Number(this.timelineComponents.timelineWrapper.css('width').replace('px', ''));
    let timelineTotWidth = Number(this.timelineComponents.eventsWrapper.css('width').replace('px', ''));
    let timelineTranslate = getTranslateValue(this.timelineComponents.eventsWrapper);

    if ( (string === 'next' && eventLeft > timelineWidth - timelineTranslate) ||
        (string === 'prev' && eventLeft < - timelineTranslate) ) {
      this.__translateTimeline__(- eventLeft + timelineWidth / 2, timelineWidth - timelineTotWidth);
    }
  }

  __setTimelineWidth__(width) {
    let timeSpan = daydiff(this.timelineDates[0],
      this.timelineDates[this.timelineDates.length - 1]);
    let timeSpanNorm = timeSpan / this.eventsMinLapse;
    timeSpanNorm = Math.round(timeSpanNorm) + 4;
    let totalWidth = timeSpanNorm * width;
    this.timelineComponents.eventsWrapper.css('width', totalWidth + 'px');

    this.__updateFilling__(this.timelineComponents.eventsWrapper.find('a.selected'));

    this.__updateTimelinePosition__('next',
      this.timelineComponents.eventsWrapper.find('a.selected'),
      this.timelineComponents);

    return totalWidth;
  }

  __updateSlide__(string) {
    if (!string) {
      return;
    }

    // retrieve translateX value of this.timelineComponents.eventsWrapper
    let translateValue = getTranslateValue(this.timelineComponents.eventsWrapper);
    let	wrapperWidth = Number(this.timelineComponents.timelineWrapper.css('width').replace('px', ''));

    //  translate the timeline to the left('next')/right('prev')
    if (string === 'next') {
      this.__translateTimeline__(translateValue - wrapperWidth + this.props.eventsMinDistance,
        wrapperWidth - this.timelineTotWidth);
    } else if (string === 'prev') {
      this.__translateTimeline__(translateValue + wrapperWidth - this.props.eventsMinDistance);
    } else {
      return;
    }
  }

  // translates the timeline on the click of left or right arrow
  // change it to onClick handling on the specified buttons
  __translateTimeline__(val, totWidth) {
    let value = val;
    let eventsWrapper = this.timelineComponents.eventsWrapper.get(0);
    value = (value > 0) ? 0 : value; // only negative translate value
    // do not translate more than timeline width
    value = ( !(typeof totWidth === 'undefined') && value < totWidth ) ? totWidth : value;
    setTransformValue(eventsWrapper, 'translateX', value + 'px');
    // set the position of the computend value to the state
    this.setState({ position: value, maxPosition: totWidth });
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
            <div className='events'>
              <ol>
                { valuesList }
              </ol>
              <span className='filling-line' aria-hidden='true'></span>
            </div>
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
