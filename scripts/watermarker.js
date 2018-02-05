let examplePicture = 'images/examplePicture.jpg';
let browseInputButton = '<input class="form-control" id="fileToUpload" type="file" />';
let userPicture;
let watermarkCounter = 0;

var CanvasText = new CanvasText;
var font = "Arial";



function wrapText(context, text, x, y, maxWidth, lineHeight, color, size) {

 let fontSize = size + "px " + font;
	context.globalAlpha = 0.5;	


  //this is varible control defauil context.filltext If variable remain true then default writter write on canvas image
  let doYouWrite = true;

  text = text.replace('&nbsp', '');

  let words = text.split(' ');
  let line = '';



  for (let n = 0; n < words.length; n++) {
    let testLine = ' ' + line + words[n] + ' ';
    let metrics = context.measureText(testLine);
    let testWidth = metrics.width;
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


//Refactored code and don`t use this now but it is useful because it is way to create a jQuery method.
//Can be useful in future

// (function( $ ){
//     $.fn.modelsHandler = function(element, imageObj, context, canvas) {
//
//         $(element).toggle("slow");
//         $(element).show();
//
//
//
//         if(userPicture == ' ' || userPicture == undefined) userPicture = examplePicture;
//
//
//         imageObj.onload = function(){
//             context.drawImage(imageObj, 0, 0, imageObj.width, imageObj.height,
// 										0, 0, canvas.width, canvas.height);
//             //wrapText(context, exampleText, 15, 50, maxWidth, lineHeight, 'white', 50);
//
//             // clearDrawing();
//
//         };
//
//
//         imageObj.src = userPicture;
//
//
//
//         // alert('hello world');
//         return this;
//     };
// })( jQuery );








$(document).ready(function(){

    let canvasWidth = 500;
    let canvasHeight = 500;

	$('.browseImg').prepend(browseInputButton);

	let canvas = document.getElementById("processPicture");
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;

	let context = canvas.getContext('2d');
	let maxWidth = 500;
    let lineHeight = 50;
    let message = $('textarea[name="message"]').val();
    let color = $('input[name="colorOftext"]').val();
    let size = $('input[name="textSizeDefault"]').val();

	CanvasText.config({
		canvas: canvas,
		context: context,
		fontFamily: "Arial",
        fontSize: "60px",
        fontWeight: "normal",
        fontColor: "#fff",
        lineHeight: "22"
	});
	
	
	let imageObj = new Image();

	imageObj.onload = function(){
		context.drawImage(imageObj, canvasWidth, canvasHeight);
        defaultHandler();
	};
	
	imageObj.src = examplePicture;
	imageObj.crossOrigin = "Anonymous";

	
	$('#fileToUpload').on('change', function(ev) {
		  
       let f = ev.target.files[0];
       let fr = new FileReader();

       fr.onload = function(ev2) {
           imageObj.src= ev2.target.result;
		   userPicture = ev2.target.result;
       };

       fr.readAsDataURL(f);
   });





	$('#turnModel1').click(function(){

		// $('#turnModel1').modelsHandler('#modelone', imageObj, context, canvas);
        message = $('textarea[name="message"]').val();
        color = $('input[name="colorOftext"]').val();
        size = $('input[name="textSizeDefault"]').val();
		let height = 30;

        clearDrawing();

        for(let i = 0; i < 10; i++){
            wrapText(context, message, 60, height, maxWidth, lineHeight, color, size);
            wrapText(context, message, 220, height, maxWidth, lineHeight, color, size);

        	height += 50;
		}
	});
	
	
	
	$('#turnModel2').click(function(){

        // $('#turnModel2').modelsHandler('#modelTwo', imageObj, context, canvas);
        message = $('textarea[name="message"]').val();
        color = $('input[name="colorOftext"]').val();
        size = $('input[name="textSizeDefault"]').val();
        let height = 30;

        clearDrawing();

        for(let i = 0; i < 10; i++){
            wrapText(context, message, 60, height, maxWidth, lineHeight, color, size);
            wrapText(context, message, 210, height, maxWidth, lineHeight, color, size);
            wrapText(context, message, 360, height, maxWidth, lineHeight, color, size);

            height += 50;
        }

	});


    $('#turnModel3').click(function(){


        // $('#turnModel2').modelsHandler('#modelTwo', imageObj, context, canvas);
        message = $('textarea[name="message"]').val();
        color = $('input[name="colorOftext"]').val();
        size = $('input[name="textSizeDefault"]').val();
        let width = 60;
		let height = 30;

        clearDrawing();

        for(let i = 0; i < 5; i++){
            wrapText(context, message, width, height, maxWidth, lineHeight, color, size);

            width += 60;
            height += 140;
		}


    });


    $('#turnModel4').click(function(){


        // $('#turnModel2').modelsHandler('#modelTwo', imageObj, context, canvas);
        message = $('textarea[name="message"]').val();
        color = $('input[name="colorOftext"]').val();
        size = $('input[name="textSizeDefault"]').val();
        let width = 300;
        let height = 30;

        clearDrawing();

        for(let i = 0; i < 5; i++){
            wrapText(context, message, width, height, maxWidth, lineHeight, color, size);

            width -= 80;
            height += 140;
        }


    });



    $('#turnModel5').click(function(){

        // $('#turnModel2').modelsHandler('#modelTwo', imageObj, context, canvas);
        message = $('textarea[name="message"]').val();
        color = $('input[name="colorOftext"]').val();
        size = $('input[name="textSizeDefault"]').val();

        clearDrawing();

        wrapText(context, message, 30, 30, maxWidth, lineHeight, color, size);
        wrapText(context, message, 300, 30, maxWidth, lineHeight, color, size);
        wrapText(context, message, 170, 250, maxWidth, lineHeight, color, size);
        wrapText(context, message, 30, 450, maxWidth, lineHeight, color, size);
        wrapText(context, message, 300, 450, maxWidth, lineHeight, color, size);

    });


    $('select[name="chooseResolution"]').on('change', function () {
       let newWidth = parseInt($(this).val());

       let resizedCanvas = document.getElementById("processPicture");

       resizedCanvas.width= newWidth;
       resizedCanvas.height = newWidth;

       clearDrawing();

        imageObj.onload = function(){
            context.drawImage(imageObj, 0, 0);
            defaultHandler();
        };

        if(userPicture == ' ' || userPicture == undefined) userPicture = examplePicture;
        imageObj.src = userPicture;
        imageObj.crossOrigin = "Anonymous";
    });








    $('a[name="addMoreWatermarks"]').on('click', function () {
        // let newCanvas = document.getElementById("processPicture");
        // let newContext = newCanvas.getContext('2d');





        let classNameOfTextInput = 'watermarkText' + watermarkCounter;
       let clasNameOfTextSize = 'watermarkTextSize' + watermarkCounter;
       let textHeight = 'watermarkHeight' + watermarkCounter;
       let textWidth = 'watermarkWidth' + watermarkCounter;
       let textColor = 'watermarkerTextColor' + watermarkCounter;

       let nameOfDrawBtn = 'drawBtn' + watermarkCounter;
       let contDivName = 'divWatermarkText' + watermarkCounter;
       let textInput = $(`<input class="form-control" style="width: 300px" type="text" name="${classNameOfTextInput}" />`);

        let textSizeInput = $(`<input class="form-control" style="width: 300px" type="number" name="${clasNameOfTextSize}" value="30" />`);

        let textHeightPos = $(`<input class="form-control" style="width: 300px" type="number" name="${textHeight}" value="200" />`);

        let textWidthPos = $(`<input class="form-control" style="width: 300px" type="number" name="${textWidth}" value="140" />`);

        let colorOfText = $(`<input class="form-control" style="width: 300px" type="text" name="${textColor}" value="White" />`);


       let drawButton = $(`<a class="btn btn-primary" name="${nameOfDrawBtn}">Draw</a>`);
       let divContainer = $(`<div id="${contDivName}">`);

       divContainer.append("Enter text:<br />");
       divContainer.append(textInput);
        divContainer.append("Enter text size:<br />");
       divContainer.append(textSizeInput);
        divContainer.append("Vertical Position of text:<br />");
       divContainer.append(textHeightPos);
        divContainer.append("Horizontal Position of text:<br />");
        divContainer.append(textWidthPos);
        divContainer.append("Enter a color for text:<br />");
        divContainer.append(colorOfText);


       divContainer.append(drawButton);


       $('#watermarksContainer').append(divContainer);

        // alert($(`input[name="${classNameOfTextInput}"]`).val());

        watermarkCounter++;



        $(`#${contDivName}`).on('click', `a[name="${nameOfDrawBtn}"]`, function () {
            let userText = $(`input[name="${classNameOfTextInput}"]`).val();
            let userTextSize = $(`input[name="${clasNameOfTextSize}"]`).val();

            let textVerticalPos = $(`input[name="${textHeight}"]`).val();
            let textHorizontalPos = $(`input[name="${textWidth}"]`).val();

            let userTextColor = $(`input[name="${textColor}"]`).val();


            wrapText(context, userText, textHorizontalPos, textVerticalPos, maxWidth, lineHeight, userTextColor, userTextSize);


            //                         width, height

                // for(let c of newContexts){
                //     alert(c);
                    // wrapText(c, userText, textHorizontalPos, textVerticalPos, maxWidth, lineHeight, userTextColor, userTextSize);
                // }



                // wrapText(newContexts[watermarkCounter - 1], userText, textHorizontalPos, textVerticalPos, maxWidth, lineHeight, userTextColor, userTextSize);



            // $(`#${contDivName}`).on('change', `input[name="${clasNameOfTextSize}"]`, function () {
            //     let newTextSizeValue = $(`input[name="${clasNameOfTextSize}"]`).val();
            //
            //     clearDrawing();
            //
            //     wrapText(context, userText, textHorizontalPos, textVerticalPos, maxWidth, lineHeight, userTextColor, newTextSizeValue);
            // });



            // alert(userText);
            // alert($(`input[name="${classNameOfTextInput}"]`).val());

        });










    });





    $('input[name="textSizeDefault"]').on('keyup', function() {
        defaultHandler();
    });


    $('input[name="textSizeDefault"]').on('change', function() {
        defaultHandler();
    });



    $('select[name="font"]').on('keyup', function() {
        defaultHandler();
    });


    $('select[name="font"]').on('change', function() {
        defaultHandler();
    });


    $('input[name="horizontal"]').on('keyup', function() {
        defaultHandler();
    });


    $('input[name="horizontal"]').on('change', function() {
        defaultHandler();
    });


    $('input[name="vertical"]').on('keyup', function() {
        defaultHandler();
    });


    $('input[name="vertical"]').on('change', function() {
        defaultHandler();
    });

    $('input[name="colorOftext"]').on('keyup', function() {
        defaultHandler();
    });

    $('input[name="colorOftext"]').on('change', function() {
        defaultHandler();
    });


    $('textarea[name="message"]').on('keyup', function() {
        defaultHandler();
    });

    $('textarea[name="message"]').on('change', function() {
        defaultHandler();
    });



	$('select[name="font"]').on('change', function () {
		font = $(this).val();
        defaultHandler();
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

     context.drawImage(imageObj, 0, 0, canvas.width, canvas.height);
     context.globalCompositeOperation = "source-atop";
   }


    function clearUserDrawing(userContext){


        // clear canvas
        userContext.clearRect(0, 0, canvas.width, canvas.height);

        // clear path
        userContext.beginPath();

        // use default comp. mode
        userContext.globalCompositeOperation = "source-over";

        // reset alpha
        userContext.globalAlpha = 1;

        userContext.drawImage(imageObj, 0, 0, canvas.width, canvas.height);
        userContext.globalCompositeOperation = "source-atop";
    }

	


let defaultHandler = function () {

    let horizontal = parseInt($('input[name="horizontal"]').val());
    let vertical = parseInt($('input[name="vertical"]').val());
    message = $('textarea[name="message"]').val();
    color = $('input[name="colorOftext"]').val();
    size = $('input[name="textSizeDefault"]').val();

    clearDrawing();
    wrapText(context, message, horizontal, vertical, maxWidth, lineHeight, color, size);

}


	
});



