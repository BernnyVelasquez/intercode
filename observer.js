 sessionStorage.clear();

 document.getElementById('create').addEventListener('click', clearSesesion);

 function clearSesesion(){
  sessionStorage.clear();
 }


window.onload = getMessages();
let editor = document.querySelector("#editor");
let roomId = "";
const intervalID = setInterval(getMessages, 100);
const intervalIDCode = setInterval(getCode, 100);
let editorAce = ace.edit(editor,{
  theme: "ace/theme/cobalt",
  mode: "ace/mode/python",
});

editorAce.setReadOnly(true);


document.getElementById('roomIdInput').addEventListener('keypress', function(event) {
  
  if (event.key === 'Enter') {
    

    let xhr = new XMLHttpRequest();
    xhr.addEventListener("load", checkRooms);
    xhr.responseType = "json"
    xhr.open("GET", "http://10.16.14.104/~bernny/cp5/get-room-ids.php");
    xhr.send();

  }});



function checkRooms(){
  if(this.status = 200){
    let inputValue = document.getElementById('roomIdInput').value;
    //Sort this data
    let data = this.response; /* Json data */
    let found = false;
    if (data){
    for(let i = 0; i < data.length; i++){
      if (data[i].chatid.trim().toLowerCase() == inputValue.trim().toLowerCase()){
        sessionStorage.setItem('chatroomId', inputValue);
        found = true;
      } 
    }

    if(found){
      let parentElement = document.getElementById('top-right-input');

      parentElement.parentNode.removeChild(parentElement);

      displayId(inputValue);
    } else{
      alert("Id not found");
    }
    
  }
} else{
  alert("No room open, please create one")
}
  
}

// Function to display the chatroom ID on the page
function displayId(chatroomId) {

  let div = document.createElement('div');
  // Styling for the displayed chatroom ID
  div.style.position = 'fixed';
  div.style.top = '10px'; 
  div.style.right = '10px'; 
  div.style.zIndex = 5;
  div.style.fontSize = '20px';
  div.style.color = 'white';
  div.textContent = 'Chatroom ID: ' + chatroomId;
  document.body.appendChild(div);
}


function getMessages(){
  chatroomId = sessionStorage.getItem('chatroomId')
  let xhr = new XMLHttpRequest();
  xhr.addEventListener("load", handleMessages);
  xhr.responseType = "json"
  xhr.open("GET", "http://10.16.14.104/~bernny/cp5/get-messages.php?chatRoomId=" + chatroomId);
  xhr.send();
}



function handleMessages(){
  if(this.status = 200){
    //Sort this data
    let data = this.response; /* Json data */
    
    if (data){
        
    let box = document.getElementById('messages');
    let elements = box.querySelectorAll('.chat');
    
    elements.forEach(function(element) {
      element.parentNode.removeChild(element);
    });

    let divw = document.createElement("div");
    let p4 = document.createElement("p");
    divw.classList.add("chat");
    let textNodeh = document.createTextNode("This is an interactive room where coders can code together. Enjoy!");
    p4.appendChild(textNodeh);
    divw.appendChild(p4);
    box.appendChild(divw);

    for(let i = 0; i < data.length; i++){
      let div = document.createElement("div");
      div.classList.add("chat");
      let p = document.createElement("p");
      if (data[i].user == "Observer"){
        var textNode = document.createTextNode("Me: "+ data[i].chat);
      } else if(data[i].user == "Editor"){
        var textNode = document.createTextNode("Editor: "+ data[i].chat);
      } else {
        break
      }
      
      p.appendChild(textNode);
      div.appendChild(p);
      box = document.getElementById('messages');
      box.appendChild(div);
      
    }
  } else{
    console.log("Something wroong in handle messages")
  }

  } else{
    console.log("something went wrong");
  }

  
} 

document.getElementById('message').addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    let inputValue = document.getElementById('message').value;
    let chatBox = document.getElementById("messages"); 
    chatBox.scrollTop = chatBox.scrollHeight;

    // Make an AJAX request to the PHP script
    let xhr = new XMLHttpRequest();
    let url = 'http://10.16.14.104/~bernny/cp5/add-chat.php'; // 
    let data = { "User" : "Observer", 
    "Chat": inputValue, 
    "Time": new Date().getTime(), 
    "Id": sessionStorage.getItem("chatroomId")}; // Modify this data according to your requirements

    

    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.onreadystatechange = function() {
        if (xhr.status === 200) {
            console.log(xhr.responseText); 
        }
    };

    xhr.send(JSON.stringify(data));
    document.getElementById('message').value = "";
  }});

  function getCode(){
    chatroomId = sessionStorage.getItem('chatroomId');

    if(chatroomId){
      let xhr = new XMLHttpRequest();
      xhr.addEventListener("load", handleCode);
      xhr.responseType = "json"
      xhr.open("GET", "http://10.16.14.104/~bernny/cp5/get-code.php?chatRoomId=" + chatroomId);
      xhr.send();
    }

  }

  function handleCode(){
    if(this.status = 200){
      let data = this.response; 
      editorAce.setValue(data[0].code);
}
}

  