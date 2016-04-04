'use strict';

let wiresData;

let getWiresData = new Promise(function(resolve, reject) {
  $.get('./assets/data/wires_basic_data.json', function(data) {
    wiresData = data;
    resolve(data);
  });
});

Promise.all([getMCTemplates, getWiresData])
  .then(function() {
    renderAllQuestions(wiresData, 'wires-basic-q', 'wires-basic', function() {
      $('.wires-basic-q:not(#wires-base)').hide();
      setupListeners();
    });
  });


function setupListeners() {
  $('#wires-basic').on('click', '.wires-basic-q .btn-answer', function(event) {
    event.preventDefault();
    let articleId = $(event.target).parents('.wires-basic-q').attr('id');
    let answer = $(event.target).attr('name');
    // handleWires(articleId, answer);
    handleMC(articleId, answer);

  });

  $('#wires-basic').on('click', '.wires-basic-q .btn-reset', function(event) {
    event.preventDefault();
    $('.wires-basic-q:not(#wires-base)').hide();
    $('#wires-base').fadeIn();
  });

  $('#wires-basic').on('click', '.wires-basic-q .btn-home', function(event) {
    event.preventDefault();
    $(location).attr('href', 'module_menu.html');
  });
}

// function handleWires(articleId, answer) {
//   $('#' + articleId).hide();
//   $('#' + answer).fadeIn();
// }
