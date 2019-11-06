<?php
require_once("../../db_info.php");

$conn = new mysqli($servername, $username, $password, $dbname);

$uid = $_POST['id'];
$pass = $_POST['pass'];
$back = $_POST['back'];

//判断是否已经记录，若未记录则新增
$sql = "SELECT * FROM pass_statistic WHERE id='" . $uid . "'";
$result = $conn->query($sql);
if($result->num_rows > 0) {
    $sql = "UPDATE pass_statistic SET pass=" . $pass . ", back=" . $back . " WHERE id='" . $uid . "'";
} else {
    $sql = "INSERT INTO pass_statistic (id, pass, back) VALUES ('" . $uid . "', " . $pass . ", " . $back . ")";
}

$conn->query($sql);

$conn->close();
