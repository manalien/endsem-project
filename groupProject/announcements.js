document.addEventListener('DOMContentLoaded', () => {
  const newButton = document.querySelector('.announcements-button');
  const inputForm = document.querySelector('.input-form');
  const inputField = document.querySelector('.announcement-input');
  const announcementsMain = document.querySelector('.announcements-main');

  // Show input form
  newButton.addEventListener('click', () => {
    inputForm.style.display = 'block';
    inputField.focus();
  });

  // Add new announcement on Enter
  inputField.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const text = inputField.value.trim();
      if (text !== '') {
        const p = document.createElement('p');
        p.classList.add('announcement-item');

        // Create the pin image
        const pinImg = document.createElement('img');
        pinImg.src = './icons/pin-icon.svg'; // 🔁 REPLACE with actual path to your pin image
        pinImg.alt = 'Pin';
        pinImg.className = 'pin-icon';

        // Create the text span
        const span = document.createElement('span');
        span.textContent = text;
        span.classList.add('announcement-text');

        // Append both to the <p>
        p.appendChild(pinImg);
        p.appendChild(span);

        // Append the announcement to the main container
        announcementsMain.appendChild(p);

        inputField.value = '';
        inputForm.style.display = 'none';
      }
    }
  });

  // Hide input form if clicked outside
  document.addEventListener('click', (e) => {
    if (
      inputForm.style.display === 'block' &&
      !inputForm.contains(e.target) &&
      e.target !== newButton
    ) {
      inputForm.style.display = 'none';
      inputField.value = '';
    }
  });

  // Inline editing of announcements
  
  announcementsMain.addEventListener('click', (e) => {
    const span = e.target.closest('span');
    if (!span || span.isContentEditable) return;

    const originalText = span.textContent;
    span.contentEditable = true;
    span.classList.add('editing');
    span.focus();

    const finish = () => {
      span.contentEditable = false;
      span.classList.remove('editing');
      span.removeEventListener('blur', finish);
      span.removeEventListener('keydown', handleKey);
    };

    const handleKey = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        finish();
      } else if (e.key === 'Escape') {
        span.textContent = originalText;
        finish();
      }
    };

    span.addEventListener('blur', finish);
    span.addEventListener('keydown', handleKey);
  });


  function createAnnouncement(text) {
    const announcementItem = document.createElement("div");
    announcementItem.classList.add("announcement-item");
  
    const pin = document.createElement("img");
    pin.src = "pin.png"; // Make sure this path is correct
    pin.alt = "Pin";
    pin.classList.add("pin-icon");
  
    const p = document.createElement("p");
    p.textContent = text;
    p.classList.add("editable-text");
  
    // Make paragraph editable on click
    p.addEventListener("click", function () {
      const input = document.createElement("input");
      input.type = "text";
      input.value = p.textContent;
      input.classList.add("editable-input");
  
      p.replaceWith(input);
      input.focus();
  
      input.addEventListener("blur", function () {
        p.textContent = input.value;
        input.replaceWith(p);
      });
  
      input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          input.blur();
        }
      });
    });
  
    announcementItem.appendChild(pin);
    announcementItem.appendChild(p);
  
    document.getElementById("announcements").appendChild(announcementItem);
  }
  
});
