#!/bin/bash

SYNCED=0;
echo "Waiting for peers..."; 
echo `geth attach /tmp/embark-*/geth.ipc --exec "admin.nodeInfo.enode"
while [ $SYNCED -eq 0 ] ; 
do 
    tail -n 3 blockchain.log; 
    sleep 10; 
    SYNCED=`geth attach /tmp/embark-*/geth.ipc --exec "net.peerCount != 0 && eth.blockNumber != 0 ? 1 : 0"`; 
done
echo "Light sync started..."; 
sleep 60
SYNCED=0;
while [ $SYNCED -eq 0 ] ; 
do 
    tail -n 3 blockchain.log; 
    sleep 10; 
    SYNCED=`geth attach /tmp/embark-*/geth.ipc --exec "net.peerCount != 0 && eth.syncing === false ? 1 : 0"`; 
done