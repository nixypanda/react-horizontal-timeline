import React, { PropTypes } from 'react';
import Radium from 'radium';

import Constants from '../Constants';

/**
 * THe static/non-static styles Information for a single event dot on the timeline
 * @param {object} styles User passed styles ( foreground, background etc info
 * @return {object} A multilevel style object containing the following information
 *   links: THe style information for the clickable dates that apper floating over the timeline
 *   base: The base style information for the event dot that appers exactly on the timeline
 *   none: The style information for the future dot (wrt selected).
 *   older: The styles information for the past dot (wrt selected)
 *   selected: The styles information for the preset dot
 */
const dots = (styles) => ({
  links: {
    position: 'absolute',
    bottom: 0,
    zIndex: 2,
    textAlign: 'center',
    fontSize: '1.3rem',
    paddingBottom: 15,
    color: '#383838'
  },
  base: {
    position: 'absolute',
    bottom: -5,
    height: 12,
    width: 12,
    borderRadius: '50%',
    zIndex: 2
  },
  none: {
    backgroundColor: styles.background,
    // border: `2px solid ${styles.background}`,
    border: `2px solid ${styles.outline}`
  },
  older: {
    backgroundColor: styles.background,
    border: `2px solid ${styles.foreground}`
  },
  selected: {
    backgroundColor: styles.foreground,
    borderColor: styles.foreground
  }
});

/**
 * The markup for one single dot on the timeline (A SEPERATE FILE FOR A DOT!!!!!!!!)
 * let me emphasie it again A FUCKING SEPTERATE FILE FOR A SHIT LITTLE TINY FUCKING DOT!!!!!!!!!!!
 *
 * @param {object} props The props passed down
 * @return {StatelessFunctionalReactComponent} The markup for a dot
 */
const TimelineDot = (props) => (
  <li key={ props.index } >
    <a
      className='text-center'
      onClick={ props.onClick.bind(null, props.index) }
      style={[
        dots(props.styles).links,
        { left: props.distanceFromOrigin, cursor: 'pointer', width: Constants.DATE_WIDTH }
      ]} >
      { props.eventDate.toDateString().substring(4) }
    </a>
    <span style={[
      dots(props.index).base,
      { left: props.distanceFromOrigin + (Constants.DATE_WIDTH - 2) / 2 },
      (props.selected < props.index) && dots(props.styles).none,
      (props.selected > props.index) && dots(props.styles).older,
      (props.selected === props.index) && dots(props.styles).selected
    ]}>
    </span>
  </li>
);

/**
 * propTypes
 * @type {Object}
 */
TimelineDot.propTypes = {
  // The index of the currently selected dot (required to style as old, present, or future event)
  selected: PropTypes.number.isRequired,
  // The index of the present event (used as key and for deciding the styles alongside selected)
  index: PropTypes.number.isRequired,
  // The onClick handler ( in this case to trigger the fillingMotion of the timeline )
  onClick: PropTypes.func.isRequired,
  // The date of the event (required to display it)
  eventDate: PropTypes.object.isRequired,
  // The numerical value in pixels of the distance from the origin
  distanceFromOrigin: PropTypes.number.isRequired,
  // The styles prefrences of the user
  styles: PropTypes.object.isRequired
};

export default Radium(TimelineDot);

