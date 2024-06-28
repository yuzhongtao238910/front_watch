(function (factory) {
	typeof define === 'function' && define.amd ? define(factory) :
	factory();
})((function () { 'use strict';

	// 专门用来写页面监控的 性能监控的

	var processData$1 = function processData(p) {
	  var data = {
	    // 如果当前窗口中没有前一个文档，那么navigationStart的值就是fetchStart。
	    // 上个页面的加载时间
	    // 如果页面是通过点击链接、表单提交或JavaScript重定向到达的
	    // 并且那个页面已经完成了加载，那么 redirectStart 将包含那个页面完成加载的时间戳。
	    prevPage: p.fetchStart - p.navigationStart,
	    // 上一个页面到这个页面的时长
	    redirect: p.redirectEnd - p.redirectStart,
	    // 重定向的时长
	    dnsTime: p.domainLookupEnd - p.domainLookupStart,
	    // dns的解析的时长
	    connect: p.connectEnd - p.connectStart,
	    // tcp链接的时长

	    // 本质上，上面的我们都没有办法控制
	    send: p.responseEnd - p.requestStart,
	    // 从请求到响应的时长
	    ttfb: p.responseStart - p.navigationStart,
	    // 首字节接收的时长
	    domready: p.domInteractive - p.domLoading,
	    // dom 准备的时长
	    whiteScreen: p.domLoading - p.navigationStart,
	    // 白屏的时间
	    domTime: p.domComplete - p.domLoading,
	    // dom 的解析时间
	    loadTime: p.loadEventEnd - p.loadEventStart,
	    // onLoad的执行时间
	    total: p.loadEventEnd - p.navigationStart // 总时长
	    // TTFB，全称Time To First Byte，意思是从发出页面请求到接收到应答数据第一个字节所花费的毫秒数。
	    // 这个指标用于衡量Web服务器或其他网络资源的响应能力。
	  };
	  // console.log(obj)
	  var p = performance.getEntries(); // 另一种方式
	  // for (var i = 0; i < p.length; i++) {
	  // console.log(p[i]);
	  // }
	  return data;
	};
	var load = function load(cb) {
	  var timer = null;
	  var check = function check() {
	    if (performance.timing.loadEventEnd) {
	      // 没有到end的时候，是0
	      clearTimeout(timer);
	      cb();
	    } else {
	      timer = setTimeout(check, 100);
	    }
	  };
	  window.addEventListener("load", check, false);
	};
	var domReady = function domReady(cb) {
	  var timer = null;
	  var check = function check() {
	    if (performance.timing.domInteractive) {
	      // 没有到end的时候，是0
	      clearTimeout(timer);
	      cb();
	    } else {
	      timer = setTimeout(check, 100);
	    }
	  };
	  window.addEventListener("DOMContentLoaded", check, false);
	};
	var perf = {
	  init: function init(cb) {
	    domReady(function () {
	      // 有可能没有处罚onload,dom解析完成后先统计一下，可能用户没有加载完成就把页面关了
	      var perfData = performance.timing;
	      var data = processData$1(perfData);
	      data.type = "domready";
	      cb(data);
	    });
	    load(function () {
	      var perfData = performance.timing;
	      var data = processData$1(perfData);
	      data.type = "loaded";
	      cb(data);
	    });
	  }
	};

	var processData = function processData(d) {
	  var data = {
	    name: d.name,
	    duration: d.duration,
	    initiatorType: d.initiatorType
	  };
	  return data;
	};
	var resource = {
	  init: function init(cb) {
	    if (window.PerformanceObserver) {
	      // ie 完全不兼容
	      var observer = new PerformanceObserver(function (list) {
	        var data = list.getEntries(); // data一个数组
	        for (var i = 0; i < data.length; i++) {
	          cb(processData(data[0]));
	        }
	      });
	      observer.observe({
	        entryTypes: ['resource']
	      });
	    } else {
	      // 获取资源相关的信息
	      window.onload = function () {
	        var resourceData = performance.getEntriesByType("resource");
	        var data = resourceData.map(processData);
	        cb(data);
	      };
	    }
	  }
	};

	var xhr = {
	  init: function init(cb) {
	    // 发送请求一般就是 fetch xhr
	    var xhr = window.XMLHttpRequest;
	    var oldOpen = xhr.prototype.open;
	    xhr.prototype.open = function (method, url, async, username, passsword) {
	      this.info = {
	        method: method,
	        url: url,
	        async: async,
	        username: username,
	        passsword: passsword
	      };
	      return oldOpen.apply(this, arguments);
	    };
	    var oldSend = xhr.prototype.send;
	    xhr.prototype.send = function (value) {
	      var _this = this;
	      var start = Date.now();
	      var fn = function fn(type) {
	        return function () {
	          _this.info.time = Date.now() - start;
	          _this.info.requestSize = (value === null || value === void 0 ? void 0 : value.length) || 0;
	          _this.info.responseSize = _this.responseText.length;
	          _this.info.type = type;
	          cb(_this.info);
	        };
	      };
	      this.addEventListener('load', fn('load'), false);
	      this.addEventListener('error', fn('error'), false);
	      this.addEventListener('abort', fn('abort'), false);
	      return oldSend.apply(this, arguments);
	    };
	  } // window.fetch fetch也需要重写 ，走一遍过程
	};

	function _arrayLikeToArray(r, a) {
	  (null == a || a > r.length) && (a = r.length);
	  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
	  return n;
	}
	function _arrayWithHoles(r) {
	  if (Array.isArray(r)) return r;
	}
	function _iterableToArrayLimit(r, l) {
	  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
	  if (null != t) {
	    var e,
	      n,
	      i,
	      u,
	      a = [],
	      f = !0,
	      o = !1;
	    try {
	      if (i = (t = t.call(r)).next, 0 === l) {
	        if (Object(t) !== t) return;
	        f = !1;
	      } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
	    } catch (r) {
	      o = !0, n = r;
	    } finally {
	      try {
	        if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
	      } finally {
	        if (o) throw n;
	      }
	    }
	    return a;
	  }
	}
	function _nonIterableRest() {
	  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
	}
	function _slicedToArray(r, e) {
	  return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
	}
	function _unsupportedIterableToArray(r, a) {
	  if (r) {
	    if ("string" == typeof r) return _arrayLikeToArray(r, a);
	    var t = {}.toString.call(r).slice(8, -1);
	    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
	  }
	}

	var errorCatch = {
	  init: function init(cb) {
	    // img: window.addEventListener("error", fn, true)
	    // promise: 可以捕获当前的promise的错误 unhandledrejection
	    // 当 Promise 被 reject 且没有 reject 处理器的时候，会触发 unhandledrejection 事件

	    // 这个无法监控404
	    window.onerror = function (message, source, lineno, colno, error) {
	      console.dir(error);
	      var info = {
	        message: error.message,
	        name: error.name
	      };
	      var stack = error.stack;
	      // 可能会有多个，取第一个就可以
	      var matchUrl = stack.match(/http:\/\/[^\n]*/)[0];
	      info.filename = matchUrl.match(/http:\/\/(?:\S*)\.js/)[0];
	      var _matchUrl$match = matchUrl.match(/:(\d+):(\d+)/),
	        _matchUrl$match2 = _slicedToArray(_matchUrl$match, 3),
	        row = _matchUrl$match2[1],
	        colume = _matchUrl$match2[2];
	      info.row = row;
	      info.colume = colume; // 上线的时候代码会压缩，行数永远是1 source-map
	      cb(info);
	    };
	  }
	};

	/**
	 * 1- 监控页面的性能
	 * 		- 就是计算时间差 dns解析时间 dom解析时间 Performance Api    
	 * 		- 
	 * 2- 监控页面静态资源的加载情况
	 * 3- 加载ajax的发送情况
	 * 4- 页面的错误捕获
	 * 5- 监控用户的行为
	 */
	var formatObj = function formatObj(data) {
	  var arr = [];
	  for (var key in data) {
	    arr.push("".concat(key, "=").concat(data[key]));
	  }
	  return arr.join("&");
	};
	perf.init(function (data) {
	  // 获取到页面性能相关的数据
	  // 1- 通过ajax
	  // 2- 通过image
	  // 图片可能没大小 空的图片
	  // src 本身的异步，更加轻量无感，后台配合一个接口
	  new Image().src = "/rabbit.png?" + formatObj(data);
	});

	// 2- 监控页面静态资源的加载情况 css / js
	resource.init(function (data) {
	  // console.log(data, 32)
	});

	// 3- 加载ajax的发送情况 发送倒回来的时间
	xhr.init(function (data) {
	  console.log(data, 44);
	});

	// 4- 页面的错误捕获
	// try/ catch window.onerror
	errorCatch.init(function (data) {
	  console.log(data, 46);
	});
	// 5- 监控用户的行为
	// pv / uv 可以在vue/react路由拦截里面来写
	// page view unique view

}));
