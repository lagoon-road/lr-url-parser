'use-strict';

module.exports = (function() {
  let paths = [];

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
      if (path[0] === '/') {
        paths.push({ path, parts : parts(path) });
        return true;
      }
      return false;
    },
    parse(path) {
      const needle = parts(path);
      let match    = paths
        .filter(path => path.parts.length === needle.length)
        .filter(path => {
          return path.parts.filter((part, index) => {
            return part.value !== needle[index].value && part.static;
          }).length === 0;
        });

      if (match.length > 1) {
        match = match.pop();
        console.warn(`Found multiple paths, using ${ match.path }`);
      } else if (match.length === 1) {
        match = match.pop();
      }

      if (!Array.isArray(match)) {
        let parameters = {};
        match.parts.forEach((part, index) => {
          if (!part.static) {
            parameters[part.value] = parseInt(needle[index].value);
          }
        });
        return { path : match.path, parameters };
      }

      return false;
    }
  }
}());
