import express from "express"
import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import cors from "cors"

const app = express()

app.use(express.json())
app.use(cors())

const PORT = 5000
const SECRET = "secret123"

/* ===============================
DATABASE
================================ */

mongoose.connect("mongodb+srv://Akshat:@assg.5g5dtdl.mongodb.net/akshat?retryWrites=true&w=majority")
.then(()=>console.log("Mongo connected"))
.catch(err=>console.log(err))


/* ===============================
MODELS
================================ */

const userSchema = new mongoose.Schema({
    username:{type:String,unique:true},
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

    try{

        const header = req.headers.authorization

        if(!header)
            return res.status(401).json({message:"No token provided"})

        const token = header.split(" ")[1]

        const decoded = jwt.verify(token,SECRET)

        req.user = decoded

        next()

    }catch(err){

        res.status(401).json({message:"Invalid token"})

    }

}


/* ===============================
REGISTER
================================ */

app.post("/register", async(req,res)=>{

    try{

        const {username,password} = req.body

        const existing = await User.findOne({username})

        if(existing)
            return res.status(400).json({message:"User already exists"})

        const user = await User.create({username,password})

        res.json({message:"User created",user})

    }catch(err){

        res.status(500).json({message:"Server error"})

    }

})


/* ===============================
LOGIN
================================ */

app.post("/login", async(req,res)=>{

    try{

        const {username,password} = req.body

        const user = await User.findOne({username,password})

        if(!user)
            return res.status(401).json({message:"Invalid login"})

        const token = jwt.sign(
            {id:user._id},
            SECRET,
            {expiresIn:"1d"}
        )

        res.json({token})

    }catch(err){

        res.status(500).json({message:"Server error"})

    }

})


/* ===============================
CREATE TASK
================================ */

app.post("/tasks", auth, async(req,res)=>{

    try{

        const task = await Task.create({

            title:req.body.title,
            userId:req.user.id

        })

        res.json(task)

    }catch(err){

        res.status(500).json({message:"Error creating task"})

    }

})


/* ===============================
GET TASKS
================================ */

app.get("/tasks", auth, async(req,res)=>{

    try{

        const tasks = await Task.find({
            userId:req.user.id
        })

        res.json(tasks)

    }catch(err){

        res.status(500).json({message:"Error fetching tasks"})

    }

})


/* ===============================
UPDATE TASK
================================ */

app.put("/tasks/:id", auth, async(req,res)=>{

    try{

        const task = await Task.findOneAndUpdate(

            {_id:req.params.id, userId:req.user.id},
            req.body,
            {new:true}

        )

        if(!task)
            return res.status(404).json({message:"Task not found"})

        res.json(task)

    }catch(err){

        res.status(500).json({message:"Error updating task"})

    }

})


/* ===============================
DELETE TASK
================================ */

app.delete("/tasks/:id", auth, async(req,res)=>{

    try{

        const task = await Task.findOneAndDelete({

            _id:req.params.id,
            userId:req.user.id

        })

        if(!task)
            return res.status(404).json({message:"Task not found"})

        res.json({message:"Deleted"})

    }catch(err){

        res.status(500).json({message:"Error deleting task"})

    }

})


/* ===============================
SERVER
================================ */

app.listen(PORT,()=>{

    console.log("Server running on port "+PORT)

})