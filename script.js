// *********BEGIN PeerJS STUFF

let Peer = window.Peer;
// randomly generate Peer to keep it short
var personalId = (Math.floor(Math.random()*255)).toString();
// initial, local Peer
var peer = new Peer(personalId);
// placeholder DataConnection
var conn = null;

// dictionary of stuff to send
var outgoingDict = {}
// dictionary of stuff you received
var incomingDict = {}

// boolean to choose whose ball is used
var iAmHost = true

// for stopping the sending of data
var dataInterval;

function sendDict(){
  //console.debug("sending dict")
  conn.send(outgoingDict)
}

function onConnectButtonClicked(){
  // conn is a DataConnection object
  conn = peer.connect(room_id_input.value);
  // when YOU connect to a REMOTE peer
  // aka SEND connection
  conn.on('open', function(){
    // show successful connection to different peer
    localStatusEl.innerHTML = conn.peer
    // receive data
    iAmHost = false;
    successConnectToHostAnimation()
    console.log(`opened connection ${conn}`);
    conn.on('data', function(data){
      incomingDict = data;
    });
    sendDict()
    dataInterval = setInterval(sendDict, 10);
});
}

// on open will be launch when you successfully connect to PeerServer
peer.on('open', function(id){
  // this is for the initial Peer, where you
  // have merely set yourself up to be connected to
  localStatusEl.innerHTML = id
});


// event when a peer connects to YOU
// aka RECEIVE event
peer.on('connection', function(incomingConn) {
  conn = incomingConn
  console.log(conn)

  conn.on("open", function(){
    sendDict()
    dataInterval = setInterval(sendDict, 10);
    iAmHost = true;
    successfulConnectAsHostAnimation()
  })
  
  conn.on('data', function(data){
      console.debug("Received from remote peer:")
      console.debug(data)
      incomingDict = data;
  });
});  
// END PeerJs STUFF


// BEGIN TEMPLATING STUFF

const roomJoinTemplateRawHTML = `
    <template id="parent-template" style="display: none;">
    
    <div id="drop-in-container"><style>
      #room-id-input{
        margin-left: -3px;
        width: 50px;
        border-radius: 5px;
        border: 1px solid black;
        font-family: Times New Roman;
      }
      #room-id-input:focus{
        outline: 1px solid black;
      }
      #connect-to-room{
        background-color: white;
        padding: 0.25em 0.5em 0.25em, 0.5em;
        border: 1px solid black;
        border-radius: 5px;
        font-family: Times New Roman
      }
      #connect-to-room:hover{
        background-color: #F0F0F0;
        box-shadow: 1px 1px 0px black;
        cursor: pointer;
      }
      #drop-in-container{
        font-size: 100%;
        display: flex;
        flex-wrap: wrap;
        position: fixed;
        top: 10px;
        background: #ffae09;
        border: 1px solid black;
        border-radius: 0.1em;
        padding: 0.25em 0.25em 0.25em 0.25em;
        align-items: center;
        box-shadow: 0px 0px 5px lightgray;
        gap: 5px;
      }
      #drop-in-toggle{
        height: 1.75em;
        width: 1.75em;
        cursor: pointer;
        border-radius: 100%;
        transition: all 0.5s ease;
        transform: rotate(90deg);
      }
      #drop-in-toggle:hover{
        box-shadow: 0px 0px 10px white;
      }
      .drop-in-flex-child{
        font-size: 2.5vh;
        flex: 0 1 auto;
        flex-wrap: wrap;
        margin: 0px 0.25em 0px 0.25em;
      }
      .smooth{
        transition: all 0.25s ease;
      }
      .hides{
        display: none;
      }
    </style>
      <img src="https://penguincodingschool.github.io/peer2penguin/left.svg" class="drop-in-flex-child smooth" id="drop-in-toggle"/>
      <span class="drop-in-flex-child hides smooth">
        join a room:
      </span>
      <input 
      id="room-id-input" 
      class="drop-in-flex-child hides smooth"
      autocomplete="off"
      ></input>
      <button 
      id="connect-to-room"
      class="drop-in-flex-child hides smooth"
      onclick="onConnectButtonClicked()">go</button>
      <div class="drop-in-flex-child hides smooth">
      you are in room: <span id="localStatus">loading...</span></div>
    </div>
    </template>`



let connect_to_room_button;
let room_id_input;
let localStatusEl;
let toggleJoinMenu;
let dropInContainer;
let expanded = false;
let thingsToHide;

// create and add template for use by pen2guin
function init(){
  document.body.innerHTML += roomJoinTemplateRawHTML
  let templateEl = document.getElementById('parent-template')
  let clone = templateEl.content.firstElementChild.cloneNode(true)


  connect_to_room_button = clone.querySelector("#connect-to-room")
  room_id_input = clone.querySelector("#room-id-input")
  localStatusEl = clone.querySelector('#localStatus')
  toggleJoinMenu = clone.querySelector('#drop-in-toggle')
  dropInContainer = clone

  document.body.appendChild(clone)

  thingsToHide = Array.from(document.getElementsByClassName("hides"))

  toggleJoinMenu.addEventListener("click", function(){
    if (expanded){
      //dropInContainer.style.right = dropInRight;
      toggleJoinMenu.style.transform = "rotate(90deg)";
      thingsToHide.forEach(el => {el.style.display = "none"})
    } else {
      //dropInContainer.style.right = "-10px";
      toggleJoinMenu.style.transform = "rotate(180deg)";
      
      thingsToHide.forEach(el => {el.style.display = "inline-flex"})
    }
    expanded = !expanded
  })
}

/* for an onConnect animation - todo */

const connectToastRawHTML = `
  <template id="toast-template">
    <div id="parent-toast">
    <style>
      #parent-toast{
        width: 400px;
      }
    </style>
    </div>  
  </template>`



function successfulConnectAsHostAnimation(){

}

function successConnectToHostAnimation(){
  
}
