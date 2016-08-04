---
layout: posts
title: "How to run Mocha with ES7 async"
date: August 3, 2016
---
When I was learning about async / await, I decided to run my Mocha/Chai test cases before building them out with Webpack but they ended up with errors. Doing some searching I found out you need to install the following:
{% highlight ruby %}
npm install babel-polyfill
{% endhighlight %}
At the top of your mocha js file add the following line:
{% highlight ruby %}
import 'babel-polyfill'
{% endhighlight %}
After installing that, you need to run mocha using the following command:
{% highlight ruby %}
mocha test.js --compilers js:babel-core/register
{% endhighlight %}
Of course, if you need to do some troubleshooting you could run node-inspector at the same time with mocha using the following commands:
{% highlight ruby %}
node-inspector
mocha test.js --compilers js:babel-core/register --debug-brk
{% endhighlight %}
I learned this from the following link : <a href="http://jamesknelson.com/testing-in-es6-with-mocha-and-babel-6/">http://jamesknelson.com/testing-in-es6-with-mocha-and-babel-6/</a>
