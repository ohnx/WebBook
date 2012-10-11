//alert('content.js running for WebBook');

var CTRL = false;


/*
Algorithm to highlight a range object
=====================================

1. find the first common ancestor P of the startContainer and the endContainer
2. recursively traverse the entire tree under P
3. start the first range object at the startOffset of the startContainer as soon as it is reached.
4. repeat 5-8 till the endContainer is reached
5. maintain a current range
6. keep adding each elements to the current range if they are not <p> or <div> or webBook <span> elements. If one of these occur, end the current range and highlight it.
	if the occured element is webBook <span>, move on
	else
		print the occured element separately
		start the next range from the next element in the tree traversal.

*/

var start = 0;
var end = 0;
var startOffset = 0;
var endOffset = 0;
var curRange = document.createRange();

function highlightSelection(){
	var docText = document.body.innerHTML;
	var selection = window.getSelection();

	// return if the selection is empty //
	if(selection.isCollapsed){
		return;
	}
	
	// traverse over all the ranges in the selection //
	var no_ranges = selection.rangeCount;
	alert("no of ranges : " + no_ranges);
	for(var range_no = 0; range_no < no_ranges; range_no++){
		var range = selection.getRangeAt(range_no);
		alert("range plaintext : " + range.toString());
		
		// get the starting and ending text nodes //
		startContainer = range.startContainer;
		endContainer = range.endContainer;

		if (startContainer.nodeType != 3 || endContainer.nodeType != 3){
			alert('Such a selection is not allowed. You may only select text on the page');
			return;
		}

		// debug : display the contents of the start and end containers //
		alert('starting element : nodeType : ' + startContainer.nodeType + ' | name : ' + startContainer.nodeName + " | number of children : " + startContainer.childNodes.length + ' | text : ' + startContainer.data + " | offset : " + range.startOffset);
		alert('end element : nodeType : ' + endContainer.nodeType + ' | name : ' + endContainer.nodeName + " | number of children : " + endContainer.childNodes.length + ' | text : ' + endContainer.data + " | offset : " + range.endOffset);

		// find the first common ancestor P of the start and end Containers //
		var P = commonAncestor(startContainer, endContainer);
		alert('common ancestor : nodeType : ' + P.nodeType + ' | name : ' + P.nodeName + " | number of children : " + P.childNodes.length + ' | text : ' + P.innerHTML);

		// traverse the tree under P and highlight all elements between start and end Container //
		// (A) recursive function //
		startOffset = range.startOffset;
		endOffset = range.endOffset;
		highlightTree(P);
	}
}

function highlightTree(root){
	if(end){
		return;
	}

	if(root = startContainer){
		start = 1;
		curRange.setStart(root, startOffset);
		curRange.setEndAfter(root);
		return curRange;
	}
	
	if(root == endContainer){
		end = 1;
		curRange.setEnd(root, endOffset);
		highlightRange(curRange);
		return;
	}
	
	// if current element is a text node, then simply add it to curRange //
	if(start && root.nodeType == 3){
		curRange.setEndAfter(root);
	}
	
	// if the current element is a <p> or <div> then highlight current range object and start another one //
	if(start && (root.nodeName == "P" || root.nodeName == "DIV" || (root.nodeName == "SPAN" && root.name == "WebBookElement"))){
		if (!curRange.collapsed){
			highlightRange(curRange);
		}
		curRange = document.createRange();
		curRange.setStart(root, 0);
		curRange.setEnd(root, 0);
	}
	if(root.nodeName == "SPAN" && root.name == "WebBookElement"){
		return;
	}
	
	var childNodes = root.childNodes();
	for(var i = 0; i < childNodes.length; i++){
		highlightTree(childNodes[i]);
	}	
}

function parents(node) {
	var nodes = [];
	for (; node; node = node.parentNode){
		nodes.unshift(node);
	}
	return nodes;
}

function commonAncestor(node1, node2) {
	var parents1 = parents(node1);
	var parents2 = parents(node2);

	for (var i = 0; i < parents1.length; i++) {
		if (parents1[i] != parents2[i]){
			return parents1[i - 1];
		}
	}
}

function highlightRange(range){
	// create a span element with the selected text and the desired properties //
	var markerEl = document.createElement("span");
	markerEl.id = "WebBook" + range.startOffset + "#" + range.endOffset;
	markerEl.setAttribute('name', "WebBookElement");
	var onclickCode = "var nodeText = document.createTextNode('" + range.toString() + "'); this.parentNode.replaceChild(nodeText, this)";
	alert(onclickCode);
	markerEl.setAttribute('onclick', onclickCode);
	markerEl.style.background = "red";
	markerEl.style.removeProperty('background-position');
	markerEl.style.removeProperty('background-repeat');
	
	// extract the contents and remove them from the range object //
	var selectionContents = range.extractContents();
	markerEl.appendChild(selectionContents);
	
	// add the contents along with the span tag //
	range.insertNode(markerEl);
}

function dispRangeChildren(range){
	var rangeChildren = range.cloneContents().childNodes;
	alert('range number of children : ' + rangeChildren.length);
	for(var i = 0; i < rangeChildren.length; i++){
		switch(rangeChildren[i].nodeType){
			case 1: 
			alert('element node : name : ' + rangeChildren[i].nodeName);
			alert("child number " + i + " html text : " + rangeChildren[i].innerHTML);
			alert("child number " + i + "parent html text : " + rangeChildren[i].parentNode.innerHTML);
			break;

			case 3:
			alert('text node');
			alert("child number " + i + " text : " + rangeChildren[i].data);
			break;
		}
	}
}

function sendDataResponse(response){
	alert(response);
}

function sendData(){
	var page_url = document.location.pathname;
	var docText = document.body.innerHTML;
	var wbels_tags = document.getElementsByName("WebBookElement");
	var wbels = wbels_tags;
	// separate the highlights that are either overlapping or across <div> or <p> tags etc //
/*	var nElements = 0;
	wbels = new Array();
	for(var i = 0; i < wbels.length; i++){
		var wbel = wbels_tags[i];
		var wbel_text = wbel.innerHTML;
		var start_pos = 0;
		while(start_pos < wbel_text.length){
			var tag_pos = 
		}
	}
*/
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
//alert('keypress listener added');
