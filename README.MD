### Overview
With ee-loader, the code that you write on your machine will be bundled up,
transpiled, and run in the Earth Engine IDE with the click of a button (or every
time you save). `src/index.js` will be compiled and run in the Earth Engine IDE in Chrome.
In hopes of making utility more useful, this readme is being written with the idea
that the users might not be familiar with the Node/NPM ecosystem.

### Before you get started
You will need `npm`, which you can find at <https://www.npmjs.com/get-npm>. You
will also need to enable insecure localhost connections. Navigate to <chrome://flags/#allow-insecure-localhost>
and enable that option. Depending on your OS, etc, you may have to reenable this
every time you restart your system.

### Organisation
Your code lives in `src`, at `src/index.js`. That's where ee-loader starts when
it reads your code. The code that Earth Engine sees lives at `dist/script.js`.
If there's nothing there, don't fret; it just means that ee-loader hasn't built
your script yet.

### Installation

1. Open up your terminal, and navigate to wherever you would like this code to live.
2. Clone this folder using `git clone https://github.com/svangordon/ee-loader.git && cd ee-loader`
4. Install dependencies: `npm install`
5. Make sure that webpack works. Use the command `webpack`, and you should get a pleasant output. Your compiled script is now in `./dist`. (This step is optional)
6. Install the ee-loader chrome extension
    1. Navigate to [chrome://extensions/]
    2. Enable developer mode (top right checkbox).
    3. Click `Load unpacked extension...` and have it load the chrome extension found in `./chrome-ext`
    4. Confirm that the extension is installed: navigate to <https://code.earthengine.google.com>. To the right of the omnibox there should be a grayed out box that, when you mouse over, should display the text "ee-loader".

### Usage

1. Open up your terminal, and navigate to the folder where you have this repo installed.
2. Start the server with `npm start`. It should output `server is running at 8080`.
3. Open up chrome and navigate to <https://code.earthengine.google.com>. You should see a green square in the top right of the screen, to the right of the omnibox.
4. Click that button. Ee-loader will load and then execute your script.
5. If you would like ee-loader to watch your code for changes and automatically execute the script, double click the page action (that green square). It should turn into a red square. If you need it to run a script on command, you can still single click.
6. When you're done, you can terminate the process in your terminal with `ctrl-c`.

If you would like to have Webpack start somewhere other than `src/index.js`, you
can pass the `npm start` command the name of the file in `src` that you would like
to use as the entry point. For example, if you would like Webpack to start at
`altEntry.js`, use: `npm start -- altEntry.js`.

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
