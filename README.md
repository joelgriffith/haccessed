# HACCESSED

Snoop on your objects and see what they're up to

[![npm version](https://badge.fury.io/js/haccessed.svg)](https://badge.fury.io/js/haccessed)
[![Build Status](https://travis-ci.org/joelgriffith/haccessed.svg?branch=master)](https://travis-ci.org/joelgriffith/haccessed)

## About

Haccessed is a function that "hijacks" an object, clones it, and exposes a "hidden" `__print__` method. This `__print__` method will return the original object filtering out un-accessed properties. It does this by using the `Object.defineProperty` method, which keeps the original object intact whilst monitoring lookups on properties.

## Compatibility
This module is wrapped in UMD, and will work in any JavaScript environment that supports ES5 features.

You can:

- Bundle it in your `webpack` build.
- `require` it in node.
- Use it in `rewire` or `jest.mock`.
- `require` it AMD style for `requirejs`.

## Use Cases

- Validate which fields of an API are being actively used.
- Inject into a test to validate lookups.
- Verify that fields _aren't_ being used after a deprecation.
- Ensure pseudo-private `_hidden` fields aren't getting called.

## Simple Example

```javascript
const haccessed = require('haccessed');
const myObject = { id: 123, name: 'joel' };
const hijacked = haccessed(myObject);

hijacked.id; // referencing the id

hijacked.__print__(); // => { id: 123 }
```

## Complex Example

```javascript
const haccessed = require('haccessed');
const myObject = {
  id: 1,
  name: 'joel',
  address: {
    zip: '55555',
    state: 'wa'
  },
  friends: [{
    id: 2,
    name: 'bob'
  }, {
    id: 3,
    name: 'jane'
  } , {
    id: 4,
    name: 'sue'
  }]
};
const hijacked = haccessed(myObject);

hijacked.id;
hijacked.address.state;
hijacked.friends[0].name;

hijacked.__print__();
/*
{
  id: 1,
  address: {
    state: 'wa'
  },
  friends: [{ name: 'bob' }]
}
*/
```

## TODO
- [x] `eslint`
- [x] `travis-ci`
- [ ] More fully-featured interface (accessed, inaccessed, unavailable)
- [ ] More edgcase tests
- [ ] Code coverage
