const socket = io("http://localhost:3000", {
  transports: ["websocket"],
});

const message = document.getElementById("message");
const messages = document.getElementById("messages");

const handleSubmitNewMessage = () => {
  socket.emit("sendMessage", {
    user_id: 1,
    camp_id: 1,
    message_content: message.value,
    reply_to: 0,
  });
};

socket.on("message", ({ status, message, data }) => {
  console.log(status, message, data);
  if (status === "ok") {
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
