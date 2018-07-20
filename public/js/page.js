$('#openNav').on('click', function(){
    $('.navbar').toggleClass('navwidth');
});

$('#closeNav').on('click', function(){
    $('.navbar').toggleClass('navwidth');
});

$('#about').on('click', function(){
    $('.about').fadeIn();
});

$('#signout').on('click', function(){
    $('.signout').fadeIn();
});

$('signOutNo').on('click', function() {
    console.log('no: clicked');
    $(this).closest('.modal').fadeOut();
});

$('signOutYes').on('click', function() {
    console.log('yes: clicked');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('vacationId');
    window.location = 'index.html';
});

$('.closeButton').on('click', function(){
    $(this).closest('.modal').fadeOut();
});

$('.modal').on('click', function(e){
    if(e.target === this){
        $(this).css('display', 'none');
    }
});

$(document).keydown(function(e){
    if(e.keyCode === 27){
        $('.modal').css('display', 'none');
    }
});