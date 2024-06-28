const processData = (d) => {
	let data = {
		name: d.name,
		duration: d.duration,
		initiatorType: d.initiatorType
	}
	return data
}
export default {
	init(cb) {
		if (window.PerformanceObserver) {
			// ie 完全不兼容
			let observer = new PerformanceObserver(list => {
				let data = list.getEntries() // data一个数组
				for (let i = 0; i < data.length; i++) {
					cb(processData(data[0]))
				}				
			})
			observer.observe({
				entryTypes: ['resource']
			})
		} else {
			// 获取资源相关的信息
			window.onload = function () {
				let resourceData = performance.getEntriesByType("resource")
				let data = resourceData.map(processData)
				cb(data)
			}
		}
		
	}
}