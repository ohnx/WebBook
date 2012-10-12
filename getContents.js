var page_url = document.location.pathname;
var args = "userGId=" + "x" + "&" + "pageurl=" + page_url;
//alert(args);

chrome.extension.sendRequest({"senderScript":"getContents", "page_url":page_url}, highlightPage);

function highlightPage(bgResponse){
//	var wbels_str = xmlhttp.responseText;
	var wbels_str = bgResponse;
	if(wbels_str == "")
		return;
		
		
//	alert('data received successfully' + " " + wbels_str);
	// split the formatted string of different highlights into an array
	var wbels = wbels_str.split("|");
	// since wbels_str ends with a "|", the last element would be blank
	wbels.pop();
	//alert("number of elements : " + wbels.length);
	
	var docText = document.body.innerHTML;
	// using the occurence information, find the starting and ending index positions of each highlight //
	// convert each highlight in the array into an Object
	for(var i = 0; i < wbels.length; i++){
		var wbel_arr = wbels[i].split(":");
		wbels[i] = new Object();
		wbels[i].occur_no = wbel_arr[0];
		wbels[i].text = wbel_arr[1];
		wbels[i].start_pos = 0;
		wbels[i].end_pos = 0;
	//	alert("start_pos : " + wbels[i].start_pos + " | " + "occur_no : " + wbels[i].occur_no + " | " + "text : " + wbels[i].text + " | " + "end_pos : " + wbels[i].end_pos);
		var occur_no = 1;
		while(occur_no <= wbels[i].occur_no){
			wbels[i].start_pos = docText.indexOf(wbels[i].text, wbels[i].end_pos);
			wbels[i].end_pos = wbels[i].start_pos + parseInt(wbels[i].text.length);
			occur_no++;
		}
		//alert("start_pos : " + wbels[i].start_pos + " | " + "text : " + wbels[i].text + " | " + "end_pos : " + wbels[i].end_pos);
	}
	
	// we need to insert the span tags in between the document text. But we need to do that from last to beginning of the text else the index positions will change //
	// sort all the elements by start position in decreasing order //
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
		docText = docText.substring(0,wbels[i].end_pos) + "</span>" + docText.substring(wbels[i].end_pos);
		var onclickCode = "removeWebBookElement(this);";
//		alert("onclickCode : " + onclickCode);
		docText = docText.substring(0,wbels[i].start_pos) + "<span name=\"WebBookElement\" style=\"background:red\" onclick=\"" + onclickCode + "\">" + docText.substring(wbels[i].start_pos);
	}

//	alert(docText);
	document.body.innerHTML = docText;
}

function copyObject(src){
	var obj = new Object();
	obj.start_pos = src.start_pos;
	obj.text = src.text;
	obj.end_pos = src.end_pos;
	return obj;
}
