const carouselSlide = document.querySelector('.slide_list');
const prevBtn = document.querySelector('.prevBtn');
const nextBtn = document.querySelector('.nextBtn');
const stopBtn = document.querySelector('.stopBtn');
const transitionSpeedInput = document.getElementById('transitionSpeed');
const autoSlideIntervalInput = document.getElementById('autoSlideInterval');
const addSlideBtn = document.getElementById('addSlideBtn');
const slideTypeSelect = document.getElementById('slideType');
const textSlideInput = document.getElementById('textSlideInput');
const newSlideItemInput = document.getElementById('newSlideItem');
const imageSlideInput = document.getElementById('imageSlideInput');
const slideImageInput = document.getElementById('slideImage');
const slideBox = document.getElementById('slideBox');

let carouselItems = document.querySelectorAll('.slide_item');
let indicators = document.querySelectorAll('.indicator');

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

    // 슬라이드 이동을 위한 counter 값 설정
    counter = slideTo;

    // 슬라이드 이동
    carouselSlide.style.transition = `transform ${transitionSpeed}ms ease-in-out`;
    carouselSlide.style.transform = `translateX(${-size * counter}px)`;

    // 인디케이터 상태 업데이트
    updateIndicators(counter);

    // 인디케이터 클릭 시 자동 슬라이드 중지
    stopAutoSlide();
  });
});

function addSlideItem() {
  const selectedSlideType = slideTypeSelect.value;
  const newItemContent = newSlideItemInput.value.trim();
  const imageFile = slideImageInput.files[0];

  if (selectedSlideType === 'text' && !newItemContent) {
    alert('텍스트 내용을 입력해주세요!');
    return;
  }

  if (selectedSlideType === 'image' && !imageFile) {
    alert('이미지를 선택해주세요!');
    return;
  }

  const newSlideItem = document.createElement('div');
  newSlideItem.classList.add('slide_item');

  if (selectedSlideType === 'text') {
    newSlideItem.textContent = newItemContent;
  }

  if (selectedSlideType === 'image') {
    const imgElement = document.createElement('img');
    imgElement.src = URL.createObjectURL(imageFile);
    imgElement.style.width = '100%';
    imgElement.style.height = 'auto';
    newSlideItem.appendChild(imgElement);
  }

  // 슬라이드 리스트에 추가 (첫 번째 클론 전 위치)
  carouselSlide.insertBefore(newSlideItem, document.getElementById('firstClone'));

  // 새로운 인디케이터 추가
  const newIndicator = document.createElement('div');
  newIndicator.classList.add('indicator');
  newIndicator.setAttribute('data-slide', carouselItems.length - 1); // 인디케이터 번호 설정
  document.querySelector('.indicator_container').appendChild(newIndicator);

  // 슬라이드 및 인디케이터 업데이트
  carouselItems = document.querySelectorAll('.slide_item');
  indicators = document.querySelectorAll('.indicator');
  newSlideItemInput.value = ''; // 입력 필드 초기화
  slideImageInput.value = ''; // 이미지 필드 초기화
  updateSlideListWidth();

  // 새로 추가된 슬라이드 인디케이터 클릭 이벤트 연결
  newIndicator.addEventListener('click', () => {
    counter = parseInt(newIndicator.getAttribute('data-slide'));
    carouselSlide.style.transition = `transform ${transitionSpeed}ms ease-in-out`;
    carouselSlide.style.transform = `translateX(${-size * counter}px)`;
    updateIndicators(counter);
    stopAutoSlide(); // 인디케이터 클릭 시 자동 슬라이드 중지
  });
}

// 슬라이드 타입 변경 시 필드 표시/숨기기
slideTypeSelect.addEventListener('change', (event) => {
  const selectedSlideType = event.target.value;

  if (selectedSlideType === 'text') {
    textSlideInput.style.display = 'block'; // 텍스트 입력 필드 표시
    imageSlideInput.style.display = 'none'; // 이미지 업로드 필드 숨김
  } else if (selectedSlideType === 'image') {
    textSlideInput.style.display = 'none'; // 텍스트 입력 필드 숨김
    imageSlideInput.style.display = 'block'; // 이미지 업로드 필드 표시
  }
});

// "추가하기" 버튼 클릭 이벤트 리스너
addSlideBtn.addEventListener('click', addSlideItem);

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
