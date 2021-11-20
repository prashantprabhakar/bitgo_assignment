// @ts-check
const {REQUEST} = require('../services/http.service');
const { btcBaseAPiUrl } = require('../config/config')
const fs = require("fs")
const l = require('../utils/logger').root.child({ 'module': '[BTC-Svc]' })


// local cache - should use Redis instead; and we should make it a LRU else cache size will 
// incease very soon.
const txsByBlockHash = {};

async function getBlockHash(blockHeight) {
  try {
    return REQUEST({
      method: 'GET',
      uri: `${btcBaseAPiUrl}/block-height/${blockHeight}`,
    });
  } catch(error) {
    l.error(`Error in getting block hash`, error);
    throw error;
  }
}

async function findBlockDetail(blockHash) {
  try {
    let blockDetail = await REQUEST({
      method: 'GET',
      uri: `${btcBaseAPiUrl}/block/${blockHash}`,
    });

    if(blockDetail) return blockDetail
  } catch(error) {
    l.error(`Unable to  fetch bllock detail`, {error});
    throw error;
  }

}

async function findTxOfBlock(blockHash, startIndex) {
  return REQUEST({
    method: 'GET',
    uri: `${btcBaseAPiUrl}/block/${blockHash}/txs/${startIndex}`,
  });
}

async function fetchAllTxOfBlock(blockHash) {

  if(txsByBlockHash[blockHash]) return txsByBlockHash[blockHash];

  let {tx_count} = await findBlockDetail(blockHash);
  
  let offset = 0;
  let promises = []
  while(offset <= tx_count) {
    promises.push(findTxOfBlock(blockHash, offset));
    offset += 25
  }
  let txs = (await Promise.all(promises)).flat();

  // const txs = [];
  // while(txs.length < tx_count) {
  //   // this can be run in parallel to fetch 0-25;  25-50 using Promise.all
  //   let currentTxs = await findTxOfBlock(blockHash, txs.length);
  //   txs.push(...currentTxs);
  // }
  txsByBlockHash[blockHash] = txs;
  fs.writeFileSync("./my1.json", JSON.stringify(txs))
  return txs
}

module.exports = {
  getBlockHash,
  findBlockDetail,
  fetchAllTxOfBlock
}