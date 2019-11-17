const http = require('http');
const debug = require('debug')('server-logger');
const app = require('./restful/app');

//Port checker
const portNumberChecker = val => {
  const port = parseInt(val, 10);
  if(isNaN(port)){
    return val;
  }
  if(port >= 0){
    return port;
  }
  return false;
}

const onError = error => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// Listening on incoming request
const onListening = () => {
  server.address();
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  debug("Listening on " + bind);
};

//Port Number Config
const port = portNumberChecker(process.env.PORT || "3000");

app.set('port', port)
const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
server.listen(port);

