document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("announcementForm");
    const input = document.getElementById("announcementInput");
    const list = document.getElementById("announcementList");
  
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const text = input.value.trim();
      if (text !== "") {
        addAnnouncement(text);
        input.value = "";
      }
    });
  
    function addAnnouncement(text) {
      const container = document.createElement("div");
      container.className = "announcement-container";
  
      const pin = document.createElement("img");
      pin.src = "pin.png"; // Make sure this is the correct path
      pin.alt = "Pin";
      pin.className = "pin-icon";
  
      const p = document.createElement("p");
      p.className = "announcement-text";
      p.textContent = text;
  
      container.appendChild(pin);
      container.appendChild(p);
      list.appendChild(container);
  
      makeEditable(p);
    }
  
    function makeEditable(element) {
      element.addEventListener("click", function () {
        const currentText = element.textContent;
        const input = document.createElement("input");
        input.type = "text";
        input.value = currentText;
        input.className = "announcement-input";
        element.replaceWith(input);
        input.focus();
  
        input.addEventListener("blur", function () {
          const newText = input.value.trim() || currentText;
          const newP = document.createElement("p");
          newP.className = "announcement-text";
          newP.textContent = newText;
          input.replaceWith(newP);
          makeEditable(newP);
        });
  
        input.addEventListener("keydown", function (e) {
          if (e.key === "Enter") {
            input.blur();
          }
        });
      });
    }
  
    // Initialize existing announcements
    document.querySelectorAll(".announcement-text").forEach(makeEditable);
  });
  