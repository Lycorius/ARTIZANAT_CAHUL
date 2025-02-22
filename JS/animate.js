const CONFIG = {
    SLIDE_SHOW: 5,
    AUTO_PLAY_DELAY: 3000,
    SWIPE_THRESHOLD: 100,
    TRANSITION_TIME: 500,
    MOBILE_BREAKPOINT: 768
};

class Carousel {
    constructor() {
        this.state = {
            currentIndex: 2,
            isTransitioning: false,
            autoScrolling: true,
            touchStartX: 0,
            touchEndX: 0
        };

        this.elements = {
            track: document.querySelector('.carousel-track'),
            nextBtn: document.querySelector('.carousel-btn.next'),
            prevBtn: document.querySelector('.carousel-btn.prev'),
            indicators: document.querySelectorAll('.indicator'),
            slides: null,
            slideWidth: null
        };

        this.autoScrollTimer = null;
        this.init();
    }

    init() {
        if (!this.elements.track) return;
        
        this.elements.slides = Array.from(this.elements.track.children);
        this.elements.slideWidth = this.elements.slides[0].getBoundingClientRect().width;
        
        this.setupInfiniteSlides();
        this.bindEvents();
        this.updateUI();
        this.toggleAutoScroll(true);
    }

    updateTransform(position, transition = true) {
        if (!this.elements.track) return;
        
        this.elements.track.style.transition = transition ? 
            `transform ${CONFIG.TRANSITION_TIME}ms ease-in-out` : 'none';
        this.elements.track.style.transform = `translateX(${position}px)`;
    }

    updateUI() {
        this.elements.slides.forEach((slide, i) => 
            slide.classList.toggle('current-slide', i === this.state.currentIndex));

        this.elements.indicators.forEach((indicator, i) => 
            indicator.classList.toggle('active', i === (this.state.currentIndex - 2) % 5));
    }

    moveToSlide(index, smooth = true) {
        if (this.state.isTransitioning) return;
        
        this.state.isTransitioning = true;
        this.state.currentIndex = index;
        
        this.updateTransform(-this.state.currentIndex * this.elements.slideWidth, smooth);
        this.updateUI();
    }

    handleInfiniteScroll() {
        if (this.state.currentIndex <= 1) {
            this.state.currentIndex = this.elements.slides.length - 3;
        } else if (this.state.currentIndex >= this.elements.slides.length - 2) {
            this.state.currentIndex = 2;
        }
        
        this.updateTransform(-this.state.currentIndex * this.elements.slideWidth, false);
        this.updateUI();
        this.state.isTransitioning = false;
    }

    setupInfiniteSlides() {
        const cloneSlides = (slides, isStart) => {
            return slides.map(slide => {
                const clone = slide.cloneNode(true);
                clone.classList.add('clone');
                return clone;
            });
        };

        const startClones = cloneSlides(
            this.elements.slides.slice(0, CONFIG.SLIDE_SHOW)
        );
        const endClones = cloneSlides(
            this.elements.slides.slice(-CONFIG.SLIDE_SHOW)
        );

        startClones.forEach(clone => this.elements.track.appendChild(clone));
        endClones.reverse().forEach(clone => 
            this.elements.track.insertBefore(clone, this.elements.track.firstChild));

        this.updateTransform(-this.elements.slideWidth * CONFIG.SLIDE_SHOW, false);
    }

    toggleAutoScroll(enable) {
        this.state.autoScrolling = enable;
        clearTimeout(this.autoScrollTimer);
        if (enable) this.autoScroll();
    }

    autoScroll() {
        if (!this.state.autoScrolling) return;
        
        this.moveToSlide(this.state.currentIndex + 1, true);
        this.autoScrollTimer = setTimeout(() => 
            requestAnimationFrame(() => this.autoScroll()), CONFIG.AUTO_PLAY_DELAY);
    }

    handleTouchMove(e) {
        if (this.state.isTransitioning) return;
        
        this.state.touchEndX = e.touches[0].clientX;
        const diff = this.state.touchStartX - this.state.touchEndX;
        
        this.updateTransform(
            -this.state.currentIndex * this.elements.slideWidth - diff, 
            false
        );
    }

    bindEvents() {
        this.elements.track.addEventListener('touchstart', e => {
            this.state.touchStartX = e.touches[0].clientX;
            this.toggleAutoScroll(false);
        }, { passive: true });

        this.elements.track.addEventListener('touchmove', 
            e => this.handleTouchMove(e), { passive: true });

        this.elements.track.addEventListener('touchend', () => {
            const diff = this.state.touchStartX - this.state.touchEndX;
            if (Math.abs(diff) > CONFIG.SWIPE_THRESHOLD) {
                this.moveToSlide(this.state.currentIndex + (diff > 0 ? 1 : -1));
            } else {
                this.moveToSlide(this.state.currentIndex);
            }
            this.toggleAutoScroll(true);
        });

        this.elements.track.addEventListener('transitionend', 
            () => this.handleInfiniteScroll());
        this.elements.nextBtn?.addEventListener('click', 
            () => this.moveToSlide(this.state.currentIndex + 1));
        this.elements.prevBtn?.addEventListener('click', 
            () => this.moveToSlide(this.state.currentIndex - 1));
        this.elements.indicators.forEach((indicator, i) => 
            indicator.addEventListener('click', () => this.moveToSlide(i + 2)));

        this.elements.track.addEventListener('mouseenter', 
            () => this.toggleAutoScroll(false));
        this.elements.track.addEventListener('mouseleave', 
            () => this.toggleAutoScroll(true));
    }
}

class LanguageManager {
    constructor(translations) {
        this.translations = translations;
        this.currentLang = localStorage.getItem('language') || 'ro';
        this.init();
    }

    init() {
        const desktopSelector = document.getElementById('language');
        const mobileSelector = document.getElementById('language-mobile');
        
        if (desktopSelector) {
            desktopSelector.value = this.currentLang;
            desktopSelector.addEventListener('change', (e) => this.changeLanguage(e.target.value));
        }
        
        if (mobileSelector) {
            mobileSelector.value = this.currentLang;
            mobileSelector.addEventListener('change', (e) => this.changeLanguage(e.target.value));
        }

        this.updateContent();
    }

    changeLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('language', lang);
        
        const desktopSelector = document.getElementById('language');
        const mobileSelector = document.getElementById('language-mobile');
        
        if (desktopSelector) desktopSelector.value = lang;
        if (mobileSelector) mobileSelector.value = lang;
        
        this.updateContent();
    }

    updateContent() {
        document.querySelectorAll('[data-lang]').forEach(element => {
            const key = element.getAttribute('data-lang');
            if (this.translations[this.currentLang][key]) {
                element.textContent = this.translations[this.currentLang][key];
            }
        });
    }
}

class MobileNav {
    constructor() {
        this.hamburger = document.querySelector('.hamburger-menu');
        this.mobileNav = document.querySelector('.mobile-nav');
        this.body = document.body;
        this.init();
    }

    init() {
        if (!this.hamburger || !this.mobileNav) return;
        
        this.hamburger.addEventListener('click', () => {
            this.hamburger.classList.toggle('active');
            this.mobileNav.classList.toggle('active');
            this.body.classList.toggle('no-scroll');
        });

        document.addEventListener('click', (e) => {
            if (!this.mobileNav.contains(e.target) && 
                !this.hamburger.contains(e.target) && 
                this.mobileNav.classList.contains('active')) {
                this.hamburger.classList.remove('active');
                this.mobileNav.classList.remove('active');
                this.body.classList.remove('no-scroll');
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.hamburger.classList.remove('active');
                this.mobileNav.classList.remove('active');
                this.body.classList.remove('no-scroll');
            }
        });
    }
}

const translations = {
  ro: {
    'header-about': 'Despre',
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
    'footer-address': 'Cahul, Centrul Comercial "Globus", str. 31 August 13B',
    'cart-title': 'Coșul meu',
    'cart-total': 'Total:',
    'cart-empty': 'Coșul dvs. este gol',
    'cart-checkout': 'Finalizează comanda',
    'cart-return': 'Înapoi la catalog',
    'modal-title': 'Finalizare comandă',
    'modal-name': 'Nume Prenume *',
    'modal-phone': 'Telefon *',
    'modal-email': 'Email *',
    'modal-address': 'Adresa de livrare *',
    'modal-comments': 'Comentarii',
    'modal-confirm': 'Confirmă comanda',
    'catalog-platouri': 'Platouri din lemn',
    'catalog-oale': 'Oale din lut',
    'catalog-vinoteca': 'Vinotecă',
    'catalog-title': 'Catalog',
    'product-add': 'Adaugă în coș',
    'notification-added': 'Adăugat în coș',
    'notification-view-cart': 'Vezi coșul',
    'product-details': 'Detalii:',
    'product-size': 'Mărime:',
    'product-description': 'Descriere:',
    'product-currency': 'MDL'
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
    'footer-address': 'Кахул, Торговый центр "Глобус", ул. 31 Августа 13Б',
    'cart-title': 'Моя корзина',
    'cart-total': 'Итого:',
    'cart-empty': 'Ваша корзина пуста',
    'cart-checkout': 'Оформить заказ',
    'cart-return': 'Вернуться в каталог',
    'modal-title': 'Оформление заказа',
    'modal-name': 'Имя Фамилия *',
    'modal-phone': 'Телефон *',
    'modal-email': 'Email *',
    'modal-address': 'Адрес доставки *',
    'modal-comments': 'Комментарии',
    'modal-confirm': 'Подтвердить заказ',
    'catalog-platouri': 'Деревянные блюда',
    'catalog-oale': 'Глиняные горшки',
    'catalog-vinoteca': 'Винотека',
    'catalog-title': 'Каталог',
    'product-add': 'Добавить в корзину',
    'notification-added': 'Добавлено в корзину',
    'notification-view-cart': 'Просмотр корзины',
    'product-details': 'Детали:',
    'product-size': 'Размер:',
    'product-description': 'Описание:',
    'product-currency': 'MDL'
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
    'footer-address': 'Cahul, Globus Shopping Center, 31 August 13B',
    'cart-title': 'My Cart',
    'cart-total': 'Total:',
    'cart-empty': 'Your cart is empty',
    'cart-checkout': 'Checkout',
    'cart-return': 'Back to catalog',
    'modal-title': 'Complete Order',
    'modal-name': 'Full Name *',
    'modal-phone': 'Phone *',
    'modal-email': 'Email *',
    'modal-address': 'Delivery Address *',
    'modal-comments': 'Comments',
    'modal-confirm': 'Confirm Order',
    'catalog-platouri': 'Wooden Platters',
    'catalog-oale': 'Clay Pots',
    'catalog-vinoteca': 'Wine Racks',
    'catalog-title': 'Catalog',
    'product-add': 'Add to Cart',
    'notification-added': 'Added to Cart',
    'notification-view-cart': 'View Cart',
    'product-details': 'Details:',
    'product-size': 'Size:',
    'product-description': 'Description:',
    'product-currency': 'MDL'
  }
};

document.addEventListener('DOMContentLoaded', () => {
    new Carousel();
    new LanguageManager(translations);
    new MobileNav();

    document.querySelectorAll('.social-link').forEach(button => {
        button.addEventListener('click', () => {
            const url = button.dataset.socialUrl;
            if (url) window.open(url, '_blank', 'noopener,noreferrer');
        });
    });
});