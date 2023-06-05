const groups = ["N102", "N103", "N110", "N122"];
const places = ["Toshkent", "Farg'ona", "Andijon", "Namangan", "Samarqand", "Buxoro", "Qashqadaryo", "Xorazm", "Surxandaryo", "Jizzax"];
const fields = ["Web-Dasturlash", "Frontend", "Backend", "Web-dizayn", "SMM"]
let pupils = JSON.parse(localStorage.getItem("pupils")) || [];
let selected = null;
let selectedGroup = "all";
let selectedPlace = "all";
let search = "";

const pupilGroup = document.getElementById("pupilGroup");
const pupilPlace = document.getElementById("pupilPlace");
const pupilField = document.getElementById("pupilField");
const pupilForm = document.getElementById("pupilForm");
const pupilModal = document.getElementById("pupilModal");
const pupilsTable = document.getElementById("pupilsTable");
const addBtn = document.getElementById("add-button");
const sendBtn = document.getElementById("send-button");
const filterGroup = document.getElementById("filterGroup");
const filterPlace = document.getElementById("filterPlace");
const searchInput = document.getElementById("search");

// pupil groups

function getPupilGroups() {
  filterGroup.innerHTML = `<option value="all">Guruhni tanlang</option>`;
  groups.forEach((gr) => {
    pupilGroup.innerHTML += `<option value=${gr}>${gr}</option>`;
    filterGroup.innerHTML += `<option value=${gr}>${gr}</option>`;
  });
}
getPupilGroups();

// pupil places

function getPupilPlaces() {
  filterPlace.innerHTML = `<option value="all">Manzilni tanlang</option>`;
  places.forEach((gr) => {
    pupilPlace.innerHTML += `<option value=${gr}>${gr}</option>`;
    filterPlace.innerHTML += `<option value=${gr}>${gr}</option>`;
  });
}
getPupilPlaces();

// pupil fields

function getPupilFields() {
  fields.forEach((gr) => {
    pupilField.innerHTML += `<option value=${gr}>${gr}</option>`;
  });
}
getPupilFields();

// pupils row

function getPupilRow({ firstName, lastName, address, group, place, date, field, hasWork, hasFam, id }) {
  return `<tr>
    <th scope="row">${id + 1}</th>
    <td>${firstName}</td>
    <td>${lastName}</td>
    <td>${address}</td>
    <td>${group}</td>
    <td>${place}</td>
    <td>${date}</td>
    <td>${field}</td>
    <td>${hasWork ? "Ha" : "Yo'q"}</td>
    <td>${hasFam ? "Ha" : "Yo'q"}</td>
    <td class="text-end">
      <button
        class="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#pupilModal"
        onClick="editPupil(${id})"
      >
        Edit
      </button>
      <button class="btn btn-danger" onClick="deletePupil(${id})">Delete</button>
    </td>
  </tr>
  `;
}

function getPupils() {
  pupilsTable.innerHTML = "";
  let filteredPupils = pupils;
  if (selectedGroup !== "all" && selectedPlace !== "all") {
    filteredPupils = pupils.filter((p) => p.group === selectedGroup);
    filteredPupils = pupils.filter((p) => p.place === selectedPlace);
  }
  filteredPupils = filteredPupils.filter(
    (p) =>
      p.firstName.toLowerCase().includes(search.toLowerCase()) ||
      p.lastName.toLowerCase().includes(search.toLowerCase())
  );
  if (filteredPupils.length !== 0) {
    filteredPupils.forEach((pupil, i) => {
      pupilsTable.innerHTML += getPupilRow({ ...pupil, id: i });
    });
  } else {
    pupilsTable.innerHTML = `<tr><td colspan="12"><div class="w-100 alert alert-info text-center" role="alert">O'quvchilar mavjud emas</div></td></tr>`;
  }
}

getPupils();

// add and edit

pupilForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (pupilForm.checkValidity()) {
    let pupil = {
      firstName: pupilForm[1].value,
      lastName: pupilForm[2].value,
      address: pupilForm[3].value,
      group: pupilForm[4].value,
      place: pupilForm[5].value,
      date: pupilForm[6].value,
      field: pupilForm[7].value,
      hasWork: pupilForm[8].checked,
      hasFam: pupilForm[9].checked,
    };
    if (selected || selected === 0) {
      pupils = pupils.map((p, i) => {
        if (i === selected) {
          return pupil;
        } else {
          return p;
        }
      });
    } else {
      pupils.push(pupil);
    }
    getPupilsLocalStorage();
    bootstrap.Modal.getInstance(pupilModal).hide();
  } else {
    pupilForm.classList.add("was-validated");
  }
});

function getPupilsLocalStorage() {
  getPupils();
  localStorage.setItem("pupils", JSON.stringify(pupils));
}

addBtn.addEventListener("click", () => {
  pupilForm[1].value = "";
  pupilForm[2].value = "";
  pupilForm[3].value = "";
  pupilForm[4].value = groups[0];
  pupilForm[5].value = places[0];
  pupilForm[6].value = "";
  pupilForm[7].value = fields[0];
  pupilForm[8].checked = false;
  pupilForm[9].checked = false;
  sendBtn.innerHTML = "Qo'shish";
  selected = null;
});

function editPupil(id) {
  selected = id;
  let pupil = pupils[id];
  pupilForm[1].value = pupil.firstName;
  pupilForm[2].value = pupil.lastName;
  pupilForm[3].value = pupil.group;
  pupilForm[4].value = pupil.place;
  pupilForm[5].value = pupil.date;
  pupilForm[6].value = pupil.field;
  pupilForm[7].checked = pupil.hasWork;
  pupilForm[8].checked = pupil.hasFam;
  sendBtn.innerHTML = "Saqlash";
}

function deletePupil(id) {
  let check = confirm(`Do you want to delete pupil with ${id}`);
  if (check) {
    pupils = pupils.filter((p, i) => i !== id);
    getPupilsLocalStorage();
  }
}

// filter by group

filterGroup.addEventListener("change", function () {
  selectedGroup = this.value;
  getPupils();
});

filterPlace.addEventListener("change", function () {
  selectedPlace = this.value;
  getPupils();
});

searchInput.addEventListener("input", function () {
  search = this.value;
  getPupils();
});
