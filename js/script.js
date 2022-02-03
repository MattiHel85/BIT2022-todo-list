console.log("connected");

const noteList = 'noteList'; 
const active = 'Active';
const completed = 'Completed';

Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}

/**THIS IS HOLDER OF PRIORITY SELECTION INITIALLY LOW*/ 
var selectedPriority = "low";
/**THIS ARE TWO HOLDERS RESPONSIBLE FOR KEEPING TRACK HOW TO FILTER NOTES*/
var isActiveTasksChecked = true; // BECAUSE INITIALLY THIS IS CHECKED
var isCompleteTasksChecked = false;

// item | description | date added | completed | delete

var addNoteCard = function(title,description,date,status,priority,color,noteId){
    var noteContainer = document.getElementById("notes");
    var singleNote = document.createElement('div');
    singleNote.id = noteId
    console.log(singleNote.id)
    singleNote.className += 'note';
    singleNote.innerHTML = `
        <h2>${title}</h2>
        <h3>${priority} priority task</h3>
        <h3>${status} task</h3>
        <p>${description}</p>
        <p>${date}</p>
        <p  id="completeTaskCursor" onclick="switchTodoStatus(${noteId})">Complete</p>
        <p  id="deleteTaskCursor" onclick="deleteTodo(${noteId})">Delete task</p>
    `;
    noteContainer.appendChild(singleNote);
}

//  FIRSTLY DELETE ALL NOTES THEN ADD ALL NOTES FROM LOCALSTORAGE
var refreshNotesCards = function () {
    var noteContainer = document.getElementById("notes");
    noteContainer.innerHTML = "";
    var listLocalStorage = localStorage.getObj(noteList)
    if(!isActiveTasksChecked){
        listLocalStorage = listLocalStorage.filter(checkIfActive)
    }
    if(!isCompleteTasksChecked){
        listLocalStorage = listLocalStorage.filter(checkIfCompleted)
    }
    for (eachNote in listLocalStorage){
        var noteObject = listLocalStorage[eachNote];
        addNoteCard(noteObject.title,noteObject.description,noteObject.date,noteObject.status,noteObject.priority,noteObject.color,eachNote);
    }
}

var checkIfActive = function(note){
    if(note.status == active) return false
    else return true
}

var checkIfCompleted = function(note){
    if(note.status == completed) return false
    else return true
}


var addNewNote = function () {
    var item = document.getElementById("item").value;
    var description = document.getElementById("description").value;
    var date = new Date().toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"});
    

    /**THIS CHECKS IF INPUT IS VALID AND REACTS FOR IT ACCORDINGLY
     * I WOULD LIKE TO HAVE THIS LOGIC AS SEPERATE FUNCTION BUT I DON'T KNOW HOW TO RETURN THIS FUNCTION EARLY WITH ANOTHER FUNCTION
    */
    if( item.length < 2 && description.length < 2){
        errorAnimation("item");
        errorAnimation("description");
        return;
    }
    if(item.length < 2){
        errorAnimation("item");
        return;
    }
    if(description.length < 2){
        errorAnimation("description");
        return;
    }

    //LOAD LIST OF NOTES FROM THE LOCAL SOTRAGE
    var oldListLocalStorage = localStorage.getObj(noteList)
    //CREATE NEW NOTE
    var newNote = new Note(item,description,date,"Red",selectedPriority,active) //TODO ADD DROPDOWNMENU COLOR PICKER OPTION
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


var switchTodoStatus = function(id){
    var listLocalStorage = localStorage.getObj(noteList)
    var oldNoteStatus = listLocalStorage[id].status
    console.log(oldNoteStatus)
    if(oldNoteStatus === active){
        console.log(listLocalStorage[id].status)
        listLocalStorage[id].status = completed
        console.log("This should be changed now = " + listLocalStorage[id].status)
    }
    else{
        listLocalStorage[id].status = active 
    }
    localStorage.setObj(noteList,listLocalStorage)
    refreshNotesCards()
}

var clearTasks = function(){
    localStorage.clear()
    refreshNotesCards()
}


var errorAnimation = function(elementId){
    document.getElementById(elementId).classList.add("bounce");
    setTimeout(function() {
      //remove the class so animation can occur as many times as user triggers event, delay must be longer than the animation duration and any delay.
      document.getElementById(elementId).classList.remove("bounce");
    }, 1000);   

}



/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
var openDropdown = function() {
    document.getElementById("myDropdown").classList.toggle("show");
  }


  // Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }


  var prioritySelected = function(priority){
      selectedPriority = priority
      setTaskTitle()
  }

  var setTaskTitle = function(){
      document.getElementById("task-priority").innerHTML = `<h2>Add ${selectedPriority} priority task.</h2>`
  }

  var onLoad = function(){
      refreshNotesCards()
      setTaskTitle()
  }

  var activeTasksToggle = function(boolean){
    console.log(`Active task toggled! ${boolean} `)
    isActiveTasksChecked = boolean;
    refreshNotesCards();
  }

  var completedTasksToggle = function(boolean){
    console.log(`Active task toggled! ${boolean} `)
    isCompleteTasksChecked = boolean;
    refreshNotesCards();
  }

