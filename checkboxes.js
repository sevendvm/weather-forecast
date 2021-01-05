const showAdditionalParameters = document.getElementById('showAdditionalParameters')
const btn = document.getElementById('toggleWidget')

showAdditionalParameters.addEventListener('click', updateWidget)
btn.addEventListener('click', updateWidgetByBtn)

function updateWidget() {

    const bottom = document.querySelector('.bottom')
    bottom.classList.toggle('hidden', !showAdditionalParameters.checked)

    const topRight = document.querySelector('.topRight')
    topRight.classList.toggle('hidden', !showAdditionalParameters.checked)

    const mainParameters = document.querySelector('.mainParameters')
    mainParameters.style.width = showAdditionalParameters.checked ? '50%' : '100%'

    // btn.innerHTML = showAdditionalParameters.checked ? 'Л' : 'V'
    btn.style.transform = showAdditionalParameters.checked ? "translate(0,25px) rotate(-90deg)" : "translate(0,25px) rotate(90deg)"

}

function updateWidgetByBtn() {
    showAdditionalParameters.checked = !showAdditionalParameters.checked
    updateWidget()
}
