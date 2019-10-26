var MESSAGES = [];
var ROOM_NUMBER = 1;
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
function submit(){
    var message = $("#message").val();
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
            data: JSON.stringify({messages: getJSONEDMessages(), message: message, xrot: 5, yrot:6, room: ROOM_NUMBER})
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
    for(var i = 0; i < toRemove.length; i++){
    //TODO
    //removeMessage(id);
    MESSAGES = MESSAGES.filter(m => m.id != toRemove[i]);
    }
    for(var j = 0; j < toAdd.length; j++){
    var message = toAdd[j];
    m = new Message(message["data"], message["id"], message["xrot"], message["yrot"]);
    // // TODO:
    //here add the message to the bulletin
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