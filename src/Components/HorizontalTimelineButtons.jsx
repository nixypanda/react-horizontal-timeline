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
const buttonStyles = {
  link: ({ outline }) => ({
    position: 'absolute',
    zIndex: 1,
    top: '50%',
    bottom: 'auto',
    transform: 'translateY(-50%)',
    height: 34,
    width: 34,
    borderRadius: '50%',
    border: `2px solid ${outline}`,
    overflow: 'hidden',
    textIndent: '100%',
    whiteSpace: 'nowrap'
  }),
  icon: (styles, active) => ({
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
  }),
  inactive: (styles) => ({
    color: styles.outline,
    cursor: 'not-allowed',
    ':hover': {
      border: `2px solid ${styles.outline}`
    }
  }),
  active: (styles) => ({
    cursor: 'pointer',
    ':hover': {
      border: `2px solid ${styles.foreground}`,
      color: styles.foreground
    }
  })
};

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
      onClick={props.updateSlide.bind(null, Constants.LEFT)}
      style={[
        buttonStyles.link(props.styles),
        props.position === 0 ? buttonStyles.inactive(props.styles) : buttonStyles.active(props.styles),
        { [Constants.LEFT]: 0 }
      ]}
    >
      <FaAngleLeft style={buttonStyles.icon(props.styles, !(props.position === 0))} />
    </li>
    <li
      key={Constants.RIGHT}
      onClick={props.updateSlide.bind(null, Constants.RIGHT)}
      style={[
        buttonStyles.link(props.styles),
        { [Constants.RIGHT]: 0 },
        props.position === props.maxPosition ? buttonStyles.inactive(props.styles) : buttonStyles.active(props.styles)
      ]}
    >
      <FaAngleRight style={buttonStyles.icon(props.styles, !(props.position === props.maxPosition))} />
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

