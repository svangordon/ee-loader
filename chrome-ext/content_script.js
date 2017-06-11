function injectJs(code) {
  var scriptNode = document.querySelector('#injector');
  if (scriptNode) {
    scriptNode.remove()
  }
  var scr = document.createElement('script');
  scr.type="text/javascript";
  // scr.src=link;
  scr.id = "injector"
  scr.innerHTML = code;
  document.getElementsByTagName('head')[0].appendChild(scr)
  //document.body.appendChild(scr);
}

// setup
const setupCode = `
  // console.log(window.ace)
  window.node = document.querySelector('.ace_editor');
  function asyncSetEditor() {
    // if (window && window.ace) {
      try {
        window.editor = window.ace.edit(window.node);
      } catch (e) {
        window.node = document.querySelector('.ace_editor');
        setTimeout(asyncSetEditor, 500)
      }
    // }
  }
  asyncSetEditor()
  // window.editor = window.ace.edit(window.node);
  window.polling = false;
  window.pollingTimeout = null;

  window.togglePolling = function() {
    if (!window.polling) {
      window.getScript(false);
      window.poll()
    } else {
      window.pollingTimeout = null;
    }
    window.polling = !window.polling;
  }

  window.poll = function() {
    return setTimeout(function() {
      fetch('https://localhost:8080/poll').then(function(resp) {
        return resp.text();
      }).then(function(isFresh) {
        if (isFresh == "true") {
          window.getScript();
        }
      });
      if (window.polling) {
        window.pollingTimeout = window.poll();
      }
    }, 1000)
  }

  window.getScript = function(runScript=true) {
    fetch('https://localhost:8080/').then(function(resp) {
      return resp.text();
    }).then(resp => {
      window.editor.setValue(resp);
      if (runScript) {
        document.querySelector('.run-button').click();
      }
    });
  }
`
injectJs(setupCode);

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

    if (request === "fetchScript") {
      injectJs('window.getScript()')
    } else if (request === "togglePolling") {
      injectJs(`
        window.togglePolling();
      `)
    }
  });
