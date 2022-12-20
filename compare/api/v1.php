<?php

include ("login.php");

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE');  


if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    date_default_timezone_set('America/New_York');
    $current_date = date("Y-m-d");

    $query = "SELECT user_name, words FROM words WHERE date >= '$current_date'";
    $result = $mysqli->query($query) OR DIE($mysqli->error);

    $data = [];
    while ($userRow = $result->fetch_assoc()) {
        $entry['user_name'] = $userRow['user_name'];
        $entry['words'] = json_decode($userRow['words']);
        $data[] = $entry;
    }

    header('Content-type: application/json');
    echo json_encode($data);

}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    $stmt = $mysqli->prepare("REPLACE INTO words(user_name, words) VALUES (?, ?)");
    $words = json_encode($data['words']);
    $stmt->bind_param("ss", $data['user_name'], $words);
    $stmt->execute() OR DIE($mysqli->error);
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE')
    echo "here";

    if ($_GET['user_name']) {

        echo $_GET['user_name'];

        $stmt = $mysqli->prepare("DELETE FROM words WHERE user_name = ?");
        $stmt->bind_param("s", $_GET['user_name']);
        $stmt->execute() OR DIE($mysqli->error);
    }
?>