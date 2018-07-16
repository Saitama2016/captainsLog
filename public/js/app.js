// this is mock data, when the API is create we'll have to return data
// that looks like this

var MOCK_TRIP_UPDATES = {
    "tripUpdates": [
    {
        "id": "1111111",
        "arrive": "July 21, 2018",
        "depart": "July 28, 2018",
        "city": "Tokyo",
        "country": "Japan",
        "description": "Explore every vending machine",
        "publishedAt": 1234567809
    },
    {
        "id": "2222222",
        "arrive": "August 17, 2018",
        "depart": "August 25, 2018",
        "city": "Manila",
        "country": "Phillipines",
        "description": "Meet Matt Tran",
        "publishedAt": 1234567789
    },
    {
        "id": "3333333",
        "arrive": "November 15, 2018",
        "depart": "November 22, 2018",
        "city": "Dallas",
        "country": "United States",
        "description": "Visit Dallas State Fair",
        "publishedAt": 1234567889
    },
    {
        "id": "4444444",
        "arrive": "January 11, 2019",
        "depart": "January 18, 2019",
        "city": "Toronto",
        "country": "Canada",
        "description": "Get discounted medical pills",
        "publishedAt": 1234567899
    }
    ]
};

function getRecentTripUpdates(callback) {
    setTimeout(function(){ callback(MOCK_TRIP_UPDATES)}, 1);
}

function displayTripUpdates(data) {
    for (index in data.tripUpdates) {
        $('#vacationLog').append(
        `
        <div class="trip">
            <p class="arrival"> Arrival: ${data.tripUpdates[index].arrive} </p>
            <p class="departure"> Departure: ${data.tripUpdates[index].depart} </p>
            <p class="location"> ${data.tripUpdates[index].city}, ${data.tripUpdates[index].country} </p>
            <p class="journey"> ${data.tripUpdates[index].description} </p>
            <p><button id="edit">Edit</button> <button id="delete">Delete</button></p>
        </div>
        `
        );
    }
}

function getandDisplayTripUpdates() {
    getRecentTripUpdates(displayTripUpdates);
}

$(function() {
    getandDisplayTripUpdates();
})