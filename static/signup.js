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

    var username_email = username.val() + "@pedal.edu";
    //if user does not exist, create a business object and register the user
    var user = Built.App('blt6f9b218391b44387').User();
    user
    .register(username_email, password.val(), password_confirm.val())
    .then(function(user) {
        // user registered successfully
        console.log(user.toJSON())
    }, function(error) {
        console.log(error);
        // some error has occurred
        // refer to the 'error' object for more details
    });

  });
   
  // function get_data(business_id) {
  //   var business = app.Class('business').Object(business_id);
    
  //   // Retrive data from backend
  //   business.fetch().then(function(business){
  //     var b = business.toJSON();
  //     $('#res_name').val(b.res_name);
  //     $('#street').val(b.address.street);
  //     $('#city').val(b.address.city);
  //     $('#state').val(b.address.state);
  //     $('#phone').val(b.phone);
  //     $('#description').val(b.description);
  //     $('#deals').val(b.deals);

  //     var table = $('.table td');
  //     var day = "sun";
  //     var hours = {};

  //     for (var i = 0; i < table.length; i++){
  //       if (i%3 == 0){
  //         day = $(table[i]).attr('id');
  //       }else if (i%3 == 1){
  //         $(table[i]).find('input').val(b['hours'][day]['open']);
  //       }else{
  //         $(table[i]).find('input').val(b['hours'][day]['close']);          
  //       }
  //     } 

  //     $('#submit-details').click(function(){
  //       for (var i = 0; i < table.length; i++){
  //         if (i%3 == 0){
  //           day = $(table[i]).attr('id');
  //           hours[day] = {'open': '', 'close': ''};
  //         }else if (i%3 == 1){
  //           hours[day]['open'] = $(table[i]).find('input').val();
  //         }else{
  //           hours[day]['close'] = $(table[i]).find('input').val();
  //         }
  //       }
  //       // console.log(hours);
  //       // console.log(b['hours']);

  //       business = business
  //                  .set('res_name', $('#res_name').val())
  //                  .set('address', {
  //                                   'street': $('#street').val(),
  //                                   'city': $('#city').val(),
  //                                   'state': $('#state').val()
  //                                 })
  //                  .set('phone', $('#phone').val())
  //                  .set('description', $('#description').val())
  //                  .set('hours', hours)
  //                  .set('deals', $('#deals').val());

  //       business
  //       .save()
  //       .then(function(business){
  //         console.log(business.toJSON());
  //       }, function(error){
  //         console.log(error);
  //       });
  //     });
      
  //   }, function(error) {
  //   // some error has occurred
  //   // refer to the 'error' object for more details
  //   });
  // };

}
));