# INFI-MALL-BO

인피니어 몰 백오피스 JSP 프로젝트의 프론트엔드 퍼블리싱 작업물입니다.  
Gulp 기반 빌드 환경에서 HTML, SCSS, JS를 컴파일하여 로컬 개발 및 배포 산출물을 생성합니다.

---

## 기술 스택

| 구분 | 도구 |
|------|------|
| 빌드 | Gulp 4 |
| 스타일 | SCSS (Dart Sass) |
| 스크립트 | ES6+ (Babel 트랜스파일) |
| 템플릿 | gulp-file-include (`@@include`) |
| 코드 품질 | ESLint + Prettier + Stylelint |
| 개발 서버 | BrowserSync (port 5000) |

---

## 시작하기

```bash
# 패키지 설치
npm install

# 개발/빌드/클린 태스크 선택 실행
npm run gulp
```

`npm run gulp` 실행 시 터미널에서 태스크를 선택합니다.

| 선택 | 동작 |
|------|------|
| DEV | 로컬 개발 서버 실행 (`local/` 출력) |
| BUILD | 배포용 산출물 생성 (`dist/` 출력) |
| CLEAN | `local/`, `dist/` 폴더 삭제 |

개발 서버 주소: `http://localhost:5000`

---

## 디렉토리 구조

```
infi-mall-bo-jsp/
├── src/
│   ├── html/                     # HTML 소스
│   │   ├── _include/             # 공통 include 조각 (head, header, footer 등)
│   │   ├── main/
│   │   ├── guide/
│   │   ├── modal/
│   │   └── popup/
│   └── assets/
│       ├── scss/                 # SCSS 소스
│       │   ├── abstracts/        # 변수, 믹스인
│       │   ├── base/             # 초기화, 노멀라이즈, 타이포그래피
│       │   ├── layout/           # 헤더, 내비게이션, 컨테이너, 푸터 등
│       │   ├── components/       # 버튼 등 컴포넌트
│       │   ├── pages/            # 페이지별 스타일
│       │   └── ui.scss           # SCSS 엔트리 파일
│       ├── js/
│       │   ├── ui/               # UI 유틸 함수 (common, modal, popup 등)
│       │   └── develop.js        # 개발 전용 스크립트
│       ├── fonts/                # 웹폰트 (NotoSansKR)
│       ├── images/               # 이미지 소스
│       └── lib/                  # 외부 라이브러리
├── local/                        # DEV 출력 (gitignore)
├── dist/                         # BUILD 출력 (gitignore)
├── eslint.config.js              # ESLint 설정 (flat config)
├── .stylelintrc.json             # Stylelint 설정
├── .prettierrc                   # Prettier 설정
└── gulpfile.babel.js             # Gulp 태스크 정의
```

---

## HTML 템플릿

`@@include` 문법으로 공통 영역을 조각 파일로 분리합니다.

```html
@@include('@@webRoot/_include/head.html', { "title": "페이지 타이틀" })
@@include('@@webRoot/_include/header.html')
```

`@@webRoot`는 gulp-file-include가 실행 시 실제 경로로 치환합니다.

---

## SCSS 구조

```
abstracts/
  _variables.scss   # 색상, 폰트, 브레이크포인트 등 전역 변수
  _mixins.scss      # 반응형, clearfix, ellipsis 등 믹스인
base/
  _normalize.scss   # 브라우저 기본 스타일 정규화
  _reset.scss       # CSS 초기화
  _init.scss        # 프로젝트 기본 설정
  _typography.scss  # 폰트, 텍스트 스타일
layout/             # 레이아웃 단위 스타일
components/         # 재사용 컴포넌트 스타일
pages/              # 페이지별 스타일
```

---

## 코드 품질

### 린팅 및 포맷팅

```bash
# 전체 검사
npm run lint:all

# 전체 자동 수정
npm run lint:all:fix
```

### 개별 실행

```bash
# JavaScript (ESLint + Prettier)
npm run lint
npm run lint:fix

# SCSS (Stylelint + Prettier)
npm run lint:scss
npm run lint:scss:fix

# HTML (Prettier)
npm run lint:html
npm run lint:html:fix
```

### 설정 파일

| 파일 | 적용 대상 | 주요 규칙 |
|------|-----------|-----------|
| `eslint.config.js` | `src/assets/js/**/*.js` | ESLint recommended + Prettier |
| `.stylelintrc.json` | `src/assets/scss/**/*.scss` | SCSS standard + Prettier |
| `.prettierrc` | 전체 | singleQuote, tabWidth: 2, printWidth: 80 |

---

## 빌드 산출물

| 파일 | 설명 |
|------|------|
| `js/ui.js` | UI 유틸 JS 번들 (Babel 트랜스파일 + 난독화) |
| `js/develop.js` | 개발용 스크립트 (Babel 트랜스파일) |
| `css/ui.css` | SCSS 컴파일 결과 (압축) |
| `*.html` | include 처리된 HTML |
