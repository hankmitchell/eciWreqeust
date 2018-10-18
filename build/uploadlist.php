<?php
// need to send in the account by query string
// like https://mailstripe.net/build/?email=hank@silvercrayon.com
extract( $_GET ); 

$master = json_decode( file_get_contents( "../users/eci.json.txt" ), true );


$r = glob("uploads/*");
foreach($r as $_){
if (preg_match('/\.jpg|\.gif|\.png/i',$_)){
	$master[uploadedFiles][]="https://eci.silvercrayon.us/build/$_";
	$v = print_r($master,true);
	//echo "<script>console.log('$v')</script>";
}
}

//print_r($master);


$i = 0;
$arrayOfUploadedFiles = $master[ uploadedFiles ];
if ( is_array( $arrayOfUploadedFiles ) ) {
	$arrayOfUploadedFiles = array_reverse( $arrayOfUploadedFiles );
	//$json = json_encode( $arrayOfUploadedFiles );
	foreach ( $arrayOfUploadedFiles as $key => $value ) {
		$lastslash = strrpos( $value, "/" );
		$path = substr( $value, 0, $lastslash );
		$localurl = str_replace( $path, "", $value );

		if ( file_exists( "uploads/$localurl" ) ) {
			//echo "it exists";
			$sim[ $i ][ date ] = $key;
			$sim[ $i ][ url ] = $value;
			$i++;
		}




	}
}


//echo ("<br><br>$n  total found<br>$a total loast");


header( "Content-Type: text/plain" );
header( "Access-Control-Allow-Origin: *" );
$json = json_encode( $sim );
echo $json;
exit;



echo $uploadList;