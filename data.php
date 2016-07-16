<?php
$file = 'data/data.json';

$a = new stdClass();
$a ->name = $_SERVER['cn'];
$a ->Answer = $_REQUEST['Answer'];
$a->time = date("Y-m-d h:i:sa");

$a = json_encode($a);
// Write the contents back to the file

file_put_contents($file, $a, FILE_APPEND | LOCK_EX);

?>