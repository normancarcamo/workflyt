#!/bin/bash

# The idea of this file is keep it as a reminder of how to export data from a
# database in postgresql into a .sql file to further on restore it.

# Here are some explanations of the arguments set in the utilities used:

# BACKUP:

# pg_dump     = utility.
# -h          = host.
# -U          = User.
# -d          = database.
# >           = Pipe results into the file of the right.
# --clean     = clean (drop) database objects before recreating.
# --if-exists = use IF EXISTS when dropping objects.
# --no-owner  = skip restoration of object ownership in plain-text format.

pg_dump --clean --if-exists --no-owner -h 127.0.0.1 -U dev -d workflyt_dev -n 'public' > dump.sql

# RESTORE:

# psql = utility
# -h   = host.
# -U   = User.
# -d   = database.
# <    = Pipe the file of the right.

psql -h 127.0.0.1 -U dev -d workflyt_dev < dump.sql
