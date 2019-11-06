<?php
require_once("../../db_info.php");

$conn = new mysqli($servername, $username, $password, $dbname);

switch ($_GET['method']) {
    case 'getinfo':
        $sql = "SELECT * FROM recycle WHERE status!=400 ORDER BY id DESC";

        $result = $conn->query($sql);
        
        while($row = $result->fetch_array()) {
            $status = $row['status'];
            echo "<tr>";
            echo "<td>" . $row['id'] . "</td>";
            echo "<td>" . $row['question'] . "</td>";
            echo "<td>" . $row['comments'] . "</td>";
            echo "<td>" . $row['time'] . "</td>";
            echo "<td><span class='badge badge-pill ";
            if($status == "310") {
                echo "badge-danger'>需要回收";
            } else if($status == "320") {
                echo "badge-success'>无需回收";
            } else {
                echo "badge-info'>等待处理";
            }
            echo "</span></td><td>" . $row['remind'] . "</td>";
            if($status == "310" || $status == "320") {
                echo "<td><button type='button' class='btn btn-success btn-sm'";
                echo " serial=" . $row['id'] . " onclick='readMark(this)'>已读</button></td>";
            } else {
                echo "<td></td>";
            }
            echo "</tr>";
        }
        break;

    case 'read':
        $sql = "DELETE FROM recycle WHERE id=" . $_GET['id'];
        $conn->query($sql);
        break;
}

$conn->close();