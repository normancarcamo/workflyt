# Hooks

In this directory you will find all the hooks used by each model that requires at least one, you could take them back to the models instead if you want, but to me I found it more organized having them separedly.

You can learn more about them [here](http://docs.sequelizejs.com/manual/tutorial/hooks.html).

Some gotchas:

## Code:

Almost each entity used in the project with sequelize have a column name "code", it's intended to generate a code
using a prefix of their own entity, for example the entity name "product" could use "PRD" + some numbers: PRD0001, PRD0002
to have references of each record.
This is useful for example on inventories of product or kardex of products, likewise in work orders,
installation orders, in documents like invoice, quotes etc.

In our application server one way to generate them is by these hooks, these mimics almost the same idea of triggers in a RDBMS.

Check this example:

```js
Product.beforeCreate(async product => {
  if (product.code === 'unset') {
    let { nextval } = await sequelize.query(
      `select nextval('nz.product_seq')`, {
      plain: true
    });
    product.code = `PRD${nextval}`;
  }
});
```

**Explanation**:
This will be executed before the the entity is created, and as we mentioned this hook acts like a trigger.

Another important part here are the ["sequences"](https://www.postgresql.org/docs/10/sql-createsequence.html), in this case we're using postgres.

But here's another way to acompplish almost the same thing using other strategy, the only thing to mention here is that this way requires the usage of the triggers, you could create a trigger in the same way as we did with the hook, we can programatically save one to be executed before each insertion and it can also generate our customized codes for our entities, that's nice, let's look an example:

```sql
DROP FUNCTION IF EXISTS nz.product_fntrg CASCADE;

CREATE FUNCTION nz.product_fntrg()
RETURNS TRIGGER AS
$TRG$
  BEGIN
    NEW.code = 'PRD' || NEXTVAL('nz.product_seq');
    RETURN NEW;
  END;
$TRG$
LANGUAGE 'plpgsql';

DROP TRIGGER IF EXISTS nz.product_trg ON nz.product CASCADE;

CREATE TRIGGER nz.product_trg
  BEFORE INSERT
  ON nz.product
  FOR EACH ROW
  EXECUTE PROCEDURE nz.product_fntrg();
```

The code looks a bit messy because it's in plpgsql syntax, but the advantage of this is that now, sequelize
can insert the record and let the RDBMS to execute their triggers associated, isn't it great?

Here we are not forcing to sequelize to use their hooks to generate the codes.

One thing here is that the triggers needs to be registered into the RDBMS previously to avoid problems with the code before the ORM works.

This is a design decision, if you prefer to handle part of the database from your ORM it's up to you or if you prefer to handle everything with your ORM it's up to you too.
In this case we've chosen handle many code from the ORM side and if in the future this present a penalty in performance then we will have to take a new decision to improve it.

### Here is a list of the codes that are being used:

| Code       | Table      | Sequence          |
| ---------- | ---------- | ----------------- |
| CMP0000000 | company    | nz.company_seq    |
| DEP0000000 | department | nz.department_seq |
| WRK0000000 | worker     | nz.worker  _seq   |
| USR0000000 | user       | nz.user_seq       |
| ROL0000000 | role       | nz.role_seq       |
| PRM0000000 | permission | nz.permission_seq |
| WRH0000000 | warehouse  | nz.warehouse_seq  |
| CAT0000000 | category   | nz.category_seq   |
| PRD0000000 | product    | nz.product_seq    |
| SPL0000000 | supplier   | nz.supplier_seq   |
| CUS0000000 | customer   | nz.customer_seq   |
| ORD0000000 | order      | nz.order_seq      |
| QTE0000000 | quote      | nz.quote_seq      |

*The rest of entities that weren't listed are n:m and almost all of them doesn't have too much fields that could require one.*

**NOTE:**
In the path:
  ```/src/db/scripts/sql/sequences ```
you can see all the sequences used by POSTGRES.
