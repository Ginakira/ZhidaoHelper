<?php
require_once("../../db_info.php");

$conn = new mysqli($servername, $username, $password, $dbname);

switch ($_GET['method']) {
    case 'getinfo':
        $sql = "SELECT * FROM recycle WHERE status=200 ORDER BY id";
        $result = $conn->query($sql);
        
        while($row = $result->fetch_array()) {
            $status = $row['status'];
            echo "<tr>";
            echo "<td>" . $row['id'] . "</td>";
            echo "<td>" . $row['question'] . "</td>";
            echo "<td>" . $row['comments'] . "</td>";
            echo "<td>" . $row['time'] . "</td>";
            echo "<td><button type='button' class='btn btn-danger btn-sm'";
            echo " serial=" . $row['id'] . " onclick='back(this)'>需回收</button>";
            echo "<button type='button' class='btn btn-success btn-sm'";
            echo " serial=" . $row['id'] . " onclick='keep(this)'>不回收</button>";
            echo "</td>";
            echo "</tr>";
        }
        break;

    case 'back':
        $sql = "UPDATE recycle SET status=310 WHERE id=" . $_GET['id'];
        $conn->query($sql);
        echo mysqli_affected_rows($conn);
        break;
    case 'keep':
        $sql = "UPDATE recycle SET status=320 WHERE id=" . $_GET['id'];
        $conn->query($sql);
        break;
}

$conn->close();