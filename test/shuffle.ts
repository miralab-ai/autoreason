import test from 'ava';
import { shuffleArray } from '../src/utils/shuffle.js';

const range = (length: number) => Array.from({ length }, (_, index) => index);

test('shuffleArray keeps every element', (t) => {
  const shuffled = range(50);
  shuffleArray(shuffled);
  t.deepEqual(
    [...shuffled].sort((a, b) => a - b),
    range(50),
  );
});

test('shuffleArray changes the order', (t) => {
  const shuffled = range(50);
  shuffleArray(shuffled);
  t.notDeepEqual(shuffled, range(50));
});
