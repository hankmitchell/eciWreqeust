<?php
// ECI - INDEX PAGE
extract( $_GET );
extract( $_POST );
date_default_timezone_set( 'America/New_York' );
$timestamp = date( 'Y-m-d--' ) . date( 'H-i-s' );
$loc = '//' . $_SERVER[ 'HTTP_HOST' ] . $_SERVER[ 'REQUEST_URI' ];
if ( !$_SERVER[ 'HTTP_X_HTTPS' ] && !$_SERVER[ 'HTTPS' ] ) {
	header( "Location: https://eci.silvercrayon.us/" );
	exit;
}
if ( !preg_match( '/eci\.silver/ism', $loc ) ) {
	//header( "Location: //https://eci.silvercrayon.us/" );
	//exit;
}
$ra = $_SERVER[ 'REMOTE_ADDR' ];
if ( $ra != "73.133.225.227" ) {
	//exit( "We will be back soon." );
}

function makejson( $file, $category ) {
	$_ = explode( "\n", $file );
	foreach ( $_ as $f ) {
		$f = trim( $f );
		if ( $f ) {
			$cleanName = preg_replace( '/\’|\&|\'|\!|\"/ism', "", $f );
			$subc[ name ] = $f;
			$subc[ category ] = $category;
			$subc[ cleanName ] = $cleanName;
			$master[] = $subc;
		}
	}
	return json_encode( $master );
}
//echo makejson($data,"venues");
function random2( $length ) {
	$r = str_split( "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" );
	for ( $i = 0; $i < $length; $i++ ) {
		shuffle( $r );
		$_ .= $r[ 0 ];
	}
	return ( $_ );
}
//echo random2(1200);
?>
<html>
<link href="/lib/silvercrayon.css" rel="stylesheet" type="text/css">
<link href="styles.css" rel="stylesheet" type="text/css">


<?PHP

if ( $inspect ) {
	$_ = glob( "requests/*" );
	natcasesort( $_ );
	$_ = array_reverse( $_ );

	foreach ( $_ as $x ) {
		echo "<a href='?id=$x'>$x</a><br>";
	}
	exit;
}


if ( $id )



{
	$jstr = file_get_contents( $id );
	$master = json_decode( $jstr, true );
	$out = print_r( $master, true );
	echo "<pre>$out</pre><br>
<br>$jstr<br>
<br>

";

	$_ = glob( "requests/*" );
	natcasesort( $_ );
	$_ = array_reverse( $_ );
	foreach ( $_ as $x ) {
		echo "<a href='?id=$x'>$x</a><br>";
	}
	exit;
}


if ( $_POST ) {
	$randomValue = random2( 12 );
	$requestID = "$timestamp-$randomValue";
	$filename = "$requestID.json.txt";
	$_POST[ timestamp ] = $timestamp;
	$_POST[ requestID ] = $requestID;
	$_POST[ unixtime ] = time();
	foreach ( $_POST as $key => $value ) {
		if ( $value ) {
			$master[ $key ] = $value;
		}
	}
	file_put_contents( "requests/$filename", json_encode( $master ) );

	foreach ( glob( "./*" ) as $x ) {
		if ( preg_match( '/.json.txt/', $x ) ) {
			rename( $x, "requests/$x" );
		}
	}

	exit( "Thanks for filling out the form" );
}
?>





