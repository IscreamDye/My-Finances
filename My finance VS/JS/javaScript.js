// Array to store container data
let containerData = JSON.parse(localStorage.getItem('containers')) || [];

let openPopupBtn = document.getElementById('open-popup-btn');
let closePopupBtn = document.getElementById('close-popup-btn');
let popupContainer = document.getElementById('popup-container');
let overlay = document.getElementById('overlay');

let addMonthSalaryBtn = document.getElementById('addInfo');
let whereToAdd = document.getElementById('allMonthsFrame');

let monthInput = document.querySelector('input[placeholder="Month name"]');
let salaryInput = document.querySelector('input[placeholder="Salary"]');

// Show popup
openPopupBtn.addEventListener('click', function () {
    popupContainer.style.display = 'block';
    overlay.style.display = 'block';
});

// Close popup
closePopupBtn.addEventListener('click', function () {
    popupContainer.style.display = 'none';
    overlay.style.display = 'none';
});

// Save to localStorage
function saveToLocalStorage() {
    localStorage.setItem('containers', JSON.stringify(containerData));
}

// Load data from localStorage
function loadFromLocalStorage() {
    containerData.forEach(data => addContainerToDOM(data));
}

// Function to create and add a container to the DOM
function addContainerToDOM(data) {
    let allMonths = document.createElement('div');
    allMonths.className = 'monthFrame';
    allMonths.id = `container-${data.id}`; // Assign ID to the container
    whereToAdd.appendChild(allMonths);

    let monthNameContainer = document.createElement('div');
    monthNameContainer.className = 'monthName';
    allMonths.appendChild(monthNameContainer);

    let monthName = document.createElement('p');
    monthName.textContent = data.month; // Use saved month value
    monthNameContainer.appendChild(monthName);

    const addDeleteMonth = document.createElement('button');
    addDeleteMonth.className = 'deleteMonth';
    addDeleteMonth.textContent = 'Delete';
    monthNameContainer.appendChild(addDeleteMonth);

    let entryContainer = document.createElement('div');
    entryContainer.className = 'entryContainer';
    allMonths.appendChild(entryContainer);

    let salaryName = document.createElement('p');
    salaryName.textContent = 'My salary:';
    entryContainer.appendChild(salaryName);

    let para2 = document.createElement('p');
    para2.textContent = data.salary; // Use saved salary value
    entryContainer.appendChild(para2);

    let totalExpanses = document.createElement('p');
    totalExpanses.textContent = 'Total expanses:';
    entryContainer.appendChild(totalExpanses);

    let expNum = document.createElement('p');
    expNum.textContent = data.expansesNum || 0; // Use saved expansesNum value
    entryContainer.appendChild(expNum);

    const collapseButton = document.createElement('button'); // toggle button
    collapseButton.className = 'collapseButton';
    collapseButton.textContent = '^^';
    entryContainer.appendChild(collapseButton);

    let enteryFrame = document.createElement('div');
    enteryFrame.className = 'enteryFrame';
    allMonths.appendChild(enteryFrame);

    let nameOfexpanse = document.createElement('input');
    nameOfexpanse.type = 'text';
    nameOfexpanse.placeholder = 'Name';
    enteryFrame.appendChild(nameOfexpanse);

    let amountOfexpanse = document.createElement('input');
    amountOfexpanse.type = 'text';
    amountOfexpanse.placeholder = 'Amount';
    enteryFrame.appendChild(amountOfexpanse);

    const addEntery = document.createElement('button');
    addEntery.className = 'addEntery';
    addEntery.textContent = 'Add Entry';
    enteryFrame.appendChild(addEntery);

    const inputFrame = document.createElement('div');
    inputFrame.className = 'inputFrame';
    allMonths.appendChild(inputFrame);

    // Add saved expenses to DOM
    if (data.expenses) {
        data.expenses.forEach(exp => {
            addExpenseToDOM(inputFrame, exp.name, exp.amount, expNum, data);
        }); 
    }

    // Add entry functionality
    addEntery.addEventListener('click', function () {
        const expenseName = nameOfexpanse.value.trim();
        const expenseAmount = parseFloat(amountOfexpanse.value);
    
        if (expenseName && !isNaN(expenseAmount)) {
            addExpenseToDOM(inputFrame, expenseName, expenseAmount, expNum, data);
    
            // Update local storage
            data.expenses = data.expenses || [];
            data.expenses.push({ name: expenseName, amount: expenseAmount });
    
            // Round the total expanses number to 2 decimal places
            let roundedAmount = parseFloat(expenseAmount.toFixed(2));
            data.expansesNum = (data.expansesNum || 0) + roundedAmount;
            expNum.textContent = data.expansesNum.toFixed(2);
    
            saveToLocalStorage();
    
            // Clear inputs
            nameOfexpanse.value = '';
            amountOfexpanse.value = '';
        }
    });

    // Delete month functionality
    addDeleteMonth.addEventListener('click', function () {
        allMonths.remove();
        containerData = containerData.filter(item => item.id !== data.id); // Remove container by ID
        saveToLocalStorage();
    });

    // toggle functionality
    collapseButton.addEventListener('click', function(){
        inputFrame.style.display = inputFrame.style.display === 'none' ? 'block' : 'none';
    });
};

// Function to add an expense to the DOM
function addExpenseToDOM(parent, name, amount, expNum, data) {
    const containerEntery = document.createElement('div');
    containerEntery.className = 'containerEntery';
    parent.appendChild(containerEntery);

    let paragraphName = document.createElement('p');
    paragraphName.innerText = name;

    let paragraphAmount = document.createElement('p');
    paragraphAmount.innerText = amount;

    const deleteContainer = document.createElement('button');
    deleteContainer.className = 'deleteContainer';
    deleteContainer.textContent = 'X';

    containerEntery.appendChild(paragraphName);
    containerEntery.appendChild(paragraphAmount);
    containerEntery.appendChild(deleteContainer);

    // Delete expense functionality
    deleteContainer.addEventListener('click', function () {
        containerEntery.remove();
    
        // Find the expense to be deleted
        let expenseIndex = data.expenses.findIndex(exp => exp.name === name && exp.amount === amount);
    
        if (expenseIndex !== -1) {
            // Remove the expense from the array
            data.expenses.splice(expenseIndex, 1);
    
            // Subtract the rounded amount
            let roundedAmount = parseFloat(amount.toFixed(2));
            data.expansesNum -= roundedAmount;
    
            // Update the displayed expanses number
            expNum.textContent = data.expansesNum.toFixed(2);
    
            // Save to local storage
            saveToLocalStorage();
        }
    });
}

// Add new container on button click
addMonthSalaryBtn.addEventListener('click', function () {
    let monthValue = monthInput.value.trim();
    let salaryValue = parseFloat(salaryInput.value).toFixed(2); // Round salary to 2 decimal places

    if (monthValue && salaryValue) {
        // Generate a unique ID
        const id = Date.now();

        const newContainer = { id, month: monthValue, salary: salaryValue, expansesNum: 0, expenses: [] };
        containerData.push(newContainer);
        saveToLocalStorage();

        // Add the container to the DOM
        addContainerToDOM(newContainer);

        // Clear input fields
        monthInput.value = '';
        salaryInput.value = '';

        // Close the popup
        popupContainer.style.display = 'none';
        overlay.style.display = 'none';
    } else {
        alert('Please enter both month and salary.'); // Alert for missing input
    }
});

// Close popup if overlay is clicked
overlay.addEventListener('click', function () {
    popupContainer.style.display = 'none';
    overlay.style.display = 'none';
});

// Load saved data on page load
loadFromLocalStorage();
