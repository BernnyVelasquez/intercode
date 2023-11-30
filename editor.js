window.onload = getMessages();
let editor = document.querySelector("#editor");
const intervalID = setInterval(getMessages, 100);
const intervalIDSC = setInterval(sendCode, 100);
let currentChat = null;
var chatroomId = generateChatroomId()
let editorAce = ace.edit(editor,{
  theme: "ace/theme/cobalt",
  mode: "ace/mode/python",
});

// Function to generate a random 5-character chatroom ID
function generateChatroomId() {
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let chatroomMaker = "";
  for (let i = 0; i < 5; i++) {
      chatroomMaker += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return chatroomMaker;
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

// Function to create a new chatroom and store its ID in sessionStorage
function chatroomCreator(chatroomId) {
  sessionStorage.setItem('chatroomId', chatroomId);
  let newChatroom = {
      "Id": chatroomId,
      "Code": "" // Set the initial code as an empty string
  };
  displayId(chatroomId);
  return newChatroom;
}

// Function to push a new chatroom to the server
function pushChatRoom() {
  let xhr = new XMLHttpRequest();
  let url = 'http://10.16.14.104/~bernny/cp5/set-code.php';
  let check = sessionStorage.getItem('chatroomId');

  if (!check) {
      sessionStorage.clear();
      let data = chatroomCreator(chatroomId); 
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Content-type', 'application/json');
      
      xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
              if (xhr.status === 200) {
                  console.log(xhr.responseText);
              } else {
                  console.error("Error:", xhr.status, xhr.statusText);
              }
          }
      };
      xhr.send(JSON.stringify(data));
  } else {
      console.log(sessionStorage)
      let chatroomgeter = sessionStorage.getItem('chatroomId');
      displayId(chatroomgeter);
      chatroomId = chatroomgeter;
  }
}

// Call the function to push a new chatroom
pushChatRoom();

// Function to retrieve messages from the server
function getMessages(){
  
  let xhr = new XMLHttpRequest();
  xhr.addEventListener("load", handleMessages);
  xhr.responseType = "json"
  xhr.open("GET", "http://10.16.14.104/~bernny/cp5/get-messages.php?chatRoomId=" + chatroomId);
  xhr.send();
}

// Function to handle and display messages on the page
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
        var textNode = document.createTextNode("Observer: "+ data[i].chat);
      } else if(data[i].user == "Editor"){
        var textNode = document.createTextNode("Me: "+ data[i].chat);
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
    let data = { "User" : "Editor", 
    "Chat": inputValue, 
    "Time": new Date().getTime(), 
    "Id": chatroomId}; // Modify this data according to your requirements

    

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









// Function to get the current code from the editor
function getCurrentCode() {
  return editorAce.getValue();
}

// XmlHttp Function to send the code to the server
function sendCodeToServer(currentCode, chatroomId) {
  let xhr = new XMLHttpRequest();
  let url = 'http://10.16.14.104/~bernny/cp5/set-code.php';
  xhr.open('POST', url, true);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.setRequestHeader('X-Action', 'updateCode');
  xhr.onreadystatechange = function() {
      if (xhr.status === 200) console.log(xhr.responseText);
  };
  xhr.send(JSON.stringify({ "Code": currentCode, "Id": chatroomId }));
}

// Main function to send the current code to the server
function sendCode() {
  sendCodeToServer(getCurrentCode(), chatroomId);
}











