import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://stick-and-do-default-rtdb.europe-west1.firebasedatabase.app/"
}

// app initialization and database sourcing
const app = initializeApp(appSettings);
const database = getDatabase(app);
const taskListInDB = ref(database, "taskList");

const addTaskBtnEl = document.querySelector(".add-task-btn");
const taskListUlEL = document.querySelector(".task-list");
const inputListEL = document.querySelector(".text-input");

addTaskBtnEl.addEventListener("click", function () {
    let inputListValue = inputListEL.value;

    push(taskListInDB, inputListValue);    // push input content into the DB

    clearInputField();
})

onValue(taskListInDB, function(snapshot) {
    if (snapshot.exists()) {     // check whether or not there is a task item saved
        let taskItemsArr = Object.entries(snapshot.val())   // change the JSON snapshot to an array

        clearTaskListUlEl() 

        for (let i = 0; i < taskItemsArr.length; i++) {

            let taskItem = taskItemsArr[i];
            let taskItemID = taskItem[0];
            let taskItemValue = taskItem[1];

            appendTasktoTaskListUlEl(taskItem);
        }
    } else {
        taskListUlEL.innerHTML = "No items here ...yet"
    }
})

function clearTaskListUlEl () {
    taskListUlEL.innerHTML = '';
}

function clearInputField() {
    inputListEL.value = '';
}

function appendTasktoTaskListUlEl(item) {
    let itemID = item[0];
    let itemValue = item[1];

    let newTaskItem = document.createElement("li");
    newTaskItem.textContent = itemValue;

    // remove the double clicked task
    newTaskItem.addEventListener("click", function() {
        let exactLocationOfTaskInDB = ref(database, "taskList/" + itemID);

        remove(exactLocationOfTaskInDB);
    })

    taskListUlEL.append(newTaskItem);

}
