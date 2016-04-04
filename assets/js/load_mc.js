'use strict';

let baseUri = './assets';

let qTemplate, aTemplate, eTemplate;
let getQTemplate = new Promise(function(resolve, reject) {
  $.get(baseUri + '/templates/mc_question_template.html', function(data) {
    qTemplate = Handlebars.compile(data);
    resolve();
  });
});

let getATemplate = new Promise(function(resolve, reject) {
  $.get(baseUri + '/templates/mc_answer_template.html', function(data) {
    aTemplate = Handlebars.compile(data);
    resolve();
  });
});

let getETemplate = new Promise(function(resolve, reject) {
  $.get(baseUri + '/templates/mc_ending_template.html', function(data) {
    eTemplate = Handlebars.compile(data);
    resolve();
  });
});

let getMCTemplates = Promise.all([getQTemplate, getATemplate, getETemplate]);


function renderAllQuestions(data, customClass, sectionId, callback) {
  customClass = customClass || '';
  callback = callback || function() {};

  for (let key in data) {
    let current = data[key];
    let html;
    if (current.ending) {
      html = eTemplate({
        articleId: key,
        customClass: customClass,
        ending: current.ending
      });
    } else {
      let answerHtml = '';
      for (let i = 0; i < current.answers.length; i++) {
        answerHtml += aTemplate(current.answers[i]);
      }

      html = qTemplate({
        articleId: key,
        customClass: customClass,
        question: current.question,
        answerHtml: answerHtml
      });
    }
    $('#' + sectionId).append(html);
  }

  callback();
  // $('.wires-basic-q:not(#wires-base)').hide();
  // setupListeners();
}

function handleMC(articleId, answer) {
  $('#' + articleId).hide();
  $('#' + answer).fadeIn();
}
