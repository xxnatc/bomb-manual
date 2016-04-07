'use strict';

let wcData;

let wiresCompSetup = new Promise(function(resolve, reject) {
  $('#wires-comp').hide();
  $.get('./assets/data/wires_comp_data.json', function(data) {
    wcData = data;
    resolve();
  });
});

function initWiresCompModule() {
  $('#wires-comp').show();
}

let wiresComp = {};
wiresComp.current = {
  red: false,
  blue: false,
  star: false,
  led: false
};

wiresComp.getLabel = function() {
  return wcData.readOrder.map((el) => (this.current[el]) ? 'T' : 'F').join('');
};

wiresComp.getInstructions = function() {
  let label = this.getLabel();
  let vennResults = wcData.venn[label];
  return wcData.instructions[vennResults];
};

$('.wc-form .checkbox').checkbox({
  onChecked: function() {
    let prop = $(this).data().wcProp;
    wiresComp.current[prop] = !wiresComp.current[prop];
    // console.log(wiresComp.current);
  }
});

$('.wc-form').on('click', '#wc-run', function(event) {
  event.preventDefault();
  let instructions = wiresComp.getInstructions();
  $('#wc-results-default').hide();
  $('#wc-results-custom').html($('<h2>').text(instructions)).fadeIn();
});

$('.wc-form').on('click', '#wc-reset', function(event) {
  event.preventDefault();
  for (let key in wiresComp.current) {
    wiresComp.current[key] = false;
  }
  $('.wc-form .checkbox').checkbox('set unchecked');
  $('#wc-results-custom').hide();
  $('#wc-results-default').show();
});

wiresCompSetup.then(initWiresCompModule);
