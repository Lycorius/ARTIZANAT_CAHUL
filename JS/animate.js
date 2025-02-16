const track = document.querySelector('.carousel-track');
const slides = document.querySelectorAll('.carousel-slide');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const indicators = document.querySelectorAll('.indicator');
let index = 0;
const slideCount = slides.length;

function updateCarousel() {
  const slideWidth = slides[0].offsetWidth; // Ширина одного слайда
  const newTransformValue = -index * slideWidth; // Смещение по оси X
  track.style.transform = `translateX(${newTransformValue}px)`; // Перемещаем слайды
}

function nextSlide() {
  index = (index + 1) % slideCount; // Если дошли до последнего, начинаем с первого
  updateCarousel();
}

function prevSlide() {
  index = (index - 1 + slideCount) % slideCount; // Если дошли до первого, начинаем с последнего
  updateCarousel();
}

nextBtn.addEventListener('click', () => {
  nextSlide();
});

prevBtn.addEventListener('click', () => {
  prevSlide();
});

// Инициализация при загрузке
updateCarousel();
indicators.forEach(indicator => {
    indicator.addEventListener('click', () => {
        index = parseInt(indicator.getAttribute('data-index'));
        updateCarousel();
        resetAutoSlide();
    });
});

// Сброс интервала автопрокрутки
function resetAutoSlide() {
    clearInterval(autoSlide);
    autoSlide = setInterval(nextSlide, intervalTime);
}

<script>
        const track = document.querySelector('.carousel-track');
        const slides = document.querySelectorAll('.carousel-slide');
        const prevBtn = document.querySelector('.prev');
        const nextBtn = document.querySelector('.next');
        const indicators = document.querySelectorAll('.indicator');
        let index = 0;
        const intervalTime = 4000;

        // Функция для обновления карусели
        function updateCarousel() {
            track.style.transform = `translateX(-${index * 100}%)`; // Переходим на нужное изображение
            indicators.forEach((indicator, i) => {
                indicator.classList.toggle('active', i === index);
            });
        }

        // Следующий слайд
        function nextSlide() {
            index = (index + 1) % slides.length;
            updateCarousel();
        }

        // Автоматическое обновление карусели
        let autoSlide = setInterval(nextSlide, intervalTime);

        // Обработчики для кнопок
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoSlide();
        });

        prevBtn.addEventListener('click', () => {
            index = (index - 1 + slides.length) % slides.length;
            updateCarousel();
            resetAutoSlide();
        });

        // Обработчик для индикаторов
        indicators.forEach(indicator => {
            indicator.addEventListener('click', () => {
                index = parseInt(indicator.getAttribute('data-index'));
                updateCarousel();
                resetAutoSlide();
            });
        });

        // Сброс интервала автопрокрутки
        function resetAutoSlide() {
            clearInterval(autoSlide);
            autoSlide = setInterval(nextSlide, intervalTime);
        }
    </script>
