import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';

import Color from 'color';

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
const faderStyle = {
  base: {
    top: '50%',
    position: 'absolute',
    bottom: 'auto',
    transform: 'translateY(-50%)',
    height: '100%',
    width: 20,
    overflow: 'hidden',
  },
  specific: (styles, position, gradientDirection) => ({
    [position]: 40,
    backgroundImage: `linear-gradient(to ${gradientDirection}, ${styles.background}, ${Color(styles.background).alpha(0).rgb()})`
  })
};


/**
 * The markup Information for an element that produces the fade effect at the end of the timeline
 *
 * @param  {object} props The props from parent mainly styles
 * @return {StatelessFunctionalReactComponent} Markup Information for the fader
 */
const Faders = (props) => (
  <ul style={{ listStyle: 'none' }}>
    <li style={[ faderStyle.base, faderStyle.specific(props.styles, LEFT, RIGHT) ]} />
    <li style={[ faderStyle.base, faderStyle.specific(props.styles, RIGHT, LEFT) ]} />
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
    outline: PropTypes.string.isRequired
  })
};


export default Radium(Faders);
