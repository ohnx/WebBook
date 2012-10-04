//alert('content.js running for WebBook');
function highlightSelection(){
	var selection = window.getSelection();
	if(selection.toString().length == 0){
		return;
	}
	alert(selection.toString());
	var range = selection.getRangeAt(0);
	alert(range.startOffset + "#" + range.endOffset);
	var markerEl = document.createElement("span");
	var selectionContents = range.extractContents();
	markerEl.id = range.startOffset + "#" + range.endOffset;
	markerEl.setAttribute('name', "WebBookElement");
	markerEl.setAttribute('onclick', "this.style.background = ''");
	markerEl.style.background = "red";
	markerEl.appendChild(selectionContents);
	range.insertNode(markerEl);
}

function sendData(){
	var page_url = document.location.pathname;
	var docText = document.body.innerHTML;
	var wbels = document.getElementsByName("WebBookElement");
	var wbels_str = "";
//	alert("The array of highlighted nodes : " + wbels.toString());
	alert("number of highlighted elements : " + wbels.length);
	for(var i = 0; i < wbels.length; i++){
		var wbel = wbels[i];
		var wbel_text = wbel.innerHTML;
		var start_pos = docText.indexOf(wbel_text + "</span>");
		wbels_str = wbels_str + start_pos + ":" + wbel_text + "|";
		alert(wbel_text);
	}
	alert(wbels_str);
	chrome.extension.sendRequest({"data":wbels_str, "page_url":page_url});
//	chrome.extension.sendRequest({"data":docText, "page_url":page_url});
}

function performAction(e){
	var unicode=e.charCode? e.charCode : e.keyCode
	var actualkey=String.fromCharCode(unicode);
	
	if (actualkey == 'h'){
		highlightSelection();
	}
	else if (actualkey == 's'){
		sendData();
	}
}

if(document.onkeypress){}
else{
	document.addEventListener('keypress', performAction);
}
