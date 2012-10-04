var oauth = ChromeExOAuth.initBackgroundPage({
  'request_url': 'https://www.google.com/accounts/OAuthGetRequestToken',
  'authorize_url': 'https://www.google.com/accounts/OAuthAuthorizeToken',
  'access_url': 'https://www.google.com/accounts/OAuthGetAccessToken',
  'consumer_key': 'anonymous',
  'consumer_secret': 'anonymous',
  'scope': 'http://www.google.com/m8/feeds/',
  'app_name': 'WebBook'
});

function gAuthorize() {
	alert('browserAction Clicked');
//	if(oauth.hasToken()){
//		//alert('token already present');
//		chrome.tabs.executeScript(null, {file:"sendData.js", allFrames:true});		
//	}
//	else{
		oauth.authorize(onAuthorize);
//	}
}

function onAuthorize(){
	//alert('user authorized and access granted');
	//console.log("user authorized and access granted");
	//chrome.tabs.executeScript(null, {file:"sendData.js", allFrames:true});
}

function handleRequest(request, sender, sendResponse){
	var docText = request.data;
	var page_url = request.page_url;
	//alert(docText);
	//alert(page_url);

	var url = "http://172.16.25.171/webBook/getData.php";
	var args = "pageurl=" + page_url + "&" + "docText=" + docText;
	alert(args);

	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("get", url + "?" + args, true);
	xmlhttp.onload = function(){alert('data successfully transferred');};
	xmlhttp.send();

}

function activateHighlighter(tab) {
//	chrome.tabs.executeScript(null, {code:"alert(window.getSelection().toString());"});
//	chrome.tabs.executeScript(null, {code:"document.body.setAttribute('onmouseup','alert(window.getSelection().toString())');"});
//	chrome.tabs.executeScript(null, {code:"document.body.bgColor = 'red';"});
	//alert('activating highlighter');
	chrome.tabs.executeScript(null, {file:"getContents.js", allFrames:true});
	chrome.tabs.executeScript(null, {file:"content.js", allFrames:true});
	//alert('highlighter activated');
}

//chrome.tabs.onSelectionChanged.addListener(activateHighlighter);
chrome.browserAction.onClicked.addListener(gAuthorize);

chrome.tabs.onUpdated.addListener(activateHighlighter);
chrome.extension.onRequest.addListener(handleRequest);


