import React, {PropTypes} from 'react';
import {Motion, spring} from 'react-motion';

const FillingLine = ({filledValue, fillingMotion, styles}) =>
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
  }</Motion>;

FillingLine.propTypes = {
  filledValue: PropTypes.number,
  fillingMotion: PropTypes.object,
  styles: PropTypes.object,
}

export default FillingLine;
