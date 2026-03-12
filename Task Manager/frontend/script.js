const API = "http://localhost:5000"

let token = localStorage.getItem("token")



/* ========================
REGISTER
======================== */

async function register() {

    const username = document.getElementById("regUser").value
    const password = document.getElementById("regPass").value

    await fetch(API + "/register", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({ username, password })

    })

    alert("registered")

}



/* ========================
LOGIN
======================== */

async function login() {

    const username = document.getElementById("logUser").value
    const password = document.getElementById("logPass").value

    const res = await fetch(API + "/login", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({ username, password })

    })

    const data = await res.json()

    token = data.token

    localStorage.setItem("token", token)

    loadTasks()

}



/* ========================
ADD TASK
======================== */

async function addTask() {

    const title = document.getElementById("taskInput").value

    await fetch(API + "/tasks", {

        method: "POST",

        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },

        body: JSON.stringify({ title })

    })

    loadTasks()

}



/* ========================
LOAD TASKS
======================== */

async function loadTasks() {

    const res = await fetch(API + "/tasks", {

        headers: {
            "Authorization": "Bearer " + token
        }

    })

    const tasks = await res.json()

    const list = document.getElementById("tasks")

    list.innerHTML = tasks.map(t => `

<li>

${t.title}

<button onclick="deleteTask('${t._id}')">Delete</button>

<button onclick="toggleTask('${t._id}',${t.completed})">

${t.completed ? "Undo" : "Done"}

</button>

</li>

`).join("")

}



/* ========================
DELETE TASK
======================== */

async function deleteTask(id) {

    await fetch(API + "/tasks/" + id, {

        method: "DELETE",

        headers: {
            "Authorization": "Bearer " + token
        }

    })

    loadTasks()

}



/* ========================
UPDATE TASK
======================== */

async function toggleTask(id, completed) {

    await fetch(API + "/tasks/" + id, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },

        body: JSON.stringify({

            completed: !completed

        })

    })

    loadTasks()

}



loadTasks()