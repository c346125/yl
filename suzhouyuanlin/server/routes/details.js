const express=require("express")
const router=express.Router();
const pool=require("../pool")

//app.use("/details",Details)
//服务端接口地址http://localhost:3000/details
//客户端请求时:
//http://localhost:3000/details?lid=1
router.get("/",(req,res)=>{
  var lid=req.query.lid;
  var output={
    product:[],
    specs:[],
    pics:[]
  }
  
    var sql1=`select * from yl_details where lid=?`;
    pool.query(sql1,[lid],(err,result)=>{
      if(err) console.log(err);
      output.product=result;
      
        var sql2=`select * from yl_tick where index_id=?`;
          pool.query(sql2,[lid],(err,result)=>{
            if(err) console.log(err);
            output.specs=result;
                var sql3=`select * from yl_img where scenic_id=?`
                pool.query(sql3,[lid],(err,result)=>{
                  if(err) console.log(err);
                  output.pics=result;
                  res.send(output);
                })
        })
    })
  });
 

module.exports=router;