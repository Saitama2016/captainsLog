const vacationId = localStorage.getItem('vacationId');

let listOfMemories;
let vacationInfoJSON;

function getVacationInputs() {
    $.ajax({
        type: 'GET',
        url: `/api/users/vacation/single/${vacationId}`,
        beforeSend: function(xhr) {
            if (window.sessionStorage.accessToken) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + window.sessionStorage.accessToken);
            }
        },
        error: error => {
            if(error.responseText === 'Unauthorized') {
                window.location === 'index.html';
            }
            window.location = 'dashboard.html';
            console.log(error);
        },
        success: function(json) {
            $('.city').text(json.city);
            vacationInfoJSON = json;
        }
    });
}

function postMemory(){
    $('.memoryInput').on('submit', function(event) {
        event.preventDefault();
        let memoryDate = $('.memoryDate').val();
        let memoryEvent = $('.memoryEvent').val();
        let memoryDes = $('.memoryDescription').val();
        $.ajax({
            type: 'POST',
            url: `/api/users/memory/${vacationId}`,
            beforeSend: function(xhr) {
                if (window.sessionStorage.accessToken) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + window.sessionStorage.accessToken);
                }
            },
            data: JSON.stringify({
                "event": memoryEvent,
                "date": memoryDate,
                "description": memoryDes,
                "vacationID": vacationId
            }),
            dataType: 'json',
            contentType: 'application/json',
            error: error => console.log(error)
        });
        clearInputs();
        getAllMemories();
        $('.modal').fadeOut();
    });
}

function clearInputs() {
    $('.memoryDate').val('');
    $('.memoryEvent').val('');
    $('.memoryDescription').val('');
}

function getAllMemories() {
    $.ajax({
        type: 'GET',
        url: `/api/users/memory/${vacationId}`,
        beforeSend: function(xhr) {
            if (window.sessionStorage.accessToken) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + window.sessionStorage.accessToken);
            }
        },
        error: error => {
            if(error.responseText === 'Unauthorized') {
                window.location === 'index.html';
            }
            console.log(error);
        },
        success: function(json) {
            console.log(json);
            if (json.length === 0) {
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
    const vacArrival = obj.arrival;
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
                    <input class="city" type="text" name="cityName">
                </div>
                <div class="col-6">
                    <label for="city">Country:</label>
                    <br>
                    <input class="country" type="text" name="countryName">
                </div>
            </div>
            <div class="row">
                <div class="col-4">
                    <label for="city">Arrival:</label>
                    <br>
                    <input class="city" type="datetime-local" name="arrivalDate">
                </div>
                <div class="col-4">
                    <label for="city">Departure:</label>
                    <br>
                    <input class="country" type="datetime-local" name="departureDate">
                </div>
            </div>
            <div class="">
                <input id='editVacation' class='button nutrbtn' type='button' value='Edit'>
                <input id='deleteVacation' class='button negbtn disabledInp' type='button' value='Delete Vacation Info & Memories' disabled>
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
            <div class='memoryDes'>${memoDes}</div>
            <div>
                <button class='editMemo button nutrbtn'>edit</button>
                <button class='deletememo button negbtn'>delete</button>
            </div>
        </div>
    </div>
    `;
}

$('.memoryList').on('click', '.deleteMemo', function() {
    let deleteItemId = $(this).closest('.fullMemo').attr('id');
    $.ajax({
        type: 'DELETE',
        url: `/api/users/memory/${deleteItemId}`,
        beforeSend: function(xhr) {
            if (window.sessionStorage.accessToken) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + window.sessionStorage.accessToken);
            }
        },
        error: error => console.log(error)
    });
    getAllMemories();
});

function memoryEditHTML(id, date, event, des) {
    return `
    <form role="form" class="memoInput modal-content">
    <div class="closeButton"><i class="fas fa-times fa-3x"></i></div>
    <fieldset class="row">
        <div class="col-3">
            <label for="date">Date:</label>
            <br>
            <input class="memoDate" type="date" name="date" value='${date}'>
            <br>
            <label for="event">Event:</label>
            <br>
            <input class="memoTitle" type="text" name="memories" value='${event}'>
        </div>

        <div class="col-6">
            <label for="description">Description:</label>
            <br>
            <textarea class="memoDescription" rows="5" name="description" value='${des}'></textarea>
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
        url: `api/users/vacation/${vacationId}`,
        beforeSend: function(xhr) {
            if (window.sessionStorage.accessToken) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + window.sessionStorage.accessToken);
            }
        },
        error: error => console.log(error)
    });
    sessionStorage.removeItem('vacationId');
    window.location = 'dashboard.html';
});

$('.vacEdit').on('submit', function(e) {
    e.preventDefault();
    const vacCity = $(this).closest('.vacEdit').find('.city').val();
    const vacCountry = $(this).closest('.vacEdit').find('.country').val();
    const vacArrival = $(this).closest('.vacEdit').find('.arrival').val();
    const vacDeparture = $(this).closest('.vacEdit').find('.departure').val();
    const dataPut = JSON.stringify({
        'id': vacationId,
        'city': vacCity,
        'country': vacCountry,
        'arrival': vacArrival,
        'departure': vacDeparture
    });

    $.ajax({
        type: 'PUT',
        url: `api/users/vacation/${vacationId}`,
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

$('.memoEdit').on('click', '.postbtn', function(e) {
    e.preventDefault();
    let editItemId = $(this).closest('.memoEdit').find('form').attr('id');
    let date = $(this).closest('.memoEdit').find('.memoDateEdit').val();
    let event = $(this).closest('.memoEdit').find('.memoEventEdit').val();
    let des = $(this).closest('.memoEdit').find('.memoDesEdit').val();
    $.ajax({
        type: 'PUT',
        url: `api/users/memory/${editItemId}`,
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

$('.vacViewEdit').on('click', function() {
    $('.vacEdit').html(vacationHTML(vacationInfoJSON));
    $('.vacEdit').fadeIn();
})

$('.vacEdit').on('click', '#editVacation', function(event) {
    event.preventDefault();
    $('.disabledInp').prop('disabled', false);
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