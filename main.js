// querySelector
const carouselSlide = document.querySelector('.slide_list');
const prevBtn = document.querySelector('.prevBtn');
const nextBtn = document.querySelector('.nextBtn');
const stopBtn = document.querySelector('.stopBtn');

// querySelectorAll
let carouselItems = document.querySelectorAll('.slide_item');
let indicators = document.querySelectorAll('.indicator');

// getElementById
const transitionSpeedInput = document.getElementById('transitionSpeed');
const autoSlideIntervalInput = document.getElementById('autoSlideInterval');
const addSlideBtn = document.getElementById('addSlideBtn');
const slideTypeSelect = document.getElementById('slideType');
const textSlideInput = document.getElementById('textSlideInput');
const newSlideTextInput = document.getElementById('newSlideText');
const imageSlideInput = document.getElementById('imageSlideInput');
const newSlideImageInput = document.getElementById('newSlideImage');
const slideBox = document.getElementById('slideBox');
const firstElement = document.getElementById('firstElement');

let counter = 1;
let autoSlideInterval;
let isAutoSliding = true;
let transitionSpeed = parseInt(transitionSpeedInput.value);
let slideInterval = parseInt(autoSlideIntervalInput.value);
let size = slideBox.clientWidth;

// 터치 이벤트를 위한 변수 선언
let touchStartX = 0;
let touchEndX = 0;

// 초기 위치 설정
carouselSlide.style.transform = `translateX(${-size * counter}px)`;
updateIndicators(counter);
updateSlideListWidth();

// 터치 시작 이벤트
carouselSlide.addEventListener('touchstart', (event) => {
  touchStartX = event.touches[0].clientX;
});

// 터치 종료 이벤트
carouselSlide.addEventListener('touchend', (event) => {
  touchEndX = event.changedTouches[0].clientX;
  stopAutoSlide();
  handleGesture();
});

// 제스처 처리 함수
function handleGesture() {
  if (touchEndX < touchStartX - 50) {
    moveSlide(1);
  } else if (touchEndX > touchStartX + 50) {
    moveSlide(-1);
  }
}

textSlideInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    addSlideItem();
  }
});

imageSlideInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    addSlideItem();
  }
});

// 다음 슬라이드로 자동 이동하는 함수
function startAutoSlide() {
  isAutoSliding = true;
  stopBtn.textContent = '자동 슬라이드 중지';
  autoSlideInterval = setInterval(() => {
    moveToNextSlide();
  }, slideInterval);
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
  updateIndicators(counter);
}

// 슬라이드 너비 세팅하는 함수
function updateSlideListWidth() {
  const totalWidth = size * carouselItems.length;
  carouselSlide.style.width = `${totalWidth}px`;
}

// 인디케이터 업데이트 함수
function updateIndicators(currentIndex) {
  indicators.forEach((indicator, index) => {
    indicator.classList.remove('active');
    if (index === currentIndex - 1) {
      indicator.classList.add('active');
    }
  });
}

// 인디케이터 클릭 이벤트 함수
function indicatorClickHandler(newCounter) {
  counter = newCounter;
  carouselSlide.style.transition = `transform ${transitionSpeed}ms ease-in-out`;
  carouselSlide.style.transform = `translateX(${-size * newCounter}px)`;
  updateIndicators(newCounter);
  stopAutoSlide();
}

// 무한루프 함수
function infiniteSlideHandler(newCounter) {
  carouselSlide.style.transition = 'none';
  counter = newCounter;
  carouselSlide.style.transform = `translateX(${-size * newCounter}px)`;
  updateIndicators(newCounter);
}

// 인디케이터 클릭 시 해당 슬라이드로 이동하는 함수
indicators.forEach((indicator) => {
  indicator.addEventListener('click', () => {
    indicatorClickHandler(parseInt(indicator.getAttribute('data-slide')));
  });
});

// 슬라이드에 항목 추가하는 함수
function addSlideItem() {
  const selectedSlideType = slideTypeSelect.value;
  const newTextContent = newSlideTextInput.value.trim();
  const imageFile = newSlideImageInput.files[0];

  if (selectedSlideType === 'text' && !newTextContent) {
    alert('텍스트 내용을 입력해주세요!');
    return;
  }

  if (selectedSlideType === 'image' && !imageFile) {
    alert('이미지를 선택해주세요!');
    return;
  }

  const newSlideElement = document.createElement('div');
  newSlideElement.classList.add('slide_item');
  firstElement.innerHTML = '';

  if (selectedSlideType === 'text') {
    newSlideElement.textContent = newTextContent;
    firstElement.textContent = newTextContent;
  }

  if (selectedSlideType === 'image') {
    const imgElement = document.createElement('img');
    imgElement.src = URL.createObjectURL(imageFile);
    imgElement.style.width = '100%';
    imgElement.style.height = 'auto';
    newSlideElement.appendChild(imgElement);
    const imgClone = imgElement.cloneNode(true);
    firstElement.appendChild(imgClone);
  }

  // slide_item 마지막 인덱스에 추가
  carouselSlide.insertBefore(newSlideElement, document.getElementById('lastElement'));

  // 인디케이터 추가
  const newIndicator = document.createElement('div');
  newIndicator.classList.add('indicator');
  newIndicator.setAttribute('data-slide', carouselItems.length - 1);
  document.querySelector('.indicator_container').appendChild(newIndicator);

  // 슬라이드 및 인디케이터 업데이트
  carouselItems = document.querySelectorAll('.slide_item');
  indicators = document.querySelectorAll('.indicator');
  newSlideTextInput.value = '';
  newSlideImageInput.value = '';
  updateSlideListWidth();

  // 새로 추가된 슬라이드 인디케이터 클릭 이벤트 연결
  indicatorClickHandler(parseInt(newIndicator.getAttribute('data-slide')));
}

// 슬라이드 타입 변경 시 필드 표시/숨기기
slideTypeSelect.addEventListener('change', (event) => {
  const selectedSlideType = event.target.value;

  if (selectedSlideType === 'text') {
    textSlideInput.style.display = 'block';
    imageSlideInput.style.display = 'none';
  } else if (selectedSlideType === 'image') {
    textSlideInput.style.display = 'none';
    imageSlideInput.style.display = 'block';
  }
});

// 버튼 클릭 이벤트들
addSlideBtn.addEventListener('click', addSlideItem);

nextBtn.addEventListener('click', () => {
  moveToNextSlide();
  stopAutoSlide();
});

prevBtn.addEventListener('click', () => {
  moveToPrevSlide();
  stopAutoSlide();
});

// 자동 슬라이드 중지 버튼 클릭 이벤트 리스너
stopBtn.addEventListener('click', () => {
  if (isAutoSliding) {
    stopAutoSlide();
  } else {
    startAutoSlide();
  }
});

// 슬라이드 전환 속도 및 간격 변경 시 이벤트 리스너
transitionSpeedInput.addEventListener('change', (event) => {
  transitionSpeed = parseInt(event.target.value);
});

autoSlideIntervalInput.addEventListener('change', (event) => {
  slideInterval = parseInt(event.target.value);

  if (isAutoSliding) {
    stopAutoSlide();
    startAutoSlide();
  }
});

// 무한 루프를 위한 transitionend 이벤트 처리
carouselSlide.addEventListener('transitionend', () => {
  if (carouselItems[counter].id === 'firstElement') {
    infiniteSlideHandler(carouselItems.length - 2);
    return;
  }

  if (carouselItems[counter].id === 'lastElement') {
    infiniteSlideHandler(1);
    return;
  }
});

window.addEventListener('resize', () => {
  size = slideBox.clientWidth;
  updateSlideListWidth();
});

// 자동 슬라이드 시작
startAutoSlide();
