'use strict';

let wiresData;

let getWiresData = new Promise(function(resolve, reject) {
  $.get('./assets/data/wires_basic_data.json', function(data) {
    wiresData = data;
    resolve(data);
  });
});

let wiresSetup = Promise.all([getMCTemplates, getWiresData])
  .then(function() {
    $('#wires-basic').hide();
    renderAllQuestions(wiresData, 'wires-basic-q', 'wires-basic', function() {
      setupWiresListeners();
      // $('.wires-basic-q:not(#wires-base)').hide();
    });
  });

function setupWiresListeners() {
  $('#wires-basic').on('click', '.wires-basic-q .btn-answer', function(event) {
    event.preventDefault();
    let articleId = $(event.target).parents('.wires-basic-q').attr('id');
    let answer = $(event.target).attr('name');
    handleMC(articleId, answer);
  });

  $('#wires-basic').on('click', '.wires-basic-q .btn-reset', function(event) {
    event.preventDefault();
    initWiresModule();
  });

  $('#wires-basic').on('click', '.wires-basic-q .btn-home', function(event) {
    event.preventDefault();
    $(location).attr('href', 'module_menu.html');
  });
}

function initWiresModule() {
  $('.wires-basic-q:not(#wires-base)').hide();
  $('#wires-basic').show();
  $('#wires-base').fadeIn();
}

wiresSetup.then(initWiresModule);
