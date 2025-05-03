document.addEventListener('DOMContentLoaded', function () {
    const addRow = document.querySelector('.tasks-section #add-row');
  
    addRow.addEventListener('click', function () {
      const tableBody = document.querySelector('.tasks-table tbody');
  
      const newRow = document.createElement('tr');
      newRow.innerHTML = `
        <td><input type="text" placeholder="Enter task..." class="task-input" /></td>
        <td><span class="status-tag status not-started">● Not started</span></td>
        <td><input type="date" class="date-input" /></td>
        <td>Joyce</td>
        <td>${new Date().toLocaleDateString()}</td>
      `;
  
      const inputField = newRow.querySelector('.task-input');
      const dateInput = newRow.querySelector('.date-input');
  
      // Listen for Enter key
      inputField.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          saveRow();
        }
      });
  
      dateInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          saveRow();
        }
      });
  
      function saveRow() {
        const taskText = inputField.value.trim();
        const dueDate = dateInput.value;
  
        if (!taskText) return; // prevent empty tasks
  
        newRow.innerHTML = `
          <td>${taskText}</td>
          <td><span class="status-tag status not-started">● Not started</span></td>
          <td>${dueDate || '-'}</td>
          <td>Joyce</td>
          <td>${new Date().toLocaleDateString()}</td>
        `;
      }
  
      tableBody.insertBefore(newRow, addRow);
      inputField.focus();
    });
  });
  