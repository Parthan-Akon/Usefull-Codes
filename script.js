const headers = { 'content-type': 'application/json', }
const dataConessoElement = document.getElementById('data-elements')
const apiUrl = dataConessoElement.getAttribute('data-api')
const uid = dataConessoElement.getAttribute('data-uid')
const redirectUrl = dataConessoElement.getAttribute('data-redirectUrl')
const isListOptional = dataConessoElement.getAttribute('data-isListOptional')
const elements = document.querySelectorAll('form [id^="field"]');
const fieldsCount = elements.length / 2;
const listElements = document.querySelectorAll('form [id^="list"]')
const listCount = listElements.length || 0
const form = document.getElementById('myForm')
let hasError = false
const resetForm = () => {
    let element = document.getElementById('server-error')
    element.innerText = ''
    for (let i = 1; i < fieldsCount; i++) {
        const fieldElement = document.getElementById(`field${i}-error`)
        fieldElement.innerText = ''
    }
    hasError = false
}
const validateDecimal = value => {
    const lastChar = value.substr(value.length - 1);
    if ((lastChar === '.' || lastChar === '-') && (value.match(/\./g) || []).length < 2) {
        return true
    } else {
        const regex = /^-?[0-9]*\.?[0-9]+$/
        if (value === "" || regex.test(value)) {
            return true
        }
    }
    return false
}
for (let i = 1; i <= fieldsCount; i++) {
    const fieldElement = document.getElementById(`field${i}`)
    const required = fieldElement.getAttribute("data-required")
    if (required === 'true') {
        fieldElement.setAttribute('required', true)
    }
}
const showSuccess = () => {
    var formElement = document.getElementById('myForm')
    formElement.classList.add('display-none')
    var successSection = document.getElementById('success-section')
    successSection.classList.remove('display-none')
    setTimeout(() => {
        window.location.href = redirectUrl
    }, 2000)
}
form.addEventListener('input', () => {
    if (hasError) {
        resetForm()
    }
})
const handleSubmit = async (body) => {
    const request = new XMLHttpRequest()
    request.open("POST", `${apiUrl}v2/signup-forms/contact`, true)
    request.setRequestHeader('content-type', 'application/json')
    request.onreadystatechange = () => {
        if (request.readyState == 4) {
            if (request.status === 200) {
                showSuccess()
                return
            } else {
                let element = document.getElementById('server-error')
                const errorObj = JSON.parse(request.responseText)
                element.innerText = errorObj.message[0] || "Oops!, something went wrong. Please try again!"
                hasError = true
            }
        }
    }
    request.send(JSON.stringify(body))   
}
document.addEventListener('submit', e => {
    e.preventDefault()
    const formBody = e.target
    for (let i = 1; i <= fieldsCount; i++) {
        const formValue = formBody[`field${i}`].value
        const fieldElement = document.getElementById(`field${i}`)
        const fieldType = fieldElement.getAttribute("data-type")
        if (fieldType === 'integer') {
            if (formValue) {
                const regex = /^-?[0-9]*$/
                if (!regex.test(formValue)) {
                    document.getElementById(`field${i}-error`).innerText = "Value should be number"
                    hasError = true
                    return
                }
            }
        }
        if (fieldType === 'decimal') {
            if (formValue) {
                if (!validateDecimal(formValue)) {
                    document.getElementById(`field${i}-error`).innerText = "Please enter valid integer or decimal"
                    hasError = true
                    return
                }
            }
        }
    }
    if (!hasError) {
        let body = {}
        let customFields = []
        for (let i = 1; i <= fieldsCount; i++) {
            const fieldElement = document.getElementById(`field${i}`)
            const fieldValue = fieldElement.getAttribute("data-value")
            const fieldType = fieldElement.getAttribute("data-type")
            const formValue = formBody[`field${i}`].value
            if (Number(fieldValue)) {
                if (['true', 'false'].includes(formValue)) {
                    customFields.push({
                        id: Number(fieldValue),
                        value: formValue === 'true'
                    })
                } else if (['integer', 'decimal'].includes(fieldType)) {
                    customFields.push({
                        id: Number(fieldValue),
                        value: Number(formValue)
                    })
                } else {
                    customFields.push({
                        id: Number(fieldValue),
                        value: formValue
                    })
                }
            } else {
                body[fieldValue] = formValue
            }
        }
        body.uid = uid
        body.recaptchaResponse = ''
        body.userDetails = formBody['userDetails'].value
        body.lists = []
        if (listCount > 0) {
            for (let i = 0; i < listCount; i++) {
                const listElement = document.getElementById(`list${i}`)
                const listValue = listElement.getAttribute("data-value")
                const formValue = formBody[`list${i}`].checked
                if (!isListOptional) {
                    body.lists.push(Number(listValue))
                } else {
                    if (formValue) {
                        body.lists.push(Number(listValue))
                    }
                }
            }
        }
        body.customFields = customFields
        if (!formBody['userDetails'].value) {
            handleSubmit(body)
        }
    }
})
