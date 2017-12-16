import React from 'react';
import PropTypes from 'prop-types';
import { Motion, spring } from 'react-motion';


/**
 * The markup Information for an event Line. You can stack multiple lines on top of eachother
 *
 * @param  {object} props The props from parent, styling and positioning
 * @return {StatelessFunctionalReactComponent} Markup Information for the event line.
 */
const EventLine = ({left, width, fillingMotion, backgroundColor}) => (
  <Motion style={{
    tWidth: spring(width, fillingMotion),
    tLeft: spring(left, fillingMotion),
  }}>{({tWidth, tLeft}) =>
    <span
      aria-hidden='true'
      className='timeline-eventline'
      style={{
        position: 'absolute',
        left: `${tLeft}px`,
        top: 0,
        height: '100%',
        width: `${tWidth}px`,
        transformOrigin: 'left center',
        backgroundColor
      }}
    />
    }</Motion>
);


EventLine.propTypes = {
  // Location and dimension
  left: PropTypes.number,
  width: PropTypes.number,
  // how the filling motion will look like when in action
  fillingMotion: PropTypes.shape({
    stiffness: PropTypes.number,
    damping: PropTypes.number,
  }),
  // What color the line should have
  backgroundColor: PropTypes.string,
}


export default EventLine;
