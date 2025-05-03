const courses = {
  "Data Structures": [
    { title: "Arrays and Linked Lists", created: "2024-01-15", lastUpdated: "2024-01-15" },
    { title: "Stacks and Queues", created: "2024-01-20", lastUpdated: "2024-01-20" }
  ],
  "Linear Algebra": [
    { title: "Matrix Operations", created: "2024-02-05", lastUpdated: "2024-02-05" },
    { title: "Vector Spaces", created: "2024-02-10", lastUpdated: "2024-02-10" }
  ],
  "Environmental Science": [
    { title: "Ecosystems", created: "2024-03-01", lastUpdated: "2024-03-01" },
    { title: "Climate Change", created: "2024-03-10", lastUpdated: "2024-03-10" }
  ]
};


  function openModalForCourse(courseName) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-course-title');
    const notesList = document.getElementById('notes-list');
  
    modalTitle.textContent = courseName;
    notesList.innerHTML = ""; // Clear old notes
  
    const notes = courses[courseName] || [];
  
    notes.forEach(note => {
      const row = document.createElement('tr');
      row.innerHTML = 
      `<td class="note-title-cell">
          ${note.title}
          <button class="open-note-btn">OPEN</button>
          <div class="edit-dropdown-container">
              <button class="edit-note-btn">EDIT</button>
              <div class="edit-dropdown">
                  <div class="edit-option rename-option">Rename</div>
                  <div class="edit-option delete-option">Delete</div>
              </div>
          </div>
        </td>
        <td>${note.created}</td>
        <td>${note.lastUpdated}</td>
        `;
      notesList.appendChild(row);
    });
  
    modal.style.display = 'block';
  }


  document.addEventListener('click', function(e) {
    // 1. Toggle the EDIT dropdown menu when clicking the EDIT button
    if (e.target.classList.contains('edit-note-btn')) {
      const dropdown = e.target.nextElementSibling;
      dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
      return; // Stop here so it doesn't immediately close the dropdown
    }
  
    // 2. Rename option clicked
    if (e.target.classList.contains('rename-option')) {
      const cell = e.target.closest('.note-title-cell');
      const titleText = cell.childNodes[0].textContent.trim(); // Get only the text (not buttons)
  
      const input = document.createElement('input');
      input.type = 'text';
      input.value = titleText;
      input.className = 'edit-title-input';
      input.style.width = "90%";
  
      const openBtn = cell.querySelector('.open-note-btn');
      const editContainer = cell.querySelector('.edit-dropdown-container');
  
      // Clear everything inside title cell
      cell.innerHTML = '';
      cell.appendChild(input);
      cell.appendChild(openBtn);
      cell.appendChild(editContainer);
  
      input.focus();
  
      input.addEventListener('blur', function() {
        const newTitle = input.value.trim() || "Untitled";
        cell.insertAdjacentText('afterbegin', newTitle);
        input.remove();
      });
  
      input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          input.blur();
        }
      });
  
      return; // Stop here so it doesn't close dropdown immediately
    }
  
    // 3. Delete option clicked
    if (e.target.classList.contains('delete-option')) {
      const row = e.target.closest('tr');
      row.remove();
      return; // Stop here
    }
  
    // 4. Close any open dropdown if you click outside
    document.querySelectorAll('.edit-dropdown').forEach(dropdown => {
      dropdown.style.display = 'none';
    });
  });
  

document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.querySelector('.grid-container');
    const newPageCard = document.getElementById('new-page-card');
    const addNewButton = document.getElementById('add-new-button');
    const modal = document.getElementById('modal');

    function createNewCard() {
      const newCard = document.createElement('div');
      newCard.className = 'card';
      
      newCard.innerHTML = `
        <div class="card-edit-container">
          <button class="card-edit-btn">⋯</button>
          <div class="card-edit-menu">
            <div class="card-edit-option rename-course">Rename</div>
            <div class="card-edit-option delete-course">Delete</div>
            <div class="card-edit-option change-image">Change Image</div>
          </div>
        </div>
        <img class="card-header-image" src="./pictures/notes-header.jpg">
        <p class="card-topic">
          <input type="text" class="new-course-input" placeholder="Enter course name..." />
        </p>
      `;
    
      gridContainer.insertBefore(newCard, newPageCard);

      // Attach click listener to the 3-dots button inside the new card
      const editButton = newCard.querySelector('.card-edit-btn');
      editButton.addEventListener('click', function(e) {
        e.stopPropagation();
      
        const editMenu = this.nextElementSibling;
      
        // Toggle menu
        if (editMenu.style.display === 'block') {
          editMenu.style.display = 'none';
        } else {
          // Close other open menus
          document.querySelectorAll('.card-edit-menu').forEach(menu => {
            menu.style.display = 'none';
          });
          editMenu.style.display = 'block';
        }
      });

      // Attach click listener to the edit dropdown menu inside the new card
      const editMenu = newCard.querySelector('.card-edit-menu');
      editMenu.addEventListener('click', function(e) {
        e.stopPropagation();
      });

    
      const input = newCard.querySelector('.new-course-input');
      input.focus();
      input.addEventListener('blur', finalizeCourseName);
      input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          input.blur();
        }
      });
    }    
    
    function finalizeCourseName(e) {
      const input = e.target;
      const courseName = input.value.trim() || "Untitled Course";
    
      // Replace the input with normal text
      const parent = input.parentElement;
      parent.innerHTML = courseName;
    }
    
  
    // When you click inside the grid
    gridContainer.addEventListener('click', function(e) {
      const clickedCard = e.target.closest('.card');
  
      if (!clickedCard) return; // Clicked outside any card
  
      if (clickedCard.id === 'new-page-card') {
        // Clicked the "+ New page" card
        createNewCard();
      } else {
        // Clicked any normal card
        modal.style.display = 'block';
      }
    });
  
    // Also handle the "+ New" button on top
    addNewButton.addEventListener('click', createNewCard);

    const modalNewButton = document.querySelector('.modal-button');
    const notesList = document.querySelector('.notes-list'); 

    modalNewButton.addEventListener('click', function () {
      const today = new Date().toISOString().split('T')[0];
      const newRow = document.createElement('tr');
      
      newRow.innerHTML = `
        <td class="note-title-cell">
          New Note
          <button class="open-note-btn">OPEN</button>
          <div class="edit-dropdown-container">
            <button class="edit-note-btn">EDIT</button>
            <div class="edit-dropdown">
              <div class="edit-option rename-option">Rename</div>
              <div class="edit-option delete-option">Delete</div>
            </div>
          </div>
        </td>
        <td>${today}</td>
        <td>${today}</td>
      `;

    
      notesList.appendChild(newRow);
    });


    // Prevent clicks on edit button and menu from opening modal
    document.addEventListener('click', function(e) {
      if (e.target.closest('.card-edit-container')) {
        e.stopPropagation(); // STOP event before reaching card
      }
    });

    document.querySelectorAll('.card').forEach(card => {
      if (card.id !== 'new-page-card') {
        card.addEventListener('click', function() {
          const topicElement = this.querySelector('.card-topic');
          const courseName = topicElement.textContent.trim();
          openModalForCourse(courseName);
        });
      }
    });
  
    // NEW: Prevent clicks on Edit button and Edit menu from bubbling
    document.querySelectorAll('.card-edit-btn').forEach(button => {
      button.addEventListener('click', function(e) {
        e.stopPropagation(); // STOP bubbling
      });
    });
  
    document.querySelectorAll('.card-edit-menu').forEach(menu => {
      menu.addEventListener('click', function(e) {
        e.stopPropagation(); // STOP bubbling
      });
    });

    // Toggle the edit menu when clicking the 3 dots
    document.querySelectorAll('.card-edit-btn').forEach(button => {
      button.addEventListener('click', function(e) {
        e.stopPropagation(); // STOP event bubbling
      
        const editMenu = this.nextElementSibling; // Assuming .card-edit-menu is right after button
      
        if (editMenu.style.display === 'block') {
          editMenu.style.display = 'none';
        } else {
          // Close any other open menus first
          document.querySelectorAll('.card-edit-menu').forEach(menu => {
            menu.style.display = 'none';
          });
        
          editMenu.style.display = 'block';
        }
      });
    });

    // Also prevent dropdown menu clicks from bubbling
    document.querySelectorAll('.card-edit-menu').forEach(menu => {
      menu.addEventListener('click', function(e) {
        e.stopPropagation();
      });
    });

    // Close any open edit menus when clicking anywhere else
    document.querySelectorAll('.card-edit-btn').forEach(button => {
      button.addEventListener('click', function(e) {
        e.stopPropagation(); // Important
    
        const editMenu = this.nextElementSibling;
    
        // Close other menus first
        document.querySelectorAll('.card-edit-menu').forEach(menu => {
          menu.style.display = 'none';
        });
    
        // Toggle this menu
        if (editMenu.style.display === 'block') {
          editMenu.style.display = 'none';
        } else {
          editMenu.style.display = 'block';
    
          // 🔥 Attach listeners each time menu opens
          attachDropdownListeners(editMenu);
        }
      });
    });
    


    // Handle clicks on the Edit Menu options
    document.addEventListener('click', function(e) {
      if (e.target.classList.contains('rename-course')) {
        // 🔥 Rename option clicked
        const card = e.target.closest('.card');
        const topicElement = card.querySelector('.card-topic');
      
        const currentTitle = topicElement.textContent.trim();
        topicElement.innerHTML = `
          <input type="text" class="new-course-input" value="${currentTitle}" />
        `;

        const input = topicElement.querySelector('.new-course-input');
        input.focus();
      
        input.addEventListener('blur', function() {
          const newTitle = input.value.trim() || "Untitled";
          topicElement.textContent = newTitle;
        });
      
        input.addEventListener('keypress', function(event) {
          if (event.key === 'Enter') {
            input.blur();
          }
        });
      
      } else if (e.target.classList.contains('delete-course')) {
        // Delete option clicked
        const card = e.target.closest('.card');
        card.remove();
      
      } else if (e.target.classList.contains('change-image')) {
        // Change Image option clicked
        const card = e.target.closest('.card');
        const imageElement = card.querySelector('.card-header-image');
      
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
      
        fileInput.addEventListener('change', function() {
          const file = fileInput.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
              imageElement.src = event.target.result;
            };
            reader.readAsDataURL(file);
          }
        });
      
        document.body.appendChild(fileInput);
        fileInput.click();
        document.body.removeChild(fileInput);
      }
    });


    function attachDropdownListeners(editMenu) {
      const renameBtn = editMenu.querySelector('.rename-course');
      const deleteBtn = editMenu.querySelector('.delete-course');
      const changeImageBtn = editMenu.querySelector('.change-image');
    
      renameBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        const card = this.closest('.card');
        const topicElement = card.querySelector('.card-topic');
    
        const currentTitle = topicElement.textContent.trim();
        topicElement.innerHTML = `
          <input type="text" class="new-course-input" value="${currentTitle}" />
        `;
    
        const input = topicElement.querySelector('.new-course-input');
        input.focus();
        input.addEventListener('blur', function() {
          const newTitle = input.value.trim() || "Untitled";
          topicElement.textContent = newTitle;
        });
    
        input.addEventListener('keypress', function(event) {
          if (event.key === 'Enter') {
            input.blur();
          }
        });
    
        // Close menu after action
        editMenu.style.display = 'none';
      });
    
      deleteBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        const card = this.closest('.card');
        card.remove();
      });
    
      changeImageBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        const card = this.closest('.card');
        const imageElement = card.querySelector('.card-header-image');
    
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
    
        fileInput.addEventListener('change', function() {
          const file = fileInput.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
              imageElement.src = event.target.result;
            };
            reader.readAsDataURL(file);
          }
        });
    
        document.body.appendChild(fileInput);
        fileInput.click();
        document.body.removeChild(fileInput);
    
        // Close menu after action
        editMenu.style.display = 'none';
      });
    }
    
    
});
    
  