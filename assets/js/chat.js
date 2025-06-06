document.addEventListener('DOMContentLoaded', () => {
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const chatMessages = document.getElementById('chatMessages');
  const humanBtn = document.getElementById('humanBtn');

  const usuario = JSON.parse(localStorage.getItem('usuario'));
  if (!usuario) return window.location.href = 'index.html';

  const renderMessage = (msg, sender = 'user') => {
    const msgGroup = document.createElement('div');
    msgGroup.className = `message-group message ${sender}`;

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = sender === 'user' ? usuario.nome_completo[0].toUpperCase() : 'F';

    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.textContent = msg;

    msgGroup.appendChild(avatar);
    msgGroup.appendChild(bubble);
    chatMessages.appendChild(msgGroup);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  const sendMessage = async (message) => {
    renderMessage(message, 'user');
    chatInput.value = '';
    chatInput.focus();

    // Simulando resposta do assistente (substituir por integração real)
    setTimeout(() => {
      renderMessage(`Você disse: "${message}". Isso será processado.`, 'bot');
    }, 800);
  };

  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = chatInput.value.trim();
    if (message) sendMessage(message);
  });

  humanBtn.addEventListener('click', () => {
    renderMessage("Quero falar com um humano", 'user');
    renderMessage("Um atendente será chamado. Aguarde um momento...", 'bot');
  });
});
