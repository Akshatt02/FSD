const API = "http://localhost:5000"

let token = localStorage.getItem("token")



/* =====================
SIGNUP
===================== */

async function signup() {

    const username = document.getElementById("suUser").value
    const password = document.getElementById("suPass").value

    await fetch(API + "/signup", {

        method: "POST",
        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({ username, password })

    })

    alert("Signup done")

}



/* =====================
LOGIN
===================== */

async function login() {

    const username = document.getElementById("logUser").value
    const password = document.getElementById("logPass").value

    const res = await fetch(API + "/login", {

        method: "POST",
        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({ username, password })

    })

    const data = await res.json()

    token = data.token

    localStorage.setItem("token", token)

    loadExpenses()

}



/* =====================
ADD EXPENSE
===================== */

async function addExpense() {

    const title = document.getElementById("title").value
    const amount = document.getElementById("amount").value
    const category = document.getElementById("category").value

    await fetch(API + "/expenses", {

        method: "POST",

        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },

        body: JSON.stringify({ title, amount, category })

    })

    loadExpenses()

}



/* =====================
LOAD EXPENSES
===================== */

async function loadExpenses() {

    const res = await fetch(API + "/expenses", {

        headers: {
            "Authorization": "Bearer " + token
        }

    })

    const expenses = await res.json()

    const list = document.getElementById("list")

    list.innerHTML = expenses.map(e => `

<li>

${e.title} - ₹${e.amount} - ${e.category}

<button onclick="deleteExpense('${e._id}')">Delete</button>

<button onclick="editExpense('${e._id}')">Edit</button>

</li>

`).join("")

    loadTotal()

}



/* =====================
DELETE
===================== */

async function deleteExpense(id) {

    await fetch(API + "/expenses/" + id, {

        method: "DELETE",

        headers: {
            "Authorization": "Bearer " + token
        }

    })

    loadExpenses()

}



/* =====================
UPDATE
===================== */

async function editExpense(id) {

    const title = prompt("New title")

    await fetch(API + "/expenses/" + id, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },

        body: JSON.stringify({ title })

    })

    loadExpenses()

}



/* =====================
FILTER
===================== */

async function filterCategory() {

    const category = document.getElementById("filter").value

    const res = await fetch(API + "/category?category=" + category, {

        headers: {
            "Authorization": "Bearer " + token
        }

    })

    const expenses = await res.json()

    const list = document.getElementById("list")

    list.innerHTML = expenses.map(e => `

<li>${e.title} - ₹${e.amount}</li>

`).join("")

}



/* =====================
TOTAL
===================== */

async function loadTotal() {

    const res = await fetch(API + "/total", {

        headers: {
            "Authorization": "Bearer " + token
        }

    })

    const data = await res.json()

    document.getElementById("total").innerText = data.total

}



loadExpenses()