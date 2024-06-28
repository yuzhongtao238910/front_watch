export default {
	init(cb) {
		// img: window.addEventListener("error", fn, true)
		// promise: 可以捕获当前的promise的错误 unhandledrejection
		// 当 Promise 被 reject 且没有 reject 处理器的时候，会触发 unhandledrejection 事件

		// 这个无法监控404
		window.onerror = function (message, source, lineno, colno, error) {
			console.dir(error)
			let info = {
				message: error.message,
				name: error.name,
			}
			let stack = error.stack
			// 可能会有多个，取第一个就可以
			let matchUrl = stack.match(/http:\/\/[^\n]*/)[0]
			
			info.filename = matchUrl.match(/http:\/\/(?:\S*)\.js/)[0]
			let [, row, colume] = matchUrl.match(/:(\d+):(\d+)/)
			info.row = row
			info.colume = colume // 上线的时候代码会压缩，行数永远是1 source-map
			cb(info)
		}
	}
}