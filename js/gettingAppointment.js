let containerListDoctor = document.querySelector('.container-list-doctors')

function urlParams() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let accountName = urlParams.get('accountName');
    let role = urlParams.get('role')
    return [urlParams, accountName, role]
}

let listDoctorSearch = []
const inputS = document.querySelector('#input-s')
inputS.addEventListener('input', () => {
        let resultSearch = listDoctorSearch.filter((doctor) => {
            return doctor[1].username.includes(inputS.value);
        });
        console.log(resultSearch)
        if (resultSearch) {
            containerListDoctor.innerHTML = ''
            resultSearch.forEach((doctor) => {
                templateHtmlBoxDoctor(doctor)
            })
        }
        if (resultSearch.length === 0){
            containerListDoctor.innerHTML = `<h1 style="margin-top: 50px">دکتر با این عنوان پیدا نشد</h1> `
        }
    }
)

function listDoctor() {
    fetch(`https://university-baabb-default-rtdb.firebaseio.com/doctor.json`)
        .then(res => res.json())
        .then(data => {
            if (data) {
                containerListDoctor.innerHTML = ''
                let allDoctor = Object.entries(data)
                allDoctor.forEach((doctor) => {
                    listDoctorSearch.push(doctor)
                    templateHtmlBoxDoctor(doctor)
                })
            } else {
                alert('دکتری ثبت نام نکرده است')
            }
        })
        .catch(() => alert('خطا در اتصال'))
}

function templateHtmlBoxDoctor(doctor) {
    containerListDoctor.insertAdjacentHTML('beforeend', `
                        <div class="box-doctor">
            <div class="profile">
                <img src="../image/doctor-3.png" alt="profile">
            </div>
            <div class="info-doctor">
                <h3>دکتر ${doctor[1].username} </h3>
                <span>تایم ویزیت :</span><span>${doctor[1].freeTime}</span>
            </div>
            <button onclick="setTimeDoctor(${doctor[1].id})" >
            دریافت نوبت
</button>
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

const btnQueue = document.querySelector('#btn-queue')
const showQueue = document.querySelector('#show-queue')
const contentShowQueue = document.querySelector('.content')
const btnCloseQueue = document.querySelector('.close-page button')
btnCloseQueue.addEventListener('click', () => showQueue.style.display = 'none')
btnQueue.addEventListener('click', () => {
    contentShowQueue.innerHTML = ''
    let url = urlParams()
    showQueue.style.display = 'flex'
    fetch(`https://university-baabb-default-rtdb.firebaseio.com/users.json`).then(res => res.json())
        .then(data => {
            return Object.entries(data)
        }).then((data) => {
        let user = data.find(user => {
            return user[1].username === url[1]
        })
        user[1].queue.forEach((data) => {
            let timeDoctor = data.split('زمان :')
            let timeP = timeDoctor[1].split('تا')
            contentShowQueue.insertAdjacentHTML('beforeend', `<div class="box-doctor-patient">
                <h3>دکتر ${data}</h3>
                <p>زمان شما : ${timeP[1]}</p>
                <span>متاسفانه امکان لغو نوبت در سایت وجود ندارد از طریق تماس اقدام کنید</span>
            </div>
        </div>`)
        })

    }).catch(() => alert('خطا'))
})
window.addEventListener('load', listDoctor)

