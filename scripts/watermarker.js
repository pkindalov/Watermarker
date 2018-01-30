let examplePicture = 'images/examplePicture.jpg';
let browseInputButton = '<input id="fileToUpload" type="file" />';

var CanvasText = new CanvasText;


function wrapText(context, text, x, y, maxWidth, lineHeight, color, size) {

 let fontSize = size + "px verdana";
	
  let canvas = document.getElementById('processPicture');
  //serch in receiv string from editor for html tags


  //this is varible control defauil context.filltext If variable remain true then default writter write on canvas image
  var doYouWrite = true;

  text = text.replace('&nbsp', '');


  //document.write(bold);
  var words = text.split(' ');
  var line = '';



  for (var n = 0; n < words.length; n++) {
    var testLine = ' ' + line + words[n] + ' ';
    var metrics = context.measureText(testLine);
    var testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {


        context.fillText(line, x, y);

      line = words[n] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }




    if(doYouWrite){
	  context.font = fontSize;	
	  context.fillStyle	 = color;
      context.fillText(line, x, y);
    }



}










$(document).ready(function(){
	
	$('#modelone').hide();
	$('.browseImg').prepend(browseInputButton);

	let canvas = document.getElementById("processPicture");
	let context = canvas.getContext('2d');
	let maxWidth = 500;
    let lineHeight = 50;
	let exampleText = "Your text here";
	let x= 490;
	let y = 450;
	
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
		//wrapText(context, exampleText, 40, 40, maxWidth, lineHeight, 'white', 50);
		
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
	
	
	
	
	$('#turnModel1').click(function(){
		
		$('#modelone').show();
		
		clearDrawing();
		
		imageObj.onload = function(){
		context.drawImage(imageObj, 0, 0);
		wrapText(context, exampleText, 15, 50, maxWidth, lineHeight, 'white', 50);
			
			
		
	}
		
	
	imageObj.src = examplePicture;
		
	});
	
	
	$('input[name="modelOneInput"]').on('keyup', function() {
		
		
		let text = $('input[name="modelOneInput"]').val();
		let textSize = $('input[name="textSize"]').val();
		let textColor = $('input[name="textColor"]').val();
		
		
		clearDrawing();
		wrapText(context, text, 15, 50, maxWidth, lineHeight, textColor, textSize);
		
	});
	
	$('input[name="textSize"]').on('keyup', function() {
		let text = $('input[name="modelOneInput"]').val();
		let textSize = $('input[name="textSize"]').val();
		let textColor = $('input[name="textColor"]').val();
		
		clearDrawing();
		wrapText(context, text, 15, 50, maxWidth, lineHeight, textColor, textSize);
		
	});
	
	$('input[name="textColor"]').on('keyup', function() {
		let text = $('input[name="modelOneInput"]').val();
		let textSize = $('input[name="textSize"]').val();
		let textColor = $('input[name="textColor"]').val();
		
		clearDrawing();
		wrapText(context, text, 15, 50, maxWidth, lineHeight, textColor, textSize);
		
	});
	
	
	
	
	
	
	$('.clearText').click(function(){
		clearDrawing();
	});
	
	
	$('.saveWatermarkedImage').click(function(){
		canvas.toBlob(function(blob) {
      	saveAs(blob, "YourWatermarkedImage.png");
    });
	});
	
	
	
	function clearDrawing(){
     canvas = document.getElementById('processPicture');
     context = canvas.getContext("2d");

     // clear canvas
     context.clearRect(0, 0, canvas.width, canvas.height);

     // clear path
     context.beginPath();

     // use default comp. mode
     context.globalCompositeOperation = "source-over";

     // reset alpha
     context.globalAlpha = 1;

     context.drawImage(imageObj, 0, 0, 500, 500);
     context.globalCompositeOperation = "source-atop";
   }
	
	
	
});



