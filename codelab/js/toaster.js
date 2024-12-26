// Get the snackbar DIV
const snack = document.getElementById('snackbar')
const TOAST_DELAY = 3000

class Toaster {
  static warning(msg, bgColor = 'orange') {
    Toaster.show(msg, bgColor)
  }

  static error(msg, bgColor = '#f22828') {
    Toaster.show(msg, bgColor)
  }

  static show(msg, bgColor = '#6AA710') {
    snack.className = 'show'
    snack.style.backgroundColor = bgColor
    snack.innerHTML = msg
    setTimeout(Toaster.hide, TOAST_DELAY)
  }

  static hide = () => {
    snack.className = snack.className.replace('show', '')
  }
}
