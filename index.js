function handleFormSubmit(event) {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Retrieve values from form inputs
    const expenseAmount = document.getElementById("amount").value;
    const description = document.getElementById("des").value;
    const category = document.getElementById("category").value;

    // Create an expense object using thse retrieved values
    const expense = {
        id: Date.now(),
        expenseAmount,
        description,
        category
    };

    // Save the expense to local storage using the saveExpense function
    saveExpense(expense);

    // Call the add function 
    add();
}


function saveExpense(expense) {
    // Step 1: Retrieve existing expense array from local storage or initialize an empty array
    let myArray = JSON.parse(localStorage.getItem('my-array')) || [];

    // Step 2: Add the new expense to the array
    myArray.push(expense);

     // Step 3: Save the updated array back to local storage
    localStorage.setItem('my-array', JSON.stringify(myArray));
}

function deleteExpense(id) {
    let myArray = JSON.parse(localStorage.getItem('my-array')) || [];
    myArray = myArray.filter(expense => expense.id !== id);
    localStorage.setItem('my-array', JSON.stringify(myArray));
    add();
}

function editExpense(id) {
    // Retrieve the expense by id
    let myArray = JSON.parse(localStorage.getItem('my-array')) || [];
    const expense = myArray.find(expense => expense.id === id);

    // Create an edit form dynamically
    const editForm = document.createElement('form');
    editForm.innerHTML = `
        <h2>Edit Expense</h2>
        <label for="editedAmount">Amount:</label>
        <input type="number" id="editedAmount" value="${expense.expenseAmount}" required>
        <br>
        <label for="editedDescription">Description:</label>
        <input type="text" id="editedDescription" value="${expense.description}" required>
        <br>
        <label for="editedCategory">Category:</label>
        <select id="editedCategory" required>
            <option value="movie">Movie</option>
            <option value="fuel">Fuel</option>
            <option value="hotel">Hotel</option>
            <option value="market">Market</option>
        </select>
        <br>
        <button type="button" onclick="saveEdit(${id})">Save</button>
        <button type="button" onclick="cancelEdit()">Cancel</button>
    `;

    // Set the selected option in the category dropdown
    const categorySelect = editForm.querySelector('#editedCategory');
    categorySelect.value = expense.category;

    // Replace the existing content with the edit form
    const listItem = document.getElementById(`expense-${id}`);
    listItem.innerHTML = '';
    listItem.appendChild(editForm);
}


function saveEdit(id) {
    // Retrieve the edited values
    const editedAmount = document.getElementById('editedAmount').value;
    const editedDescription = document.getElementById('editedDescription').value;
    const editedCategory = document.getElementById('editedCategory').value;

    // Update the expense in the array
    let myArray = JSON.parse(localStorage.getItem('my-array')) || [];
    myArray = myArray.map(expense => (expense.id === id ? {
        ...expense,
        expenseAmount: editedAmount,
        description: editedDescription,
        category: editedCategory
    } : expense));  

    // Update local storage
    localStorage.setItem('my-array', JSON.stringify(myArray));

    // Refresh the list
    add();
}

function cancelEdit() {
    // Simply refresh the list to cancel the edit
    add();
}

function add() {
    const myArray = JSON.parse(localStorage.getItem('my-array')) || [];
    const ul = document.getElementById("unorderList");

    // Step 3: Clear the existing content of the <ul> element
    ul.innerHTML = '';

    if (myArray) {
        myArray.forEach(expense => {
            const li = document.createElement("li");
            li.id = `expense-${expense.id}`;
            
            const deleteButton = document.createElement("button");
            deleteButton.textContent = 'Delete';
            deleteButton.type = "button";
            deleteButton.addEventListener('click', function () {
                deleteExpense(expense.id);
            });

            const editButton = document.createElement("button");
            editButton.textContent = 'Edit';
            editButton.type = "button";
            editButton.addEventListener('click', function () {
                editExpense(expense.id);
            });

            li.textContent = `${expense.expenseAmount} - ${expense.description} - ${expense.category}`;

            //Append the 'Delete' and 'Edit' buttons to the <li> element
            li.appendChild(deleteButton);
            li.appendChild(editButton);

            // Append the <li> element to the <ul> element
            ul.appendChild(li);
        });
    }
}

// Call add() on page load to display stored expenses
window.onload = add;

