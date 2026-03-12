/*
=========================================================
FRONTEND JAVASCRIPT CHEAT SHEET FOR FSD LAB EXAMS
Focus: DOM + API + Practical Web Development
=========================================================
*/


/*
=========================================================
1. BASIC VARIABLES
=========================================================
*/

// modern variable declarations

let username = "Akshat"
const age = 20

// avoid var in modern JS


/*
=========================================================
2. SELECTING DOM ELEMENTS
=========================================================
*/

// select single element

const title = document.querySelector("h1")

// select by id

const header = document.getElementById("header")

// select by class

const boxes = document.getElementsByClassName("box")

// select all elements

const items = document.querySelectorAll(".item")

// returns NodeList (can iterate)


/*
=========================================================
3. MODIFYING DOM CONTENT
=========================================================
*/

title.textContent = "New Title"

title.innerText = "Visible Text"

title.innerHTML = "<span>Hello</span>"


// change styles

title.style.color = "red"
title.style.fontSize = "30px"


// add class

title.classList.add("active")

// remove class

title.classList.remove("active")

// toggle class

title.classList.toggle("active")



/*
=========================================================
4. CREATING NEW ELEMENTS
=========================================================
*/

const newDiv = document.createElement("div")

newDiv.textContent = "Hello world"

document.body.appendChild(newDiv)



/*
=========================================================
5. REMOVING ELEMENTS
=========================================================
*/

const element = document.querySelector(".delete")

element.remove()



/*
=========================================================
6. EVENT LISTENERS
=========================================================
*/

const button = document.querySelector("#btn")

button.addEventListener("click", () => {

    console.log("Button clicked")

})


button.addEventListener("mouseover", () => {

    console.log("Mouse over button")

})



/*
=========================================================
7. INPUT VALUES
=========================================================
*/

const input = document.querySelector("#name")

const value = input.value

console.log(value)



/*
=========================================================
8. FORM SUBMISSION
=========================================================
*/

const form = document.querySelector("#form")

form.addEventListener("submit", (e) => {

    e.preventDefault()   // prevent page reload

    const name = document.querySelector("#name").value

    console.log(name)

})



/*
=========================================================
9. LOOPING THROUGH ELEMENTS
=========================================================
*/

const listItems = document.querySelectorAll("li")

listItems.forEach((item) => {

    item.style.color = "blue"

})



/*
=========================================================
10. ARRAY METHODS USED IN FRONTEND
=========================================================
*/

const numbers = [1,2,3,4]


// map

const doubled = numbers.map(n => n * 2)


// filter

const even = numbers.filter(n => n % 2 === 0)


// find

const found = numbers.find(n => n === 3)



/*
=========================================================
11. FETCH API (GET REQUEST)
=========================================================
*/

async function getUsers() {

    try {

        const response = await fetch("https://api.example.com/users")

        const data = await response.json()

        console.log(data)

    }

    catch(error) {

        console.log(error)

    }

}



/*
=========================================================
12. FETCH WITH HEADERS
=========================================================
*/

async function fetchWithHeaders() {

    const response = await fetch("https://api.example.com/users", {

        method: "GET",

        headers: {

            "Content-Type": "application/json",

            "Authorization": "Bearer TOKEN_HERE"

        }

    })

    const data = await response.json()

    console.log(data)

}



/*
=========================================================
13. POST REQUEST
=========================================================
*/

async function createUser() {

    const response = await fetch("https://api.example.com/users", {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({

            name: "Akshat",

            age: 20

        })

    })

    const data = await response.json()

    console.log(data)

}



/*
=========================================================
14. PUT REQUEST (UPDATE)
=========================================================
*/

async function updateUser() {

    const response = await fetch("https://api.example.com/users/1", {

        method: "PUT",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({

            name: "Updated Name"

        })

    })

}



/*
=========================================================
15. DELETE REQUEST
=========================================================
*/

async function deleteUser() {

    await fetch("https://api.example.com/users/1", {

        method: "DELETE"

    })

}



/*
=========================================================
16. MAPPING API RESPONSE TO DOM
=========================================================
*/

async function loadUsers() {

    const res = await fetch("https://jsonplaceholder.typicode.com/users")

    const users = await res.json()

    const container = document.querySelector("#users")

    container.innerHTML = users.map(user => `
    
        <div class="user">
            <h3>${user.name}</h3>
            <p>${user.email}</p>
        </div>

    `).join("")

}



/*
=========================================================
17. LOADING STATE
=========================================================
*/

async function loadData() {

    const container = document.querySelector("#data")

    container.innerHTML = "Loading..."

    const res = await fetch("https://api.example.com/data")

    const data = await res.json()

    container.innerHTML = JSON.stringify(data)

}



/*
=========================================================
18. ERROR HANDLING
=========================================================
*/

async function fetchData() {

    try {

        const res = await fetch("https://api.example.com")

        if(!res.ok) {

            throw new Error("Network error")

        }

        const data = await res.json()

        console.log(data)

    }

    catch(err) {

        console.log("Error:", err)

    }

}



/*
=========================================================
19. LOCAL STORAGE
=========================================================
*/

// save

localStorage.setItem("token", "12345")

// get

const token = localStorage.getItem("token")

// remove

localStorage.removeItem("token")

// clear

localStorage.clear()



/*
=========================================================
20. SESSION STORAGE
=========================================================
*/

sessionStorage.setItem("user", "Akshat")



/*
=========================================================
21. URL PARAMETERS
=========================================================
*/

const params = new URLSearchParams(window.location.search)

const id = params.get("id")

console.log(id)



/*
=========================================================
22. DEBOUNCE FUNCTION
=========================================================
*/

function debounce(func, delay) {

    let timeout

    return function(...args) {

        clearTimeout(timeout)

        timeout = setTimeout(() => {

            func(...args)

        }, delay)

    }

}



/*
=========================================================
23. SEARCH WITH API
=========================================================
*/

const searchInput = document.querySelector("#search")

searchInput.addEventListener("input", debounce(async (e) => {

    const query = e.target.value

    const res = await fetch(`https://api.example.com/search?q=${query}`)

    const data = await res.json()

    console.log(data)

}, 500))



/*
=========================================================
24. SIMPLE RENDER FUNCTION
=========================================================
*/

function renderPosts(posts) {

    const container = document.querySelector("#posts")

    container.innerHTML = posts.map(post => `
    
        <div>
            <h2>${post.title}</h2>
            <p>${post.body}</p>
        </div>
    
    `).join("")

}



/*
=========================================================
25. FILE UPLOAD
=========================================================
*/

async function uploadFile(file) {

    const formData = new FormData()

    formData.append("file", file)

    const res = await fetch("/upload", {

        method: "POST",

        body: formData

    })

}



/*
=========================================================
26. COPY TO CLIPBOARD
=========================================================
*/

function copyText(text) {

    navigator.clipboard.writeText(text)

}



/*
=========================================================
27. SCROLL TO TOP
=========================================================
*/

function scrollTop() {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    })

}



/*
=========================================================
END OF FRONTEND JS CHEATSHEET
=========================================================
*/