<?php
// Conectando, seleccionando la base de datos

$host = "designdatabase2.cg6tv9ndrugo.us-west-2.rds.amazonaws.com";
$username = "admin";
$password = "admin123456";
$database = "designdatabase";

$conn = new mysqli($host,$username,$password,$database); // conecta al servidor con user, contraseña

// Realizar una consulta MySQL
$query = "SELECT latitude, longitude FROM designdatabase.position_data"; // ultimo valor de la tabla llamada datos

$resultado = mysqli_query($conn, $query) or die("Consulta fallida: " . mysqli_error()); 
$rows[] = array(); 
 
while ($r = mysqli_fetch_array($resultado)){ 
    $rows[] = $r; 
}

echo json_encode($rows);

mysqli_close($conn);

?>

