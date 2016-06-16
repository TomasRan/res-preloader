fis.match('/*.{js,jsx,ts,tsx,es6,es}', {
  optimizer: fis.plugin('uglify-js'),
  release: '/dist/$0'
});

fis.media('dev')
  .match('*', {
    useHash: false
  });
