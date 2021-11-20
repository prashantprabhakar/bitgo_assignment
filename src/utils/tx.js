// @dev should use redis for caching, shoudl also include blocknum for cache key 
const ancestorCountMap = {}

/**
 * Formats tx array to map for O(1) search
 * @param {Array} txs Array of transactions
 * @returns Hashmap (object) with transaction hash as key and arrray of input txid as value
 */
const formatTx = (txs) => {
  let txMap = {};
  txs.forEach(tx => {
    let inputs = tx.vin.map(v => v.txid)
    txMap[tx.txid] = inputs
  })
  return txMap
}

/***
 * Find ancestors of a tx in a givev txMap
 */
const findAncestor = (txMaps, tx) => {
  if(ancestorCountMap.hasOwnProperty[tx]) return ancestorCountMap[tx];
  let txs = txMaps[tx];
  let count = 0;
  for(let i=0; i<txs.length; i++) {
    if(txMaps.hasOwnProperty(txs[i])) {
      count += 1 + findAncestor(txMaps, txs[i])
    }
  }
  ancestorCountMap[tx] = count;
  return count
}

module.exports = {
  formatTx,
  findAncestor,
}