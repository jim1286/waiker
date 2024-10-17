const carouselSlide = document.querySelector('.slide_list');
const carouselItems = document.querySelectorAll('.slide_item');
const prevBtn = document.querySelector('.prevBtn');
const nextBtn = document.querySelector('.nextBtn');
const stopBtn = document.querySelector('.stopBtn');
const indicators = document.querySelectorAll('.indicator'); // 인디케이터 요소
const transitionSpeedInput = document.getElementById('transitionSpeed');
const autoSlideIntervalInput = document.getElementById('autoSlideInterval');

const size = carouselItems[0].clientWidth;

let counter = 1;
let autoSlideInterval;
let isAutoSliding = true; // 자동 슬라이드 상태를 추적
let transitionSpeed = parseInt(transitionSpeedInput.value); // 초기 전환 속도
let slideInterval = parseInt(autoSlideIntervalInput.value); // 초기 자동 슬라이드 간격

// 초기 위치 설정
carouselSlide.style.transform = `translateX(${-size * counter}px)`;
updateIndicators(counter);

// 다음 슬라이드로 자동 이동하는 함수
function autoSlide() {
  isAutoSliding = true;
  stopBtn.textContent = '자동 슬라이드 중지';
  autoSlideInterval = setInterval(() => {
    moveToNextSlide();
  }, slideInterval); // 사용자가 설정한 자동 슬라이드 간격
}

// 자동 슬라이드 중지 함수
function stopAutoSlide() {
  isAutoSliding = false;
  clearInterval(autoSlideInterval);
  stopBtn.textContent = '자동 슬라이드 시작';
}

// 다음 슬라이드로 이동하는 함수
function moveToNextSlide() {
  if (counter >= carouselItems.length - 1) {
    return;
  }

  moveSlide(1);
}

// 이전 슬라이드로 이동하는 함수
function moveToPrevSlide() {
  if (counter <= 0) {
    return;
  }

  moveSlide(-1);
}

// 슬라이드 이동 함수
function moveSlide(step) {
  carouselSlide.style.transition = `transform ${transitionSpeed}ms ease-in-out`;
  counter += step;
  carouselSlide.style.transform = `translateX(${-size * counter}px)`;
  updateIndicators(counter); // 슬라이드 이동 후 인디케이터 업데이트
}

// 인디케이터 업데이트 함수
function updateIndicators(currentIndex) {
  indicators.forEach((indicator, index) => {
    indicator.classList.remove('active');
    if (index === currentIndex - 1) {
      // 인디케이터 인덱스는 슬라이드와 다름
      indicator.classList.add('active');
    }
  });
}

// 인디케이터 클릭 시 해당 슬라이드로 이동하는 함수
indicators.forEach((indicator) => {
  indicator.addEventListener('click', () => {
    const slideTo = parseInt(indicator.getAttribute('data-slide'));
    counter = slideTo;
    carouselSlide.style.transition = `transform ${transitionSpeed}ms ease-in-out`;
    carouselSlide.style.transform = `translateX(${-size * counter}px)`;
    updateIndicators(counter);
    stopAutoSlide(); // 인디케이터 클릭 시 자동 슬라이드 중지
  });
});

// 버튼 클릭 이벤트
nextBtn.addEventListener('click', () => {
  moveToNextSlide();
  stopAutoSlide(); // 수동 슬라이드 조작 시 자동 슬라이드 중지
});

prevBtn.addEventListener('click', () => {
  moveToPrevSlide();
  stopAutoSlide(); // 수동 슬라이드 조작 시 자동 슬라이드 중지
});

// 자동 슬라이드 중지 버튼 클릭 이벤트  리스너
stopBtn.addEventListener('click', () => {
  if (isAutoSliding) {
    stopAutoSlide();
  } else {
    autoSlide();
  }
});

// 슬라이드 전환 속도 및 간격 변경 시 이벤트 리스너
transitionSpeedInput.addEventListener('change', (event) => {
  transitionSpeed = parseInt(event.target.value);
});

autoSlideIntervalInput.addEventListener('change', (event) => {
  slideInterval = parseInt(event.target.value);

  if (isAutoSliding) {
    stopAutoSlide(); // 현재 자동 슬라이드 중지
    autoSlide(); // 새로운 간격으로 다시 시작
  }
});

// 무한 루프를 위한 transitionend 이벤트 처리
carouselSlide.addEventListener('transitionend', () => {
  if (carouselItems[counter].id === 'firstClone') {
    carouselSlide.style.transition = 'none'; // 애니메이션 없이 위치 이동
    counter = 1;
    carouselSlide.style.transform = `translateX(${-size * counter}px)`;
    updateIndicators(counter);
  }

  if (carouselItems[counter].id === 'lastClone') {
    carouselSlide.style.transition = 'none'; // 애니메이션 없이 위치 이동
    counter = carouselItems.length - 2;
    carouselSlide.style.transform = `translateX(${-size * counter}px)`;
    updateIndicators(counter);
  }
});

// 자동 슬라이드 시작
autoSlide();
