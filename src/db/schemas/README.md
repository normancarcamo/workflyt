# Schemas

In this directory you will find the schema/skeleton of the tables/entities.

Three important things that you will see are:

- The name of the entity as an String
- The attributes as an Object
- the options of the model as an Object

Each schema exports a function that when it's invoked it returns these three values.
The idea of the schema is to share the same skeleton of the attributes, name and options between the migration files and the models.

The differences are:
- A model need the ```DataTypes``` Object and the migration the ```Sequelize``` Class to get the types directly.
- Both migrations and models needs a name and options.

So, if you try to add a new field or edit something to avoid having to do this on each model and then into each migration file it's better to just edit this schema file because.

One important thing to mention is that because the migrations needs to have some associations we need to add them manually when we need references, let's look an example of that to remember this whenever you see this piece of code in the schemas:

```js
 /* ... skipped for brevity ... */

  category_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: {
        schema: "nz",
        tableName: "category"
      },
      key: "id"
    },
    onUpdate: "CASCADE",
    onDelete: "NO ACTION"
  },

/* ... skipped for brevity ... */
```
As you can see there's a ```references``` Object in the field ```category_id```, this is needed for the migrations but not necessary for the models, although, at the end it also works fine, so just keep this thing in mind.

To have an idea of where the idea comes from, read this [link](https://mongoosejs.com/docs/guide.html).
