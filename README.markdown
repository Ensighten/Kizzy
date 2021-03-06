Kizzy - a Local Storage Utility
-------------------------------

Kizzy is a light-weight, cross-browser, JavaScript local storage utility. It leverages the HTML5 localStorage API when available, as well as Internet Explorer's persistent XML store — wrapped up in a easy to use, memcached-like interface. When neither of these features are available (unlikely), it falls back to an in-browser object store.

It looks like this

    var cache = kizzy('users');
    var agent = cache.get('Agent');
    if (agent) {
      alert('Welcome back ' + agent.name);
    } else {
      cache.set('Agent', {
        name: 'Agent Diaz'
      });
    }

Furthermore, a call to 'set' will return the value, making it quite easy for assignment.

    var cache = kizzy('users');
    var agent = cache.get('Agent') || cache.set('Agent', {
      name: 'Agent Diaz'
    });

Lastly, you can pass an optional third argument to 'set' that tells the cache how long to live

    var cache = kizzy('users');

    var agent = cache.get('Agent') || cache.set('Agent', {
      name: 'Agent Diaz'
    }, 5000); // time to live set for 5 seconds


    // wait 3 seconds...
    setTimeout(function() {
      alert('Still there ' + cache.get('Agent').name);
    }, 3000);

    // 6 seconds later...
    setTimeout(function() {
      cache.get('Agent').name // => expired
    }, 6000);

Browser support
---------------

  * Internet Explorer 6,7,8,9
  * Firefox 2+ (when localStorage is enabled (the browser default))
  * Chrome
  * Safari 4+

Building Kizzy
---------------------------------

    $ submodule update --init
    & make

Running tests
------------------
Tests will not currently pass if run on a file:/// protocol. Otherwise...

    $ open tests/test.html

Ender integration
--------
Install Kizzy as an Ender module

    $ ender add kizzy

Use it as such:

    $.cache('user').get('name')

Kizzy whu?
----------
The name comes from Kunta Kinte, a Mandinka African warrior from the 1700's. After being brought into slavery, he had a daughter whom he named Kizzy, which translates to *stay put* in hopes that the family would stay together, but not stay a slave.

Happy Caching!