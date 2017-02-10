<?php
$file = 'data/intro.json';

$a = new stdClass();
$a ->name = $_SERVER['givenName'] . ' ' . $_SERVER['sn'];
$a ->mode = $_REQUEST['Mode'];
$a->time = date("Y-m-d h:i:sa");

$a = json_encode($a);
// Write the contents back to the file

file_put_contents($file, $a, FILE_APPEND | LOCK_EX);

?>