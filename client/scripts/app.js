var app = {};

app.server = 'http://parse.atx.hackreactor.com/chatterbox/classes/messages';
app.roomList = [];
app.init = function() {

};

app.send = function(userInput) {
  $.ajax({
    type: 'POST',
    url: 'http://parse.atx.hackreactor.com/chatterbox/classes/messages',
    data: JSON.stringify(userInput),
    contentType: 'application/json',
    success: function(data) {
      //debugger;
      console.log('asdfss');
      app.fetch({roomname: self.activeRoom, order: '-createdAt'}, true);
      console.log('chatterbox: Message sent');
      setTimeout(app.fetch, 1000);
    },
    error: function(data) {
      console.error('chatterbox: Failed to send message', data);
    }
  });
};
app.fetch = function(params = {order: '-createdAt'}, render=true) {
  $.ajax({
    type: 'GET',
    url: app.server,
    //data: 'order=-createdAt',
    data: $.param(params),
    success: function(data) {
      console.log(data.results);
      var main = $('#chats');
      app.clearMessages();
      for (var i = 0; i < data.results.length; i++) {
        if(render) {
          app.renderMessage(data.results[i]);
        }
        app.addToRoomList(data.results[i].roomname);
        console.log(data.results[i].roomname)
      }
    },
    error: function(data) {
      console.error('chatterbox: Failed to retrieve messages :\'(');
    }

  });
};

app.clearMessages = function() {
  $('#chats').html('');
};

app.renderMessage = function(message) { 
  var $main = $('#chats');
  var $message = $('<div></div>');
  var $user = $('<a class="username" href="#"></a>');
  $user.click(function() {
    app.handleUsernameClick(message.username);
  });
  $user.text(message.username);
  $message.append($user);
  var $userMessage = $('<p>' + '</p>');
  $userMessage.text(message.text);
  $message.append($userMessage);
  $main.append($message);
};

app.renderRoom = function(roomName) {
  // roomName = safeString(roomName);
  var $roomName = $('<a></a>');
  $roomName.attr('id', helper.hash(roomName));
  $roomName.click(function() {
    app.displayRoom(roomName);
  });
  $roomName.attr('href', '#');
  $roomName.text(roomName);
  $('#roomSelect').append($roomName);
};

app.addToRoomList = function(roomName) {
  if(app.roomList.includes(roomName)) {
    return false;
  }
  app.roomList.push(roomName);
  app.renderAllRooms();
};

app.addRoom = function(e) {
  e.preventDefault();
  var roomName = $('#newRoom').val();
  if(app.addToRoomList(roomName)) {
    alert('Room already exists');
    return;
  }
};

app.renderAllRooms = function() {
  $('#roomSelect').html('');
  for(var i = 0; i < app.roomList.length; i++) {
    app.renderRoom(app.roomList[i]);
    $('#roomSelect').append($('<br />'));
  }
};

$(document).ready(function(){
  $('#rooms').submit(app.addRoom);
  $('#send').submit(app.handleSubmit);
  console.log(app.roomList);
  app.fetch({order: '-createdAt'}, false);
  app.displayRoom(self.activeRoom);
});

var self = {
  // username: window.location.search.slice(10),
  activeRoom: 'lobby',
  addFriend: function(name) {
    this._friends[name] = true;
  },
  removeFriend: function(name) {
    delete this._friends[name];
  },
  _friends: {},
  getFriendsList: function() {
    return Object.keys(this._friends);
  }
};

app.handleUsernameClick = function (name) {
  self.addFriend(name);
};

app.handleSubmit = function(e) {
  
  e.preventDefault();
  var text = $('#message').val();
  app.send({text:text, username:window.location.search.slice(10), roomname:self.activeRoom});//change room name
  //setTimeout(function(){app.fetch()}, 1000);
};

app.displayRoom = function(roomName) {
  var params = {where: JSON.stringify({roomname: roomName}), order: '-createdAt'};
  app.fetch(params);
  $('#' + helper.hash(self.activeRoom)).removeClass('activeRoom');
  $('#' + helper.hash(roomName)).addClass('activeRoom');
  self.activeRoom = roomName;
};


var helper = {
  hash: function (str){
    var hash = 0;
    if (str.length === 0) {
      return hash;
    } 
    for (i = 0; i < str.length; i++) {
      char = str.charCodeAt(i);
      hash = ((hash<<5)-hash)+char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }
};

// http://parseplatform.org/docs/rest/guide/#queries
// roomName = <a> link currently
// add event handler function that fetch messages with parameter of roomName = clicked roomName
// data:"&order="+roomname