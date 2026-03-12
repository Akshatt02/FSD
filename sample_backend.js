/*
============================================================
IMPORT LIBRARIES
============================================================
*/

const express = require("express")
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const cors = require("cors")


/*
============================================================
APP INITIALIZATION
============================================================
*/

const app = express()

app.use(express.json())     // parse JSON body
app.use(cors())             // allow cross-origin requests


/*
============================================================
CONFIG VARIABLES
============================================================
*/

const PORT = 5000
const JWT_SECRET = "secretkey"


/*
============================================================
MONGODB CONNECTION
============================================================
*/

mongoose.connect("mongodb://127.0.0.1:27017/fsd_lab", {

    useNewUrlParser: true,
    useUnifiedTopology: true

})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err))


/*
============================================================
MONGOOSE MODEL / SCHEMA
============================================================
*/

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    role: {
        type: String,
        default: "user"
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

})

const User = mongoose.model("User", userSchema)



/*
============================================================
AUTH MIDDLEWARE (JWT VERIFY)
============================================================
*/

const authMiddleware = (req, res, next) => {

    try {

        const authHeader = req.headers.authorization

        if(!authHeader)
            return res.status(401).json({message:"No token"})

        const token = authHeader.split(" ")[1]

        const decoded = jwt.verify(token, JWT_SECRET)

        req.user = decoded

        next()

    }
    catch(err){

        res.status(401).json({message:"Invalid Token"})
    }

}



/*
============================================================
ROLE BASED AUTHORIZATION
============================================================
*/

const adminMiddleware = (req, res, next) => {

    if(req.user.role !== "admin"){

        return res.status(403).json({message:"Admin only"})

    }

    next()

}



/*
============================================================
ROOT ROUTE
============================================================
*/

app.get("/", (req,res)=>{

    res.json({message:"Backend running"})

})



/*
============================================================
AUTH LOGIN (GENERATE JWT)
============================================================
*/

app.post("/login", async (req,res)=>{

    const {email} = req.body

    const user = await User.findOne({email})

    if(!user)
        return res.status(404).json({message:"User not found"})

    const token = jwt.sign({

        id:user._id,
        email:user.email,
        role:user.role

    }, JWT_SECRET, {expiresIn:"1h"})

    res.json({token})

})



/*
============================================================
CREATE USER (POST)
============================================================
*/

app.post("/users", async (req,res)=>{

    try{

        const user = new User(req.body)

        const savedUser = await user.save()

        res.status(201).json(savedUser)

    }
    catch(err){

        res.status(500).json({error:err.message})

    }

})



/*
============================================================
GET ALL USERS
============================================================
*/

app.get("/users", async (req,res)=>{

    const users = await User.find()

    res.json(users)

})



/*
============================================================
GET USER BY ID
============================================================
*/

app.get("/users/:id", async (req,res)=>{

    const user = await User.findById(req.params.id)

    if(!user)
        return res.status(404).json({message:"User not found"})

    res.json(user)

})



/*
============================================================
UPDATE USER (PUT)
============================================================
*/

app.put("/users/:id", async (req,res)=>{

    const updated = await User.findByIdAndUpdate(

        req.params.id,
        req.body,
        {new:true}

    )

    res.json(updated)

})



/*
============================================================
PARTIAL UPDATE (PATCH)
============================================================
*/

app.patch("/users/:id", async (req,res)=>{

    const updated = await User.findByIdAndUpdate(

        req.params.id,
        {$set:req.body},
        {new:true}

    )

    res.json(updated)

})



/*
============================================================
DELETE USER
============================================================
*/

app.delete("/users/:id", async (req,res)=>{

    await User.findByIdAndDelete(req.params.id)

    res.json({message:"User deleted"})

})



/*
============================================================
SEARCH USERS (MONGO QUERY)
============================================================
*/

app.get("/search", async (req,res)=>{

    const {name} = req.query

    const users = await User.find({

        name: { $regex: name, $options: "i" }

    })

    res.json(users)

})



/*
============================================================
FILTER USERS
============================================================
*/

app.get("/filter", async (req,res)=>{

    const {role} = req.query

    const users = await User.find({role})

    res.json(users)

})



/*
============================================================
PAGINATION
============================================================
*/

app.get("/paginate", async (req,res)=>{

    const page = parseInt(req.query.page) || 1

    const limit = parseInt(req.query.limit) || 5

    const users = await User.find()

        .skip((page-1)*limit)
        .limit(limit)

    res.json(users)

})



/*
============================================================
PROTECTED ROUTE
============================================================
*/

app.get("/profile", authMiddleware, (req,res)=>{

    res.json({

        message:"Protected route accessed",

        user:req.user

    })

})



/*
============================================================
ADMIN ONLY ROUTE
============================================================
*/

app.delete("/admin/users/:id",

    authMiddleware,
    adminMiddleware,

    async (req,res)=>{

        await User.findByIdAndDelete(req.params.id)

        res.json({message:"Admin deleted user"})

})



/*
============================================================
COUNT DOCUMENTS
============================================================
*/

app.get("/count", async (req,res)=>{

    const count = await User.countDocuments()

    res.json({count})

})



/*
============================================================
SORT USERS
============================================================
*/

app.get("/sort", async (req,res)=>{

    const users = await User.find()

        .sort({createdAt:-1})

    res.json(users)

})



/*
============================================================
ERROR HANDLING MIDDLEWARE
============================================================
*/

app.use((err, req, res, next)=>{

    console.error(err.stack)

    res.status(500).json({

        message:"Internal Server Error"

    })

})



/*
============================================================
START SERVER
============================================================
*/

app.listen(PORT, ()=>{

    console.log(`Server running on port ${PORT}`)

})



/*
============================================================
COMMON REQUEST EXAMPLES

POST /users

{
"name":"Akshat",
"email":"akshat@test.com",
"role":"admin"
}


GET /search?name=ak


GET /paginate?page=1&limit=5


Authorization header

Authorization: Bearer TOKEN_HERE

============================================================
*/