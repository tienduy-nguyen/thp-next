#!/usr/bin/env node
const inquirer = require('inquirer');
const path = require('path');
const { writeFile, readdir, readFile } = require('fs').promises;

const configFiles = {};
const configFolderPath = path.resolve(__dirname, 'config');

async function main() {
  const files = await readdir(configFolderPath).catch(console.log);
  for (let file of files) {
    const frameworkName = file.split('.')[1];
    configFiles[frameworkName] = path.join(configFolderPath, file);
  }

  const { framework } = await inquirer.prompt([
    {
      type: 'list',
      message: "Pick the framework you're using:",
      name: 'framework',
      choices: Object.keys(configFiles),
    },
  ]);

  let config = await readFile(configFiles[framework]).catch(console.log);

  const tsconfig = path.join(process.cwd(), 'tsconfig.json');

  if (framework === 'node') {
    const reg = new RegExp(/(?<=v)(\d+)/);
    const version = parseInt(reg.exec(process.version)[0]);

    if (version >= 14) {
      // Optimal config for Node v14.0.0 (full ES2020)
      const updateConfig = {
        allowSyntheticDefaultImports: true,
        lib: ['es2020'],
        module: 'es2020',
        moduleResolution: 'node',
        target: 'es2020',
      };
      const configObj = Object.keys(updateConfig).reduce((prev, curr) => {
        return {
          ...prev,
          compilerOptions: {
            ...prev.compilerOptions,
            [curr]: updateConfig[curr],
          },
        };
      }, JSON.parse(config.toString()));

      config = JSON.stringify(configObj, null, 2);
    }
  }

  await writeFile(tsconfig, config.toString());
  console.log('tsconfig.json successfully created');
}

main().catch((err) => {
  console.error(err);
});
