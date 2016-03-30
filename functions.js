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
	var firstWord, secondWord, number;

	var selectorOne =math.random();
	var selectorTwo =math.random();
	number = math.random();

	hash= firstWord + number + secondWord;
	return hash;
}  