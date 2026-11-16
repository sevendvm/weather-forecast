const showAdditionalParameters = document.getElementById('showAdditionalParameters')
const btn = document.getElementById('toggleWidget')
const widget = document.querySelector('.weatherWidget')

showAdditionalParameters.addEventListener('click', toggleDetails)
btn.addEventListener('click', () => {
    showAdditionalParameters.checked = !showAdditionalParameters.checked
    toggleDetails()
})

function toggleDetails() {
    widget.classList.toggle('collapsed', !showAdditionalParameters.checked)
}
