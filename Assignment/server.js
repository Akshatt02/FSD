const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("./User");
const Assignment = require("./Assignment");
const Submission = require("./Submission");
const auth = require("./authMiddleware");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

mongoose.connect("mongodb+srv://Akshat:@assg.5g5dtdl.mongodb.net/akshat?appName=assg")
.then(()=>console.log("MongoDB connected"))

/* REGISTER */

app.post("/register", async (req,res)=>{
    const {username,password,role} = req.body;

    const hashed = await bcrypt.hash(password,10);

    const user = new User({
        username,
        password:hashed,
        role
    });

    await user.save();

    res.json({message:"User Registered"});
});

/* LOGIN */

app.post("/login", async (req,res)=>{

    const {username,password} = req.body;

    const user = await User.findOne({username});

    if(!user) return res.status(400).json({msg:"User not found"});

    const valid = await bcrypt.compare(password,user.password);

    if(!valid) return res.status(400).json({msg:"Wrong password"});

    const token = jwt.sign(
        {id:user._id,role:user.role},
        "secretkey"
    );

    res.json({token,role:user.role});
});

/* CREATE ASSIGNMENT (Faculty) */

app.post("/assignment/create",auth,async(req,res)=>{

    if(req.user.role !== "faculty")
        return res.status(403).json({msg:"Only faculty allowed"});

    const assignment = new Assignment(req.body);

    await assignment.save();

    res.json({msg:"Assignment created"});
});


/* GET ASSIGNMENTS */

app.get("/assignments",auth,async(req,res)=>{

    const assignments = await Assignment.find();

    res.json(assignments);
});


/* SUBMIT ASSIGNMENT (Student) */

app.post("/submit",auth,async(req,res)=>{

    if(req.user.role !== "student")
        return res.status(403).json({msg:"Only students allowed"});

    const submission = new Submission({
        student:req.user.id,
        assignment:req.body.assignment,
        answer:req.body.answer
    });

    await submission.save();

    res.json({msg:"Submitted"});
});


/* VIEW SUBMISSIONS (Faculty) */

app.get("/submissions",auth,async(req,res)=>{

    if(req.user.role !== "faculty")
        return res.status(403).json({msg:"Faculty only"});

    const subs = await Submission
        .find()
        .populate("student")
        .populate("assignment");

    res.json(subs);
});


app.listen(3000,()=>console.log("Server running on 3000"));