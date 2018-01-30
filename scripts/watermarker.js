let examplePicture = 'images/examplePicture.jpg';
let browseInputButton = '<input id="fileToUpload" type="file" />';

var CanvasText = new CanvasText;

$(document).ready(function(){
	
	$('.browseImg').prepend(browseInputButton);

	let canvas = document.getElementById("processPicture");
	let context = canvas.getContext('2d');
	
	CanvasText.config({
		canvas: canvas,
		context: context,
		fontFamily: "Verdana",
        fontSize: "60px",
        fontWeight: "normal",
        fontColor: "#fff",
        lineHeight: "22"
	});
	
	
	let imageObj = new Image();
	
	imageObj.onload = function(){
		context.drawImage(imageObj, 0, 0);
	}	
	
	imageObj.src = examplePicture;
	
	
	$('#fileToUpload').on('change', function(ev) {
       var f = ev.target.files[0];
       var fr = new FileReader();

       fr.onload = function(ev2) {
           console.dir(ev2);
           //$('.editPic').attr('src', ev2.target.result);
           imageObj.src= ev2.target.result;
       };

       fr.readAsDataURL(f);
   });
	
	
	
	
});