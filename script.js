// Definindo variáveis para selecionar elementos do HTML
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// Chave de armazenamento no localStorage
const PLAYER_STORAGE_KEY = "Music_Player_D2D";

// Selecionando elementos do player
const player = $(".player");
const cd = $(".player__cd");
const cdThumb = $(".player__cd-thumb");
const playBtn = $(".btn-toggle-play");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const progress = $(".player__progress-bar");
const audio = $("#js-player-audio");
const playList = $(".player__playlist");

// Definindo propriedades do aplicativo
const app = {
    // Índice da música atual
    currentIndex: 0,
    // Array de índices para reprodução aleatória
    indexArray: [],
    // Contador para reprodução aleatória
    indexSum: 0,
    // Status de reprodução
    isPlaying: false,
    // Modo aleatório ativado?
    isRandom: false,
    // Repetir música ativado?
    isRepeat: false,

    // Lista de músicas
    songs: [
        {
            // Índice da música
            index: 1,
            // Nome da música
            name: "Sweet Child O' Mine",
            // Artista
            singer: "Guns N' Roses",
            // Duração da música
            duration: "5:56",
            // URL da imagem da capa
            image: "https://i.scdn.co/image/ab67616d00001e0221ebf49b3292c3f0f575f0f5",
            // URL da música (substitua por sua URL)
            path: "Your Music"
        },
        {
            // Índice da música
            index: 2,
            // Nome da música
            name: "Smells Like Teen Spirit",
            // Artista
            singer: "Nirvana",
            // Duração da música
            duration: "5:01",
            // URL da imagem da capa
            image: "https://i.scdn.co/image/ab67616d00001e02fbc71c99f9c1296c56dd51b6",
            // URL da música (substitua por sua URL)
            path: "Your Music"
        },
        {
            // Índice da música
            index: 3,
            // Nome da música
            name: "The Great Gig in the Sky",
            // Artista
            singer: "Pink Floyd",
            // Duração da música
            duration: "4:43",
            // URL da imagem da capa
            image: "https://i.scdn.co/image/ab67616d00001e02ea7caaff71dea1051d49b2fe",
            // URL da música (substitua por sua URL)
            path: "Your Music"
        },
    ],

    // Definindo propriedades dinâmicas
    defineProperties: function () {
        // Propriedade "currentSong" que retorna a música atual
        Object.defineProperty(this, "currentSong", {
            get: function () {
                return this.songs[this.currentIndex];
            },
        });
    },

    // Renderizando a lista de músicas
    renderSongs: function () {
        // Criando HTML para cada música
        let htmls = this.songs.map((song, index) => {
            return `
        <div class="player__song" data-index=<span class="math-inline">\{index\}\>
<div class\="player\_\_song\-number"\></span>{song.index}</div>
          <div class="player__song-infos">
            <h3 class="player__song-title"><span class="math-inline">\{song\.name\}</h3\>
<p class\="player\_\_song\-author"\></span>{song.singer}</p>
          </div>
          <div class="player__song-duration">${song.duration}</div>
        </div>
      `;
        });

        // Inserindo o HTML na playlist
        playList.innerHTML = htmls.join("");
    },

    // Definindo eventos
    handleEvents: function () {
        const _this = this;

        // Ajustando a largura do CD de acordo com o scroll
        const cdWidth = cd.offsetWidth;
        document.onscroll = function () {
            let scrollHeight = window.scrollY || document.documentElement.scrollTop;
            let cdNewWidth = cdWidth - scrollHeight;
            cd.style.width = cdNewWidth > 0 ? `${cdNewWidth}px` : 0;
            cd.style.opacity = cdNewWidth / cdWidth;
        };

        // Botão de Play/Pause
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                _this.loadCurrentSong();
                audio.play();
            }
        };

        // Eventos de reprodução da música
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add("playing");
            cdRotate.play();
        };
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove("playing");
            cdRotate.pause();
        };

        audio.ontimeupdate = function () {
            if (audio.currentTime) {
                progress.value = (audio.currentTime / audio.duration) * 100;
            }
        };

        progress.onchange = function () {
            audio.currentTime = (progress.value * audio.duration) / 100;
        };

        const cdRotate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
            duration: 10000,
            iterations: Infinity
        });
        cdRotate.pause();

        nextBtn.onclick = function () {
            let songList = Array.prototype.slice.call($$(".player__song"));
            let oldIndex = _this.currentIndex;
            let oldItemSong = songList.find(function (value) {
                return value.dataset.index == oldIndex;
            });
            oldItemSong.classList.remove("active");
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.currentIndex++;
                if (_this.currentIndex >= _this.songs.length) {
                    _this.currentIndex = 0;
                }
            }
            _this.loadCurrentSong();
            audio.play();
        };

        prevBtn.onclick = function () {
            let songList = Array.prototype.slice.call($$("player__song"));
            let oldIndex = _this.currentIndex;
            let oldItemSong = songList.find(function (value) {
                return value.dataset.index == oldIndex;
            });
            oldItemSong.classList.remove("active");
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.currentIndex--;
                if (_this.currentIndex < 0) {
                    _this.currentIndex = _this.songs.length - 1;
                }
            }
            _this.loadCurrentSong();
            audio.play();
        };

        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom;
            randomBtn.classList.toggle("active", _this.isRandom);
        };

        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        };

        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat;
            repeatBtn.classList.toggle("active", _this.isRepeat);
        };

        playList.onclick = function (e) {
            let songNode = e.target.closest(".player__song:not(.active)");
            let optionNode = e.target.closest(".player__song-duration");
            let oldIndex = _this.currentIndex;
            let songList = Array.prototype.slice.call($$(".player__song"));
            let oldItemSong = songList.find(function (value) {
                return value.dataset.index == oldIndex;
            });
            if (songNode || optionNode) {
                if (songNode && !optionNode) {
                    oldItemSong.classList.remove("active");
                    _this.currentIndex = songNode.dataset.index;
                    _this.loadCurrentSong();
                    audio.play();
                }
                if (optionNode) {
                    console.log(optionNode);
                }
            }
        };
    },

    playRandomSong: function () {
        let newIndex = 0;
        if (this.indexSum >= this.songs.length) {
            this.indexSum = 0;
            this.indexArray = [];
        }
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (
            newIndex === this.currentIndex ||
            this.indexArray.indexOf(newIndex) !== -1
        );
        this.indexArray.push(newIndex);
        this.indexSum++;
        this.currentIndex = newIndex;
    },

    loadCurrentSong: function () {
        let playingNow = document.querySelector("#js-playing-now h2");
        let durationSong = document.querySelector('#js-duration-song');

        playingNow.innerText = this.currentSong.index + '. ' + this.currentSong.name;
        durationSong.innerText = this.currentSong.duration;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;

        let songList = Array.prototype.slice.call($$(".player__song"));
        let itemSong = songList.find((value) => {
            return value.dataset.index == this.currentIndex;
        });
        if (itemSong) {
            itemSong.classList.add("active");
        }

        setTimeout(() => {
            let songActive = $(".player__song.active");
            if (songActive) {
                songActive.scrollIntoView({
                    behavior: "smooth",
                    block: "end"
                });
            }
        }, 200);
    },

    start: function () {
        this.defineProperties();
        this.handleEvents();
        this.loadCurrentSong();
        this.renderSongs();
    }
};

app.start();