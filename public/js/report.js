const datepicker = document.querySelector('.datepicker');
const button = document.querySelector('#button');
const tbody = document.querySelector('.tbody');

const div = document.createElement('div');

datepicker.pickadate({
    today: '',
    clear: 'Clear selection',
    close: 'Cancel'
});

button.addEventListener.click(function () {
    {
        div.innerHTML = "Hello";
        tbody.append(div);
    }
})