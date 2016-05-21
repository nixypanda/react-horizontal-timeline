import React, { PropTypes } from 'react';
import Radium from 'radium';

const LEFT = 'left';
const RIGHT = 'right';

/**
 * Returns the styles that generate a fading effect on the edges of the timeline
 *
 * @param  {object} styles The styles (user-definded/default).Mainly Information about the background, foreground, etc.
 * @param  {string} position The position of the fader. Can only be left or right
 * @param  {string} gradientDirection The direction in which we want to generate fade effect
 * @return {object} The styleing Information for the left or right fader
 */
const faderStyle = (styles, position, gradientDirection) => ({
  zIndex: 2,
  top: '50%',
  position: 'absolute',
  bottom: 'auto',
  transform: 'translateY(-50%)',
  height: '100%',
  width: 20,
  overflow: 'hidden',
  [position]: 40,
  backgroundImage: `linear-gradient(to ${gradientDirection}, ${styles.background}, rgba(248, 248, 248, 0))`
});

/**
 * The markup Information for an element that produces the fade effect at the end of the timeline
 *
 * @param  {object} props The props from parent mainly styles
 * @return {StatelessFunctionalReactComponent} Markup Information for the fader
 */
const Faders = (props) => (
  <ul style={{ listStyle: 'none' }}>
    <li style={faderStyle(props.styles, LEFT, RIGHT)} />
    <li style={faderStyle(props.styles, RIGHT, LEFT)} />
  </ul>
);

/**
 * The styles that parent will provide
 * @type {Object}
 */
Faders.propTypes = {
  styles: PropTypes.shape({
    foreground: PropTypes.string.isRequired,
    background: PropTypes.string.isRequired,
    outline: PropTypes.string.isRequired,
    maxSize: PropTypes.number.isRequired
  })
};

export default Radium(Faders);
