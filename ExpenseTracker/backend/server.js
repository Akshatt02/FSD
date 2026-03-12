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


/* =========================
DATABASE
========================= */

mongoose.connect("mongodb://127.0.0.1:27017/expense_tracker")
    .then(() => console.log("Mongo connected"))


/* =========================
MODELS
========================= */

const userSchema = new mongoose.Schema({

    username: String,
    password: String

})

const expenseSchema = new mongoose.Schema({

    title: String,
    amount: Number,
    category: String,
    userId: String,

    createdAt: {
        type: Date,
        default: Date.now
    }

})

const User = mongoose.model("User", userSchema)
const Expense = mongoose.model("Expense", expenseSchema)



/* =========================
AUTH MIDDLEWARE
========================= */

function auth(req, res, next) {

    const header = req.headers.authorization

    if (!header)
        return res.status(401).json({ message: "No token" })

    const token = header.split(" ")[1]

    const decoded = jwt.verify(token, SECRET)

    req.user = decoded

    next()

}



/* =========================
SIGNUP
========================= */

app.post("/signup", async (req, res) => {

    const user = await User.create(req.body)

    res.json(user)

})



/* =========================
LOGIN
========================= */

app.post("/login", async (req, res) => {

    const { username, password } = req.body

    const user = await User.findOne({ username, password })

    if (!user)
        return res.status(401).json({ message: "Invalid login" })

    const token = jwt.sign({

        id: user._id,
        username: user.username

    }, SECRET)

    res.json({ token })

})



/* =========================
CREATE EXPENSE
========================= */

app.post("/expenses", auth, async (req, res) => {

    const expense = await Expense.create({

        title: req.body.title,
        amount: req.body.amount,
        category: req.body.category,
        userId: req.user.id

    })

    res.json(expense)

})



/* =========================
GET EXPENSES
========================= */

app.get("/expenses", auth, async (req, res) => {

    const expenses = await Expense.find({

        userId: req.user.id

    }).sort({ createdAt: -1 })

    res.json(expenses)

})



/* =========================
GET SINGLE EXPENSE
========================= */

app.get("/expenses/:id", auth, async (req, res) => {

    const expense = await Expense.findById(req.params.id)

    res.json(expense)

})



/* =========================
UPDATE EXPENSE
========================= */

app.put("/expenses/:id", auth, async (req, res) => {

    const updated = await Expense.findByIdAndUpdate(

        req.params.id,
        req.body,
        { new: true }

    )

    res.json(updated)

})



/* =========================
DELETE EXPENSE
========================= */

app.delete("/expenses/:id", auth, async (req, res) => {

    await Expense.findByIdAndDelete(req.params.id)

    res.json({ message: "Expense deleted" })

})



/* =========================
FILTER BY CATEGORY
========================= */

app.get("/category", auth, async (req, res) => {

    const category = req.query.category

    const expenses = await Expense.find({

        category: category,
        userId: req.user.id

    })

    res.json(expenses)

})



/* =========================
TOTAL EXPENSE
========================= */

app.get("/total", auth, async (req, res) => {

    const expenses = await Expense.find({ userId: req.user.id })

    const total = expenses.reduce((sum, e) => sum + e.amount, 0)

    res.json({ total })

})



/* =========================
SERVER
========================= */

app.listen(PORT, () => {

    console.log("Server running on " + PORT)

})