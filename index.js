const debug = require('debug')('lr-url-parser');

module.exports = function() {
  let paths = [];
  let unique = {};

  function parts(path) {
    let parts = path.split('?').shift().split('/');
    parts.shift();
    return parts.map(part => {
      return {
        root   : (!part ? true : false),
        static : (part[0] !== ':'),
        value  : (part[0] === ':' ? part.slice(1) : part),
      };
    });
  }

  return {
    add(path) {
      debug(`Adding path: ${ path }`);
      if (path[path.length - 1] === '/' && path.length !== 1) {
        path = path.slice(0, -1);
      }
      if (path[0] === '/' && !unique[path]) {
        paths.push({ path, parts : parts(path) });
        unique[path] = true;
        return true;
      } else {
        return false;
      }
    },
    parse(path) {
      debug(`Parsing path: ${ path }`);
      if (path[0] !== '/') {
        debug('Found absolute path');
        return { path };
      }
      if (path[path.length - 1] === '/' && path.length !== 1) {
        path = path.slice(0, -1);
      }

      const needle = parts(path);
      let match    = paths
        .filter(path => path.parts.length === needle.length)
        .filter(path => {
          return path.parts.filter((part, index) => {
            return part.value !== needle[index].value && part.static;
          }).length === 0;
        });

      if (match.length > 0) {
        match = match.pop();
      }

      if (!Array.isArray(match)) {
        debug('Found match with parameters');
        let parameters = {};
        match.parts.forEach((part, index) => {
          if (!part.static) {
            const valueParsed = parseInt(needle[index].value);
            const value       = needle[index].value;
            parameters[part.value] = valueParsed && valueParsed.toString().length === value.length ? valueParsed : value;
          }
        });
        const output = { path : match.path, parameters };
        debug(output);
        return output;
      }
      const output = { path : path.split('?').shift() };
      debug('Found static relative path');
      debug(output);
      return output;
    }
  }
};
