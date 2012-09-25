<?php
	if(isset($_POST['docText']))
		$docText = $_POST['docText'];
	else
		$docText = $_GET['docText'];
	$con = mysql_connect("localhost", "root", "1jmpgaafb");
	mysql_select_db("webBook");
	$query = "insert into annotated_pages values('" . $_SERVER['REMOTE_ADDR'] . "', '$docText')";
	mysql_query($query);
	mysql_close($con);
	echo $query;
?>
