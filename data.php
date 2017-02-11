<?php
$file = 'data/data.json';

$a = new stdClass();
$a ->netID = $_SERVER['cn'];
$a ->name = $_SERVER['givenName'] . ' ' . $_SERVER['sn'];
$a ->mode = $_REQUEST['gameMode'];
$a ->time = $_REQUEST['time'];
$a->date = date("Y-m-d h:i:sa");

$a = json_encode($a);
// Write the contents back to the file

file_put_contents($file, $a, FILE_APPEND | LOCK_EX);

?>