//新增待辦事項用
const addbtn = document.querySelector("button.addbtn");
const addListInput = document.querySelector("input[name='addList']");
//tab用
const tab = document.querySelector(".tab");
const allList = document.querySelector(".tab>li:first-of-type");
const undoList = document.querySelector(".tab>li:nth-of-type(2)");
const doneList = document.querySelector(".tab>li:last-of-type");
//清單用
const listContent = document.querySelector(".listContent");
//footer
const remainCount = document.querySelector(".remain");
const removeDone = document.querySelector(".remove");


//點擊+
addbtn.addEventListener("click", addList);
//Enter輸入
addListInput.addEventListener("keyup", addList);
//打勾、刪除指定項目
listContent.addEventListener("click", checkList);
//切換tab
tab.addEventListener("click", changeTab);
//刪除所有已完成項目
removeDone.addEventListener("click", removeDoneItem);

let todolist = JSON.parse(localStorage.getItem("todolist"))|| [];
let allClassName = allList.classList;
let undoClassName = undoList.classList;
let doneClassName = doneList.classList;

function render(list){
    let str = "";
    list.forEach(function (i) {
        str += `<li><input id="doneCheck" type="checkbox" class="checkbox" data-order="${todolist.indexOf(i)}" data-place="${i.place}" ${i.status}><label for="doneCheck">${i.value}</label><button data-order="${todolist.indexOf(i)}" data-place="${i.place}"></button></li>`;
    });
    listContent.innerHTML = str;
    countRemain();
};
render(todolist);

function createListContent(e) {
    if (e.target === undoList || e.target.dataset.place === "undo") {
        let tempTodoList = todolist.filter(i=>i.status !== "checked");
        tempTodoList.forEach(i=>i.place = "undo");
        render(tempTodoList);
    } else if (e.target === doneList || e.target.dataset.place === "done") {
        let tempTodoList = todolist.filter(i=>i.status === "checked");
        tempTodoList.forEach(i=>i.place = "done");
        render(tempTodoList);
    } else {
        todolist.forEach(i=>i.place = "all");
        render(todolist);
        allClassName.add("active");
        undoClassName.remove("active");
        doneClassName.remove("active");
    }
    localStorage.setItem("todolist", JSON.stringify(todolist));
};

function countRemain() {
    let remainCountNum = 0;
    todolist.forEach((i) => { if (i.status !== "checked") { remainCountNum++; } });
    remainCount.textContent = `${remainCountNum}個待辦項目`;
};

function addList(e) {
    //防止創造空列
    if (addListInput.value.trim() === "") {
        return;
    };
    //mouse event和keyboard event可以共用一個function
    if (e.type === "click" || e.key === "Enter") {
        let obj = {};
        obj.value = addListInput.value;
        obj.status = "";
        obj.place = "all";
        todolist.unshift(obj);
        createListContent(e);
        addListInput.value = "";
    };
};

function checkList(e) {
    if (e.target.nodeName === "UL") {
        return;
    };
    //刪除指定項目
    if (e.target.nodeName === "BUTTON") {
        // console.log(e);
        todolist.splice(e.target.dataset.order, 1);
        createListContent(e);
    } else {
        //更改項目status
        // checkbox有checked property可用
        todolist[e.target.dataset.order].status = e.target.checked?"checked":"";
        createListContent(e);
    };
};

function changeTab(e) {
    if (e.target === allList) {
        allClassName.add("active");
        undoClassName.remove("active");
        doneClassName.remove("active");
    } else if (e.target === undoList) {
        allClassName.remove("active");
        undoClassName.add("active");
        doneClassName.remove("active")
    } else if (e.target === doneList) {
        allClassName.remove("active");
        undoClassName.remove("active");
        doneClassName.add("active");
    };
    createListContent(e);
};

function removeDoneItem(e) {
    todolist = todolist.filter(i=>i.status === "");
    createListContent(e);
    allClassName.add("active");
    undoClassName.remove("active");
    doneClassName.remove("active");
};