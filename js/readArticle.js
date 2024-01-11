const imgArt = document.querySelector('.img-art img')
const titerArt = document.querySelector('.titer-art h1')
const contentArt = document.querySelector('.content-art p')
const main = document.querySelector('main')
const header = document.querySelector('header h2')
window.onload = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let id = urlParams.get('id')
    fetch(`https://university-baabb-default-rtdb.firebaseio.com/article.json`).then(res => res.json())
        .then(data => {
            let allArticle = Object.entries(data)
            let mainArt = allArticle.find((art) => {
                return art[1].id === id
            })
            header.innerHTML =` مقاله از دکتر ${mainArt[1].nameDoctor}`
            main.insertAdjacentHTML("beforeend", `    
        <div class="img-art">
            <img src="${mainArt[1].img}" alt="">
        </div>
        <div class="titer-art">
            <h1>${mainArt[1].titer}</h1>
        </div>
        <div class="content-art">
            <p>${mainArt[1].content}</p>
        </div>`
            )
            console.log(mainArt)
        })
}