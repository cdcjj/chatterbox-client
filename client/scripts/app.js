var app = {};

app.server;

app.init = function() {

};

app.send = function(userInput) {
  $.ajax({
    type: 'POST',
    // url: 'http://parse.atx.hackreactor.com/chatterbox/classes/messages',
    data: JSON.stringify(userInput),
    success: function(data) {
      console.log('chatterbox: Message sent');
    },
    error: function(data) {
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

app.fetch = function() {
  $.ajax({
    type: 'GET',
    url: app.server,
    success: function(data) {
      var main = $('#chats');
      for (var i = 0; i < data.results.length; i++) {
        var message = $('<div></div>');
        var user = $('<h6></h6>');
        user.text(data.results[i].username);
        message.append(user);
        var userMessage = $('<p>' + '</p>');
        userMessage.text(data.results[i].text);
        message.append(userMessage);
        main.append(message);
      }
    }
  });
};

app.clearMessages = function() {
  $('#chats').html('');
};

app.renderMessage = function(message) { 
  var $main = $('#chats');
  var $message = $('<div></div>');
  var $user = $('<h6></h6>');
  $user.text(message.username);
  $message.append($user);
  var $userMessage = $('<p>' + '</p>');
  $userMessage.text(message.text);
  $message.append($userMessage);
  $main.append($message);
};

app.renderRoom = function(roomName) {
  if ($('#roomSelect').length === 0) {
    var $roomName = $('<div></div>');
    $roomName.attr('id', 'roomSelect');
    $('#chats').append($roomName);
  }
  $('#roomSelect').append($('<div></div>'));
};

// app.renderRoom('superLobby');

// expect($('#roomSelect').children().length).to.equal(1);












// $.ajax({
//   url: 'http://parse.atx.hackreactor.com/chatterbox/classes/messages',
//   success: function(data) {
//     var main = $('#main');
//     for (var i = 0; i < data.results.length; i++) {
//       var message = $('<div></div>');
//       var user = $('<h6></h6>');
//       user.text(data.results[i].username);
//       message.append(user);
//       var userMessage = $('<p>' + '</p>');
//       userMessage.text(data.results[i].text);
//       message.append(userMessage);
//       main.append(message);

//     }
//   }
// });


// jQuery.ajax({
//     url: 'http://any-site.com/endpoint.json'
// }).done( function( data ) {
//     var a = jQuery( '<a />' );
//     a.attr( 'href', data.url );
//     a.text( data.title );
 
//     jQuery( '#my-div' ).append( a );
// });