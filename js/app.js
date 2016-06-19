$(document).ready(function() {
    $('#contact-form').submit(function(event) {
        event.preventDefault();//prevents redirect to formspree website after post
        //Ajax request to send form data to formspree
        $.ajax({
            url: "https://formspree.io/adrianjaylopez@gmail.com",
            method: "POST",
            data: {
                name: $('#full_name').val(),
                email: $('#email').val(),
                message: $('#message').val()
            },
            dataType: "json"
        });
    });
    //validate using jquery validation
    $('#contact-form').validate({
        rules: { //rules for validation
            full_name: {
                minlength: 2, //set name as required and allowed for nicknames
                required: true
            },
            email: { //set to look for valid email addresses and required
                email: true,
                required: true
            },
            message: { //set as required
                required: true
            }
        },
        messages: {
            full_name: { //messages to show if field is empty or if the minimum length is not meet
                required: "I need to know who is trying to contact me",
                minlength: jQuery.validator.format("Name must be at least {0} characters long.")
            },
            email: { //messages to show if no email address is set or if email address is invalid
                required: "Please enter a valid email address so I can get back in touch with you.",
                email: "Please enter a valid email address so I can get back in touch with you."
            },
            message: { //message to show if message field is empty
                required: "Please leave me a description of how I can help you."
            }
        }
    });
});
