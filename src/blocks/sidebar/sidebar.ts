const initSidebar = () => {
    const toggleSideBar = cast(document.getElementById("toggle-sidebar"), HTMLElement);
    const sidebar = cast(document.getElementById("sidebar"), HTMLElement);

    if (!!toggleSideBar && !!sidebar) {
        toggleSideBar.addEventListener("click", () => {
            sidebar.classList.toggle("sidebar_opened");
        });
    }
};

initSidebar();
