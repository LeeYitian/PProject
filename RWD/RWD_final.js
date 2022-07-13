// menu toggle
const hamburger = document.querySelector(".hamburger");
const body = document.querySelector("body");
hamburger.addEventListener("click", () => body.classList.toggle("show"));


//  main page menu effect
let sitePath = window.location.pathname;
let siteLocation = sitePath.split("/");
// console.log(siteLocation);
if (siteLocation[siteLocation.length-1] === "RWD_final_main.html") {
    // menu scroll
    const menu = document.querySelector(".menu");

    menu.addEventListener("click", function (e) {
        e.preventDefault();
        let ID = e.target.getAttribute("href")
        let scrollPos = document.querySelector(ID).offsetTop;
        window.scrollTo({
            top: scrollPos - 50,
            behavior: "smooth"
        });
    }, { passive: false });

    // menu active when scroll
    window.addEventListener("scroll", function () {
        let menuItem = document.querySelectorAll(".menu a");
        menuItem.forEach(function (i) {
            let ID = i.getAttribute("href");
            let position = document.querySelector(ID).offsetTop;
            let area = document.querySelector(ID).offsetHeight;

            (window.pageYOffset >= position - 100 && window.pageYOffset <= (position - 100 + area)) ? i.classList.add("menu-active") : i.classList.remove("menu-active");
        })
    }, { passive: false });
};

//cart page favorite toggle
const favoriteIcon = document.querySelectorAll(".favoriteIcon");
// console.log(favoriteIcon)

favoriteIcon.forEach(checkFavorite);
function checkFavorite(item) {
    item.addEventListener("click", () => item.classList.toggle("favoriteChecked"));
};

// cart page search
const productItem = document.querySelectorAll(".productArea li");
const searchBTN = document.querySelector(".searchCart button");
const userInput = document.querySelector("input[type='text']");
const ul = document.querySelector(".productArea ul");


searchBTN.addEventListener("click", () => productItem.forEach(searchChi));
userInput.addEventListener("keyup", function (e) {
    let userInputText = userInput.value;
    if (userInputText === "") {
        productItem.forEach(item => {
            item.style.display = "";
        });

    } else if (e.key === "Enter") {
        productItem.forEach(searchChi);
    }
})

function searchChi(item) {
    let userInputText = userInput.value;
    let productChi = item.querySelector("h2");
    let productEng = item.querySelector("h3");
    if (userInputText === "") {
        alert("請輸入搜尋文字");
        return;
    } else if (productChi.innerText.indexOf(userInputText) > -1 || productEng.innerText.toUpperCase().indexOf(userInputText.toUpperCase()) > -1) {
        item.style.display = "";
    } else {
        
        item.style.display = "none";
    };
}

// cartIcon toggle
const cartBTN = document.querySelectorAll(".productArea li button:last-of-type");

cartBTN.forEach(i=>{
    i.addEventListener("click",()=>i.classList.toggle("cartChecked"));
});

// cartNum change
let num = 0;

cartBTN.forEach(i=>{
    i.addEventListener("click",()=>{
        if(i.classList.contains("cartChecked")){
            num ++;
        }else{
            num --;
        }
        let cartNum = document.querySelector(".circleNUM");
        // console.log(cartNum)
        cartNum.innerHTML = num;
    })
})






