import React, { PropTypes } from 'react';
import $ from 'jquery';


let translateTimeline = (timelineComponents, val, totWidth) => {
  let value = val;
  let eventsWrapper = timelineComponents.eventsWrapper.get(0);
  value = (value > 0) ? 0 : value; // only negative translate value
  // do not translate more than timeline width
  value = ( !(typeof totWidth === 'undefined') && value < totWidth ) ? totWidth : value;
  setTransformValue(eventsWrapper, 'translateX', value + 'px');

  // update navigation arrows visibility
  if (value === 0 ) {
    timelineComponents.timelineNavigation.find('.prev').addClass('inactive');
  } else {
    timelineComponents.timelineNavigation.find('.prev').removeClass('inactive');
  }
  if (value === totWidth ) {
    timelineComponents.timelineNavigation.find('.next').addClass('inactive');
  } else {
    timelineComponents.timelineNavigation.find('.next').removeClass('inactive');
  }
};


let updateSlide = (timelineComponents, timelineTotWidth, string, eventsMinDistance) => {
  // retrieve translateX value of timelineComponents.eventsWrapper
  let translateValue = getTranslateValue(timelineComponents.eventsWrapper);
  let	wrapperWidth = Number(timelineComponents.timelineWrapper.css('width').replace('px', ''));

  //  translate the timeline to the left('next')/right('prev')
  if (string === 'next') {
    translateTimeline(timelineComponents,
      translateValue - wrapperWidth + eventsMinDistance,
      wrapperWidth - timelineTotWidth);
  } else {
    translateTimeline(timelineComponents, translateValue + wrapperWidth - eventsMinDistance);
  }
};


let updateTimelinePosition = (string, event, timelineComponents) => {
  // translate timeline to the left/right according to the position of the selected event
  let eventStyle = window.getComputedStyle(event.get(0), null);
  let eventLeft = Number(eventStyle.getPropertyValue('left').replace('px', ''));
  let timelineWidth = Number(timelineComponents.timelineWrapper.css('width').replace('px', ''));
  let timelineTotWidth = Number(timelineComponents.eventsWrapper.css('width').replace('px', ''));
  let timelineTranslate = getTranslateValue(timelineComponents.eventsWrapper);

  if ( (string === 'next' && eventLeft > timelineWidth - timelineTranslate) ||
      (string === 'prev' && eventLeft < - timelineTranslate) ) {
    translateTimeline(timelineComponents, - eventLeft + timelineWidth / 2, timelineWidth - timelineTotWidth);
  }
};

let updateFilling = (selectedEvent, filling, totWidth) => {
  // change .filling-line length according to the selected event
  let eventStyle = window.getComputedStyle(selectedEvent.get(0), null);
  let eventLeft = eventStyle.getPropertyValue('left');
  let eventWidth = eventStyle.getPropertyValue('width');
  eventLeft = Number(eventLeft.replace('px', '')) + Number(eventWidth.replace('px', '')) / 2;
  let scaleValue = eventLeft / totWidth;
  setTransformValue(filling.get(0), 'scaleX', scaleValue);
};

let setDatePosition = (timelineComponents, min) => {
  for (let i = 0; i < timelineComponents.timelineDates.length; i++) {
    let distance = daydiff(timelineComponents.timelineDates[0], timelineComponents.timelineDates[i]);
    let distanceNorm = Math.round(distance / timelineComponents.eventsMinLapse) + 2;
    timelineComponents.timelineEvents.eq(i).css('left', distanceNorm * min + 'px');
  }
};

let setTimelineWidth = (timelineComponents, width) => {
  let timeSpan = daydiff(timelineComponents.timelineDates[0],
    timelineComponents.timelineDates[timelineComponents.timelineDates.length-1]);
  let timeSpanNorm = timeSpan/timelineComponents.eventsMinLapse;
  timeSpanNorm = Math.round(timeSpanNorm) + 4;
  let totalWidth = timeSpanNorm * width;
  timelineComponents.eventsWrapper.css('width', totalWidth + 'px');
  updateFilling(timelineComponents.eventsWrapper.find('a.selected'), timelineComponents.fillingLine, totalWidth);
  updateTimelinePosition('next', timelineComponents.eventsWrapper.find('a.selected'), timelineComponents);

  return totalWidth;
};

function updateOlderEvents(event) {
  event.parent('li').prevAll('li').children('a').addClass('older-event').end().end().nextAll('li').children('a').removeClass('older-event');
}

function getTranslateValue(timeline) {
  var timelineStyle = window.getComputedStyle(timeline.get(0), null),
  timelineTranslate = timelineStyle.getPropertyValue("-webkit-transform") ||
  timelineStyle.getPropertyValue("-moz-transform") ||
  timelineStyle.getPropertyValue("-ms-transform") ||
  timelineStyle.getPropertyValue("-o-transform") ||
  timelineStyle.getPropertyValue("transform");

  if( timelineTranslate.indexOf('(') >=0 ) {
    var timelineTranslate = timelineTranslate.split('(')[1];
    timelineTranslate = timelineTranslate.split(')')[0];
    timelineTranslate = timelineTranslate.split(',');
    var translateValue = timelineTranslate[4];
  } else {
    var translateValue = 0;
  }

  return Number(translateValue);
}

function setTransformValue(element, property, value) {
  element.style["-webkit-transform"] = property+"("+value+")";
  element.style["-moz-transform"] = property+"("+value+")";
  element.style["-ms-transform"] = property+"("+value+")";
  element.style["-o-transform"] = property+"("+value+")";
  element.style["transform"] = property+"("+value+")";
}

// based on http:// stackoverflow.com/questions/542938/how-do-i-get-the-number-of-days-between-two-dates-in-javascript
function parseDate(events) {
  var dateArrays = [];
  events.each(function(){
    var singleDate = $(this),
    dateComp = singleDate.data('date').split('T');
    if( dateComp.length > 1 ) { // both DD/MM/YEAR and time are provided
      var dayComp = dateComp[0].split('/'),
      timeComp = dateComp[1].split(':');
    } else if( dateComp[0].indexOf(':') >=0 ) { // only time is provide
    var dayComp = ["2000", "0", "0"],
    timeComp = dateComp[0].split(':');
  } else { // only DD/MM/YEAR
    var dayComp = dateComp[0].split('/'),
    timeComp = ["0", "0"];
  }
  var	newDate = new Date(dayComp[2], dayComp[1]-1, dayComp[0], timeComp[0], timeComp[1]);
  dateArrays.push(newDate);
});
return dateArrays;
}

function daydiff(first, second) {
  return Math.round((second-first));
}

function minLapse(dates) {
  // determine the minimum distance among events
  var dateDistances = [];
  for (let i = 1; i < dates.length; i++) {
    var distance = daydiff(dates[i-1], dates[i]);
    dateDistances.push(distance);
  }
  return Math.min.apply(null, dateDistances);
}

/*
How to tell if a DOM element is visible in the current viewport?
http:// stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
*/
function elementInViewport(el) {
  var top = el.offsetTop;
  var left = el.offsetLeft;
  var width = el.offsetWidth;
  var height = el.offsetHeight;

  while(el.offsetParent) {
    el = el.offsetParent;
    top += el.offsetTop;
    left += el.offsetLeft;
  }

  return (
    top < (window.pageYOffset + window.innerHeight) &&
    left < (window.pageXOffset + window.innerWidth) &&
    (top + height) > window.pageYOffset &&
    (left + width) > window.pageXOffset
  );
}

function initTimeline(timelines, eventsMinDistance) {
  timelines.each(function() {
    let timeline = $(this);
    let timelineComponents = {};
    // cache timeline components
    timelineComponents.timelineWrapper = timeline.find('.events-wrapper');
    timelineComponents.eventsWrapper = timelineComponents.timelineWrapper.children('.events');
    timelineComponents.fillingLine = timelineComponents.eventsWrapper.children('.filling-line');
    timelineComponents.timelineEvents = timelineComponents.eventsWrapper.find('a');
    timelineComponents.timelineDates = parseDate(timelineComponents.timelineEvents);
    timelineComponents.eventsMinLapse = minLapse(timelineComponents.timelineDates);
    timelineComponents.timelineNavigation = timeline.find('.cd-timeline-navigation');
    timelineComponents.eventsContent = timeline.children('.events-content');

    // assign a left postion to the single events along the timeline
    setDatePosition(timelineComponents, eventsMinDistance);
    // assign a width to the timeline
    var timelineTotWidth = setTimelineWidth(timelineComponents, eventsMinDistance);
    // the timeline has been initialize - show it
    timeline.addClass('loaded');

    // detect click on the next arrow
    timelineComponents.timelineNavigation.on('click', '.next', function(event) {
      event.preventDefault();
      updateSlide(timelineComponents, timelineTotWidth, 'next', eventsMinDistance);
    });
    // detect click on the prev arrow
    timelineComponents.timelineNavigation.on('click', '.prev', function(event) {
      event.preventDefault();
      updateSlide(timelineComponents, timelineTotWidth, 'prev', eventsMinDistance);
    });
    // detect click on the a single event - show new event content
    timelineComponents.eventsWrapper.on('click', 'a', function(event) {
      event.preventDefault();
      timelineComponents.timelineEvents.removeClass('selected');
      $(this).addClass('selected');
      updateOlderEvents($(this));
      updateFilling($(this), timelineComponents.fillingLine, timelineTotWidth);
    });
  });
}


/**
* This is the Horizontal Timeline. This component expects an array of dates
* just as strings (e.g. 1/1/1993) and layes them horizontaly on the the screen
* also expects a callback which is activated when that particular index is
* clicked passing that index along
*/
export default class HorizontalTimeline extends React.Component {

  /**
  * This shity method needs to change
  * @return {[type]} [description]
  */
  componentDidMount() {
    let eventsMinDistance = 120;
    let timelines = $('.cd-horizontal-timeline');

    (timelines.length > 0) && initTimeline(timelines, eventsMinDistance);
  }

  /**
  * The expected properties from the parent
  * @type {Object}
  */
  static propTypes = {
    //  array containing the dates
    values: PropTypes.array.isRequired,
    //  function that takes the index of the array as argument
    indexClick: PropTypes.func.isRequired
  };

  render() {
    //  creating an array of list items that have an onClick handler into which
    //  passing the index of the clicked entity.
    let valuesList = this.props.values.map((date, index) => {
      let parsedDate = new Date(date);
      return (
        <li key={ index }
          onClick={ this.props.indexClick.bind(null, index) }>
          <a href='#0'
            className={ index === 0 ? 'selected' : '' }
            data-date={ date }>
            { parsedDate.toDateString() }
          </a>
        </li>
      );
    });

    let buttons = (
      <ul className="cd-timeline-navigation">
        <li>
          <a href="#0" className="prev inactive">
            { '<' }
          </a>
        </li>
        <li>
          <a href="#0" className="next">
            { '>' }
          </a>
        </li>
      </ul>
    );

    let timeline = (
      <div className='cd-horizontal-timeline'>
        <div className="timeline">
          <div className="events-wrapper">
            <div className="events">
              <ol>
                { valuesList }
              </ol>

              <span className="filling-line" aria-hidden="true"></span>
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
