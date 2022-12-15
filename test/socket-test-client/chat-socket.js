const socket = io("http://localhost:81", {
  transports: ["websocket"],
  query: {
    uid: new Date().getTime(),
  }
});

const message = document.getElementById("message");
const messages = document.getElementById("messages");

const handleSubmitNewMessage = () => {
  console.log(message.value)
  socket.emit("tests", message.value);
};

socket.on("message_pub", ({ code, message, data }) => {
  console.log(socket.sids, socket.rooms)
  console.log(code, message, data);
  if (code === 1) {
    handleNewMessage(data.message);
  } else {
    throw new Error(message)
  }
  
});

socket.on("exception", ({ code, message, data }) => {
  console.log(code, message, data);
  if (code === 1) {
    handleNewMessage(data.message);
  } else {
    throw new Error(message)
  }
});

handleNewMessage = (message) => {
  messages.appendChild(buildNewMessage(message));
};

const buildNewMessage = (message) => {
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(message));
  return li;
};
