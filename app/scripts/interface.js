$(function(){
  
  //var dayofweek = ['sunday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  firebase.auth().onAuthStateChanged(function(user) {
    //console.log(firebase.auth().currentUser);
    if (user) {
      console.log('Interface user:', user.uid);
      var data = firebase.database().ref('users/' + user.uid);
      var dayId, eventId = 0;
      var regEmail = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
      var regPhonoe = /^\d{3}(-\d{3}-|\d{3})\d{4}$/;

      data.child('profile_info').once('value')
        .then(function(snapshot) {
          var profile_info = snapshot.val();

            //Set profile fields
            $('#business_name').val(profile_info.business_name);
            $('#address').val(profile_info.address);
            $('#email').val(profile_info.email);
            $('#phone').val(profile_info.phone);
            $('#delivery').prop('checked', profile_info.delivery);

            Materialize.updateTextFields();  //Update input boxes with Materialize
          
        })
        .catch(function(error) {
          console.log(error.message);
        });

      $('.update-profile-btn').on('click tap', function() {
          var businessName = $('#business_name').val();
          var businessAddress = $('#address').val();
          var businessEmail = $('#email').val();
          var businessPhone = $('#phone').val();


        if (isInfoValid(businessName, businessEmail, businessPhone)){
          data.child('profile_info').set({
            business_name: businessName,
            address: businessAddress,
            email: businessEmail,
            phone: businessPhone,
            delivery: $('#delivery').is(':checked'),
          })
          .then(function(){
            Materialize.toast('Profile record updated!', 3000);
          })
          .catch(function(error){
            console.log(error.message);
          })
        }
      });

      $('.add_deal').on('click tap', function(e) {
        $('.btn-add').css("display", "inline");
        $('.btn-edit').css("display", "none");
        $('#deal_modal').openModal();
        //console.log($(e.target)[0]);
        dayId = $(e.target).data("dayId");
      });

      $('.add_event').on('click tap', function(e) {
        $('#event_modal').openModal();
        dayId = $(e.target).data("dayId");
      });

      $('#deal_modal').find('.modal-action').on('click tap', function(){
        if (0 <= dayId && dayId < 7) {
          data.child('specials/deal/' + dayId).push({
            item: $('#item_name').val(),
            price: $('#item_price').val(),
            start: $('#deal_start').text(),
            end: $('#deal_end').text()

          }).then(function() {
            Materialize.toast('Deal added!', 3000);
            $('#deal_modal').closeModal();
            $('#item_name').val('');
            $('#item_price').val('');   
          }).catch(function() {
            console.log('There was an error.');
          });
        }
        else {
          console.log('No dayId specified.');
        }
      });

      //Add event to Firebase
      $('#event_modal').find('.modal-action').on('click tap', function(){
        if (0 <= dayId && dayId < 7) {
          data.child('specials/event/' + dayId).push({
            title: $('#event_title').val(),
            content: $('#event_content').val(),
            start: $('#deal_start').text(),
            end: $('#deal_end').text()
          }).then(function() {
            Materialize.toast('Event added!', 3000);
            $('#event_modal').closeModal();
            $('#event_title').val('');
            $('#event_content').val('');   
          }).catch(function() {
            console.log('There was an error.');
          });
        }
        else {
          console.log('No dayId specified.');
        }
      });

      data.child('specials/').on('value', function(snapshot) {
        var deals = snapshot.child('deal').val();
        var events = snapshot.child('event').val();

        for (var i = 0; i < 7; i++) {
          //every day
          var day = $('.event_list[data-day-id=' + i + ']')[0];
          var daily_deals = null;
          var daily_events = null;
          if (deals && i in deals) {
            daily_deals = deals[i];
          }
          if (events && i in events) {
            daily_events = events[i];
          }
          var new_list = createNewList(daily_deals, daily_events, i);
          day.replaceChild(new_list, day.children[0]);
        }
      });

      //function formatSpecials
      function createNewList(deals, events, day_id) {
        var list = document.createElement('ul');
        for (var deal_id in deals) {
          var card = formatDealCard(deal_id, deals[deal_id]);
          $(card).find('.card').addClass('orange lighten-2');    //change color
          list.appendChild(card);

          //Delete Listener
          $(card).find('.delete_event').on('click tap', function(){
            dealId = $(this).data("dealId");
            data.child('specials/deal/' + day_id + '/' + dealId).remove();
          });

          //edit deal card
          $(card).find('.card').on('click tap', function(){
            var cardId = $(this).data("cardId");
            var cardRef = 'specials/deal/' + day_id + '/' + cardId;
            $('.btn-add').css("display", "none");
            $('.btn-edit').css("display", "inline");

            // open and set fields on modal
            $('#deal_modal').openModal();
            data.child(cardRef).once('value')
            .then(function(snapshot) {
              var deal_info = snapshot.val();
              console.log(snapshot.val());
                $('#item_name').val(deal_info.item);
                $('#item_price').val(deal_info.price);
                Materialize.updateTextFields();  //Update input boxes with Materialize
            })
            .catch(function(error) {
              console.log(error.message);
            });


            // edit deal save button
            $('#deal_modal').find('.modal-action-edit').on('click tap', function(){
              
              data.child(cardRef).set({
                  item: $('#item_name').val(),
                  price: $('#item_price').val(),
                })
                .then(function(){
                  Materialize.toast('Deal updated!', 3000);
                  $('#deal_modal').closeModal();
                })
                .catch(function(error){
                  console.log(error.message);
                })
            });

          });
        }

        for (var event_id in events) {
          var card = formatEventCard(event_id, events[event_id]);
          $(card).find('.card').addClass('purple lighten-2');    //change color
          list.appendChild(card);

          //Delete Listener
          $(card).find('.delete_event').on('click tap', function(){
            eventId = $(this).data("eventId");
            //console.log('Deleted: ' + 'specials/event/' + day_id + '/' + eventId);
            data.child('specials/event/' + day_id + '/' + eventId).remove();
          });
        }
        return list;
      }

      // business profile validation
      function isInfoValid(name, email, phone){
        if (!name){
          Materialize.toast('Please enter a business name!', 3000);
          return false;
        }
        if (!regEmail.test(email)){
          Materialize.toast('Please enter a valid email!', 3000);
          return false;
        }
        if (!regPhonoe.test(phone)){
          Materialize.toast('Please enter a valid phone number!', 3000);
          return false;
        }
        return true;
      }

      // edit deal card when card is clicked
      function editDealCard(){}

      // edit event card when card is clicked
      function editEventCard(){}

      function formatDealCard(card_id, card) {
        var formatted_card = document.createElement('li');
        formatted_card.innerHTML = '<div class="card hoverable" data-card-id='+ card_id +'>' +

                        '<i class="material-icons delete_event" data-deal-id='+ card_id +'>delete</i>' + 
                
                        '<h6 class="card-title center-align">Deal</h6>' +
                        '<div class="card-content">' + card.item + ' for $' + card.price + '</div>' +
                        '</div>';
        return formatted_card;
      }

      //generate a card with data
      function formatEventCard(card_id, card) {
        var formatted_card = document.createElement('li');
        formatted_card.innerHTML = '<div class="card hoverable" data-card-id='+ card_id +'>' + 
                        '<h6 class="card-title center-align">' + card.title + '</h6>' + 
                        '<div class="card-content">' + 
                          '<p class="truncate">' + card.content + '</p>' + 
                        '</div>' +
                        '<div class="right-align">' + 
                          '<i class="material-icons delete_event" data-event-id='+ card_id +'>delete</i>' + 
                        '</div>' +
                        '</div>';
        return formatted_card;
      }
    } 
  });
});