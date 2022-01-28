console.log("connected");

// item | description | date added | completed | delete

var deleteTodo = function () {
    console.log("Delete task test");
}

var addTask = function () {
    var noteContainer = document.getElementById("notes");
    var item = document.getElementById("item").value;
    var description = document.getElementById("description").value;
    var date = new Date().toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"});


    var todo = document.createElement('div');
    todo.className += 'note';
    todo.innerHTML = `
        <h2>${item}</h2>
        <p>${description}</p>
        <p>${date}</p>
        <p>Complete</p>
        <p><span id="deleteTaskSpan" onclick="deleteTodo()">Delete task</span></p>
    `;
    noteContainer.appendChild(todo);
    
    // The code below this line should empty the input fields, but it does not

    item.value = " ";
    description.value = " ";
}