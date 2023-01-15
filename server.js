var express = require('express');
const app = express();
const server = app.listen(process.env.PORT || 3000, listen); //heroku?
function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://' + host + ':' + port);
}
app.use(express.static('public'));
// WebSockets Time!!
const io = require('socket.io')(server);
const fs = require('fs');
// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection',



  // We are given a websocket object in our function
  function (socket) {

    socket.lastMessage = Date.now()
    socket._Name = "User#" + Math.floor(Math.random() * 9000 + 1000)
    console.log("We have a new client: " + socket.conn.remoteAddress + " " + socket.id);

    // When this user emits, client side: socket.emit('otherevent',some data);
    socket.on('message',
      function (data) {
        if (Date.now() - socket.lastMessage < 1000 || data == "") {
          return
        }
        socket.lastMessage = Date.now();
        if (data.slice(0, 6) == "/name ") {

          socket._Name = data.slice(6, 17);
        } else {
          let message = currentTime() + " " + socket._Name + ": " + data;
          writeToFile("messages.txt", message)
          io.sockets.emit('message', message);
        }


      }
    );

    socket.on('disconnect', function () {
      console.log("Client has disconnected");
    });
  }
);
function currentTime() {
  var date = new Date();
  var hours = date.getHours();
  if (hours < 9) { hours = "0" + hours }
  var minutes = date.getMinutes();
  if (minutes < 9) { minutes = "0" + minutes }
  var seconds = date.getSeconds();
  if (seconds < 9) { seconds = "0" + seconds }
  return hours + ":" + minutes + ":" + seconds;
}
function writeToFile(filename, data) {
  fs.appendFile(filename, data + '\n', (err) => {
    if (err) throw err;
  });
}