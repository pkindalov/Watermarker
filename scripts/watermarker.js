let examplePicture = 'images/examplePicture.jpg';
let browseInputButton = '<input class="form-control" id="fileToUpload" type="file" />';
let userPicture;


//font to use - Andale Mono, Courier, Courier New, Georgia, Impact, Trebuchet MS, Verdana, Calibri Cambria, Candara, Consolas, Constantia, Corbel, monospace

var CanvasText = new CanvasText;
var font = "Arial";



function wrapText(context, text, x, y, maxWidth, lineHeight, color, size) {

 let fontSize = size + "px " + font;
	context.globalAlpha = 0.5;	
	
  let canvas = document.getElementById('processPicture');
  //serch in receiv string from editor for html tags


  //this is varible control defauil context.filltext If variable remain true then default writter write on canvas image
  let doYouWrite = true;

  text = text.replace('&nbsp', '');


  //document.write(bold);
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



(function( $ ){
    $.fn.modelsHandler = function(element, imageObj, context, canvas) {

        $(element).toggle("slow");
        $(element).show();



        if(userPicture == ' ' || userPicture == undefined) userPicture = examplePicture;


        imageObj.onload = function(){
            context.drawImage(imageObj, 0, 0, imageObj.width, imageObj.height,
										0, 0, canvas.width, canvas.height);
            //wrapText(context, exampleText, 15, 50, maxWidth, lineHeight, 'white', 50);

            // clearDrawing();

        };


        imageObj.src = userPicture;



        // alert('hello world');
        return this;
    };
})( jQuery );








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
		fontFamily: "Andale",
        fontSize: "60px",
        fontWeight: "normal",
        fontColor: "#fff",
        lineHeight: "22"
	});
	
	
	let imageObj = new Image();
	
	
	
	imageObj.onload = function(){
		context.drawImage(imageObj, 0, 0);
        defaultHandler();
		//wrapText(context, exampleText, 40, 40, maxWidth, lineHeight, 'white', 50);
		
	};
	
	imageObj.src = examplePicture;
	imageObj.crossOrigin = "Anonymous";
	
	
	
	
	$('#fileToUpload').on('change', function(ev) {
		  
       let f = ev.target.files[0];
       let fr = new FileReader();

       fr.onload = function(ev2) {
           //console.dir(ev2);
           //$('.editPic').attr('src', ev2.target.result);
           imageObj.src= ev2.target.result;
		   userPicture = ev2.target.result;
       };

       fr.readAsDataURL(f);
		
		
   });




	$('#turnModel1').click(function(){

		// $('#turnModel1').modelsHandler('#modelone', imageObj, context, canvas);

        let message = $('textarea[name="message"]').val();
        let color = $('input[name="colorOftext"]').val();
        let size = $('input[name="textSizeDefault"]').val();
		let height = 30;

        clearDrawing();

        for(let i = 0; i < 10; i++){
            wrapText(context, message, 60, height, maxWidth, lineHeight, color, size);
            wrapText(context, message, 220, height, maxWidth, lineHeight, color, size);

        	height += 50;
		}

        // wrapText(context, message, 60, 30, maxWidth, lineHeight, color, size);
        // wrapText(context, message, 220, 30, maxWidth, lineHeight, color, size);
        // wrapText(context, message, 60, 80, maxWidth, lineHeight, color, size);
        // wrapText(context, message, 220, 80, maxWidth, lineHeight, color, size);
        // wrapText(context, message, 60, 130, maxWidth, lineHeight, color, size);
        // wrapText(context, message, 220, 130, maxWidth, lineHeight, color, size);
        // wrapText(context, message, 60, 180, maxWidth, lineHeight, color, size);
        // wrapText(context, message, 220, 180, maxWidth, lineHeight, color, size);
        // wrapText(context, message, 60, 230, maxWidth, lineHeight, color, size);
        // wrapText(context, message, 220, 230, maxWidth, lineHeight, color, size);




		//modelsHandler('#modelone', userPicture, imageObj, context);

	// 	$('#modelone').toggle("slow");
	// 	$('#modelone').show();
    //
    //
    //
	// 	if(userPicture == ' ' || userPicture == undefined) userPicture = examplePicture;
    //
    //
	// 	imageObj.onload = function(){
	// 	context.drawImage(imageObj, 0, 0);
	// 	wrapText(context, exampleText, 15, 50, maxWidth, lineHeight, 'white', 50);
    //
	// 		clearDrawing();
    //
	// };
    //
    //
	// imageObj.src = userPicture;
		
	});
	
	
	
	$('#turnModel2').click(function(){
		

        // $('#turnModel2').modelsHandler('#modelTwo', imageObj, context, canvas);



        let message = $('textarea[name="message"]').val();
        let color = $('input[name="colorOftext"]').val();
        let size = $('input[name="textSizeDefault"]').val();
        let height = 30;

        clearDrawing();



        for(let i = 0; i < 10; i++){
            wrapText(context, message, 60, height, maxWidth, lineHeight, color, size);
            wrapText(context, message, 210, height, maxWidth, lineHeight, color, size);
            wrapText(context, message, 360, height, maxWidth, lineHeight, color, size);

            height += 50;
        }

		
	// 	$('#modelTwo').toggle("slow");
	// 	$('#modelTwo').show();
	//
	//
	//
	// 	if(userPicture == ' ' || userPicture == undefined) userPicture = examplePicture;
	//
	//
	// 	imageObj.onload = function(){
	// 	context.drawImage(imageObj, 0, 0);
	// 	wrapText(context, exampleText, 15, 50, maxWidth, lineHeight, 'white', 50);
	//
	// 		clearDrawing();
	//
	// };
	//
	//
	// imageObj.src = userPicture;
		
	});



    $('#turnModel3').click(function(){


        // $('#turnModel2').modelsHandler('#modelTwo', imageObj, context, canvas);


        let message = $('textarea[name="message"]').val();
        let color = $('input[name="colorOftext"]').val();
        let size = $('input[name="textSizeDefault"]').val();
        let width = 60;
		let height = 30;

        clearDrawing();

        for(let i = 0; i < 5; i++){
            wrapText(context, message, width, height, maxWidth, lineHeight, color, size);

            width += 60;
            height += 140;
		}


        // wrapText(context, message, 60, 30, maxWidth, lineHeight, color, size);
        // wrapText(context, message, 120, 170, maxWidth, lineHeight, color, size);
        // wrapText(context, message, 180, 310, maxWidth, lineHeight, color, size);
        // wrapText(context, message, 240, 450, maxWidth, lineHeight, color, size);


    });



    $('#turnModel4').click(function(){


        // $('#turnModel2').modelsHandler('#modelTwo', imageObj, context, canvas);


        let message = $('textarea[name="message"]').val();
        let color = $('input[name="colorOftext"]').val();
        let size = $('input[name="textSizeDefault"]').val();
        let width = 300;
        let height = 30;

        clearDrawing();

        for(let i = 0; i < 5; i++){
            wrapText(context, message, width, height, maxWidth, lineHeight, color, size);

            width -= 80;
            height += 140;
        }


        // wrapText(context, message, 300, 30, maxWidth, lineHeight, color, size);
        // wrapText(context, message, 220, 170, maxWidth, lineHeight, color, size);
        // wrapText(context, message, 140, 310, maxWidth, lineHeight, color, size);
        // wrapText(context, message, 60, 450, maxWidth, lineHeight, color, size);
        //


    });



    $('#turnModel5').click(function(){


        // $('#turnModel2').modelsHandler('#modelTwo', imageObj, context, canvas);


        let message = $('textarea[name="message"]').val();
        let color = $('input[name="colorOftext"]').val();
        let size = $('input[name="textSizeDefault"]').val();
        let width = 300;
        let height = 30;

        clearDrawing();


        wrapText(context, message, 30, 30, maxWidth, lineHeight, color, size);
        wrapText(context, message, 300, 30, maxWidth, lineHeight, color, size);
        wrapText(context, message, 170, 250, maxWidth, lineHeight, color, size);
        wrapText(context, message, 30, 450, maxWidth, lineHeight, color, size);
        wrapText(context, message, 300, 450, maxWidth, lineHeight, color, size);


        // for(let i = 0; i < 5; i++){
        //     wrapText(context, message, width, height, maxWidth, lineHeight, color, size);
        //
        //     width -= 80;
        //     height += 140;
        // }


        // wrapText(context, message, 300, 30, maxWidth, lineHeight, color, size);
        // wrapText(context, message, 220, 170, maxWidth, lineHeight, color, size);
        // wrapText(context, message, 140, 310, maxWidth, lineHeight, color, size);
        // wrapText(context, message, 60, 450, maxWidth, lineHeight, color, size);
        //


    });




    $('input[name="textSizeDefault"]').on('keyup', function() {

        defaultHandler();

    });

    // $('input[name="textSizeDefault"]').on('mouseout', function() {
    //
    //     defaultHandler();
    //
    // });

    $('input[name="textSizeDefault"]').on('change', function() {

        defaultHandler();

    });



    $('select[name="font"]').on('keyup', function() {

        defaultHandler();

    });

    // $('select[name="font"]').on('mouseout', function() {
    //
    //     defaultHandler();
    //
    // });

    $('select[name="font"]').on('change', function() {

        defaultHandler();

    });




    $('input[name="horizontal"]').on('keyup', function() {

        defaultHandler();

    });

    // $('input[name="horizontal"]').on('mouseout', function() {
    //
    //     defaultHandler();
    //
    // });

    $('input[name="horizontal"]').on('change', function() {

        defaultHandler();

    });


    $('input[name="vertical"]').on('keyup', function() {

        defaultHandler();

    });

    // $('input[name="vertical"]').on('mouseout', function() {
    //
    //     defaultHandler();
    //
    // });

    $('input[name="vertical"]').on('change', function() {

        defaultHandler();

    });





    $('input[name="colorOftext"]').on('keyup', function() {

        defaultHandler();

    });

    // $('input[name="colorOftext"]').on('mouseout', function() {
    //
    //     defaultHandler();
    //
    // });

    $('input[name="colorOftext"]').on('change', function() {

        defaultHandler();

    });





    $('textarea[name="message"]').on('keyup', function() {

        defaultHandler();

    });

    // $('textarea[name="message"]').on('mouseout', function() {
    //
    //     defaultHandler();
    //
    // });

    $('textarea[name="message"]').on('change', function() {

        defaultHandler();

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



	$('select[name="font"]').on('change', function () {
		font = $(this).val();

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
};


let handlerModelTwo = function(e){
	let text = $('input[name="modelTwoInput"]').val();
		let textSize = $('input[name="textSizeModelTwo"]').val();
		let textColor = $('input[name="textColorModelTwo"]').val();


		clearDrawing();
		wrapText(context, text, 15, 250, maxWidth, lineHeight, textColor, textSize);
};

let defaultHandler = function () {

    let message = $('textarea[name="message"]').val();
    let horizontal = parseInt($('input[name="horizontal"]').val());
    let vertical = parseInt($('input[name="vertical"]').val());
    let color = $('input[name="colorOftext"]').val();
    let size = $('input[name="textSizeDefault"]').val();

    clearDrawing();
    wrapText(context, message, horizontal, vertical, maxWidth, lineHeight, color, size);

}


// function modelsHandler(element, userPicture, imageObj, context){
//
// 	$(element).toggle("slow");
// 		$(element).show();
//
//
//
// 		if(userPicture == ' ' || userPicture == undefined) userPicture = examplePicture;
//
//
// 		imageObj.onload = function(){
// 		context.drawImage(imageObj, 0, 0);
// 		wrapText(context, exampleText, 15, 50, maxWidth, lineHeight, 'white', 50);
//
// 			clearDrawing();
//
// }};

	
	
	
});



