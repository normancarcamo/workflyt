import uuid from 'uuid/v4';
import json_category from 'db/fixtures/category.json';
import json_company from 'db/fixtures/company.json';
import json_item from 'db/fixtures/item.json';
import json_supplier from 'db/fixtures/supplier.json';
import json_warehouse from 'db/fixtures/warehouse.json';

const is_mocked = JSON.parse(process.env.MOCK);

export default function setupFactory(db, mockService = is_mocked) {
  const {
    Company, Warehouse, Supplier, Category, Item,
    WarehouseItems, SupplierItems, ItemTypes
  } = db.sequelize.models;

  const setup = {};

  setup.scenario = {};

  setup.instance = {};

  setup.insert = async () => {
    if (mockService) {
      setup.instance.companies = json_company;
      setup.instance.warehouses = json_warehouse;
      setup.instance.suppliers = json_supplier;
      setup.instance.categories = json_category;
      setup.instance.items = json_item;
    } else {
      try {
        const transaction = await db.sequelize.transaction();
        const options = { individualHooks: true, transaction };

        setup.instance.companies = await Company.bulkCreate(json_company, options);
        setup.instance.categories = await Category.bulkCreate(json_category, options);
        setup.instance.warehouses = await Warehouse.bulkCreate(json_warehouse, options);
        setup.instance.suppliers = await Supplier.bulkCreate(json_supplier, options);
        setup.instance.items = await Item.bulkCreate(json_item, options);

        await setup.instance.categories[0].addItems(setup.instance.items, options);
        await setup.instance.warehouses[0].addItems(setup.instance.items, options);
        await setup.instance.suppliers[0].addItems(setup.instance.items, options);
        await setup.instance.items[0].addTypes(setup.instance.items, options);

        await transaction.commit();
      } catch (error) {
        await transaction.rollbak();
        console.error('Error when trying to insert:', error.original.detail);
      }
    }
  }

  setup.remove = async () => {
    if (jest.isMockFunction(db.sequelize.transaction)) {
      db.sequelize.transaction.mockRestore();
    }

    [
      'findAll',
      'create',
      'bulkCreate',
      'update',
      'destroy',
      'findByPk',
      'match',
      'findMany',
      'createMany',
      'updateMany',
      'destroyMany'
    ].forEach(method => {
      [
        Company[method],
        WarehouseItems[method],
        SupplierItems[method],
        Supplier[method],
        Warehouse[method],
        Category[method],
        Item[method],
        ItemTypes[method]
      ].forEach(fn => {
        if (jest.isMockFunction(fn)) {
          fn.mockRestore();
        }
      });
    });

    if (!mockService) {
      try {
        const opts = { where: {}, force: true };
        await Company.destroy(opts);
        await WarehouseItems.destroy(opts);
        await SupplierItems.destroy(opts);
        await ItemTypes.destroy(opts);
        await Category.destroy(opts);
        await Item.destroy(opts);
        await Warehouse.destroy(opts);
        await Supplier.destroy(opts);
      } catch (error) {
        console.error('Error when trying to destroy:', error);
      }
    }
  }

  setup.before_all = setup.remove;

  setup.before_each = setup.insert;

  setup.after_each = setup.remove;

  setup.after_all = db.close;

  return setup;
}
