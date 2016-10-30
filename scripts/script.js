// JavaScript Document

// Main Game Object
function MatchGame(gameBoard, boxes, numBoxes, turnsOut, matchedOut, btnPlay, picFilename){

	// Game Properties

	// Game HTML Elements
	this.gameBoard = gameBoard;
	this.boxes = boxes;
	this.firstFlippedBox = null;
	this.secondFlippedBox = null;
	this.turnsOut = turnsOut;
	this.matchedOut = matchedOut;
	this.btnPlay = btnPlay;

	// Game Variables
	this.numBoxes = numBoxes;
	this.halfNumBoxes = numBoxes / 2;
	this.turns = 0;
	this.matches = 0;
	this.clickCounter = 0;
	this.picFilename = picFilename;
	this.pictures = [];
	this.firstFlippedPicture = null;
	this.secondFlippedPicture = null;

}

// Game Functions
MatchGame.prototype.gameStart = function(){

	this.btnPlay.text('Click to End Game');
	this.createPictures();
	this.shufflePictures();
	this.addPictures(this.pictures);	
	this.gameBoard.removeClass('no_game_board');

};

MatchGame.prototype.gameEnd = function(){

	this.gameBoard.addClass('no_game_board')
	              .addClass('no-transition');
	this.btnPlay.text('Click to Play Game');
	this.boxes.removeClass('flipped')
	          .removeClass('matched');
	this.clickCounter = 0;
	this.turns = 0;
	this.matches = 0;
	this.matchedOut.text(0);
	this.turnsOut.text(0);
	this.destroyPictures();

};

MatchGame.prototype.gameReset = function(){
	
	//var that = this;
	
	this.gameEnd();
	this.gameStart();
		
}; // end gameReset

MatchGame.prototype.createPictures = function(){

	for(var i = 1; i <= this.halfNumBoxes; i++){
		if(i < 10){			
			// for images 01 - 09
			// .push() inserts an image into the array..
			this.pictures.push(this.picFilename + '0' + i + '.jpg');
			this.pictures.push(this.picFilename + '0' + i + '.jpg');
				
		}else{
			// for images 10 - 18
			this.pictures.push(this.picFilename + i + '.jpg');
			this.pictures.push(this.picFilename + i + '.jpg');
			
		} // end if (i < 10)	
	} // end for loop

}; // end createPictures

MatchGame.prototype.shufflePictures = function(){

	var counter = this.pictures.length;
	var temp; 
	var i;

	// While there are elements in the array
	while (counter > 0) {
		
		// Pick a random index
		i = Math.floor(Math.random() * counter);

		// Decrease counter by 1
		counter--;

		// And swap the last element with it
		temp = this.pictures[counter];
		this.pictures[counter] = this.pictures[i];
		this.pictures[i] = temp;
	
	} // end while

}; // end shufflePictures

MatchGame.prototype.addPictures = function(thePictures){

	this.boxes.each(function(i){
		
		// create image
		var $theImg = $('<img>').attr('src', thePictures[i]);
		
		// get the box that we will add the image to		  
		var $theBox = $(this).find('.box-back');	
		// add image to the box	
		$theImg.appendTo($theBox);								  				  
		
	}); // end .each()

}; // end addPictures

MatchGame.prototype.destroyPictures = function(){

	this.pictures.length = 0;
	$('.box-back img').remove();

}; // end destroyPictures

MatchGame.prototype.gameTurn = function(box){

	// Get a reference to this...
	var that = this;
	
	if(this.gameBoard.hasClass('no-transition')){
		this.gameBoard.removeClass('no-transition');
	}

	if(box.hasClass('flipped')){
		
		return;
	
	} // end if box has class flipped or matched

	this.clickCounter++;

	if(this.clickCounter === 1){

		box.addClass('flipped');
		this.firstFlippedBox = box;
		this.firstFlippedPicture = box.find('.box-back img').attr('src');
		
		return;

	} // end if clickCounter === 1

	// CounterClicks equals 2 -> look for match
	if(this.clickCounter === 2){

		box.addClass('flipped');
		this.secondFlippedBox = box;
		this.secondFlippedPicture = box.find('.box-back img').attr('src');

	}	

	console.log(this.secondFlippedPicture + ' ' + this.firstFlippedPicture);

	if(this.firstFlippedPicture === this.secondFlippedPicture){
		// they match
		this.firstFlippedBox.addClass('matched');
		this.secondFlippedBox.addClass('matched');
		this.clickCounter = 0;
		this.updateTurns();
		this.updateMatch();
		
		box.one('transitionend', function(){

			if(that.matches === that.halfNumBoxes){
				that.gameWon();
				return;
			}

		});		

	}else{
		// they do not match
		setTimeout(function(){
			that.updateTurns();
			that.firstFlippedBox.removeClass('flipped');
			that.secondFlippedBox.removeClass('flipped');
			that.clickCounter = 0;
		}, 750);
	} // end if images match or not...	

}; // end gameTurn

MatchGame.prototype.updateTurns = function(){

	this.turns++;
	this.turnsOut.text(this.turns);

}; // end updateTurns

MatchGame.prototype.updateMatch = function(){

	this.matches++;
	this.matchedOut.text(this.matches);

}; // end updateMatch

MatchGame.prototype.gameWon = function(){

	var answer = confirm('You Matched them all...Click OK to play again?');

	if(answer === true){
		this.gameReset();
	}

};


var mg = new MatchGame($('.game_board'), 
	                   $('.col'), 
	                   $('.col').length, 
	                   $('.output_turns p'), 
	                   $('.output_matched p'),
	                   $('.btn_play_and_reset'),
	                   'images/animal_image_');

// Cheat code
mg.matches = mg.halfNumBoxes - 1;

// Game Event Handlers
mg.btnPlay.click(function(){

	if($(this).text() === 'Click to Play Game'){
		mg.gameStart();
	}else{
		mg.gameEnd();
	}

});

mg.boxes.click(function(){

	mg.gameTurn( $(this) );

});
