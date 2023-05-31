const app = {
    // Sélecteurs
    themeBtn: document.querySelector(".btn--theme"),
    startBtn: document.querySelector(".btn--game-status"),
    pastilles: document.querySelector(".colors").querySelectorAll(".pastille"),
    difficultyBtns: document.querySelector(".difficulty__btns"),

    container: document.querySelector(".container"),
    game: document.querySelector(".game"),

    scorePoints: document.querySelector("#score"),
    scoreAccuracy: document.querySelector("#accuracy"),
    timer: document.querySelector(".timer__counter"),

    endGameModal: document.querySelector(".end-game"),
    endGameScore: document.querySelector(".end-game__score"),
    endGameAccuracy: document.querySelector(".end-game__accuracy"),
    endGameDiff: document.querySelector(".end-game__difficulty"),


    // Variables
    score: 0,
    accuracy: 100,
    gameOn: false,
    numberOfClick: 0,

    // Fonctions
    init: function(){
        app.scorePoints.textContent = app.score; 
        app.gameSettings(59,"medium")
        app.handleDifficulty();
        app.handleTheme();
        app.handleTargetColor();
        app.startBtn.addEventListener("click", app.startGame);
        // Permet de démarrer la partie également en appuyant sur la barre espace
        document.addEventListener("keydown", e => {
            if (e.code === "Space"){
                app.startGame();
            }
        })
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
     * Permet de gérer la couleur des targets
     */
    handleTargetColor: function () {
        app.pastilles.forEach(el => {
            el.addEventListener("click", setColor)
        })

        function setColor(e) {
            // On change la couleur de la pastille en prenant la deuxième classe de la pastille clickée
            app.dotColor = e.currentTarget.classList[1];

            // Pour chaque pastille, on vérifie si elle contienne la classe pastille--active
            // Si oui alors on remove cette class et on l'ajoute à la pastille clickée
            app.pastilles.forEach(el => {
                if (el.classList.contains("pastille--active")){
                    el.classList.remove("pastille--active")
                }
                e.currentTarget.classList.add("pastille--active")
            })
        }
    },

    /**
     * Permet de gérer les paramètres de la partie en terme de difficulté et de couleur des cibles
     */
    gameSettings: function(time, defaultDiff){
        app.dotColor = "colors__first";
        app.seconds = time;
        app.difficulty = defaultDiff;

        app.changeDifficulty(app.difficulty)
    },

    /**
     * Permet de gérer la difficulté
     */
    handleDifficulty(){
        app.levelBtn = app.difficultyBtns.querySelectorAll(".btn");

        app.levelBtn.forEach(el => {
            el.addEventListener("click", setLevel)
        })

        function setLevel(e) {
            // On empêche de changer la difficulté pendant la partie
            if (app.gameOn){return}
            // On change la difficulté en fonction du contenu du bouton
            app.difficulty = e.currentTarget.getAttribute("data-diff")

            // Pour chaque bouton, on vérifie si il contient la classe diff--active
            // Si oui alors on remove cette class et on l'ajoute au bouton clické
            app.levelBtn.forEach(el => {
                if (el.classList.contains("diff--active")){
                    el.classList.remove("diff--active")
                }
                e.currentTarget.classList.add("diff--active")
            })

            app.changeDifficulty(app.difficulty)
        }
    },
    /**
     * Permet de changer la difficulté et d'y appliquer les paramètres
     */
    changeDifficulty: function(diff) {
        // ATTENTION, la taille est exprimée en rem
        if (diff === "easy"){
            app.targetSize = 2;
            app.dotAnimation = "1s linear 1 pop";
        } else if (diff === "medium"){
            app.targetSize = 1.5;
            app.dotAnimation = "s linear infinite alternate pop";
        } else if (diff === "hard") {
            app.targetSize = 1;
            app.dotAnimation = ".5s ease-in-out infinite alternate hard";
        }
    },

    /**
     * Démarre la partie
     */
    startGame: function() {
        app.game.textContent = "";
        app.endGameModal.classList.add("hidden");
        if (!app.gameOn){
            app.startBtn.textContent = "Reset";
            app.setTimer();
            app.popTarget();
            app.gameOn = true;

            app.game.addEventListener("click", app.handleAccuracy)

        } else {
            app.resetGame();
            
            app.gameOn = false;
        }
    },
    handleAccuracy: function(){
        app.numberOfClick += 1;
        app.accuracy = app.setAccuracy();
        app.scoreAccuracy.textContent = `${app.accuracy}%`
    },


    /**
     * Reset la partie en attribuant les valeurs par défaut
     */
    resetGame: function() {
        clearInterval(app.intervalId);
        app.game.removeEventListener("click", app.handleAccuracy);
        app.seconds = 59;
        app.score = 0;
        app.accuracy = 100;
        app.numberOfClick = 0;

        app.game.textContent = "";
        app.timer.textContent = "01 : 00";
        app.startBtn.textContent = "Start";
        app.scorePoints.textContent = app.score;
        app.scoreAccuracy.textContent = app.accuracy + "%";

        app.timer.style.color = "var(--color-second)"
    },

    /**
     * Fin de partie. On affiche le score ou d'autres informations pertinentes.
     */
    endGame: function(){
        app.gameOn = false;
        app.endGameModal.classList.remove("hidden");
        if (app.accuracy >= 80){
            app.endGameAccuracy.style.color = "green";
        } else if (app.accuracy >= 50) {
            app.endGameAccuracy.style.color = "orange";
        } else {
            app.endGameAccuracy.style.color = "crimson";
        }
        app.endGameScore.textContent = `${app.score} pts`;
        app.endGameAccuracy.textContent = `${app.accuracy}%`;

        if (app.difficulty === "easy"){
            app.endGameDiff.style.color = "green";
        } else if (app.difficulty === "medium"){
            app.endGameDiff.style.color = "orange";
        } else {
            app.endGameDiff.style.color = "crimson";
        }
        app.endGameDiff.textContent = app.difficulty;
    },


    /**
     * Apparition des cibles de manière aléatoire
     */
    popTarget: function() {
        const newTarget = document.createElement("div");
        newTarget.classList.add("dot");
        newTarget.style.width = app.targetSize + "rem";
        newTarget.style.animation = app.dotAnimation;
        newTarget.classList.add(app.dotColor);
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

    /**
     * Retourne la précision en pourcentage
     */
    setAccuracy: function(){
        // Formule : (score / nombre de click total)*100
        return Math.round((app.score / app.numberOfClick)*100)
    },

    /**
     * Permet de lancer le timer
     */
    setTimer: function() {
        app.timer.textContent = "01 : 00";
        app.intervalId = setInterval(playTimer,1000);

        function playTimer(){
            // On avertit le joueur qu'il ne reste plus beaucoup de temps en lui changeant la couleur du timer.
            // On indique également qu'on ajoute un 0 lorsqu'on passe à moins de 10 secondes dans un soucis esthétique.
            if (app.seconds < 10){
                app.timer.style.color = "crimson";
                app.timer.textContent = `00 : 0${app.seconds}`
            } else {
                app.timer.textContent = `00 : ${app.seconds}`
            }
            app.seconds -= 1;
            
            if (app.seconds === -1){
                clearInterval(app.intervalId);
                app.endGame();
                app.resetGame();
            }
        }
    }
};

document.addEventListener("DOMContentLoaded", app.init);