'use-strict';

const tape   = require('tape');
const parser = require('../index')();

tape('Adding urls', test => {
  test.equals(parser.add('/'), true);
  test.equals(parser.add('/somepath?queryparams'), true);
  test.equals(parser.add('/:id'), true);
  test.equals(parser.add('/path/with/:multiple/sections'), true);
  test.equals(parser.add('/some/path'), true);
  test.equals(parser.add('/dynamic/:id'), true);
  test.equals(parser.add('/double/:id/:idi'), true);
  test.equals(parser.add('/multiple/:id'), true);
  test.equals(parser.add('/multiple/:else'), true);
  test.equals(parser.add('something'), false);
  test.equals(parser.parse('just-something').path, 'just-something');
  test.equals(parser.parse('just-something?askdhjlakhds').path, 'just-something?askdhjlakhds');
  test.equals(parser.parse('/some/path').path, '/some/path');
  test.equals(parser.parse('/some/path?params').path, '/some/path');
  test.equals(parser.parse('/dynamic/1').path, '/dynamic/:id');
  test.equals(parser.parse('/double/1/2').parameters.id, 1);
  test.equals(parser.parse('/double/1/2').parameters.idi, 2);
  test.equals(parser.parse('/multiple/1').parameters.id, undefined);
  test.equals(parser.parse('/multiple/1').parameters.else, 1);
  test.equals(parser.parse('/bla/bla').path, '/bla/bla');
  test.equals(parser.parse('/bla/bla?hehe').path, '/bla/bla');
  test.end();
});
