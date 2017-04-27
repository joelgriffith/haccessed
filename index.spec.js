const hackregator = require('./index');

describe('hackregator', () => {
  it('log properties that were accessed', () => {
    const original = { id: 123 };
    const hijacked = hackregator(original);

    hijacked.id;

    expect(hijacked.__print__()).toEqual({
      id: 123,
    });
  });

  it('should not log properties that were not accessed', () => {
    const original = { id: 123 };
    const hijacked = hackregator(original);

    expect(hijacked.__print__()).toEqual({});
  });

  it('should log accesses to values that are not scalar', () => {
    const original = { array: [1,2,3] };
    const hijacked = hackregator(original);

    hijacked.array;

    expect(hijacked.__print__()).toEqual({
      array: [1,2,3],
    });
  });

  it('should log accesses to values that are functions', () => {
    function funguy(){}

    const original = { funguy: funguy };
    const hijacked = hackregator(original);

    hijacked.funguy();

    expect(hijacked.__print__()).toEqual({
      funguy: funguy,
    });
  });

  it('should not log accesses to values that are functions but not called', () => {
    function funguy(){}

    const original = { funguy: funguy };
    const hijacked = hackregator(original);

    expect(hijacked.__print__()).toEqual({});
  });

  it('should log accesses to nested properties', () => {
    const original = { id: 123, person: { name: 'joel' } };
    const hijacked = hackregator(original);

    hijacked.person.name;

    expect(hijacked.__print__()).toEqual({
      person: {
        name: 'joel'
      }
    });
  });

  it('should log accesses to object properties in an array', () => {
    const original = { records: [{ id: 1 }, { id: 2 }] };
    const hijacked = hackregator(original);

    hijacked.records[0].id;

    expect(hijacked.__print__()).toEqual({
      records: [{ id: 1 }, {}]
    });
  });

  it('should log accesses to multi-dimensional arrays', () => {
    const board = [
      ['o', 'o', 'x'],
      ['o', 'x', 'o'],
      ['x', 'o', 'o']
    ];
    const original = { currentBoard: board };
    const hijacked = hackregator(original);

    hijacked.currentBoard[0][2];

    expect(hijacked.__print__()).toEqual({
      currentBoard: [['o', 'o', 'x']]
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

    const hijacked = hackregator(theBigOne);

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
