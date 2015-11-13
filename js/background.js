chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.create({url: 'chromeiql.html'});
});
