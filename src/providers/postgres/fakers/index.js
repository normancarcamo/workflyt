const fs = require('fs-extra');
const path = require('path');

const omitIndex = name => name !== 'index.js';

fs.readdirSync(__dirname).filter(omitIndex).forEach(async element => {
  let data = require(`${__dirname}/${element}`);
  let name = element.slice(0, -3);
  try {
    await fs.outputJson(
      path.join(__dirname, '../fixtures/', process.argv[2], `/${name}.json`),
      data,
      { spaces: 2 }
    );
  } catch (error) {
    console.log('Error:', error);
  }
});
