const navItems = document.getElementsByClassName('nav__item');
const navs = document.getElementsByClassName('nav');

for (let i = 0; i < navs.length; i++) {
    navs[i].children[0].classList.toggle('nav__item_active');
}

for (let i = 0; i < navItems.length; i++) {
    navItems[i].addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const targetParent = target.parentNode as ParentNode;

        for (let j = 0; j < targetParent.children.length; j++) {
            targetParent.children[j].classList.remove('nav__item_active');
        }
        target.classList.toggle('nav__item_active');
    })
}