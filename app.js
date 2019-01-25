function CTask(TASK_TEXT, PLACE, ID, IS_DONE) {
    const place = PLACE;
    let id = ID;
    let taskWrap;
    let isDone = IS_DONE;
    let isDoneCheckbox;
    let text = TASK_TEXT;
    let textP;
    let btnChange;
    let btnDelete;


    function onInit() {
        taskWrap = document.createElement('li');
        taskWrap.style.width = '100%';
        taskWrap.style.minHeight = '50px';
        taskWrap.style.display = 'flex';
        taskWrap.style.flexWrap = 'wrap';
        taskWrap.style.alignItems = 'center';
        taskWrap.style.justifyContent = 'space-between';
        taskWrap.style.marginBottom = '20px';

        isDoneCheckbox = document.createElement('input');
        isDoneCheckbox.type = 'checkbox';
        isDoneCheckbox.checked = isDone;
        isDoneCheckbox.onclick = () => {
            this.isDone = isDoneCheckbox.checked;
            isDone = isDoneCheckbox.checked;
            // console.log('CHECKBOX PRESSED');
            // console.log(this,' isDone_',isDone);
            main.saveState();
        };

        textP = document.createElement('p');
        textP.innerHTML = text;
        textP.style.flexGrow = '1';
        textP.style.background = 'white';
        textP.style.borderRadius = '5px';
        textP.style.padding = '0 10px';
        textP.style.lineHeight = '50px';
        textP.style.margin = '20px';
        textP.style.maxWidth = '322px';


        btnChange = document.createElement('button');
        btnChange.innerHTML = 'CHANGE';
        btnChange.style.width = '75px';
        btnChange.style.height = '50px';
        btnChange.style.padding = '10px';
        btnChange.style.cursor = 'pointer';
        btnChange.style.borderRadius = '5px';
        btnChange.style.marginRight = '20px';
        btnChange.onclick = () => {
            let newTask = prompt('CHANGE TASK');
            if (newTask !== null) {
                if (newTask == '') alert('NEW TASK IS EMPTY');
                else {
                    // console.log('text is',text);
                    // console.log('this.text is',this.text);
                    text = newTask;
                    // this.text = newTask;
                    textP.innerHTML = text;
                    // console.log('CHANGED TASK');
                    // console.log(this,' text_',text);
                    main.saveState();
                }
            }
        };


        btnDelete = document.createElement('button');
        btnDelete.innerHTML = 'DELETE';
        btnDelete.style.width = '75px';
        btnDelete.style.height = '50px';
        btnDelete.style.padding = '10px';
        btnDelete.style.cursor = 'pointer';
        btnDelete.style.borderRadius = '5px';
        btnDelete.onclick = () => {
            main.deleteTask(id, taskWrap);
        }

        draw();
    }

    function draw() {
        place.appendChild(taskWrap);
        taskWrap.appendChild(isDoneCheckbox);
        taskWrap.appendChild(textP);
        taskWrap.appendChild(btnChange);
        taskWrap.appendChild(btnDelete);
    }

    return {
        id,
        isDone,
        text,
        onInit,
        draw
    };
}


function CMain() {
    let arrTasks = [];
    let inputTask;
    let btnAddTask;
    let taskList;
    let btnLoadMore;
    let appWrap;

    function onInit() {
        appWrap = document.createElement('div');
        appWrap.style.width = '600px';
        appWrap.style.minHeight = '200px';
        appWrap.style.background = 'gray';
        appWrap.style.margin = '0 auto';
        appWrap.style.padding = '20px';
        appWrap.style.borderRadius = '5px';
        document.body.appendChild(appWrap);

        inputTask = document.createElement('input');
        inputTask.type = 'text';
        inputTask.style.width = '440px';
        inputTask.style.height = '50px';
        inputTask.style.padding = '10px';
        inputTask.style.marginRight = '20px';
        inputTask.style.marginBottom = '20px';
        inputTask.placeholder = 'NEW TASK';
        inputTask.style.borderRadius = '5px';
        appWrap.appendChild(inputTask);

        btnAddTask = document.createElement('button');
        btnAddTask.innerHTML = 'ADD TASK';
        btnAddTask.style.width = '100px';
        btnAddTask.style.height = '50px';
        btnAddTask.style.padding = '10px';
        btnAddTask.style.cursor = 'pointer';
        btnAddTask.style.borderRadius = '5px';
        btnAddTask.onclick = () => {
            let curTask = inputTask.value;
            let curID = arrTasks.length;
            if (curTask !== '') {
                let newTask = new CTask(curTask, taskList, curID, false);
                newTask.onInit();
                arrTasks.push(newTask);
                inputTask.value = '';
                saveState();
            } else {
                alert('PLEASE ADD NEW TASK!!!');
            }
        };
        appWrap.appendChild(btnAddTask);

        taskList = document.createElement('ul');
        taskList.style.padding = '0px';
        taskList.style.listStyle = 'none';
        appWrap.appendChild(taskList);

        btnLoadMore = document.createElement('button');
        btnLoadMore.innerHTML = 'LOAD MORE';
        btnLoadMore.style.width = '100%';
        btnLoadMore.style.height = '50px';
        btnLoadMore.style.padding = '10px';
        btnLoadMore.style.cursor = 'pointer';
        btnLoadMore.style.borderRadius = '5px';
        btnLoadMore.onclick = () => {
            let curID = arrTasks.length;
            fetch('https://jsonplaceholder.typicode.com/todos/')
                .then(response => response.json())
                .then(json => {
                    for (let i = curID ,total=curID+10; i < total; i++) {
                        let newTask = new CTask(json[i].title, taskList, i, json[i].completed);
                        newTask.onInit();
                        arrTasks.push(newTask);
                    }
                    saveState();
                })
        };
        appWrap.appendChild(btnLoadMore);

        //DRAW OLD TASKS FROM LOCALSTORAGE
        //localStorage.clear();
        getLocalState();
    }

    function deleteTask(id, task) {
        taskList.removeChild(task);
        const taskToDelete = arrTasks[id];

        arrTasks = arrTasks.filter(function (item) {
            return item.id !== id;
        });

        arrTasks.forEach((task, index) => {
            task.id = index;
        })

        //delete taskToDelete;  //MAY BE MEMORY FLOW TODO
        saveState();
    }

    function toStringArrTasks() {
        console.log(arrTasks);
    }

    function saveState() {
        console.log('SAVING STATE');
        console.log('arrTasks[0] ', arrTasks[0]);
        localStorage.setItem('tasks', JSON.stringify(arrTasks));
        toStringArrTasks();
    }

    function getLocalState() {
        const tasks = JSON.parse(localStorage.getItem("tasks"));
        if (tasks !== null) {
            console.log('LOADED LOCAL ARRAY');
            console.log(tasks);
            tasks.forEach(task =>{
                let newTask = new CTask(task.text, taskList, task.id, task.isDone);
                newTask.onInit();
                arrTasks.push(newTask);
            })
        }
    }

    return {
        onInit,
        saveState,
        deleteTask
    }
}

const main = CMain();
main.onInit();
