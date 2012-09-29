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
	alert(docText);

	var url = "http://172.16.25.171/webBook/getData.php";
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("post", url, true);
	xmlhttp.onload = function(){alert('data successfully transferred');};
	xmlhttp.send('docText=' + docText);

}

function activateHighlighter(tab) {
//	chrome.tabs.executeScript(null, {code:"alert(window.getSelection().toString());"});
//	chrome.tabs.executeScript(null, {code:"document.body.setAttribute('onmouseup','alert(window.getSelection().toString())');"});
//	chrome.tabs.executeScript(null, {code:"document.body.bgColor = 'red';"});
	chrome.tabs.executeScript(null, {file:"content.js", allFrames:true});
}

chrome.tabs.onSelectionChanged.addListener(activateHighlighter);
chrome.browserAction.onClicked.addListener(gAuthorize);

//chrome.tabs.onUpdated.addListener(activateHighlighter);
chrome.extension.onRequest.addListener(handleRequest);


