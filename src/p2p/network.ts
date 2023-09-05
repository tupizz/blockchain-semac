import { Server as SocketServer } from 'socket.io';
import { Server as HttpServer } from 'http';

import { Blockchain } from '../domain/blockchain';
import { Utils } from '../utils/utils';
import { PayloadDTO } from '../dtos/types';

class P2PServer {
  private httpServer: HttpServer;

  // Socket.io server
  private io: SocketServer = {} as SocketServer;

  // User ids stored in memory
  private userIds: string[] = [];

  // Blockchain in-memory instance
  private blockchain: Blockchain = Utils.createBlockchainFromScratch();

  constructor(httpServer: HttpServer) {
    this.httpServer = httpServer;
  }

  public start(): void {
    this.io = new SocketServer(this.httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    this.io.on('connection', (socket) => {
      console.log('a user connected');

      this.userIds.push(socket.id);

      // send user id to the client
      socket.emit('response-my-user-id', socket.id);

      this.initSocketListeners(socket);
      this.io.emit('response-users', this.userIds);
    });
  }

  private initSocketListeners(socket: any): void {
    socket.on('disconnect', () => {
      console.log('a user disconnected');
      const index = this.userIds.indexOf(socket.id);
      if (index !== -1) {
        this.userIds.splice(index, 1);
      }
      this.io.emit('response-users', this.userIds);
    });

    socket.on('request-users', () => {
      socket.emit('response-users', this.userIds);
    });

    socket.on('request-blockchain', () => {
      socket.emit('response-blockchain', this.blockchain.getBlockchain());
    });

    socket.on('new-block-mined', (payload: PayloadDTO) => {
      console.log('Received new block');

      const blockAdded = this.blockchain.addBlock(payload);

      if (blockAdded) {
        this.io.emit('notify-new-block', blockAdded);
      }
    });
  }
}

export { P2PServer };
