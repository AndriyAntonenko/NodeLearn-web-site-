const validationObj={email:!1,password:!1};let formValid=!1;const button=document.body.querySelector(".btn-authorization"),email=document.getElementById("email"),password=document.getElementById("password");let errorMessage=document.createElement("div");function formIsValid(){formValid=validationObj.email&&validationObj.password,button.disabled=!formValid}function errorMessagePosition(e,t,o,r){let s=e.getBoundingClientRect(),a=window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop,n=(window.pageXOffset||document.documentElement||document.body.scrollLeft,document.documentElement.clientTop||document.body.clientTop||0);document.documentElement.clientLeft||document.body.clientLeft;errorMessage.style.top=s.top+a-n-e.offsetHeight-15+"px",errorMessage.style.left=s.left+"px",o?(e.style.border=null,e.style.background=null,errorMessage.innerHTML="",errorMessage.hidden=o,validationObj[t]=o):(e.style.border="2px solid #FF4328",e.style.background="#FFC4C3",errorMessage.innerHTML=r,errorMessage.hidden=o,validationObj[t]=o)}errorMessage.className="error-message",errorMessage.hidden=!0,document.body.appendChild(errorMessage),email.oninput=(e=>{e.target.value.length<6?errorMessagePosition(e.target,"email",!1,"Email слишком короткий"):~e.target.value.indexOf("@")?errorMessagePosition(e.target,"email",!0):errorMessagePosition(e.target,"email",!1,"Email должен содержать @"),formIsValid()}),password.oninput=(e=>{/^[a-zA-Z0-9]+$/.test(e.target.value)?e.target.value.length<6||e.target.value.length>20?errorMessagePosition(e.target,"password",!1,"Пароль: 6-20 символов"):errorMessagePosition(e.target,"password",!0):errorMessagePosition(e.target,"password",!1,"Только латинские буквы и цифры"),formIsValid()}),button.onclick=(e=>{const t={email:email.value,password:password.value},o=new XMLHttpRequest;o.open("POST","/api/auth/authorization",!0),o.setRequestHeader("Content-Type","application/json"),o.onreadystatechange=(()=>{if(4==o.readyState)if(200!=o.status)alert(`${o.status}: ${o.statusText}`);else{console.log(o.responseText);let e=JSON.parse(o.responseText);console.log(e),e.ok?document.location.href="/":errorMessagePosition(document.getElementById(e.field),e.field,!1,e.error)}}),o.send(JSON.stringify(t))});