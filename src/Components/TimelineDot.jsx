import React, { PropTypes } from 'react';
import Radium from 'radium';

import Constants from '../Constants';

/**
 * The static/non-static styles Information for a single event dot on the timeline
 */
const dots = {
  /**
   * The style information for the clickable dates that apper floating over the timeline
   */
  links: {
    position: 'absolute',
    bottom: 0,
    zIndex: 2,
    textAlign: 'center',
    fontSize: '1.3rem',
    paddingBottom: 15,
    color: '#383838'
  },
  /**
   * The base style information for the event dot that appers exactly on the timeline
   */
  base: {
    position: 'absolute',
    bottom: -5,
    height: 12,
    width: 12,
    borderRadius: '50%',
    zIndex: 2
  },
  /**
   * The style information for the future dot (wrt selected).
   * @param {object} styles User passed styles ( foreground, background etc info
   */
  none: (styles) => ({
    backgroundColor: styles.background,
    // border: `2px solid ${styles.background}`,
    border: `2px solid ${styles.outline}`
  }),
  /**
   * older: The styles information for the past dot (wrt selected)
   * @param {object} styles User passed styles ( foreground, background etc info
   */
  older: (styles) => ({
    backgroundColor: styles.background,
    border: `2px solid ${styles.foreground}`
  }),
  /**
   * selected: The styles information for the preset dot
   * @param {object} styles User passed styles ( foreground, background etc info
   */
  selected: (styles) => ({
    backgroundColor: styles.foreground,
    borderColor: styles.foreground
  })
};

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
        dots.links,
        { left: props.distanceFromOrigin, cursor: 'pointer', width: Constants.DATE_WIDTH }
      ]} >
      { props.eventDate.toDateString().substring(4) }
    </a>
    <span style={[
      dots.base,
      { left: props.distanceFromOrigin + (Constants.DATE_WIDTH - 2) / 2 },
      (props.selected < props.index) && dots.none(props.styles),
      (props.selected > props.index) && dots.older(props.styles),
      (props.selected === props.index) && dots.selected(props.styles)
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

