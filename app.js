// this is mock data, when the API is create we'll have to return data
// that looks like this

var MOCK_TRIP_UPDATES = {
    "tripUpdates": [
    {
        "id": "1111111",
        "Arrive": "July 21, 2018",
        "Depart": "July 28, 2018",
        "City": "Tokyo",
        "Country": "Japan",
        "publishedAt": 1234567809
    },
    {
        "id": "2222222",
        "Arrive": "August 17, 2018",
        "Depart": "August 25, 2018",
        "City": "Manila",
        "Country": "Phillipines",
        "publishedAt": 1234567809
    },
    {
        "id": "3333333",
        "Arrive": "November 15, 2018",
        "Depart": "November 22, 2018",
        "City": "Dallas",
        "Country": "United States",
        "publishedAt": 1234567809
    },
    {
        "id": "4444444",
        "Arrive": "January 11, 2019",
        "Depart": "January 18, 2019",
        "City": "Toronto",
        "Country": "Canada",
        "publishedAt": 1234567809
    }
    ]
};

function getRecentTripUpdates(callback) {
    setTimeout(function(){ callback(MOCK_TRIP_UPDATES)}, 1);
}

function displayTripUpdates(data) {
    for (index in data.tripUpdates) {
        $('body').append(
        '<p>' + data.tripUpdates[index].text + '</p>');
    }
}

function getandDisplayTripUpdates() {
    getRecentTripUpdates(displayTripUpdates);
}

$(function() {
    getandDisplayTripUpdates();
})