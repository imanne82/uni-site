const formLoginBtnCh = document.querySelector('#changForm-login')
const formRegisterBtnCh = document.querySelector('#changForm-register')
const formRegister = document.querySelector('#form-register')
const formLogin = document.querySelector('#form-login')
const registerUsername = document.querySelector('#reg-Username')
const registerPhoneNumber = document.querySelector('#reg-PhoneNumber')
const registerExpertise = document.querySelector('#reg-expertise')
const getPassword = document.querySelector('#reg-Password')
const btnRegister = document.querySelector('#btnRegister')
const btnLogin = document.querySelector('#btnLogin')
const modal = document.querySelector('#modal')
const loginPhone = document.querySelector('#login-phone')
const loginPassword = document.querySelector('#login-password')
const passwordTow = document.querySelector('#password-tow')
const freeTime = document.querySelector('#free-time')

function createUser() {
    fetch('https://university-baabb-default-rtdb.firebaseio.com/doctor.json').then(res => res.json())
        .then(data => {
            let user = {
                id: data === null ? 1 : Object.entries(data).length + 1,
                username: registerUsername.value,
                password: getPassword.value,
                passwordTow: passwordTow.value,
                role: 'دکتر',
                phone: registerPhoneNumber.value,
                expertise: registerExpertise.value,
                patients: '',
                freeTime: freeTime.value,
            }
            if (!user.username) {
                alert('نام کابری نباید خالی باشد')
            } else if (!user.password || user.password.length > 8) {
                alert('رمز عبور نباید خالی یا بیش از 8 رقم باشد')
            } else if (!user.phone || user.phone.length > 11) {
                alert('شماره همراه نباید خالی یا بیش از 11 رقم باشد')
            } else if (!user.passwordTow || user.passwordTow.length > 8) {
                alert('تکرار رمز عبور نباید خالی یا بیش از 8 رقم باشد')
            } else if (user.password !== user.passwordTow) {
                alert("رمز اول با رمز دوم مشابه  نیست")
            } else if (!user.expertise) {
                alert('تخصص شما نباید خالی باشد : از الگوی مثال پیروی کنید')
            } else {
                postInfoUser(user)
            }

        }).catch(() => alert('ثبت نام شما انجام نشد')
    )

}

function postInfoUser(newUser) {
    fetch('https://university-baabb-default-rtdb.firebaseio.com/doctor.json', {
        method: 'POST',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(newUser)
    })
        .then(() => {
            modal.style.display = 'block'
            location.href = `index.html?accountName=${newUser.username}&role=${newUser.role}`;
        })
        .catch(err => {
            modal.style.display = 'block'
            modal.style.background = 'darkred'
            modal.innerHTML = 'خطا مجدد امتحان کنید'
            console.log(err)
        })
}

/*      form login           */
btnLogin.addEventListener('click', (e) => {
    e.preventDefault()
    if (!loginPhone.value) {
        alert(' شماره همراه نباید خالی باشد')
    } else if (!loginPassword.value) {
        alert('رمز عبور  نباید خالی یا بیش از 8 رقم باشد')
    } else {
        fetch('https://university-baabb-default-rtdb.firebaseio.com/doctor.json').then(res => res.json())
            .then(data => {
                let users = Object.entries(data)
                let user = users.find(user => {
                    console.log(user[1].phone === loginPhone.value && user[1].password === loginPassword.value)
                    return user[1].phone === loginPhone.value && user[1].password === loginPassword.value
                })
                location.href = `index.html?accountName=${user[1].username}&role=${user[1].role}`;
            }).catch(() => alert('لطفا از صحت اطلاعات مطمئن شوید'))
    }
})

btnRegister.addEventListener('click', createUser)
/*        change form type              */
formLoginBtnCh.addEventListener('click', () => {
    formRegister.style.display = 'none'
    formLogin.style.display = 'flex'

})
formRegisterBtnCh.addEventListener('click', () => {
    formRegister.style.display = 'flex'
    formLogin.style.display = 'none'
})