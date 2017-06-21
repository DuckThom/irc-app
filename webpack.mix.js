let mix = require('laravel-mix');

mix.js('src/js/app.js', 'static/js')
    .sass('src/sass/app.sass', 'static/css')
    .copy('src/index.html', 'static/index.html');