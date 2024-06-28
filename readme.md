## 监控分类

- 性能监控

- 数据监控

- 异常监控

## 为什么需要前端监控

获取用户行为以及跟踪产品在用户端的使用情况，并且以监控数据为基础，指明产品优化的方向



## 本案例代码的阐述的几点

1- 监控页面的性能

- performance api

2- 监控页面加载静态资源的情况

- performance api

3- 加载ajax的发送情况的监控

- 主要是拦截xhr的send open 等等方法

4- 页面的错误捕获

- 只要是通过window.addEventListener("error", () => {}) 来实现

5- 监控用户的行为

- pv/uv 这块没有写，因为可以和具体的框架相结合



## 案例说明

1- website网页端，并且自带后台服务，后台服务采用koa

2- 监控脚本采用rollup打包，在monitor文件夹之中





















