var page_url = document.location.pathname;
var args = "userGId=" + "x" + "&" + "pageurl=" + page_url;
alert(args);

chrome.extension.sendRequest({"senderScript":"getContents", "page_url":page_url}, highlightPage);

function highlightPage(bgResponse){
//	var wbels_str = xmlhttp.responseText;
	var wbels_str = bgResponse;
	if(wbels_str == "")
		return;
		
		
	alert('data received successfully' + " " + wbels_str);
	var wbels = wbels_str.split("|");
	
	wbels.pop();
	
	// sort all the elements by start position decreasing //
	for(var i = 0; i < wbels.length; i++){
		for(j = i; j < wbels.length; j++){
			if(wbels[j].start_pos > wbels[i].start_pos){
				var temp = wbels[i];
				wbels[i] = wbels[j];
				wbels[j] = temp;
			}
		}
	}
	
	for(var i = 0; i < wbels.length; i++){
		var wbel_arr = wbels[i].split(":");
		wbels[i] = new Object();
		wbels[i].start_pos = wbel_arr[0];
		wbels[i].text = wbel_arr[1];
		wbels[i].end_pos = parseInt(wbels[i].start_pos) + parseInt(wbels[i].text.length);
		alert("start_pos : " + wbels[i].start_pos + " | " + "text : " + wbels[i].text + " | " + "end_pos : " + wbels[i].end_pos);
	}
	
	var docText = document.body.innerHTML;
	for(var i = 0; i < wbels.length; i++){
		docText = docText.substring(0,wbels[i].end_pos) + "</span>" + docText.substring(wbels[i].end_pos);
		var onclickCode = "var nodeText = document.createTextNode('" + docText.substring(wbels[i].start_pos, wbels[i].end_pos) + "'); this.parentNode.replaceChild(nodeText, this)";
		alert("onclickCode : " + onclickCode);
		docText = docText.substring(0,wbels[i].start_pos) + "<span name=\"WebBookElement\" style=\"background:red\" onclick=\"" + onclickCode + "\">" + docText.substring(wbels[i].start_pos);
	}

	alert(docText);
	document.body.innerHTML = docText;
}

function copyObject(src){
	var obj = new Object();
	obj.start_pos = src.start_pos;
	obj.text = src.text;
	obj.end_pos = src.end_pos;
	return obj;
}
