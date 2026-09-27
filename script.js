// ============================================
// Student Attendance Management System
// ============================================

// Get students from localStorage
let students = JSON.parse(localStorage.getItem("students")) || [];

// Set today's date
const dateInput = document.getElementById("attendanceDate");

const today = new Date().toISOString().split("T")[0];

dateInput.value = today;


// ============================================
// Save Data
// ============================================

function saveData() {

    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );
}


// ============================================
// Add Student
// ============================================

function addStudent() {

    const rollNumber =
        document.getElementById("rollNumber").value.trim();

    const studentName =
        document.getElementById("studentName").value.trim();

    // Validation
    if (rollNumber === "" || studentName === "") {

        alert("Please enter roll number and student name.");

        return;
    }

    // Check duplicate roll number
    const existingStudent = students.find(
        student => student.rollNumber === rollNumber
    );

    if (existingStudent) {

        alert("A student with this roll number already exists.");

        return;
    }

    // Create student
    const student = {

        id: Date.now(),

        rollNumber: rollNumber,

        name: studentName,

        attendance: {}

    };

    students.push(student);

    saveData();

    // Clear inputs
    document.getElementById("rollNumber").value = "";
    document.getElementById("studentName").value = "";

    displayStudents();

    alert("Student added successfully!");
}


// ============================================
// Mark Attendance
// ============================================

function markAttendance(studentId, status) {

    const date = dateInput.value;

    if (!date) {

        alert("Please select a date.");

        return;
    }

    const student = students.find(
        student => student.id === studentId
    );

    if (!student) return;

    // Save attendance
    student.attendance[date] = status;

    saveData();

    displayStudents();
}


// ============================================
// Calculate Attendance
// ============================================

function calculateAttendance(student) {

    const records = Object.values(student.attendance);

    const totalDays = records.length;

    if (totalDays === 0) {

        return {
            present: 0,
            absent: 0,
            percentage: 0
        };
    }

    const present =
        records.filter(
            status => status === "Present"
        ).length;

    const absent =
        records.filter(
            status => status === "Absent"
        ).length;

    const percentage =
        ((present / totalDays) * 100).toFixed(1);

    return {
        present: present,
        absent: absent,
        percentage: percentage
    };
}


// ============================================
// Delete Student
// ============================================

function deleteStudent(studentId) {

    const confirmation =
        confirm("Are you sure you want to delete this student?");

    if (!confirmation) return;

    students = students.filter(
        student => student.id !== studentId
    );

    saveData();

    displayStudents();
}


// ============================================
// Display Students
// ============================================

function displayStudents() {

    const table =
        document.getElementById("studentTable");

    const searchText =
        document.getElementById("searchStudent")
        .value
        .toLowerCase();

    const selectedDate = dateInput.value;

    table.innerHTML = "";

    // Filter students
    const filteredStudents = students.filter(student =>

        student.name.toLowerCase().includes(searchText) ||

        student.rollNumber.toLowerCase().includes(searchText)

    );

    // No students
    if (filteredStudents.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="8" class="no-students">
                    No students found.
                </td>
            </tr>
        `;

        updateDashboard();

        return;
    }

    // Display each student
    filteredStudents.forEach((student, index) => {

        const attendance =
            calculateAttendance(student);

        const todayStatus =
            student.attendance[selectedDate] || "Not Marked";

        let statusHTML = "";

        if (todayStatus === "Present") {

            statusHTML =
                `<span class="status-present">Present</span>`;

        }
        else if (todayStatus === "Absent") {

            statusHTML =
                `<span class="status-absent">Absent</span>`;

        }
        else {

            statusHTML =
                `<span class="status-not-marked">Not Marked</span>`;
        }

        const row = document.createElement("tr");

        row.innerHTML = `

            <td>${index + 1}</td>

            <td>${student.rollNumber}</td>

            <td>${student.name}</td>

            <td>${attendance.present}</td>

            <td>${attendance.absent}</td>

            <td>
                <strong>${attendance.percentage}%</strong>
            </td>

            <td>
                ${statusHTML}
            </td>

            <td>

                <button
                    class="present-btn"
                    onclick="markAttendance(${student.id}, 'Present')">
                    Present
                </button>

                <button
                    class="absent-btn"
                    onclick="markAttendance(${student.id}, 'Absent')">
                    Absent
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteStudent(${student.id})">
                    Delete
                </button>

            </td>
        `;

        table.appendChild(row);
    });

    updateDashboard();
}


// ============================================
// Update Dashboard
// ============================================

function updateDashboard() {

    const selectedDate = dateInput.value;

    // Total students
    document.getElementById("totalStudents")
        .textContent = students.length;


    // Present today
    const presentCount =
        students.filter(
            student =>
                student.attendance[selectedDate] === "Present"
        ).length;


    // Absent today
    const absentCount =
        students.filter(
            student =>
                student.attendance[selectedDate] === "Absent"
        ).length;


    // Total marked
    const totalMarked =
        presentCount + absentCount;


    // Attendance percentage
    let percentage = 0;

    if (totalMarked > 0) {

        percentage =
            ((presentCount / totalMarked) * 100).toFixed(1);
    }


    document.getElementById("presentToday")
        .textContent = presentCount;


    document.getElementById("absentToday")
        .textContent = absentCount;


    document.getElementById("attendancePercentage")
        .textContent = percentage + "%";
}


// ============================================
// Load Attendance
// ============================================

function loadAttendance() {

    displayStudents();
}


// ============================================
// Initial Display
// ============================================

displayStudents();
