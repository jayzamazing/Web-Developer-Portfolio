$(document).ready(function() {
  $('#contactForm').submit(function(event) {
    event.preventDefault();

  });
  var validators = {
    name: {
      regex: /^[A-Za-z]{3,}$/
    },
    email: {
      regex: /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}\b/
    }
  };
});
