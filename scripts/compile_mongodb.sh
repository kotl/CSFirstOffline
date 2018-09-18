#!/bin/bash

source cs_dirs

cd
wget https://fastdl.mongodb.org/src/mongodb-src-r4.0.2.tar.gz
tar -zxf mongodb-src-r4.0.2.tar.gz
cd mongodb-src-r4.0.2
sudo pip install -r buildscripts/requirements.txt
