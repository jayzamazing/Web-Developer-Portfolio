$(document).ready(function() {
    $('#contact-form-button').on('click', function(event) {
        event.preventDefault(); //prevents redirect to formspree website after post
        var isvalidate=$('#contact-form').valid();
        if(isvalidate)
        {
          //Ajax request to send form data to formspree
          $.ajax({
              url: 'https://formspree.io/adrianjaylopez@gmail.com',
              method: 'POST',
              data: {
                  name: $('#full_name').val().trim(),
                  email: $('#email').val().trim(),
                  message: $('#message').val().trim()
              },
              dataType: 'json'
          }).done(function() {
            //show success alert
            $('.alert-success').removeClass('hidden');
          }).fail(function() {
            //show fail alert
            $('.alert-danger').removeClass('hidden');
          });
          //empty all fields
          $('#contact-form')[0].reset();
          $('#contact-form').validate().resetForm();
        }

    });
    //function to hide alert element when close is clicked
    $('[data-hide]').on('click', function(){
        $(this).parent().addClass('hidden');
    });
    //deal with slowly scrolling down the page if anchor link is clicked
    $('a[href*="#"]:not([href="#"])').click(function() {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') ||
            location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html,body').animate({
                    scrollTop: target.offset().top
                }, 1000);
                return false;
            }
        }
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
                required: 'I need to know who is trying to contact me',
                minlength: jQuery.validator.format('Name must be at least {0} characters long.')
            },
            email: { //messages to show if no email address is set or if email address is invalid
                required: 'Please enter a valid email address so I can get back in touch with you.',
                email: 'Please enter a valid email address so I can get back in touch with you.'
            },
            message: { //message to show if message field is empty
                required: 'Please leave me a description of how I can help you.'
            }
        }
    });
});
