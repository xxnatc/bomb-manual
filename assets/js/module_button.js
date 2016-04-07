'use strict';

let buttonData;

let getButtonData = new Promise(function(resolve, reject) {
  $.get('./assets/data/button_data.json', function(data) {
    buttonData = data;
    resolve();
  });
});

let buttonSetup = Promise.all([getMCTemplates, getButtonData])
  .then(function() {
    renderButtonQuestions();
  });

function renderButtonQuestions() {
  for (let key in buttonData) {
    let current = buttonData[key];
    let answerHtml = '';
    for (let i = 0; i < current.answers.length; i++) {
      answerHtml += aTemplate(current.answers[i]);
    }

    let html = qTemplate({
      articleId: key,
      customClass: 'button-q',
      question: current.question,
      answerHtml: answerHtml
    });

    $('#the-button').append(html);
  }
  $('.button-q, .button-ending').hide();
}

function initButtonModule() {
  let details = {};
  $('.button-q, .button-ending').hide();

  function askDetail(questionId, property, callback) {
    callback = callback || function() {};
    $(questionId)
      .fadeIn()
      .on('click', '.btn-answer', function(event) {
        event.preventDefault();
        $(questionId).off().hide();
        details[property] = $(event.target).text().replace(/"/g, '').toLowerCase();
        callback();
      });
  }

  function askTF(questionId, property, callback) {
    callback = callback || function() {};
    $(questionId)
      .fadeIn()
      .on('click', '.btn-answer', function(event) {
        event.preventDefault();
        $(questionId).off().hide();
        details[property] = Boolean($(event.target).text().toLowerCase() == 'yes');
        callback();
      });
  }

  function showEnding(ending) {
    $('#button-' + ending).show();
  }

  let firstRound = function() {
    return new Promise(function(resolve) {
      askDetail('#button-color', 'color', function() {
        askDetail('#button-text', 'text', resolve);
      });
    });
  };

  let secondRound = function() {
    return new Promise(function(resolve) {
      askDetail('#button-battery', 'battery', resolve);
    });
  };

  let thirdRound = function() {
    return new Promise(function(resolve) {
      askTF('#button-lit-car', 'litCar', resolve);
    });
  };

  let fourthRound = function() {
    return new Promise(function(resolve) {
      askTF('#button-lit-frk', 'litFrk', resolve);
    });
  };

  let startFirstRound = function() {
    firstRound().then(function() {
      console.log(details);
      if (details.color === 'blue' && details.text === 'abort')
        return showEnding('hold');

      startSecondRound();
    });
  };

  let startSecondRound = function() {
    secondRound().then(function() {
      console.log(details);
      if (details.battery !== '0' && details.text === 'detonate')
        return showEnding('immediate');
      if (details.color === 'white')
        return startThirdRound();
      if (details.battery === '2+')
        return startFourthRound();
      if (details.color === 'yellow')
        return showEnding('hold');
      if (details.color === 'red' && details.text === 'hold')
        return showEnding('immediate');

      showEnding('hold');
    });
  };

  let startThirdRound = function() {
    // button must be white
    thirdRound().then(function() {
      console.log(details);
      if (details.litCar)
        return showEnding('hold');
      if (details.battery === '2+')
        return startFourthRound();

      showEnding('hold');
    });
  };

  let startFourthRound = function() {
    // button must have 2+ batteries
    fourthRound().then(function() {
      console.log(details);
      if (details.litFrk)
        return showEnding('immediate');

      showEnding('hold');
    });
  };

  startFirstRound();
}

buttonSetup.then(function() {
  initButtonModule();
});

$('.button-ending').on('click', '.btn-reset', function(event) {
  event.preventDefault();
  initButtonModule();
});

$('.button-ending').on('click', '.btn-home', function(event) {
  event.preventDefault();
  $(location).attr('href', 'module_menu.html');
});
