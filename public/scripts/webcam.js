let isAlreadyCalling = false;
let getCalled = false;
let sId = '';

function setStatus(status) {
  document.querySelector('#status').textContent = status;
}

function log(log) {
  const msg = typeof log === 'object' ? JSON.stringify(log, null, 2) : log;
  document.querySelector('#log').textContent = `${msg}\n` + document.querySelector('#log').textContent;
}

const existingCalls = [];

const { RTCPeerConnection, RTCSessionDescription } = window;

const peerConnection = new RTCPeerConnection();


async function callUser(socketId) {
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(new RTCSessionDescription(offer));

  socket.emit("call-user", {
    offer,
    to: socketId
  });

  setStatus('calling..');
}

const socket = io.connect(location.hash.replace(location.pathname, ''));

socket.on("update-user-list", ({ users }) => {
  sId = users[0];
});

socket.on("call-made", async data => {
  if (getCalled) {
    const confirmed = confirm(
      `User "Socket: ${data.socket}" wants to call you. Do accept this call?`
    );

    if (!confirmed) {
      socket.emit("reject-call", {
        from: data.socket
      });

      return;
    }
  }

  await peerConnection.setRemoteDescription(
    new RTCSessionDescription(data.offer)
  );
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(new RTCSessionDescription(answer));

  socket.emit("make-answer", {
    answer,
    to: data.socket
  });
  getCalled = true;
});

socket.on("answer-made", async data => {
  log(data.answer);
  await peerConnection.setRemoteDescription(
    new RTCSessionDescription(data.answer)
  );
});

// socket.on("call-rejected", data => {
//   alert(`User: "Socket: ${data.socket}" rejected your call.`);
//   unselectUsersFromList();
// });

// peerConnection.ontrack = function({ streams: [stream] }) {
//   const remoteVideo = document.getElementById("remote-video");
//   if (remoteVideo) {
//     remoteVideo.srcObject = stream;
//   }
// };


(async() => {
try {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
  log(`tracks: ${stream.getTracks().length}`);
  stream.getTracks().forEach(track => {
    log(track.id);
    peerConnection.addTrack(track, stream)
  });
  const localVideo = document.getElementById("local-video");
  if (localVideo) {
    localVideo.srcObject = stream;
  }
} catch (error) {
  alert(error);
}
})();

document.querySelector('.start').addEventListener('click', async () => {
  log(`sId: ${sId}`);
  callUser(sId);
})

// navigator.getUserMedia(
//   { video: true, audio: true },
//   stream => {
//     const localVideo = document.getElementById("local-video");
//     if (localVideo) {
//       localVideo.srcObject = stream;
//     }

//     stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
//   },
//   error => {
//     console.warn(error.message);
//   }
// );
