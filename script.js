
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
//dictionary of stuff you received
var incomingDict = {}

function sendDict(){
  console.log("sending dict")
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
    console.log(conn);
    conn.on('data', function(data){
      incomingDict = data;
    });

    setInterval(sendDict, 1);
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
    setInterval(sendDict, 1);
  })
  
  conn.on('data', function(data){
      console.log("Received from remote peer:")
      console.log(data)
      incomingDict = data;
  });
});  



// END PeerJs STUFF

// BEGIN TEMPLATING STUFF

const dropInWidth = "33vw"
const dropInRight = `calc(-${dropInWidth} + 1em)`

const templateRawHTML = `
    <template id="parent-template" style="display: none;">
    <style>
      #room-id-input{
        margin-left: 10px;
        width: 50px;
        height: 1em;
      }
      #connect-to-room-button{
        margin-left: 10px;
      }
      #drop-in-container{
        font-size: 1.5em;
        display: flex;
        position: fixed;
        height: 1em;
        width: ${dropInWidth};
        right: ${dropInRight};
        top: 5px;
        background: #ffae09;
        border: 1px solid orange;
        border-radius: 0.25em;
        padding: 0.25em 0.5em 0.25em 0.25em;
        align-items: center;
        transition: all 0.5s ease;
        box-shadow: 0px 0px 5px gray;
      }
      #drop-in-toggle{
        height: 1em;
        width: 1em;
        cursor: pointer;
        border-radius: 100%;
        transition: all 0.5s ease;
      }
      #drop-in-toggle:hover{
        box-shadow: 0px 0px 10px white;
      }
      .drop-in-flex-child{
        flex: 0 1 auto;
        flex-wrap: wrap;
        margin: 0px 0.25em 0px 0.25em;
      }
    </style>
    <div id="drop-in-container">
      <img src="left.svg" class="drop-in-flex-child" id="drop-in-toggle"/>
      <span class="drop-in-flex-child">
        join a room:
      </span>
      <input id="room-id-input" class="drop-in-flex-child"></input>
      <button 
      id="connect-to-room"
      class="drop-in-flex-child"
      onclick="onConnectButtonClicked()">join</button>
      <div class="drop-in-flex-child">
      you are in room: <span id="localStatus">loading...</span></div>
    </div>
    </template>`


var connect_to_room_button;
var room_id_input;
var localStatusEl;
var toggleJoinMenu;
var dropInContainer;
var expanded = false;
var shared;

// create and add template for use by pen2guin
var body = document.body
function init(){
  body.innerHTML += templateRawHTML
  let templateEl = document.getElementById('parent-template')
  let clone = templateEl.content.cloneNode(true)


  connect_to_room_button = clone.getElementById("connect-to-room")
  room_id_input = clone.getElementById("room-id-input")
  localStatusEl = clone.getElementById('localStatus')
  toggleJoinMenu = clone.getElementById('drop-in-toggle')
  dropInContainer = clone.getElementById('drop-in-container')
  shared = document.getElementById("shared")


  toggleJoinMenu.addEventListener("click", function(){
    dropInContainer.style.right = expanded ? dropInRight : "-10px";
    dropInContainer.style.height = expanded ? "1em" : "2em";
    toggleJoinMenu.style.transform = expanded ? "none" : "rotate(180deg)";
    expanded = !expanded
  })
  document.body.appendChild(clone)
}
