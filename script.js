document.addEventListener("DOMContentLoaded", () => {
    console.log("Página cargada y script inicializado.");

    const rankingList = [
        { id: 1, title: 'Squabble Up', artist: 'Kendrick Lamar', image: "images/song1.jpg", prevPosition: 1 },
        { id: 2, title: 'Stars Will Align', artist: 'Kygo & Imagine Dragons', image: "images/song2.jpg", prevPosition: 2 },
        { id: 3, title: 'Told You So', artist: 'Martin Garrix & Jex', image: "images/song3.jpg", prevPosition: 3 },
        { id: 4, title: 'Demasiada Información', artist: 'The Bacalaos', image: "images/song4.jpg", prevPosition: 4 },
        { id: 5, title: 'Hamaca Paraguaya', artist: 'Kchiporros', image: "images/song5.jpg", prevPosition: 5 },
    ];

    const listElement = document.getElementById("ranking-list");
    const shuffleButton = document.getElementById("shuffle-button");
    const createImageButton = document.getElementById("create-image-button");
    const imageContainer = document.getElementById("image-container");
    
    let isFirstRender = true; // Variable para controlar el primer renderizado

    function markStars() {
        console.log("Iniciando el proceso para marcar estrellas.");
        rankingList.forEach((song) => (song.hasStar = false));

        const randomIndices = [];
        while (randomIndices.length < 2) {
            const randomIndex = Math.floor(Math.random() * rankingList.length);
            if (!randomIndices.includes(randomIndex)) {
                randomIndices.push(randomIndex);
                rankingList[randomIndex].hasStar = true;
                console.log(`Estrella asignada a: ${rankingList[randomIndex].title}`);
            }
        }

        rankingList.forEach((song, index) => {
            if (song.hasStar) {
                song.prevPosition = index + 1;
            } else {
                if (index === 0) {
                    song.prevPosition = index + 2;
                } else {
                    const offset = Math.floor(Math.random() * 3) - 1;
                    song.prevPosition = Math.max(1, index + 1 + offset);
                }
            }
        });
        console.log("Estrellas marcadas y posiciones iniciales configuradas.");
    }
    
    function renderRanking() {
        console.log("Renderizando el ranking...");
        listElement.innerHTML = "";

        rankingList.forEach((song, index) => {
            const listItem = document.createElement("li");
            const currentPosition = index + 1;

            let indicatorHtml;
            if (song.hasStar) {
                indicatorHtml = `<span class="star">⭐</span>`;
                console.log(`Indicador estrella para: ${song.title}`);
            } else {
                const { symbol, class: indicatorClass } = getIndicator(song.prevPosition, currentPosition, isFirstRender);
                indicatorHtml = `<span class="indicator ${indicatorClass}">${symbol || '-'}</span>`;
                console.log(`Indicador (${symbol}) para: ${song.title}`);
            }

            listItem.classList.add("ranking-item");
            listItem.innerHTML = `
                <div class="ranking-item-container">
                    <div class="ranking-image">
                        <img src="${song.image}" alt="${song.title}">
                    </div>
                    <div class="ranking-meta">
                        <span class="position">${currentPosition}</span>
                        ${indicatorHtml}
                    </div>
                    <div class="ranking-text">
                        <span class="ranking-title">${song.title}</span>
                        <span class="ranking-artist">${song.artist}</span>
                    </div>
                </div>
            `;
            song.prevPosition = currentPosition;
            listElement.appendChild(listItem);
        });
        console.log("Ranking renderizado correctamente.");
    }
    
    function shuffleRanking() {
        console.log("Mezclando el ranking...");
        rankingList.forEach((song) => (song.hasStar = false));

        rankingList.sort(() => Math.random() - 0.5);

        console.log("Ranking mezclado. Renderizando nuevamente...");
        renderRanking();
    }

    function getIndicator(prevPosition, currentPosition, isFirstRender) {
        console.log(`Calculando indicador: prevPosition=${prevPosition}, currentPosition=${currentPosition}`);
        let indicatorClass = "";
        let indicatorSymbol = "";
    
        if (prevPosition > currentPosition) {
            indicatorClass = "up";
            indicatorSymbol = "\u2191";
        } else if (prevPosition < currentPosition && !(isFirstRender && currentPosition === 1)) {
            indicatorClass = "down";
            indicatorSymbol = "\u2193";
        } else {
            indicatorClass = "equal";
            indicatorSymbol = "-";
        }
    
        return { symbol: indicatorSymbol, class: indicatorClass };
    }
    
    function createImage() {
        console.log("Generando imagen del ranking...");
        imageContainer.innerHTML = "";
        const container = document.querySelector(".container");
        const buttons = document.querySelectorAll(".action-button");
    
        if (container) {
            buttons.forEach((button) => (button.style.display = "none"));
    
            html2canvas(container)
                .then((canvas) => {
                    buttons.forEach((button) => (button.style.display = "inline-block"));
                    imageContainer.appendChild(canvas);
                    console.log("Imagen creada exitosamente.");
    
                    const downloadButton = document.getElementById("download-image-button");
                    const imageUrl = canvas.toDataURL("image/png");
                    downloadButton.href = imageUrl;
                    downloadButton.style.display = "inline-block";
                    downloadButton.download = "ranking_musical.png";
                })
                .catch((error) => {
                    buttons.forEach((button) => (button.style.display = "inline-block"));
                    console.error("Error al crear la imagen:", error);
                });
        } else {
            console.error("No se encontró el contenedor '.container'. Verifica el HTML.");
        }
    }

    createImageButton.addEventListener("click", () => {
        console.log("Botón 'Crear Imagen' presionado.");
        createImage();
    });
    shuffleButton.addEventListener("click", () => {
        console.log("Botón 'Mezclar Ranking' presionado.");
        shuffleRanking();
    });

    console.log("Marcando estrellas...");
    markStars();
    renderRanking();

    if (isFirstRender) {
        isFirstRender = false;
        console.log("Primer renderizado completado.");
    }
});
