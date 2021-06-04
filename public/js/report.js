// const datepicker = document.querySelector('.datepicker');
// datepicker.pickadate({
//     today: '',
//     clear: 'Clear selection',
//     close: 'Cancel'
// });



const tableId = document.querySelector('#tb');
function tableToExcel() {
    $("#tb").table2excel({
        filename: "Attendence.xls",
        name: "Worksheet"
    });
}

const button = document.querySelector('#submit');
const from = document.querySelector('#from-date-picker-example');
const to = document.querySelector('#to-date-picker-example');
const tbody = document.querySelector('#display');
const download = document.querySelector('#download');
const thead = document.querySelector('thead');

button.addEventListener('click', async function (e) {
    e.preventDefault();
    remove();
    const config = { begin_date: from.value, last_date: to.value };
    const searchResults = await axios.post('/report', config);

    const tr = document.createElement('tr');
    tr.innerHTML = ` <th scope="col">#</th>
        <th scope="col">Roll No</th>
        <th scope="col">Name</th>
        <th scope="col">Attended On</th>`;
    thead.appendChild(tr);

    let i = 1;
    for (let result of searchResults.data[0]) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
        <th scope="row">${i}</th>
        <td>${result.rollno}</td>
        <td>${result.student_name}</td>
        <td>${result.attend_date}</td>`;
        tbody.appendChild(tr);
        i++;
    }
    download.style.display = "block";




})

function remove() {
    while (thead.firstChild) {
        thead.removeChild(thead.firstChild);
    }
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }
}
