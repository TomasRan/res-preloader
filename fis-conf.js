fis.match('/*.{js,jsx,ts,tsx,es6,es}', {
  optimizer: fis.plugin('uglify-js'),
  release: '/dist/res-preloader.min.js'
});

fis.media('dev')
  .match('*', {
    useHash: false
  });
