#!/bin/bash

ssh dev@127.0.0.1 -p 2222 -t << EOF
  sudo mkdir /data/tablespaces/workflyt_ts -p
  sudo chown -R postgres:postgres /data/tablespaces/workflyt_ts
EOF
