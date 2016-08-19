# string-dict

A dictionary prototype for JavaScript using strings as keys. It avoids common JS object pitfalls
and adds some convenience methods known from JS arrays.

## Usage

```javascript
var Dict = require("string-dict");

var myDict = new Dict({
    "weather": "good",
    "mood": "splendid",
    "wants": "food",
    "warts": 3
});

myDict.set("hasOwnProperty", "foo");
myDict.has("hasOwnProperty"); // true
myDict.get("hasOwnProperty"); // "foo"

myDict.forEach(console.log.bind(console));
myDict.keys(); // ["weather", "mood", "wants", "warts", "hasOwnProperty"]
```
