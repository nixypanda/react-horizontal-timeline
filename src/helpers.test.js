/* eslint no-undef: 0 */
import { daydiff, zip, dateDistanceExtremes } from './helpers';


test('difference between same date', () => {
  const now = Date.now();
  expect(daydiff(now, now)).toBe(0);
});


test('day difference between two days', () => {
  const first = new Date('01/01/1993');
  const second = new Date('01/02/1993');
  expect(daydiff(first, second)).toBe(86400000);
});

test('the zip', () => {
  const toZip = [ [ '00', '01', '02' ], [ '10', '11', '12' ] ];
  const result = [ [ '00', '10' ], [ '01', '11' ], [ '02', '12' ] ];

  expect(zip(toZip)).toEqual(result);
  // the initial one remains unchanged
  expect(toZip).toEqual(toZip);
});


test('forall arrays x and y and forall i in natural numbers zip([x, y][i] = [x[i], y[i]])', () => {
  for (let j = 0; j < 10; j += 1) {
    const len = Math.round(Math.random() * 100) + 1;
    // given any two arrays x and y
    const x = [ ...Array(len).keys() ].map(_ => Math.random(_));
    const y = [ ...Array(len).keys() ].map(_ => Math.random(_));
    // the zip of those arrays z
    const z = zip([ x, y ]);

    // has a property that the for all i : z[i] == [x[i], y[i]]
    for (let i = 0; i < len; i += 1) {
      expect(z[i]).toEqual([ x[i], y[i] ]);
    }
  }
});


test('dateDistanceExtremes', () => {
  const dates = [ new Date('2016-01-01'), new Date('2016-01-02'), new Date('2016-01-05') ];
  const singleDay = 86400000;
  const result = {
    min: singleDay,
    max: singleDay * 3
  };

  expect(dateDistanceExtremes(dates)).toEqual(result);
});

