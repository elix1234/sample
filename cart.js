document.addEventListener("DOMContentLoaded", function () {
    let cart = [];
    function displayCart() {
        const cartModalBody = document.getElementById("cartModalBody");
        cartModalBody.innerHTML = "";
        let totalPrice = 0;
        cart.forEach(item => {
            const row = document.createElement("div");
            row.classList.add("row", "mb-2");
            const itemName = document.createElement("div");
            itemName.classList.add("col-6");
            itemName.textContent = item.name;
            row.appendChild(itemName);
            const itemPrice = document.createElement("div");
            itemPrice.classList.add("col-6", "text-end");
            itemPrice.textContent = `$${item.price.toFixed(2)}`;
            row.appendChild(itemPrice);
            cartModalBody.appendChild(row);
            totalPrice += item.price;
        });
        const totalRow = document.createElement("div");
        totalRow.classList.add("row", "mt-4");
        const totalLabel = document.createElement("div");
        totalLabel.classList.add("col-6", "fw-bold");
        totalLabel.textContent = "Total:";
        totalRow.appendChild(totalLabel);
        const totalPriceElement = document.createElement("div");
        totalPriceElement.classList.add("col-6", "text-end");
        totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
        totalRow.appendChild(totalPriceElement);
        cartModalBody.appendChild(totalRow);
    }
    const addToCartButtons = document.querySelectorAll(".btn.signin");
    addToCartButtons.forEach(button => {
        button.addEventListener("click", function (e) {
            e.preventDefault();
            const card = button.closest(".card");
            const productName = card.querySelector(".card-title").textContent.trim();
            const productPrice = parseFloat(button.textContent.replace("$", ""));
            cart.push({ name: productName, price: productPrice });
            displayCart();
        });
    });
    const cartModal = new bootstrap.Modal(document.getElementById("cartModal"));
    const viewCartButton = document.getElementById("viewCartButton");
    viewCartButton.addEventListener("click", function () {
        displayCart();
        cartModal.show();
    });
    const placeOrderButton = document.getElementById("placeOrderButton");
    if (placeOrderButton) {
        placeOrderButton.addEventListener("click", function () {
            cart = [];
            displayCart();
            alert("Order placed successfully!");
        });
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const contactForm = document.getElementById("contactForm");
    const dbName = "BookedAppointmentsDB";
    const dbRequest = indexedDB.open(dbName, 1);
    dbRequest.onupgradeneeded = function (event) {
        const db = event.target.result;
        db.createObjectStore("bookedAppointments", { keyPath: "id", autoIncrement: true });
    };
    dbRequest.onsuccess = function (event) {
        const db = event.target.result;
        contactForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const phone = document.getElementById("phone").value;
            const transaction = db.transaction(["bookedAppointments"], "readwrite");
            const store = transaction.objectStore("bookedAppointments");
            const appointmentData = { name: name, email: email, phone: phone };
            store.add(appointmentData);
            displayBookedAppointments();
        });
        function displayBookedAppointments() {
            const transaction = db.transaction(["bookedAppointments"], "readonly");
            const store = transaction.objectStore("bookedAppointments");
            const tableBody = document.getElementById("bookedAppointmentsTableBody");
            tableBody.innerHTML = "";
            const request = store.openCursor();
            request.onsuccess = function (event) {
                const cursor = event.target.result;
                if (cursor) {
                    const row = tableBody.insertRow();
                    row.insertCell(0).textContent = cursor.value.name;
                    row.insertCell(1).textContent = cursor.value.email;
                    row.insertCell(2).textContent = cursor.value.phone;
                    cursor.continue();
                }
            };
        }
        displayBookedAppointments();
    };
    dbRequest.onerror = function (event) {
        console.error("Error opening IndexedDB:", event.target.error);
    };
});
