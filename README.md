Turn your mobile phone into webcam even without internet connection using websocket and webRTC

Based on https://github.com/Miczeq22/simple-chat-app

## Installation

1. `mkdir security && cd security`
2. Create `cert.pem` and `key.pem`
  You can use `openssl` and
  ```
  openssl req -x509 -newkey rsa:2048 -keyout keytmp.pem -out cert.pem -days 365
  openssl rsa -in keytmp.pem -out key.pem
  ```
3. `npm insall`
4. `npm run start`

Your console should prting

```
Server is listening on https://localhost:5000,
or on your network https://[your-local-network-ip]:5000
```

## How to use?

Make sure that both of the devices are on the same network

**In the "webcam" device**

1. Go to `https://[your-local-network-ip]:5000/webcam.html` (ignore the security warning if any)
2. Click on the ⏺ button and allow the browser to access the device's camera

**In the "viewer" device**

1. Go to `https://[your-local-network-ip]:5000` (ignore the security warning if any)
2. Click on the "play" button in the video