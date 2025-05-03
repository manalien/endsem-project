// ----------------- Local Storage Helpers -----------------

function saveQuickNote(note) {
  let notes = JSON.parse(localStorage.getItem("todo-list")) || [];
  notes.push(note);
  localStorage.setItem("todo-list", JSON.stringify(notes));
}

function getQuickNotes() {
  return JSON.parse(localStorage.getItem("todo-list")) || [];
}

function saveEvent(eventName, eventDate) {
  let events = JSON.parse(localStorage.getItem("calendarEvents")) || [];
  const event = { name: eventName, date: eventDate, alerted: false };
  events.push(event);
  localStorage.setItem("calendarEvents", JSON.stringify(events));
}

function getEvents() {
  return JSON.parse(localStorage.getItem("calendarEvents")) || [];
}

function saveCourses() {
  localStorage.setItem('courses', JSON.stringify(courses));
}

function getCourses() {
  return JSON.parse(localStorage.getItem('courses')) || [];
}

// ----------------- Calendar and Notes Setup -----------------

document.addEventListener('DOMContentLoaded', function() {
  // Setup Calendar
  var calendarEl = document.getElementById('calendar');
  var calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      dateClick: function(info) {
          var eventName = prompt("Enter event name:");
          if (eventName) {
              calendar.addEvent({
                  title: eventName,
                  start: info.dateStr,
                  allDay: true
              });
              saveEvent(eventName, info.dateStr);
          }
      },
      eventClick: function(info) {
          if (confirm(`Delete event: "${info.event.title}"?`)) {
              info.event.remove();
              let events = getEvents();
              events = events.filter(event => !(event.name === info.event.title && event.date === info.event.startStr));
              localStorage.setItem("calendarEvents", JSON.stringify(events));
          }
      },
      eventDidMount: function(info) {
          info.el.classList.add('custom-event');
      }
  });

  var savedEvents = getEvents();
  savedEvents.forEach(function(event) {
      calendar.addEvent({
          title: event.name,
          start: event.date,
          allDay: true
      });
  });

  calendar.render();

  // Setup Quick Notes
  const quickNoteInput = document.getElementById('quickNoteInput');
  const notes = getQuickNotes();
  if (notes.length > 0) {
      quickNoteInput.value = notes[notes.length - 1];
  } else {
      quickNoteInput.placeholder = "Write down your quick notes...";
  }

  quickNoteInput.addEventListener('input', function() {
      let noteText = quickNoteInput.value;
      saveQuickNote(noteText);
  });

  // Setup Countdown Timer
  const originalDate = new Date("2025-05-17");
  let holidayDate = new Date(originalDate);

  function updateDaysLeft() {
      const now = new Date();
      const timeDiff = holidayDate - now;
      const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      const daysLeftElement = document.getElementById("daysLeft");
      const semesterHeading = document.getElementById("semesterHeading");

      daysLeftElement.textContent = daysLeft;
      semesterHeading.textContent = daysLeft <= 0 ? "Enjoy Your Break!" : "Days Until Break:";

      if (daysLeft <= 0) {
          launchPastelConfetti();
      }
  }

  window.adjustDays = function(amount) {
      holidayDate.setDate(holidayDate.getDate() + amount);
      updateDaysLeft();
  }

  updateDaysLeft();

  function launchPastelConfetti() {
      confetti({
          particleCount: 900,
          spread: 100,
          startVelocity: 50,
          origin: { y: 0.6 },
          colors: ['#ffb3c6', '#ffc9de', '#bff0d4', '#f9f3a9', '#bae1ff'],
          scalar: 1.2
      });
  }
});

// ----------------- Course Page Setup -----------------

let courses = getCourses();
if (courses.length === 0) {
  courses = [
      { title: "Data Structures", code: "BIOL 101", image: "header-icon.jpg" },
      { title: "Discrete Mathematics", code: "CHEM 105", image: "header-icon.jpg" },
      { title: "System Programming", code: "MATH 120", image: "header-icon.jpg" }
  ];
  saveCourses();
}

function renderCourses() {
  const coursesGrid = document.querySelector('.courses-grid');
  coursesGrid.innerHTML = '';  // Clear existing courses

  courses.forEach((course, index) => {
      const card = document.createElement('div');
      card.classList.add('course-card');
      card.innerHTML = `
          <img src="${course.image}" alt="${course.title}">
          <div class="course-info">
              <h2>${course.title}</h2>
              <p>${course.code}</p>
          </div>
          <button class="edit-button" data-index="${index}">Edit</button>
          <div class="dropdown" id="dropdown-${index}">
              <button class="dropdown-toggle"></button>
              <div class="dropdown-menu">
                  <button class="rename-course" data-index="${index}">Change Course Name</button>
                  <button class="change-code" data-index="${index}">Change Course Code</button>
                  <button class="delete-course" data-index="${index}">Delete Course</button>
              </div>
          </div>
      `;
      card.addEventListener('click', () => openCourseModal(course.title, course.code, course.image));
      coursesGrid.appendChild(card);
  });

  // Attach edit button functionality
  document.querySelectorAll('.edit-button').forEach(button => {
      button.addEventListener('click', function(event) {
          event.stopPropagation(); // Prevent triggering card click
          const index = this.getAttribute('data-index');
          const dropdown = document.getElementById(`dropdown-${index}`);
          dropdown.classList.toggle('show');
      });
  });

  // Attach rename, change code, and delete functionality
  document.querySelectorAll('.rename-course').forEach(button => {
      button.addEventListener('click', function(event) {
          event.stopPropagation(); // Stop modal from opening
          const index = this.getAttribute('data-index');
          const newName = prompt('Enter new course name:', courses[index].title);
          if (newName) {
              courses[index].title = newName;
              saveCourses();
              renderCourses();
          }
      });
  });

  document.querySelectorAll('.change-code').forEach(button => {
      button.addEventListener('click', function(event) {
          event.stopPropagation(); // Stop modal from opening
          const index = this.getAttribute('data-index');
          const newCode = prompt('Enter new course code:', courses[index].code);
          if (newCode) {
              courses[index].code = newCode;
              saveCourses();
              renderCourses();
          }
      });
  });

  document.querySelectorAll('.delete-course').forEach(button => {
      button.addEventListener('click', function(event) {
          event.stopPropagation(); // Stop modal from opening
          const index = this.getAttribute('data-index');
          if (confirm('Are you sure you want to delete this course permanently?')) {
              courses.splice(index, 1);
              saveCourses();
              renderCourses();
          }
      });
  });
}

document.getElementById('newPageBtn').addEventListener('click', function() {
  const newCourse = { title: "New Course", code: "NEW 123", image: "header-icon.jpg" };
  courses.push(newCourse);
  saveCourses();
  renderCourses();
});

const modal = document.getElementById('courseModal');
const modalTitle = document.getElementById('modalTitle');
const modalCode = document.getElementById('modalCode');
const modalImage = document.getElementById('modalImage');
const closeButton = document.querySelector('.close-button');

function openCourseModal(title, code, imageSrc) {
  modalTitle.innerText = title;
  modalCode.innerText = code;
  modalImage.src = imageSrc || 'header-icon.jpg';
  modal.style.display = 'block';
}

closeButton.onclick = function() {
  modal.style.display = 'none';
}

window.onclick = function(event) {
  if (event.target == modal) {
      modal.style.display = 'none';
  }
}

renderCourses();

// ----------------- Assignment Setup -----------------

let assignments = JSON.parse(localStorage.getItem('assignments')) || [];

function saveAssignments() {
  localStorage.setItem('assignments', JSON.stringify(assignments));
}

function renderAssignments() {
  const list = document.getElementById('assignmentList');
  list.innerHTML = '';

  if (assignments.length === 0) {
      list.innerHTML = "<p style='text-align: center; font-size: 18px; color: #fff; font-family: Plus Jakarta Sans;'>No assignments yet!</p>";
      return;
  }

  assignments.forEach((a, index) => {
      const assignmentDiv = document.createElement('div');
      assignmentDiv.classList.add('assignment-card');
      assignmentDiv.style.position = 'relative';

      assignmentDiv.innerHTML = `
          <div style="padding-right: 60px;">
              <h4>${a.name}</h4>
              <p><strong>Due:</strong> ${new Date(a.deadline).toLocaleDateString()}</p>
              <p>Status: <span class="status-toggle ${a.completed ? 'completed' : 'not-completed'}" data-index="${index}">
                  ${a.completed ? 'Completed' : 'Not Completed'}
              </span></p>
          </div>
          <button class="delete-assignment" data-index="${index}">✖</button>
      `;

      list.appendChild(assignmentDiv);
  });

  document.querySelectorAll('.status-toggle').forEach(span => {
      span.addEventListener('click', function() {
          const index = this.getAttribute('data-index');
          assignments[index].completed = !assignments[index].completed;
          saveAssignments();
          renderAssignments();
      });
  });

  document.querySelectorAll('.delete-assignment').forEach(button => {
      button.addEventListener('click', function() {
          const index = this.getAttribute('data-index');
          assignments.splice(index, 1);
          saveAssignments();
          renderAssignments();
      });
  });
}

document.getElementById('addAssignmentBtn').addEventListener('click', function() {
  const name = document.getElementById('assignmentName').value.trim();
  const deadline = document.getElementById('assignmentDeadline').value;
  const completed = document.getElementById('assignmentCompleted').checked;

  if (name && deadline) {
      const assignment = { name, deadline, completed };
      assignments.push(assignment);
      saveAssignments();
      renderAssignments();

      document.getElementById('assignmentName').value = '';
      document.getElementById('assignmentDeadline').value = '';
      document.getElementById('assignmentCompleted').checked = false;
  } else {
      alert('Please fill out both name and deadline!');
  }
});

renderAssignments();

let classroomLinks = [];
let bookPdfLinks = [];

// Get existing classroom links and book PDF links from localStorage if available
function loadLinksFromStorage() {
    classroomLinks = JSON.parse(localStorage.getItem('classroomLinks')) || [];
    bookPdfLinks = JSON.parse(localStorage.getItem('bookPdfLinks')) || [];
}

// Save links to localStorage
function saveLinksToStorage() {
    localStorage.setItem('classroomLinks', JSON.stringify(classroomLinks));
    localStorage.setItem('bookPdfLinks', JSON.stringify(bookPdfLinks));
}

// Render Classroom Links
function renderClassroomLinks() {
    const classroomLinksList = document.getElementById('classroomLinksList');
    classroomLinksList.innerHTML = '';  // Clear existing links

    classroomLinks.forEach(link => {
        const listItem = document.createElement('li');
        const anchor = document.createElement('a');
        anchor.href = link;
        anchor.textContent = link;
        anchor.target = "_blank"; // Opens link in new tab
        listItem.appendChild(anchor);
        classroomLinksList.appendChild(listItem);
    });
}

// Render Book PDF Links
function renderBookPdfLinks() {
    const bookPdfLinksList = document.getElementById('bookPdfLinksList');
    bookPdfLinksList.innerHTML = '';  // Clear existing links

    bookPdfLinks.forEach(link => {
        const listItem = document.createElement('li');
        const anchor = document.createElement('a');
        anchor.href = link;
        anchor.textContent = link;
        anchor.target = "_blank"; // Opens link in new tab
        listItem.appendChild(anchor);
        bookPdfLinksList.appendChild(listItem);
    });
}

// Show Classroom Input
document.getElementById('showClassroomInputBtn').addEventListener('click', function() {
    document.getElementById('classroomInputGroup').classList.toggle('hidden');
});

// Show Book Input
document.getElementById('showBookInputBtn').addEventListener('click', function() {
    document.getElementById('bookInputGroup').classList.toggle('hidden');
});

// Add Classroom Link
document.getElementById('addClassroomLinkBtn').addEventListener('click', function() {
    const classroomLink = document.getElementById('classroomLink').value.trim();
    if (classroomLink && !classroomLinks.includes(classroomLink)) {
        classroomLinks.push(classroomLink);
        saveLinksToStorage();
        renderClassroomLinks();
        document.getElementById('classroomLink').value = '';  // Clear input
        document.getElementById('classroomInputGroup').classList.add('hidden'); // Hide input again
    } else {
        alert("Please enter a valid Google Classroom URL.");
    }
});

// Add Book PDF Link
document.getElementById('addBookPdfBtn').addEventListener('click', function() {
    const bookPdfLink = document.getElementById('bookPdfLink').value.trim();
    if (bookPdfLink && !bookPdfLinks.includes(bookPdfLink)) {
        bookPdfLinks.push(bookPdfLink);
        saveLinksToStorage();
        renderBookPdfLinks();
        document.getElementById('bookPdfLink').value = '';  // Clear input
        document.getElementById('bookInputGroup').classList.add('hidden'); // Hide input again
    } else {
        alert("Please enter a valid PDF link.");
    }
});

// Open the modal and load the links
function openCourseModal(title, code, imageSrc) {
    modalTitle.innerText = title;
    modalCode.innerText = code;
    modalImage.src = imageSrc || 'header-icon.jpg';

    // Load saved links from storage
    loadLinksFromStorage();
    renderClassroomLinks();
    renderBookPdfLinks();

    modal.style.display = 'block';
}

// Close the modal
closeButton.onclick = function() {
    modal.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}
