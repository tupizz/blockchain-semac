import { Server as SocketServer } from 'socket.io';
import { Server as HttpServer } from 'http';

import { Blockchain } from '../domain/blockchain';
import { Utils } from '../utils/utils';
import { TransactionDTO } from '../dtos/types';
import { Mempool } from '../domain/mempool';

class P2PServer {
  private httpServer: HttpServer;

  // Socket.io server
  private io: SocketServer = {} as SocketServer;

  // User ids stored in memory
  private userIds: string[] = [];

  // Blockchain in-memory instance
  private blockchain: Blockchain = Utils.createBlockchainFromScratch();

  // Mempool in-memory instance
  private mempool: Mempool = new Mempool();

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
    /**
     * When a peer is disconnected, remove it from the list of users
     */
    socket.on('disconnect', () => {
      console.log('a user disconnected');
      const index = this.userIds.indexOf(socket.id);
      if (index !== -1) {
        this.userIds.splice(index, 1);
      }
      this.io.emit('response-users', this.userIds);
    });

    /**
     * When a new peer is connected, it will request the user ids
     */
    socket.on('request-users', () =>
      socket.emit('response-users', this.userIds),
    );

    /**
     * When a new peer is connected, it will request the blockchain
     */
    socket.on('request-blockchain', () => {
      socket.emit('response-blockchain', this.blockchain.getBlockchain());
    });

    /**
     * When we send a challenge on /miner, we will mine a new block
     * Every time a new block is mined, notify all peers for each block added
     */
    socket.on('new-block-mined', () => {
      console.log('Received new block');

      const transactions = this.mempool.getAllTransactions();
      console.log(transactions);
      const purePayload = transactions.map(
        (transaction) => transaction.payload,
      );

      for (const payload of purePayload) {
        // For teaching purpose each block will contain only one transaction
        // But in real world you can add multiple transactions in a block
        // And the blocks with higher fees will be mined first and added to the blockchain
        const blockAdded = this.blockchain.addBlock(payload);
        this.io.emit('notify-new-block', blockAdded);
      }
    });

    /**
     *  When a new transaction is added, notify all peers
     *  This transaction is saved in MemPool and will be added to the blockchain
     *  When a new block is mined
     *  Every time a new transaction is added to the mempool, notify all peers
     */
    socket.on('transaction-added', (transactionDTO: TransactionDTO) => {
      console.log('Received new block to mine in mempool');
      console.log(transactionDTO);

      // add transaction to mempool
      this.mempool.addTransaction(transactionDTO);

      // broadcast to all peers
      this.io.emit('notify-new-transaction', transactionDTO);
    });
  }
}

export { P2PServer };
