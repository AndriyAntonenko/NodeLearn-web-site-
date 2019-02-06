const editor = new MediumEditor('#post-body', {
  toolbar: {
      buttons: ['bold', 'italic', 'h3', 'h2', 'underline', 'anchor', 'quote',
      {
        name: 'pre',
        action: 'append-pre',
        aria: 'code',
        tagNames: ['pre'],
        contentDefault: 'JS',
        classList: ['custom-class-pre']
      }]
  },
  placeholder: {
    text: 'Текст статьи',
    hideOnClick: true
  }
});

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

document.getElementById('post-title').oninput = errorMessageHidden.bind(null, document.getElementById('post-title'));
document.getElementById('description').oninput = errorMessageHidden.bind(null, document.getElementById('description'));
document.getElementById('post-body').oninput = errorMessageHidden.bind(null, document.getElementById('post-body'));

document.getElementById('add-img').onclick = (e) => {
  e.preventDefault();
  document.getElementById('add-img-form').hidden = false;
};

document.getElementById('file').oninput = function(e) {
  e.preventDefault();
  errorMessageHidden(null);

  let formData = new FormData();
  formData.append('postId', document.getElementById('post-id').value);
  formData.append('file', e.target.files[0]);

  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/upload/image', true);

  xhr.onreadystatechange = () => {
    if(xhr.readyState == 4) {
      if(xhr.status != 200) {
        alert(`${xhr.status}: ${xhr.statusText}`);
      } else {
        const response = JSON.parse(xhr.responseText);
        if(response.ok) {
          let img = document.createElement('img');
          img.src = `images/${response.filePath}`;
          img.alt = 'Your image';
          document.body.querySelector('.img-added').appendChild(img);
        } else {
          errorMessagePosition(document.getElementById('fileinfo'), 'fileinfo', response.error);
        }
      }
    }
  };

  xhr.send(formData);
};

document.getElementById('btn-add').onclick = (e) => {
  e.preventDefault();
  document.getElementById('post-title').style = null;
  document.getElementById('description').style = null;
  document.getElementById('post-body').style = null;

  let data = {
    id: document.getElementById('post-id').value,
    title: document.getElementById('post-title').value,
    description: document.getElementById('description').value,
    body: document.getElementById('post-body').innerHTML
  };

  if(data.title.length < 3 || data.title.length > 64) {
    errorMessagePosition(document.getElementById('post-title'), 'post-title', 'Заголовок 3-64 символа');
  } else if(data.description.length < 75 || data.description.length > 148) {
    errorMessagePosition(document.getElementById('description'), 'description', 'Описание 75-142 символа');
  } else if(data.body.length < 200) {
    errorMessagePosition(document.getElementById('post-body'), 'post-body', 'Тело - не менее 200 символов');
  } else {

  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/post/add', true);
  xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = () => {
      if(xhr.readyState == 4) {

        if(xhr.status != 200) {
          alert(`${xhr.status}: ${xhr.statusText}`);
        } else {
          let response = JSON.parse(xhr.responseText);

          if(!response.ok) {
            alert(response.error);
          } else {
            document.location.href = '/archive/1';
          }
        }
      }
    };

    xhr.send(JSON.stringify(data));
  }
};
