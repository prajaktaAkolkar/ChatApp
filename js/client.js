const socket = io('http://localhost:7000');


//Get DOM elements in respective Js variables
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");




//Functions which will appendevent Info to the Container
const append = (message, position)=>{
  const messageElement = document.createElement('div');
  messageElement.innerText = message;
  messageElement.classList.add('message');
  messageElement.classList.add(position);
  messageContainer.append(messageElement);
}


//Ask new user for his/her name and let the server know
const name = prompt("Enter your name to Join");
socket.emit('new-user-joined', name );


//If new user Joins,recive his/her name from the server 
socket.on('user-joined',name => {
 append(`${name} joined the chat`,'right');
})




//If server Sends the message receive it
socket.on('receive',data => {
    append(`${data.name}:${data.message}`,'left');
    
})

//If user Leave the chat append the info to the container
socket.on('left', name =>{
    append(`${name} left the chat`, 'left');
})

//if the form get submitted, send server the mesage
form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const message = messageInput.value;
    append(`You:${message}`,'right');
    socket.emit('send',message);
    messageInput.value ='';
   
  })
  
  
 
   
