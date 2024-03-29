//二次最大改動：點選表頭排序時下拉選單的內容也會更換。改變selected()、在sortData()中加入selected();tableHead、selectOption改成大範圍監聽，搭配.closest()的使用。

// 模擬下拉選單功能
// 打開下拉選單
const selectFilter = document.querySelector(".select-custom-selected");
const selectMenu = document.querySelector(".select-custom");
selectFilter.addEventListener("click", () => selectMenu.classList.toggle("openMenu"));

const selectOption = document.querySelector(".select-custom-option");
// selectOption.addEventListener("click",selected);

function selected(e) {
    switch (e.currentTarget.nodeName) {
        case "UL":
            selectFilter.innerHTML = e.target.closest("li").innerHTML;
            break;
        case "THEAD":
            selectFilter.innerHTML = selectOption.children[e.target.closest("th").dataset.option].innerHTML;
            break;
    }
    selectMenu.classList.remove("openMenu");
}

// 顯示目前搜尋內容
const input = document.querySelector(".searchArea input");
const filterBTNs = document.querySelector(".filterBTNs");


const resultText = document.querySelector(".selectFilterArea p");

let searchType = "";
let searchTypeText = "";
let inputText = "";

filterBTNs.addEventListener("click", selectFilterBTN);

input.addEventListener("keyup", () => {
    inputText = input.value;
    if (searchType === "" && inputText === "") {
        resultText.innerHTML = `查看未指定項目比價結果`;
    } else if (searchType !== "" && inputText === "") {
        resultText.innerHTML = `查看「種類：${searchTypeText}」比價結果`;
    } else if (searchType === "" && inputText !== "") {
        resultText.innerHTML = `查看「名稱：${inputText}」比價結果`;
    } else if (searchType !== "" && inputText !== "") {
        resultText.innerHTML = `查看「種類：${searchTypeText}+名稱：${inputText}」比價結果`;
    }
});


function selectFilterBTN(e) {
    // 按鈕點擊的取消及選擇（好像可以改用checkbox?
    if (e.target.className.includes("btn-filter-active")) {
        searchType = "";
        e.target.classList.remove("btn-filter-active");
    } else {
        searchType = e.target.dataset.type;
        searchTypeText = e.target.textContent;
        const filterBTNs = document.querySelectorAll(".filterBTNs button");
        filterBTNs.forEach(i => i.classList.remove("btn-filter-active"));
        e.target.classList.add("btn-filter-active");
    }
    // 顯示目前搜尋內容
    if (searchType === "" && inputText === "") {
        resultText.innerHTML = `查看未指定項目比價結果`;
    } else if (searchType !== "" && inputText === "") {
        resultText.innerHTML = `查看「種類：${searchTypeText}」比價結果`;
    } else if (searchType === "" && inputText !== "") {
        resultText.innerHTML = `查看「名稱：${inputText}」比價結果`;
    } else if (searchType !== "" && inputText !== "") {
        resultText.innerHTML = `查看「種類：${searchTypeText}+名稱：${inputText}」比價結果`;
    }
}


// 搜尋資料

// 搜尋前表格顯示的文字
const table = document.querySelector("table tbody");
table.innerHTML = `<p>請輸入並搜尋想比價的作物名稱^＿^</p>`;

const searchBTN = document.querySelector(".searchArea .btn-search");
searchBTN.addEventListener("click", requestData);
input.addEventListener("keyup", requestData);



const upArrows = document.querySelectorAll(".fa-caret-up");
const downArrows = document.querySelectorAll(".fa-caret-down");
const selectFilterText = selectFilter.innerHTML;


let searchData = "";

function requestData(e) {
    //每次搜尋都把之前的排序樣式歸零
    upArrows.forEach(i => i.classList.remove("filterSelect"));
    downArrows.forEach(i => i.classList.remove("filterSelect"));
    selectFilter.innerHTML = selectFilterText;

    if (e.type === "click" || e.key === "Enter") {
        table.innerHTML = `<p>資料載入中...</p>`;
        axios.get("https://data.coa.gov.tw/Service/OpenData/FromM/FarmTransData.aspx").then(function (response) {
            let data = response.data;
            processDate(data);
        })
    }
}

function processDate(data) {
    searchData = data.filter(i => i["作物名稱"] !== "" && i["作物名稱"] !== null);//去掉沒有標示名稱的資料
    searchData.forEach(i => { if (i["種類代碼"] === "   ") { i["種類代碼"] = "N06" } }); //有些資料代碼是空白的但名稱看得出來是花
    let inputText = input.value;

    if (searchType !== "" && inputText === "") {
        let filterBTNText = searchType;
        searchData = searchData.filter(i => i["種類代碼"] === filterBTNText);
    } else if (searchType !== "" && inputText !== "") {
        let filterBTNText = searchType;
        searchData = searchData.filter(i => i["種類代碼"] === filterBTNText && i["作物名稱"].includes(inputText));
    } else if (searchType === "" && inputText !== "") {
        searchData = searchData.filter(i => i["作物名稱"].includes(inputText));
    }

    if (searchData.length === 0) {
        table.innerHTML = `<p>查詢不到當日的交易資訊QQ</p>`;
    } else {
        renderData(searchData);
    }

};
function renderData(data) {
    let str = "";
    data.forEach(function (i) {
        str += `<tr>
                    <td>${i["作物名稱"]}</td>
                    <td>${i["市場名稱"]}</td>
                    <td>${i["上價"]}</td>
                    <td>${i["中價"]}</td>
                    <td>${i["下價"]}</td>
                    <td>${i["平均價"]}</td>
                    <td>${i["交易量"]}</td>
                </tr>`
    });
    table.innerHTML = str;
}


// 排序資料
selectOption.addEventListener("click", sortData);

const tableHead = document.querySelector("thead");
tableHead.addEventListener("click", sortData);

function sortData(e) {
    if(searchData.length === 0)alert("沒有資料可供排序，請先進行搜尋");
    if (e.currentTarget.nodeName === "THEAD" && (e.target.closest("th").textContent === "市場名稱" || e.target.closest("th").textContent === "作物名稱")) return;

    downArrows.forEach(i => i.classList.remove("filterSelect"));
    let sortBy = (e.currentTarget.nodeName !== "THEAD") ? e.target.closest("li").dataset.property : e.target.closest("th").textContent.trim();

    if (e.target.className.includes("down")) {
        searchData.sort((item1, item2) => item1[sortBy] - item2[sortBy]);
        renderData(searchData);
        upArrows.forEach(i => i.classList.remove("filterSelect"));
        downArrows.forEach(i => {
            i.classList.remove("filterSelect");
            if (i.dataset.property === sortBy) {
                i.classList.add("filterSelect");
            };
        });
        selected(e);
        return;
    }
    if (e.target.nodeName === "TH") {
        const upArrow = e.target.querySelector(".fa-caret-up");
        const downArrow = e.target.querySelector(".fa-caret-down");
        if (upArrow.className.includes("filterSelect")) {
            searchData.sort((item1, item2) => item1[sortBy] - item2[sortBy]);
            renderData(searchData);
            upArrow.classList.remove("filterSelect");
            downArrow.classList.add("filterSelect");
            return;
        }

    }

    searchData.sort((item1, item2) => item2[sortBy] - item1[sortBy]);
    renderData(searchData);
    upArrows.forEach(i => {
        i.classList.remove("filterSelect");
        if (i.dataset.property === sortBy) {
            i.classList.add("filterSelect");
        };
    });
    selected(e);

}

