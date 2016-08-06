---
layout: posts
title: How to compile ES7 async code using Webpack
date: 'August 3, 2016'
---

While I was trying to learn about using async/await i ran into the problem of being able to run the code in Nodejs. The code I was trying to compile was simple enough as seen below:
{% highlight ruby %}
(async function() { console.log('foo'); }());
{% endhighlight %}
 To run it without building it you needed to install the following:
{% highlight ruby %}
npm install -g babel-cli
{% endhighlight %}
 You also need to install the following for babel to understand async functions:
{% highlight ruby %}
npm install babel-plugin-syntax-async-functions
npm install babel-plugin-transform-regenerator
{% endhighlight %}
 You also need a file called .babelrc with the following snippet:
{% highlight ruby %}
{ "plugins": ["syntax-async-functions","transform-regenerator"] }
{% endhighlight %}
 To run the code drop the above async function into a js file and type the following to run it:
{% highlight ruby %}
babel-node filename
{% endhighlight %}
 By now you are saying, that you have seen that before and what you really want to know is how to compile it. To compile it, you are going to need the following:
{% highlight ruby %}
 npm install babel-polyfill
{% endhighlight %}
 The last thing you need is to modify the webpack.config.js to use babel-polyfill in the entry section of the file you are trying to build:
{% highlight ruby %}
 entry: ['babel-polyfill', filename.js]
{% endhighlight %}
 To see a full example of the webpack.config.js, you can look at the following git commit: <a href="https://github.com/jayzamazing/Restaurant-POS/commit/9ecf554dc3ca1ad24eb20cd3523c8294b864c5a2">Link</a>

 I learned ES7 async/await from the Thinkful Web Developer Career program and I learned about compiling ES7 code using webpack and babel-polyfill from <a href="https://github.com/babel/babel-loader/issues/161">Link</a>.
