const search = document.querySelector(".search-container");
const gallery = document.querySelector(".gallery");
const body = document.body;
let employeeList = [];


// Fetches employees from API and displays them
fetch("https://randomuser.me/api/?results=12&nat=us&inc=name,picture,email,location,phone,dob")
    .then(response => response.json())
    .then(data => {
        employeeList = data.results;

        generateCard(employeeList)
    });

// Creates search bar
const searchHTML = `
    <form action="#" method="get">
        <input type="search" id="search-input" class="search-input" placeholder="Search...">
        <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>`;
search.insertAdjacentHTML("beforeend", searchHTML);

const searchInput = document.getElementById("search-input");
function searchEmployees(input, data) {
    const employeeMatch = [];
    data.filter( person => {
        if ((person.name.first.toLowerCase().includes(searchInput.value.toLowerCase())) || (person.name.last.toLowerCase().includes(searchInput.value.toLowerCase()))) {
            employeeMatch.push(person);
        }
    });
    generateCard(employeeMatch);
}

search.addEventListener("keyup", () => {
    searchEmployees(searchInput, employeeList);
});

// This function creates a card for each employee generated from the API
function generateCard(data) {
    gallery.innerHTML = "";
    data.map((person, id) => {
        const html = `
            <div class="card" data-index=${id}>
                <div class="card-img-container">
                    <img class="card-img" src="${person.picture.large}" alt="profile picture">
                </div>
                <div class="card-info-container">
                    <h3 id="name" class="card-name cap">${person.name.first} ${person.name.last}</h3>
                    <p class="card-text">${person.email}</p>
                    <p class="card-text cap">${person.location.city}, ${person.location.state}</p>
                </div>
            </div>
            `;

        gallery.insertAdjacentHTML("beforeend", html);
    });
};

// Shows modal for the employee that is clicked on
body.addEventListener("click", e => {
        if (e.target.closest(".card")) {
            let card = e.target.closest(".card");
            let id = card.getAttribute("data-index");
            generateModal(id);
        }
});

// Adds HTML to generate the modal for the employee that is clicked on
function generateModal(id) {
    let employee = employeeList[id];
    const birthday = new Date(employee.dob.date);
    const day = birthday.getDate();
    const month = birthday.getMonth() + 1;
    const year = birthday.getFullYear();

    const html = `
        <div class="modal-container">
            <div class="modal">
                <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                <div class="modal-info-container">
                    <img class="modal-img" src=${employee.picture.large} alt="profile picture">
                    <h3 id="name" class="modal-name cap">${employee.name.first} ${employee.name.last}</h3>
                    <p class="modal-text">${employee.email}</p>
                    <p class="modal-text cap">${employee.location.city}</p>
                    <hr>
                    <p class="modal-text">${employee.phone}</p>
                    <p class="modal-text">${employee.location.street.number} ${employee.location.street.name}, ${employee.location.city}, ${employee.location.state} ${employee.location.postcode}</p>
                    <p class="modal-text">Birthday: ${month}/${day}/${year}</p>
                </div>
            </div>
            <div class="modal-btn-container">
                <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                <button type="button" id="modal-next" class="modal-next btn">Next</button>
            </div>
        </div>
        `;

    gallery.insertAdjacentHTML("beforeend", html);

    // Closes the modal when the user clicks the close button
    const modalClose = document.getElementById("modal-close-btn");
    const modal = document.querySelector(".modal-container");
    modalClose.addEventListener("click", () => {
        modal.remove();
    });

    // When next button in modal is clicked it goes to next employee
    const nextBtn = document.getElementById("modal-next");
    nextBtn.addEventListener("click", () => {
        modal.remove();
        id++;
        if (id < employeeList.length) {
            generateModal(id);
        } else {
            generateModal(0);
        }
    });

    // When previous button in modal is clicked it goes to next employee
    const prevBtn = document.getElementById("modal-prev");
    prevBtn.addEventListener("click", () => {
        modal.remove();
        id--;
        if (id < 0) {
            generateModal(11);
        } else {
            generateModal(id);
        }
    });
};
