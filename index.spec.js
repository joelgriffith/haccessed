var haccessed = require('./index');

describe('haccessed', function() {
  describe('#__accessed__', function() {
    it('log properties that were accessed', function() {
      var original = { id: 123 };
      var hijacked = haccessed(original);

      hijacked.id;

      expect(hijacked.__accessed__).toEqual({
        id: 123
      });
    });

    it('should not log objects that were not accessed', function() {
      var original = { id: 123, location: { state: 'wa', zip: '55555' } };
      var hijacked = haccessed(original);

      hijacked.id;

      expect(hijacked.__accessed__).toEqual({
        id: 123
      });
    });

    it('should not log properties that were not accessed', function() {
      var original = { id: 123 };
      var hijacked = haccessed(original);

      expect(hijacked.__accessed__).toEqual({});
    });

    it('should log properties that are null and accessed', function() {
      var original = { id: null };
      var hijacked = haccessed(original);

      hijacked.id;

      expect(hijacked.__accessed__).toEqual({
        id: null
      });
    });

    it('should log properties that were re-written', function() {
      var original = { id: 123 };
      var hijacked = haccessed(original);

      hijacked.id = 456;

      expect(hijacked.__accessed__).toEqual({
        id: 456
      });
    });

    it('should log properties that re-written and assigned to null', function() {
      var original = { id: 123 };
      var hijacked = haccessed(original);

      hijacked.id = null;

      expect(hijacked.__accessed__).toEqual({
        id: null
      });
    });

    it('should log properties that were accessed and re-written', function() {
      var original = { name: { first: 'joel' } };
      var hijacked = haccessed(original);

      hijacked.name.first;
      hijacked.name = { last: 'griffith' };

      expect(hijacked.__accessed__).toEqual({
        name: {
          first: 'joel'
        }
      });
    });

    it('should log deep properties that were re-written', function() {
      var original = { name: { first: 'joel' } };
      var hijacked = haccessed(original);

      hijacked.name = { last: 'griffith' };

      expect(hijacked.__accessed__).toEqual({
        name: { last: 'griffith' }
      });
    });

    it('should log accesses to values that are arrays', function() {
      var original = { array: [1, 2, 3] };
      var hijacked = haccessed(original);

      hijacked.array;

      expect(hijacked.__accessed__).toEqual({
        array: []
      });
    });

    it('should log accesses to values that are functions', function() {
      function funguy() {}

      var original = { funguy: funguy };
      var hijacked = haccessed(original);

      hijacked.funguy();

      expect(hijacked.__accessed__).toEqual({
        funguy: funguy
      });
    });

    it('should log accesses to nested properties', function() {
      var original = { id: 123, person: { name: 'joel' } };
      var hijacked = haccessed(original);

      hijacked.person.name;

      expect(hijacked.__accessed__).toEqual({
        person: {
          name: 'joel'
        }
      });
    });

    it('should log accesses to multiple nested properties', function() {
      var original = { id: 123, person: { first: 'joel', last: 'griffith' } };
      var hijacked = haccessed(original);

      hijacked.person.first;
      hijacked.person.last;

      expect(hijacked.__accessed__).toEqual({
        person: {
          first: 'joel',
          last: 'griffith'
        }
      });
    });

    it('should log accesses to object properties in an array', function() {
      var original = { records: [{ id: 1 }, { id: 2 }] };
      var hijacked = haccessed(original);

      hijacked.records[0].id;

      expect(hijacked.__accessed__).toEqual({
        records: [{ id: 1 }]
      });
    });

    it('should log accesses to multi-dimensional arrays', function() {
      var board = [
      ['o', 'o', 'x'],
      ['o', 'x', 'o'],
      ['x', 'o', 'o']
      ];
      var original = { currentBoard: board };
      var hijacked = haccessed(original);

      hijacked.currentBoard[0][2];

      expect(hijacked.__accessed__).toEqual({
        currentBoard: [[undefined, undefined, 'x']]
      });
    });

    it('should handle complex big \'ol objects and their lookups', function() {
      function callMeMaybe() {}
      var theBigOne = {
        id: 1,
        callMe: callMeMaybe,
        person: {
          name: 'Joel',
          last: 'Griffith',
          location: {
            state: 'WA',
            zip: '55555'
          }
        },
        friends: [] // :(
      };

      var hijacked = haccessed(theBigOne);

      hijacked.callMe();
      hijacked.id;
      hijacked.person.location.zip;

      expect(hijacked.__accessed__).toEqual({
        callMe: callMeMaybe,
        id: 1,
        person: {
          location: {
            zip: '55555'
          }
        }
      });
    });
  });

  describe('#__unAccessed__', function() {
    it('should log properties that were not accessed', function() {
      var original = { id: 123, name: 'joel' };
      var hijacked = haccessed(original);

      hijacked.id;

      expect(hijacked.__unAccessed__).toEqual({
        name: 'joel'
      });
    });

    it('should log property values that are null and not accessed', function() {
      var original = { id: null, name: 'joel' };
      var hijacked = haccessed(original);

      hijacked.name;

      expect(hijacked.__unAccessed__).toEqual({
        id: null
      });
    });

    it('should log deep properties that were not accessed', function() {
      var original = { id: 123, location: { state: 'wa', zip: '55555' } };
      var hijacked = haccessed(original);

      hijacked.location.state;

      expect(hijacked.__unAccessed__).toEqual({
        id: 123,
        location: {
          zip: '55555'
        }
      });
    });

    it('should consider properties that were set as being accessed', function() {
      var original = { id: 123, name: 'joel' };
      var hijacked = haccessed(original);

      hijacked.name = 'griffith';

      expect(hijacked.__unAccessed__).toEqual({
        id: 123
      });
    });

    it('should consider deep properties that were set as being accessed', function() {
      var original = { id: 123, location: { state: 'wa', zip: '55555' } };
      var hijacked = haccessed(original);

      hijacked.location.state = 'california';

      expect(hijacked.__unAccessed__).toEqual({
        id: 123,
        location: {
          zip: '55555'
        }
      });
    });

    it('should log nested properties being set as accessed', function() {
      var original = { id: 123, location: { state: 'wa', zip: '55555' } };
      var hijacked = haccessed(original);

      hijacked.location = { phone: '123-123-1234' };

      expect(hijacked.__unAccessed__).toEqual({
        id: 123
      });
    });

    it('should log un-accessed array values', function() {
      var original = [1, 2, 3];
      var hijacked = haccessed(original);

      hijacked[1];
      hijacked[2];

      expect(hijacked.__unAccessed__).toEqual([1]);
    });

    it('should log un-accessed array values deeply', function() {
      var board = [
        ['o', 'x', 'o'],
        ['x', 'o', 'o'],
        ['x', 'x', 'x']
      ];
      var hijacked = haccessed(board);

      hijacked[0][0];
      hijacked[1][1];
      hijacked[2][2];

      expect(hijacked.__unAccessed__).toEqual([
        [undefined, 'x', 'o'],
        ['x', undefined, 'o'],
        ['x', 'x']
      ]);
    });

    it('should log enitire objects as being accessed if not deeply so', function() {
      var original = { id: 123, location: { state: 'wa', zip: '55555' } };
      var hijacked = haccessed(original);

      hijacked.location;

      expect(hijacked.__unAccessed__).toEqual({
        id: 123,
        location: {}
      });
    });
  });
});
