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
 * link: styles defined for the link elements i.e. the href tag.
 * icon: styles defined for the icon that appears on the button.
 * inactive: styles defined for when the icons are inactive.
 *
 * @type {Object}
 */
const styles = {
  link: {
    position: 'absolute',
    zIndex: 1,
    top: '50%',
    bottom: 'auto',
    transform: 'translateY(-50%)',
    height: 34,
    width: 34,
    borderRadius: '50%',
    border: '2px solid #dfdfdf',
    overflow: 'hidden',
    textIndent: '100%',
    whiteSpace: 'nowrap'
  },
  icon: {
    position: 'absolute',
    zIndex: 2,
    top: '50%',
    bottom: 'auto',
    transform: 'translateY(-50%)',
    height: 20,
    width: 29
  },
  inactive: {
    color: '#dfdfdf',
    cursor: 'not-allowed'
  }
};

/**
 * The markup for a single button. Expects a on click handler to be passed (which in our case will
 * trigger the translation of the timeline either towards left or right).
 *
 * @param  { object } props [description]
 * @return { StatelessFunctionalReactComponent }       [ The markup info for a single button ]
 */
let Button = (props) => (
  <li onClick={ props.onClick.bind(null, props.side)}>
    <a
      key={props.side}
      style={[
        styles.link,
        { ':hover': { border: `2px solid ${props.styles.foreground}` }, [props.side]: 0 },
        props.statusStyles
      ]}>
      { props.icon }
    </a>
  </li>
);

// Expected propteries from the parent
Button.propTypes = {
  // only two types of button can be there left and right
  side: PropTypes.oneOf([ Constants.LEFT, Constants.RIGHT ]),
  // The icon that we need to show on the button
  icon: PropTypes.object.isRequired,
  // The user passed styles (has fields like foreground, background color etc.)
  styles: PropTypes.object,
  // What to do when the given button is clicked (in this case translate timeline)
  onClick: PropTypes.func.isRequired,
  // button styles we should apply based on the status (i.e. active or inactive)
  statusStyles: PropTypes.shape({
    color: PropTypes.string.isRequired,
    cursor: PropTypes.oneOf([ 'pointer', 'not-allowed' ])
  })
};

// Wrapping the button with Radium (so we get all the styling goodness)
Button = Radium(Button);

/**
 * Markup for both the buttons
 *
 * @param  { object } props [ The info provided by the parent ]
 * @return { StatelessFunctionalReactComponent }       [ The Markup info for both the buttons ]
 */
const HorizontalTimelineButtons = (props) => (
  <ul style={{ listStyle: 'none' }} >
    <Button
      icon={<FaAngleLeft style={ styles.icon } />}
      onClick={props.updateSlide}
      side={Constants.LEFT}
      statusStyles={props.position === 0 ? styles.inactive : { color: props.styles.foreground, cursor: 'pointer' } }
      styles={props.styles}
    />
    <Button
      icon={<FaAngleRight style={ styles.icon } />}
      onClick={props.updateSlide}
      side={Constants.RIGHT}
      statusStyles={props.position === props.maxPosition ? styles.inactive : {
        color: props.styles.foreground, cursor: 'pointer'
      } }
      styles={props.styles}
    />
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
  // The maximum position that the timeline component can acuire
  maxPosition: PropTypes.number.isRequired
};

// Wrapping the buttons with Radium (so we get all the styling goodness)
export default Radium(HorizontalTimelineButtons);
