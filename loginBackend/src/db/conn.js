const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/Registration").then(()=>{
    console.log("mongoose connected ")
}).catch((e)=>{
 console.log("not connected" )
 console.log(e)
})
 