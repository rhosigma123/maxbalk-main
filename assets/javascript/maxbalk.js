let menuIcon = document.querySelector(".menuIcon");
let nav = document.querySelector(".overlay-menu");

menuIcon.addEventListener("click", () => {
  if (nav.style.transform != "translateX(0%)") {
    nav.style.transform = "translateX(0%)";
    nav.style.transition = "transform 0.2s ease-out";
  } else {
    nav.style.transform = "translateX(-100%)";
    nav.style.transition = "transform 0.2s ease-out";
  }
});

let toggleIcon = document.querySelector(".menuIcon");

toggleIcon.addEventListener("click", () => {
  if (toggleIcon.className != "menuIcon toggle") {
    toggleIcon.className += " toggle";
  } else {
    toggleIcon.className = "menuIcon";
  }
});

// ! pagination
const element = document.querySelector(".pagination ul");
let totalPages = 20;
let page = 10;

element.innerHTML = createPagination(totalPages, page);
function createPagination(totalPages, page) {
  let liTag = "";
  let active;
  let beforePage = page - 1;
  let afterPage = page + 1;
  if (page > 1) {
    liTag += `<li class="btn prev" onclick="createPagination(totalPages, ${
      page - 1
    })"><span><i class="fas fa-angle-left"></i> Prev</span></li>`;
  }

  if (page > 2) {
    liTag += `<li class="first numb" onclick="createPagination(totalPages, 1)"><span>1</span></li>`;
    if (page > 3) {
      liTag += `<li class="dots"><span>...</span></li>`;
    }
  }

  if (page == totalPages) {
    beforePage = beforePage - 2;
  } else if (page == totalPages - 1) {
    beforePage = beforePage - 1;
  }
  if (page == 1) {
    afterPage = afterPage + 2;
  } else if (page == 2) {
    afterPage = afterPage + 1;
  }

  for (var plength = beforePage; plength <= afterPage; plength++) {
    if (plength > totalPages) {
      continue;
    }
    if (plength == 0) {
      plength = plength + 1;
    }
    if (page == plength) {
      active = "active";
    } else {
      active = "";
    }
    liTag += `<li class="numb ${active}" onclick="createPagination(totalPages, ${plength})"><span>${plength}</span></li>`;
  }

  if (page < totalPages - 1) {
    if (page < totalPages - 2) {
      liTag += `<li class="dots"><span>...</span></li>`;
    }
    liTag += `<li class="last numb" onclick="createPagination(totalPages, ${totalPages})"><span>${totalPages}</span></li>`;
  }

  if (page < totalPages) {
    liTag += `<li class="btn next" onclick="createPagination(totalPages, ${
      page + 1
    })"><span>Next <i class="fas fa-angle-right"></i></span></li>`;
  }
  element.innerHTML = liTag;
  return liTag;
}
// ! pagination




// ! Form validation
function validateName() {
  console.log("Aladdin")
  var nameInput = document.getElementById("name");
  var nameError = document.getElementById("nameError");
  var name = nameInput.value;

  nameInput.classList.remove("error-border");
  nameError.innerHTML = "";

  if (!/^[a-zA-Z\s]+$/.test(name)) {
    nameInput.classList.add("error-border");
    nameError.innerHTML = "Please enter a valid name";
    return false
  }
  return true
}

function validateEmail() {
  console.log("Aladdin")
  var emailInput = document.getElementById("email");
  var emailError = document.getElementById("emailError");
  var email = emailInput.value;

  emailInput.classList.remove("error-border");
  emailError.innerHTML = "";

  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    emailInput.classList.add("error-border");
    emailError.innerHTML = "Please enter a valid email address";
    return false
  }
  return true
}

function validatePhone() {
  var phoneInput = document.getElementById("phone");
  var phoneError = document.getElementById("phoneError");
  var phone = phoneInput.value;

  phoneInput.classList.remove("error-border");
  phoneError.innerHTML = "";

  if (phone.length < 7 || phone.length > 15) {
    phoneInput.classList.add("error-border");
    phoneError.innerHTML = "Please enter a valid phone number (7 to 15 digits)";
    return false;
  }
  return true
}

function validateFile() {
  var fileInput = document.getElementById("resume");
  var fileError = document.getElementById("fileError");
  var file = fileInput.files[0];

  fileError.innerHTML = "";

  if (!file) {
    fileError.innerHTML = "Please select a file";
    fileInput.classList.add("error-border");
    return false;
  }

  var fileType = file.type;

  if (
    fileType === "application/pdf" ||
    fileType === "application/msword" ||
    fileType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    fileError.innerHTML = "";
    fileInput.classList.remove("error-border");
    return true;
  } else {
    fileError.innerHTML = "Please select a PDF, DOC, or DOCX file";
    fileInput.classList.add("error-border");
    return false;
  }
}

function handleFormSubmit(event, formId){
event.preventDefault();
const form = document.getElementById(formId);
const submitBtn = document.querySelector(`#${formId} .submit-btn`);
submitBtn.disabled = true;
const formAction = form.getAttribute('action');
if (formId == 'career-form'){
  result = validateEmail() && validatePhone() && validateName() && validateFile()
}else {
  result = validateEmail() && validatePhone() && validateName()
}
if (result){
  grecaptcha.ready(function() {
    grecaptcha.execute('6LcIvFYpAAAAAP4z9iSZRtJG9NXIBqXCHReZuF6_', {action: 'submit'}).then(function(token) {
      const formData = new FormData(form);
      formData.append('token', token);
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${formAction}`, true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

      xhr.onreadystatechange = function () {
        const mess = document.querySelector(`#${formId} .form-message`);
        mess.textContent = xhr.responseText
        if (xhr.readyState === 4 && xhr.status === 200) {
          mess.style.display = "block";
          mess.style.color = "#75c004";

          form.reset();
          submitBtn.disabled = false;
        } else if (xhr.readyState === 4) {
          mess.style.display = "block";
          mess.style.color = "red";

          submitBtn.disabled = false;
        }
      };
      xhr.send(new URLSearchParams(formData));
    });
  });
  }else{
      const mess = document.querySelector(`#${formId} .form-message`);
      mess.textContent = "Fill all the fields properly before submitting the form";
      mess.style.display = "block";
      mess.style.color = "red";
      submitBtn.disabled = false;
  }
}
