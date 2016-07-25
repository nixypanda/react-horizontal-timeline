import React, { PropTypes } from 'react';
import { Motion, spring } from 'react-motion';


/**
 * The markup Information for an element that produces the filling bar between events
 * whenever any event other than the present one is clicked/touched.
 *
 * @param  {object} props The props from parent mainly styles
 * @return {StatelessFunctionalReactComponent} Markup Information for the filling bar.
 */
const FillingLine = ({ filledValue, fillingMotion, styles }) => (
  <Motion style={{
    tX: spring(filledValue, fillingMotion)
  }}>{({tX}) =>
    <span
      aria-hidden='true'
      className='filling-line'
      style={{
        position: 'absolute',
        zIndex: 1,
        left: 0,
        top: 0,
        height: '100%',
        width: '100%',
        transformOrigin: 'left center',
        backgroundColor: styles.foreground,
        WebkitTransform: `scaleX(${tX})`,
        transform: `scaleX(${tX})`
      }}
    />
    }</Motion>
);


FillingLine.propTypes = {
  // location from the left
  filledValue: PropTypes.number,
  // how the filling motion will look like when in action
  fillingMotion: PropTypes.shape({
    stiffness: PropTypes.number,
    damping: PropTypes.number,
  }),
  styles: PropTypes.object,
}


export default FillingLine;

