/*document.addEventListener('mouseup', function(e){
//	chrome.extension.sendRequest({"data":window.getSelection().toString()}, function(response){});
	var selection = window.getSelection();
	if(selection.toString().length == 0){
		return;
	}
	
	var range;

	if (selection.getRangeAt)
	{
		alert(selection.toString());
		range = selection.getRangeAt(0);
	}
	else
	{
		alert("else");
		// Older WebKit doesn't have getRangeAt
		range.setStart(selection.anchorNode, selection.anchorOffset);
		range.setEnd(selection.focusNode, selection.focusOffset);

		// Handle the case when the selection was selected backwards (from the end to the start in the
		// document)
		if (range.collapsed !== selection.isCollapsed)
		{
			range.setStart(selection.focusNode, selection.focusOffset);
			range.setEnd(selection.anchorNode, selection.anchorOffset);
		}
	}
	//alert(range);
	//range.collapse(false);

	// Create the marker element containing a single invisible character using DOM methods and insert it
	var markerEl = document.createElement("span");
	var selectionContents = range.extractContents();
	markerEl.id = "webBookHighlight";
	markerEl.style.background = "red";
	markerEl.appendChild(selectionContents);
	range.insertNode(markerEl);
});
*/

document.addEventListener('keypress', function(e){
	var unicode=e.charCode? e.charCode : e.keyCode
	var actualkey=String.fromCharCode(unicode);
	
	if(actualkey != "h"){
		return;
	}
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
});
