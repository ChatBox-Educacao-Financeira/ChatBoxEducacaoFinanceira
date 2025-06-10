// ––––––– Inicialização dos widgets (estado dos checkboxes) –––––––
const chkDRE = document.getElementById("chk-dre")
const chkFluxo = document.getElementById("chk-fluxo")
const chkVendas = document.getElementById("chk-vendas")
const chkDespesas = document.getElementById("chk-despesas")
const chkReceitasDespesas = document.getElementById("chk-receitas-despesas")
const chkKPIClientes = document.getElementById("chk-kpi-clientes")

const sectionDRE = document.getElementById("dre-widget")
const sectionFluxo = document.getElementById("fluxo-widget")
const sectionVendas = document.getElementById("vendas-widget")
const sectionDespesas = document.getElementById("despesas-widget")
const sectionReceitasDespesas = document.getElementById("receitas-despesas-widget")
const sectionKPIClientes = document.getElementById("kpi-clientes-widget")

const dashboardGrid = document.getElementById("dashboardGrid")

window.addEventListener("DOMContentLoaded", () => {
  sectionDRE.style.display = chkDRE.checked ? "flex" : "none"
  sectionFluxo.style.display = chkFluxo.checked ? "flex" : "none"
  sectionVendas.style.display = chkVendas.checked ? "flex" : "none"
  sectionDespesas.style.display = chkDespesas.checked ? "flex" : "none"
  sectionReceitasDespesas.style.display = chkReceitasDespesas.checked ? "flex" : "none"
  sectionKPIClientes.style.display = chkKPIClientes.checked ? "flex" : "none"
})

// ––––––– Modal de Configuração –––––––
const configToggle = document.getElementById("configToggle")
const configOverlay = document.getElementById("configOverlay")
const configPanel = document.getElementById("configPanel")
const configCloseBtn = document.getElementById("configCloseBtn")

configToggle.addEventListener("click", () => {
  configOverlay.style.display = "block"
  configPanel.style.display = "block"
})
configOverlay.addEventListener("click", () => {
  configOverlay.style.display = "none"
  configPanel.style.display = "none"
})
configCloseBtn.addEventListener("click", () => {
  sectionDRE.style.display = chkDRE.checked ? "flex" : "none"
  sectionFluxo.style.display = chkFluxo.checked ? "flex" : "none"
  sectionVendas.style.display = chkVendas.checked ? "flex" : "none"
  sectionDespesas.style.display = chkDespesas.checked ? "flex" : "none"
  sectionReceitasDespesas.style.display = chkReceitasDespesas.checked ? "flex" : "none"
  sectionKPIClientes.style.display = chkKPIClientes.checked ? "flex" : "none"

  configOverlay.style.display = "none"
  configPanel.style.display = "none"
})

// ––––––– Chat Flutuante –––––––
const chatToggle = document.getElementById("chatToggle")
const chatContainer = document.getElementById("chatWidgetContainer")
const chatCloseBtn = document.getElementById("chatCloseBtn")

chatToggle.addEventListener("click", () => {
  chatContainer.style.display = "block"
  if (window.innerWidth >= 769) {
    dashboardGrid.classList.add("chat-open")
  }
})
chatCloseBtn.addEventListener("click", () => {
  chatContainer.style.display = "none"
  dashboardGrid.classList.remove("chat-open")
})
chatContainer.addEventListener("click", e => {
  if (e.target === chatContainer) {
    chatContainer.style.display = "none"
    dashboardGrid.classList.remove("chat-open")
  }
})

// ––––––– Drag & Drop dos Widgets –––––––
let draggedElement = null
function handleDragStart(e) {
  draggedElement = this
  e.dataTransfer.effectAllowed = "move"
  this.style.opacity = "0.5"
}
function handleDragOver(e) {
  if (e.preventDefault) e.preventDefault()
  return false
}
function handleDrop(e) {
  if (e.stopPropagation) e.stopPropagation()
  if (draggedElement !== this) {
    const parent = this.parentNode
    parent.insertBefore(draggedElement, this)
  }
  return false
}
function handleDragEnd() {
  this.style.opacity = "1"
}
function addDragAndDropHandlers(widget) {
  widget.addEventListener("dragstart", handleDragStart, false)
  widget.addEventListener("dragover", handleDragOver, false)
  widget.addEventListener("drop", handleDrop, false)
  widget.addEventListener("dragend", handleDragEnd, false)
}
function initializeDragAndDrop() {
  const widgets = document.querySelectorAll(".chart-widget")
  widgets.forEach(widget => {
    addDragAndDropHandlers(widget)
  })
}
window.addEventListener("DOMContentLoaded", initializeDragAndDrop)

// Se o usuário redimensionar a janela para menos que 769px, remove a classe “chat-open”
window.addEventListener("resize", () => {
  if (window.innerWidth < 769) {
    dashboardGrid.classList.remove("chat-open")
  }
})

document.addEventListener("DOMContentLoaded", async function () {
  try {
    const response = await fetch("src/routes/api/perfil_get.php")
    const result = await response.json()

    if (result.sucesso && result.usuario.avatar) {
      const avatarUrl = "/" + result.usuario.avatar
      const profileLink = document.querySelector(".profile-link")

      if (profileLink) {
        const img = document.createElement("img")
        img.src = avatarUrl
        img.alt = "Avatar"
        img.style.width = "24px"
        img.style.height = "24px"
        img.style.borderRadius = "50%"
        img.style.objectFit = "cover"
        profileLink.innerHTML = ""
        profileLink.appendChild(img)
      }
    }
  } catch (error) {
    console.error("Erro ao carregar avatar:", error)
  }
})
