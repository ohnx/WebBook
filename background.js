chrome.tabs.onSelectionChanged.addListener(function(tab) {
//	chrome.tabs.executeScript(null, {code:"alert(window.getSelection().toString());"});
//	chrome.tabs.executeScript(null, {code:"document.body.setAttribute('onmouseup','alert(window.getSelection().toString())');"});
//	chrome.tabs.executeScript(null, {code:"document.body.bgColor = 'red';"});
	chrome.tabs.executeScript(null, {file:"content.js", allFrames:true});
});

/*chrome.tabs.onUpdated.addListener(function(tab) {
	chrome.tabs.executeScript(null, {file:"content.js", allFrames:true});
});
*/

chrome.browserAction.onClicked.addListener(function(tab) {
	chrome.tabs.executeScript(null, {file:"sendData.js", allFrames:true});
});

chrome.extension.onRequest.addListener(function(request, sender, sendResponse){
	chrome.tabs.executeScript(null, {code:"alert(request.data);"});	
});

