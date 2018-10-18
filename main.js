'use strict';




var ulcontain = document.getElementById("displayUploadedFiles");
if (ulcontain) {
	ulcontain.innerHTML = "<img src='images/spin.gif'  style='height:100px;'>";
}

function displayUploadedFiles() {
	document.getElementById("imgInfo").innerHTML = "";
	ulcontain.innerHTML = "<img src='/images/spin.gif' style='height:100px;'>";
	var email = "eci";
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			//console.log( xhttp.responseText );
			var payload = JSON.parse(xhttp.responseText);
			console.log(payload.length);
			ulcontain.innerHTML = "";
			var theUploadedFile = payload[0].url.trim();
			
			if (getCookie("mediaDivToUpdate")) {
				var mdtu = getCookie("mediaDivToUpdate");
				mdtu += "UL";
				var lastfileuploaded = decodeURIComponent(getCookie("lastfileuploaded"));


				document.getElementById("mediaDiv").style.display = "none";
				//alert(`the media div to update will be ${mdtu}`);
				//document.getElementById( mdtu ).setAttribute = ( "onclick", "javascript: var trash=0;" );
				//document.getElementById( mdtu ).setAttribute = ( "name", mdtu );
				//document.getElementById( mdtu ).innerHTML = theUploadedFile;
				document.getElementById(mdtu).outerHTML += `<input name="${mdtu}" value="${lastfileuploaded}" style="width:400px;">`;

				console.log(`Trying to update ${mdtu} to ${lastfileuploaded}`)


				//									ulcontain.innerHTML += `<a href='#' onClick='getImgInfo(\"${iurl}\")'><img src='${iurl}' title='Modified: ${datem}' style='margin:8px;max-height:100px;float:left; display:inline;'></a>\n\n`;
				//console.log(`tryin ${iurl}`);

			}

		}
	};


	xhttp.open("GET", "https://eci.silvercrayon.us/build/uploadlist.php?email=eci", true);
	xhttp.send();



}







Dropzone.options.filedrop = {
	maxFilesize: 44096,
	init: function () {
		this.on("complete", function (file) {
			displayUploadedFiles();
		});
	}
};
//dz-message





function getImgInfo(imgURL) {
	//alert(imgURL);
	document.getElementById("imgInfo").style.display = "block";
	document.getElementById("imgInfo").style.height = "auto";
	document.getElementById("imgInfo").innerHTML = "<a href='" + imgURL + "' target='_blank'><img src='" + imgURL + "' style='max-height:200px;'></a><br>";
	document.getElementById("imgInfo").innerHTML += "<b>Image URL: </b><br><i id =\"uurl\">" + imgURL + "</i>";
	document.getElementById("imgInfo").innerHTML += "<br><br><b onClick=\"CopyToClipboardSimple('uurl')\" class = 'orangesubmitbox1' style='color:white;cursor:pointer;' id='cmes'>Copy image URL to clipboard</b> <a class = 'orangesubmitbox1' style='color:white;cursor:pointer;' onClick=\"ajaxDelete('" + imgURL + "')\" >remove this item</a>";
	document.getElementById("theURL").innerHTML = imgURL;
}

function CopyToClipboardSimple(containerid) {
	//document.getElementById("theURL").style.display = "block";
	//document.getElementById("imgInfo").style.display = "block";
	document.getElementById("cmes").innerHTML = "Copied.";
	if (document.selection) {
		document.selection.empty();
	} else if (window.getSelection) {
		window.getSelection().removeAllRanges();
	}
	// pass in the ID of the container you want copied 
	if (document.selection) {
		document.selection.empty();
	} else if (window.getSelection) {
		window.getSelection().removeAllRanges();
	}
	if (document.selection) {
		var range = document.body.createTextRange();
		range.moveToElementText(document.getElementById(containerid));
		range.select().createTextRange();
		document.execCommand("Copy");
	} else if (window.getSelection) {
		var range = document.createRange();
		range.selectNode(document.getElementById(containerid));
		window.getSelection().addRange(range);
		document.execCommand("Copy");
	}

}

if (location.href.match(/mediastate/i)) {
	show('mediaDiv');
}


function makeid(len) {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for (var i = 0; i < len; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	return text;
}

function _getImage(imgData) {
	var blob = imgData.getAsFile();
	var URLObj = window.URL || window.webkitURL;
	var source = URLObj.createObjectURL(blob);
	var image = new Image();
	image.src = source;
	image.style.maxWidth = "600px";
	document.getElementById("idata").value = image.src;
	image.onload = function (ev) {
		var reader = new FileReader();
		reader.onload = function (e) {
			image.src = e.target.result;
			var id = "eciuploader-" + makeid(15) + ".png";
			document.getElementById("idata").value = e.target.result;
			document.getElementById("iname").value = id;
			document.getElementById("pasteform").style.display = "block";

		};
		reader.readAsDataURL(blob);
	};
	return image;
}

function ajaxDelete(uurl) {
	var xhttp = new XMLHttpRequest();
	xhttp.open("GET", "https://eci.silvercrayon.us/build/uploads/?delete=" + uurl, true);
	xhttp.send();
	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			displayUploadedFiles();
			//console.log(xhttp.responseText);
		}
	};
}





document.addEventListener("paste", function (e) {
	console.log("Got Paste.");
	if (e.clipboardData && typeof e.clipboardData.items !== "undefined") {
		var items = e.clipboardData.items;
		for (var i = 0; i < items.length; i++) {
			if (items[i].type.indexOf("image") != -1) {
				var image = _getImage(items[i]);
				if (image) //paste the image
				{
					console.log("Got Image");
					document.getElementById("lester").appendChild(image);
					//document.getElementById("lester")=image;
					///document.getElementById("remind").style.display = "none";
					//document.getElementById("forImage").innerHTML += image;
				}
			}
		}
	}
});

if (document.getElementById("closeButton")) {
	document.getElementById("closeButton").addEventListener("click", function () {
		hide("mediaDiv");
	});
}


function populatenameRank() {
	var a = "";
	a = document.getElementById("fullname").value;
	a += " | " + document.getElementById("email").value;
	a += " | " + document.getElementById("Q2venue").value;
	document.getElementById("nameRank").innerHTML = a;
	document.getElementById("identity").style.display = "none";
	a = "";
}

function uploader(div) {
	document.getElementById("mediaDiv").style.display = "block";
	setcookie("mediaDivToUpdate", div, 300);
}


var increment = (function (n) {
	return function () {
		n += 1;
		return n;
	}
}(0));




function setAllInputs(forminputs) {
	for (var i = 0; i < forminputs.length; i++) {
		document.getElementById(forminputs[i]["name"]).value = forminputs[i]["value"];
	}
	console.log(forminputs);
}





function setcookie(name, value, days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000); // ) removed
		var expires = "; expires=" + date.toGMTString(); // + added
	} else
		var expires = "";
	document.cookie = name + "=" + value + expires + ";path=/"; // + and " added
}

function setBasicCookies() {
	setcookie("fullname", document.getElementById("fullname").value, 300);
	setcookie("Q2venue", document.getElementById("Q2venue").value, 300);
	setcookie("email", document.getElementById("email").value, 300);
}

function showOnce(id) {
	populatenameRank();
	document.getElementById(id).style.display = "block";
	hideContinueButtons();
}

function show(id) {
	populatenameRank();
	var t = document.getElementsByClassName("initialHide");
	for (var i = 0; i < t.length; i++) {
		t[i].style.display = "none";
	}
	if (document.getElementById(id).style.display != "block") {
		document.getElementById(id).style.display = "block";
	} else {
		document.getElementById(id).style.display = "none";
	}
}

function hide(id) {
	document.getElementById(id).style.display = "block";
	document.getElementById(id).style.visibility = "hidden";
	document.getElementById(id).style.height = "0px";
	document.getElementById(id).style.position = "absolute";
}

function hideall(id) {
	var t = document.getElementsByClassName("initialHide");
	for (var i = 0; i < t.length; i++) {
		if (t[i].id !== id) {
			hide(id);
		}
	}
}

function divToList(id) {

	var names = new Array("g");
	//var payload = document.getElementById( id ).innerHTML;

	//var list = JSON.parse( payload );
	var list = obj23.venues;
	//console.log(list);
	for (var i = 0; i < list.length; i++) {
		var elem = document.createElement('div');
		elem.innerHTML = `<a href='javascript://' style="color:white;text-decoration:none;" onclick='selectVenue("${list[i].name}", "Q2venue")'>✔️ ${list[i].name}</a>`;
		elem.className = "prepop";
		//elem.className = "hinput";
		var supCleanName = list[i].cleanName.replace(/[^a-zA-Z]+/ig, "-")
		elem.id = supCleanName;
		names[i] = supCleanName;
		document.getElementById('iwrapper').appendChild(elem);
		var elem = "";
		//console.log(supCleanName);
	}
	return names;
}
//console.log(obj23);
var venueArray = obj23.venues;
var fgd = divToList("venues");
//console.log( venueArray );
function hideAllPrePops() {
	var hj = document.getElementsByClassName("prepop");
	for (var i = 0; i < hj.length; i++) {
		hj[i].style.display = "none";
	}
}

function selectVenue(n, id) {
	hideAllPrePops();
	document.getElementById(id).value = n;
}

function prePopulateInput(id) {

	hideAllPrePops();
	var e = 0;
	var stringPart = document.getElementById(id).value;
	console.log(stringPart);
	if (!stringPart) {
		hideAllPrePops();
		return;
	}
	for (var i = 0; i < venueArray.length; i++) {
		var theCandidate = venueArray[i].cleanName.replace(/[^a-zA-Z]+/ig, "-")
		//var theCandidate = venueArray[ i ].cleanName;


		var re = new RegExp(stringPart, 'ig');
		if (theCandidate.match(re) && document.getElementById(theCandidate)) {
			e++;
			document.getElementById(theCandidate).style.display = "block";
		}
		if (!theCandidate.match(re) && document.getElementById(theCandidate)) {
			e++;
			document.getElementById(theCandidate).style.display = "none";
		}
	}
}

function saveUserState() {
	var currentdate = new Date();
	var datetime = currentdate.getFullYear() + "-" +
		(currentdate.getMonth() + 1) + "-" +
		(currentdate.getDate()) + "-" +
		currentdate.getHours() + "-" +
		currentdate.getMinutes() + "-" +
		currentdate.getSeconds();
	var g = [];
	var f = {};
	var arr = document.querySelectorAll('input,textarea,select');
	for (var i = 0; i < arr.length; i++) {
		if (arr[i].value && arr[i].id) {
			var propq = arr[i].id;
			//console.log(propq);
			var val = arr[i].value;
			f[propq] = val;
			//g[i] = f;
		}
	}
	// now do the textareas
	//console.log( f );
	var jstr = JSON.stringify(f);
	localStorage.setItem("formSaveLast", JSON.stringify(f));
	localStorage.setItem("formSave-" + datetime, JSON.stringify(f));
	//document.getElementById('saveState').value = "Your progress has been saved.";
	//document.getElementById('saveState').style.backgroundColor = "black";
	document.getElementById('saveState').style.display = "block";

}


if (document.getElementById('saveState')) {
	document.getElementById('saveState').addEventListener("click", saveUserState);
}

function hideModals() {
	var modals = document.getElementsByTagName("DIV");
	if (modals) {
		for (var i = 0; i < modals.length; i++) {
			if (modals[i].id.match(/modal/ig)){
			hide(modals[i])
		}
	}
}
}


function getCookie(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}
if (getCookie("fullname")) {
	document.getElementById('fullname').value = getCookie("fullname");
}
if (getCookie("Q2venue")) {
	document.getElementById('Q2venue').value = getCookie("Q2venue");
}
if (getCookie("email")) {
	document.getElementById('email').value = getCookie("email");
}

function getLocal() {
	var archive = [],
		keys = Object.keys(localStorage),
		i = 0,
		key;
	for (; key = keys[i]; i++) {
		archive.push(key + '=' + localStorage.getItem(key));
	}
	return archive;
}

function revertFormState(payload) {
	var out = "Your form has been reverted to a previous state.\n\n";
	var objpay = JSON.parse(decodeURI(payload));
	var f = Object.keys(objpay);
	for (var i = 0; i < f.length; i++) {
		var kkey = f[i];
		var vvalue = objpay[kkey];
		if (document.getElementById(kkey)) {
			document.getElementById(kkey).value = vvalue;
		}
		out += `The Value for ${kkey} has been set to ${vvalue}\n`;
	}
	alert(out);
	hide("savedWork");
}

function loadUpRestoreButton() {
	if (!localStorage.getItem("formSaveLast")) {
		return;
	}
	var lastSavedState = localStorage.getItem("formSaveLast");
	var payload = encodeURI(lastSavedState);
	document.getElementById("recoverState").setAttribute("onclick", `revertFormState('${payload}')`);
	//alert(lastSavedState);
}










function showHide(d1, d2) {
	document.getElementById(d1).style.display = "block";
	document.getElementById(d2).style.display = "none";
}
if (document.getElementById("savedWork")) {
	document.getElementById("savedWork").innerHTML += t;

	loadUpRestoreButton();
	//show( "savedWork" );
}




function displayVars() {
	var f = {};
	var arr0 = document.querySelectorAll('div');
	for (var i = 0; i < arr0.length; i++) {

		arr0[i].style.display = "bloack";

	}
	var arr = document.querySelectorAll('input,textarea,select');
	for (var i = 0; i < arr.length; i++) {
		if (arr[i].value && arr[i].id) {
			var propq = arr[i].id;

			var val = arr[i].value;
			f[propq] = val;

		}
	}
	var jstr = JSON.stringify(f);
	document.getElementById("displayVars").outerHTML += "<br><br>" + jstr + "<br><br>";
}









///////////////////////////////////////////////////////////
//////// begin ind js
//////////////////////////////////////////////////


var data = `graphic_design_print
apparel_promo_novelty_uniform
ticketing_reorder
staff_business_cards
menu
email_newsletter
apparel_promo
apparel_novelty
apparel_uniform
ticketing
ticketing_type_main
ticketfly_email_campaign
website_updates
website_error
facebook_instagram_ad_general
facebook_instagram_ad_third_party
social_media_contest
snapchat_campaign
wifi_email_campaign
gift_cards
loyalty_cards
promotional_cards
video_editing
new_menu
menu_changes
google_advertising
eci_object_key_names
venues`;


function look(obj) {
	var sd = (obj['eci_object_key_names']);
	//console.log(sd);
	for (var i = 0; i < sd.length; i++) {
		//console.log(sd[i].value);
		var p = sd[i].value; // p is now an array

		for (var y = 0; y < p.length; y++) {
			//console.log(p + " value " + obj[p][y].value + " type " + obj[p][y].type)
		}
	}
}

function buildMainbuttons(mode) {
	document.getElementById("buttonContainer" + mode).style.visibility = "";
	var elem = document.getElementById("initialbuttonContainer");
	elem.style.visibility = "hidden";
	elem.style.height = "0px";
	elem.style.position = "absolute";

	if (document.getElementById("buttonContainer" + mode).textContent.length > 100) {
		return;
	}


	var obj = obj23;
	//
	//var xhttp = new XMLHttpRequest();
	//	xhttp.onreadystatechange = function () {
	//		if (this.readyState == 4 && this.status == 200) {
	//			var obj = JSON.parse(xhttp.responseText)
	//		}
	//	}
	//xhttp.open("GET", "https://eci.silvercrayon.us/dataserve.php?construct=2", true);
	//xhttp.send();


	if (mode === "reorder") {

		buildButton(obj.graphic_design_print, "Graphic Design", mode);
		
	
		buildButton(obj.apparel_promo, "Promo Apparel", mode);
		buildButton(obj.apparel_novelty, "Novelty Apparel", mode);
		buildButton(obj.apparel_uniform, "Uniform Apparel", mode);

		buildButton(obj.ticketing_reorder, "Ticketing (reorder)", mode);
		buildButton(obj.staff_business_cards, "Business Cards", mode);
	}

	if (mode === "normal") {

		buildButton(obj.graphic_design_print, "Graphic Design", mode);
		
		buildButton(obj.staff_business_cards, "Business Cards", mode);
		buildButton(obj.email_newsletter, "Email Newsletter", mode);
		buildButton(obj.apparel_promo, "Promo Apparel", mode);
		buildButton(obj.apparel_novelty, "Novelty Apparel", mode);
		buildButton(obj.apparel_uniform, "Uniform Apparel", mode);
		buildButton(obj.ticketing_type_main, "Main Tickets", mode);
		buildButton(obj.ticketfly_email_campaign, "Ticketfly", mode);
		buildButton(obj.website_updates, "Web Updates", mode);
		buildButton(obj.website_error, "Web Error corrections", mode);
		buildButton(obj.facebook_instagram_ad_general, "Facebook/Instagram (general)", mode);
		buildButton(obj.facebook_instagram_ad_third_party, "Facebook/Instagram (3rd Party)", mode);
		buildButton(obj.social_media_contest, "Social Media Contests", mode);
		buildButton(obj.snapchat_campaign, "Snapchat Campaign", mode);
		buildButton(obj.wifi_email_campaign, "Wifi email Campaign", mode);
		buildButton(obj.gift_cards, "Gift Cards", mode);
		buildButton(obj.loyalty_cards, "Loyalty Cards", mode);
		buildButton(obj.promotional_cards, "Promo Cards", mode);
		buildButton(obj.video_editing, "Video Editing", mode);
		buildButton(obj.new_menu, "New Menu Ordering", mode);
		buildButton(obj.menu_changes, "Menu Changes", mode);
		buildButton(obj.google_advertising, "Google Paid Camampaigns", mode);
	}


	var node = document.createElement("DIV"); //
	var textnode = document.createTextNode("◄ Main menu"); // Create a text node
	node.appendChild(textnode);
	node.classList.add("hinput");
	node.classList.add("buildButton");
	node.style.width = ("330px");
	node.style.marginBottom = ("22px");
	node.id = "backtomain" + mode;
	document.getElementById("buttonContainer" + mode).insertBefore(node, document.getElementById("buttonContainer" + mode).childNodes[0]);
	document.getElementById("backtomain" + mode).addEventListener("click", function () {
		returnToMenu(mode);
	});
}

function buildInitialButtons() {
	var elem = document.getElementById("initialbuttonContainer");
	while (elem.firstChild) {
		elem.removeChild(elem.firstChild);
	}

	var node = document.createElement("DIV"); //
	var textnode = document.createTextNode("Reorder Request "); // Create a text node
	node.appendChild(textnode);
	node.classList.add("hinput");
	node.classList.add("buildButton");
	node.style.width = ("330px");
	node.id = "reorder"
	document.getElementById("initialbuttonContainer").appendChild(node);
	document.getElementById("reorder").addEventListener("click", function () {
		buildMainbuttons('reorder');
	});

	var node = document.createElement("DIV");
	var textnode = document.createTextNode("New item(s) Request "); // Create a text node
	node.appendChild(textnode);
	node.classList.add("hinput");
	node.classList.add("buildButton");
	node.style.width = ("330px");
	node.id = "newRequest"
	document.getElementById("initialbuttonContainer").appendChild(node);
	document.getElementById("newRequest").addEventListener("click", function () {
		buildMainbuttons('normal');
	});
}

function replicateChunk(chunkObj, section) {
	var originalSectionName = section.replace(/\-[0-9]+/, "");
	var ccn = getCookie("replicateChunkCookie" + originalSectionName);
	if (ccn) {
		var iteration = Number(ccn);
		iteration++;
	}
	if (!ccn) {
		var iteration = 2;
	}
	console.log(iteration);
	setcookie("replicateChunkCookie" + originalSectionName, iteration, 1);
	section = originalSectionName + "-" + iteration;
	buildFormChunk(chunkObj, section);
}

var i = 0;

function buildFormChunk(chunkObj, section) {
	setBasicCookies();
	i++;

	var theID = "formChunk" + section;
	theID = theID.replace(/\s/g, "-").trim();
	console.log("the id will be assigned to " + theID);
	setcookie("currentChunkName", theID, 3);
	document.getElementById("buttonContainernormal").style.display = "none";
	document.getElementById("buttonContainerreorder").style.display = "none";


	if (document.getElementById(theID)) {
		console.log("the element already exists " + theID);
		document.getElementById(theID).style.visibility = "unset";
		document.getElementById(theID).style.height = "unset";
		return;
	}

	var chunkText = "";
	for (var i = 0; i < chunkObj.length; i++) {
		var text = chunkObj[i].value;
		var type = chunkObj[i].type;
		var sectionid = section.replace(/\s+/ig, "-").trim();
		var qname = text.replace(/\s+/ig, "-").trim();
		var identifier = `${sectionid}-${qname}`;
		if (type.match(/SELECT/)) {
			var red = "";
			var singleAnswer = "";
			var pieces = type.split(/\{/);
			var q = pieces[0];
			var ans = pieces[1];
			var answers = ans.split(/\^/);
			//console.log(`Q: ${q}, answers: ${answers}`);
			for (var io = 0; io < answers.length; io++) {
				singleAnswer = answers[io].trim();
				singleAnswer = singleAnswer.replace(/\}/, "");
				singleAnswer = singleAnswer.replace(/\{/, "");
				red += `<option value="${singleAnswer}" >${singleAnswer}</option>\n`;
			}

			chunkText += `${text}: <br>\n<select name="${identifier}" id="${identifier}" style="margin-bottom:10px;">\n${red}</select><br>\n`;
			continue;
		}
		if (type.match(/textarea/)) {
			chunkText += `${text}: <br>\n<textarea placeholder="${text}" name="${identifier}" id="${identifier}" ></textarea><br>\n`;
			continue;
		}
		if (type.match(/DATE/)) {
			chunkText += `${text}: <br>\n<input type="date" name="${identifier}" id="${identifier}" ><br>\n`;
			continue;
		}
		if (type.match(/UPLOAD/)) {
			chunkText += `${text}: <br><div class="hinput" id="${identifier}UL" onclick="uploader('${identifier}')">Pick file to upload</div>`;
			continue;
		}

		if (text) {
			chunkText += `${text}:<input name="${identifier}"><br>`;
		}
	}
	var node = document.createElement("DIV"); // Create a <li> nodenode
	var node2 = document.createElement("DIV"); // Create a <li> nodenode
	node2.classList.add("node2outer");

	node2.id = theID;
	node2.classList.add("modal");
	node2.style.display = "block";
	node2.appendChild(node);
	node.outerHTML = `

<div class="hinput" style="width:180px;float:left;" onclick="showAllButtons();">◄ Main menu</div>
<a href="javascript: var w;" target="_blank" class="hinput" style="position: relative; top: 5px; left: 112px;text-decoration:none; background-color:#486ca0;color:white;">🎦 Help</a>
<br><div><br><b>Section: ${section} </b><br>${chunkText} </div>
<div class="hinput" style="width:300px;" onclick="hideFormChunk('${theID}');">Continue / hide this section</div>
<div class="hinput" style="width:300px;" onclick="saveUserState();">Save your progress</div>

<div id= "saveState" style="width:300px;display:none;">
<div class="hinput" style="width:300px;color:white; background-color:black;" >Saved.</div>
<br><i style='font-size:12px;'><strong>NOTE</strong>:<br>This site uses browser cookies. When you save your progress, only this browser/device is updated.<br>You will need to return to this environment to load the progress that has been saved.<br>The previous saved state will be overwritten<br><br><strong>What we saved (developer mode)</strong></i><br>
</div>

<div class="hinput" style="width:300px;" id= "replicateButton${theID}" >Replicate this section to add items to the request</div>
<input type="submit" value="Submit the request" class="hinput" style="width:310px;background-color: #48a04b; ;padding-bottom: 20px;padding-top: 20px;color: white;margin-bottom:16px;" onclick="showAllButtons();" title="this will submit all form data, not just the current section. Press this button when all applicable sections have been filled out and you are ready to send the data to the server."></div>
`;

	//onclick="cloneChunk('${section}');" 
	if (chunkText) {
		document.getElementById("theForm").appendChild(node2);
		document.getElementById(`replicateButton${theID}`).addEventListener("click", function () {
			replicateChunk(chunkObj, section)
		});
		//document.getElementById(`replicateButton${theID}`).style.backgroundColor = "red";
	}



}

function buildButton(chunkObj, section, mode) {

	if (mode == "reorder") {
		section += "-reorder";
	}

	var theID = "showFormPart" + section;
	theID = theID.replace(/\s/g, "-").trim();
	var node = document.createElement("DIV");
	var textnode = document.createTextNode(section); // Create a text node
	node.appendChild(textnode);
	node.classList.add("hinput");
	node.classList.add("buildButton");
	node.style.width = ("330px");
	var node2 = document.createElement("DIV"); // Create a <li> nodenode
	node2.id = "showFormPart-" + section;
	node2.id = theID;
	node2.appendChild(node);
	document.getElementById("buttonContainer" + mode).appendChild(node2)
	node2.onclick = function () {
		buildFormChunk(chunkObj, section);
	};
	node2.style.visibility = "unset";
	node2.style.height = "unset";
}

function cloneChunk(chunkObj, section) {
	console.log("attemp to clone " + section);
	buildFormChunk(chunkObj, section)
	return;
}

function showAllButtons() {
	//return;
	document.getElementById("buttonContainernormal").style.display = "block";
	document.getElementById("buttonContainernormal").style.visibility = "visible";
	document.getElementById("buttonContainerreorder").style.display = "block";
	document.getElementById("buttonContainerreorder").style.visibility = "visible";

	var q = document.getElementsByClassName("modal");
	console.log(q);
	for (var i = 0; i < q.length; i++) {
		q[i].style.visibility = "hidden";
		q[i].style.height = "0px";
		q[i].style.position = "absolute";
	}
}


function returnToMenu(mode) {


	var f = document.getElementsByClassName("mainButtonsInterior");

	for (var i = 0; i < f.length; i++) {
		var e = f[i];
		e.style.visibility = "hidden";
		e.style.position = "absolute";
		e.style.style.height = "0px";
	}


	document.getElementById("buttonContainer" + mode).style.visibility = "hidden";
	document.getElementById("buttonContainer" + mode).style.display = "block";
	document.getElementById("buttonContainer" + mode).style.visibility = "hidden";
	document.getElementById("buttonContainer" + mode).style.display = "block";
	document.getElementById("buttonContainer" + mode).style.height = "0px";
	document.getElementById("buttonContainer" + mode).style.position = "absolute";
	document.getElementById("initialbuttonContainer").style.visibility = "visible";
	document.getElementById("initialbuttonContainer").style.display = "block";
	document.getElementById("initialbuttonContainer").style.height = "unset";
	buildInitialButtons();
}


function hideFormChunk(id) {

	document.getElementById(id).style.visibility = "hidden";
	document.getElementById(id).style.height = "0px";
	document.getElementById(id).style.position = "absolute";
	showAllButtons();
}

function wipeReplicateCookies() {
	var theCookies = document.cookie.split(';');

	//return;
	for (var i = 0; i <= theCookies.length; i++) {
		var name = "";
		var value = "";
		var d = theCookies[i];

		if (d) {
			var t = d.split('=');
			var name = t[0];
			var value = t[1];
			if (name.match(/replicate/ig)) {
				console.log(name);
				setcookie(name, 0, -1);
			}
		}
	}
	//console.log(theCookies);
	return;
}

buildInitialButtons();
document.getElementById("theForm").addEventListener("submit", function () {
	wipeReplicateCookies();
})