const install_args = [ 'install' ];
const build_args = [ 'run', 'build' ];
const opts = { stdio: 'inherit', cwd: 'client', shell: true };
const installer = require('child_process').spawn('npm', install_args, opts);
installer.on('exit', (code, signal) => {
  if (code === 0) {
    require('child_process').spawn('npm', build_args, opts);
  }
});
