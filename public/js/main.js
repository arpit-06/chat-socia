const chatForm = document.getElementById('chat-form');
const chatMessages = document.getElementById('chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
// Get username and Room from URL
const {username,room} = Qs.parse(location.search,{ignoreQueryPrefix:true});
const socket = io();
//Join chatroom
socket.emit('joinRoom', {username,room});

//get users and room
socket.on('roomUsers', ({room, users})=>{
    outputRoomName(room);
    outputUsers(users);
})
// Message from server
socket.on("message",message=>{
    console.log(message);
    outputMessage(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
});
//Message submit
chatForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    //Get message text
    const msg = e.target.elements.msg.value;
    //Emit message to the server
    socket.emit('chatMessage', msg);
    // Clear input
    e.target.elements.msg.value = "";
    e.target.elements.msg.focus();

})

// Output message to DOM
function outputMessage(message){
    const div = document.createElement('div');
    div.style.backgroundColor = 'lightskyblue';
    div.style.padding='10px';
    div.style.margin='15px';
    div.innerHTML = `<span class="badge badge-light p-2">${message.username}</span> <span class="text-white">${message.time}</span>
    <p>
    ${message.text}
    </p>`;
    document.querySelector('#chat-messages').appendChild(div);
}

function outputRoomName(room)
{
    roomName.value = room;
}
function outputUsers(users)
{
    userList.innerHTML = `${users.map(user=>`<li class="list-group-item text-dark">${user.username}</li>`).join('')}`
    userList.style.padding='20px';
}