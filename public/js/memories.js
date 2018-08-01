
//Check if vacationId exists (does not equal null)
//Look at how to get vacationId from local storage

// function checkVacationId (vacationId) {
//     if (vacationId !== null) {
//         getVacationInputs();
//     } else {
//         $('.startMemo').html('<p>No Memories, life is too short, go out and explore!</p>')
//     }
// }

const vacationId = localStorage.getItem('vacId');

let listOfMemories;
let vacationInfoJSON;

function getVacationInputs() {
    console.log('click', vacationId);
    $.ajax({
        type: 'GET',
        url: `/api/users/vacation/single/${vacationId}`,
        beforeSend: function(xhr) {
            if (window.sessionStorage.accessToken) {
                xhr.setRequestHeader("Authorization", "Bearer " + window.sessionStorage.accessToken);
            }
        },
        error: error => {
            if(error.responseText === 'Unauthorized') {
                window.location = 'index.html';
            }
            // window.location = 'vacations.html';
            console.log(error);
        },
        success: function(json) {
            $('.city').text(json.city);
            $('.country').text(json.country);
            console.log(json.city);
            vacationInfoJSON = json;
        }
    });
}

function postMemory(){
    $('.memoInput').on('submit', function(event) {
        event.preventDefault();
        let memoryDate = $('.memoDate').val();
        let memoryEvent = $('.memoEvent').val();
        let memoryDes = $('.memoDescription').val();
        $.ajax({
            type: 'POST',
            url: `/api/users/memories/${vacationId}`,
            beforeSend: function(xhr) {
                if (window.sessionStorage.accessToken) {
                    xhr.setRequestHeader("Authorization", "Bearer " + window.sessionStorage.accessToken);
                }
            },
            data: JSON.stringify({
                "event": memoryEvent,
                "date": memoryDate,
                "description": memoryDes,
                "vacationID": vacationId
            }),
            dataType: 'json',
            contentType: "application/json",
            error: error => console.log(error)
        });
        clearInputs();
        getAllMemories();
        $('.modal').fadeOut();
    });
}



function clearInputs() {
    $('.memoDate').val('');
    $('.memoEvent').val('');
    $('.memoDescription').val('');
}

function getAllMemories() {
    $.ajax({
        type: 'GET',
        url: `/api/users/memories/${vacationId}`,
        beforeSend: function(xhr) {
            if (window.sessionStorage.accessToken) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + window.sessionStorage.accessToken);
            }
        },
        error: error => {
            if(error.responseText === 'Unauthorized') {
                window.location = 'index.html';
            }
            console.log(error);
        },
        success: function(json) {
            console.log(json);
            if (json.length < 1) {
                $('.startMemo').fadeIn();
                $('.memoryList').html('<h3>No Memories on file</h3>');
            } else {
                listOfMemories = json.map(obj => {
                    return memoryHTML(obj);
                });
                $('.memoryList').html(listOfMemories);
            }
        }
    });
}

function vacationHTML(obj) {
    const vacCity = obj.city;
    const vacCountry = obj.country;
    const vacFlight = obj.flight;
    const vacDeparture = obj.departure;
    return ` 
    form role="form" class="vacationFileInput modal-content">
        <fieldset class="row">
            <div class="closeButton"><i class="fas fa-times fa-3x"></i></div>
            <h3>Vacation</h3>
            <div class="row">
                <div class="col-6">
                    <label for="city">City:</label>
                    <br>
                    <input class="city disabledInput" type="text" name="cityName" value="${vacCity}" disabled>
                </div>
                <div class="col-6">
                    <label for="city">Country:</label>
                    <br>
                    <input class="country disabledInput" type="text" name="countryName" value="${vacCountry}" disabled>
                </div>
            </div>
            <div class="row">
                <div class="col-4">
                    <label for="flight">Flight:</label>
                    <br>
                    <input class="flight disabledInput" type="datetime-local" name="flightDate" value="${vacFlight}" disabled>
                </div>
                <div class="col-4">
                    <label for="departure">Departure:</label>
                    <br>
                    <input class="departure disabledInput" type="datetime-local" name="departureDate" value="${vacDeparture}" disabled>
                </div>
            </div>
            <div class="">
                <input id='editVacation' class='button nutrbtn' type='button' value='Edit'>
                <input id='deleteVacation' class='button negbtn disabledInput' type='button' value='Delete Vacation Info & Memories' disabled>
                <input class="btn postbtn" type="submit" value="Submit" disabled>
            </div>
            </fieldset>
    </form>`;
}

function memoryHTML(obj) {
    let memoId = obj.id;
    let memoEvent = obj.event;
    let memoDate = obj.date;
    let memoDes = obj.description;
    return `
    <div id='${memoId}' class='fullMemo'>
        <div class='memoContainer'>
        <div class='memoryDate'>${memoDate}</div>
        <div class='memoryEvent'>${memoEvent}</div>
        <div class='memoButton'><button class='viewDes button postbtn'>+</button></div>
        </div>
        <div class='memoHidden hidden'>
            <div class='memoryDescription'>${memoDes}</div>
            <div>
                <button class='editMemo button nutrbtn'><i class="fas fa-edit"></i></button>
                <button class='deleteMemo button negbtn'><i class="fas fa-trash-alt"></i></button>
            </div>
        </div>
    </div>
    `;
}

$('.memoryList').on('click', '.deleteMemo', function() {
    let deleteItemId = $(this).closest('.fullMemo').attr('id');
    $.ajax({
        type: 'DELETE',
        url: `/api/users/memories/${deleteItemId}`,
        beforeSend: function(xhr) {
            if (window.sessionStorage.accessToken) {
                xhr.setRequestHeader("Authorization", "Bearer " + window.sessionStorage.accessToken);
            }
        },
        error: error => console.log(error)
    });
    getAllMemories();
});

$('.memoryList').on('click', '.editMemo', function() {
    console.log('clicked!');
    let editItemId = $(this).closest('.fullMemo').attr('id');
    let date = $(this).closest('.fullMemo').find('.memoryDate').text();
    let event = $(this).closest('.fullMemo').find('.memoryEvent').text();
    let description = $(this).closest('.fullMemo').find('.memoryDescription').text();
    $('.memoEdit').fadeIn();
    $('.memoEdit').html(memoryEditHTML(editItemId, date, event, description));
});

function memoryEditHTML(id, date, event, description) {
    return `
    <form role="form" id=${id}" class="memoInput modal-content">
    <div class="closeButton"><i class="fas fa-times fa-3x"></i></div>
    <fieldset class="row">
        <div><i class="fas fa-times fa-3x closeButton"></i></div>
        <div class="col-3">
            <label for="date">Date:</label>
            <br>
            <input class="memoDateEdit" type="date" name="date" value='${date}'>
            <br>
            <label for="event">Event:</label>
            <br>
            <input class="memoEventEdit" type="text" name="memories" value='${event}'>
        </div>

        <div class="col-6">
            <label for="description">Description:</label>
            <br>
            <textarea class="memoDesEdit" rows="5" name="description" value='${description}'></textarea>
        </div>
        <div class="col-3">
            <button class="button Posbutton" type="submit">Submit edit</button>
        </div>
    </fieldset>
</form>
    `
}

$('.vacEdit').on('click', '#deleteVac', function() {
    $.ajax({
        type: 'DELETE',
        url: `/api/users/vacation/${vacationId}`,
        beforeSend: function(xhr) {
            if (window.sessionStorage.accessToken) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + window.sessionStorage.accessToken);
            }
        },
        error: error => console.log(error)
    });
    sessionStorage.removeItem('vacationId');
    window.location = 'vacations.html';
});

$('.vacEdit').on('submit', function(e) {
    e.preventDefault();
    const vacCity = $(this).closest('.vacEdit').find('.city').val();
    const vacCountry = $(this).closest('.vacEdit').find('.country').val();
    const vacFlight = $(this).closest('.vacEdit').find('.flight').val();
    const vacDeparture = $(this).closest('.vacEdit').find('.departure').val();
    const dataPut = JSON.stringify({
        'id': vacationId,
        'city': vacCity,
        'country': vacCountry,
        'flight': vacFlight,
        'departure': vacDeparture
    });

    $.ajax({
        type: 'PUT',
        url: `/api/users/vacation/${vacationId}`,
        beforeSend: function(xhr) {
            if (window.sessionStorage.accessToken) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + window.sessionStorage.accessToken);
            }
        },
        data: dataPut,
        dataType: 'json',
        contentType: 'application/json',
        error: error => console.log(error)
    })
    .done(function(){
        getVacationInputs();
    });
    outEmptyModal($(this));
});

$('.memoEdit').on('click', '.postButton', function(e) {
    e.preventDefault();
    let editItemId = $(this).closest('.memoEdit').find('form').attr('id');
    let date = $(this).closest('.memoEdit').find('.memoDateEdit').val();
    let event = $(this).closest('.memoEdit').find('.memoEventEdit').val();
    let des = $(this).closest('.memoEdit').find('.memoDesEdit').val();
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

$(document).ready(() => {
    $('.signOutYes').click(() => {
        console.log('click!');
    });

    $('.closeAbout').click(() => {
        $('.about').fadeOut();
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

    $('.addMemories').click(() => {
        $('.memoriesAdd').fadeIn();
    });
    
    $('.memoryList').on('click', '.viewDes', function() {
        $(this).closest('.fullMemo').find('.memoHidden').toggleClass('hidden');
        ($(this).text() == '+')? $(this).text('-'): $(this).text('+');
    });
    
    $('.addMemoButton').on('click', function() {
        $('.memoAdd').fadeIn();
    });
    
    $('.modal').on('click', '.closeButton', function() {
        $(this).closest('.modal').fadeOut();
    });

    $('.closeMemoForm').click(() => {
        $('.memoriesAdd').fadeOut();
    });

});

function outEmptyModal(element) {
    element.closest('.modal').fadeOut();
    element.closest('.modal').empty();
}

function runMemory() {
    getVacationInputs();
    postMemory();
    getAllMemories();
}

$(runMemory()); 