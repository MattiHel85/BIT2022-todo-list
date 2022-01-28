console.log("connected");

// item | description | date added | completed | delete

var deleteTodo = function () {
    console.log("Delete task test");
}

var addTask = function () {
    var table = document.getElementById("table");
    var item = document.getElementById("item").value;
    var description = document.getElementById("description").value;
    var date = new Date().toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"});


    var todo = document.createElement('tr');
    todo.innerHTML = `
        <td>${item}</td>
        <td>${description}</td>
        <td>${date}</td>
        <td>Test data</td>
        <td><span id="deleteTaskSpan" onclick="deleteTodo()">X</span></td>
    `;
    table.appendChild(todo);
    
    // The code below this line should empty the input fields, but it does not
    
    item.value = " ";
    description.value = " ";
}