<script>
function makeid(len) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < len; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}
function _getImage(imgData)
{
    var blob = imgData.getAsFile();
    var URLObj = window.URL || window.webkitURL;
    var source = URLObj.createObjectURL(blob);
    var image = new Image();
    image.src = source;
	image.style.maxWidth = "600px";
	document.getElementById("idata").value = image.src;
    image.onload = function(ev) {
        var reader = new FileReader();
        reader.onload = function(e)
        {
            image.src = e.target.result;
			var id = "mailstripe.net-"+makeid(15)+".png";
			document.getElementById("idata").value = e.target.result;
			document.getElementById("iname").value = id;
			document.getElementById("pasteform").style.display = "block";
			//document.getElementById("filedrop").style.display = "none";
			//document.getElementById("filepicker").required = false;
		
        };
        reader.readAsDataURL(blob);
    };

    return image;
}

document.addEventListener("paste", function(e){
    console.log("Got Paste.");
    if (e.clipboardData && typeof e.clipboardData.items !== "undefined")
    {
        var items = e.clipboardData.items;
        for (var i = 0; i < items.length; i++)
        {
            if (items[i].type.indexOf("image") != -1)
            {
                var image = _getImage(items[i]);
                if (image) //paste the image
                {
                    console.log("Got Image");
                    document.getElementById("lester").appendChild(image);
					//document.getElementById("lester")=image;
					///document.getElementById("remind").style.display = "none";
					//document.getElementById("forImage").innerHTML  += image;
					
                }
            }
        }
    }
});

</script>	
	
	