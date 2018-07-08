<?php
$host = "designdatabase2.cg6tv9ndrugo.us-west-2.rds.amazonaws.com";
$username = "admin";
$password = "admin123456";
$database = "designdatabase";
// conecta al servidor con user, contraseña
$conn = new mysqli($host,$username,$password,$database); 

if (isset($_POST['id_latitude']))
{
    $latitude = $_POST['id_latitude'];
}
else
{
    echo "no hay latitud\n";
}

if (isset($_POST['id_longitude']))
{
    $longitude = $_POST['id_longitude'];
}
else
{
 	echo "no hay longitud\n";
}
$query = "SELECT * FROM designdatabase.position_data WHERE datetime BETWEEN '".$datetime_start."' AND '".$datetime_end."' ORDER BY id"; 

$query = "SELECT latitude, longitude, datetime,
6371000 * ACOS( 
SIN( radians(latitude) ) * SIN( radians('".$latitude."') ) + 
COS( radians(latitude) ) * COS( radians('".$latitude."') * COS( radians('".$longitude."') - radians(longitude) ) ) )
AS distance
from designdatabase.position_data
having distance < 51
order by datetime asc";

$resultado = mysqli_query($conn, $query) or die("Consulta fallida: " . mysqli_error()); 
$rows[] = array(); 
 
while ($r = mysqli_fetch_array($resultado)){ 
    $rows[] = $r; 
}

echo json_encode($rows);

mysqli_close($conn);

?>

