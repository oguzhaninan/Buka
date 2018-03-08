const watch = require('node-watch');
const { spawn } = require('child_process');
const electron = require('electron-connect').server.create();

const watch_dir = './src';
const npm_command = /^win/.test(process.platform) ? 'npm.cmd' : 'npm';

function greeting() {
  console.log(`Begin watching files in ${watch_dir}`);
}

function startApp() {
  const build = spawn(npm_command, ['run',  'build']);
  build.on('close', function() {
    electron.start();
  });
}

function startWatch() {
  watch(watch_dir, { recursive: true }, function(evt, name) {
    console.log("App updated, recompiling...");
    const build = spawn(npm_command, ['run',  'build']);
    build.on('close', function() {
      electron.reload();
    });
  });
}

// stop if app closed
electron.on('closed', function(){
  process.exit();
});

function start() {
  startApp();
  greeting();
  startWatch();
}

start();
