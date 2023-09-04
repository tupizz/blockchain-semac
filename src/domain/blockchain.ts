import { Block } from './block';
import { PayloadDTO } from '../dtos/types';

/**
 * Blockchain class
 *
 * @class Blockchain
 * @author Tadeu Tupinambá
 * @description A blockchain is a growing list of records, called blocks, that are linked together using cryptography.
 *
 * @param {Block[]} blocks - Array of blocks
 * @method isValidNewBlock - Check if a new block is valid
 * @method createNewBlock - Create a new block
 * @method addBlock - Add a new block to the blockchain
 * @method getBlockchain - Get the blockchain
 * @method getLatestBlock - Get the latest block
 * @returns {Blockchain}
 */
class Blockchain {
  private blocks: Block[];

  constructor(blocks: Block[]) {
    this.blocks = blocks;
  }

  private isValidNewBlock(newBlock: Block, previousBlock: Block): boolean {
    if (previousBlock.index + 1 !== newBlock.index) return false;

    if (previousBlock.hash !== newBlock.previousHash) return false;

    if (
      Block.calculateHash(
        newBlock.index,
        newBlock.previousHash,
        newBlock.timestamp,
        newBlock.data,
      ) !== newBlock.hash
    ) {
      return false;
    }

    return true;
  }

  private createNewBlock(data: string): Block {
    const previousBlock: Block = this.getLatestBlock();
    const index: number = previousBlock.index + 1;
    const timestamp: number = new Date().getTime();
    return new Block(index, previousBlock.hash, timestamp, data);
  }

  public addBlock(newBlock: PayloadDTO) {
    const createdBlock: Block = this.createNewBlock(JSON.stringify(newBlock));

    if (this.isValidNewBlock(createdBlock, this.getLatestBlock())) {
      this.blocks.push(createdBlock);
      return true;
    }

    return false;
  }

  public getBlockchain() {
    return this.blocks;
  }

  public getLatestBlock() {
    return this.blocks[this.blocks.length - 1];
  }
}

export { Blockchain };
