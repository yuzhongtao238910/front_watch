const Koa = require("koa")
const path = require("path")
const cors = require('koa2-cors'); // 引入 koa2-cors 中间件  
const Server = require("koa-static")
const Router = require('koa-router');  


let app = new Koa()
// 创建一个router实例  
const router = new Router(); 
app.use(cors({  
  origin: function (ctx) {  
    // 允许来自任何源的请求  
    // 或者你可以根据需要设置特定的源，比如 'http://example.com'  
    return '*';  
  },  
  maxAge: 5, // 预检请求的缓存时间（秒）  
  credentials: true, // 是否允许携带凭证（cookies, http认证等）  
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // 允许请求的方法  
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'], // 允许请求的头部  
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'], // 暴露给客户端的头部  
  keepHeadersOnError: false, // 是否保留响应头，当发生错误时  
  preflightContinue: false, // 在 OPTIONS 预检请求之后是否继续其他中间件  
  alwaysSet: false // 总是设置 Access-Control-Allow-Origin 头部  
}));  
app.use(Server(path.resolve(__dirname, "client")))
app.use(Server(path.resolve(__dirname, "node_modules")))
// 使用router中间件  
app.use(router.routes())  
   .use(router.allowedMethods());  


router.get("/api/list", async (ctx, next) => {
	ctx.body = {name: "apple"}
	ctx.type = 'json'; 
	await next(); // 在这个例子中，next()可能不是必须的，但保持它是个好习惯
})


router.get("/rabbit.png", async (ctx, next) => {
	const queryParams = ctx.query; 
	console.log(queryParams)
	ctx.status = 204
	await next(); // 在这个例子中，next()可能不是必须的，但保持它是个好习惯
})
// 定义你的GET接口  
router.get('/data', async (ctx, next) => {  
  // 创建一个JSON对象  
  const data = {  
    message: 'Hello from Koa!',  
    timestamp: Date.now()  
  };  
  
  // 设置响应的内容类型为JSON  
  ctx.type = 'json';  
  
  // 发送响应  
  ctx.body = data;  
  
  // 调用next()是可选的，因为在这个简单的例子中我们不需要其他中间件  
  await next();  
});  
app.listen(3000, () => {
	console.log("success")
})