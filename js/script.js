console.log("connected");

const noteList = 'noteList' 

Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}

// item | description | date added | completed | delete

var addNoteCard = function(title,description,date,color){
    var noteContainer = document.getElementById("notes");
    var singleNote = document.createElement('div');
    singleNote.className += 'note';
    singleNote.innerHTML = `
        <h2>${title}</h2>
        <p>${description}</p>
        <p>${date}</p>
        <p>Complete</p>
        <p class="testOne" id="deleteTaskCursor" onclick="deleteTodo()">Delete task</p>
    `;
    noteContainer.appendChild(singleNote);
}

//  FIRSTLY DELETE ALL NOTES THEN ADD ALL NOTES FROM LOCALSTORAGE
var refreshNotesCards = function () {
    var noteContainer = document.getElementById("notes");
    noteContainer.innerHTML = "";
    var listLocalStorage = localStorage.getObj(noteList)
    for (eachNote in listLocalStorage){
        var noteObject = listLocalStorage[eachNote]
        addNoteCard(noteObject.title,noteObject.description,noteObject.date);
    }
}

var addNewNote = function () {
    var item = document.getElementById("item").value;
    var description = document.getElementById("description").value;
    var date = new Date().toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"});
    
    //LOAD LIST OF NOTES FROM THE LOCAL SOTRAGE
    var oldListLocalStorage = localStorage.getObj(noteList)
    //CREATE NEW NOTE
    var newNote = new Note(item,description,date,"Red") //TODO ADD DROPDOWNMENU COLOR PICKER OPTION
    //IF ARRAY OF NOTES FROM LOCAL STORAGE IS NULL CREATE NEW ARRAY
    //SAVE IT IN THE LOCAL STORAGE
    if(oldListLocalStorage == null) {
        var newArray = [newNote]
        localStorage.setObj(noteList,newArray)
    }
    //OTHERWISE ADD NEW NOTE TO OLD ARRAY 
    //SAVE NEW ARRAY IN LOCAL STORAGE
    else{
        oldListLocalStorage.push(newNote)
        localStorage.setObj(noteList,oldListLocalStorage)
    }
    //REFRESH NEW NOTES BECAUSE THE LOCALSTORAGE GOT UPDATED
    refreshNotesCards()

    document.getElementById("item").value = '';
    document.getElementById("description").value = '';    
}

var deleteTodo = function () {
    var x = document.getSelection().anchorNode.parentNode.parentNode;
    x.parentNode.removeChild(x);
}


var clearTasks = function(){
    localStorage.clear()
    refreshNotesCards()
}