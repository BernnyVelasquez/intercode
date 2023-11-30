<?php
include("db-config.php");
$db = get_PDO();

function addchat($db) {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Get the JSON data from the POST request
        $postData = file_get_contents("php://input");
        $jsonData = json_decode($postData, true);

        if ($jsonData !== null) {
            

            $user = $jsonData['User'] ?? null;
            $chat = $jsonData['Chat'] ?? null;
            $time = (int)$jsonData['Time'] ?? null;
            $id = $jsonData['Id'] ?? null;

            

            if ($user !== null && $chat !== null && $time !== null && $id !== null) {
                try {
                    // Create a PDO connection (assuming $db is a PDO connection)
                    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

                    // Prepare and execute the SQL statement
                    $stmt = $db->prepare("INSERT INTO ChatRoom (user, chat, time, chatid) VALUES (:user, :chat, :time, :id)");
                    $stmt->bindParam(':user', $user);
                    $stmt->bindParam(':chat', $chat);
                    $stmt->bindParam(':time', $time, PDO::PARAM_INT);
                    $stmt->bindParam(':id', $id);
                    $stmt->execute();

                    echo "Data inserted successfully";
                } catch (PDOException $ex) {
                    echo "Error: " . $ex->getMessage();
                }
            } else {
                echo "Invalid data format";
            }
        } else {
            // Unable to decode JSON data
            echo "Invalid JSON format";
        }
    } else {
        echo "This script only accepts POST requests.";
    }
}

addchat($db);

?>