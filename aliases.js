const moduleAlias = require('module-alias');

moduleAlias.addAliases({
  '@root' : __dirname,
  '@src'  : __dirname + '/src',
  '@core'  : __dirname + '/src/core',
  '@utils'  : __dirname + '/src/utils',
  '@test'  : __dirname + '/test',
  '@providers'  : __dirname + '/src/providers',
})

// moduleAlias(__dirname + '/package.json');

console.log('aliases...');
