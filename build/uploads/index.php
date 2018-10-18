<?
extract( $_GET );
extract( $_POST );
date_default_timezone_set( 'America/New_York' );
$timestamp = date( 'Y-m-d--' ) . date( 'H-i-s' );

require_once( '../../lib/functions.php' );
//require_once( '../login.php' );
$master[ email ] = "eci";
$master[ companyName ] = "eciCordish";

$master[accountType]="pro";

$usser = $master[companyName];
$usser = str_replace("@","-",$usser);





$r = glob("*");
foreach($r as $_){
if (preg_match('/\.jpg|\.gif|\.png/i',$_)){
	$master[uploadedFiles][]="https://eci.silvercrayon.us/build/uploads/$_";
	//print_r($master);
}
}




$arrayOfUploadedFiles = $master[uploadedFiles];
if(is_array($arrayOfUploadedFiles)){
	$arrayOfUploadedFiles = array_reverse($arrayOfUploadedFiles);
	foreach ($arrayOfUploadedFiles as $key => $value){
		$uploadList .= "<a href='#' onClick='getImgInfo(\"$value\")'><img src='$value' title='Modified: $key' style='margin:8px;max-height:100px;float:left; display:inline;'></a>\n\n";
	}
}


if ($delete){
	foreach ($master[uploadedFiles] as $key => $value){
		//echo "$key => $value<br>";
		if ($value == $delete){
			
			unset($master[uploadedFiles][$key]);
		}
	}
	
	//update the database
	$jsonName = $master[ email ] . ".json.txt";
	file_put_contents( "../../users/$jsonName", json_encode( $master ) );
	header("Location: ./");
	exit;
}



function MSidclean( $file ) { /// have to leave dots!!!!!
	$file = trim( $file );
	$file = preg_replace( '/[^a-zA-Z0-9.]+/ism', '-', $file );
	$file = preg_replace( '/-+/i', '-', $file );
	$file = preg_replace( '/(\.|-)(\.|-)+/i', '.', $file );
	$file = rtrim( $file, '-' );
	$file = ltrim( $file, '-' );
	$file = rtrim( $file, '.' );
	$file = ltrim( $file, '.' );
	return $file;
}


function MSfilenamerandomizer( $nameoffile, $len ,$usser) {
	if ( !$len ) {
		$len = 10;
	}
	$dotcheck = preg_match_all( '/\./i', $nameoffile, $wary );
	if ( !$dotcheck ) {
		echo 'File requires a dot extension';
		exit;
	}
	$extension = substr( $nameoffile, strrpos( $nameoffile, '.' ), strlen( $nameoffile ) );
	$origname = str_replace( $extension, '', $nameoffile );
	$randomad = getrandom( $len );
	$nameoffile = $origname . '-' . $randomad . $extension;
	$nameoffile = 'Powered' . '-' . $usser.'-'. $randomad . $extension;
	return $nameoffile;
}

// look for pasted image data coming in


if ($idata){
	
	$dir = "quickPaste/";
//print_r($_POST);
$imagepng = $_POST['idata'];
$iname = $_POST['iname'];
	
	if ($master[accountType]!="pro"){
		$iname = "MSX32-$iname";
	}
	
	
//echo "found image: $imagepng";
if ( $imagepng ) {
//echo "found imagepng";
$imagepng = str_replace( '"', '', $imagepng );
$imagepng2 = str_replace( "data:image/png;base64,", "", $imagepng );
$decodedData = base64_decode( $imagepng2 );
//$decodedData = file_get_contents($imagepng);
$iname = $dir.$iname;
file_put_contents( $iname, $decodedData );
$imageURL = $iname;
$file_size = filesize ($imageURL);


$filek = $file_size / 1024;
$filek = round($filek, 1);

if ($filek>200){
//if file size over 200k save as jpg	
    $image = imagecreatefrompng($imageURL);
	$newjpgname = str_replace(".png",".jpg",$imageURL);
    imagejpeg($image, $newjpgname, 80);
    imagedestroy($image);
	unlink( $imageURL );
	$imageURL = $newjpgname;
}


$ia = getimagesize( $imageURL );
$newurl = "https://eci.silvercrayon.us/build/uploads/$imageURL";
	//exit($_FILES[ 'userfile' ][ 'tmp_name' ].$newurl);
	if ( $ia[ 0 ] < 3 ) {
		//file_put_contents( "upload.txt", 'error' );
		unlink( "$filename" );
		exit( "Wrong kind of file. - exiting. error 22" );
	}
	//file_put_contents( "upload.txt", $filename );
	if ( $ia[ 0 ] > 800 ) {
		//echo $ia[0]; exit;
		//resample
		$maxwidth = 650;
		$reproxyurl = 'https://silvercrayon.us/apps/reproxy/';
		$proxyurl = $reproxyurl . '?maxwidth=' . $maxwidth . '&newurl=' . $newurl;
		$reimage = file_get_contents( $proxyurl );
		$reimage = trim( $reimage );
		$simage = file_get_contents( $reimage );
		$proxyname = substr( $reimage, strrpos( $reimage, '/' ), strlen( $reimage ) );
		$proxyname = str_replace( '/', '', $proxyname );
		$proxyname = $dir.$proxyname;
		file_put_contents(  $proxyname, $simage );
		$testimage = $proxyname;
		file_put_contents( "upload.txt", $proxyname );
		unlink( $imageURL );
		$newurl = "https://eci.silvercrayon.us/build/uploads/$proxyname";
		$imageURL = $proxyname;
	}




$master[uploadedFiles][$timestamp]  = $newurl;
	$jsonName = $master[ email ] . ".json.txt";
	file_put_contents( "../../users/$jsonName", json_encode( $master ) );
}
header("Location: ?idata=0");
exit;
}
	
	

$_FILES[ '1' ][ 'myimage.jpg' ];
//exit($usser);

if ( !empty( $_FILES ) ) {
	file_put_contents( "arraydump.file.uploaded.txt", print_r($_FILES,true) );
	file_put_contents( "current.usser.txt", $usser );
	$filename = MSidclean( $_FILES[ 'file' ][ 'name' ]);
	$filename = MSfilenamerandomizer(  $filename, 10,$usser );
	if ($master[accountType]!="pro"){
		$filename = "MSX32-$filename";
	}
	file_put_contents( "last.file.uploaded.txt", $filename );
	
	setcookie("lastfileuploaded","https://eci.silvercrayon.us/build/uploads/$filename", time()+40,"/"); // 48 hours
	
	
	
	
?>

<script>console.log("<?=$filename;?>");</script>

<?
	if ( !preg_match( '/\.jpg|\.png|\.gif|\.jpeg$/i', $filename ) ) {
		file_put_contents( "upload.txt", 'error' );
		exit( "Wrong kind of file. - exiting." );
	}
	move_uploaded_file( $_FILES[ 'file' ][ 'tmp_name' ], $filename ); //6 
	$newurl = "https://eci.silvercrayon.us/build/uploads/$filename";
	$testimage = $newurl;
	$ia = getimagesize( $newurl );
	if ( $ia[ 0 ] < 3 ) {
		file_put_contents( "upload.txt", 'error' );
		unlink( "$filename" );
		exit( "Wrong kind of file. - exiting." );
	}
	file_put_contents( "upload.txt", $filename );
	if ( $ia[ 0 ] > 3000 ) {
		//echo $ia[0]; exit;
		//resample
		$maxwidth = 650;
		$reproxyurl = 'https://silvercrayon.us/apps/reproxy/';
		$proxyurl = $reproxyurl . '?maxwidth=' . $maxwidth . '&newurl=' . $newurl;
		$reimage = file_get_contents( $proxyurl );
		$reimage = trim( $reimage );
		$simage = file_get_contents( $reimage );
		$proxyname = substr( $reimage, strrpos( $reimage, '/' ), strlen( $reimage ) );
		$proxyname = str_replace( '/', '', $proxyname );
		file_put_contents(  $proxyname, $simage );
		$testimage = $proxyname;
		file_put_contents( "upload.txt", $proxyname );
		unlink( $filename );
		$newurl = "https://eci.silvercrayon.us/build/uploads/$proxyname";
	}
	//header("Location: demo.php?testimage=$testimage"); 
// add this image to the users database
	$master[uploadedFiles][$timestamp]  = $newurl;
	$jsonName = $master[ email ] . ".json.txt";
	file_put_contents( "../../users/$jsonName", json_encode( $master ) );
}

//header("Location: ?file=$filename"); 


$form = '
<html>
<link href="/lib/silvercrayon.css" rel="stylesheet" type="text/css">
<style>
html, tablr,td,tr, body, p, em{
	
	font-family:segoe ui;
	font-size:15px;
	}
	#formContainer{    background-image: url(../../upload-cloud.gif);
    background-size: contain;
    background-repeat: no-repeat;}
	.dz-message{    background-image: url(../../upload-cloud.gif);
    background-size: contain;
    background-repeat: no-repeat;
	height:90px;}
</style>
<body>

Upload an image in JPG, PNG, or GIF format by dragging into the upload zone<br>
Or you can paste an image from the clipboard.<br><br>





<script src="../../dropzone.js"></script>
<link href="../../dropzone.css" type="text/css" rel="stylesheet"  />
<div id="formContainer">
<form  action="' . $_SERVER[ PHP_SELF ] . '" class="dropzone" id="filedrop">

		</form>
</div>

<form id="pasteform" style="display:none" method="post" action="' . $_SERVER[ PHP_SELF ] . '">
<input id="idata" name="idata" style="display:none">
<input id="iname" name="iname" style="display:none">
<span id="lester"></span>
<br>
<br>
<input type="submit" value="upload pasted image" class="orangesubmitbox1">
</form>



Media library:<br><br>

<div style="padding:20px;display:none;width:100%; height:100px;clear:both;" id="imgInfo"></div>

<div style="display:none;" id="theURL"></div>

<div style="clear:both;"></div>'.$uploadList.'


<script>
Dropzone.options.filedrop = {
    maxFilesize: 44096,
    init: function () {
        this.on("complete", function (file) {
            //alert(\'uploaded!\');
			window.location = "/build/uploads/";
        });
    }
};

//dz-message
function getImgInfo(imgURL){
//alert(imgURL);
document.getElementById("imgInfo").style.display = "block";
document.getElementById("imgInfo").style.height = "auto";
document.getElementById("imgInfo").innerHTML = "<a href=\'"+imgURL+"\' target=\'_blank\'><img src=\'"+imgURL+"\' style=\'max-height:200px;\'></a><br>";
document.getElementById("imgInfo").innerHTML += "<b>Image URL: </b><br><i id =\"uurl\">"+imgURL+"</i>";
document.getElementById("imgInfo").innerHTML += "<br><br><b onClick=\"CopyToClipboardSimple(\'uurl\')\" class = \'orangesubmitbox1\' style=\'color:white;cursor:pointer;\' id=\'cmes\'>Copy image URL to clipboard</b> <a class = \'orangesubmitbox1\' style=\'color:white;cursor:pointer;\' href=\"?delete="+imgURL+"\">remove this item</a>";
document.getElementById("theURL").innerHTML = imgURL;
}

function CopyToClipboardSimple( containerid ) {
//document.getElementById("theURL").style.display = "block";
//document.getElementById("imgInfo").style.display = "block";
document.getElementById("cmes").innerHTML = "Copied.";

   
	  if ( document.selection ) {
        document.selection.empty();
    } else if ( window.getSelection ) {
        window.getSelection().removeAllRanges();
    }  



			// pass in the ID of the container you want copied   
			if ( document.selection ) {
				document.selection.empty();
			} else if ( window.getSelection ) {
				window.getSelection().removeAllRanges();
			}

			if ( document.selection ) {
				var range = document.body.createTextRange();
				range.moveToElementText( document.getElementById( containerid ) );
				range.select().createTextRange();
				document.execCommand( "Copy" );

			} else if ( window.getSelection ) {
				var range = document.createRange();
				range.selectNode( document.getElementById( containerid ) );
				window.getSelection().addRange( range );
				document.execCommand( "Copy" );

			}
			//var linkid = "Link" + containerid;
			//localStorage.setItem("plink", linkid);
			//document.getElementById(linkid).innerHTML = "OK, copied!";
			//document.getElementById(linkid).style.color = "green";
			//document.getElementById("theList").style.display = "none";
			//document.getElementById("theEdit").style.display = "none";
			//document.getElementById("theSource").style.display = "none";
			
			


			
		}



</script>
</body>
</html>';
echo $form;

//$shell = file_get_contents( "../../shell.html" );
$iscript = file_get_contents( "imagepaste.js" );
$htmlcode = str_replace( '$$content', $form, $shell );// Demo mode - upload artwork below
$htmlcode = str_replace( "Demo mode - upload artwork below", "Account: {$master[ email ]} - upload artwork below", $htmlcode );
$htmlcode = str_replace( '</body>', "$iscript</body>", $htmlcode );
exit( $htmlcode );
?>