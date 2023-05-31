const app = {
    // Sélecteurs
    themeBtn: document.querySelector(".btn--theme"),
    container: document.querySelector(".container"),
    startBtn: document.querySelector(".btn--game-status"),
    game: document.querySelector(".game"),
    scorePoints: document.querySelector("#score"),

    // Variables
    score: 0,

    // Fonctions
    init: function(){
        app.scorePoints.textContent = app.score;
        app.handleTheme();
        app.startBtn.addEventListener("click", app.startGame)
    },
    /**
     * Démarre la partie
     */
    startGame: function() {
        app.game.textContent = "";
        app.startBtn.textContent = "Reset";
        app.popTarget();
    },

    /**
     * Permet de changer de thème : dark <=> light
     */
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

    /**
     * Apparition des cibles de manière aléatoire
     */
    popTarget: function() {
        const newTarget = document.createElement("div");
        newTarget.classList.add("dot");
        newTarget.style.top = app.getRandomNumber(6,100) + "%";
        newTarget.style.left = app.getRandomNumber(3,100) + "%";

        app.game.appendChild(newTarget)

        newTarget.addEventListener("click", () => {
            app.score += 1;
            app.scorePoints.textContent = app.score;
            app.game.textContent = "";
            app.popTarget();
        })
    },

    /**
     * Génération d'un nombre aléatoire compris en min (inclus) et max (inclus)
     */
    getRandomNumber: function(min, max){
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
};

document.addEventListener("DOMContentLoaded", app.init);