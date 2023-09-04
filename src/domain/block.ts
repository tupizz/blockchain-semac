import { createHash } from 'crypto';

/**
 * Block class
 *
 * @description A block is a data structure that represents a unit of work.
 * @author Tadeu Tupinambá
 * @class Block
 */
class Block {
  public hash: string;

  public index: number;

  public previousHash: string;

  public timestamp: number;

  public data: string;

  constructor(
    index: number,
    previousHash: string,
    timestamp: number,
    data: string,
  ) {
    this.index = index;
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.data = data;
    this.hash = Block.calculateHash(index, previousHash, timestamp, data);
  }

  static calculateHash(
    index: number,
    previousHash: string,
    timestamp: number,
    data: string,
  ): string {
    const hashedValues = `${index}${data}${previousHash}${timestamp}`;
    return createHash('sha256').update(hashedValues).digest('base64');
  }
}

export { Block };
