document.addEventListener('DOMContentLoaded', () => {
  
  // === ОБЪЯВЛЯЕМ ПЕРЕМЕННЫЕ ОДИН РАЗ В НАЧАЛЕ ===
  const formBlock = document.querySelector('.form-block');
  const telegramFloat = document.querySelector('.telegram-float');
  const heroSection = document.querySelector('.hero');
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const menuClose = document.querySelector('.menu-close');
  
// === Форма — отправка через Formspree ===
const contactForm = document.getElementById('contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Останавливаем стандартную отправку
    
    const submitBtn = document.getElementById('submit-btn');
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    
    const name = nameInput?.value.trim() || '';
    const phone = phoneInput?.value.trim() || '';
    
    // === Проверки ===
    if (!name) { alert('Пожалуйста, введите ваше имя.'); return; }
    if (!phone) { alert('Пожалуйста, введите ваш номер телефона.'); return; }
    
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      alert('Пожалуйста, введите корректный номер телефона (например: +79516696369).');
      return;
    }
    
    // === Блокируем кнопку ===
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправка...';
    
    try {
      // === Отправка на Formspree ===
      const response = await fetch(contactForm.action, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ name, phone })
      });
      
      if (response.ok) {
        // === Успех ===
        nameInput.value = '';
        phoneInput.value = '';
        alert(`Спасибо, ${name}! Мы скоро вам перезвоним.`);
      } else {
        // === Ошибка сервера ===
        const errorData = await response.json();
        alert(`Ошибка: ${errorData.error || 'Попробуйте позже.'}`);
      }
    } catch (error) {
      // === Ошибка сети ===
      console.error('Formspree Error:', error);
      alert('Ошибка подключения. Проверьте интернет и попробуйте позже.');
    } finally {
      // === Возвращаем кнопку ===
      submitBtn.disabled = false;
      submitBtn.textContent = 'Заказать звонок';
    }
  });
}
  
  // === Слайдер ===
  const slides = document.querySelectorAll('.slide');
  const caseTitle = document.getElementById('case-title');
  const caseText = document.getElementById('case-text');
  const sliderContainer = document.querySelector('.slider-container');
  const dotsContainer = document.querySelector('.slider-dots');
  
  let currentIndex = 0;
  let slideInterval;
  
  const caseDescriptions = [
    { title: "Пирошоу на свадьбе", text: "Зрелищное пиротехническое шоу с синхронизацией под музыку для молодожёнов. Использовали холодные фонтаны и конфетти-машины для финального аккорда." },
    { title: "Холодные фонтаны на корпоративе", text: "Установка 12 холодных фонтанов по периметру сцены для эффектного открытия мероприятия. Безопасный дым и яркие визуальные эффекты." },
    { title: "Дымовые эффекты на концерте", text: "Профессиональные дымовые машины с тяжёлым дымом для создания атмосферы на музыкальном фестивале. Полная синхронизация с выступлением артистов." }
  ];
  
  function createDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.classList.add('slider-dot');
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        currentIndex = index;
        showSlide(currentIndex);
        startAutoSlide();
      });
      dotsContainer.appendChild(dot);
    });
  }
  
  function updateDots() {
    document.querySelectorAll('.slider-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }
  
  const showSlide = (index) => {
    slides.forEach((slide, i) => {
      if (i === index) {
        slide.classList.add('active');
        setTimeout(() => { slide.style.opacity = 1; }, 50);
      } else {
        slide.style.opacity = 0;
        setTimeout(() => { slide.classList.remove('active'); }, 300);
      }
    });
    if (caseTitle && caseText && caseDescriptions[index]) {
      caseTitle.textContent = caseDescriptions[index].title;
      caseText.textContent = caseDescriptions[index].text;
    }
    updateDots();
  };
  
  let touchStartX = 0, touchEndX = 0;
  const handleTouchStart = (e) => { touchStartX = e.touches[0].clientX; };
  const handleTouchMove = (e) => { touchEndX = e.touches[0].clientX; };
  const handleTouchEnd = () => {
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      currentIndex = diff > 0 ? (currentIndex + 1) % slides.length : (currentIndex - 1 + slides.length) % slides.length;
      showSlide(currentIndex);
    }
  };
  
  const startAutoSlide = () => {
    clearInterval(slideInterval);
    slideInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % slides.length;
      showSlide(currentIndex);
    }, 6000);
  };
  
  if (slides.length > 0) {
    createDots();
    if (window.innerWidth <= 768) {
      sliderContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
      sliderContainer.addEventListener('touchmove', handleTouchMove, { passive: true });
      sliderContainer.addEventListener('touchend', handleTouchEnd);
    }
    startAutoSlide();
    sliderContainer.addEventListener('mouseenter', () => clearInterval(slideInterval));
    sliderContainer.addEventListener('mouseleave', startAutoSlide);
    document.querySelector('.next')?.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % slides.length;
      showSlide(currentIndex);
      startAutoSlide();
    });
    document.querySelector('.prev')?.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      showSlide(currentIndex);
      startAutoSlide();
    });
  }
  
  // === Плавающая кнопка Telegram — появление после Hero ===
  if (telegramFloat && heroSection) {
    const checkHeroScroll = () => {
      const heroBottom = heroSection.getBoundingClientRect().bottom;
      const triggerPoint = window.innerHeight * 0.8;
      if (heroBottom < triggerPoint) {
        telegramFloat.classList.add('visible');
      } else {
        telegramFloat.classList.remove('visible');
      }
    };
    
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      if (scrollTimeout) return;
      scrollTimeout = setTimeout(() => { checkHeroScroll(); scrollTimeout = null; }, 100);
    }, { passive: true });
    
    checkHeroScroll();
    
    telegramFloat.addEventListener('click', () => {
      telegramFloat.classList.add('clicked');
      setTimeout(() => telegramFloat.classList.remove('clicked'), 300);
    });
  }
  
  // === Гамбургер меню + скрытие Telegram-кнопки ===
  // Функция: показать/скрыть кнопку Telegram
  function toggleTelegramButton(show) {
    if (telegramFloat) {
      if (show) {
        telegramFloat.style.opacity = '';
        telegramFloat.style.visibility = '';
        telegramFloat.style.pointerEvents = '';
      } else {
        telegramFloat.style.opacity = '0';
        telegramFloat.style.visibility = 'hidden';
        telegramFloat.style.pointerEvents = 'none';
      }
    }
  }
  
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const isActive = mobileMenu.classList.toggle('active');
      document.body.style.overflow = isActive ? 'hidden' : '';
      document.body.classList.toggle('menu-open', isActive);
      toggleTelegramButton(!isActive);
    });
  }
  
  if (menuClose) {
    menuClose.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
      document.body.classList.remove('menu-open');
      toggleTelegramButton(true);
    });
  }
  
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
        document.body.classList.remove('menu-open');
        toggleTelegramButton(true);
      });
    });
  }
  
// === Модальное окно услуг ===
const serviceCards = document.querySelectorAll('.service-card');
const serviceModal = document.getElementById('service-modal');
const modalOverlay = document.querySelector('.modal-overlay');
const modalClose = document.querySelector('.modal-close');
const modalImg = document.getElementById('modal-img');
const modalTitle = document.getElementById('modal-title');
const modalPrice = document.getElementById('modal-price');
const modalDesc = document.getElementById('modal-desc');

// Данные для каждой услуги
const servicesData = {
        smoke: {
            title: "Тяжелый дым",
            price: "от 5 000 ₽",
            description: `
                <p class="modal-intro">Эффект «танца на облаках» для вашего события. Дым стелется по полу, не поднимаясь вверх.</p>
                
                <ul class="modal-features">
                    <li><strong>Безопасно:</strong> без запаха, не оставляет следов на одежде и полу.</li>
                    <li><strong>Эффектно:</strong> скрывает несовершенства пола, идеален для фото/видео.</li>
                    <li><strong>Длительность:</strong> плотный слой держится 3–5 минут.</li>
                    <li><strong>Подходит для:</strong> первого танца, выхода молодоженов, фотосессий.</li>
                </ul>
            `
        },
        photobooth: {
            title: "Фотобудка (Photobooth) с брендированием",
            price: "от 10 000 ₽",
            description: `
                <p class="modal-intro">Развлечение для гостей + памятные фото. Печать на месте (полоски или 10x15) и отправка всех снимков на email.</p>
                
                <ul class="modal-features">
                    <li><strong>Персонализация:</strong> дизайн фоторамки с вашими именами/логотипом.</li>
                    <li><strong>Двойная память:</strong> гости забирают фото сразу, вы получаете полную галерею.</li>
                    <li><strong>Для всех:</strong> вместительный обзор 1-15 чел., профессиональный свет, реквизит в комплекте.</li>
                    <li><strong>Форматы печати:</strong> на выбор — классические 10x15 или стильные узкие полоски.</li>
                    <li><strong>Идеально для:</strong> свадеб, корпоративов, дней рождения.</li>
                </ul>
            `
        },
        fireworks: {
            title: "Пиротехническое шоу любого масштаба",
            price: "от 12 000 ₽",
            description: `
                <p class="modal-intro">От искр у ног до салюта в небе.</p>
                <ul class="modal-features">
                    <li>Безопасные холодные фонтаны для помещений (1–4 м).</li>
                    <li>Зрелищные фейерверки для открытых площадок (до 30 м).</li>
                    <li>Полное юридическое сопровождение.</li>
                    <li>Сертифицированное оборудование.</li>
                    <li>Гарантия вау-эффекта без дыма и запаха.</li>
                </ul>
            `
        },
        champagne: {
            title: "Шоу-подача шампанского",
            price: "по запросу",
            description: `
                <p class="modal-intro">Эстетика праздника в каждой детали. Превратите традиционный ритуал в главное фото события.</p>
                <ul class="modal-features">
                    <li><strong>Безупречный сервис:</strong> Профессиональные сомелье и ассистенты. Никаких пролитых бокалов и очередей.</li>
                    <li><strong>Премиальное наполнение:</strong> Работаем с вашим алкоголем или подбираем идеальные пары.</li>
                    <li><strong>Визуальный акцент:</strong> Подсветка, сухой лед, живые цветы или фруктовые декорации.</li>
                    <li><strong>Чистота и порядок:</strong> Демонтаж и уборка после завершения шоу входят в стоимость.</li>
                </ul>
            `
        }
    };

// Открытие модального окна
serviceCards.forEach(card => {
  card.addEventListener('click', () => {
    const serviceType = card.getAttribute('data-service');
    const data = serviceData[serviceType];
    
    if (data && serviceModal) {
      modalImg.src = data.image;
      modalImg.alt = data.title;
      modalTitle.textContent = data.title;
      modalPrice.textContent = data.price;
      modalDesc.textContent = data.description;
      
      serviceModal.classList.add('active');
      document.body.classList.add('modal-open');
    }
  });
});

// Закрытие модального окна
const closeModal = () => {
  if (serviceModal) {
    serviceModal.classList.remove('active');
    document.body.classList.remove('modal-open');
  }
};

if (modalClose) modalClose.addEventListener('click', closeModal);
if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

// Закрытие по ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && serviceModal?.classList.contains('active')) {
    closeModal();
  }
});
});
