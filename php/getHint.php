<?php
$a = array(
    "Anna", "Brittany", "Cinderella", "Diana", "Eva",
    "Fiona", "Gunda", "Hege", "Inga", "Johanna", "Kitty",
    "Linda", "Nina", "Ophelia", "Petunia", "Amanda", "Raquel",
    "Cindy", "Doris", "Eve", "Evita", "Sunniva", "Tove", "Unni",
    "Violet", "Liza", "Elizabeth", "Ellen", "Wenche", "Vicky"
);

$fn = $_GET['n'];

if (strlen($fn) > 0) {
    $hint = "";
    for ($i = 0; $i < count($a); $i++) {
        if (strtolower($fn) == strtolower(substr($a[$i], 0, strlen($fn)))) {
            if ($hint == "") {
                $hint = $a[$i];
            } else {
                $hint = $hint . ", " . $a[$i];
            }
        }
    }
}

if($hint == "") {
    $response = "No Data";
} else {
    $response = $hint;
}

echo $response;
