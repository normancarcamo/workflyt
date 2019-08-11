const onModule = fn => criteria => {
  let actions = Object.keys(criteria).reduce((acc, key) => {
    if (criteria[key]) {
      acc[key] = fn;
    } else {
      acc[key] = () => ({});
    }
    return acc;
  }, {});

  jest.doMock('src/core/categories/categories-repository', () => database => actions);
}

module.exports = {
  asError: onModule(() => { throw new Error('error mocked.') }),
  asNotFound: onModule(() => null),
  categoriesAreFiltered: ({ cycle, setup }) => {
    jest.doMock('src/core/categories/categories-repository', () => db => ({
      findAll: async options => {
        let _id = cycle._id;

        if (_id === 1) {
          return setup.instance.categories;
        }

        if (_id === 2) {
          return setup.instance.categories.filter(
            category => category.name === 'Art'
          );
        }

        if (_id === 3) {
          return setup.instance.categories.filter(
            category => category.name.includes('sign')
          );
        }

        if (_id === 4) {
          let category = setup.instance.categories.find(
            category => category.name.includes('Art')
          );
          let items = await category.getItems();
          return [{ ...category.dataValues, items }];
        }

        if (_id === 5) {
          let category = setup.instance.categories.find(
            category => category.name.includes('Design')
          );
          let items = await category.getItems();
          return [{ ...category.dataValues, items }];
        }

        if (_id === 6) {
          let cat = setup.data.category.find(
            category => category.name.includes('Art')
          );
          let par = setup.data.category.find(
            category => category.id === cat.parent_id
          );
          return [{ ...cat, parent: par || null }];
        }

        if (_id === 7) {
          let cat = setup.data.category.find(
            category => category.name === 'Design'
          );
          let par = setup.data.category.find(
            category => category.id === cat.parent_id
          );
          return [{ ...cat, parent: par }];
        }

        if (_id === 8 || _id === 9) {
          let category = setup.data.category.find(
            category => category.name.includes('Design')
          );
          return [{
            id: category.id,
            code: category.code,
            name: category.name
          }];
        }

        if (_id === 10) {
          return setup.instance.categories.slice(0);
        }

        if (_id === 11 || _id === 12) {
          return setup.instance.categories.slice(1);
        }

        return [];
      }
    }));
  },
  createRepeatedError: ({ cycle, setup }) => {
    jest.doMock('src/core/categories/categories-repository', () => db => ({
      create: () => {
        if (cycle._id === 1) {
          return setup.models.Category.build({ name: 'demo' });
        } else {
          throw new Error('error mocked.');
        }
      }
    }));
  },
  categoryIsCreated: ({ setup }) => {
    jest.doMock('src/core/categories/categories-repository', () => db => ({
      create: data => setup.models.Category.build(data)
    }));
  },
  categoryIsFound: ({ setup }) => {
    jest.doMock('src/core/categories/categories-repository', () => db => ({
      findByPk: () => setup.instance.categories[0].dataValues
    }));
  },
  categoryIsUpdated: ({ setup }) => {
    jest.doMock('src/core/categories/categories-repository', () => db => ({
      findByPk: () => ({}),
      update: values => setup.models.Category.build({
        ...setup.instance.categories[0].dataValues,
        ...values.data
      })
    }));
  },
  categoryIsDeleted: ({ setup, cycle }) => {
    jest.doMock('src/core/categories/categories-repository', () => db => ({
      findByPk: () => cycle._id === 1 ? {} : null,
      destroy: options => {
        let category = setup.instance.categories[0];
        let now = new Date().toISOString();
        category.updated_at = now;
        category.deleted_at = now;
        return category;
      }
    }));
  },
  itemsAreFiltered: ({ cycle, setup }) => {
    jest.doMock('src/core/categories/categories-repository', () => db => ({
      findByPk: () => ({}),
      getItems: opts => {
        let { _id } = cycle;

        if (_id === 1) {
          return setup.instance.items.filter(
            (item, index) => index < 2
          );
        }
        if (_id === 2) {
          return setup.instance.items.filter(
            (item, index) => index === 0
          );
        }
        return setup.instance.items.slice(0);
      },
    }));
  },
  itemsAreAdded: opts => {
    jest.doMock('src/core/categories/categories-repository', () => db => ({
      findByPk: () => ({}),
      addItems: () => ({}),
    }));
  },
  itemIsFound: ({ setup }) => {
    jest.doMock('src/core/categories/categories-repository', () => db => ({
      findByPk: () => ({}),
      getItem: () => setup.instance.items.find(
        item => item.category_id === setup.instance.categories[1].id
      )
    }));
  },
  itemIsRemoved: opts => {
    jest.doMock('src/core/categories/categories-repository', () => db => ({
      findByPk: () => ({}),
      getItem: () => ({}),
      removeItem: opts => 'ok'
    }));
  }
};
