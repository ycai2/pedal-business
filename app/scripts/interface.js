$(function(){
  
  //var dayofweek = ['sunday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  firebase.auth().onAuthStateChanged(function(user) {
    //console.log(firebase.auth().currentUser);
    if (user) {
      console.log('Interface user:', user.uid);
      var data = firebase.database().ref('users/' + user.uid);
      var dayId, eventId = 0;

      data.child('profile_info').once('value')
        .then(function(snapshot) {
          var profile_info = snapshot.val();
          

          //Set profile fields
          $('#business_name').val(profile_info.business_name);
          $('#address').val(profile_info.address);
          $('#email').val(profile_info.email);
          $('#phone').val(profile_info.phone);
          $('#delivery').prop('checked', true);

          Materialize.updateTextFields();  //Update input boxes with Materialize
        })
        .catch(function(error) {
          console.log(error.message);
        });

      $('.update-profile-btn').on('click tap', function() {
        data.child('profile_info').set({
          business_name: $('#business_name').val(),
          address: $('#address').val(),
          email: $('#email').val(),
          phone: $('#phone').val(),
          delivery: $('#delivery').is(':checked'),
        })
        .then(function(){
          Materialize.toast('Profile record updated!', 3000);
        })
        .catch(function(error){
          console.log(error.message);
        })
      });

      $('.add_event').on('click tap', function(e) {
        $('#event_modal').openModal();
        //console.log($(e.target).data("dayId"));
        dayId = $(e.target).data("dayId");
      });


      //Add event to Firebase
      $('.modal-action').on('click tap', function(){
        //console.log($('#event-type').val());
        var type = $("input[name=event_type]:checked").val();
        //console.log(type);

        if (!type) {
          Materialize.toast('Please choose a type. ', 3000);
        } else {
          if (0 <= dayId && dayId < 7) {
            data.child('specials/' + type +'/' + dayId).push({
              title: $('#event_title').val(),
              content: $('#event_content').val()

            }).then(function() {
              Materialize.toast('Event added!', 3000);
              $('#event_title').val('');
              $('#event_content').val(''); 
              $('#event_modal').closeModal();

            }).catch(function() {
              console.log('There was an error.');
            });
          }
          else {
            console.log('No dayId specified.');
          }
        }
      });



      data.child('specials/').on('value', function(snapshot) {
        

        var deals = snapshot.child('deal').val();
        var events = snapshot.child('event').val();
        // console.log(deals);
        // console.log(events);
        // if (snapshot.val()) {
        //   updateSchedule(snapshot.val());
        // }

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
          var card = formatCard(deal_id, deals[deal_id]);
          $(card).find('.card').addClass('orange lighten-2');    //change color
          list.appendChild(card);

          //Delete Listener
          $(card).find('.delete_event').on('click tap', function(){
            dealId = $(this).data("eventId");
            data.child('specials/deal/' + day_id + '/' + dealId).remove();
          });
        }
        for (var event_id in events) {
          var card = formatCard(event_id, events[event_id]);
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
      


      function formatCard(card_id, card) {
        var formatted_card = document.createElement('li');
        formatted_card.innerHTML = '<div class="card">' + 
                        '<h6 class="card-title center-align">' + card.title + '</h6>' + 
                        '<div class="card-content">' + 
                          '<p>' + card.content + '</p>' + 
                          //'<a class="waves-effect waves-light btn delete_event" data-event-id='+ card_id +'>Delete</a>' +
                          
                        '</div>' +
                        '<div class="right-align">' + 
                        '<i class="material-icons delete_event" data-event-id='+ card_id +'>delete</i>' + 
                        '</div>';
        return formatted_card;
      }
    } 
  });
});