console.log("connected");

const noteList = 'noteList' 

Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}

// item | description | date added | completed | delete

var addNoteCard = function(title,description,date,color,noteId){
    var noteContainer = document.getElementById("notes");
    var singleNote = document.createElement('div');
    singleNote.id = noteId
    console.log(singleNote.id)
    singleNote.className += 'note';
    singleNote.innerHTML = `
        <h2>${title}</h2>
        <p>${description}</p>
        <p>${date}</p>
        <p>Complete</p>
        <p class="testOne" id="deleteTaskCursor" onclick="deleteTodo(${noteId})">Delete task</p>
    `;
    noteContainer.appendChild(singleNote);
}

//  FIRSTLY DELETE ALL NOTES THEN ADD ALL NOTES FROM LOCALSTORAGE
var refreshNotesCards = function () {
    var noteContainer = document.getElementById("notes");
    noteContainer.innerHTML = "";
    var listLocalStorage = localStorage.getObj(noteList)
    for (eachNote in listLocalStorage){
        var noteObject = listLocalStorage[eachNote];
        addNoteCard(noteObject.title,noteObject.description,noteObject.date,noteObject.color,eachNote);
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
    clearInputFields()
}

var clearInputFields = function(){
    document.getElementById("item").value = '';
    document.getElementById("description").value = '';    
}

var deleteTodo = function (id) {
    var listLocalStorage = localStorage.getObj(noteList)
    listLocalStorage.splice(id,1)
    localStorage.setObj(noteList,listLocalStorage)
    refreshNotesCards()
}


var clearTasks = function(){
    localStorage.clear()
    refreshNotesCards()
}