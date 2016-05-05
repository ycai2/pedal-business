// IIFE - Immediately Invoked Function Expression
(function(yourcode) {

  // The global jQuery object is passed as a parameter
  yourcode(window.jQuery, window, document);

}(function($, window, document) {

  // The $ is now locally scoped 

  // Listen for the jQuery ready event on the document
  $(function() {
    // The DOM is ready!
    var table = $('.ui-timepicker-input');
    for (var i = 0; i < table.length; i++){
      $(table[i]).timepicker();
    }
  });

  var $username;
  var $password;
  var $password_confirm;
  var username_email;

  // when submit button is clicked
  $('#submit-signup').click(function(){
    var account_info = $('.account-info input');
    account_info.each(function(index){

      //check if every field is filled
      if ($(this).val() == "" || $(this).val() == undefined){
        console.log("hahahaha");
        $('#notifier').text("please fill in required fields!");
        return;
      }
    }); 

    username = $('#username');
    password = $('#password');
    password_confirm = $('#password-confirm');

    // check if the passwords are the same
    if (password.val() != password_confirm.val()){
      $('#notifier').text("please enter the same password!");
      return;
    }

    var username_email = username.val() + "@pedal.com";
    var user = Built.App('blt6f9b218391b44387').User();
    user
    .register(username_email, password.val(), password_confirm.val())
    .then(function(user) {
      //login for updating business id
      user
      .login(username_email, password.val())
      .then(function(user) {
          // user logged in successfully
          console.log("logged in");
      }, function(error) {
          console.log("cannot login");
          console.log(username_email);
          console.log(password.val());
          // some error has occurred
          // refer to the 'error' object for more details
      });
        console.log(user.toJSON());
    }, function(error) {
        console.log(error);
        $('#notifier').text("something wrong with your username or password.");
        // some error has occurred
        // refer to the 'error' object for more details
    });

    // retrive hours
    var table = $('.table td');
    var day = "sun";
    var hours = {};
    for (var i = 0; i < table.length; i++){
          if (i%3 == 0){
            day = $(table[i]).attr('id');
            hours[day] = {'open': '', 'close': ''};
          }else if (i%3 == 1){
            hours[day]['open'] = $(table[i]).find('input').val();
          }else{
            hours[day]['close'] = $(table[i]).find('input').val();
          }
    }
     
    // create business object
    var Business = Built.App('blt6f9b218391b44387').Class('business').Object;
    var business = Business();
    business = business.assign({
      res_name: $('#res_name').val(),
      address: {
                street: $('#street').val(),
                city: $('#city').val(),
                state: $('#state').val()
                },
      phone: $('#phone').val(),
      description: $('#description').val(),
      deals: $('#deals').val(),
      hours: hours
    });

    business
    .save()
    .then(function(business) {
      // object created successfully
      console.log(business.toJSON().uid);
    }, function(err) {
      $('#notifier').text("something is wrong. please check your input!");
    });

    // assign business to the user
    user
    .updateUserProfile({
        business: business.toJSON().uid,
    })
    .then(function(user) {
        // user profile update successfully
        console.log(user.toJSON());
    }, function(error) {
        console.log("cannot wire up");
        // some error has occurred
        // refer to the 'error' object for more details
    });

  });

}
));