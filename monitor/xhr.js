export default {
	init(cb) {
		// 发送请求一般就是 fetch xhr
		let xhr = window.XMLHttpRequest
		let oldOpen = xhr.prototype.open
		xhr.prototype.open = function(method, url, async , username, passsword) {
			this.info = {
				method, url, async , username, passsword
			}
			return oldOpen.apply(this, arguments)
		}
		let oldSend = xhr.prototype.send
		xhr.prototype.send = function(value) {
			let start = Date.now()
			let fn = (type) => () => {
				this.info.time = Date.now() - start
				this.info.requestSize = value?.length || 0
				this.info.responseSize = this.responseText.length
				this.info.type = type
				cb(this.info)
			}
			this.addEventListener('load', fn('load'), false)
			this.addEventListener('error', fn('error'), false)
			this.addEventListener('abort', fn('abort'), false)
			return oldSend.apply(this, arguments)
		}
	}

	// window.fetch fetch也需要重写 ，走一遍过程
}