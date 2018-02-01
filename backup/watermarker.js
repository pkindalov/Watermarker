let examplePicture = 'images/examplePicture.jpg';
let browseInputButton = '<input id="fileToUpload" type="file" />';
let userPicture;

var CanvasText = new CanvasText;


function wrapText(context, text, x, y, maxWidth, lineHeight, color, size) {

 let fontSize = size + "px Verdana";
	context.globalAlpha = 0.5;	
	
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
	$('#modelTwo').hide();
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
	imageObj.crossOrigin = "Anonymous";
	
	
	
	
	$('#fileToUpload').on('change', function(ev) {
		  
       var f = ev.target.files[0];
       var fr = new FileReader();

       fr.onload = function(ev2) {
           //console.dir(ev2);
           //$('.editPic').attr('src', ev2.target.result);
           imageObj.src= ev2.target.result;
		   userPicture = ev2.target.result;
       };

       fr.readAsDataURL(f);
		
		
   });
	
	
	
	
	$('#turnModel1').click(function(){
		
		//modelsHandler('#modelone', userPicture, imageObj, context);
		
		$('#modelone').toggle("slow");
		$('#modelone').show();
		
		
		
		if(userPicture == ' ' || userPicture == undefined) userPicture = examplePicture;
		
		
		imageObj.onload = function(){
		context.drawImage(imageObj, 0, 0);
		wrapText(context, exampleText, 15, 50, maxWidth, lineHeight, 'white', 50);
			
			clearDrawing();
		
	}
		
	
	imageObj.src = userPicture;
		
	});
	
	
	
	$('#turnModel2').click(function(){
		
		//modelsHandler('#modelTwo', userPicture, imageObj, context);
		
		$('#modelTwo').toggle("slow");
		$('#modelTwo').show();
		
		
		
		if(userPicture == ' ' || userPicture == undefined) userPicture = examplePicture;
		
		
		imageObj.onload = function(){
		context.drawImage(imageObj, 0, 0);
		wrapText(context, exampleText, 15, 50, maxWidth, lineHeight, 'white', 50);
			
			clearDrawing();
		
	}
		
	
	imageObj.src = userPicture;
		
	});
	
	
	
	//model one events
	$('input[name="modelOneInput"]').on('keyup', function() {
			handler();	
	});
	
	$('input[name="modelOneInput"]').on('onmouseout', function() {
			handler();	
	});
	
	$('input[name="textSize"]').on('keyup', function() {
		handler();	
		
	});
	
	$('input[name="textSize"]').on('onmouseout', function() {
		handler();	
		
	});
	
	$('input[name="textColor"]').on('keyup', function() {
		handler();	
	});
	
	$('input[name="textColor"]').on('onmouseout', function() {
		handler();	
	});
	
	
	
	//model two event handlers
	$('input[name="modelTwoInput"]').on('keyup', function() {
			handlerModelTwo();	
	});
	
	$('input[name="modelTwoInput"]').on('onmouseout', function() {
			handlerModelTwo();	
	});
	
	$('input[name="textSizeModelTwo"]').on('keyup', function() {
		handlerModelTwo();	
		
	});
	
	$('input[name="textSizeModelTwo"]').on('onmouseout', function() {
		handlerModelTwo();	
		
	});
	
	$('input[name="textColorModelTwo"]').on('keyup', function() {
		handlerModelTwo();	
	});
	
	$('input[name="textColorModelTwo"]').on('onmouseout', function() {
		handlerModelTwo();	
	});
	
	
	
	
	$('.clearText').click(function(){
		clearDrawing();
	});
	
	
	$('.saveWatermarkedImage').click(function(){
		
		let extension = $('select[name="chooseExtension"]').val();
		let fileToDownload = "YourWatermarkedImage" + extension;
		
		switch(extension){
			case '.jpg':
				let dt = canvas.toDataURL('image/jpeg');
   			    this.href = dt;
   			    
   			    var iframe = "<iframe crossorigin='anonymous' width='500px' height='500px' src='" + this.href + "'></iframe>"
				var x = window.open();
				x.document.open();
				x.document.write(iframe);
				x.document.close();	
				break;
			case '.png':
				canvas.toBlob(function(blob) {
      			saveAs(blob, fileToDownload);
    			});
				break;
		}		
		
		
		
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
	
	
	let handler = function(e){
	let text = $('input[name="modelOneInput"]').val();
		let textSize = $('input[name="textSize"]').val();
		let textColor = $('input[name="textColor"]').val();
		
		
		clearDrawing();
		wrapText(context, text, 15, 50, maxWidth, lineHeight, textColor, textSize);
}	


let handlerModelTwo = function(e){
	let text = $('input[name="modelTwoInput"]').val();
		let textSize = $('input[name="textSizeModelTwo"]').val();
		let textColor = $('input[name="textColorModelTwo"]').val();
		
		
		clearDrawing();
		wrapText(context, text, 15, 250, maxWidth, lineHeight, textColor, textSize);
}		
	


function modelsHandler(element, userPicture, imageObj, context){

	$(element).toggle("slow");
		$(element).show();
		
		
		
		if(userPicture == ' ' || userPicture == undefined) userPicture = examplePicture;
		
		
		imageObj.onload = function(){
		context.drawImage(imageObj, 0, 0);
		wrapText(context, exampleText, 15, 50, maxWidth, lineHeight, 'white', 50);
			
			clearDrawing();
	
}};	

	
	
	
});



