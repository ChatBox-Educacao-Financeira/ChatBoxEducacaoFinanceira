const ConteudoAcoes = {
  obterPerfilMensal: function () {
    return {
      tituloUsuario: "Ver perfil mensal",
      textoBot: "Aqui está seu perfil financeiro mensal com dados detalhados:",
      graficoHTML: `
                        <div class="chart-widget">
                            <div class="chart-header">
                                <div class="chart-title">Perfil Financeiro Mensal</div>
                                <div class="chart-period">Jan - Dez 2024</div>
                            </div>
                            <div class="bar-chart">
                                <div class="bar" style="height: 60%;"><div class="bar-label">Jan</div></div>
                                <div class="bar" style="height: 75%;"><div class="bar-label">Fev</div></div>
                                <div class="bar" style="height: 45%;"><div class="bar-label">Mar</div></div>
                                <div class="bar" style="height: 90%;"><div class="bar-label">Abr</div></div>
                                <div class="bar" style="height: 70%;"><div class="bar-label">Mai</div></div>
                                <div class="bar" style="height: 85%;"><div class="bar-label">Jun</div></div>
                                <div class="bar" style="height: 95%;"><div class="bar-label">Jul</div></div>
                                <div class="bar" style="height: 80%;"><div class="bar-label">Ago</div></div>
                            </div>
                            <div class="metrics-grid">
                                <div class="metric-item">
                                    <div class="metric-value">R$ 89.5K</div>
                                    <div class="metric-label">Receita Média</div>
                                </div>
                                <div class="metric-item">
                                    <div class="metric-value" style="color: var(--primary-gold);">+12.3%</div>
                                    <div class="metric-label">Crescimento</div>
                                </div>
                            </div>
                        </div>
                    `
    }
  },

  obterDemonstracaoResultados: function () {
    return {
      tituloUsuario: "Explicar demonstração de resultados",
      textoBot: "A demonstração de resultados mostra a performance financeira da empresa:",
      graficoHTML: `
                        <div class="chart-widget">
                            <div class="chart-header">
                                <div class="chart-title">Demonstração de Resultados</div>
                                <div class="chart-period">2024</div>
                            </div>
                            <div class="donut-chart">
                                <div class="donut-segment segment-1"></div>
                                <div class="donut-segment segment-2"></div>
                                <div class="donut-segment segment-3"></div>
                                <div class="donut-center">R$ 125K</div>
                            </div>
                            <div class="metrics-grid">
                                <div class="metric-item">
                                    <div class="metric-value">R$ 450K</div>
                                    <div class="metric-label">Receita Total</div>
                                </div>
                                <div class="metric-item">
                                    <div class="metric-value">R$ 325K</div>
                                    <div class="metric-label">Custos</div>
                                </div>
                                <div class="metric-item">
                                    <div class="metric-value" style="color: var(--primary-blue);">R$ 125K</div>
                                    <div class="metric-label">Lucro Líquido</div>
                                </div>
                                <div class="metric-item">
                                    <div class="metric-value" style="color: var(--primary-gold);">27.8%</div>
                                    <div class="metric-label">Margem</div>
                                </div>
                            </div>
                        </div>
                    `
    }
  },

  obterConsultoriaFluxoCaixa: function () {
    const azul = getComputedStyle(document.documentElement).getPropertyValue("--primary-blue").trim() || "#1e40af"
    const dourado = getComputedStyle(document.documentElement).getPropertyValue("--primary-gold").trim() || "#fbbf24"
    return {
      tituloUsuario: "Consultoria de fluxo de caixa",
      textoBot: "Análise do fluxo de caixa com recomendações estratégicas:",
      graficoHTML: `
                        <div class="chart-widget">
                            <div class="chart-header">
                                <div class="chart-title">Análise de Fluxo de Caixa</div>
                                <div class="chart-period">Últimos 6 meses</div>
                            </div>
                            <div class="line-chart">
                                <svg class="line-path" viewBox="0 0 280 100">
                                    <path d="M20,70 Q70,50 120,45 T220,40 Q250,35 270,30"
                                          stroke="${azul}" stroke-width="3" fill="none"/>
                                    <circle cx="20" cy="70" r="4" fill="${azul}"/>
                                    <circle cx="120" cy="45" r="4" fill="${azul}"/>
                                    <circle cx="220" cy="40" r="4" fill="${azul}"/>
                                    <circle cx="270" cy="30" r="4" fill="${dourado}"/>
                                </svg>
                            </div>
                            <div class="metrics-grid">
                                <div class="metric-item">
                                    <div class="metric-value">R$ 95K</div>
                                    <div class="metric-label">Saldo Atual</div>
                                </div>
                                <div class="metric-item">
                                    <div class="metric-value" style="color: var(--primary-gold);">+8.2%</div>
                                    <div class="metric-label">Crescimento</div>
                                </div>
                                <div class="metric-item">
                                    <div class="metric-value">45 dias</div>
                                    <div class="metric-label">Prazo Médio</div>
                                </div>
                                <div class="metric-item">
                                    <div class="metric-value" style="color: var(--primary-blue);">Positivo</div>
                                    <div class="metric-label">Tendência</div>
                                </div>
                            </div>
                        </div>
                    `
    }
  }
}
class GeminiChat {
  constructor() {
    this.chatMessages = document.getElementById("chatMessages")
    this.chatInput = document.getElementById("chatInput")
    this.sendButton = document.getElementById("sendButton")
    this.humanButton = document.getElementById("humanButton")
    this.loading = document.getElementById("loading")
    this.chatHeader = document.querySelector(".chat-header")

    this.apiKey = "AIzaSyCZxcOr7d5sXq1ruBk8zYW3go71fwsOTL4"

    this.initEventListeners()
    this.isFirstInteraction = true
    this.startHeaderTimer()
  }

  startHeaderTimer() {
    setTimeout(() => {
      this.hideHeader()
    }, 10000)
  }

  hideHeader() {
    if (this.chatHeader && !this.chatHeader.classList.contains("hidden")) {
      this.chatHeader.classList.add("hidden")
    }
  }

  initEventListeners() {
    this.sendButton.addEventListener("click", () => this.sendMessage())
    this.humanButton.addEventListener("click", () => this.contactHuman())

    this.chatInput.addEventListener("keypress", e => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        this.sendMessage()
      }
    })
  }

  clearInitialContent() {
    if (this.isFirstInteraction) {
      const initialSampleContent = [
        ...this.chatMessages.querySelectorAll(".message-group:not(.user-initiated)"),
        this.chatMessages.querySelector(".financial-dashboard")
      ]

      let clearedSomething = false
      initialSampleContent.forEach(element => {
        if (element && element.parentNode === this.chatMessages) {
          this.chatMessages.removeChild(element)
          clearedSomething = true
        }
      })

      const initialActionGrid = this.chatMessages.querySelector(".action-grid")
      if (initialActionGrid && clearedSomething) {
        initialActionGrid.remove()
      }

      if (clearedSomething) {
        this.isFirstInteraction = false
      }
    }
  }

  addMessage(content, isUser = false) {
    const messageGroup = document.createElement("div")
    messageGroup.className = "message-group"
    if (isUser) messageGroup.classList.add("user-initiated")

    const messageDiv = document.createElement("div")
    messageDiv.className = `message ${isUser ? "user" : "bot"}`

    const avatarDiv = document.createElement("div")
    avatarDiv.className = "message-avatar"
    avatarDiv.innerHTML = isUser ? "👤" : "IA"

    const bubbleDiv = document.createElement("div")
    bubbleDiv.className = "message-bubble"

    if (isUser) {
      bubbleDiv.textContent = content
    } else {
      bubbleDiv.innerHTML = this.formatResponse(content)
    }

    messageDiv.appendChild(avatarDiv)
    messageDiv.appendChild(bubbleDiv)
    messageGroup.appendChild(messageDiv)

    this.chatMessages.appendChild(messageGroup)

    if (
      !isUser &&
      content !== "Solicitação enviada para contador humano. Você receberá retorno em breve via email ou telefone."
    ) {
      this.addActionButtons()
    }

    this.scrollToBottom()
  }

  addActionButtons() {
    const existingActions = this.chatMessages.querySelector(".action-grid")
    if (existingActions) {
      existingActions.remove()
    }

    const actionGrid = document.createElement("div")
    actionGrid.className = "action-grid"
    actionGrid.innerHTML = `
                    <div class="action-item" onclick="window.chatInstance.showMonthlyProfile()">
                        <div class="action-item-title">Ver perfil mensal</div>
                    </div>
                    <div class="action-item" onclick="window.chatInstance.showIncomeStatement()">
                        <div class="action-item-title">Explicar DRE</div>
                    </div>
                    <div class="action-item" onclick="window.chatInstance.showCashFlowAdvice()">
                        <div class="action-item-title">Consultoria de caixa</div>
                    </div>
                `
    this.chatMessages.appendChild(actionGrid)
  }

  formatResponse(text) {
    let formatted = text.replace(/\n/g, "<br>")
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    formatted = formatted.replace(/(?<![\w*])\*(?!\s|\*)([^*]+?)(?<!\s|\*)\*(?![\w*])/g, "<strong>$1</strong>")
    formatted = formatted.replace(/^(?:\s*<br>\s*)*\*\s(.*?)(?=\s*<br>\s*|$)/gm, (match, content) => {
      let prefix = match.startsWith("<br>") ? "<br>" : ""
      if (!match.match(/^\s*<br>\s*•/)) {
        return `${prefix}• ${content.trim()}`
      }
      return match
    })
    formatted = formatted.replace(/^(\s*<br>\s*)+/, "")
    formatted = formatted.replace(/(<br>\s*•\s.*?)(<br>\s*)+(\s*•\s|$)/g, "$1<br>$3")
    formatted = formatted.replace(/(<br>\s*){2,}/g, "<br>")
    return formatted
  }

  scrollToBottom() {
    setTimeout(() => {
      this.chatMessages.scrollTop = this.chatMessages.scrollHeight
    }, 100)
  }

  setLoading(loading) {
    this.loading.style.display = loading ? "block" : "none"
    this.sendButton.disabled = loading
    this.chatInput.disabled = loading
    this.chatInput.style.opacity = loading ? "0.6" : "1"
  }

  async callGeminiAPI(userMessage) {
    const generationConfig = {
      temperature: 0.7,
      topP: 0.8,
      topK: 40,
      maxOutputTokens: 2048,
      responseMimeType: "text/plain"
    }

    const data = {
      generationConfig,
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `CONTEXTO PROFISSIONAL:
Você é um assistente de IA especializado em finanças empresariais. Suas respostas devem ser:
- Técnicas e precisas, mas acessíveis
- Concisas e diretas (máximo 2-3 parágrafos)
- Focadas em aspectos práticos e acionáveis
- Baseadas em melhores práticas financeiras

FORMATAÇÃO:
- Use **texto** ou *texto* para destaques importantes.
- Use listas com marcadores (*) quando apropriado para itens de ação ou enumerações.
- Evite listas numeradas longas.
- Mantenha tom profissional mas amigável.
- Responda em português brasileiro.

PERGUNTA: ${userMessage}`
            }
          ]
        }
      ]
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${this.apiKey}`

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const errorBody = await response.text()
        console.error(`HTTP error! status: ${response.status}`, errorBody)
        throw new Error(`HTTP error! status: ${response.status}. Detalhes: ${errorBody}`)
      }

      const result = await response.json()
      if (
        result.candidates &&
        result.candidates.length > 0 &&
        result.candidates[0].content &&
        result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0
      ) {
        return result.candidates[0].content.parts[0].text
      } else if (result.promptFeedback && result.promptFeedback.blockReason) {
        console.error("API call blocked:", result.promptFeedback.blockReason, result.promptFeedback.safetyRatings)
        throw new Error(`Solicitação bloqueada pela API devido a: ${result.promptFeedback.blockReason}`)
      } else {
        console.error("Resposta da API em formato inesperado:", result)
        throw new Error("Resposta da API em formato inesperado.")
      }
    } catch (error) {
      console.error("Falha ao chamar a API Gemini:", error)
      return "Desculpe, não consegui processar sua solicitação no momento. Verifique se a API key está correta e válida."
    }
  }

  async sendMessage() {
    const message = this.chatInput.value.trim()
    if (!message) return

    this.clearInitialContent()
    this.addMessage(message, true)
    this.chatInput.value = ""
    this.setLoading(true)

    const existingActions = this.chatMessages.querySelector(".action-grid")
    if (existingActions) {
      existingActions.remove()
    }

    try {
      const response = await this.callGeminiAPI(message)
      this.addMessage(response)
    } catch (error) {
      console.error("Error in sendMessage flow:", error)
      this.addMessage(
        "Ocorreu um erro ao tentar obter a resposta. Por favor, tente novamente ou verifique se a API key está configurada corretamente."
      )
    } finally {
      this.setLoading(false)
    }
  }

  contactHuman() {
    this.clearInitialContent()
    this.addMessage(
      "Solicitação enviada para contador humano. Você receberá retorno em breve via email ou telefone.",
      false
    )

    const existingActions = this.chatMessages.querySelector(".action-grid")
    if (existingActions) {
      existingActions.remove()
    }
    console.log("Contador humano solicitado")
  }

  showMonthlyProfile() {
    this.clearInitialContent()
    const conteudo = ConteudoAcoes.obterPerfilMensal()
    this.addMessage(conteudo.tituloUsuario, true)
    this.addChartMessage(conteudo.textoBot, conteudo.graficoHTML)
  }

  showIncomeStatement() {
    this.clearInitialContent()
    const conteudo = ConteudoAcoes.obterDemonstracaoResultados()
    this.addMessage(conteudo.tituloUsuario, true)
    this.addChartMessage(conteudo.textoBot, conteudo.graficoHTML)
  }

  showCashFlowAdvice() {
    this.clearInitialContent()
    const conteudo = ConteudoAcoes.obterConsultoriaFluxoCaixa()
    this.addMessage(conteudo.tituloUsuario, true)
    this.addChartMessage(conteudo.textoBot, conteudo.graficoHTML)
  }

  addChartMessage(text, chartHTML) {
    const messageGroup = document.createElement("div")
    messageGroup.className = "message-group"

    const messageDiv = document.createElement("div")
    messageDiv.className = "message bot"

    const avatarDiv = document.createElement("div")
    avatarDiv.className = "message-avatar"
    avatarDiv.innerHTML = "IA"

    const bubbleDiv = document.createElement("div")
    bubbleDiv.className = "message-bubble"
    bubbleDiv.innerHTML = this.formatResponse(text)

    messageDiv.appendChild(avatarDiv)
    messageDiv.appendChild(bubbleDiv)
    messageGroup.appendChild(messageDiv)
    this.chatMessages.appendChild(messageGroup)

    if (chartHTML) {
      const chartDiv = document.createElement("div")
      chartDiv.innerHTML = chartHTML
      this.chatMessages.appendChild(chartDiv)
    }

    this.addActionButtons()
    this.scrollToBottom()
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (typeof ConteudoAcoes !== "undefined") {
    window.chatInstance = new GeminiChat()
  } else {
    console.error("Objeto ConteudoAcoes não está definido. Verifique a ordem dos scripts.")
    const chatMessagesDiv = document.getElementById("chatMessages")
    if (chatMessagesDiv) {
      chatMessagesDiv.innerHTML =
        "<p style='color:red; text-align:center; padding:20px;'>Erro crítico na inicialização do chat.</p>"
    }
  }
})
document.addEventListener("DOMContentLoaded", async function () {
  try {
    const response = await fetch("src/routes/api/perfil_get.php")
    const result = await response.json()

    if (!result.sucesso || !result.usuario.avatar) return

    const avatarUrl = "/" + result.usuario.avatar

    // Substitui o ícone no topo
    const iconLinks = document.querySelectorAll(".user-icon")
    iconLinks.forEach(icon => {
      const img = document.createElement("img")
      img.src = avatarUrl
      img.alt = "Avatar"
      img.style.width = "32px"
      img.style.height = "32px"
      img.style.borderRadius = "50%"
      img.style.objectFit = "cover"
      icon.innerHTML = ""
      icon.appendChild(img)
    })

    // Substitui o avatar das mensagens do usuário (👤)
    const avatarDivs = document.querySelectorAll(".message.user .message-avatar")
    avatarDivs.forEach(el => {
      const img = document.createElement("img")
      img.src = avatarUrl
      img.alt = "Avatar do usuário"
      img.style.width = "28px"
      img.style.height = "28px"
      img.style.borderRadius = "50%"
      img.style.objectFit = "cover"
      el.innerHTML = ""
      el.appendChild(img)
    })
  } catch (error) {
    console.error("Erro ao carregar avatar do usuário:", error)
  }
})
