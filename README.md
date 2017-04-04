[![Build Status](https://travis-ci.org/n3okill/enfsmkdirp-promise.svg)](https://travis-ci.org/n3okill/enfsmkdirp-promise)
[![AppVeyor status](https://ci.appveyor.com/api/projects/status/o9eohxdni6ajpstt?svg=true)](https://ci.appveyor.com/project/n3okill/enfsmkdirp-promise)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/ebe35e00d9eb49899ea8897304e9b405)](https://www.codacy.com/app/n3okill/enfsmkdirp-promise)
[![Donate](https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=64PYTCDH5UNZ6)

[![NPM](https://nodei.co/npm/enfsmkdirp-promise.png)](https://nodei.co/npm/enfsmkdirp-promise/)

enfsmkdirp-promise
==================
Module that add mkdir -p functionality to node fs module with promises

**enfs** stands for [E]asy [N]ode [fs]

This module is intended to work as a sub-module of [enfs](https://www.npmjs.com/package/enfs-promise)


Description
-----------
This module will add a method that allows the creation o directories
and sub-directories with one command line. Add mkdir -p functionality to node fs module

- This module will add following methods to node fs module:
  * mkdirpP
  
Usage
-----
`enfsmkdirp`

```js
    const enfsmkdirp = require("enfsmkdirp-promise");
```

Errors
------
All the methods follows the node culture.
- Async: Every async method returns an Error in the first callback parameter
- Sync: Every sync method throws an Error.


Additional Methods
------------------
- [mkdirpP](#mkdirpp)


### mkdirpP
  - **mkdirpP(path, [options])**

> Asynchronously create multiple directories levels

`path`
The path can be on the form of a string, an array or "brace-string"

[options]:
  * fs (Object): an alternative fs module to use (default will be [enfspatch](https://www.npmjs.com/package/enfspatch))
  * mode (String or Number): the mode that will be attributed to the directory being created


  - Path (String)

```js
    enfsmkdirp.mkdirpP("/home/path/to/folder").then(function(){
        //do something
    });
```

  - Path (Array)

```js
    enfsmkdirp.mkdirpP(["/home/path/to/folder","/var/home/test"]).then(function(){
        //do something
    });
```

  - Path ("brace-string")

```js
    enfsmkdirp.mkdirpP("./project/{development,production}/{public,css,private,test}").then(function(){
        //do something
    });
```


License
-------

Creative Commons Attribution 4.0 International License

Copyright (c) 2017 Joao Parreira <joaofrparreira@gmail.com> [GitHub](https://github.com/n3okill)

This work is licensed under the Creative Commons Attribution 4.0 International License. 
To view a copy of this license, visit [CC-BY-4.0](http://creativecommons.org/licenses/by/4.0/).


