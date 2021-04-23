import {assertEquals} from 'https://deno.land/std@0.94.0/testing/asserts.ts';
import {theLift} from './theLift.ts';


function assertArrayEquality(expected: number[], actual: number[]) {
  assertEquals(expected, actual);
}

Deno.test('up', () => {
  const queues = [[], [], [5, 5, 5], [], [], [], [],];
  const result = theLift(queues, 5);
  assertArrayEquality(result, [0, 2, 5, 0]);
});

Deno.test('down', () => {
  const queues = [[], [], [1, 1], [], [], [], [],];
  const result = theLift(queues, 5);
  assertArrayEquality(result, [0, 2, 1, 0]);
});

Deno.test('up and up', () => {
  const queues = [[], [3], [4], [], [5], [], [],];
  const result = theLift(queues, 5);
  assertArrayEquality(result, [0, 1, 2, 3, 4, 5, 0]);
});

Deno.test('down and down', () => {
  const queues = [[], [0], [], [], [2], [3], [],];
  const result = theLift(queues, 5);
  assertArrayEquality(result, [0, 5, 4, 3, 2, 1, 0]);
});


Deno.test('down and down with limited', () => {
  const queues = [[], [0], [], [], [2, 2], [3], [],];
  const result = theLift(queues, 2);
  assertArrayEquality(result, [0, 5, 4, 3, 2, 1, 0, 4, 2, 0]);
});

Deno.test('enter on ground floor', () => {
  const queues = [[1, 2, 3, 4], [], [], [], [], [], [],];
  const result = theLift(queues, 5);
  assertArrayEquality(result, [0, 1, 2, 3, 4, 0]);
});

Deno.test('lift full (up)', () => {
  const queues = [[], [], [], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [], [], []];
  const result = theLift(queues, 5);
  assertArrayEquality(result, [0, 3, 1, 3, 1, 3, 1, 0]);
});

Deno.test('lift full (down)', () => {
  const queues = [[3, 3, 3, 3, 3, 3], [], [], [], [], [], []];
  const result = theLift(queues, 5);
  assertArrayEquality(result, [0, 3, 0, 3, 0]);
});

Deno.test('lift full (up and down)', () => {
  const queues = [[3, 3, 3, 3, 3, 3], [], [], [], [], [4, 4, 4, 4, 4, 4], []];
  const result = theLift(queues, 5);
  assertArrayEquality(result, [0, 3, 5, 4, 0, 3, 5, 4, 0]);
});
Deno.test('tricky queues', () => {
  const queues = [ [], [ 0, 0, 0, 6 ], [], [], [], [ 6, 6, 0, 0, 0, 6 ], [] ];
  const result = theLift(queues, 5);
  assertArrayEquality(result, [0, 1, 5, 6, 5, 1, 0, 1, 0]);
});
Deno.test('highlander', () => {
  const queues = [ [], [ 2 ], [ 3, 3, 3 ], [ 1 ], [], [], [] ];
  const result = theLift(queues, 1);
  assertArrayEquality(result, [0, 1, 2, 3, 1, 2, 3, 2, 3, 0]);
});
Deno.test('mytest1', () => {
  const queues = [[1, 2, 3], [2, 4], [3, 4, 5], [], [], [], [1],];
  const result = theLift(queues, 3);
  assertArrayEquality(result, [0, 1, 2, 3, 4, 6, 1, 2, 4, 5, 0]);
});
Deno.test('mytest2', () => {
  const queues = [[1, 2, 3], [2, 4], [3, 4, 5], [], [], [], [1],];
  const result = theLift(queues, 3);
  assertArrayEquality(result, [0, 1, 2, 3, 4, 6, 1, 2, 4, 5, 0]);
});