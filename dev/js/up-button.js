/* eslint-disable no-undef*/
const buttonUp = document.body.querySelector('.button-up');

buttonUp.onclick = () => {
    let scrollingUp = document.documentElement.scrollTop;

    let timer = setInterval(() => {

        if(scrollingUp <= 0) {
            scrollTo(0, 0);
            clearInterval(timer);
        } else {
            scrollingUp = scrollingUp - 80;
            scrollTo(0, scrollingUp);
        }
    }, 20);

};

window.addEventListener("scroll", () => {
    if(document.documentElement.scrollTop >= 100) {
        buttonUp.hidden = false;
    }

    if(document.documentElement.scrollTop < 100) {
        buttonUp.hidden = true;
    }
});
/* eslint-enable no-undef*/
