const track = document.querySelector('.carousel-track');
const slides = Array.from(track.children);
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const indicators = document.querySelectorAll('.indicator');
let index = Math.floor(slides.length / 2); // Set initial index to the middle slide
const slideWidth = slides[0].getBoundingClientRect().width;

// Arrange the slides next to one another
slides.forEach((slide, i) => {
  slide.style.left = `${slideWidth * i}px`;
});

function updateCarousel() {
  track.style.transform = `translateX(-${index * slideWidth}px)`;
  indicators.forEach((indicator, i) => {
    indicator.classList.toggle('active', i === index);
  });
}

function nextSlide() {
  index = (index + 1) % slides.length;
  updateCarousel();
}

function prevSlide() {
  index = (index - 1 + slides.length) % slides.length;
  updateCarousel();
}

nextBtn.addEventListener('click', () => {
  nextSlide();
  resetAutoSlide();
});

prevBtn.addEventListener('click', () => {
  prevSlide();
  resetAutoSlide();
});

indicators.forEach((indicator, i) => {
  indicator.addEventListener('click', () => {
    index = i;
    updateCarousel();
    resetAutoSlide();
  });
});

const intervalTime = 4000;
let autoSlide = setInterval(nextSlide, intervalTime);

function resetAutoSlide() {
  clearInterval(autoSlide);
  autoSlide = setInterval(nextSlide, intervalTime);
}

const languageSelector = document.getElementById('language');

languageSelector.addEventListener('change', (event) => {
  const selectedLanguage = event.target.value;
  changeLanguage(selectedLanguage);
});

function changeLanguage(language) {
  const elements = document.querySelectorAll('[data-lang]');
  elements.forEach(element => {
    const key = element.getAttribute('data-lang');
    element.textContent = translations[language][key];
  });
}

const translations = {
  ro: {
    'header-about': 'Despre noi',
    'header-services': 'Servicii',
    'header-catalog': 'Catalog',
    'header-contact': 'Contacte',
    'hero-title': 'PĂSTRĂM TRADIȚIA',
    'hero-subtitle': 'Platouri de lemn și veselă de lut',
    'hero-button': 'Vezi catalogul',
    'about-title': 'Despre noi',
    'about-description': 'Pasionați de obiceiuri și tradiții, am decis să împărtășim cu voi cele mai reușite produse artizanale ce ne ajută să păstram tradițiile autohtone și să îi bucurăm pe cei dragi!',
    'services-title': 'Servicii',
    'services-description': 'Comercializarea veselei din lut tradiționale, platouri din lemn (frasin sau stejar), suporturi pentru vin (vinoteca) și seturi cadou la discreția clientului. Livrarea produselor prin poșta în țară și peste hotare.',
    'contact-title': 'Contactează-ne',
    'contact-send-message': 'Trimite-ne un mesaj',
    'contact-name': 'Nume Prenume',
    'contact-phone': 'Telefon',
    'contact-email': 'Email',
    'contact-message': 'Mesajul',
    'contact-button': 'Trimite mesajul',
    'footer-info': 'Informații generale',
    'footer-home': 'Acasă',
    'footer-catalog': 'Catalog',
    'footer-about': 'Despre',
    'footer-services': 'Servicii',
    'footer-contact': 'ARTIZANAT CAHUL',
    'footer-phone': '+(373) 60 132 630',
    'footer-address': 'Cahul, Centrul Comercial "Globus", str. 31 August 13B'
  },
  ru: {
    'header-about': 'О нас',
    'header-services': 'Услуги',
    'header-catalog': 'Каталог',
    'header-contact': 'Контакты',
    'hero-title': 'СОХРАНЯЕМ ТРАДИЦИИ',
    'hero-subtitle': 'Деревянные блюда и глиняная посуда',
    'hero-button': 'Смотреть каталог',
    'about-title': 'О нас',
    'about-description': 'Увлеченные обычаями и традициями, мы решили поделиться с вами лучшими ремесленными изделиями, которые помогают нам сохранять местные традиции и радовать близких!',
    'services-title': 'Услуги',
    'services-description': 'Продажа традиционной глиняной посуды, деревянных блюд (ясень или дуб), винных подставок (винотека) и подарочных наборов по желанию клиента. Доставка товаров по почте по стране и за границу.',
    'contact-title': 'Свяжитесь с нами',
    'contact-send-message': 'Отправьте нам сообщение',
    'contact-name': 'Имя Фамилия',
    'contact-phone': 'Телефон',
    'contact-email': 'Эл. почта',
    'contact-message': 'Сообщение',
    'contact-button': 'Отправить сообщение',
    'footer-info': 'Общая информация',
    'footer-home': 'Главная',
    'footer-catalog': 'Каталог',
    'footer-about': 'О нас',
    'footer-services': 'Услуги',
    'footer-contact': 'АРТИЗАНАТ КАХУЛ',
    'footer-phone': '+(373) 60 132 630',
    'footer-address': 'Кахул, Торговый центр "Глобус", ул. 31 Августа 13Б'
  },
  en: {
    'header-about': 'About Us',
    'header-services': 'Services',
    'header-catalog': 'Catalog',
    'header-contact': 'Contact',
    'hero-title': 'PRESERVING TRADITION',
    'hero-subtitle': 'Wooden platters and clay tableware',
    'hero-button': 'View catalog',
    'about-title': 'About Us',
    'about-description': 'Passionate about customs and traditions, we decided to share with you the best handmade products that help us preserve local traditions and delight our loved ones!',
    'services-title': 'Services',
    'services-description': 'Selling traditional clay tableware, wooden platters (ash or oak), wine racks (vinoteca), and gift sets at the client\'s discretion. Product delivery by mail within the country and abroad.',
    'contact-title': 'Contact Us',
    'contact-send-message': 'Send us a message',
    'contact-name': 'Full Name',
    'contact-phone': 'Phone',
    'contact-email': 'Email',
    'contact-message': 'Message',
    'contact-button': 'Send message',
    'footer-info': 'General Information',
    'footer-home': 'Home',
    'footer-catalog': 'Catalog',
    'footer-about': 'About',
    'footer-services': 'Services',
    'footer-contact': 'ARTIZANAT CAHUL',
    'footer-phone': '+(373) 60 132 630',
    'footer-address': 'Cahul, Globus Shopping Center, 31 August 13B'
  }
};

// Initialize language based on default or saved preference
const defaultLanguage = 'ro'; // Set default language
changeLanguage(defaultLanguage);

// Initialize carousel
updateCarousel();