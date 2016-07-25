import React, { PropTypes } from 'react';

import { cummulativeSeperation } from '../helpers';
import TimelineDot from './TimelineDot';


/**
 * The markup Information for all the events on the horizontal timeline. 
 *
 * @param  {object} props The props from parent mainly styles
 * @return {StatelessFunctionalReactComponent} Markup Information for the fader
 */
const EventsBar = ({ events, selectedIndex, styles, handleDateClick }) => (
  <ol
    className='events-bar'
    style={{
      listStyle: 'none'
    }}
  >
    {events.map((event, index) =>
      <TimelineDot
        distanceFromOrigin={event.distance}
        label={event.label}
        index={index}
        key={index}
        onClick={handleDateClick}
        selected={selectedIndex}
        styles={styles}
      />
    )}
  </ol>
);


/**
 * The styles that parent will provide
 * @type {Object}
 */
EventsBar.PropTypes = {
  //  array containing the events
  events: PropTypes.arrayOf(PropTypes.shape({
    distance: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
  })).isRequired,
  selectedIndex: PropTypes.number,
  styles: PropTypes.object,
  handleDateClick: PropTypes.func,
}


export default EventsBar;

