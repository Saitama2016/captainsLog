const userId = localStorage.getItem('userId');

function getUserInfo() {
    $.ajax({
        type:'GET',
        url: `/api/users/${userId}`,
        beforeSend: function(xhr) {
            if(window.sessionStorage.accessToken) {
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
            $('.usergreeting').text(firstName)
        }
    })
}

function submitVacationInfo() {
    $('.vacationInput').on('submit', function(event) {
        event.preventDefault();
        const cityName = $('.city').val();
        const countryName = $('.country').val();
        const arrivalDate = $('.arrival').val();
        const departureDate = $('.departure').val();
        $.ajax({
            type:'POST',
            url: `/api/users/vacation/${userId}`,
            beforeSend: function(xhr) {
                if (window.sessionStorage.accessToken) {
                    xhr.setRequestHeader("Authorization", "Bearer " + window.sessionStorage.accessToken);
                }
            },
            data: JSON.stringify({
                'city': cityName,
                'country': countryName,
                'arrival': arrivalDate,
                'departure': departureDate,
                'userID': userId
            }),
            dataType: 'json',
            contentType: 'application/json',
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
    $('.arrival').val('');
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
            if(json.length < 1) {
                $('.startDash').fadeIn();
                $('.listOfVacations').html('<p>There are no Vacations listed</p>');
            } else {
                listOfVacations = json.map(obj => {
                    return vacationHTML(obj);
                });

                listOfMemories = json.map(obj => {
                    return memoriesHTML(obj);
                });

                $('.memoriesList').html(listOfMemories);
                $('.listOfVacations').html(listOfVacations);
            }
        }
    })
    .done(function(){
        let ids = $('.snapVac').map(function() {
            return $(this).attr('id');
        });

        for(let i=0; i < ids.length; i++) {
            $.ajax({
                type: 'GET',
                url: `/api/users/memory/${ids[i]}`,
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
                        $(`#${ids[i]} .memoryTitle`).text('Currently no memories posted.');
                    } else {
                        let memoryTitle = json[0].title;
                        $(`.listOfVacations #${ids[i]} .memoryTitle`).text(memoryTitle);
                    }
                }
            });
        }
    });
}

function vacationHTML(vacObj) {
    let vacationId = vacObj.id;
    let city = vacObj.cityName;
    let country = vacObj.countryName;
    let arrival = vacObj.arrivalDate;
    let departure = vacObj.departureDate;
    return `
        <div id='${vacationId}' class='snapVac box-structure'>
            <div class='snapLoc'>
                <h2>${city}, ${country}<h2>
            </div>
            <div class='duration'>
                <p><h4>Arrival: </h4> ${arrival}</p>
                <p><h4>Departure: </h4> ${departure}</p> 
            </div>
        </div>
    `;
}

function memoriesHTML(vacObj) {
    let vacationId = vacObj.id;
    let city = vacObj.cityName;
    let country = vacObj.countryName;
    return `
        <div id='${vacationId}' class='selectVac'>
            <div id=''>
                <p><span>${city}, ${country}</span></p>
            </div>
        </div>
    `;
}

$('.listOfVacations').on('click', '.snapVac', function (){
    localStorage.setItem('vacationId', $(this).attr('id'));
    window.location = 'memory.html';
});

$('.memoriesList').on('click', '.selectVac', function (){
    localStorage.setItem('vacationId', $(this).attr('id'));
    window.location = 'memory.html';
});

$('.addVacation').on('click', function() {
    $('.vacFormInput').fadeIn();
});

$('.closeBtn').on('click', function() {
    $('.modal').fadeOut();
});

function runDashBoard() {
    getUserInfo();
    submitVacationInfo();
    getAllVacInputs();
}

$(runDashBoard());