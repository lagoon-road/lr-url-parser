'use-strict';

const tape   = require('tape');
const parser = require('../index')();

tape('Adding urls', test => {
  // Non relative tests
  test.equals(parser.add('non-slash'), false);
  test.equals(parser.add('https://royniels.nl'), false);
  test.equals(parser.parse('https://royniels.nl').path, 'https://royniels.nl');
  test.equals(parser.parse('non-slash').path, 'non-slash');

  // Root only test
  test.equals(parser.parse('/'), false);
  test.equals(parser.add('/'), true);
  test.equals(parser.parse('/').path, '/');

  // Statics only
  test.equals(parser.parse('/one'), false);
  test.equals(parser.parse('/one/two'), false);
  test.equals(parser.parse('/one/two/three'), false);
  test.equals(parser.add('/one'), true);
  test.equals(parser.add('/one/two'), true);
  test.equals(parser.add('/one/two/three'), true);
  test.equals(parser.parse('/one').path, '/one');
  test.equals(parser.parse('/one/two').path, '/one/two');
  test.equals(parser.parse('/one/two/three').path, '/one/two/three');

  // Multiple slashes
  test.equals(parser.parse('//').path, '/');
  test.equals(parser.add('///'), true);
  test.equals(parser.parse('///').path, '/');
  test.equals(parser.add('//////'), true);
  test.equals(parser.parse('//////').path, '////'); // Removed trailing slash and joining slash

  // Trailing slashes
  test.equals(parser.parse('/trailing/'), false);
  test.equals(parser.add('/trailing/'), true);
  test.equals(parser.parse('/trailing/').path, '/trailing');

  // Single param
  test.equals(parser.parse('/:id'), false);
  test.equals(parser.add('/:id'), true);
  test.equals(parser.parse('/1').parameters.id, 1);
  test.equals(parser.remove('/:id'), true);
  test.equals(parser.parse('/fixed/1'), false);
  test.equals(parser.add('/fixed/:id'), true);
  test.equals(parser.parse('/fixed/1').parameters.id, 1);
  test.equals(parser.remove('/fixed/:id'), true);

  // path with fixed after dynamic parts
  test.equals(parser.parse('/1/fixed'), false);
  test.equals(parser.add('/:id/fixed'), true);
  test.equals(parser.parse('/1/fixed').parameters.id, 1);
  test.equals(parser.parse('/1'), false);
  test.equals(parser.remove('/:id/fixed'), true);

  // Optional dynamics
  test.equals(parser.parse('/1/2/3'), false);
  test.equals(parser.add('/:a/:b/:c'), true);
  test.equals(parser.parse('/1').parameters.a, 1);
  test.equals(parser.parse('/1/2').parameters.a, 1);
  test.equals(parser.parse('/1/2').parameters.b, 2);
  test.equals(parser.parse('/1/2/3').parameters.a, 1);
  test.equals(parser.parse('/1/2/3').parameters.b, 2);
  test.equals(parser.parse('/1/2/3').parameters.c, 3);
  test.equals(parser.remove('/:a/:b/:c'), true);

  test.end();
});
