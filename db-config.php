<?php
  # Lab: PHP and SQL
  # Configuration file for the Bricker and Morter Store API 
  error_reporting(E_ALL);
    
  # Needs function comment
  function get_PDO() {
    # Variables for connections to the database. 
    $host =  "localhost";
    $user = "bernny";                # change this
    $password = "536737";             # and this
    $dbname = "bernny";              # and this ********************************************

    # Make a data source string that will be used in creating the PDO object
    $ds = "mysql:host={$host};dbname={$dbname};charset=utf8";

    try {
      $db = new PDO($ds, $user, $password);
      $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
      return $db;
    } catch (PDOException $ex) {
      handle_error("Can not connect to the database. Please try again later.", $ex);
    }
  }
  
  # Needs function comment
  function handle_error($msg, $ex) {
    header("Content-Type: text/plain");
    print ("{$msg}\n");
    print ("Error details: $ex \n");
  }
    
?>