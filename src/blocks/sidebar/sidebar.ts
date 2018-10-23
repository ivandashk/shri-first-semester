const toggleSideBar: HTMLElement | null = document.getElementById("toggle-sidebar");
const sidebar: HTMLElement | null = document.getElementById("sidebar");

if(!!toggleSideBar && !!sidebar) {
    toggleSideBar.addEventListener("click", () => {
        sidebar.classList.toggle("sidebar_opened");
    });
}