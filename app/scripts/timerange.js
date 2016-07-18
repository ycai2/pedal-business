$(document).ready(function() {

  createRangeSlider(
    document.getElementById('deal_time_range'), 
    document.getElementById('deal_start'),
    document.getElementById('deal_end')
  );
  
  createRangeSlider(
    document.getElementById('event_time_range'),
    document.getElementById('event_start'),
    document.getElementById('event_end')
  );

  function createRangeSlider(range, start, end) {
    var slider = range;
    var slider_val = [start, end];

    noUiSlider.create(slider, {
      start: [20, 116],
      connect: true,
      step: 1,
      range: {
        'min': 20,
        'max': 116
      },
      format: wNumb({
        decimals: 0
      }),
      tooltips: false
    });

    slider.noUiSlider.on('update', function(values, handle){
      slider_val[handle].innerHTML = formatTime(values[handle]);
    });
  }

  function formatTime(time) {
    time %= 96
    if (time >= 0 && time <= 96 ) {
      var p = time < 48 ? "am" : "pm"; 
      var hour = Math.floor(time/4) % 12;
      if (hour == 0) {
        hour = "12";
      }
      else if (hour < 10) {
        hour = "0" + hour;
      }
      var min = (time%4) * 15;
      min = min < 10 ? "0"+min : min;
      return hour + ":" + min + " " + p;
    } else {
      return "invalid";
    }
  }

});