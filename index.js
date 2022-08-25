const body = document.querySelector("body");
const menu = document.querySelector("nav");


//定義視窗高度
function calculateVh() {
    var vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', vh + 'px');
}

calculateVh();

window.addEventListener('resize', calculateVh);
window.addEventListener('orientationchange', calculateVh);

//loader
(function () {
    const fragment = document.createDocumentFragment();
    const loader = document.createElement("div");
    loader.className = "loader";
    const welcome = document.createElement("h3");
    welcome.textContent = "WELCOME";
    loader.appendChild(welcome);
    for (let i = 1; i < 6; i++) {
        const dot = document.createElement("div");
        dot.className = "dot";
        loader.appendChild(dot);
    }
    fragment.appendChild(loader);
    const wrap = document.querySelector(".wrap");
    body.insertBefore(fragment, wrap);
    setTimeout(() => {
        body.removeChild(loader);
        createBackground();
        wrap.style.display = "block";
        setTimeout(() => { wrap.style.opacity = 1; }, 800)
    }, 2000)
})();

//background
function createBackground() {
    const fragment = document.createDocumentFragment();
    const background = document.createElement("div");
    background.className = "background";
    for (let i = 0; i < 8; i++) {
        const bg_row = document.createElement("div");
        bg_row.className = "bg_row";
        for (let r = 0; r < 21; r++) {
            const bg = document.createElement("span");
            bg.className = "bg";
            bg_row.appendChild(bg);
        }
        background.appendChild(bg_row);
    }
    fragment.appendChild(background);
    body.appendChild(fragment);
}


//menu
body.addEventListener("click", () => menu.classList.remove("show"));
menu.addEventListener("click", showMenu);
function showMenu(e) {
    if (e.target.closest("ul")) return;
    this.classList.toggle("show");
    e.stopPropagation();
}

//滑動&滾動
menu.addEventListener("click", scrollPage);
window.addEventListener("scroll", scrollActive);
function scrollPage(e) {
    if (e.target.nodeName !== "A") return;
    e.preventDefault();
    let id = e.target.getAttribute("href");
    let position = document.querySelector(id).offsetTop;
    window.scrollTo({
        top: position - 10,
        behavior: "smooth"
    })
}

function scrollActive() {
    let alink = document.querySelectorAll("nav a");
    let pageYOffset = window.pageYOffset;
    alink.forEach(i => {
        let id = i.getAttribute("href");
        let position = document.querySelector(id).offsetTop;
        let height = document.querySelector(id).offsetHeight;
        if (pageYOffset > position - 100 && pageYOffset <= position + height) i.classList.add("active");
        if (pageYOffset < position - 100 || pageYOffset > position + height - 100) i.classList.remove("active");
    })

}

