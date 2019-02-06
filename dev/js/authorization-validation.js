const validationObj = {
  email: false,
  password: false
};
let formValid = false;

const button = document.body.querySelector(".btn-authorization");
const email = document.getElementById('email');
const password = document.getElementById('password');

let errorMessage = document.createElement('div');
errorMessage.className = "error-message";
errorMessage.hidden = true;
document.body.appendChild(errorMessage);

function formIsValid() {
    formValid = validationObj.email && validationObj.password;
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

button.onclick = (e) => {

  const data = {
    email: email.value,
    password: password.value
  };

  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/api/auth/authorization', true);
  xhr.setRequestHeader('Content-Type', 'application/json');

  xhr.onreadystatechange = () => {
    if(xhr.readyState == 4) {

      if(xhr.status != 200) {
        alert(`${xhr.status}: ${xhr.statusText}`);
      } else {
        let response = JSON.parse(xhr.responseText);

        if(!response.ok ) {
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
