# Seeders

In this directory you will find the files used to test data.

To generate a new file you have to use "seed:generate" option from sequelize-cli tool.

Also, you will have to pass to it a name using the flag: "--name" and the "--config" to know the connection config.

Example using npx and "person" as name:

```bash
./node_modules/.bin/sequelize seed:generate --name=person --config=src/config/postgres.json
```

If you want to see more details about the config file go to src/config folder and check the corresponding file, in this case is "postgres.json" bacause we had a connection to that RDBMS.

## Inserting records:

If you want to insert data into the database you will have to first have a fixture file in json format.

This command will try to insert data or alter the data of the table in our database:

```bash
./node_modules/.bin/sequelize db:seed:all
```

You can read more about the seeders in this [link](http://docs.sequelizejs.com/manual/tutorial/migrations.html#creating-first-seed).
