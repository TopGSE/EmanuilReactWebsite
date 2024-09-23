// Function to display songs dynamically
function loadSongs() {
    const songList = document.getElementById('song-list');

    songs.forEach((song, index) => {
        // Create list item for each song
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.textContent = song.title;
        a.href = '#'; // Prevent default page reload

        // Add click event to load song details
        a.addEventListener('click', () => loadSongDetails(index));

        li.appendChild(a);
        songList.appendChild(li);
    });
}

// Function to display the song details (lyrics and chords)
function loadSongDetails(index) {
    const song = songs[index];

    // Create a section to show the lyrics and chords dynamically
    const main = document.querySelector('main');
    main.innerHTML = `
        
            <h1>${song.title}</h1>
            <button id="toggleChords">Show Chords</button>
      
        <div id="lyrics">
            <pre>${song.lyrics}</pre>
        </div>
        <div id="lyricsWithChords" style="display: none;">
            <pre>${song.chords}</pre>
        </div>
    `;

    // Add functionality to toggle between lyrics and chords
    const toggleChordsBtn = document.getElementById('toggleChords');
    const lyrics = document.getElementById('lyrics');
    const lyricsWithChords = document.getElementById('lyricsWithChords');

    toggleChordsBtn.addEventListener('click', function () {
        if (lyrics.style.display === "none") {
            lyrics.style.display = "block";
            lyricsWithChords.style.display = "none";
            toggleChordsBtn.textContent = "Show Chords";
        } else {
            lyrics.style.display = "none";
            lyricsWithChords.style.display = "block";
            toggleChordsBtn.textContent = "Show Lyrics";
        }
    });
}

// Search functionality to filter songs
function filterSongs() {
    const searchInput = document.getElementById('search-bar').value.toLowerCase();
    const songList = document.getElementById('song-list');
    const songsLi = songList.getElementsByTagName('li');

    for (let i = 0; i < songsLi.length; i++) {
        const songTitle = songsLi[i].textContent.toLowerCase();

        if (songTitle.includes(searchInput)) {
            songsLi[i].style.display = '';
        } else {
            songsLi[i].style.display = 'none';
        }
    }
}

// Load songs when the page is ready
document.addEventListener("DOMContentLoaded", loadSongs);
