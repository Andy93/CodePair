function init(){
    var editor = ace.edit("aceEditor");
    //editor.setValue("new code here");
      editor.setTheme("ace/theme/twilight");
      editor.session.setMode("ace/mode/javascript");
      var session = editor.getSession();
      session.setUseWrapMode(true);
      session.setUseWorker(false);
}

function socket(){
	try{
      var socket = io.connect('http://127.0.0.1:8080');
    } catch(e){

    }
}

function setCode(){
	try{
      var socket = io.connect('http://127.0.0.1:8080');
    } catch(e){

    }
	if(socket !== undefined){
      //put latest string in DB to ACE
      socket.on('output', function(data){
        if(data.length){
          var x = data.length-1;
          navEditor.setValue(data[x].code);
        }
      });
	}
}

function sendCode(){
	try{
      var socket = io.connect('http://127.0.0.1:8080');
    } catch(e){

    }
	if(socket !== undefined){
		var manip = driverEditor.getSession().getValue();
	    socket.emit('input',{
	      code:manip
	    })
	}
}

// create string of word-number-word for url 
// take one word from file of words
// create random number from scratch 
// take another word then concatenate and return
function createString() {
  var hash;
  var firstWord = randomWord();
  var secondWord = randomWord();
  var number = Math.floor(Math.random()*999)+1;

  hash = firstWord + number + secondWord;
  return hash.toString();
} 

function randomWord(){
  var words = ["Apple", "Apricot", "Avocado", "Banana", "Blackberry", "Blueberry", "Cherry", "Grapefruit", "Lemon", "Lime",
                "Coconut","Kiwi","Peach","Pear","Pineapple","Melon","Watermelon","Raspberry","Strawberry","Hanger",
                "Grape","Plum","London","Dublin","Moscow","Berlin","Madrid","Paris","Stockholm","Vienna",
                "Chair","Texas","California","Nevada","Florida","Montana","Bravo","Delta","Echo","Hotel",
                "Tango","Whiskey","Foxtrot","Golf","Zulu","Yankee","Magnet","Button","Watch","Red",
                "White","Green","Black","Yellow","Grey","Blue","Pink","Purple","Diary","Bottle",
                "Water","Fire","Wind","Sweet","Sugar","Stamp","Brush","Small","Medium","Large",
                "Brown","Piano","Guitar","Canvas","Carrot","Mouse","Dog","Cat","Squirrel","Truck",
                "Rabbit","Toothbrush","Chalk","Puddle","Elephant","Giraffe","Frog","Falcon","Eagle","Parrot",
                "Shark","Tiger","Butterfly","Turtle","Snake","Fish","Whale","Walrus","Kangaroo","Wolverine"];
  return words[(Math.floor(Math.random()*100)+0)];

} 


// function to collect code from editor for repo download, User can click button to download code changes
// set timer in main code to run this method every 10 mins, for user to review afterwards.
// perhaps put to Session Storage in HTML5
function collectCode(){
	var codeStatic;
	var manip = driverEditor.getSession().getValue(); //may need to put this to string.
	var curDate = new Date();
	var curDateX = curDate.toString();
	codeStatic = curDateX + "\n***********************************\n" + manip;
	
	return codeStatic;
}

// function to collect all chat messages between users for downloading gist
function collectChat(){
	// grab chat messages then add to text file for download 
}
