let containerListDoctor = document.querySelector('.container-list-doctors')

function urlParams() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let accountName = urlParams.get('accountName');
    let role = urlParams.get('role')
    return [urlParams, accountName, role]
}

window.onload = () => {
    let url = urlParams()
    fetch('https://university-baabb-default-rtdb.firebaseio.com/doctor.json').then(res => res.json())
        .then(data => {
            let allDoctor = Object.entries(data)
            let doctor = allDoctor.find((doctor) => {
                return doctor[1].username === url[1]
            })
            console.log(Boolean(doctor[1].patients))
            if (doctor[1].patients) {
                containerListDoctor.innerHTML = ""
                doctor[1].patients.forEach((patients) => {
                    // console.log(patients.split(''))
                    containerListDoctor.insertAdjacentHTML("beforeend", `
                 <div class="box-doctor">
            <div class="profile">
                <img src="image/doctor-3.png" alt="profile">
            </div>
            <div class="info-doctor">
                <h3>بیمار اقا / خانم ${patients.split(',')[0]} , ${patients.split('تا')[1]}</h3>
            </div>
        </div>`)
                })
            } else {
                containerListDoctor.innerHTML = " بیماری ثبت نوبت نکرده است "
            }
        }).catch(()=> alert("خطا در اتصال"))
}

