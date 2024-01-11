const inputUploadImg = document.querySelector('#img')
const inputTiter = document.querySelector('#titer')
const inputContent = document.querySelector('#content')
const idArticle = document.querySelector('#id-article')
const btnSend = document.querySelector('#btnSend')

inputContent.addEventListener('input', () => {
    document.querySelector('.content-article-demo p').innerHTML = inputContent.value
})


inputTiter.addEventListener('input', () => {
    document.querySelector('.titer-article-demo h1').innerHTML = inputTiter.value
})
let img = document.querySelector('#img-article-demo')

function handleFileUpload(event) {
    let valueInput = inputUploadImg.value
    let creatSrc = valueInput.split('C:\\fakepath\\')
    let src = `image/${creatSrc[1]}`
    img.src = src
}

btnSend.addEventListener('click', postArticle)

function postArticle() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let accountName = urlParams.get('accountName');
    console.log('clicked')
    fetch(`https://university-baabb-default-rtdb.firebaseio.com/article.json`, {
        method: 'POST',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            id: idArticle.value,
            content: inputContent.value,
            img: img.src,
            titer: inputTiter.value,
            nameDoctor: accountName
        })
    }).then(() => {
        alert(` مقاله ی شما با موفقیت ثبت شد جناب دکتر ${accountName}`)

    }).catch(err => console.log(err))
}


inputUploadImg.addEventListener('change', handleFileUpload)
