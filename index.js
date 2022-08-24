//loader
(function (){
    const fragment = document.createDocumentFragment();
    const loader = document.createElement("div");
    loader.className = "loader";
    const welcome = document.createElement("h3");
    welcome.textContent = "WELCOME";
    loader.appendChild(welcome);
    for(let i = 1; i<6;i++){
        const dot = document.createElement("div");
        dot.className = "dot";
        loader.appendChild(dot);
    }
    fragment.appendChild(loader);
    const wrap = document.querySelector(".wrap");
    document.querySelector("body").insertBefore(fragment,wrap);
    setTimeout(()=>{
        document.querySelector("body").removeChild(loader);
        createBackground();
        wrap.style.display = "block";
        setTimeout(()=>{wrap.style.opacity = 1;},800)
    },2000)
})();

//background
function createBackground(){
    const fragment = document.createDocumentFragment();
    const background = document.createElement("div");
    background.className = "background";
    for(let i = 0; i<8;i++){
        const bg_row = document.createElement("div");
        bg_row.className = "bg_row";
        for (let r = 0; r<21; r++){
            const bg = document.createElement("span");
            bg.className = "bg";
            bg_row.appendChild(bg);
        }
        background.appendChild(bg_row);
    }
    fragment.appendChild(background);
    document.querySelector("body").appendChild(fragment);
}


//menu
const menu = document.querySelector("nav");
const body = document.querySelector("body");
body.addEventListener("click",()=>menu.classList.remove("show"));
menu.addEventListener("click",showMenu);
function showMenu(e){
    if(e.target.closest("ul"))return;
    this.classList.toggle("show");
    e.stopPropagation();
}

