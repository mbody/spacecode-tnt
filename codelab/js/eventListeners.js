function showCode() {
  // Generate JavaScript code and display it.
  javascript.javascriptGenerator.INFINITE_LOOP_TRAP = null
  var code = javascript.javascriptGenerator.workspaceToCode(demoWorkspace)
  alert(code)
  console.log(code)

  saveCode()
}

const loginModal = document.getElementById('loginModal')
const phoneInput = document.getElementById('phone')
const usernameInput = document.getElementById('username')

function openLoginModal() {
  loginModal.style.display = 'block'
  phoneInput.value = profile.phone || null
  usernameInput.value = profile.username || null
}
function hideLoginModal() {
  loginModal.style.display = 'none'
}
function getRandomColor() {
  const h = 360 * Math.random()
  const s = 100
  let l = 50
  l /= 100
  const a = (s * Math.min(l, 1 - l)) / 100
  const f = (n) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0') // convert to Hex and prefix "0" if needed
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

const colorInput = document.getElementById('color')
const rocketIcon = document.getElementById('rocket')

function changeColor(color) {
  colorInput.value = color
  rocketIcon.style.color = color
  rocketIcon.style.filter = `drop-shadow(${color} 0 0 10px)`
  profile.color = color
  document.getElementById('account-btn-icon').style.color = color
}
color.addEventListener('change', (event) => changeColor(event.target.value))

// HANLDE PROFILE
let profile = {}

if (!restoreProfile()) {
  initProfile()
}

function initProfile() {
  color = getRandomColor()
  profile = {
    color
  }
  changeColor(color)
}

//// RUN BUTTON
const runButton = document.querySelector('#run-btn')
runButton.addEventListener('click', doSendCode)

//// ACCOUNT BUTTON

const accountButton = document.querySelector('#account-btn')
accountButton.addEventListener('click', openLoginModal)

//// VALIDATE ACCOUNT BUTTON
const validateAccountButton = document.querySelector('#validate-account-btn')
validateAccountButton.addEventListener('click', validateAccount)

function validateAccount() {
  profile.username = usernameInput.value
  profile.phone = phoneInput.value
  saveProfile()
  doSendCode()
  hideLoginModal()
}

//// SEND BUTTON

function checkCode(code) {
  const delimiters = ['INIT', 'LOOP', ...Object.keys(EVENTS)]
  const result = delimiters.find((tag) => {
    const regex = new RegExp(`<${tag}>`, 'g')
    const count = (code.match(regex) || []).length
    return count > 1
  })
  return result
    ? 'Erreur : plusieurs blocs identiques ont été ajoutés !'
    : false
}

function doSendCode() {
  if (!profile.username || !profile.phone) {
    openLoginModal()
    return
  }
  saveCode()
  runButton.blur()
  var xhr = new XMLHttpRequest()
  var code = javascript.javascriptGenerator.workspaceToCode(demoWorkspace)
  console.log(code)
  const warningMsg = checkCode(code)
  if (warningMsg) {
    Toaster.error(warningMsg)
    return
  }
  var url = '/player'
  xhr.open('POST', url, true)
  xhr.setRequestHeader('Content-Type', 'application/json')
  xhr.onreadystatechange = function () {
    // todo handle response !!
    /*
    if (xhr.readyState === 4 && xhr.status === 200) {
      var json = JSON.parse(xhr.responseText)
      console.log(json.email + ', ' + json.password)
    }
      */
  }
  var data = {
    username: profile.username,
    phoneNumber: profile.phone,
    color: profile.color,
    code //: '() => { this.moveForward();  this.turnLeft() ; this.shoot() }'
  }
  xhr.onreadystatechange = () => {
    // Call a function when the state changes.
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        // Request finished. Do processing here.
        Toaster.show('Code envoyé avec succès !')
      } else {
        // Request finished. Do processing here.
        Toaster.error(
          xhr.responseText || "Désolé, une erreur s'est produite :'("
        )
      }
    }
  }
  xhr.send(JSON.stringify(data))
  hideLoginModal()
}

/// LOCAL STORAGE

function saveCode() {
  // Serialize the state.
  const state = JSON.stringify(
    Blockly.serialization.workspaces.save(demoWorkspace)
  )

  // Then you save the state, e.g. to local storage.
  localStorage.setItem('workspace-state', state)
  console.log('Le code a été enregistré !')
}

function restoreCode() {
  // Get your saved state from somewhere, e.g. local storage.
  const state = localStorage.getItem('workspace-state')
  if (state == null) {
    return false
  }

  // Deserialize the state.
  Blockly.serialization.workspaces.load(JSON.parse(state), demoWorkspace)
  return true
}

function saveProfile() {
  // Serialize the state.
  const state = JSON.stringify(profile)

  // Then you save the state, e.g. to local storage.
  localStorage.setItem('profile', state)
  console.log('Le profile a été enregistré !')
}
function restoreProfile() {
  // Get your saved state from somewhere, e.g. local storage.
  const state = localStorage.getItem('profile')
  if (state == null) {
    return false
  }
  profile = JSON.parse(state)
  changeColor(profile.color)
  return true
}
