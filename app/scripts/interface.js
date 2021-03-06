$(function(){
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('Interface user:', user.uid);
      var data = firebase.database().ref('users/' + user.uid);
      var dayId, eventId = 0;
      var deal_range, event_range;

      $('#login-btn').off();

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

      deal_range = createRangeSlider(
        document.getElementById('deal_time_range'), 
        document.getElementById('deal_start'),
        document.getElementById('deal_end')
      );

      event_range = createRangeSlider(
        document.getElementById('event_time_range'),
        document.getElementById('event_start'),
        document.getElementById('event_end')
      );

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
        $('#item_name').val("");
        $('#item_price').val("");
        $('.btn-add').show();
        $('.btn-edit').hide();
        $('#deal_modal').openModal();
        dayId = $(e.target).data("dayId");
      });

      $('.add_event').on('click tap', function(e) {
        $('#event_title').val("");
        $('#event_content').val("");
        $('.btn-add').show();
        $('.btn-edit').hide();
        $('#event_modal').openModal();
        dayId = $(e.target).data("dayId");
      });

      // add deal to firebase
      $('#deal_modal').find('.modal-action').on('click tap', function(){
        var regPrice = /^(\d*\.?\d{0,2})$/;
        if (0 <= dayId && dayId < 7) {
          var item_price = $('#item_price').val();
          var item_name = $('#item_name').val();
          if ((!item_price) || (!item_name)) {
            Materialize.toast('Please enter all fields. ', 3000);
          }
          else if (regPrice.test(item_price)){
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
            Materialize.toast('Please enter a valid price. E.g. “5.00"', 3000);
          }
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

      // update deal 
      $('#deal_modal').find('.modal-action-edit').on('click tap', function(){
        var cardRef = $('#deal_modal').data("editDeal");
        data.child(cardRef).set({
            item: $('#item_name').val(),
            price: $('#item_price').val(),
            start: $('#deal_start').text(),
            end: $('#deal_end').text()
          })
          .then(function(){
            Materialize.toast('Deal updated!', 3000);
            $('#deal_modal').closeModal();
          })
          .catch(function(error){
            console.log(error.message);
          })
      });

      // update event 
      $('#event_modal').find('.modal-action-edit').on('click tap', function(){
        var cardRef = $('#event_modal').data("editEvent");
        data.child(cardRef).set({
            title: $('#event_title').val(),
            content: $('#event_content').val(),
            start: $('#event_start').text(),
            end: $('#event_end').text()
          })
          .then(function(){
            Materialize.toast('Event updated!', 3000);
            $('#event_modal').closeModal();
          })
          .catch(function(error){
            console.log(error.message);
          })
      });

      //function formatSpecials
      function createNewList(deals, events, day_id) {
        var list = document.createElement('ul');
        for (var event_id in events) {
          var card = formatEventCard(event_id, events[event_id]);
          $(card).find('.card').addClass('amber');    //change color
          $(card).find('.card-content').addClass('amber lighten-1');
          list.appendChild(card);

          //Delete 
          $(card).find('.delete_event').on('click tap', function(){
            if (confirm("Are you sure you want to delete this event?")){
              eventId = $(this).data("eventId");
              data.child('specials/event/' + day_id + '/' + eventId).remove();
            }
          });

          //edit event card
          $(card).find('.card-content').on('click tap', function(){
            var cardId = $(this).siblings('i').data("eventId");
            var cardRef = 'specials/event/' + day_id + '/' + cardId;
            $('.btn-add').hide();
            $('.btn-edit').show();

            // open and retrieve fields on modal
            
            data.child(cardRef).once('value')
              .then(function(snapshot) {
                var event_info = snapshot.val();
                  $('#event_title').val(event_info.title);
                  $('#event_content').val(event_info.content);
                  $('#event_modal').data("editEvent", cardRef);
                  Materialize.updateTextFields();  //Update input boxes with Materialize
                  setTimeRange(event_range, event_info.start, event_info.end);

              })
              .catch(function(error) {
                console.log(error.message);
              });
            $('#event_modal').openModal();
          });
        }

        for (var deal_id in deals) {
          var card = formatDealCard(deal_id, deals[deal_id]);
          $(card).find('.card').addClass('green lighten-1');
          $(card).find('.card-content').addClass('green lighten-2');    //change color
          list.appendChild(card);

          //Delete 
          $(card).find('.delete_event').on('click tap', function(){
            if (confirm("Are you sure you want to delete this deal?")){
              dealId = $(this).data("dealId");
              data.child('specials/deal/' + day_id + '/' + dealId).remove();
            }
          });

          //edit deal card
          $(card).find('.card-content').on('click tap', function(){
            var cardId = $(this).siblings('i').data("dealId");
            var cardRef = 'specials/deal/' + day_id + '/' + cardId;
            $('.btn-add').hide();
            $('.btn-edit').show();

            // open and retrieve fields on modal
            
            data.child(cardRef).once('value')
              .then(function(snapshot) {
                var deal_info = snapshot.val();
                $('#item_name').val(deal_info.item);
                $('#item_price').val(deal_info.price);
                $('#deal_modal').data("editDeal", cardRef);
                Materialize.updateTextFields();  //Update input boxes with Materialize
                setTimeRange(deal_range, deal_info.start, deal_info.end);

              })
              .catch(function(error) {
                console.log(error.message);
              });
            $('#deal_modal').openModal(); 
          });
        }
        return list;
      }

      // business profile validation
      function isInfoValid(name, email, phone){
        var regEmail = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
        var regPhonoe = /^\d{3}(-\d{3}-|\d{3})\d{4}$/;

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

      function formatDealCard(card_id, card) {
        var formatted_card = document.createElement('li');
        formatted_card.innerHTML = '<div class="card hoverable">' + 
                        '<h6 class="card-title center-align">' + card.item + ": $" + card.price + '</h6>' +
                        '<div class="card-content">' + 
                          card.start + " - " + card.end + 
                        '</div>' + 
                        '<i class="material-icons delete_event" data-deal-id='+ card_id +'>delete</i>' + 
                      '</div>';
        return formatted_card;
      }

      //generate a card with data
      function formatEventCard(card_id, card) {
        var formatted_card = document.createElement('li');
        formatted_card.innerHTML = '<div class="card hoverable">' + 
                         
                        '<h6 class="card-title center-align">' + card.title + '</h6>' + 
                        '<div class="card-content">' + 
                          
                          '<p class="truncate">' + card.content + '</p>' + 
                          '<div>' + card.start + " - " + card.end + '</div>' +
                        '</div>' +
                        '<i class="material-icons delete_event" data-event-id='+ card_id +'>delete</i>' +
                      '</div>';
        return formatted_card;
      }
    } 
  });
});