# List View for 8percent

### 설명

waiker의 사전 과제입니다. javascript를 이용하여 carousel을 구현했습니다.

### 설치 방법

```bash
# npm 설치와 dev 모드 실행을 합니다.
npm run dev:install
```

### 개발 환경

```bash
node version : v20.11.0
```

### 초기 플로우 설명

```bash
1. 초기 위치 설정
1-1. updateIndicators로 첫 번째 인디케이터 활성화
1-2. updateSlideListWidth로 창 크기에 따른 carouselSlide width 설정
2. autoSlide로 자동 슬라이드 설정
3. carouselSlide.addEventListener('transitionend')로 슬라이드 처음과 마지막 감지
3-1. lastElement 닿을 경우 첫 번째 요소로 이동
3-2. firstElement 닿을 경우 마지막 요소로 이동
```

### 함수 설명

```bash
addSlideItem : type(text or image)에 따라 lastElement 앞에 요소 추가
handleGesture : 터치에 따른 슬라이드 전환
nextBtn,prevBtn : 이전, 다음 버튼
indicatorClickHandler : 인디케이터 클릭 이벤트 설정 함수
```
