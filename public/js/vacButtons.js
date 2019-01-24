//Create variable to get user Id
const userId = localStorage.getItem('userId');

//Create function to make a GET request for user Id
function getUserInfo() {
    $.ajax({
        type: 'GET',
        url: `/api/users/${userId}`,
        beforeSend: function(xhr) {
            if (window.sessionStorage.accessToken) {
                xhr.setRequestHeader("Authorization", "Bearer " + window.sessionStorage.accessToken);
            }
        },
        error: error => {
            if(error.responseText === 'Unauthorized') {
                window.location = 'index.html';
            }
            console.log(error);
        },
        success: function(json) {
            let firstName = json.firstName
            $('.userGreeting').text(firstName)
        }
    })
}

//Make a POST request to create a new vacation
function submitVacationForm(){
    $('.vacationFileInput').on('click', '.postbtn', function(event) {
        event.preventDefault();
        const city = $('.city').val();
        const country = $('.country').val();
        const flight = $('.flight').val();
        const departure = $('.departure').val();
        $.ajax({
            type: 'POST',
            url: `/api/users/vacation/${userId}`,
            beforeSend: function(xhr) {
                if (window.sessionStorage.accessToken) {
                    xhr.setRequestHeader("Authorization", "Bearer " + window.sessionStorage.accessToken);
                }
            },
            data: JSON.stringify({
                'city': city,
                'country': country,
                'flight': flight,
                'departure': departure,
                'userID': userId
            }),
            dataType: 'json',
            contentType: "application/json",
            error: error => {
                if(error.responseText === 'Unauthorized') {
                    window.location = 'index.html';
                }
                console.log(error);
            }
        });
        getAllVacInputs();
        clearInputs();
        $('.modal').fadeOut();
    })
}

//Make function to clear inputs in form
function clearInputs() {
    $('.city').val('');
    $('.country').val('');
    $('.flight').val('');
    $('.departure').val('');
}

//Make a GET Request to retireve all vacations made by the user
function getAllVacInputs() {
    $.ajax({
        type: 'GET',
        url: `/api/users/vacation/${userId}`,
        beforeSend: function(xhr) {
            if (window.sessionStorage.accessToken) {
                xhr.setRequestHeader("Authorization", "Bearer " + window.sessionStorage.accessToken);
            }
        },
        error: error => {
            if(error.responseText === 'Unauthorized') {
                window.location = 'index.html';
            }
            console.log(error);
        },
        success: function(json) {
            let listOfVacations;
            let listOfMemories;
            if(json.length === 0) {
                $('.startdash').fadeIn();
                $('.listofvacations').html('<h3>There are no vacations listed</h3>');
            } else {
                listOfVacations = json.map(obj => {
                    return vacList(obj);
                });

                listOfMemories = json.map(obj => {
                    return memoriesHTML(obj);
                });
                $('.vacMemoList').html(listOfMemories);
                $('.listofvacations').html(listOfVacations);
            }
        }
    })
    .done(function() {
        let ids = $('.listVac').map(function() {
            return $(this).attr('id');
        });
        for(let i=0; i < ids.length; i++) {
            $.ajax({
                type: 'GET',
                url: `/api/users/memories/${ids[i]}`,
                beforeSend: function(xhr) {
                    if (window.sessionStorage.accessToken) {
                        xhr.setRequestHeader("Authorization", "Bearer " + window.sessionStorage.accessToken);
                    }
                },
                error: error => {
                    if(error.responseText === 'Unauthorized') {
                        window.location = 'index.html';
                    }
                    console.log(error);
                },
                success: function(json) {
                    if(json.length === 0) {
                        $(`#${ids[i]} .memotitle`).text('Currently no memories posted.');
                    } else {
                        let memoTitle = json[0].title;
                        $(`.listofvacations #${ids[i]} .memotitle`).text(memoTitle);
                    }
                }
            });
        }
    });
}

//Make a template to display Vacation properties
function vacList(vacObj) {
    let vacId = vacObj.id;
    let city = vacObj.city;
    let country = vacObj.country;
    let flight = vacObj.flight;
    let departure = vacObj.departure;
    return `
    <div id="${vacId}" class="listVac box-structure">
		<div class="snapMemo">
            <p class="vacLoca">
            <span class="vacCity">${city}</span>,
            <span class="vacCountry"> ${country}</span>
            </p>
        </div>
		<p><strong>Flight: </strong></p>
        <p class="vacFlight">${flight}</p>
		<p><strong>Departure: </strong></p>
        <p class="vacDepart">${departure}</p>
        <br>
        <div class="snapButtons">
        <button class='editVac button nutrbtn'><i class="fas fa-edit"></i></button>
        <button class='deleteVac button negbtn'><i class="fas fa-trash-alt"></i></button>
        </div>
	</div>
    <br>
    `
}

//Make a function to Delete choosen vacation
function handleVacDelete () {
    $('body').on('click', '.deleteVac', function() {
        let deleteItemId = $(this).closest('.listVac').attr('id');
        console.log(deleteItemId);
        $.ajax({
            type: 'DELETE',
            url: `/api/users/vacation/${deleteItemId}`,
            beforeSend: function(xhr) {
            if (window.sessionStorage.accessToken) {
                xhr.setRequestHeader("Authorization", "Bearer " + window.sessionStorage.accessToken);
            }
            },
            error: error => console.log(error)
        });
        getAllVacInputs();
    });
}

//Make a function to begin editing a vacation
function handleStartVacEdit () {
    $('body').on('click', '.editVac', function() {
        console.log('clicked!');
        let editItemId = $(this).closest('.listVac').attr('id');
        let city = $(this).closest('.listVac').find('.vacCity').text();
        let country = $(this).closest('.listVac').find('.vacCountry').text();
        let flight = $(this).closest('.listVac').find('.vacFlight').text();
        let departure = $(this).closest('.listVac').find('.vacDepart').text();
        console.log(editItemId);
        console.log(city);
        console.log(country);
        console.log(flight);
        console.log(departure);
        $('.vacEdit').fadeIn();
        $('.vacEdit').html(vacationEditHTML(editItemId, city, country, flight, departure));
    });
}

//Make a template for editing vacation form
function vacationEditHTML(id, city, country, flight, departure) {
    return ` 
    <form role="form" id='${id}' class="vacEditFileInput modal-content">
    <button class="closeButton closeVacForm"><i class="fas fa-times fa-3x"></i></button>
            <legend>Vacation</legend>
            <div class="row">
                <div class="col-6">
                    <label for="city">City:</label>
                    <br>
                    <input class="cityEdit" type="text" value='${city}'>
                </div>
                <div class="col-6">
                    <label for="country">Country:</label>
                    <br>
                    <input class="countryEdit" type="text" value='${country}'>
                </div>
            </div>
            <div class="row">
                <div class="col-6">
                    <label for="flight">Flight:</label>
                    <br>
                    <input class="flightEdit" type="datetime-local" value='${flight}'>
                </div>
                <div class="col-6">
                    <label for="departure">Departure:</label>
                    <br>
                    <input class="departureEdit" type="datetime-local" value='${departure}'>
                </div>
            </div>
            <div class="">
                <button class="btn postbtn" type="submit">Submit Edit</button>
            </div>
    </form>`;
}

//Create a function to update choosen vacation once user submits form
function handleVacEditSubmit() {
    $('.vacEdit').on('submit', 'form.vacEditFileInput', function(e) {
        e.preventDefault();
        console.log('What prevent?');
        let editItemId = $(this).closest('.vacEdit').find('form').attr('id');
        let city = $(this).closest('.vacEdit').find('.cityEdit').val();
        let country = $(this).closest('.vacEdit').find('.countryEdit').val();
        let flight = $(this).closest('.vacEdit').find('.flightEdit').val();
        let departure = $(this).closest('.vacEdit').find('.departureEdit').val();
        console.log(editItemId);
        console.log(city);
        $.ajax({
            type: 'PUT',
            url: `/api/users/vacation/${editItemId}`,
            beforeSend: function(xhr) {
                if (window.sessionStorage.accessToken) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + window.sessionStorage.accessToken);
                }
            },
            data: JSON.stringify({
                'id': editItemId,
                'city': city,
                'country': country,
                'flight': flight,
                'departure': departure
            }),
            dataType: 'json',
            contentType: 'application/json',
            error: error => console.log(error)
        });
        outEmptyModal($(this));
        getAllVacInputs();
    });
}

//Make template to allow users to select vacation
function memoriesHTML(vacObj) {
    let vacId = vacObj.id;
    let city = vacObj.city;
    let country = vacObj.country;
    return `
        <div id="${vacId}" class="selectVac" type="button" tabindex="0" >
            <div id="">
                <p><i class="fas fa-home"></i> <span>${city}, ${country}</span></p>
            </div>
        </div>
    `;
}

//Make a function to handle buttons on Vacation page
function handleVacButtons () {
    $(document).ready(() => {
        $('.signOutYes').click(() => {
            console.log('click!');
        });

        $('.closeAbout').click(() => {
            $('.about').fadeOut();
        });

        $('.closeStartdash').click(() => {
            $('.startdash').fadeOut();
        });

        $('.signOutOpt').click(() => {
            console.log('click');
            $('.signout').fadeIn();
        });

        $('.aboutOpt').click(() => {
            console.log('click');
            $('.about').fadeIn();
        });

        $('.closeSignOut').click(() => {
            $('.signout').fadeOut();
        });

        $('.signOutNo').click(() => {
            $('.signout').fadeOut();
        });

        $('.addVacation').click(() => {
            $('.vacationFormInput').fadeIn();
        })

        $('.addMemories').click(() => {
            $('.memoriesAdd').fadeIn();
        })

        $('.closeVacForm').click(() => {
            $('.vacationFormInput').fadeOut();
            $('.vacEditFileInput').fadeOut();
        });

        $('.closeMemoForm').click(() => {
            $('.memoriesAdd').fadeOut();
        });

    });
}

//Make function to close modals
function outEmptyModal(element) {
    element.closest('.modal').fadeOut();
    element.closest('.modal').empty();
}

//Make function to allow users to select a vacation and view memories
function selectVacationMemo () {
    $('.vacMemoList').on('click', '.selectVac', function() {
        localStorage.setItem('vacId', $(this).attr('id'));
        window.location = 'memory.html';
    });
}

//Make a function to run vacation functions
function runVacations() {
    getUserInfo();
    submitVacationForm();
    getAllVacInputs();
    handleStartVacEdit();
    handleVacEditSubmit();
    handleVacDelete();
    handleVacButtons();
    selectVacationMemo();
}

//Call run Vacations function
$(runVacations());
