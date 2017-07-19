### Overview
With ee-loader, the code that you write on your machine will be bundled up, transpiled, and run in the Earth Engine IDE on command with the help of a Chrome extension. Google Earth Engine is a machine learning tool, created by Google, that can do lots of useful things, like processing satellite images or performing machine learning. It has a nifty online IDE for its JavaScript API; unfortunately, this doesn't support many ES6 features like arrow functions or modules. Furthermore, some of us would rather code in our preferred text editor without having to copy-paste.

That's where ee-loader steps in. Ee-loader transpiles and bundles our code, sends it to the browser, and executes it in Earth Engine, easy-peasey.

### Before you get started
The entry point for your code should be called `index.js`. You will need `npm`, which you can find at <https://www.npmjs.com/get-npm>. You will also need to enable insecure localhost connections. Navigate to <chrome://flags/#allow-insecure-localhost> and enable that option. Finally, install the Chrome extension ee-loader, which you can find at <https://chrome.google.com/webstore/detail/ee-loader/jhnhibcoplkahnchpfkcpngnbjbpkeaa>.

### Installation

1. Open up your terminal.
2. Install ee-loader, using `npm install -g ee-loader`.
3. Navigate to the directory where your Earth Engine code lives.
4. Start ee-loader with the command `ee-loader`. If your entry point has a name either than `index.js`, you can provide it as an argument to the command, eg. `ee-loader altEntryPoint.js`
5. Navigate to <https://code.earthengine.google.com/>.
6. Run your code by clicking the green icon to the left of the URL box. If you would like your code to automatically execute when updated, double click the icon.
7. When you're done, you can terminate the process in your terminal with `ctrl-c`.


### What's going on?
With the command `npm start`, Node will use Webpack to compile the files in `src`,
using `src/index.js` as the entry point. Webpack goes to `src/index.js`, it gathers
up any files that it needs, it concatenates them into one file, it transpiles them
from ES6 (with things like arrow functions) into ES5, and sticks the output in `dist`
(not necessarily in that order).
It does the transpilation using Babel. Then it starts listening on port 8080, and
when it receives a request, it serves the code at `dist/script.js`. When
you execute the chrome extension, it gets that code, and injects it into the webpage.
That script manipulates the state of the Ace editor, setting the state of the
code editor to your script, and then dispatches a `click` action on the `.run-script`
button. When you set the extension to watch mode, it polls the server every 500ms
or so to see if `dist/script.js` has changed, and if so it gets it and executes.

### Issues

#### `return` Statements
Due to the way that the transpiler is set up, you cannot have a `return` statement
in the body of your function, even though this is valid in the IDE. This is because
it would not be valid ES6, and so Babel throws an error. There's a way to have
it parse it anyway, but I don't quite have it figured out, and frankly you don't
really need that behavior (the only use of the return statement outside a function
is to halt program execution). I suppose you could use `eval` or something like
that if you wanted to

#### Other Issues
On executing code, the window may hang for several seconds. This is an issue with Ace, the code editor; the behavior is present when pasting in text. Furthermore, it appears that the code is none the less executing, so I wouldn't consider it an issue.

It's almost certain that some ES6 features transpile in a way that EE still
doesn't like -- if you find one, let me know!

Sometimes, the extension gets in a weird state (like autoloading with a green icon, that sort of thing). If that happens, refresh the page to get it back on track.
