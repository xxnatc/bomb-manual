'use strict';

let baseUri = './assets';
let colTemplate, keypadData;

let getColTemplate = new Promise(function(resolve, reject) {
  $.get(baseUri + '/templates/keypad_column_template.html', function(data) {
    colTemplate = Handlebars.compile(data);
    resolve();
  });
});

let getKeypadData = new Promise(function(resolve, reject) {
  $.get('./assets/data/keypad_data.json', function(data) {
    keypadData = data;
    keypadData.positions = keypadData.positions.map(function(col) {
      return col.map(function(num) { return parseInt(num) } );
    });
    resolve();
  });
});

let keypadSetup = Promise.all([getColTemplate, getKeypadData])
  .then(function() {
    $('#module-keypad').hide();
    renderKeypad();
    setupKeypadListeners();
  });

function renderKeypad() {
  let html = colTemplate(keypadData);
  $('#module-keypad').append(html);
}

function setupKeypadListeners() {
  $('#module-keypad').on('click', '.keypad-cell img', function(event) {
    event.preventDefault();
    let $cell = $(event.target);
    let symbolIndex = parseInt($cell.attr('data-symbol'));

    if ($cell.hasClass('selected')) {
      keypad.unselect(symbolIndex);
    } else {
      keypad.select(symbolIndex);
    }
    keypad.checkFour();
  });
}

let keypad = {};

keypad.current = [];

keypad.select = function(index) {
  if (this.current.indexOf(index) === -1) {
    this.current.push(index);
    this.selectAll(index);
  }
};

keypad.unselect = function(index) {
  this.current.splice(this.current.indexOf(index), 1);
  this.unselectAll(index);
};

keypad.selectAll = function(index) {
  $('#module-keypad .keypad-cell')
    .find('img[data-symbol=' + index + ']')
    .each(function(i, el) {
      let $el = $(el).addClass('selected');
    });
};

keypad.unselectAll = function(index) {
  $('#module-keypad .keypad-cell')
    .find('img[data-symbol=' + index + ']')
    .each(function(_, el) {
      let $el = $(el).removeClass('selected confirmed');
    });
};

keypad.checkFour = function() {
  keypadData.positions.forEach((col, i, arr) => {
    let hits = col.filter((cell) => this.current.indexOf(cell) > -1);
    let $col = $('.keypad-column:nth-child(' + (i + 1) + ')');
    if (hits.length >= 4) {
      hits.forEach(function(el) {
        $col.find('img[data-symbol=' + el + ']').addClass('confirmed');
      });
    } else {
      $col.find('img').removeClass('confirmed');
    }
  });
};

function initKeypadModule() {
  keypad.current = [];
  $('#module-keypad .keypad-cell')
    .each(function(_, el) {
      let $el = $(el).removeClass('selected confirmed');
    });

  $('#module-keypad').fadeIn();
}

keypadSetup.then(initKeypadModule);
