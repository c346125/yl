const express=require("express")
const router=express.Router();
const pool=require("../pool");

router.get("/",(req,res)=>{
        var output={
            carousel:[],
            scenic:[],
            message:[]
        }
       var sql="select * from yl_carousel";
        pool.query(sql,[],(err,result)=>{
            if(err) throw err;
            output.carousel=result;
        var sql2="select * from yl_index_scenic";
        pool.query(sql2,[],(err,result)=>{
            if(err) throw err;
            output.scenic=result;
        var sql3="select * from yl_message";
        pool.query(sql3,[],(err,result)=>{
            if(err) throw err;
            output.message=result;
            res.send(output);
        })
        })
        })
    });        
module.exports=router;