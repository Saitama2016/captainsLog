
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
                        (`.listofvacations #${ids[i]} .memotitle`).text(memoTitle);
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
					<h2>${city}, ${country}</h2>
				</div>
					<p><strong>Flight: </strong></p>
                    <p>${flight}</p>
				</div>
				</div>
					<p><strong>Departure: </strong></p>
                    <p>${departure}</p>
				</div>
				<div class="snapMemo">
					<h4>Recent Memory:</h4>
					<div class="memory">
						<div><i class="fas fa-star"></i><span class="memotitle">You haven't added a memories yet</span></div>
					</div>
				</div>
			</div
    `
}

function memoriesHTML(vacObj) {
    let vacId = vacObj.id;
    let city = vacObj.city;
    let country = vacObj.country;
    return `
        <div id="${vacId}" class="selectVac">
            <div id="">
                <p><i class="fas fa-star"></i><span>${city}, ${country}</span></p>
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
}

$(runVacations());
