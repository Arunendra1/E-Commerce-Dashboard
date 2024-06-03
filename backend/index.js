const express=require('express')
const cors=require("cors");
require('./db/config');
const User=require("./db/User");
const Product=require('./db/Product');

const Jwt=require('jsonwebtoken')
const jwtKey='singh-collections';

const app=express()

app.use(express.json());
app.use(cors(
    {
        origin:["https://deploy-mern-1whq.vercel.app"],
        method:["POST","GET"],
        credentials:true
    }
));
app.get("/",(req,res)=>{
    res.jon("Hello");
})
app.post( '/register',async (req,res)=>{
    let user=new User(req.body);
    let result=await user.save();
    result =result.toObject()
    delete result.password;
    Jwt.sign({result},jwtKey,{expiresIn:"2h"},(err,token)=>{
        if (err){
      res.send({result:"Something went wrong , Please try after some time"})
       }
       res.send({result,auth: token});
})
})

app.post("/login",async(req,resp)=>{
    console.log(req.body)
    if(req.body.password && req.body.email){
        let user=await User.findOne(req.body).select("-password");
        if(user){
            Jwt.sign({user},jwtKey,{expiresIn:"2h"},(err,token)=>{
                if (err){
              resp.send({result:"Something went wrong , Please try after some time"})
               }
               resp.send({user,auth: token});
        })
        }else{
            resp.send({result:"No User Found"})
        }
    }else{
        resp.send({result:"No User Found"})
    }
    
    
})


app.post("/add-product",verifyToken, async (req, res) => {
    let  product = new Product(req.body);
    let result=await product.save();
    res.send(result);
});

app.get('/products',verifyToken, async (req ,res) =>{
   let products = await Product.find();
   if(products.length>0){
    res.send(products); 
   }else{
    res.send({result:"No Products found"})
   }
 });

app.delete('/product/:id',verifyToken,async(req,res)=>{
    
    const result=await Product.deleteOne({_id:req.params.id})
    res.send(result)
});

app.get("/product/:id",verifyToken,async(req,resp)=>{
   let result =await Product.findOne({_id : req.params.id})
   if(result){
    resp.send(result)
   }else{
    resp.send("No Record Found")
   }
})

app.put('/product/:id',verifyToken,async(req,res)=>{
    let result=await Product.updateOne({_id:req.params.id},{
       $set:req.body
    });
    res.send(result);
})

app.get("/search/:key", verifyToken,async(req,res)=>{
    let result=await Product.find({
        "$or" :[
            {"name":{$regex:req.params.key}},
            {"category":{$regex:req.params.key}},
            {"company":{$regex:req.params.key}}

        ]
    })
    res.send(result)
    // console.log(result)
})

function verifyToken(req,resp,next){
    let token=req.headers['authorization'];
    if(token){
      token=token.split(' ')[1] ; 
      Jwt.verify(token,jwtKey,(err,valid)=>{
        if(err){
            resp.status(401).send({result:"Please provide valid token "})       
        }else{
       next();
        }
      })
    }else{
          resp.status(403).send({result:"Please add token with header"})
    }

}

app.listen(5000);
