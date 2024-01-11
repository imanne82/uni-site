let btnLoginPatients = document.querySelector('#btn-login-patients')
let btnLoginDoctor = document.querySelector('#btn-login-doctor')
const btnStart = document.querySelector('#btn-start')
const containerResultSearch = document.querySelector('.container-result-search')
const containerArticle = document.querySelector('.container-article')
const closeAdvertising = document.querySelector('#close-advertising')
let containerAdvertising = document.querySelector('.container-advertising')
btnStart.addEventListener('click', () => {
    document.querySelector('#search-box').scrollIntoView({
        behavior: "smooth"
    })
})

function urlParams() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let accountName = urlParams.get('accountName');
    let role = urlParams.get('role')
    return [urlParams, accountName, role]
}


let isLogin = false
window.onload = () => {
    let url = urlParams()
    if (url[0].has('role')) {
        if (url[2] === 'دکتر') {
            btnLoginPatients.innerHTML = 'افزودن مقاله'
            btnLoginPatients.href = `creatArticle.html?accountName=${url[1]}&role=${url[2]}`
            btnLoginDoctor.innerHTML = "بیماران من"
            btnLoginDoctor.href = `myPatients.html?accountName=${url[1]}&role=${url[2]}`;
            isLogin = true
        } else if (url[2] === 'بیمار') {
            btnLoginPatients.innerHTML = 'دریافت نوبت'
            isLogin = true
            btnLoginDoctor.style.display = 'none'
            btnLoginPatients.href = `gettingAppointment.html?accountName=${url[1]}&role=${url[2]}`
        }
    } else {
        console.log('پارامتر role در URL وجود ندارد');
    }

    getArticle()
    setTimeout(() => {
        window.scrollTo(0, 0)
        containerAdvertising.style.display = 'block'
    }, 3000)
}

function getArticle() {
    fetch(`https://university-baabb-default-rtdb.firebaseio.com/article.json`).then(res => res.json())
        .then(data => {
            let allArticle = Object.entries(data)
            containerArticle.innerHTML = ''
            allArticle.forEach(data => {
                containerArticle.insertAdjacentHTML('beforeend', `
                <div class="box-article">
            <div class="img-head-article">
                <img src="${data[1].img}" alt="">
            </div>
            <div class="titer-article">
                <h2>${data[1].titer}</h2>
            </div>
            <div class="btn-read-article">
                <button onclick="readArticle(${data[1].id})">خواندن</button>
            </div>
               
                `)
            })

        }).catch(() => alert("خطا در دریافت مقاله ها"))
}

function readArticle(id) {
    window.open(`readArticle.html?id=${id}`)
}

let listDoctor = []
fetch('https://university-baabb-default-rtdb.firebaseio.com/doctor.json').then(res => res.json())
    .then(data => {
        let convertData = Object.entries(data)
        convertData.forEach(data => {
            listDoctor.push(data[1])
        })
    })
    .catch(() => alert('اتصال به درستی برقرار نیست'))

const inputS = document.querySelector('#input-s')
inputS.addEventListener('input', () => {
    let resultSearch = listDoctor.filter((doctor) => {
        return doctor.username.includes(inputS.value);
    });
    if (resultSearch !== []) {
        containerResultSearch.style.display = 'block'
        containerResultSearch.innerHTML = ''
        resultSearch.forEach((doctor) => {
            templateResultSearch(doctor)
        })
    }
    if (inputS.value === '') {
        containerResultSearch.style.display = 'none'
    }
    if (resultSearch.length === 0) {
        containerResultSearch.style.display = 'block'
        containerResultSearch.innerHTML = inputS.value
    }
})


function templateResultSearch(doctor) {
    containerResultSearch.insertAdjacentHTML('beforeend', `
               <div class="result-search">
                <span>دکتر ${doctor.username}</span>
                <button onclick="setTimeDoctor(${doctor.id})" > دریافت نوبت</button>
            </div>
`)
}

function setTimeDoctor(id) {
    let url = urlParams()
    fetch('https://university-baabb-default-rtdb.firebaseio.com/doctor.json').then(res => res.json())
        .then(data => {
            let allDoctor = Object.entries(data)
            let doctor = allDoctor.find((doctor) => {
                return doctor[1].id === id
            })
            updateTimeDoctor(doctor, url[1])
        }).catch(() => alert('خطا'))
}

function updateTimeDoctor(doctor, accountName) {
    fetch(`https://university-baabb-default-rtdb.firebaseio.com/doctor/${doctor[0]}.json`, {
        method: 'PUT',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            id: doctor[1].id,
            username: doctor[1].username,
            password: doctor[1].password,
            role: 'دکتر',
            phone: doctor[1].phone,
            expertise: doctor[1].expertise,
            patients: [...doctor[1].patients, `${accountName} , ${doctor[1].freeTime}`],
            freeTime: doctor[1].freeTime,
        })
    }).then(() => {
        updateUser(accountName, doctor)

    }).catch(err => console.log(err))
}

function updateUser(name, doctor) {
    fetch(`https://university-baabb-default-rtdb.firebaseio.com/users.json`).then(res => res.json())
        .then(data => {
            return Object.entries(data)
        }).then((data) => {
        let user = data.find(user => {
            return user[1].username === name
        })
        fetch(`https://university-baabb-default-rtdb.firebaseio.com/users/${user[0]}.json`, {
            method: 'PUT',
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                username: user[1].username,
                password: user[1].password,
                role: 'بیمار',
                phone: user[1].phone,
                queue: [...user[1].queue, `${doctor[1].username} , زمان : ${doctor[1].freeTime}`],
            })
        }).then(() => alert("نوبت شما ثبت شد")).catch(() => alert('نوبت ثبت نشد'))
    })
}

closeAdvertising.addEventListener('click', () => {
    containerAdvertising.style.display = 'none'
})