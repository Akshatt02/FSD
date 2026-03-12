const API = "http://localhost:5000"

let token = localStorage.getItem("token")



/* =========================
SIGNUP
========================= */

async function signup(){

const username = document.getElementById("suUser").value
const password = document.getElementById("suPass").value

await fetch(API+"/signup",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({username,password})

})

alert("Signup successful")

}



/* =========================
LOGIN
========================= */

async function login(){

const username = document.getElementById("logUser").value
const password = document.getElementById("logPass").value

const res = await fetch(API+"/login",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({username,password})

})

const data = await res.json()

token = data.token

localStorage.setItem("token",token)

loadStudents()

}



/* =========================
ADD STUDENT
========================= */

async function addStudent(){

const name = document.getElementById("name").value
const age = document.getElementById("age").value
const course = document.getElementById("course").value

await fetch(API+"/students",{

method:"POST",

headers:{
"Content-Type":"application/json",
"Authorization":"Bearer "+token
},

body:JSON.stringify({name,age,course})

})

loadStudents()

}



/* =========================
LOAD STUDENTS
========================= */

async function loadStudents(){

const res = await fetch(API+"/students",{

headers:{
"Authorization":"Bearer "+token
}

})

const students = await res.json()

const list = document.getElementById("list")

list.innerHTML = students.map(s=>`

<li>

${s.name} - ${s.course}

<button onclick="deleteStudent('${s._id}')">Delete</button>

<button onclick="editStudent('${s._id}')">Edit</button>

</li>

`).join("")

}



/* =========================
DELETE
========================= */

async function deleteStudent(id){

await fetch(API+"/students/"+id,{

method:"DELETE",

headers:{
"Authorization":"Bearer "+token
}

})

loadStudents()

}



/* =========================
UPDATE
========================= */

async function editStudent(id){

const name = prompt("New name")

await fetch(API+"/students/"+id,{

method:"PUT",

headers:{
"Content-Type":"application/json",
"Authorization":"Bearer "+token
},

body:JSON.stringify({name})

})

loadStudents()

}



/* =========================
SEARCH
========================= */

async function searchStudent(){

const q = document.getElementById("search").value

const res = await fetch(API+"/search?q="+q,{

headers:{
"Authorization":"Bearer "+token
}

})

const students = await res.json()

const list = document.getElementById("list")

list.innerHTML = students.map(s=>`

<li>${s.name} - ${s.course}</li>

`).join("")

}



loadStudents()