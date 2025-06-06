document.addEventListener('DOMContentLoaded', () => {
  const dashboardGrid = document.getElementById('dashboardGrid');

  const widgets = [
    { title: 'Receitas', content: 'R$ 25.000', bg: '#e0f2fe' },
    { title: 'Despesas', content: 'R$ 18.500', bg: '#fef3c7' },
    { title: 'Lucro Líquido', content: 'R$ 6.500', bg: '#d1fae5' },
    { title: 'Clientes Ativos', content: '120', bg: '#ede9fe' }
  ];

  widgets.forEach(widget => {
    const section = document.createElement('section');
    section.className = 'chart-widget';
    section.setAttribute('draggable', 'true');

    section.innerHTML = `
      <div class="chart-widget-header">
        <h2 class="chart-widget-title">${widget.title}</h2>
      </div>
      <div class="chart-content" style="background:${widget.bg};">
        <p class="chart-value">${widget.content}</p>
      </div>
    `;

    dashboardGrid.appendChild(section);
  });

  // Drag & Drop (básico)
  let dragged;
  document.querySelectorAll('.chart-widget').forEach(widget => {
    widget.addEventListener('dragstart', (e) => {
      dragged = widget;
      widget.style.opacity = 0.5;
    });
    widget.addEventListener('dragover', (e) => e.preventDefault());
    widget.addEventListener('drop', (e) => {
      e.preventDefault();
      if (dragged !== widget) {
        widget.parentNode.insertBefore(dragged, widget);
      }
    });
    widget.addEventListener('dragend', () => dragged.style.opacity = 1);
  });

  // Chat flutuante
  const chatToggle = document.getElementById('chatToggle');
  const chatPopup = document.getElementById('chatWidgetContainer');
  const chatClose = document.getElementById('chatCloseBtn');

  chatToggle.addEventListener('click', () => {
    chatPopup.style.display = 'block';
    dashboardGrid.classList.add('chat-open');
  });
  chatClose.addEventListener('click', () => {
    chatPopup.style.display = 'none';
    dashboardGrid.classList.remove('chat-open');
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth < 769) dashboardGrid.classList.remove('chat-open');
  });
});
