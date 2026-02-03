const navbarMenu = document.querySelectorAll(".navbar .navbar__menu-link");

navbarMenu.forEach(link => {
    link.addEventListener("click", () => {
        navbarMenu.forEach(item => item.classList.remove("navbar__menu-link--active"));

        link.classList.add("navbar__menu-link--active");
    });
});