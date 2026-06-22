# INFI-MALL-BO

인피니어 몰 백오피스 JSP 프로젝트의 프론트엔드 퍼블리싱 작업물입니다.  
Gulp 기반 빌드 환경에서 HTML, CSS, JS를 컴파일하여 로컬 개발 및 배포 산출물을 생성합니다.

---

## 기술 스택

| 구분 | 도구 |
|------|------|
| 빌드 | Gulp 4 |
| 스타일 | Tailwind CSS v4 (PostCSS) |
| 폰트 | Pretendard Variable (SCSS → CSS) |
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
│       ├── styles/               # 스타일 소스
│       │   ├── fonts.scss        # Pretendard Variable @font-face 정의
│       │   └── globals.css       # Tailwind 진입점 + 디자인 토큰 + 컴포넌트
│       ├── js/
│       │   ├── ui/               # UI 유틸 함수 (common, modal, popup 등)
│       │   └── develop.js        # 개발 전용 스크립트
│       ├── fonts/                # 웹폰트 (PretendardVariable.woff2)
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

---

## 스타일 구조

Tailwind CSS v4를 메인으로 사용하며, 두 파일만 관리합니다.

```
styles/
├── fonts.scss   → [Sass] → styles/fonts.css
│                  Pretendard Variable 폰트 선언
└── globals.css  → [PostCSS + Tailwind] → styles/globals.css
                   Tailwind 진입점, 디자인 토큰(@theme), 컴포넌트 스타일
```

### 디자인 토큰 (`globals.css` `@theme`)

`@theme` 블록에서 프로젝트 전용 토큰을 정의하면 Tailwind 유틸리티로 바로 사용 가능합니다.

```css
/* 색상 */
--color-master-100: #35465e;

/* 타이포그래피 */
--text-body-md: 14px;
--leading-body-md: 20px;
```

```html
<!-- 유틸리티 클래스로 사용 -->
<p class="text-master-100 text-body-md leading-body-md"></p>
```

### 커스텀 컴포넌트 클래스

반복되는 유틸리티 조합은 `@layer components`에 정의합니다.

```css
@layer components {
  .search-form__label {
    @apply border-line text-body-md leading-body-md ...;
  }
}
```

---

## 코드 품질

```bash
# 전체 검사
npm run lint:all

# 전체 자동 수정
npm run lint:all:fix
```

### 개별 실행

```bash
npm run lint          # JS 검사
npm run lint:fix      # JS 자동 수정
npm run lint:scss     # SCSS 검사
npm run lint:scss:fix # SCSS 자동 수정
npm run lint:html     # HTML 검사
npm run lint:html:fix # HTML 자동 수정
```

---

## 빌드 산출물

| 파일 | 설명 |
|------|------|
| `styles/fonts.css` | Pretendard Variable 폰트 선언 |
| `styles/globals.css` | Tailwind 컴파일 결과 (디자인 토큰 + 유틸리티) |
| `js/ui.js` | UI 유틸 JS 번들 (Babel + 난독화) |
| `js/develop.js` | 개발용 스크립트 (Babel 트랜스파일) |
| `*.html` | include 처리된 HTML |
