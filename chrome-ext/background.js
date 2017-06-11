var port = 9000;
let clickCount = 0;
let timeout = null;
let dblClickTime = 500; //ms
let poll = 1;

// Called when the url of a tab changes.
function checkForValidUrl(tabId, changeInfo, tab) {
// If the tabs url starts with "http://specificsite.com"...
  if (tab.url.indexOf('https://code.earthengine.google.com') == 0) {
    // ... show the page action.
    chrome.pageAction.show(tabId);
  }
};

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);

chrome.pageAction.onClicked.addListener(function(tab) {
  // Check for a double click and dispatch the appropriate action
  clickCount++;
  if (!timeout) {
    timeout = setTimeout(function(tab) {
      if (clickCount < 2) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, "fetchScript");
        });
      } else {
        poll = (poll + 1) % 2;
        chrome.pageAction.setIcon({path: "icon" + (poll + 1) + ".png",
                           tabId: tab.id});

        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, "togglePolling");
        });
      }
      timeout = null;
      clickCount = 0;
    }, dblClickTime, tab)
  }
});
