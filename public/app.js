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
        "publishedAt": 1234567809
    },
    {
        "id": "2222222",
        "arrive": "August 17, 2018",
        "depart": "August 25, 2018",
        "city": "Manila",
        "country": "Phillipines",
        "publishedAt": 1234567789
    },
    {
        "id": "3333333",
        "arrive": "November 15, 2018",
        "depart": "November 22, 2018",
        "city": "Dallas",
        "country": "United States",
        "publishedAt": 1234567889
    },
    {
        "id": "4444444",
        "arrive": "January 11, 2019",
        "depart": "January 18, 2019",
        "city": "Toronto",
        "country": "Canada",
        "publishedAt": 1234567899
    }
    ]
};

function getRecentTripUpdates(callback) {
    setTimeout(function(){ callback(MOCK_TRIP_UPDATES)}, 1);
}

function displayTripUpdates(data) {
    for (index in data.tripUpdates) {
        $('main').append(
        '<p>' + data.tripUpdates[index].city + data.tripUpdates[index].country + '</p>');
    }
}

function getandDisplayTripUpdates() {
    getRecentTripUpdates(displayTripUpdates);
}

$(function() {
    getandDisplayTripUpdates();
})