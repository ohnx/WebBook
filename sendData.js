var docText = document.body.innerHTML;
var xmlhttp = new XMLHttpRequest();
xmlhttp.open('get', "http://172.16.25.171/webBook/getData.php?docText=" + docText, true);
xmlhttp.send();
xmlhttp.onreadystatechange = function(){
	if(xmlhttp.readyState == 4 && xmlhttp.status == 200){
		alert(xmlhttp.responseText);
	}
};

