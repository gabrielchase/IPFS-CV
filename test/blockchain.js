const Blockchain = require('../blockchain')

function mine(blockchain) {
    console.log('Mining...')

    const latestBlock = blockchain.getLatestBlock()
    const prevBlockHash = latestBlock.hash
    const currentBlockData = {
        transactions: blockchain.pendingTransactions,
        index: latestBlock.index + 1
    }   
    const nonce = blockchain.proofOfWork(prevBlockHash, currentBlockData)
    const blockHash = blockchain.hashBlock(prevBlockHash, currentBlockData, nonce)

    blockchain.makeNewTransaction(1, '0000', 'miningNode')

    const newBlock = blockchain.createNewBlock(nonce, prevBlockHash, blockHash)
    
    console.log('newBlock: ', newBlock)
}

const cvChain = new Blockchain()

console.log('new cvChain: ', cvChain)

cvChain.makeNewTransaction('asldkjfal', '1')
cvChain.makeNewTransaction('ksdjlfkja', '1')

mine(cvChain)

cvChain.makeNewTransaction('asdlfkjad', '2')
cvChain.makeNewTransaction('asdkfjkjj', '1')
cvChain.makeNewTransaction('klajsdflw', '2')

mine(cvChain)

console.log('Current cvChain data: ', cvChain.chain)

