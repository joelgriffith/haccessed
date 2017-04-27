const haccessed = require('./index');

describe('haccessed', () => {
  it('log properties that were accessed', () => {
    const original = { id: 123 };
    const hijacked = haccessed(original);

    hijacked.id;

    expect(hijacked.__print__()).toEqual({
      id: 123,
    });
  });

  it('should not log properties that were not accessed', () => {
    const original = { id: 123 };
    const hijacked = haccessed(original);

    expect(hijacked.__print__()).toEqual({});
  });

  it('should log properties that were re-written', () => {
    const original = { id: 123 };
    const hijacked = haccessed(original);

    hijacked.id = 456;

    expect(hijacked.__print__()).toEqual({
      id: 456
    });
  });

  it('should log properties that were accessed and re-written', () => {
    const original = { name: { first: 'joel' } };
    const hijacked = haccessed(original);

    hijacked.name.first;
    hijacked.name = { last: 'griffith' };

    expect(hijacked.__print__()).toEqual({
      name: {
        first: 'joel'
      }
    });
  });

  it('should log deep properties that were re-written', () => {
    const original = { name: { first: 'joel' } };
    const hijacked = haccessed(original);

    hijacked.name = { last: 'griffith' };

    expect(hijacked.__print__()).toEqual({
      name: { last: 'griffith' }
    });
  });

  it('should log accesses to values that are arrays', () => {
    const original = { array: [1,2,3] };
    const hijacked = haccessed(original);

    hijacked.array;

    expect(hijacked.__print__()).toEqual({
      array: [],
    });
  });

  it('should log accesses to values that are functions', () => {
    function funguy(){}

    const original = { funguy: funguy };
    const hijacked = haccessed(original);

    hijacked.funguy();

    expect(hijacked.__print__()).toEqual({
      funguy: funguy,
    });
  });

  it('should log accesses to nested properties', () => {
    const original = { id: 123, person: { name: 'joel' } };
    const hijacked = haccessed(original);

    hijacked.person.name;

    expect(hijacked.__print__()).toEqual({
      person: {
        name: 'joel'
      }
    });
  });

  it('should log accesses to multiple nested properties', () => {
    const original = { id: 123, person: { first: 'joel', last: 'griffith' } };
    const hijacked = haccessed(original);

    hijacked.person.first;
    hijacked.person.last;

    expect(hijacked.__print__()).toEqual({
      person: {
        first: 'joel',
        last: 'griffith'
      }
    });
  });

  it('should log accesses to object properties in an array', () => {
    const original = { records: [{ id: 1 }, { id: 2 }] };
    const hijacked = haccessed(original);

    hijacked.records[0].id;

    expect(hijacked.__print__()).toEqual({
      records: [{ id: 1 }]
    });
  });

  it('should log accesses to multi-dimensional arrays', () => {
    const board = [
      ['o', 'o', 'x'],
      ['o', 'x', 'o'],
      ['x', 'o', 'o']
    ];
    const original = { currentBoard: board };
    const hijacked = haccessed(original);

    hijacked.currentBoard[0][2];

    expect(hijacked.__print__()).toEqual({
      currentBoard: [[undefined, undefined, 'x']]
    });
  });

  it('should handle complex big \'ol objects and their lookups', () => {
    function callMeMaybe() {}
    const theBigOne = {
      id: 1,
      callMe: callMeMaybe,
      person: {
        name: 'Joel',
        last: 'Griffith',
        location: {
          state: 'WA',
          zip: '55555'
        },
      },
      friends: [], // :(
    };

    const hijacked = haccessed(theBigOne);

    hijacked.callMe();
    hijacked.id;
    hijacked.person.location.zip;

    expect(hijacked.__print__()).toEqual({
      callMe: callMeMaybe,
      id: 1,
      person: {
        location: {
          zip: '55555',
        },
      },
    });
  });
});
