/* elementlere ulaşıp obje olarak kullanma, yakalama */

const playListButton = document.getElementById("playList")
const songImage= document.getElementById("songImage")
const songName = document.getElementById("songName")
const songArtist= document.getElementById("songArtist")
const shuffleButton = document.getElementById("shuffle")
const prevButton = document.getElementById("prev")
const playButton = document.getElementById("play")
const pauseButton = document.getElementById("pause")
const nextButton = document.getElementById("next")
const repeatButton= document.getElementById("repeat")
const audio = document.getElementById("audio")
const progressBar= document.getElementById("progressBar")
const currentProgress = document.getElementById("currentProgress")
const currentTimeRef= document.getElementById("currentTime")
const maxDuration= document.getElementById("maxDuration")
const playListContainer = document.getElementById("playListContainer")
const closeButton= document.getElementById("closeButton")
const playListSongs =document.getElementById("playListSongs")

// indis şarkı için

let index

// döngü durumu 
let loop = true

let songsList =[
    {
        name : "Basima Belasin",
        link : "assets/Basima-Belasin.mp3",
        artist : "Aleyna Tilki",
        image : "assets/Aleyna-Tilki.jpg"
    },
    {
        name : "Bi Tek Ben Anlarım",
        link : "assets/Bi-Tek-Ben-Anlarim.mp3",
        artist : "KOFN",
        image : "assets/KOFN.jpg"
    },
    {
        name : "Dip",
        link : "assets/Dip.mp3",
        artist : "Madrigal",
        image : "assets/Madrigal.jpg"
    },
    {
        name : "Sarmasik",
        link : "assets/Mabel-Matiz-Sarmasik.mp3",
        artist : "Mabel Matiz",
        image : "assets/Mabel-Matiz.jpg"
    },
    {
        name : "Unutulacak Dünler",
        link : "assets/Unutulacak-Dunler.mp3",
        artist : "Gazapizm",
        image : "assets/Gazapizm.jpg"
    }
]

let events={
    mouse :{
        click : "click"
    },
    touch :{
     click:"touchstart"
    }
}
let deviceType = ""

const isTouchDevice = () =>{
  try{
    document.createEvent("TouchEvent")
    deviceType ="touch"
    return true

  }catch(e){
    deviceType ="mouse"
    return false
  }
}
// time formatting

const timeFormatter = (timeInput) =>{
let minute = Math.floor(timeInput / 60)
minute = minute < 10 ? "0" + minute : minute
let second =Math.floor(timeInput % 60)
second = second <10 ? "0" + second : second
return `${minute} : ${second}`
}

// set song 
const setSong = (arrayIndex) => {
    console.log(arrayIndex)
    let {name, link, artist, image} = songsList[arrayIndex]
    audio.src = link
    songName.innerHTML = name
    songArtist.innerHTML = artist
    songImage.src = image

 // metadata yüklendiğinde süreyi göster
    audio.onloadedmetadata =() =>{
    maxDuration.innerText = timeFormatter(audio.duration)
} 
playListContainer.classList.add('hide')
playAudio()
 }

 // play the song
 const playAudio =()=>{
    audio.play()
    pauseButton.classList.remove('hide')
    playButton.classList.add('hide')
 }

// repeat

repeatButton.addEventListener('click', ()=>{
    if(repeatButton.classList.contains('active')){
        repeatButton.classList.remove('active')
        audio.loop= false
        console.log('tekrar kapatıldı')
    }else{
        repeatButton.classList.add('active')
        audio.loop = true
        console.log(' tekrar açık')
    }
})
// sıradaki şarkıya geç
const nextSong = () =>{
    if(loop){
        if(index == (songsList.length - 1)){
            index = 0
        }else{
            index += 1
        }
    setSong(index)
    playAudio()
    }
    else{  // döngü açık değilse karışık çalması
    let randIndex = Math.floor(Math.random() * songsList.length )
    console.log(randIndex)
    setSong(randIndex)
    playAudio()
}
}
// stop the sing

const pauseAudio =()=>{
    audio.pause()
    pauseButton.classList.add('hide')
    playButton.classList.remove ('hide')
}

// önceki şarkıya geç
const previousSong = ()=>{
    if(index > 0){
        pauseAudio()
        index -= 1
    }else{
        index = songsList.length -1
    }
    setSong(index)
    playAudio()
}

// şarkı kendisi biterse sonrakine geç 
audio.onended = () =>{
    nextSong()
}

// shuffle songs

shuffleButton.addEventListener('click', ()=>{
    if(shuffleButton.classList.contains('active')){
        shuffleButton.classList.remove('active')
        loop =true
        console.log('karıştırma kapalı')
    }else{
        shuffleButton.classList.add('active')
        loop =false
        console.log('karıştırma açık')
    }
})

// play button 
playButton.addEventListener('click', playAudio)

// next button
nextButton.addEventListener('click', nextSong)

// pause button
pauseButton.addEventListener('click', pauseAudio )

// prev button
prevButton.addEventListener('click', previousSong)

// cihaz tipini seç

isTouchDevice ()
progressBar.addEventListener(events[deviceType].click, (event)=>{
// progressbarı başlat
    let coordStart = progressBar.getBoundingClientRect().left //sayfanın sol üst köşesine göre pozisyonunu ve boyutunu belirle
// mouse click yapma 
    let coordEnd = !isTouchDevice() ? event.clientX : event.touches[0].clientX //dokunmatik cihaz veya fare etkinliklerini takip etmek ve konumlarını belirlemede kullanılır
let progress = (coordEnd - coordStart) / progressBar.offsetWidth // progressbar genişliği

    // genişiliği progress e ata 
 currentProgress.style.width = progress *100 + "%"
 
 //zamanı ata
audio.currentTime = progress * audio. duration


// oynat
audio.play()
playButton.classList.add('hide')
pauseButton.classList.remove('hide')
})






// zamana göre progress i güncelle
setInterval(()=>{
    console.log('set interval run')
    currentTimeRef.innerHTML = timeFormatter(audio.currentTime)
   currentProgress.style.width= (audio.currentTime / audio.duration) * 100 +'%'
   
},1000)
 // zamanı güncelle

 audio.addEventListener('timeupdate',()=>{
  currentTimeRef.innerText =timeFormatter(audio.currentTime)
 })

 
// playlist oluştur

const initializePlayList =() =>{
    for(let i in songsList){
        playListSongs.innerHTML += ` <li class="playlistSong" 
        onclick="setSong(${i})">
        <div class="playlist-image-container">
          <img src="${songsList[i].image}" alt="">
        </div>
        <div class="playlist-song-details">
          <span id="playlist-song-name">${songsList[i].name}</span>
          <span id="playlist-song-artist-album">${songsList[i].artist}</span>
        </div>
        
        </li>`
    }
    }
    //şarkı listesini göster
    playListButton.addEventListener("click", ()=>{
     playListContainer.classList.remove('hide')
    })

    // şarkı listesini kapat
    closeButton.addEventListener("click", ()=>{
        playListContainer.classList.add('hide')
    })
    //ekrana yüklenirken
    window.onload =()=>{
        index= 0
        setSong(index)
        pauseAudio()
        //playlist oluştur
        initializePlayList()
    }

    