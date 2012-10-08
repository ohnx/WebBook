var oauth = ChromeExOAuth.initBackgroundPage({
  'request_url': 'https://www.google.com/accounts/OAuthGetRequestToken',
  'authorize_url': 'https://www.google.com/accounts/OAuthAuthorizeToken',
  'access_url': 'https://www.google.com/accounts/OAuthGetAccessToken',
  'consumer_key': 'anonymous',
  'consumer_secret': 'anonymous',
  'scope': 'https://www.googleapis.com/auth/userinfo.profile',
  'app_name': 'WebBook'
});

var senderScript = "";
var docText = "";
var page_url = "";
var responseFunction = function(){};


function getServer(text){
	var userData = JSON.parse(text);

	var url = "http://172.16.25.171/webBook/sendData.php";
	var args = "?" + "userGId=" + userData.id + "&" + "pageurl=" + page_url;
	alert(args);

	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("get", url + encodeURI(args), true);
	xmlhttp.onload = function(){alert('data received successfully'); responseFunction(xmlhttp.responseText);};
	xmlhttp.send();
}

function sendServer(text){
	var userData = JSON.parse(text);

	var url = "http://172.16.25.171/webBook/getData.php";
	var args = "?" + "userGId=" + userData.id + "&" + "pageurl=" + page_url + "&" + "docText=" + docText;
	alert(args);

	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("get", url + encodeURI(args), true);
	xmlhttp.onload = function(){alert('data successfully transferred');};
	xmlhttp.send();
}


function onUserInfo(text, xhr){
	alert('user information received');
	alert(text);
	if(senderScript == "content"){
		sendServer(text);
	}
	else if(senderScript == "getContents"){
		getServer(text);
	}
}

function onAuthorize(){
	alert('user authorized');
	var url = "https://www.googleapis.com/oauth2/v1/userinfo";
    oauth.sendSignedRequest(url, onUserInfo, {
      'parameters' : {
        'alt' : 'json'
      }
    });
	//alert('user authorized and access granted');
	//console.log("user authorized and access granted");
	//chrome.tabs.executeScript(null, {file:"sendData.js", allFrames:true});
}

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

function handleRequest(request, sender, sendResponse){
	senderScript = request.senderScript;
	responseFunction = sendResponse;
	if(senderScript == "getContents"){
		page_url = request.page_url;
		alert("request from getContents.js : page_url : " + page_url);
	}
	else if(senderScript == "content"){
		docText = request.data;
		page_url = request.page_url;
		alert("request from content.js : docText : " + docText + " | " + "page_url : " + page_url);
	}
	
	gAuthorize();
}

function activateHighlighter(tabId, changeInfo, tab) {
//	chrome.tabs.executeScript(null, {code:"alert(window.getSelection().toString());"});
//	chrome.tabs.executeScript(null, {code:"document.body.setAttribute('onmouseup','alert(window.getSelection().toString())');"});
//	chrome.tabs.executeScript(null, {code:"document.body.bgColor = 'red';"});
	
	if(tab.url != "undefned" && changeInfo.status == "complete"){
		alert('activateHighlighter called');
		chrome.tabs.executeScript(null, {file:"getContents.js", allFrames:true});
		chrome.tabs.executeScript(null, {file:"content.js", allFrames:true});
	}
}

//chrome.tabs.onSelectionChanged.addListener(activateHighlighter);
chrome.browserAction.onClicked.addListener(gAuthorize);

chrome.tabs.onUpdated.addListener(activateHighlighter);
//chrome.tabs.executeScript(null, {code:"alert('onUpdate listener activateHighlighter added')"});
alert('onUpdate listener activateHighlighter added');
//chrome.tabs.onCreated.addListener(activateHighlighter);
chrome.extension.onRequest.addListener(handleRequest);


