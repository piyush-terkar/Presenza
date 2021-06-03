// const datepicker = document.querySelector('.datepicker');
// const button = document.querySelector('#button');
// const tbody = document.querySelector('.tbody');
// const download = document.querySelector('.btn')



// const div = document.createElement('div');

// datepicker.pickadate({
//     today: '',
//     clear: 'Clear selection',
//     close: 'Cancel'
// });

// button.addEventListener('onclick', function (e) {
//     div.innerHTML = 'Hello';
//     document.append(div)
// })
const jQuery = require('jquery')
const table2excel = require('table2excel')
const tableId = document.querySelector('#tb');


function tableToExcel() {
    $("#tb").table2excel({
        filename: "Attendence.xls",
        name: "Worksheet"
    });

}

