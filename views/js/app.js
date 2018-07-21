function generateSignUp () {
    return `<form autocomplete="on" method="post">
        <fieldset>
            <div class="loginError"></div>
            <legend class="loginRegisterTitle"></legend>
            <label for="username">Username:</label>
            <input class="usernameSignUp" type="text" name="username" pattern=".{1,}" required title="1 characters minimum" required>
            <br>
            <label for="password">Password:</label>
            <input class="passwordSignUp" type="text" name="password" pattern=".{10, 72}" required title="3 characters minimum" required>
            <br>
            <label for="firstName">First Name:</label>
            <input class="firstnameSignUp" type="text" name="firstName" required>
            <br>
            <label for="lastName">Last Name:</label>
            <input class="lastnameSignUp" type="text" name="lastName" required>
            <br>
            <label for="email">Email:</label>
            <input class="emailSignUp" type="email" name="email" required>
            <br>
            <button class="loginButton signingUpNewAccount" type="submit">Submit</button>
            </fieldset>
    </form>
    <a href="#" id="login"><p class="toggleReg">LogIn</p></a>`;
}

function signUp () {
    $('.loginRegister').on('click', '#signUp', function() {
        console.log('clicked!');
        $('.loginRegister').html(generateSignUp());
        $('.loginRegister').addClass("box-structure");
    })
}

function generateLogin() {
    return `<form autocomplete="on" method="post">
            <fieldset>
            <div class="loginError"></div>
            <legend class="loginRegisterTitle">Glad you came back!</legend>
            <label for="username">Username:</label>
            <input class="usernameLogIn" type="text" name="username" required>
            <br>
            <label for="password">Password:</label>
            <input class="passwordLogIn" type="text" name="password" required>
            <br>
            <button class="loginButton signingInAcc" type="submit">Submit</button>
            </fieldset>
    </form>
    <a href="#" id="signUp"><p class="toggleReg">Sign up</p></a>`;
}

function logIn () {
    $('.loginRegister').on('click', '#login', function() {
        $('.loginRegister').html(generateLogin());
        $('.loginRegister').addClass("box-structure");
    })
}

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
            }else {
                $('.loginError').text('Username/password error');
            }
        }
    })
    .done(function(json) {
        window.sessionStorage.accessToken = json.authToken;
        localStorage.setItem('userId', json.userId);
        window.location = '/dashboard.html';
    });
}

function signInAuth() {
    $('.loginRegister').on('click', '.signInAcc', function(event) {
        event.preventDefault();
        const username = $('.usernameLogIn').val();
        const password = $('.passwordLogIn').val();
        postAuthLogin(username, password);
    });
}

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
            error: (xhr, text, error) =>  {
                $('.loginError').text(`${xhr.responseJSON.location}: ${xhr.responseJSON.message}`);
            }
        })
        .done(function(json) {
            postAuthLogin(username, password);
        });
    });
}

function indexPage(){
    logIn();
    signUp();
    signInAuth();
    signUpAuth();
}

$(indexPage());