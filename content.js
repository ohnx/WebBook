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
	markerEl.setAttribute('onclick', "this.style.background = ''");
	markerEl.style.background = "red";
	markerEl.appendChild(selectionContents);
	range.insertNode(markerEl);
}

function sendData(){
	var docText = document.body.innerHTML;
	chrome.extension.sendRequest({"data":docText});
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

document.addEventListener('keypress', performAction);

