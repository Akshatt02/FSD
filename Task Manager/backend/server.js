import express from "express"
import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import cors from "cors"

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static("public"))

const PORT = 5000
const SECRET = "secret123"


/* ===============================
DATABASE
================================ */

mongoose.connect("mongodb://127.0.0.1:27017/task_manager")
.then(()=>console.log("Mongo connected"))


/* ===============================
MODELS
================================ */

const userSchema = new mongoose.Schema({
    username:String,
    password:String
})

const taskSchema = new mongoose.Schema({
    title:String,
    completed:{
        type:Boolean,
        default:false
    },
    userId:String
})

const User = mongoose.model("User",userSchema)
const Task = mongoose.model("Task",taskSchema)



/* ===============================
AUTH MIDDLEWARE
================================ */

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
REGISTER
================================ */

app.post("/register", async(req,res)=>{

    const user = await User.create(req.body)

    res.json(user)

})



/* ===============================
LOGIN
================================ */

app.post("/login", async(req,res)=>{

    const {username,password} = req.body

    const user = await User.findOne({username,password})

    if(!user)
        return res.status(401).json({message:"Invalid login"})

    const token = jwt.sign({
        id:user._id
    },SECRET)

    res.json({token})

})



/* ===============================
CREATE TASK
================================ */

app.post("/tasks", auth, async(req,res)=>{

    const task = await Task.create({

        title:req.body.title,
        userId:req.user.id

    })

    res.json(task)

})



/* ===============================
GET TASKS
================================ */

app.get("/tasks", auth, async(req,res)=>{

    const tasks = await Task.find({
        userId:req.user.id
    })

    res.json(tasks)

})



/* ===============================
UPDATE TASK
================================ */

app.put("/tasks/:id", auth, async(req,res)=>{

    const task = await Task.findByIdAndUpdate(

        req.params.id,
        req.body,
        {new:true}

    )

    res.json(task)

})



/* ===============================
DELETE TASK
================================ */

app.delete("/tasks/:id", auth, async(req,res)=>{

    await Task.findByIdAndDelete(req.params.id)

    res.json({message:"Deleted"})

})



/* ===============================
SERVER
================================ */

app.listen(PORT,()=>{

    console.log("Server running on port "+PORT)

})