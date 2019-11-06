<?php
require_once("./db_info.php");

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

$conn = new mysqli($servername, $username, $password, $dbname);

if($_GET["ord"] == "create") {
    $stmt = $conn->prepare("INSERT INTO pass_statistic (id, pass, back) VALUES (?, ?, ?)");
    $stmt->bind_param("sii", $id, $ps, $bk);
    $id = $_GET["uid"];
    $ps = $_GET["ps"];
    $bk = $_GET["bk"];
    $stmt->execute();
}
if($_GET["ord"] == "updatePs") {
    $sql = "UPDATE pass_statistic SET pass=" . $_GET["count"] . " WHERE id='" . $_GET["uid"] . "'";
    $conn->query($sql);
}

if($_GET["ord"] == "updateBk") {
    $sql = "UPDATE pass_statistic SET back=" . $_GET["count"] . " WHERE id='" . $_GET["uid"] . "'";
    $conn->query($sql);
}

$conn->close();