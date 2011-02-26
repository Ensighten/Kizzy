!function(win, doc, localStorage, store) {

  var hasLocalStorage,
      html5 = 0,
      writeThrough = function() {
        return 1;
      };

  try {
    // HTML5 local storage
    hasLocalStorage = !!localStorage;
    html5 = 1;
  } catch (ex1) {
    // IE local storage
    try {
      // this try / if is required. trust me
      if (doc.documentElement.addBehavior) {
        html5 = 0;
        hasLocalStorage = 1;
        var dataStore = doc.documentElement;
        dataStore.addBehavior('#default#userData');
        dataStore.load(store);
        var xmlDoc = dataStore.xmlDocument;
        var xmlDocEl = xmlDoc.documentElement;
      }
    } catch (ex2) {
      hasLocalStorage = false;
    }
  }

  if (hasLocalStorage) {
    var setLocalStorage = html5 ? html5setLocalStorage : setUserData,
        getLocalStorage = html5 ? html5getLocalStorage : getUserData;
    writeThrough = function(inst) {
      try {
        setLocalStorage(inst.ns, JSON.stringify(inst._));
        return 1;
      } catch (x) {
        return 0;
      }
    }
  }

  function time () {
    return +new Date();
  }

  function checkExpiry(inst, k) {
    if (inst._[k] && inst._[k].e && inst._[k].e < time()) {
      inst.remove(k);
    }
  }

  function isNumber(n) {
    return typeof n === 'number' && isFinite(n);
  }

  function html5getLocalStorage(k) {
    return localStorage.getItem(k);
  }

  function html5setLocalStorage(k, v) {
    return localStorage.setItem(k, v);
  }

  function html5removeLocalStorage(k) {
    return localStorage.removeItem(k);
  }

  function html5clearLocalStorage(k) {
    return localStorage.clear();
  }

  function getNodeByName(name) {
    var childNodes = xmlDocEl.childNodes,
        node,
        returnVal = null;

    for (var i = 0, len = childNodes.length; i < len; i++) {
      node = childNodes.item(i);
      if (node.getAttribute("key") == name) {
        returnVal = node;
        break;
      }
    }
    return returnVal;
  }

  function getUserData(name) {
    var node = getNodeByName(name);
    var returnVal = null;
    if (node) {
      returnVal = node.getAttribute("value");
    }
    return returnVal;
  }

  function setUserData(name, value) {
    var node = getNodeByName(name);
    if (!node) {
      node = xmlDoc.createNode(1, "item", "");
      node.setAttribute("key", name);
      node.setAttribute("value", value);
      xmlDocEl.appendChild(node);
    }
    else {
      node.setAttribute("value", value);
    }
    dataStore.save(store);
    return value;
  }

  function deleteUserData(name) {
    getNodeByName(name) && xmlDocEl.removeChild(node);
    dataStore.save(store);
  }

  function clearUserData() {
    while (xmlDocEl.firstChild) {
      xmlDocEl.removeChild(xmlDocEl.firstChild);
    }
    dataStore.save(store);
  }

  function _Kizzy() {
    this._ = {};
  }

  _Kizzy.prototype = {

    set: function(k, v, optTtl) {
      this._[k] = {
        value: v,
        e: isNumber(optTtl) ? time() + optTtl : 0
      };
      writeThrough(this) || this.remove(k);
      return v;
    },

    get: function(k) {
      checkExpiry(this, k);
      return this._[k] ? this._[k].value : undefined;
    },

    remove: function(k) {
      delete this._[k];
      writeThrough(this);
    },

    clear: function() {
      this._ = {};
      writeThrough(this);
    }
  };

  function Kizzy(ns) {
    this.ns = ns;
    this._ = JSON.parse(getLocalStorage(ns) || '{}');
  }

  Kizzy.prototype = _Kizzy.prototype;

  // expose
  win.Kizzy = function(ns) {
    return new Kizzy(ns);
  };

}(window, document, localStorage, document.domain);