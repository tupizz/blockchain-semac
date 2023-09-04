### Running locally

```
nvm use
npm install
npm run dev
```

### For Demo

Ngrok File:
`/Users/$USER/Library/Application Support/ngrok`

Where:
`$USER=tupizz`

Add the following to the ngrok file:
```
authtoken: <token>
region: us
tunnels:
    blockchain:
      addr: 3001
      hostname: semac.ngrok.io
      proto: http
version: "2"
```

After this, run `npm run dev` and `npm run ngrok` in separate terminals.

