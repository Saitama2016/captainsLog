
const userId = localStorage.getItem('userId');

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

function submitVacationForm(){
    $('.vacationFileInput').on('submit', function(event) {
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

function clearInputs() {
    $('.city').val('');
    $('.country').val('');
    $('.flight').val('');
    $('.departure').val('');
}

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
                    return vacSnapShot(obj);
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
        let ids = $('.snapVac').map(function() {
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

function vacSnapShot(vacObj) {
    let vacId = vacObj.id;
    let city = vacObj.city;
    let country = vacObj.country;
    let flight = vacObj.flight;
    let departure = vacObj.departure;
    return `
    <div id="${vacId}" class="snapVac box-structure">
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
	</div>
	<div class="snapMemo">
		<h4>Recent Memory:</h4>
		<div class="memory">
		<div><i class="fas fa-home"></i><span class="memotitle">You haven't added a memories yet</span></div>
	    </div>
	</div>
    <br>
    <div class="snapButtons">
        <button class='editVac button nutrbtn'><i class="fas fa-edit"></i></button>
        <button class='deleteVac button negbtn'><i class="fas fa-trash-alt"></i></button>
    </div>
    `
}

// $('.vacEdit').on('submit', function(e) {
//     e.preventDefault();
//     const vacCity = $(this).closest('.vacEdit').find('.city').val();
//     const vacCountry = $(this).closest('.vacEdit').find('.country').val();
//     const vacFlight = $(this).closest('.vacEdit').find('.flight').val();
//     const vacDeparture = $(this).closest('.vacEdit').find('.departure').val();
//     const dataPut = JSON.stringify({
//         'id': vacationId,
//         'city': vacCity,
//         'country': vacCountry,
//         'flight': vacFlight,
//         'departure': vacDeparture
//     });

//     $.ajax({
//         type: 'PUT',
//         url: `/api/users/vacation/${vacationId}`,
//         beforeSend: function(xhr) {
//             if (window.sessionStorage.accessToken) {
//                 xhr.setRequestHeader('Authorization', 'Bearer ' + window.sessionStorage.accessToken);
//             }
//         },
//         data: dataPut,
//         dataType: 'json',
//         contentType: 'application/json',
//         error: error => console.log(error)
//     })
//     .done(function(){
//         getVacationInputs();
//     });
//     outEmptyModal($(this));
// });

function handleVacDelete () {
    $('.listofvacations').on('click', '.deleteVac', function() {
        let deleteItemId = $(this).closest('.snapVac').attr('id');
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

$('.listofvacations').on('click', '.editVac', function() {
    console.log('clicked!');
    let editItemId = $(this).closest('.snapVac').attr('id');
    let city = $(this).closest('.snapVac').find('.vacCity').text();
    let country = $(this).closest('.snapVac').find('.vacCountry').text();
    let flight = $(this).closest('.snapVac').find('.vacFlight').text();
    let departure = $(this).closest('.snapVac').find('.vacDepart').text();
    console.log(editItemId);
    console.log(city);
    console.log(country);
    console.log(flight);
    console.log(departure);
    $('.vacEdit').fadeIn();
    $('.vacEdit').html(vacationEditHTML(editItemId, city, country, flight, departure));
});

function vacationEditHTML(id, city, country, flight, departure) {
    return ` 
    <form role="form" id='${id}' class="vacaEditFileInput modal-content">
    <button class="closeButton closeVacForm"><i class="fas fa-times fa-3x"></i></button>
        <fieldset class="row vacEditField">
            <h3>Vacation</h3>
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
        </fieldset>
    </form>`;
}

function handleVacEditSubmit() {
    $('.vacEdit').on('submit', 'form.vacaEditFileInput', function(e) {
        e.preventDefault();
        console.log('What prevent?');
        let editItemId = $(this).closest('.vacEdit').find('form').attr('id');
        let date = $(this).closest('.vacEdit').find('.memoDateEdit').val();
        let event = $(this).closest('.vacEdit').find('.memoEventEdit').val();
        let des = $(this).closest('.vacEdit').find('.memoDesEdit').val();
        $.ajax({
            type: 'PUT',
            url: `/api/users/memories/${editItemId}`,
            beforeSend: function(xhr) {
                if (window.sessionStorage.accessToken) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + window.sessionStorage.accessToken);
                }
            },
            data: JSON.stringify({
                'id': editItemId,
                'event': event,
                'date': date,
                'description': des
            }),
            dataType: 'json',
            contentType: 'application/json',
            error: error => console.log(error)
        });
        outEmptyModal($(this));
        getAllMemories();
    });
}

function memoriesHTML(vacObj) {
    let vacId = vacObj.id;
    let city = vacObj.city;
    let country = vacObj.country;
    return `
        <div id="${vacId}" class="selectVac" tabindex="0">
            <div id="">
                <p><i class="fas fa-home"></i> <span>${city}, ${country}</span></p>
            </div>
        </div>
    `;
}

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
    });

    $('.closeMemoForm').click(() => {
        $('.memoriesAdd').fadeOut();
    });

});

$('.listofvacations').on('click', '.snapVac', function() {
    localStorage.setItem('vacId', $(this).attr('id'));
    window.location = 'memory.html';
});

$('.vacMemoList').on('click', '.selectVac', function() {
    localStorage.setItem('vacId', $(this).attr('id'));
    window.location = 'memory.html';
});

function runVacations() {
    getUserInfo();
    submitVacationForm();
    getAllVacInputs();
    handleVacDelete();
}

$(runVacations());
