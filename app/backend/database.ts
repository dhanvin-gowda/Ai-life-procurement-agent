
import {Mongoose} from "mongoose";
const mongoose = new Mongoose()
mongoose.connect("mongodb://127.0.0.1:27017/logindetails")
.then(()=>console.log("connected"))
.catch(err=>console.log(err))

interface schema {
    email:string,
    password:string,
}

const userschema = new mongoose.Schema<schema>(
   {
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    }

   }
)

const user = mongoose.model("logindetails",userschema)

export { user }

