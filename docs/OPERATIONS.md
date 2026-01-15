# 운영 가이드 (Operations Guide)

쿠팡 어필리에이트 자동 블로그 운영 매뉴얼입니다.

## 일일 운영

### 새 상품 추가하기

1. `src/_data/products.json` 파일 열기
2. `products` 배열에 새 상품 추가:

```json
{
  "productId": "고유ID",
  "name": "상품명 (한글)",
  "price": 가격(숫자),
  "imageUrl": "이미지 URL",
  "category": "electronics|home|beauty|etc",
  "description": "상품 설명",
  "affiliateUrl": "쿠팡 어필리에이트 링크"
}
```

3. 저장 후 커밋 & 푸시

### 수동으로 포스트 생성하기

```bash
# 기본 실행 (LLM 사용, git 커밋 & 푸시)
npm run orchestrate -- --product-json '{"productId":"123","productName":"상품명","productPrice":29900}'

# 테스트 모드 (git 푸시 안 함)
npm run orchestrate -- --product-json '...' --dry-run

# LLM 없이 (플레이스홀더 콘텐츠)
npm run orchestrate -- --product-json '...' --no-llm

# 로컬 테스트 (git 작업 없음)
npm run orchestrate -- --product-json '...' --skip-git --no-llm
```

### 로컬 미리보기

```bash
# 개발 서버 시작
npm run dev

# 브라우저에서 확인
open http://localhost:8080
```

### 변경사항 배포하기

```bash
git add .
git commit -m "내용 설명"
git push origin main
# GitHub Actions가 자동으로 빌드 및 배포
```

## n8n 자동화

### n8n 시작하기

```bash
# Docker Compose로 n8n 시작
npm run n8n:start
# 또는
docker compose up -d

# 상태 확인
docker compose ps

# 로그 확인
docker compose logs -f n8n
```

### n8n UI 접속

1. 브라우저에서 http://localhost:5678 접속
2. 로그인 정보 입력 (.env 파일 참조)
   - Username: `admin` (기본값)
   - Password: .env의 `N8N_BASIC_AUTH_PASSWORD`

### 스케줄 자동화 활성화

1. n8n UI에서 "Coupang Content Pipeline" 워크플로우 열기
2. "Schedule Trigger" 노드 클릭 → Enable 토글 ON
3. 우측 상단 "Active" 토글 ON
4. 매일 오전 9시에 자동 실행됨

### 수동 워크플로우 실행

1. n8n UI에서 워크플로우 열기
2. "Test Workflow" 버튼 클릭
3. "Set Product Data" 노드에서 상품 정보 수정 가능

### n8n 중지하기

```bash
docker compose down
```

## 설정 참조

### 환경 변수 (.env)

| 변수 | 설명 | 필수 |
|------|------|------|
| `COUPANG_PARTNER_ID` | 쿠팡파트너스 ID | ⚠️ 승인 후 |
| `GEMINI_API_KEY` | Google AI Studio API 키 | LLM 사용 시 |
| `N8N_BASIC_AUTH_PASSWORD` | n8n 로그인 비밀번호 | n8n 사용 시 |
| `N8N_ENCRYPTION_KEY` | n8n 암호화 키 | n8n 사용 시 |

### 환경 변수 설정 방법

```bash
# .env 파일 생성 (최초 1회)
cp .env.example .env

# .env 파일 편집
nano .env  # 또는 선호하는 에디터

# GEMINI_API_KEY 발급: https://aistudio.google.com/apikey
```

### 디렉토리 구조

```
techblog/
├── src/
│   ├── _data/
│   │   └── products.json    # 상품 데이터
│   ├── posts/               # 생성된 포스트
│   └── _includes/           # 템플릿
├── scripts/
│   ├── orchestrate-content.js  # 메인 스크립트
│   └── generate-post.js        # 포스트 생성
├── n8n/
│   └── workflows/           # n8n 워크플로우
├── docs/                    # 문서
└── .env                     # 환경 변수 (git 무시됨)
```

## 유용한 명령어

```bash
# 빌드 확인
npm run build

# 테스트 포스트 생성 (git 없이)
npm run orchestrate -- --product-json '{"productId":"test","productName":"테스트"}' --skip-git --no-llm

# n8n 시작/중지
npm run n8n:start
npm run n8n:stop

# Git 상태 확인
git status
git log --oneline -5
```

## 라이브 사이트

- **URL**: https://bichonhenry.cloud
- **GitHub 저장소**: https://github.com/sosick0418/blog
- **배포**: GitHub Actions (push to main 시 자동)
