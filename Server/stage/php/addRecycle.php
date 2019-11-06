<?php
require_once("../../db_info.php");

$conn = new mysqli($servername, $username, $password, $dbname);

$stmt = $conn->prepare("INSERT INTO recycle (question, comments, time, status) VALUES (?, ?, ?, ?)");
$stmt->bind_param("sssi", $qs, $cm, $tm, $st);
$qs = $_POST['question'];
$cm = $_POST['comments'];
$tm = $_POST['time'];
$st = $_POST['status'];
$stmt->execute();
$arr = array('status' => "successful", 'question' => $_POST['question'], 'comments' => $_POST['comments']);
echo json_encode($arr);
$conn->close();