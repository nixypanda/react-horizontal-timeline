/**
 * This file contains some helper functions which are stateless (provide a pure interface)
 * and are used by the timeline component.
 */


/**
 * Differance between two dates
 *
 * @param  {Date} first Date of the first event
 * @param  {Date} second Date of the second event
 * @return {number} Differance between the two dates
 */
export const daydiff = (first, second) => Math.round((second - first));


/**
 * Takes a list of lists and zips them together (size should be the same).
 *
 * e.g. zip([['row0col0', 'row0col1', 'row0col2'], ['row1col0', 'row1col1', 'row1col2']]);
 * = [["row0col0","row1col0"], ["row0col1","row1col1"], ["row0col2","row1col2"]]
 */
export const zip = rows => rows[0].map((_, c) => rows.map(row => row[c]));


/**
 * Determines the minimum distance between events
 * @param {array} dates the array containing all the dates
 * @return {number} the minimum distance between events
 */
export const minDistanceEvents = (dates, seperation) => {
  // determine the minimum distance among events
  const datePairs = zip([dates.slice(0, -1), dates.slice(1)]);
  const dateDistances = datePairs.map(([x, y]) => daydiff(x, y))

  // return the minimum distance between two dates but considering that all dates
  // are the same then return the provided minimum seperation. 
  return Math.max(Math.min.apply(null, dateDistances), seperation);
};


/**
 * Given dates and some bounds returns an array of positioning information w.r.t. some origin for
 * that set of dates.
 *
 * @param {dates} the array containing dates the dates
 * @param {maxSeperation} upper bound on the seperation of dates irrespective of how far they are.
 * @param {minDistance} lower bound on the seperation of dates irrespective of how close they are.
 * @return {array} positioning information for dates from a given origin point
 */
// the interface for this function is pure
export const cummulativeSeperation = (dates, minDistance, minSeperation, maxSeperation) => {
  // Calculating the minimum seperation between events
  const eventsMinLapse = minDistanceEvents(dates, minSeperation);

  // using dynamic programming to set up the distance from the origin of the timeline.
  const distances = new Array(dates.length);
  distances[0] = minDistance;

  for (let index = 1; index < distances.length; index += 1) {
    const distance = daydiff(dates[index - 1], dates[index]);
    // NOTE: for now just setting a hard limit on the value of normalised distanceNorm
    // i.e. distances will grow linearly and reach a max point then stop to increase
    // an elegent mathametical calculation opertunity here.
    const distanceFromPrevious = Math.min(
      Math.round(distance / eventsMinLapse) + 1, maxSeperation
    );
    // the distance_from_origin(n) = distance_from_origin(n-1) + distance between n and n - 1.
    distances[index] = distances[index - 1] + distanceFromPrevious * minDistance;
  }
  return distances;
};

