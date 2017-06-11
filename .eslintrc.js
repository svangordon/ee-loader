module.exports = {
    "env": {
      "es6": true,
      "mocha": true,
    },
    "extends": "airbnb-base",
    "plugins": [
        "import"
    ],
    "rules": {
      "no-use-before-define": [ 2, { "functions": false } ],
    },
    "globals" : {
      "ee": false,
      "Export": false,
    }
};
