function handleFormSubmit(event){
    event.preventDefault();
    
    const amount = document.getElementById("amount").value;
    const description = document.getElementById("des").value;
    const category = document.getElementById("category").value;

    const exppense = {
        id: Date.now(),
        amount,
        description,
        category
    }
   
    saveDetails(exppense);
    add();
}

function saveDetails(exppense){
    let myKey = JSON.parse(localStorage.getItem('my-key')) || [];
    myKey.push(exppense);
    localStorage.setItem('my-key', JSON.stringify(myKey));
}

function deleteExpense(id){
    let myKey = JSON.parse(localStorage.getItem('my-key')) || [];
    myKey =  myKey.filter(exppense => exppense.id !== id);
    localStorage.setItem('my-key', JSON.stringify(myKey));
    add();
}

function editExpense(id) {
    // Retrieve the expense by id
    let myKey = JSON.parse(localStorage.getItem('my-key')) || [];
    const expense = myKey.find(exppense => exppense.id === id);

    // Create an edit form dynamically
    const editForm = document.createElement('form');
    editForm.innerHTML = `
        <h2>Edit Exppense</h2>
        <label for="editedAmount">Amount:</label>
        <input type="number" id="editedAmount" value="${exppense.amount}" required>
        <br>
        <label for="editedDescription">Description:</label>
        <input type="text" id="editedDescription" value="${exppense.description}" required>
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
    categorySelect.value = exppense.category;

    // Replace the existing content with the edit form
    const listItem = document.getElementById(`exppense-${id}`);
    listItem.innerHTML = '';
    listItem.appendChild(editForm);
}

function saveEdit(id){
    const editedAmount = document.getElementById('editedAmount').value;
    const editedDescription = document.getElementById('editedDescription').value;
    const editedCategory = document.getElementById('editedCategory').value;

    let myKey = JSON.parse(localStorage.getItem('my-key')) || [];
    myKey = myKey.map(exppense => (exppense.id !== id ?{
        ...exppense,
        amount: editedAmount,
        description: editedDescription,
        category: editedCategory
    }: exppense));

    localStorage.setItem('my-key', JSON.stringify(myKey));
    add();
}

function cancelEdit() {
    add();
}

function add(){
    const myKey = JSON.parse(localStorage.getItem('my-key')) || [];
    const ul = document.getElementById("unorderList");
    ul.innerHTML = '';

    if(myKey){
        myKey.forEach(exppense=>{
            const li = document.createElement("li");
            li.id = `exppense-${exppense.id}`;

            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.textContent = "Delete";
            deleteButton.addEventListener('click',function(){
                deleteExpense(exppense.id);
            });

            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.type = "button";
            editButton.addEventListener('click', function(){
                editExpense(exppense.id);
            });

            li.textContent = `${exppense.amount}-${exppense.description}-${exppense.category}`;
            li.appendChild(deleteButton);
            li.appendChild(editButton);

            ul.appendChild(li);

        })
    }
}
window.onload = add;

