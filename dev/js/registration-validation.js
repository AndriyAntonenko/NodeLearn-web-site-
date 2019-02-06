let validationObj = {
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    passwordRepeated: false
};

let formValid = false;
const button = document.body.querySelector(".btn-registration");
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const email = document.getElementById('email');
const password = document.getElementById('password');
const passwordRepeated = document.getElementById("repeat-password");


let errorMessage = document.createElement('div');
errorMessage.hidden = true;
errorMessage.className = "error-message";
document.body.appendChild(errorMessage);

function formIsValid() {
    formValid = validationObj.firstName && validationObj.lastName &&
                validationObj.email && validationObj.password &&
                validationObj.passwordRepeated;
    button.disabled = !formValid;
}

function errorMessagePosition(e, name, isValid, errorMes) {
  let coords = e.getBoundingClientRect();
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop ||
                  document.body.scrollTop;
  let scrollLeft = window.pageXOffset || document.documentElement ||
                   document.body.scrollLeft;

  let clientTop = document.documentElement.clientTop ||
                  document.body.clientTop || 0;
  let clientLeft = document.documentElement.clientLeft ||
                   document.body.clientLeft || 0;

  errorMessage.style.top = (coords.top + scrollTop - clientTop - e.offsetHeight - 15) + 'px';
  errorMessage.style.left = coords.left +'px';

  if(isValid) {
    e.style.border = null;
    e.style.background = null;
    errorMessage.innerHTML = "";
    errorMessage.hidden = isValid;
    validationObj[name] = isValid;
  } else {
    e.style.border = "2px solid #FF4328";
    e.style.background = "#FFC4C3";
    errorMessage.innerHTML = errorMes;
    errorMessage.hidden = isValid;
    validationObj[name] = isValid;
  }
}

function nameValid(name, e) {
    if(e.target.value.length < 2) {
      errorMessagePosition(e.target, name, false, "Слишком короткое");
    } else {
      errorMessagePosition(e.target, name, true);
    }

    formIsValid();
}

firstName.oninput = nameValid.bind(this, "firstName");
lastName.oninput = nameValid.bind(this, "lastName");

email.oninput = (e) => {
    if(e.target.value.length < 6) {
        errorMessagePosition(e.target, "email", false, "Email слишком короткий");
    } else if(!~e.target.value.indexOf("@")){
        errorMessagePosition(e.target, "email", false, "Email должен содержать @");
    } else {
        errorMessagePosition(e.target, "email", true);
    }

    formIsValid();
};

password.oninput = (e) => {
    if(!/^[a-zA-Z0-9]+$/.test(e.target.value)) {
      errorMessagePosition(e.target, "password", false, 'Только латинские буквы и цифры');
    } else if(e.target.value.length < 6 || e.target.value.length > 20){
      errorMessagePosition(e.target, "password", false, 'Пароль: 6-20 символов');
    } else {
      errorMessagePosition(e.target, "password", true);
    }

    formIsValid();
};

passwordRepeated.oninput = (e) => {
  if(e.target.value !== document.getElementById("password").value) {
    errorMessagePosition(e.target, "passwordRepeated", false, 'Пароли не совпадают');
  } else if(!validationObj.password){
    errorMessagePosition(e.target, "passwordRepeated", false, 'Пароль: 6-20 символов');
  } else {
    errorMessagePosition(e.target, "passwordRepeated", true);
  }

    formIsValid();
};

button.onclick = (e) => {

  const data = {
    firstName: firstName.value,
    lastName: lastName.value,
    email: email.value,
    password: password.value
  };

  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/api/auth/registration', true);
  xhr.setRequestHeader('Content-Type', 'application/json');

  xhr.onreadystatechange = () => {
    if(xhr.readyState == 4) {

      if(xhr.status != 200) {
        alert(`${xhr.status}: ${xhr.statusText}`);
      } else {
        let response = JSON.parse(xhr.responseText);

        if(!response.ok) {
          errorMessagePosition(document.getElementById(response.field),
                               response.field,
                               false,
                               response.error);
        } else {
          document.location.href = '/';
        }
      }
    }
  };

  xhr.send(JSON.stringify(data));
};
