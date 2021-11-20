// @ts-check
const router = require("express").Router()
const fs = require("fs")

const l = require('../utils/logger').root.child({ 'module': 'btc' })
const { handleResponse,handleError } = require('../services/responseHandler')
const { getBlockHash,fetchAllTxOfBlock } = require('../services/btc.service')
const { formatTx, findAncestor } = require('../utils/tx')



router.get('/ancestors/:blockNumber', async(req, res) => {
  try {
    let  blockNumber  = parseInt(req.params.blockNumber);
    console.log({blockNumber})
    if(isNaN(blockNumber)) throw("Invalid block number")
    let data = await getAncestorCount(blockNumber)
    return handleResponse(res, 200, 'Fetched successfully', data);
  } catch(error) {
    l.error(`Error in getting ancestor`, { error})
    return handleError(res, error)
  }
})


function findLargetAncestors(ancCount, limt=10) {
  return Object.entries(ancCount).sort((a,b) => a[1] - b[1]).slice(0, limt)
}

async function getAncestorCount(blockHeight) {
  if(typeof blockHeight != 'number') {
    throw ("Invalid block height")
  }
  const blockHash = await getBlockHash(blockHeight);
  let allTxs = fs.readFileSync('./my.json', 'utf-8')
  allTxs = JSON.parse(allTxs)

  //let allTxs = await fetchAllTxOfBlock(blockHash);
  let txMaps = formatTx(allTxs);
  let ancestorCountOfTx =  {};
  Object.keys(txMaps).forEach(tx => {
    let parentCount = findAncestor(txMaps, tx);
    ancestorCountOfTx[tx] = parentCount;
  })

  return findLargetAncestors(ancestorCountOfTx, 10);

}



function test() {
  
  
  let txMap = {};
  let allTxIds = [];
  for(let i=0; i<arr.length; i++) {
    let txid = arr[i].txid;
    allTxIds.push(txid);
    let input = arr[i].vin.map(v => v.txin)
    allTxIds.push(...input);
    txMap[txid] = input;
  }
  
  let freqCount = {};
  console.log(allTxIds.length)
  for(let i=0; i<allTxIds.length; i++) {
    let curr =  allTxIds[i]
    if(freqCount[curr]) freqCount[curr] = freqCount[curr]+1
    freqCount[curr] = 1;
    if(freqCount[curr] > 1) {
      console.log(curr)
      break;
    }
  }
  console.log("not found")
  
}

module.exports = router;

//test()
//main("000000000000000000076c036ff5119e5a5a74df77abf64203473364509f7732").then(console.log)