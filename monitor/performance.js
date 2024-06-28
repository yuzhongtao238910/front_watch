// 专门用来写页面监控的 性能监控的

let processData = (p) => {
	let data = {
		// 如果当前窗口中没有前一个文档，那么navigationStart的值就是fetchStart。
		// 上个页面的加载时间
		// 如果页面是通过点击链接、表单提交或JavaScript重定向到达的
		// 并且那个页面已经完成了加载，那么 redirectStart 将包含那个页面完成加载的时间戳。
		prevPage: p.fetchStart - p.navigationStart, // 上一个页面到这个页面的时长
		redirect: p.redirectEnd - p.redirectStart, // 重定向的时长
		dnsTime: p.domainLookupEnd - p.domainLookupStart, // dns的解析的时长
		connect: p.connectEnd - p.connectStart, // tcp链接的时长

		// 本质上，上面的我们都没有办法控制
		send: p.responseEnd - p.requestStart, // 从请求到响应的时长
		ttfb: p.responseStart - p.navigationStart, // 首字节接收的时长
		domready: p.domInteractive - p.domLoading, // dom 准备的时长
		whiteScreen: p.domLoading - p.navigationStart,// 白屏的时间
		domTime: p.domComplete - p.domLoading,// dom 的解析时间
		loadTime: p.loadEventEnd - p.loadEventStart, // onLoad的执行时间
		total: p.loadEventEnd -p.navigationStart // 总时长
		// TTFB，全称Time To First Byte，意思是从发出页面请求到接收到应答数据第一个字节所花费的毫秒数。
		// 这个指标用于衡量Web服务器或其他网络资源的响应能力。
	}
	// console.log(obj)
	var p = performance.getEntries(); // 另一种方式
     // for (var i = 0; i < p.length; i++) {
    	// console.log(p[i]);
  	// }
	return data
}
let load = (cb) => {
	let timer = null
	let check = () => {
		if (performance.timing.loadEventEnd) {
			// 没有到end的时候，是0
			clearTimeout(timer)
			cb()
		} else {
			timer = setTimeout(check, 100)
		}
	}
	window.addEventListener("load", check, false)
}

let domReady = (cb) => {
	let timer = null
	let check = () => {
		if (performance.timing.domInteractive) {
			// 没有到end的时候，是0
			clearTimeout(timer)
			cb()
		} else {
			timer = setTimeout(check, 100)
		}
	}
	window.addEventListener("DOMContentLoaded", check, false)
}
export default {
	init(cb) {
		domReady(() => {
			// 有可能没有处罚onload,dom解析完成后先统计一下，可能用户没有加载完成就把页面关了
			let perfData = performance.timing
			let data = processData(perfData)
			data.type = "domready"
			cb(data)
		})
		load(() => {
			let perfData = performance.timing
			let data = processData(perfData)
			data.type = "loaded"
			cb(data)
		})
	}
}