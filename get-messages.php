<?php
include("db-config.php");
$db = get_PDO();


function get_code($db){
    try{
        if(isset($_GET['chatRoomId']) ){
            
            $chatRoomId = trim($_GET['chatRoomId']);
            
    
            // Use prepared statement to avoid SQL injection
            $sql = "SELECT chat, user FROM ChatRoom WHERE chatid = :chatid ORDER BY time ASC;";
            $stmt = $db->prepare($sql);
            $stmt->bindParam(':chatid', $chatRoomId, PDO::PARAM_STR);
            $stmt->execute();

            
            $output = Array();
            foreach ($stmt as $row) {
                
                $obj = Array();
                $obj["chat"] = $row['chat'];
                $obj["user"] = $row["user"];
                $output[] = $obj;

                
            }

            header("Content-Type: application/json");
            echo(json_encode($output));
    }

        } catch (PDOException $ex){
            echo("not working");
            handle_error("Cannot query the database", $ex);
        }   
}

get_code($db);


?>