import express from 'express';
import path from 'path';
import { P2PServer } from './p2p/network';

// Start HTTP server
const app = express();

// Serve static HTML file
app.use('/', express.static(path.join(__dirname, '../public')));

const HTTP_PORT = (process.env.HTTP_PORT || 3001) as number;
const server = app.listen(HTTP_PORT, () => {
  console.log(`HTTP server running on port ${HTTP_PORT}`);
});

// Start P2P server
const p2pServer = new P2PServer(server);
p2pServer.start();
