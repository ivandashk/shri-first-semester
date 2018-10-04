const navItems = document.getElementsByClassName('nav__item');
const navs = document.getElementsByClassName('nav');

for (let i = 0; i < navs.length; i++) {
    navs[i].children[0].classList.toggle('nav__item_active');
}

for (let i = 0; i < navItems.length; i++) {
    navItems[i].addEventListener('click', (e) => {
        for (let j = 0; j < e.target.parentNode.children.length; j++) {
            e.target.parentNode.children[j].classList.remove('nav__item_active');
        }
        e.target.classList.toggle('nav__item_active');
    })
}