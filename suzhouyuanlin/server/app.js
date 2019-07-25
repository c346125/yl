//使用express构建web服务器 --11:25
const express = require('express');
const bodyParser = require('body-parser');
/*创建路由器*/
const router=express.Router();
//创建mysql连接池
const mysql = require('mysql');

const index=require("./routes/index");
const details=require("./routes/details");
const cors=require("cors");
var app = express();
 var server=app.listen(3000);
//npm i  -save cors 
     app.use(cors({
      origin:"*"
   }));
//使用body-parser中间件
app.use(bodyParser.urlencoded({extended:false}));
//托管静态资源到public目录下
app.use(express.static('public'));

app.use("/index",index);
app.use("/details",details);
