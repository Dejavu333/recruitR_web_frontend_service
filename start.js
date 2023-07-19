const email = document.querySelector('#e-mail');
const emailConfirm = document.querySelector('#e-mail-confirm');

email.addEventListener('keyup', () => {
    const valid = isValidEmail(email);
    startBtn.disabled = valid === true ? false : true;
});
emailConfirm.addEventListener('keyup', () => {
    const valid = isValidEmail(email);
    startBtn.disabled = valid === true ? false : true;
});

function isValidEmail(email) {
    return !(!email.value || !emailConfirm.value || email.value !== emailConfirm.value ||
        //valid email regex
        !email.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) || !emailConfirm.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/));
}

startBtn.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.setItem('email', email.value);
    window.location.assign('game.html');
});