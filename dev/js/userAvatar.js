let errorMessage = document.createElement('div');
errorMessage.className = "error-message";
errorMessage.hidden = true;
document.body.appendChild(errorMessage);

function errorMessageHidden(e) {
  if(e) e.style = null;
  errorMessage.hidden = true;
}

function errorMessagePosition(e, name, errorMes) {
  let coords = e.getBoundingClientRect();
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop ||
                  document.body.scrollTop;
  let scrollLeft = window.pageXOffset || document.documentElement ||
                   document.body.scrollLeft;

  let clientTop = document.documentElement.clientTop ||
                  document.body.clientTop || 0;
  let clientLeft = document.documentElement.clientLeft ||
                   document.body.clientLeft || 0;

  errorMessage.style.left = coords.left +'px';
  errorMessage.innerHTML = errorMes;
  errorMessage.hidden = false;
  if(name === 'fileinfo') {
      errorMessage.style.top = (coords.top + scrollTop - clientTop - 50) + 'px';
  } else {
    e.style.border = "2px solid #FF4328";
    e.style.background = "#FFC4C3";
    if(name === 'post-body') {
      errorMessage.style.top = (coords.top + scrollTop - clientTop - 50) + 'px';
    } else {
      errorMessage.style.top = (coords.top + scrollTop - clientTop - e.offsetHeight - 15) + 'px';
    }
  }
}

document.getElementById('show-add-img'). onclick = (e) => {
  e.preventDefault();
  document.getElementById('add-img-form').hidden = !document.getElementById('add-img-form').hidden;
}

document.getElementById('file').oninput = (e) => {
  e.preventDefault();
  errorMessageHidden(null);

  let formData = new FormData();
  formData.append('userId', document.getElementById('user-id').value);
  formData.append('file', e.target.files[0]);

  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/upload/avatar', true);

  xhr.onreadystatechange = () => {
    if(xhr.readyState == 4) {
      if(xhr.status != 200) {
        alert(`${xhr.status}: ${xhr.statusText}`);
      } else {
        const response = JSON.parse(xhr.responseText);
        if(response.ok) {
          location.reload();
        } else {
          errorMessagePosition(document.getElementById('fileinfo'), 'fileinfo', response.error);
        }
      }
    }
  };

  xhr.send(formData);
};
