---
layout: posts
title: How to compile server side code with Webpack
date: 'August 3, 2016'
---
While I was working on one of my Nodejs projects, I wondered what if you ever needed to compile your server side code. I asked around, and most people told me that it was pointless to compile server side code. I almost walked away from the thought when someone told me that using webpack to compile might be necessary for ES7 features or if you are using something like Typescript. So I decided to experiment with it. I started to add another entry in my webpack.config.js and quickly found out it was not going to work the way I thought it was because of the node_modules dependencies. After a while I found a good source of information on how to get this done and ended up with the following stripped down version of webpack.config.js file:
{% highlight ruby %}
var path = require('path');'
var webpack = require('webpack');
var packageData = require('./package.json');
var minify = process.argv.indexOf('--minify') != -1;
var filename = [packageData.name, packageData.version, 'js'];
var fs = require('fs');

var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });
  module.exports = {
    {
    entry: app.js,
    target: 'node',
    output: {
        path: path_to_app.js,
        filename: name_of_file_after_compile,
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          loader: 'babel'
        }
      ]
    },
    devtool: 'source-map',
    externals: nodeModules,
    plugins: plugins
  }
  }
{% endhighlight %}
  The important parts to take away from this are the 'target: node' which says not to touch any node modules and the 'fs.readdirsync' and 'externals: nodeModules' sections which tell webpack to keep the requires.

  I ended up finding this information on the following site which offers a better description of what I summed up: <a href="http://jlongster.com/Backend-Apps-with-Webpack--Part-I">Link</a>
