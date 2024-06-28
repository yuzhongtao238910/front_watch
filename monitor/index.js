/**
 * 1- 监控页面的性能
 * 		- 就是计算时间差 dns解析时间 dom解析时间 Performance Api    
 * 		- 
 * 2- 监控页面静态资源的加载情况
 * 3- 加载ajax的发送情况
 * 4- 页面的错误捕获
 * 5- 监控用户的行为
 */ 

// 1- 监控页面的性能
import perf from "./performance.js"
import resource from "./resource.js"
import xhr from "./xhr.js"
import errorCatch from "./errorCatch.js"
let formatObj = data => {
	let arr = []
	for (let key in data) {
		arr.push(`${key}=${data[key]}`)
	}
	return arr.join("&")
}
perf.init((data) => { // 获取到页面性能相关的数据
	// 1- 通过ajax
	// 2- 通过image
	// 图片可能没大小 空的图片
	// src 本身的异步，更加轻量无感，后台配合一个接口
	new Image().src = "/rabbit.png?" + formatObj(data)
})


// 2- 监控页面静态资源的加载情况 css / js
resource.init((data) => {
	// console.log(data, 32)
})

// 3- 加载ajax的发送情况 发送倒回来的时间 promise fetch
xhr.init(data => {
	console.log(data, 44)
})


// 4- 页面的错误捕获
// try/ catch window.onerror
errorCatch.init(data => {
	console.log(data, 46)
})
// 5- 监控用户的行为
// pv / uv 可以在vue/react路由拦截里面来写
// page view unique view