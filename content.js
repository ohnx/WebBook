var CTRL = false;

//alert('content.js running for WebBook');
function highlightSelection(){
	var selection = document.getSelection();
	selectionText = selection.toString();
	if(selection.toString().length == 0){
		return;
	}
	alert(selection.toString());
	var range = selection.getRangeAt(0);
	alert(range.startOffset + "#" + range.endOffset);
	var markerEl = document.createElement("span");
	var selectionContents = range.extractContents();
	markerEl.id = "WebBook" + range.startOffset + "#" + range.endOffset;
	markerEl.setAttribute('name', "WebBookElement");
//	markerEl.setAttribute('onclick', "this.style.background = ''");
//	var nodeText = document.createTextNode(selectionContents);
	var onclickCode = "var nodeText = document.createTextNode('" + selectionText + "'); this.parentNode.replaceChild(nodeText, this)";
	alert(onclickCode);
	markerEl.setAttribute('onclick', onclickCode);
	markerEl.style.background = "red";
	markerEl.appendChild(selectionContents);
	range.insertNode(markerEl);
}

function sendDataResponse(response){
	alert(response);
}

function sendData(){
	var page_url = document.location.pathname;
	var docText = document.body.innerHTML;
	var wbels = document.getElementsByName("WebBookElement");

	// prepare the data to be stored in DB //
	
	// Scheme :
	// for each highlight, store the following 2 things:
	// 1. the highlighted text
	// 2. which occurence of that text (the same text may appear more than once) is the required one
	
	var wbels_str = "";
	alert("number of highlighted elements : " + wbels.length);
	for(var i = 0; i < wbels.length; i++){
		var wbel = wbels[i];
		var wbel_text = wbel.innerHTML;
		alert(wbel_text);
		var done = 0;
		var occur_no = 0;
		var start_index = 0;
		while(!done){
			var end_pos = docText.indexOf(wbel_text, start_index) + wbel_text.length;
			alert(docText.substring(end_pos, parseInt(end_pos) + 7));
			if(docText.substring(end_pos, parseInt(end_pos) + 7) == "</span>"){
				alert("occur no : " + occur_no);
				wbels_str = wbels_str + occur_no + ":" + wbel_text + "|";
				done = 1;
			}
			occur_no++;
			start_index = end_pos;
		}
	}
	alert(wbels_str);
	chrome.extension.sendRequest({"senderScript":"content", "data":wbels_str, "page_url":page_url}, sendDataResponse);
//	chrome.extension.sendRequest({"data":docText, "page_url":page_url});
}

function keyDownHandler(e){
	if(e.which == 17){
//		alert('ctrl key down');
		CTRL = true;
	}
}

function keyUpHandler(e){
	if(e.which == 17){
		alert('ctrl key up');
		CTRL = false;
	}
}

function performAction(e){
	// check if CTRL key is down //
	if(!CTRL){
//		alert('ctrl key is not down');
		return;
	}
	else{
//		alert('ctrl key is down');
	}
	
//	var unicode=e.charCode? e.charCode : e.keyCode;
//	var actualkey=String.fromCharCode(e.which);
	
	alert("checking your key : " + e.which);

//	if (actualkey == 'm'){
	if(e.which == 13){
		alert('highlighting your selection');
		highlightSelection();
	}
//	else if (actualkey == 'b'){
	else if(e.which == 2){
		alert('sending your data');
		sendData();
	}

}

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);
document.addEventListener('keypress', performAction);
alert('keypress listener added');
