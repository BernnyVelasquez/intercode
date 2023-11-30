<?php
include("db-config.php");
$db = get_PDO();


function get_code($db){
    try{
            // Use prepared statement to avoid SQL injection
            $sql = "SELECT DISTINCT chatid FROM CodeRoom;";
            $stmt = $db->prepare($sql);
            $stmt->execute();

            
            $output = Array();
            foreach ($stmt as $row) {
                
                $obj = Array();
                $obj["chatid"] = $row['chatid'];
                $output[] = $obj;

                
            }

            header("Content-Type: application/json");
            echo(json_encode($output));
    

        } catch (PDOException $ex){
            echo("not working");
            handle_error("Cannot query the database", $ex);
        }   
}

get_code($db);


?>