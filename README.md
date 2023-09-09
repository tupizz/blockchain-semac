### Demo



https://github.com/tupizz/blockchain-semac/assets/15824865/b3b19de9-528c-40a9-b2a2-b25578027f02




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

After this, run `npm run dev` and `ngrok start --all` in separate terminals.

