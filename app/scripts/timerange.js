function createRangeSlider(range, start_elm, end_elm) {
  var slider = range;
  var slider_val = [start_elm, end_elm];

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

  return slider
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

function setTimeRange(slider, start, end) {
  var decoded_start, decoded_end;
  decoded_start = decodeTime(start);
  decoded_end = decodeTime(end);
  slider.noUiSlider.set([decoded_start, decoded_end]);
}

function decodeTime(time) {
  var p = time.split(' ')[1];
  var start = time.substring(0, 2);
  var end = time.substring(3, 5);
  var result = parseInt(start) * 4 + Math.floor(parseInt(end) / 15);
  if (p == 'pm') {
    result += 48;
  }
  return result;
}
