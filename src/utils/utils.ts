import { Block } from '../domain/block';
import { Blockchain } from '../domain/blockchain';

class Utils {
  static createBlockchainFromScratch() {
    const genesisBlock: Block = new Block(0, '0', 0, 'Genesis Block');
    return new Blockchain([genesisBlock]);
  }
}

export { Utils };
