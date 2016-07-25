import React, {PropTypes} from 'react';

import {cummulativeSeperation} from '../helpers';
import TimelineDot from './TimelineDot';

const EventsBar = ({events, minDistance, minSeperation, maxSeperation, selectedIndex, styles, handleDateClick}) => {
  return (
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
}

EventsBar.PropTypes = {
  //  array containing the events
  events: PropTypes.arrayOf(PropTypes.shape({
      distance: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired,
  })).isRequired,
  minDistance: PropTypes.number.isRequired,
  minSeperation: PropTypes.number.isRequired,
  maxSeperation: PropTypes.number.isRequired,
  selectedIndex: PropTypes.number,
  styles: PropTypes.object,
  handleDateClick: PropTypes.func,
}

export default EventsBar;
