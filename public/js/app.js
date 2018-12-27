'use strict'

//Open Login Form
function logIn() {
    $('.loginRegister').on('click', '#login', function () {
        $('.loginRegister').html(logInTemplate());
        $('.loginRegister').addClass("box-structure");
    });
}

//Open Registration Form
function signUp () {
    $('.loginRegister').on( 'click', '#signUp', function() {
        $('.loginRegister').html(signUpTemplate());
        $('.loginRegister').addClass("box-structure");
    });
}

//Create login form
function logInTemplate() {
    return `<form class="loginForm" autocomplete="on">
        <div class="loginError"></div>
        <legend class="loginRegisterTitle">Glad you came back!</legend>
        <label for="username">USERNAME:</label>
        <input class="usernameLogIn" type="text" name="username" required>
        <br>
        <label for="password">PASSWORD:</label>
        <input class="passwordLogIn" type="password" name="password" required>
        <br>
        <button class="loginButton signingInAcc" type="submit">Submit</button>
</form>
<a href="#" id="signUp"><p class="toggleReg">Sign Up!</p></a>`;
}

//Create Sign Up Registration Form
function signUpTemplate() {
    return `<form class="signUpForm" autocomplete="on">
         <div class="loginError"></div>
         <legend class="loginRegisterTitle">Welcome, aboard!</legend>
         <label for="username">USERNAME:</label>
         <input class="usernameSignUp" type="text" name="username" pattern=".{1,}" required title="1 characters minimum" required>
         <br>
         <label for="password">PASSWORD:</label>
         <input class="passwordSignUp" type="password" name="password" pattern=".{10, 72}" required title="10 characters minimum" required>
         <br>
         <label for="firstName">FIRST NAME:</label>
         <input class="firstnameSignUp" type="text" name="firstName" required>
         <br>
         <label for="lastName">LAST NAME:</label>
         <input class="lastnameSignUp" type="text" name="lastName" required>
         <br>
         <label for="email">EMAIL:</label>
         <input class="emailSignUp" type="email" name="email" required>
         <br>
         <button class="loginButton signingUpNewAccount" type="submit">Submit</button>
    </form>
    <a href="#" id="login"><p class="toggleReg">Login!</p></a>`;
}

//Authenticate Username and Password for Login
function signInAuth() {
    $('.loginRegister').on('click', '.signingInAcc', function(event) {
        event.preventDefault();
        const username = $('.usernameLogIn').val();
        const password = $('.passwordLogIn').val();
        postAuthLogin(username, password);
    });
}

//Make POST request to authenticate username and password login
function postAuthLogin(username, password) {
    $.ajax({
        type: "POST",
        url: '/api/auth/login',
        data: JSON.stringify({
            "username": username,
            "password": password
        }),
        dataType: 'json',
        contentType: "application/json",
        error: error => {
            console.log(error);
            if(error.responseText === 'Unauthorized'){
                $('.loginError').text('The username or password you\'ve entered doesn\'t match any account.');
            } else {
                $('.loginError').text('Username/password error');
            }
        }
    })
    .done(function(json) {
        window.sessionStorage.accessToken = json.authToken;
        localStorage.setItem('userId', json.userId);
        window.location = 'vacations.html';
    });
}

//Make POST request to store unique account
function signUpAuth() {
    $('.loginRegister').on('click', '.signingUpNewAccount', function(event) {
        event.preventDefault();
        const username = $('.usernameSignUp').val();
        const password = $('.passwordSignUp').val();
        const firstname = $('.firstnameSignUp').val();
        const lastname = $('.lastnameSignUp').val();
        const email = $('.emailSignUp').val();
        $.ajax({
            type: 'POST',
            url: '/api/users',
            data: JSON.stringify({
                "username": username,
                "password": password,
                "firstName": firstname,
                "lastName": lastname,
                "email": email
            }),
            dataType: 'json',
            contentType: "application/json",
            error: error => {
                console.log(error);
                $('.loginError').text(`${error.responseJSON.location}: ${error.responseJSON.message}`);
            }
        })
        .done(function(json){
            postAuthLogin(username, password);
        });
    });
}

//Function runs demo
function runDemo() {
    const demoUsername = 'Vinnyg2017';
    const demoPassword = 'Pegasus2016';
    $('#liveDemo').on('click', function() {
        postAuthLogin(demoUsername, demoPassword);
    });
}

//Create a function to call Signup and Login functions 
function indexPage() {
    logIn();
    signUp();
    signInAuth();
    signUpAuth();
    runDemo();
}

//Use jQuery to call indexPage function
$(indexPage());
