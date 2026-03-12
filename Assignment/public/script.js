const API = "http://localhost:3000";

/* REGISTER */

function register() {

    fetch(API + "/register", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            username: username.value,
            password: password.value,
            role: role.value

        })

    })
        .then(res => res.json())
        .then(data => {

            alert("Registered Successfully");

            window.location = "login.html";

        });

}


/* LOGIN */

function login() {

    fetch(API + "/login", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            username: username.value,
            password: password.value

        })

    })
        .then(res => res.json())
        .then(data => {

            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);

            if (data.role === "student")
                window.location = "student.html";
            else
                window.location = "faculty.html";

        });

}


/* GET ASSIGNMENTS */

function getAssignments() {

    fetch(API + "/assignments", {

        headers: {
            authorization: localStorage.getItem("token")
        }

    })
        .then(res => res.json())
        .then(data => {

            let html = "";

            data.forEach(a => {

                html += `
<div class="assignment">
<b>${a.title}</b> (${a.course})
<br>
Due: ${a.due_date}
<br>
${a.description}
<br>
ID: ${a._id}
</div>
`;

            });

            document.getElementById("assignmentList").innerHTML = html;

        });

}


/* CREATE ASSIGNMENT */

function createAssignment() {

    fetch(API + "/assignment/create", {

        method: "POST",

        headers: {
            "Content-Type": "application/json",
            authorization: localStorage.getItem("token")
        },

        body: JSON.stringify({

            title: title.value,
            course: course.value,
            due_date: due_date.value,
            description: description.value

        })

    })
        .then(res => res.json())
        .then(data => {

            alert("Assignment Created");
            getAssignments();

        });

}


/* SUBMIT ASSIGNMENT */

function submitAssignment() {

    fetch(API + "/submit", {

        method: "POST",

        headers: {
            "Content-Type": "application/json",
            authorization: localStorage.getItem("token")
        },

        body: JSON.stringify({

            assignment: assignmentId.value,
            answer: answer.value

        })

    })
        .then(res => res.json())
        .then(data => {

            alert("Submitted");
            getMySubmissions();

        });

}


/* STUDENT SUBMISSIONS */

function getMySubmissions() {

    fetch(API + "/mysubmissions", {

        headers: {
            authorization: localStorage.getItem("token")
        }

    })
        .then(res => res.json())
        .then(data => {

            let html = "";

            data.forEach(s => {

                html += `
<div class="assignment">
Assignment: ${s.assignment.title}
<br>
Status: ${s.status}
</div>
`;

            });

            document.getElementById("submissionList").innerHTML = html;

        });

}


/* FACULTY VIEW SUBMISSIONS */

function getSubmissions() {

    fetch(API + "/submissions", {

        headers: {
            authorization: localStorage.getItem("token")
        }

    })
        .then(res => res.json())
        .then(data => {

            let html = "";

            data.forEach(s => {

                html += `
<div class="assignment">
Student: ${s.student.username}
<br>
Assignment: ${s.assignment.title}
<br>
Answer: ${s.answer}
<br>
Status: ${s.status}
</div>
`;

            });

            document.getElementById("submissionList").innerHTML = html;

        });

}