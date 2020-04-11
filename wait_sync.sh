#!/bin/bash

SYNCED=0;
echo "Waiting for light sync"; 
while [ $SYNCED -eq 0 ] ; 
do 
    tail -n 3 blockchain.log; 
    sleep 10; 
    SYNCED=`geth attach /tmp/embark-*/geth.ipc --exec "eth.blockNumber != 0 && eth.syncing === false ? 1 : 0"`; 
done