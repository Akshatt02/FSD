import express from "express"
import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import cors from "cors"

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static("public"))

const SECRET = "secret123"
const PORT = 5000


/* ===============================
DATABASE
=============================== */

mongoose.connect("mongodb://127.0.0.1:27017/student_manager")
.then(()=>console.log("Mongo connected"))



/* ===============================
MODELS
=============================== */

const userSchema = new mongoose.Schema({

username:String,
password:String

})

const studentSchema = new mongoose.Schema({

name:String,
age:Number,
course:String,
createdAt:{
type:Date,
default:Date.now
}

})

const User = mongoose.model("User",userSchema)
const Student = mongoose.model("Student",studentSchema)



/* ===============================
AUTH MIDDLEWARE
=============================== */

function auth(req,res,next){

const header = req.headers.authorization

if(!header)
return res.status(401).json({message:"No token"})

const token = header.split(" ")[1]

const decoded = jwt.verify(token,SECRET)

req.user = decoded

next()

}



/* ===============================
SIGNUP
=============================== */

app.post("/signup", async(req,res)=>{

const user = await User.create(req.body)

res.json(user)

})



/* ===============================
LOGIN
=============================== */

app.post("/login", async(req,res)=>{

const {username,password} = req.body

const user = await User.findOne({username,password})

if(!user)
return res.status(401).json({message:"Invalid credentials"})

const token = jwt.sign({

id:user._id,
username:user.username

},SECRET)

res.json({token})

})



/* ===============================
CREATE STUDENT
=============================== */

app.post("/students", auth, async(req,res)=>{

const student = await Student.create(req.body)

res.json(student)

})



/* ===============================
GET ALL STUDENTS
=============================== */

app.get("/students", auth, async(req,res)=>{

const students = await Student.find()

res.json(students)

})



/* ===============================
GET SINGLE STUDENT
=============================== */

app.get("/students/:id", auth, async(req,res)=>{

const student = await Student.findById(req.params.id)

res.json(student)

})



/* ===============================
UPDATE STUDENT
=============================== */

app.put("/students/:id", auth, async(req,res)=>{

const updated = await Student.findByIdAndUpdate(

req.params.id,
req.body,
{new:true}

)

res.json(updated)

})



/* ===============================
DELETE STUDENT
=============================== */

app.delete("/students/:id", auth, async(req,res)=>{

await Student.findByIdAndDelete(req.params.id)

res.json({message:"Deleted"})

})



/* ===============================
SEARCH STUDENTS
=============================== */

app.get("/search", auth, async(req,res)=>{

const q = req.query.q

const students = await Student.find({

name:{ $regex:q, $options:"i" }

})

res.json(students)

})



/* ===============================
SERVER
=============================== */

app.listen(PORT,()=>{

console.log("Server running on "+PORT)

})