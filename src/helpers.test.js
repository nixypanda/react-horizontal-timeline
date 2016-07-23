import test from 'ava';
import { daydiff, zip, minDistanceEvents } from './helpers';

test('difference bwtween same date', t => {
  const now = Date.now();
  t.is(daydiff(now, now), 0, 'same date no difference')
});

test('day difference bwtween two days', t => {
  const first = new Date('01/01/1993');
  const second = new Date('01/02/1993');
  t.is(daydiff(first, second), 86400000);
});

test('the zip', t => {
  const toZip = [['00', '01', '02'], ['10', '11', '12']];
  const result = [["00", "10"], ["01", "11"], ["02", "12"]]

  t.deepEqual(zip(toZip), result);
  // the initial one remains unchanged
  t.deepEqual(toZip, toZip);
});


test('forall arrays x and y and forall i in natural numbers zip([x, y][i] = [x[i], y[i]])', t => {
  for (let _ of [ ...Array(10).keys() ]) {
    const len = Math.round(Math.random() * 100) + 1;
    // given any two arrays x and y
    const x = [ ...Array(len).keys() ].map(_ => Math.random());
    const y = [ ...Array(len).keys() ].map(_ => Math.random());
    // the zip of those arrays z
    const z = zip([x, y]);
    
    // has a property that the for all i : z[i] == [x[i], y[i]]
    for (let i = 0; i < len; i++) {
      t.deepEqual(z[i], [x[i], y[i]]) 
    }
  }
});


test('forall date array the minDistanceEvents(array) >= the seperation provided', t => {
  for (let _ of [ ...Array(10).keys() ]) {
    const customSeperation = 86400000;
    const len = Math.round(Math.random() * 10) + 1;
    let x = [ ...Array(len).keys() ].map(_ => Math.round(Math.random() * 100000000));
    x.sort();

    t.truthy(minDistanceEvents(x, customSeperation) >= customSeperation);
  }
});

