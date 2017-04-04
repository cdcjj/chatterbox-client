var helper = {
  hash: function (str) {
    //console.log(str);
    var hash = 0;
    if (str.length === 0) {
      return hash;
    } 
    for (i = 0; i < str.length; i++) {
      char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }
};


var self = {
  activeRoom: 'lobby',
  addFriend: function(name) {
    this._friends[name] = true;
  },
  removeFriend: function(name) {
    delete this._friends[name];
  },
  friendInList: function(name) {
    return self._friends[name] !== undefined;
  },
  _friends: {},
  getFriendsList: function() {
    return Object.keys(this._friends);
  }
};


var app = {};

app.server = 'http://parse.atx.hackreactor.com/chatterbox/classes/messages';
app.roomList = [];
app.init = function() {
  $('#rooms').submit(app.addRoom);
  $('#send').submit(app.handleSubmit);
  app.fetch({order: '-createdAt'}, false);
  app.currentTop;
  app.handler;
};

app.send = function(userInput) {
  $.ajax({
    type: 'POST',
    url: 'http://parse.atx.hackreactor.com/chatterbox/classes/messages',
    data: JSON.stringify(userInput),
    contentType: 'application/json',
    success: function(data) {
      // app.fetch({where: JSON.stringify({roomname: self.activeRoom}), order: '-createdAt'}, true);
      console.log('chatterbox: Message sent');
    },
    error: function(data) {
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

app.fetch = function(params = {order: '-createdAt'}, render = true) {
  $.ajax({
    type: 'GET',
    url: app.server,
    data: $.param(params),
    success: function(data) {
      render = render && (data.results.length > 0 && app.currentTop !== JSON.stringify(data.results[0]));
      app.currentTop = JSON.stringify(data.results[0]);
      var main = $('#chats');
      if (render) {
        app.clearMessages();
      }
      for (var i = 0; i < data.results.length; i++) {
        if (render) {
          app.renderMessage(data.results[i]);
        }
        app.addToRoomList(data.results[i].roomname);
      }
      // checks for new messages
      if (render) {
        app.handler = setTimeout(function a() {
          app.fetch({where: JSON.stringify({roomname: self.activeRoom}), order: '-createdAt'}, true);
          setTimeout(a, 1000);
        }, 1000);
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
  $message.attr('username', message.username);
  $user.click(function(e) {
    app.handleUsernameClick(message.username); // creating new function everytime -- make it more efficient
  });
  if (self.friendInList(message.username)) {
    $message.addClass('friend');
  }
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

app.renderAllRooms = function() {
  $('#roomSelect').html('');
  for (var i = 0; i < app.roomList.length; i++) {
    app.renderRoom(app.roomList[i]);
    $('#roomSelect').append($('<br />'));
  }
};

app.addToRoomList = function(roomName) {
  if (app.roomList.includes(roomName) || roomName === undefined) {
    return false;
  }
  app.roomList.push(roomName);
  app.renderAllRooms();
};

app.addRoom = function(e) {
  e.preventDefault();
  var roomName = $('#newRoom').val();
  if (app.addToRoomList(roomName) === false) {
    alert('Room already exists');
    return;
  }
  app.displayRoom(roomName);
  $('#newRoom').val('');
};

app.handleUsernameClick = function (name) {
  self.addFriend(name);
  app.fetch({where: JSON.stringify({roomname: self.activeRoom}), order: '-createdAt'}, true);
  $('[username=' + name + ']').addClass('friend');
};

app.handleSubmit = function(e) {
  e.preventDefault();
  var text = $('#message').val();
  app.send({text: text, username: window.location.search.slice(10), roomname: self.activeRoom});
  $('#message').val('');
};

app.displayRoom = function(roomName) {
  $('#' + helper.hash(self.activeRoom)).removeClass('activeRoom');
  $('#' + helper.hash(roomName)).addClass('activeRoom');
  self.activeRoom = roomName;
  var params = {where: JSON.stringify({roomname: self.activeRoom}), order: '-createdAt'};
  if (app.handler) {
    clearTimeout(app.handler);
  }
  app.clearMessages();
  app.fetch(params);
  $('h1').text('chatterbox/' + self.activeRoom);
  $('title').text('chatterbox/' + self.activeRoom);
};

// http://parseplatform.org/docs/rest/guide/#queries