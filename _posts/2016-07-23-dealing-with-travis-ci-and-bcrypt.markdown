---
layout: posts
title: How to deal with Bcrypt and Travis-Ci build errors
date: 'August 3, 2016'
---
When I was pushing one of my projects to Travis Ci I kept getting the following build errors:
{% highlight ruby %}
npm install
npm WARN deprecated to-iso-string@0.0.2: to-iso-string has been deprecated, use @segment/to-iso-string instead.
npm WARN deprecated jade@0.26.3: Jade has been renamed to pug, please install the latest version of pug instead of jade
npm WARN deprecated minimatch@0.3.0: Please update to minimatch 3.0.2 or higher to avoid a RegExp DoS issue
bcrypt@0.8.7 install /home/travis/build/jayzamazing/Restaurant-POS/node_modules/bcrypt
node-gyp rebuild
{% endhighlight %}
At the time my .travis.yml looked like the following:
{% highlight ruby %}
node_js: node
services:
- mongodb
addons:
   apt:
      sources:
      - mongodb-3.2-precise
     packages:
     - mongodb-org-server
{% endhighlight %}
I ended up finding this issue with Travis Ci that fixed the problem: <a href="https://github.com/travis-ci/travis-ci/issues/4771">Link</a>. So I ended up updating my .travis.yml file to look like the following to solve the issue:
{% highlight ruby %}
language: node_js
node_js: node
services:
- mongodb
env:
  - CXX=g++-4.8
addons:
  apt:
    sources:
    - mongodb-3.2-precise
    - ubuntu-toolchain-r-test
    packages:
    - mongodb-org-server
    - g++-4.8
{% endhighlight %}
You can see this in my repository at the following <a href="https://github.com/jayzamazing/Restaurant-POS/blob/227db0c3ee96cd7290e7448f3499fdb2a9942296/.travis.yml">link</a>.
