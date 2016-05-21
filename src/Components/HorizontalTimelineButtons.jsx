import React, { PropTypes } from 'react';
import Radium from 'radium';
import Constants from '../Constants';

// icons
import FaAngleLeft from 'react-icons/lib/fa/angle-left';
import FaAngleRight from 'react-icons/lib/fa/angle-right';

// this handles the rendering part of the buttons that appear on either side of
// the timeline.

/**
 * These are the static styles for the buttons on either side of the timeline.
 *
 * @param {styles} styles The user-definded styles/the default styles
 * @param {boolean} active Hacky crap to get svg filling color right
 * @return {object} An object containing styles for the buttons
 * link: styles defined for the link elements i.e. the href tag.
 * icon: styles defined for the icon that appears on the button.
 * inactive: styles defined for when the icons are inactive.
 */
const buttonStyles = (styles, active) => ({
  link: {
    position: 'absolute',
    zIndex: 1,
    top: '50%',
    bottom: 'auto',
    transform: 'translateY(-50%)',
    height: 34,
    width: 34,
    borderRadius: '50%',
    border: `2px solid ${styles.outline}`,
    overflow: 'hidden',
    textIndent: '100%',
    whiteSpace: 'nowrap'
  },
  icon: {
    position: 'absolute',
    left: 0,
    zIndex: 3,
    top: '50%',
    bottom: 'auto',
    transform: 'translateY(-50%)',
    height: 20,
    width: 29,
    overflow: 'hidden',
    textIndent: '100%',
    whiteSpace: 'nowrap',
    fill: active ? styles.foreground : styles.outline
  },
  inactive: {
    color: styles.outline,
    cursor: 'not-allowed',
    ':hover': {
      border: `2px solid ${styles.outline}`
    }
  },
  active: {
    cursor: 'pointer',
    ':hover': {
      border: `2px solid ${styles.foreground}`,
      color: styles.foreground
    }
  }
});

/**
 * Markup for both the buttons
 *
 * @param  {object} props The info provided by the parent
 * @return {StatelessFunctionalReactComponent} The Markup info for both the buttons
 */
const HorizontalTimelineButtons = (props) => (
  <ul >
    <li
      key={Constants.LEFT}
      onClick={ props.updateSlide.bind(null, Constants.LEFT)}
      style={[
        buttonStyles(props.styles).link,
        props.position === 0 ? buttonStyles(props.styles).inactive : buttonStyles(props.styles).active,
        { [Constants.LEFT]: 0 }
      ]}
    >
      <FaAngleLeft style={buttonStyles(props.styles, !(props.position === 0)).icon} />
    </li>
    <li
      key={Constants.RIGHT}
      onClick={ props.updateSlide.bind(null, Constants.RIGHT)}
      style={[
        buttonStyles(props.styles).link,
        { [Constants.RIGHT]: 0 },
        props.position === props.maxPosition ? buttonStyles(props.styles).inactive : buttonStyles(props.styles).active
      ]}
    >
      <FaAngleRight style={buttonStyles(props.styles, !(props.position === props.maxPosition)).icon} />
    </li>
  </ul>
);

// Expected propteries
HorizontalTimelineButtons.propTypes = {
  // The function to update the slide
  updateSlide: PropTypes.func.isRequired,
  // Information about what portion of the timeline is visible between buttons
  position: PropTypes.number.isRequired,
  // The user passed styles (has fields like foreground, background color etc.)
  styles: PropTypes.object,
  // The maximum position that the timeline component can acuire, (on initial load will be null)
  maxPosition: PropTypes.number
};

// Wrapping the buttons with Radium (so we get all the styling goodness)
export default Radium(HorizontalTimelineButtons);
