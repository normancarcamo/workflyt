#!/bin/bash

psql -h 127.0.0.1 -U dev -d workflyt_dev -f /var/lib/postgresql/cronjobs/reset_sequences/reset_sequences.sql -v ON_ERROR_STOP=ON
