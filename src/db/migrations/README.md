# GENERATING MIGRATIONS FILES:

This directory only includes the migration files, usually they start with a unix datetime followed by a hyppen to organize them and keep track of each change, so try to having them organized if you're planning to make some by hand to avoid errors.

I advice you to let sequelize-cli tool to generate their own names and then you start working on it.

Here's an example of how to generate a migration file:

```bash
npx sequelize-cli migration:generate --config=src/config/postgres.json --name=person
```

Once you have opened and edited the file you can issue the next command to create the table into your database:

```
npx sequelize-cli db:migrate
```

If you want to see the rest of options just execute the next command:

```
npx sequelize-cli
```

**NOTE**: To have a successful migration you will have to check the privileges on your database in the rdbms.

You can learn more about the hooks [here](http://docs.sequelizejs.com/manual/tutorial/migrations.html).

Also if you see this warning in the terminal when running the npm command "npm run db:migrate" ```File: README.md does not match pattern: /\.js$/``` do not worry, just ignore it because it is not an error.
