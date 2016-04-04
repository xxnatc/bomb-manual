'use strict';

let baseUri = './assets';
let menuTemplate, menuData;
let getMenuTemplate = new Promise(function(resolve, reject) {
  $.get(baseUri + '/templates/module_menu_template.html', function(data) {
    menuTemplate = Handlebars.compile(data);
    resolve();
  });
});

let getMenuData = new Promise(function(resolve, reject) {
  $.get(baseUri + '/data/module_menu_data.json', function(data) {
    menuData = data;
    resolve(data);
  });
});

Promise.all([getMenuTemplate, getMenuData])
  .then(renderMenuItems);

function renderMenuItems() {
  for (let key in menuData) {
    let html = menuTemplate(menuData[key]);
    $('#module-menu-container').append(html);
  }
}
