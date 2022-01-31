console.log("connected");

// item | description | date added | completed | delete

var addTask = function () {
    var noteContainer = document.getElementById("notes");
    var item = document.getElementById("item").value;
    var description = document.getElementById("description").value;
    var date = new Date().toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"});
    
    localStorage.setItem('item', `${item}`);
    localStorage.setItem('description', `${description}`);
    localStorage.setItem('date', `${date}`);

    // <h2>${item}</h2>
    //     <p>${description}</p>
    //     <p>${date}</p>


    var todo = document.createElement('div');
    todo.className += 'note';

    todo.innerHTML = `
        <h2>${localStorage.getItem("item")}</h2>
        <p>${localStorage.getItem("description")}</p>
        <p>${localStorage.getItem("date")}</p>
        <p>Complete</p>
        <p class="testOne" id="deleteTaskCursor" onclick="deleteTodo()">Delete task</p>
    `;
    noteContainer.appendChild(todo);

    document.getElementById("item").value = '';
    document.getElementById("description").value = '';    
}

var deleteTodo = function () {
    var x = document.getSelection().anchorNode.parentNode.parentNode;
    x.parentNode.removeChild(x);
}