//登入註冊相關
const change_a = document.querySelector("form+a");
const submitBTN = document.querySelector(".login button");
const form = document.querySelector("form");
//密碼確認
const PWD = document.querySelector("#PWD");
const PWDAgain = document.querySelector("#PWDAgain");
let sitePath = window.location.pathname;
const inputs = document.querySelectorAll("input");
//登出相關
const logoutBTN = document.querySelector("header button");
//API相關
let domain = "https://todoo.5xcamp.us";
let url = "";
let APIData = {};
let listData = [];
//新增資料用
const addBTN = document.querySelector(".inputArea button");
const addInput = document.querySelector(".inputArea input");
//單筆資料更新、刪除用
const listContent = document.querySelector(".listContent .list");
//刪除全部用
const deletAllBTN = document.querySelector(".listFooter button");
//切換tab用
const tabArea = document.querySelector(".listArea .tab");

//判斷頁面+監聽事件
if (!sitePath.includes("main")) {
    change_a.addEventListener("click", changeText);
    form.addEventListener("submit", loginRegister);
    PWD.addEventListener("keyup",checkPWD);
    PWDAgain.addEventListener("keyup",checkPWDAgain);
} else {
    //顯示暱稱
    const headerNickName = document.querySelector("header h2");
    headerNickName.textContent = `${sessionStorage.getItem("nickName")}的待辦`;
    //a bunch of event listener...
    logoutBTN.addEventListener("click", logout);
    addBTN.addEventListener("click", addListItem);
    addInput.addEventListener("keyup", addListItem);
    listContent.addEventListener("click", itemStatus);
    deletAllBTN.addEventListener("click", deleteAll);
    tabArea.addEventListener("click", changeTab);
    //初次渲染
    requestData();
};

//登入註冊頁面內容切換
function changeText() {
    const sectionTitle = document.querySelector(".login h2");
    const section = document.querySelector("section");

    switch (change_a.textContent) {
        case "註冊帳號":
            submitBTN.textContent = "註冊帳號";
            sectionTitle.textContent = "註冊帳號";
            change_a.textContent = "登入";
            section.classList.add("register");
            break;
        case "登入":
            submitBTN.textContent = "登入";
            sectionTitle.textContent = "最實用的線上待辦事項";
            change_a.textContent = "註冊帳號";
            section.classList.remove("register");
            break;
    }
    //切換之後清空輸入框&更改必填屬性
    inputs.forEach((i) => {
        i.value = "";
        let display = window.getComputedStyle(i, null).getPropertyValue("display");
        i.required = display === "none" ? false : true;
    });

}

//密碼輸入確認
function checkPWD(){
    let PWD = "[0-9A-z.*]{6,}";
    const notice = document.querySelector("form p.PWD");
    if(this.value.match(PWD) || this.value === ""){
        notice.textContent="";
    }else{
        let str = this.parentNode.parentNode.classList.contains("register")?`尚須${6-this.value.length}個以上字元`:"與格式不符";
        notice.textContent = str;
    }
}
function checkPWDAgain(){
    let PWDText = PWD.value.trim();
    let PWDAgainText = PWDAgain.value.trim();
    const notice = document.querySelector("form p.PWDAgain");
    if(PWDAgainText === PWDText || PWDAgainText === ""){
        notice.textContent = "";
    }else{
        notice.textContent = "與密碼不相符";
    }
}

//註冊&登入
function loginRegister(e) {
    e.preventDefault();
    const Email = document.querySelector("#ID").value.trim();
    const PWD = document.querySelector("#PWD").value.trim();
    switch (submitBTN.textContent) {
        case "註冊帳號":
            const nickName = document.querySelector("#nickName").value.trim();
            APIData = {
                "user": {
                    "email": Email,
                    "nickname": nickName,
                    "password": PWD
                }
            }
            url = `${domain}/users`;
            break;
        case "登入":
            APIData = {
                "user": {
                    "email": Email,
                    "password": PWD
                }
            }
            url = `${domain}/users/sign_in`;
            break;
    }
    axios.post(url, APIData)
        .then((r) => {
            // console.log(r);
            // alert(r.data.message);
            let token = r.headers.authorization;
            let nickName = r.data.nickname;
            sessionStorage.setItem("token", token);
            sessionStorage.setItem("nickName", nickName);
            Swal.fire({
                icon: 'success',
                title: r.data.message,
                text: `${r.data.nickname}你好！`
            }).then(() => window.location = "/Todo_main.html");
            // console.log(token);
        }).catch((e) => {
            // console.log(e);
            let reason = e.response.data.error ? e.response.data.error : "";
            // alert(e.response.data.message + "　" + reason);
            Swal.fire({
                icon: 'error',
                title: e.response.data.message,
                text: reason,
            })
        })
}

//登出
function logout() {
    url = `${domain}/users/sign_out`;
    axios.delete(url, {
        headers: {
            Authorization: sessionStorage.getItem("token")
        }
    }).then((r) => {
        // console.log(r);
        // alert(r.data.message);
        Swal.fire({
            icon: 'success',
            title: r.data.message,
        }).then(() => {
            sessionStorage.clear();
            window.location = "/Todo_index.html";
        })

    }).catch((e) => {
        // console.log(e);
        let reason = e.response.data.error ? e.response.data.error : "";
        // alert(e.response.data.message + "　" + reason);
        Swal.fire({
            icon: 'success',
            title: e.response.data.message,
            text: reason
        })
    });
}

//顯示待辦清單
function requestData() {
    url = `${domain}/todos`;
    axios.get(url, {
        headers: {
            Authorization: sessionStorage.getItem("token")
        }
    }).then((r) => {
        // console.log("requestData", r.data.todos);
        listData = r.data.todos;
        render(listData);
    }).catch((e) => {
        // console.log("requestData",e);
        // alert(e.response.data.message + "　" + reason);
        Swal.fire({
            icon: 'warning',
            title: e.response.data.message,
            text: '轉至登入頁面'
        }).then(() => window.location = "/Todo_index.html");
    })
}

function render(data) {
    //除了渲染資料以外，也判斷是否要換成插圖
    const emptyArea = document.querySelector(".emptyArea");
    const listArea = document.querySelector(".listArea");
    if (data.length === 0) {
        emptyArea.classList.add("show");
        listArea.classList.remove("show");
    } else {
        emptyArea.classList.remove("show");
        listArea.classList.add("show");
        let tempList = [];
        //判斷tab並篩選要渲染的內容
        switch (detectTab()) {
            case "全部":
                tempList = data;
                break;
            case "待完成":
                tempList = data.filter(i => !i.completed_at);
                break;
            case "已完成":
                tempList = data.filter(i => i.completed_at);
                break;
        }
        const list = document.querySelector(".list");
        let listText = "";
        tempList.forEach((i) => {
            let checked = i.completed_at ? "checked" : "";
            listText += `<li><input type="checkbox" id="${i.id}" ${checked}><label for="${i.id}">${i.content}</label><button type="button"></button></li>`
        });
        list.innerHTML = listText;
        countRemain(data);
    }
}
function detectTab() {
    let tab = "";
    tabArea.childNodes.forEach((i) => {
        if (i.nodeName === "LI" && i.classList.contains("active")) {
            tab = i.textContent
        }
    })
    return tab;
}

//新增待辦事項
function addListItem(e) {
    if (e.type === "click" || e.key === "Enter") {
        let inputText = addInput.value.trim();
        if (inputText === "") return;
        url = `${domain}/todos`;
        APIData = {
            "todo": {
                "content": inputText
            }
        };
        axios.post(url, APIData, {
            headers: {
                Authorization: sessionStorage.getItem("token")
            }
        }).then((r) => {
            // console.log("addListItem", r.data);
            // requestData();
            //因為後續處理需要用到id，所以雖然可以先根據input更新並渲染網頁（不等資料庫），但還是要在獲得資料庫回傳之後重新渲染一次......
            let newData = {
                id: r.data.id,
                content: r.data.content,
                completed_at: null
            }
            listData.unshift(newData);
            //為了在渲染的時候顯示全部的內容
            tabArea.childNodes.forEach((i) => {
                if (i.nodeName === "LI") i.classList.remove("active");
                if (i.textContent === "全部") i.classList.add("active");
            })
            render(listData);
        }).catch((e) => {
            // console.log("addListItem", e.response);
            let reason = e.response.data.error ? e.response.data.error : "";
            alert(e.response.data.message + "　" + reason);
        })
        addInput.value = "";
    }
}

//更改狀態、刪除單筆
function itemStatus(e) {
    // console.log(e.target);
    let method = "";
    let index = "";
    switch (e.target.nodeName) {
        case "BUTTON":
            url = `${domain}/todos/${e.target.previousSibling.htmlFor}`;
            method = "delete";
            //先以已經請求過的資料來重新渲染畫面，就不用等資料庫更新完才渲染
            index = listData.findIndex(i => i.id === e.target.previousSibling.htmlFor);
            listData.splice(index, 1);
            render(listData);
            break;
        case "LABEL":
            url = `${domain}/todos/${e.target.htmlFor}/toggle`;
            method = "patch";
            //先以已經請求過的資料來重新渲染畫面，就不用等資料庫更新完才渲染
            index = listData.findIndex(i => i.id === e.target.htmlFor);
            listData[index].completed_at = (listData[index].completed_at === null) ? "checked_but_not_synced" : null;
            render(listData);
            break;
        default:
            return;
    }
    axios(url, {
        method,
        headers: {
            Authorization: sessionStorage.getItem("token")
        }
    }).then((r) => {
        // console.log("itemStatus", r);
        //等重新請求的時候listData再同步資料庫中的時間戳記就可以了
        // if (r.config.method === "patch") {
        //     index = listData.findIndex(i => i.id === r.data.id);
        //     listData[index].completed_at = r.data.completed_at;
        // }
    }).catch((e) => {
        // console.log("itemStatus", e);
        let reason = e.response.data.error ? e.response.data.error : "";
        alert(e.response.data.message + "　" + reason);
    })

}
//計算個數
function countRemain(data) {
    let total = 0;
    data.forEach(i => {
        if (!i.completed_at) total++;
    })
    const remain = document.querySelector(".listFooter h3");
    remain.textContent = `${total}個待完成項目`;
}

//刪除所有已完成
function deleteAll() {

    let needDelete = [];
    needDelete = listData.map(function (i) {
        if (i.completed_at) {
            url = `${domain}/todos/${i.id}`
            return axios.delete(url, {
                headers: {
                    Authorization: sessionStorage.getItem("token")
                }
            })
        }
    }).filter(i => i !== undefined);
    // console.log(needDelete);
    
    //先直接更新已請求過的資料並渲染
    listData = listData.filter(i => !i.completed_at);
    //為了在渲染的時候顯示全部的內容
    tabArea.childNodes.forEach((i) => {
        if (i.nodeName === "LI") i.classList.remove("active");
        if (i.textContent === "全部") i.classList.add("active");
    })
    render(listData);

    Promise.all(needDelete)
        .then((r) => {
            // console.log("deletAll", r);
            Swal.fire({
                icon: 'success',
                title: '刪除完成',
            })
        })
        .catch((e) => {
            console.log("deletAll", e);
        });
}

//切換tab
function changeTab(e) {
    for (let i = 0; i < this.children.length; i++) {
        this.children[i].classList.remove("active");
    };
    switch (e.target.textContent) {
        case "全部":
            e.target.classList.add("active");
            break;
        case "待完成":
            e.target.classList.add("active");
            break;
        case "已完成":
            e.target.classList.add("active");
            break;
        default:
            return;
    }
    render(listData);
}

