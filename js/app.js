const app = {
    // Sélecteurs
    themeBtn: document.querySelector(".btn--theme"),
    container: document.querySelector(".container"),

    // Fonctions
    init: function(){
        app.handleTheme();
    },

    handleTheme: function() {
        app.themeIcon = app.themeBtn.querySelector("i");
        app.themeBtn.addEventListener("click", function () {
            if (app.themeIcon.classList.contains('bi-brightness-high')){
                app.themeIcon.setAttribute("class", "bi-moon");
                app.container.setAttribute("id", "theme-light");
            } else {
                app.themeIcon.setAttribute("class", "bi-brightness-high");
                app.container.setAttribute("id", "theme-dark");
            }
        })
    },
};

document.addEventListener("DOMContentLoaded", app.init);