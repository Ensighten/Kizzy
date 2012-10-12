/* json2.js
 * https://raw.github.com/douglascrockford/JSON-js/master/json2.js
 * we need to make this standard part of Bootstrap.js when IE6/7 user-agent is detected 
 */
if(typeof JSON!=="object"){JSON={}}(function(){function f(a){return a<10?"0"+a:a}function quote(a){escapable.lastIndex=0;return escapable.test(a)?'"'+a.replace(escapable,function(a){var b=meta[a];return typeof b==="string"?b:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+a+'"'}function str(a,b){var c,d,e,f,g=gap,h,i=b[a];if(i&&typeof i==="object"&&typeof i.toJSON==="function"){i=i.toJSON(a)}if(typeof rep==="function"){i=rep.call(b,a,i)}switch(typeof i){case"string":return quote(i);case"number":return isFinite(i)?String(i):"null";case"boolean":case"null":return String(i);case"object":if(!i){return"null"}gap+=indent;h=[];if(Object.prototype.toString.apply(i)==="[object Array]"){f=i.length;for(c=0;c<f;c+=1){h[c]=str(c,i)||"null"}e=h.length===0?"[]":gap?"[\n"+gap+h.join(",\n"+gap)+"\n"+g+"]":"["+h.join(",")+"]";gap=g;return e}if(rep&&typeof rep==="object"){f=rep.length;for(c=0;c<f;c+=1){if(typeof rep[c]==="string"){d=rep[c];e=str(d,i);if(e){h.push(quote(d)+(gap?": ":":")+e)}}}}else{for(d in i){if(Object.prototype.hasOwnProperty.call(i,d)){e=str(d,i);if(e){h.push(quote(d)+(gap?": ":":")+e)}}}}e=h.length===0?"{}":gap?"{\n"+gap+h.join(",\n"+gap)+"\n"+g+"}":"{"+h.join(",")+"}";gap=g;return e}}"use strict";if(typeof Date.prototype.toJSON!=="function"){Date.prototype.toJSON=function(a){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(a){return this.valueOf()}}var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b"," ":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;if(typeof JSON.stringify!=="function"){JSON.stringify=function(a,b,c){var d;gap="";indent="";if(typeof c==="number"){for(d=0;d<c;d+=1){indent+=" "}}else if(typeof c==="string"){indent=c}rep=b;if(b&&typeof b!=="function"&&(typeof b!=="object"||typeof b.length!=="number")){throw new Error("JSON.stringify")}return str("",{"":a})}}if(typeof JSON.parse!=="function"){JSON.parse=function(text,reviver){function walk(a,b){var c,d,e=a[b];if(e&&typeof e==="object"){for(c in e){if(Object.prototype.hasOwnProperty.call(e,c)){d=walk(e,c);if(d!==undefined){e[c]=d}else{delete e[c]}}}}return reviver.call(a,b,e)}var j;text=String(text);cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})}if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){j=eval("("+text+")");return typeof reviver==="function"?walk({"":j},""):j}throw new SyntaxError("JSON.parse")}}})();

/*!
  * Kizzy - a cross-browser LocalStorage API
  * Copyright: Dustin Diaz 2012
  * https://github.com/ded/kizzy
  * License: MIT
  */
var store = (function () { 
  function noop() {}
  var hasLocalStorage
    , doc = document
    , store = doc.domain
    , html5 = 0
    , writeThrough = function () {
        return 1
      }

  try {
    // HTML5 local storage
    hasLocalStorage = !!localStorage || !!globalStorage
    if (!localStorage) {
      localStorage = globalStorage[store]
    }
    html5 = 1
  } catch (ex1) {
    html5 = 0
    // IE local storage
    try {
      // this try / if is required. trust me
      if (doc.documentElement.addBehavior) {
        html5 = 0
        hasLocalStorage = 1
        var dataStore = doc.documentElement
        dataStore.addBehavior('#default#userData')
        dataStore.load(store)
        var xmlDoc = dataStore.xmlDocument
          , xmlDocEl = xmlDoc.documentElement
      }
    } catch (ex2) {
      hasLocalStorage = false
    }
  }

  var setLocalStorage = noop
    , getLocalStorage = noop
    , removeLocalStorage = noop
    , clearLocalStorage = noop

  if (hasLocalStorage) {
    setLocalStorage = html5 ? html5setLocalStorage : setUserData
    getLocalStorage = html5 ? html5getLocalStorage : getUserData
    removeLocalStorage = html5 ? html5removeLocalStorage : removeUserData
    clearLocalStorage = html5 ? html5clearLocalStorage : clearUserData

    writeThrough = function (inst) {
      try {
        var v = JSON.stringify(inst._)
        if( v == '{}' ) {
          removeLocalStorage(inst.ns)
        } else {
          setLocalStorage(inst.ns, v)
        }
        return 1
      } catch (x) {
        return 0
      }
    }
  }


  function time() {
    return +new Date()
  }

  function checkExpiry(inst, k) {
    if (inst._[k] && inst._[k].e && inst._[k].e < time()) {
      inst.remove(k)
    }
  }

  function isNumber(n) {
    return typeof n === 'number' && isFinite(n)
  }

  function html5getLocalStorage(k) {
    return localStorage[k]
  }

  function html5setLocalStorage(k, v) {
    localStorage[k] = v
    return v
  }

  function html5removeLocalStorage(k) {
    delete localStorage[k]
  }

  function html5clearLocalStorage() {
    localStorage.clear()
  }

  function getNodeByName(name) {
    var childNodes = xmlDocEl.childNodes
      , node
      , returnVal = null

    for (var i = 0, len = childNodes.length; i < len; i++) {
      node = childNodes.item(i)
      if (node.getAttribute("key") == name) {
        returnVal = node
        break
      }
    }
    return returnVal
  }

  function getUserData(name) {
    var node = getNodeByName(name)
    var returnVal = null
    if (node) {
      returnVal = node.getAttribute("value")
    }
    return returnVal
  }

  function setUserData(name, value) {
    var node = getNodeByName(name)
    if (!node) {
      node = xmlDoc.createNode(1, "item", "")
      node.setAttribute("key", name)
      node.setAttribute("value", value)
      xmlDocEl.appendChild(node)
    }
    else {
      node.setAttribute("value", value)
    }
    dataStore.save(store)
    return value
  }

  function removeUserData(name) {
    getNodeByName(name) && xmlDocEl.removeChild(node)
    dataStore.save(store)
  }

  function clearUserData() {
    while (xmlDocEl.firstChild) {
      xmlDocEl.removeChild(xmlDocEl.firstChild)
    }
    dataStore.save(store)
  }

  function _Kizzy() {
    this._ = {}
  }

  _Kizzy.prototype = {

    set: function (k, v, optTtl, cb) {
      cb=(typeof optTtl == "function")?optTtl : (cb||noop);
      this._[k] = {
        value: v,
        e: isNumber(optTtl) ? time() + optTtl : 0
      }
      writeThrough(this) || this.remove(k)
      return cb(v);
    },

    get: function (k, cb) {
      cb=cb||noop;
      checkExpiry(this, k)
      return cb(this._[k] ? this._[k].value : undefined)
    },

    remove: function (k, cb) {
      cb=cb||noop;
      delete this._[k];
      writeThrough(this)
      cb();
    },

    clear: function (cb) {
      cb=cb||noop;
      this._ = {}
      writeThrough(this);
      cb();
    },

    clearExpireds: function(cb) {
      cb=cb||noop;
      for (var k in this._) {
        checkExpiry(this, k)
      }
      writeThrough(this);
      cb();
    }
  }

  function Kizzy(ns) {
    this.ns = ns
    this._ = JSON.parse(getLocalStorage(ns) || '{}')
  }

  Kizzy.prototype = _Kizzy.prototype

  function kizzy(ns) {
    return new Kizzy(ns)
  }

  kizzy.remove = removeLocalStorage
  kizzy.clear = clearLocalStorage

  return kizzy('ensighten');
})();