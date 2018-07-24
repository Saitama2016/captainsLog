
const userId = localStorage.getItem('userId');

function getUserInfo() {
    $.ajax({
        type: 'GET',
        url: `api/users/${userId}`,
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
            url: `api/users/vacations/${userId}`,
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
        url: `/api/users/vacations/${userId}`,
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
            let listofVacations;
            let listofMemories;
            if(json.length === 0) {
                $('.startdash').fadeIn();
                $('.listofVacations').html('<h3>There are no vcations listed</h3>')
            } else {
                listofVacations = json.map(obj => {
                    return vacSnapShot(obj);
                });

                listofMemories = json.map(obj => {
                    return memoriesHTML(obj);
                });
                $('.vacMemoList').html(listofMemories);
                $('.listofVacations').html(listofVacations);
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
                        $(`#${ids[i]} .memotitle`).text('Currently no memories posted.');
                    } else {
                        let memoTitle = json[0].title;
                        (`.listofVacations #${ids[i]} .memotitle`).text(memoTitle);
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
					<div class="currentage">${monthDiff(age)}</div>
					<p>Months old</p>
				</div>
				<div class="snapMemo">
					<h4>Recent Memory:</h4>
					<div class="memory">
						<div><i class="fas fa-star"></i><span class="memotitle">You haven't added a milestone yet</span></div>
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

$('.listofVacations').on('click', '.snapVac', function() {
    localStorage.setItem('vacId', $(this).attr('id'));
    window.location = 'memory.html';
});

function runVacations() {
    getUserInfo();
    submitVacationForm();
    getAllVacInputs();
}

$(runVacations());
