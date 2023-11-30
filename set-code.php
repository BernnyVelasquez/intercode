<?php
include("db-config.php");
$db = get_PDO();

function addchat($db) {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Get the JSON data from the POST request
        $postData = file_get_contents("php://input");
        $jsonData = json_decode($postData, true);

        if ($jsonData !== null) {
            

            $Code = $jsonData['Code'] ?? null;
            $Id = $jsonData['Id'] ?? null;

            

            if ($Code !== null && $Id !== null) {
                try {
                    // Create a PDO connection (assuming $db is a PDO connection)
                    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

                    // Prepare and execute the SQL statement
                    $stmt = $db->prepare("INSERT INTO CodeRoom (code, chatid) VALUES (:code, :chatid)");
                    $stmt->bindParam(':code', $Code);
                    $stmt->bindParam(':chatid', $Id);
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