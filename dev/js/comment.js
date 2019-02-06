let commentForm;
let parent = null;

let errorMessage = document.createElement('div');
errorMessage.className = "error-message";
errorMessage.hidden = true;
document.body.appendChild(errorMessage);

function formIsValid() {
    formValid = validationObj.email && validationObj.password;
    button.disabled = !formValid;
}

function errorMessagePosition(e, isValid, errorMes) {
  let coords = e.getBoundingClientRect();
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop ||
                  document.body.scrollTop;
  let scrollLeft = window.pageXOffset || document.documentElement ||
                   document.body.scrollLeft;

  let clientTop = document.documentElement.clientTop ||
                  document.body.clientTop || 0;
  let clientLeft = document.documentElement.clientLeft ||
                   document.body.clientLeft || 0;

  errorMessage.style.top = (coords.top + scrollTop - clientTop - e.offsetHeight + 40) + 'px';
  errorMessage.style.left = coords.left +'px';

  if(isValid) {
    errorMessage.innerHTML = "";
    errorMessage.hidden = isValid;
  } else {
    errorMessage.innerHTML = errorMes;
    errorMessage.hidden = isValid;
  }
}

function insertAfter(elem, refElem) {
  return refElem.parentNode.insertBefore(elem, refElem.nextSibling);
}

// new
document.getElementById('new').onclick = (e) => {
  if(commentForm) {
    commentForm.parentNode.removeChild(commentForm);
  }
  parent = null;

  commentForm = document.createElement('form');
  commentForm.className = "comment-text";
  commentForm.innerHTML = `<textarea name="body"></textarea>
                           <div class="comment-buttons">
                           <button class="cancel">Отмена</button>
                           <button class="send">Отправить</button>
                           </div>`;
  document.querySelector('.comments').appendChild(commentForm);
  insertAfter(commentForm, e.target);

  commentForm.style.display = "block";
};

document.body.onclick = (e) => {
  if(e.target.className === 'cancel') {

    errorMessagePosition(commentForm.querySelector('textarea'), true);

    if(commentForm) {
      commentForm.parentNode.removeChild(commentForm);
      commentForm = null;
    }
  }

  if(e.target.id === 'reply') {
    if(commentForm) {
      commentForm.parentNode.removeChild(commentForm);
    }
    parent = null;

    commentForm = document.createElement('form');
    commentForm.className = "comment-text";
    commentForm.innerHTML = `<textarea name="body"></textarea>
                             <div class="comment-buttons">
                             <button class="cancel">Отмена</button>
                             <button class="send">Отправить</button>
                             </div>`;

    insertAfter(commentForm, e.target.parentNode);

    commentForm.style.display = "block";
    parent = e.target.parentNode.id;
  }

  if(e.target.className === 'send') {
    e.preventDefault();

    if(!commentForm.querySelector('textarea').value.length) {
      errorMessagePosition(commentForm.querySelector('textarea'), false, `Напишите что-то`);
    } else {
      const data = {
        post: document.body.querySelector('.comments').id,
        body: commentForm.querySelector('textarea').value,
        parent
      };

      let xhr = new XMLHttpRequest();
      xhr.open('POST', '/comment/add', true);
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.onreadystatechange = () => {
        if(xhr.readyState == 4) {

          if(xhr.status != 200) {
            alert(`${xhr.status}: ${xhr.statusText}`);
          } else {
            console.log(xhr.responseText);
            let response = JSON.parse(xhr.responseText);
            if (response.ok) {
              let newComment = document.createElement('ul');
              newComment.innerHTML =
              `<li id=${response.id}><div class="head"><a href="/users/${response.url}">
               ${response.name}</a>
               <small class="date">Только что</small></div>
               ${response.body}<span id="reply">Ответить</span></li>`;

               insertAfter(newComment, commentForm);
               commentForm.style.display = 'none';
            } else {
              document.location.href = '/authorization';
            }

          }
        }
      };

      xhr.send(JSON.stringify(data));
    }
  }
};
