// let fs = require('fs');
let { spawn } = require('child_process');
let chokidar = require('chokidar');

let watcher = chokidar.watch('./src/**/*.js');

watcher.on('change', function() {
  let rollup = spawn('rollup', ['-c']);

  rollup.stdout.on('data', (data) => {
    process.stdout.write(data);
  });

  rollup.stderr.on('data', (data) => {
    process.stderr.write(data);
  });

  rollup.on('close', function() {
    console.log('Bundled!!\n', '-'.repeat(90));
  });

});