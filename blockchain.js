const sha256 = require('sha256')

class Block {
    constructor(index, timestamp, nonce, prevBlockHash, hash, transactions) {
        this.index = index
        this.timestamp = timestamp
        this.nonce = nonce
        this.prevBlockHash = prevBlockHash
        this.hash = hash
        this.transactions = transactions
    }
}

class Blockchain {
    constructor() {
        this.chain = []
        this.pendingTransactions = []

        this.createNewBlock(100, '0', 'Genesis Block')
    }

    createNewBlock(nonce, prevBlockHash, hash) {
        const newBlock = new Block(
            this.chain.length + 1, 
            Date.now(),
            nonce, 
            prevBlockHash,
            hash,
            this.pendingTransactions
        )

        this.pendingTransactions = []
        this.chain.push(newBlock)
        
        return newBlock
    }

    getLatestBlock() {
        return this.chain[this.chain.length-1]
    }

    makeNewTransaction(ipfs_hash, user_id) {
        const transaction = {
            user_id,
            ipfs_hash
        }

        this.pendingTransactions.push(transaction)

        console.log(`Transacting ipfs hash ${ipfs_hash} for user ${user_id}`)

        return this.getLatestBlock().index + 1
    }

    hashBlock(prevBlockHash, currentBlock, nonce) {
        const data = prevBlockHash + JSON.stringify(currentBlock) + nonce 
        const hash = sha256(data)
        return hash
    }

    proofOfWork(prevBlockHash, currentBlockData) {
        let nonce = 0
        let hash = this.hashBlock(prevBlockHash, currentBlockData, nonce)

        while (hash.substring(0, 2) !== '00') {
            nonce++
            hash = this.hashBlock(prevBlockHash, currentBlockData, nonce)
        }

        return nonce
    }
}

module.exports = Blockchain
