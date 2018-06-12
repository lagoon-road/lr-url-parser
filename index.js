const debug = require('debug')('lr-url-parser');

module.exports = function() {
  let paths = [];
  let unique = {};

  function parts(path) {
    if (path.length === 1) {
      return [{
        index  : 0,
        static : true,
        value  : '/',
      }]
    }
    let parts = path.split('?').shift().split('/');
    parts.shift();
    return parts.map((part, index) => {
      return {
        index  : index,
        static : (part[0] !== ':'),
        value  : (part[0] === ':' ? part.slice(1) : part),
      };
    });
  }

  function removeTrailingSlash(path) {
    if (path[path.length - 1] === '/' && path.length !== 1) {
      return path.slice(0, -1);
    }
    return path;
  }

  function isRelative(path) {
    return path[0] === '/';
  }

  function exists(path) {
    return unique[path];
  }

  function findMatch(needle) {

    // In order to match, all static parts have to match
    // Or there should be no static parts at all
    let matches = paths.filter(path => {
      if (path.parts.filter(part => part.static).length === 0) {
        return true;
      }
      return path.parts
        .filter(part => part.static === true)
        .filter(part => {
          // When needle is to short, they don't match
          if (needle[part.index] === undefined) {
            return false;
          }
          return part.value === needle[part.index].value
        })
        .length > 0;
    });

    // No match found
    if (matches.length === 0) {
      return false;
    }

    // Single match, return it
    if (matches.length === 1) {
      return matches.pop();
    }

    // Find the closest match based on length differences
    // 0 is the closest, from there on we just see how order
    // based on how close to the zero, on either side
    return matches.map(match => {
      match.difference = match.parts.length - needle.length;
      return match;
    }).sort((a, b) => {
      if (a.difference === 0) {
        return -1;
      }
      return Math.abs(a.difference) > Math.abs(b.difference);
    }).shift();
  }

  function replacePlaceholders(needle, match) {
    let parameters = {};
    match.parts
      .filter(part => part.static === false)
      .filter(part => part.index < needle.length)
      .forEach(part => {
        // Parse nummeric values
        const valueParsed      = parseInt(needle[part.index].value);
        const value            = needle[part.index].value;
        parameters[part.value] = valueParsed && valueParsed.toString().length === value.length ? valueParsed : value;
      })
    let path       = match.parts.map(part => part.static === false ? `:${ part.value }` : part.value).join('/');
    if (!isRelative(path)) {
      path = `/${ path }`;
    }

    return { path, parameters };
  }

  return {
    add(path) {
      debug(`Adding path: ${ path }`);
      path = removeTrailingSlash(path);
      if (isRelative(path) && !exists(path)) {
        paths.push({ path, parts : parts(path) });
        unique[path] = true;
        return true;
      } else {
        return false;
      }
    },
    remove(path) {
      path = removeTrailingSlash(path);
      if (isRelative(path) && exists(path)) {
        paths = paths.filter(item => item.path !== path);
        unique[path] = false;
        return true;
      } else {
        return false;
      }
    },
    parse(path) {
      debug(`Parsing path: ${ path }`);
      if (!isRelative(path)) {
        return { path };
      }

      path         = removeTrailingSlash(path);
      const needle = parts(path);
      match        = findMatch(needle);

      if (match === false) {
        return false;
      }

      return replacePlaceholders(needle, match);
    }
  }
};
