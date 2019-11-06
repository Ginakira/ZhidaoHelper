<?php
require_once('../../db_info.php');

$conn = new mysqli($servername, $username, $password, $dbname);

switch ($_GET['method']) {
    case 'getinfo':
        $sql = "SELECT * FROM pass_statistic ORDER BY total DESC";
        $result = $conn->query($sql);
        while($row = $result->fetch_array()) {
            echo "<tr>";
            echo "<td>" . $row['id'] . "</td>";
            echo "<td>" . $row['pass'] . "</td>";
            echo "<td>" . $row['back'] . "</td>";
            echo "<td>" . $row['passper'] . "%</td>";
            echo "<td>" . $row['total'] . "</td>";
            echo "<td><span class='badge badge-pill ";
            if($row['passper'] > "80") {
                echo "badge-danger'>通过率过高";
            }
            elseif ($row['passper'] > "70") {
                echo "badge-warning'>通过率偏高";
            }
            else {
                echo "badge-success'>通过率正常";
            }
            echo "</span></td>";
            echo "</tr>";
        }
        break;
}
$conn->close;