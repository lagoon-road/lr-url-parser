
# lr-url-parser

Parser that can take placeholders from urls and match them with real urls

| Information | - |
| ----------- | - |
| Code coverage | [![Coverage Status](https://coveralls.io/repos/github/lagoon-road/lr-url-parser/badge.svg?branch=master)](https://coveralls.io/github/lagoon-road/lr-url-parser?branch=master) |
| Repo link | [lr-client-router](https://github.com/lagoon-road/lr-client-router) |
| Dependencies | - |
| Size (Browserify, Babel and Gzip)| 777 bytes |
| Version | 1.0.0 |
| License | MIT |
| Usage | [guide](https://lagoonroad.com/guide) |

---

### Adding the parser to lagoon road

```
const core = require('lr-core');
const road = core('client')
  .parser(require('lr-url-parser'));
```

---

### parser.add(path)

```
parser.add('blog/:id');
```

**path:string**  
Add a route including placeholders to the parser, it will use it later for parsing.

---

### parser.parse(path)

```
parser.parse('blog/1');
// Returns { path : 'blog/:id', parameters : { id : 1 } }
```

**path:string**  
Parse an incoming route and check if it exists. If it exists it will extract possible parameters and give back the original url. If no match could be made the path is returned in object form like `{ path : '/original-path' }`.

---
