const createAccountButton = document.getElementById('createAccountButton');
const signInButton = document.getElementById('signInButton');
const signUpButton = document.getElementById('signUpButton');

createAccountButton.addEventListener('click', function() {
    window.location.href = 'register.html';
});

signInButton.addEventListener('click', function() {
    window.location.href = 'donor_home.html';
});

signUpButton.addEventListener('click', function(){
    window.location.href = 'login.html';
});

