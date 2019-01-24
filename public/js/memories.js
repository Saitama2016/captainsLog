//Create a variable to retrieve Vacation Id
const vacationId = localStorage.getItem('vacId');

//Create global variables to retrieve list of memories and Vacation JSON
let listOfMemories;
let vacationInfoJSON;

//Make a GET request to retrieve a single vacation Id
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

//Make a POST request function to create a new Memory
function postMemory(){
    $('.newMemoInput').on('submit', function(event) {
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

//Make a function to clear date, event, and description of memory
function clearInputs() {
    $('.memoDate').val('');
    $('.memoEvent').val('');
    $('.memoDescription').val('');
}

//Make a GET request function to get all memories for the vacation
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

//Make a template for Memory featuring properties of Memory object
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

//Create a function to Delete a choosen memory
function handleMemoryDelete () {
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
}

//Create a function to begin editing choosen Memory
function startEditMemo () {
    $('.memoryList').on('click', '.editMemo', function() {
        console.log('clicked!');
        let editItemId = $(this).closest('.fullMemo').attr('id');
        let date = $(this).closest('.fullMemo').find('.memoryDate').text();
        let event = $(this).closest('.fullMemo').find('.memoryEvent').text();
        let description = $(this).closest('.fullMemo').find('.memoryDescription').text();
        console.log(editItemId);
        console.log(date);
        console.log(event);
        console.log(description);
        $('.memoEdit').fadeIn();
        $('.memoEdit').html(memoryEditHTML(editItemId, date, event, description));
    });
}

//Make a template for a form to edit Memory
function memoryEditHTML(id, date, event, description) {
    return `
    <form role="form" id="${id}" class="memoInput modal-content">
    <button class="closeButton closeMemoForm"><i class="fas fa-times fa-3x"></i></button>
        <legend>Edit Memory</legend>
            <div class="row">
                <div class="col-6">
                    <label for="date">Date:</label>
                    <br>
                    <input class="memoDateEdit" type="date" name="date" value='${date}'>
                </div>
                <br>
                <div class="col-6">
                    <label for="event">Event:</label>
                    <br>
                    <input class="memoEventEdit" type="text" name="memories" value='${event}'>
                </div>
            </div>
            <div class="row">
                <div class="col-6">
                    <label for="description">Description:</label>
                    <br>
                    <textarea class="memoDesEdit" row="5" name="description" maxlength="250" required>${description}</textarea>
                </div>
            </div>
            <div>
                <button class="button postbtn" type="submit">Submit Edit</button>
            </div>
    </form>
    `
}

//Make a function to update Memory when user submits form
function handleMemoEditSubmit() {
    $('.memoEdit').on('submit', 'form.memoInput', function(e) {
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
}

//Create a function to handle buttons on Memory page
function handleMemoryPageButtons () {
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
}

//Create function to close modals
function outEmptyModal(element) {
    element.closest('.modal').fadeOut();
    element.closest('.modal').empty();
}

//Create a function to call Memory functions
function runMemoryPage() {
    getVacationInputs();
    postMemory();
    getAllMemories();
    handleMemoryPageButtons();
    startEditMemo();
    handleMemoEditSubmit();
    handleMemoryDelete();
}

//Call runMemoryPage with jQuery
$(runMemoryPage()); 