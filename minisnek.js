var compressor = require('node-minify');

compressor.minify({
    compressor: 'uglifyjs',
    input: './src/*.js',
    output: './docs/js/boading.js',
    callback: function (err, min) {}
});