<?php
print_r($_SERVER);
print $_SERVER['cn'];
$file = 'data/'.mktime().'.json';
$a = new stdClass();
$a ->Answer = $_REQUEST['Answer'];
$a->time = date("Y-m-d h:i:sa");

$a = json_encode($a);
// Write the contents back to the file
file_put_contents($file, $a);
?>