/**
 * Exporting some constants used in the files
 * return {object}
 */
module.exports = {
  // Left and right are used to control the direciton in which we want to translate our
  // timeline
  LEFT: 'left',
  RIGHT: 'right',

  // The keycodes of all the arrow keys (used for keyboard navigation)
  LEFT_KEY: 37,
  RIGHT_KEY: 39,
  UP_KEY: 38,
  DOWN_KEY: 40,

  // Milliseconds in a given day (required to set the minimum seperation on events)
  DAY: 86400000,
  // Total length of the timeline in pixels
  MIN_TIMELINE_WIDTH: 750,
  // Minimum padding between two event labels
  MIN_EVENT_PADDING: 20,
  // Maximum padding between two event labels
  MAX_EVENT_PADDING: 120,
  // width of the area for text in the timeline
  DATE_WIDTH: 85,
  // Padding at end of timeline
  TIMELINE_PADDING: 100,

  // which events to trigger based on the left or the right arrow key on the keyboard is pressed
  KEYMAP: {
    37: 'left',
    39: 'right'
  }
};
