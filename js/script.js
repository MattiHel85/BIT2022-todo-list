console.log("connected");

const noteList = 'noteList'; 
const active = 'Active';
const completed = 'Completed';

//FUNCTION WHICH SAVES AN OBJECT INSIDE LOCAL STORAGE
Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}

//FUNCTION WHICH GETS AND OBJECT FROM LOCAL STORAGE
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}

/**THIS IS HOLDER OF PRIORITY SELECTION INITIALLY LOW*/ 
var selectedPriority = "Low";
/**THESE ARE TWO HOLDERS RESPONSIBLE FOR KEEPING TRACK HOW TO FILTER NOTES*/
var isActiveTasksChecked = true; // BECAUSE INITIALLY THIS IS CHECKED
var isCompleteTasksChecked = false;

// item | description | date added | completed | delete
// FUNCTION RESPONSIBLE FOR DRAWING NOTE ON THE SCREEN
var addNoteCard = function(title,description,date,status,priority,noteId){
    var changeStatusBtnText = "Complete"
    color = "white"
    if(status == completed){
        changeStatusBtnText = "Uncomplete";
        title = title.strike()
        color = "#c0c0c0"
        }
    var dotColor = getColor(priority)
    var noteContainer = document.getElementById("notes");
    var singleNote = document.createElement('div');
    singleNote.id = noteId
    singleNote.className += 'note';
    singleNote.style.backgroundColor = color
    singleNote.innerHTML = `
        <h1>${title}</h1>
        <div class="p-1"></div>
        <div class="note-status d-flex flex-row justify-content-center">
            <h2>${status} task</h2>
            <div class="p-2"></div>
            <h2>${priority} priority</h2>
            <div class="note-circle" style="background-color: ${dotColor}"></div>
        </div>
        <div class="p-1"></div>
        <p class="desc">${description}</p>
        <p class="date">Task added: ${date}</p>
        <div class="d-flex  justify-content-center">
            <button  id="completeTaskCursor" class="btn btn-primary button"  onclick="switchTodoStatus(${noteId})">${changeStatusBtnText}</button>
            <button  id="deleteTaskCursor" class="btn btn-primary button" onclick="deleteTodo(${noteId})">Delete task</button>
        </div>
        `;
    noteContainer.appendChild(singleNote);
}

//RETURNS COLOR WHICH CORRESPONDS TO PRIORITY LEVEL
var getColor = function(priority){
    switch(priority){
        case "Low":
            return "green";
        case "Medium":
            return "yellow";
        case "High":
            return "red";
    }
}

//  FIRSTLY DELETE ALL NOTES THEN ADD ALL NOTES FROM LOCALSTORAGE
// IN THIS FUNCTION WE ALSO FILTER THE RESULT ACCORDING TO USER CHOICE.
var refreshNotesCards = function () {
    clearTasksInfo() //CLEARING TASK INFO ON THE TOP OF THE SCREEN
    var noteContainer = document.getElementById("notes");
    noteContainer.innerHTML = "";
    var listLocalStorage = localStorage.getObj(noteList) // GET OBJECTS FROM LOCAL STORAGE
    var filteredLocalStorage
    if(!isActiveTasksChecked && !isCompleteTasksChecked){ // IF NOTHING IS SELECTED RETURN AND DON'T SHOW ANYTHING
        return;
    }
    else if(isActiveTasksChecked & isCompleteTasksChecked){ // IF BOTH NOTES TYPES ARE SELECTED DO THIS
        filteredLocalStorage = listLocalStorage
        updateTasksInfo(listLocalStorage.filter(checkIfNotCompleted).length,active);
        updateTasksInfo(listLocalStorage.filter(checkIfNotActive).length,completed,true);
    }
    else if (!isActiveTasksChecked){ // IF ACTIVE TASKS ARE NOT SELECTED, FILTER ACTIVE TASKS OUT
        filteredLocalStorage = listLocalStorage.filter(checkIfNotActive)
        updateTasksInfo(filteredLocalStorage.length, completed)
    }
    else{ // OTHERWISE FILTER COMPLETED TASKS OUT
         filteredLocalStorage = listLocalStorage.filter(checkIfNotCompleted)
         updateTasksInfo(filteredLocalStorage.length, active)
     }
    for (eachNote in filteredLocalStorage){ // FOR EACH NOTE DRAW NEW NOTE ON THE SCREEN
        var noteObject = filteredLocalStorage[eachNote];
        var noteIndex = listLocalStorage.indexOf(noteObject)
        addNoteCard(noteObject.title,noteObject.description,noteObject.date,noteObject.status,noteObject.priority,noteIndex);
    }
}


//ADJUST THE INFORMATION ABOUT PRESENTED TASKS
var updateTasksInfo = function(size,status){
    var taskInfoContainer = document.getElementById("tasks-info");
    var tasks = "tasks";
    if(size == 0)return; // THERE'S NO TASKS SO DON'T SHOW INFORMATION
    if(size == 1)tasks = tasks.slice(0,-1); // THERE'S ONLY ONE TASK THEREFORE CUT 's' from "tasks"
    if(taskInfoContainer.innerHTML != ""){ // IF THERE'S SOME TEXT IN THE taskInfoContainer 
        taskInfoContainer.innerHTML += `
        and ${size} ${status.toLowerCase()} ${tasks} 
        `                                           // ADD NEW INFORMATION AS SECOND INFORMATION
    }
    else{ //OTHERWISE
    taskInfoContainer.innerHTML += `
    Showing ${size} ${status.toLowerCase()} ${tasks}
    ` // ADD AS FIRST INFORMATION
    }
}

//CLEARS CONTAINER WITH TASK INFO SO IT CAN BE ADJUSTED AGAIN
var clearTasksInfo = function(){
    var taskInfoContainer = document.getElementById("tasks-info");
    taskInfoContainer.innerHTML = "";
}

//CHECKS IF NOTE IS NOT ACTIVE
var checkIfNotActive = function(note){
    if(note.status == active) return false
    else return true
}

//CHECKS IF NOT IS NOT COMPLETED
var checkIfNotCompleted = function(note){
    if(note.status == completed) return false
    else return true
}

//ADDS NEW NOTE TO LOCAL STORAGE
//FIRSTLY CHECKS FOR INPUT VALIDITY IF INVALID SHOWS COOL ERROR ANIMATION AND RETURNS EARLY
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
    var newNote = new Note(item,description,date,selectedPriority,active) 
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

// CLEAR ALL TASKS FROM LOCAL STORAGE.
var clearTasks = function(){
    localStorage.clear()
    refreshNotesCards()
}


//RESETS INPUT FIELDS
var clearInputFields = function(){
    document.getElementById("item").value = '';
    document.getElementById("description").value = '';
    document.getElementById("task-priority").innerHTML = '';
}
// DELETES TODO NOTE FROM LOCALSTORAGE AND REFRESH NOTES ON THE SCREEN
var deleteTodo = function (id) {
    var listLocalStorage = localStorage.getObj(noteList)
    listLocalStorage.splice(id,1)
    localStorage.setObj(noteList,listLocalStorage)
    refreshNotesCards()
}

// SWITCHES THE STATUS OF TODO NOTE FROM COMPLETE TO ACTIVE AND OTHERWISE
var switchTodoStatus = function(id){
    var listLocalStorage = localStorage.getObj(noteList)
    var oldNoteStatus = listLocalStorage[id].status
    if(oldNoteStatus === active){
        listLocalStorage[id].status = completed
        playSuccessSound()
    }
    else{
        listLocalStorage[id].status = active 
    }
    localStorage.setObj(noteList,listLocalStorage)
    refreshNotesCards()
}

//SHOWS THE ERROR ANIMATION BY ADDING BOUNCE CLASS TO FIELD AND THEN REMOVING IT AFTER 1000MS
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

//SELECTS PRIORITY IN ADDING NEW TODO NOTE WINDOW
  var prioritySelected = function(priority){
      selectedPriority = priority
      setTaskTitle()
  }
// ADJUST PRIORITY LEVEL ON TOP OF ADD NEW NOTE WINDOW
  var setTaskTitle = function(){
      priorityLowCase = selectedPriority.charAt(0).toLowerCase() + selectedPriority.slice(1);

      document.getElementById("task-priority").innerHTML = `Add ${priorityLowCase} priority task.`;
  }

  //WHENEVER PAGE GETS REFRESHED, REFRESH NOTES AND SET TASK TITLE
  var onLoad = function(){
      refreshNotesCards()
      setTaskTitle()
  }
//SWITCH THE FLAG BOOLEAN AND REFRESH NOTES
  var activeTasksToggle = function(boolean){
    var toggle = document.getElementById("active-toggle")
    if(boolean) toggle.innerHTML = "Hide current tasks"
    else toggle.innerHTML = "Show current tasks"
    isActiveTasksChecked = boolean;
    refreshNotesCards();
  }
//SWITCH THE FLAG BOOLEAN AND REFRESH NOTES
  var completedTasksToggle = function(boolean){
    var toggle = document.getElementById("completed-toggle")
    if(boolean) toggle.innerHTML = "Hide tasks history"
    else toggle.innerHTML = "Show tasks history"
    isCompleteTasksChecked = boolean;
    refreshNotesCards();
  }

  //PLAY SUCCESFUL "DING" SOUND
  var playSuccessSound = function(){
    var audio = new Audio('ding.wav');
    audio.play();
  }

