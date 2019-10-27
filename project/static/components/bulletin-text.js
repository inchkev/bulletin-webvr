var MESSAGES = [];
var ROOM_NUMBER = 1;

AFRAME.registerComponent('bulletin-text', {
    schema: {
      room: {type: 'int', default: 1}
    },

    init: function () {
      var el = this.el;
      // this.data.room

      var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
      var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
      var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;
      this.recognizing;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.onresult = function(event) {
        for (var i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            var message = event.results[i][0].transcript;
            el.emit('send-message', {message: message.substring(0, 500)});
          }
        }
      }

      // poll database of messages
      this.bindMethods();
      this.el.addEventListener('loaded', this.load.bind(this));
    },

    load: function() {
      var scene = document.querySelector('a-scene');
      scene.addEventListener('textPlace', this.onTextPlaced);
    },

    bindMethods: function() {
      this.onTextPlaced = this.onTextPlaced.bind(this);
      this.addTextWithID = this.addTextWithID.bind(this);
      this.removeTextWithID = this.removeTextWithID.bind(this);
      this.toggleStartStop = this.toggleStartStop.bind(this);
      this.postMessage = this.postMessage.bind(this);
      var el = this.el;
      el.addEventListener('send-message', this.postMessage);
    },

    postMessage: function(e) {
      console.log(this.x);
      console.log(this.y);
      // console.log(this.zpos);
      // console.log(this.rot);
      console.log(e.detail.message);

      submit(e.detail.message, this.x, this.y);
    },

    onTextPlaced: function() {
      var scene = document.querySelector('a-scene');
      var cam = document.getElementById('cam');
      var position = cam.object3D.position;
      var rotation = cam.object3D.rotation;
      this.x = rotation.x;
      this.y = rotation.y;

      var r = 2.5;
      var h = 2.5;
      var mid = 2;
      var camheight = 1.6;
      var ypos = r * Math.tan(this.x) + camheight;
      var xpos = -r * Math.sin(this.y);
      var zpos = -r * Math.cos(this.y);
      var rot = this.y * (180 / Math.PI);

      if (ypos < mid - h/2 || ypos > mid + h/2) {
        console.log('Text placement out of bounds');
        return 1;
      }

      this.addTextWithID(this.x, this.y, 'listening... trigger again to stop recording', 'listening');

      console.log("breakpoint 1");
      this.toggleStartStop();
      // var id = 1234;
      // var text = "If you are working on something that you really care about, you don’t have to be pushed. The vision pulls you."
      
      // this.addTextWithID(x, y, text, id);
    },

    toggleStartStop: function() {
      var scene = document.querySelector('a-scene');
      if (this.recognizing) {
        this.recognition.stop();
        this.recognizing = false;
        scene.removeEventListener('textPlace', this.toggleStartStop);
        scene.addEventListener('textPlace', this.onTextPlaced);
        console.log("breakpoint 3");
        this.removeTextWithID('listening');
      } else {
        scene.removeEventListener('textPlace', this.onTextPlaced);
        scene.addEventListener('textPlace', this.toggleStartStop);
        // this.message = '';
        this.recognition.start();
        this.recognizing = true;
        console.log("breakpoint 2");
      }
    },

    addTextWithID: function(x, y, str, id) {
      var scene = document.querySelector('a-scene');
      var text = document.createElement('a-text');

      var r = 2.5;
      var camheight = 1.6;
      
      var x_pos = -r * Math.sin(y);
      var y_pos = r * Math.tan(x) + camheight;
      var z_pos = -r * Math.cos(y);
      var r_ot = y * (180 / Math.PI);

      text.setAttribute('id', id);
      text.setAttribute('position', x_pos.toString() + ' ' + y_pos.toString() + ' ' + z_pos.toString());
      text.setAttribute('rotation', '0 ' + r_ot.toString() + ' 0');
      var textvalue = 'color: white; align: center; width: 1.25; value: ' + str;
      text.setAttribute('text', textvalue);
      text.setAttribute('font', 'sourcecodepro');
      text.setAttribute('wrap-count', 25);
      scene.appendChild(text);
      // text.setAttribute('geometry', 'primitive: plane; height: auto; width: auto');
      // text.setAttribute('material', 'color: #FFFFFF');
    },

    removeTextWithID: function(id) {
      var elem = document.getElementById(id);
      var scene = document.querySelector('a-scene');
      if (elem == null) {
        return 1;
      } else {
        return scene.removeChild(elem);
      }
    }
  });


// makes server request and gets most recent messages in the rooms
function getMessages(){
    $.ajax({
    type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            url: 'getinput',
            data: JSON.stringify({messages: getJSONEDMessages(), room: ROOM_NUMBER})
    })
    .done(function(data) {
    // returns list of ids to remove, ids to add along with their content
    console.log(data);
    updateBoard(data["toAdd"], data["toRemove"]);
    });
}
// sends message to server for approval
// server returns an array consisting of [boolean message accepted, new messsages array]
function submit(message, x, y){
    if(message.indexOf("***")!=-1){
    alert("Your message has not been approved due to inappropriate content.");
    return;
    }
    console.log(message);
    // the server returns the usual new messages and ids to remove, along with a boolean specifying if message was accepted
    $.ajax({
    type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            url: 'submit',
            data: JSON.stringify({messages: getJSONEDMessages(), message: message, xrot: x, yrot:y, room: ROOM_NUMBER})
    })
    .done(function(data) {
    if(!data["approved"]){
        alert("Your message has not been approved due to inappropriate content.");
    }
    console.log(data);
    updateBoard(data["toAdd"], data["toRemove"]);
    });
}
function updateBoard(toAdd, toRemove){
    //removing elements
    console.log(toRemove);
    var bulletin = document.getElementById('bulletin-board');
    for(var i = 0; i < toRemove.length; i++){
      bulletin.components["bulletin-text"].removeTextWithID(toRemove[i]);
      MESSAGES = MESSAGES.filter(m => m.id != toRemove[i]);
    }
    for(var j = 0; j < toAdd.length; j++){
      var message = toAdd[j];
      m = new Message(message["data"], message["id"], message["xrot"], message["yrot"]);
      bulletin.components["bulletin-text"].addTextWithID(m.xrot, m.yrot, m.data, m.id);
      console.log(m);
      MESSAGES.push(m);
    }
}
function Message(data, id, xrot, yrot){
    this.data = data;
    this.id = id;
    this.xrot = xrot;
    this.yrot = yrot;
}
// formats messages for sending to the server
function getJSONEDMessages(){
    lst = [];
    for(var i = 0; i < MESSAGES.length; i++){
    lst.push(JSON.stringify(MESSAGES[i]));
    }
    return lst;
}

setInterval(function(){getMessages()}, 5000);