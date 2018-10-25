const navItems = document.getElementsByClassName("nav__item");
const navs = document.getElementsByClassName("nav");

for (const nav of navs) {
    nav.children[0].classList.toggle("nav__item_active");
}

for (const navItem of navItems) {
    navItem.addEventListener("click", (e) => {
        const target = cast(e.target, HTMLElement);
        const targetParent = target.parentNode as ParentNode;

        const otherOptions = targetParent.children;
        for (const otherOption of otherOptions) {
            otherOption.classList.remove("nav__item_active");
        }
        target.classList.toggle("nav__item_active");
    });
}
