// IIFE - Immediately Invoked Function Expression
(function(main) {

  // The global jQuery object is passed as a parameter
  main(window.jQuery, window, document);

}(function($, window, document) {

  // The $ is now locally scoped 

  // Listen for the jQuery ready event on the document
  $(function() {

    // The DOM is ready!
    $("#detail-form").hide();

  });

  // The rest of the code goes here!
  // 'blt5d4sample2633b' is a dummy Application API key
  var app = Built.App('blt6f9b218391b44387');
  var user = app.User();

  function get_data(business_id) {
    var business = app.Class('business').Object(business_id);
    
    business.fetch().then(function(business){
      var b = business.toJSON();
      $('#res_name').val(b.res_name);
      $('#street').val(b.address.street);
      $('#city').val(b.address.city);
      $('#state').val(b.address.state);
      $('#phone').val(b.phone);
      $('#description').val(b.description);
      $('#deals').val(b.deals);

      var table = $('.table td');
      var day = "sun";
      var hours = {};

      for (var i = 0; i < table.length; i++){
        if (i%3 == 0){
          day = $(table[i]).attr('id');
        }else if (i%3 == 1){
          $(table[i]).find('input').val(b['hours'][day]['open']);
        }else{
          $(table[i]).find('input').val(b['hours'][day]['close']);          
        }
      } 

      $('#submit-details').click(function(){
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
        // console.log(hours);
        // console.log(b['hours']);

        business = business
                   .set('res_name', escape($('#res_name').val()))
                   .set('address', {
                                    'street': escape($('#street').val()),
                                    'city': escape($('#city').val()),
                                    'state': escape($('#state').val()),
                                    'zipcode': $('#zipcode').val()
                                  })
                   .set('phone', $('#phone').val())
                   .set('description', $('#description').val())
                   .set('hours', hours)
                   .set('deals', $('#deals').val());

        business
        .save()
        .then(function(business){
          console.log(business.toJSON());
        }, function(error){
          console.log(error);
        });
      });
      
    }, function(error) {
    // some error has occurred
    // refer to the 'error' object for more details
    });
  };

  $('#login-btn').click(function(){
    var business_name = escape($('#username').val() + "@pedal.com");
    var password = $('#password').val();
    user
    .login(business_name, password)
    .then(function(user) {
        // user logged in successfully
        var business_id = user.toJSON().business[0];
        $("#login-modal").hide();
        $("#detail-form").show();
        var table = $('.table td input');
        for (var i = 0; i < table.length; i++){
          $(table[i]).timepicker();
        }
        get_data(business_id);
    }, function(error) {
        // some error has occurred
        // refer to the 'error' object for more details
        console.log(error);
    });
  });




}
));