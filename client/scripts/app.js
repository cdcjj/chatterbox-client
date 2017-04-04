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

      app.fetch();
      console.log('chatterbox: Message sent');
    },
    error: function(data) {
      console.error('chatterbox: Failed to send message', data);
    }
  });
};
//'type=' + type + '&user_id=' + user_id;
app.fetch = function() {
  $.ajax({
    type: 'GET',
    url: app.server,
    data: 'order=-createdAt',
    success: function(data) {
      console.log(data.results);
      var main = $('#chats');
      for (var i = 0; i < data.results.length; i++) {
        app.renderMessage(data.results[i]);
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
  var $roomName = $('<a></a>');
  $roomName.attr('id', roomName);
  $roomName.attr('href', '#');
  $roomName.text(roomName);
  $('#roomSelect').append($roomName);
};

app.addRoom = function(e) {
  e.preventDefault();
  var roomName = $('#newRoom').val();
  app.roomList.push(roomName);
  app.renderAllRooms();
  app.send({text:"asdf", username:window.location.search.slice(10), room:roomName});
};

app.renderAllRooms = function() {
  for(var i = 0; i < app.roomList.length; i++) {
    app.renderRoom(app.roomList[i]);
  }
};

$(document).ready(function(){
  $('#rooms').submit(app.addRoom);
  app.fetch();
});

var self = {
  // username: window.location.search.slice(10),
  addFriend: function(name) {
    this.friends[name] = true;
  },
  removeFriend: function(name) {
    delete this.friends[name];
  },
  friends: {},
  getFriendsList: function() {
    return Object.keys(this.friends);
  }
};

app.handleUsernameClick = function (name) {
  self.addFriend(name);
};

app.handleSubmit = function(e) {
  //debugger;
  e.preventDefault();
  var text = $('#message').val();
  app.send({text:text, username:window.location.search.slice(10), room:'lobby'});//change room name
  //setTimeout(function(){app.fetch()}, 1000);
};
