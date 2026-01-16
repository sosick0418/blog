# n8n Gemini AI 리뷰 생성 파이프라인 설정 가이드

## 개요

이 워크플로우는 쿠팡 상품 정보를 입력하면 Gemini AI가 전문적인 리뷰를 자동 생성하고 블로그에 배포합니다.

## 워크플로우 파일

- `content-api-pipeline-v3-full.json` - 권장 (AI + 이미지 스크래핑)
- `content-api-pipeline-v2.json` - AI만 사용
- `content-api-pipeline.json` - 기본 (AI 없음)

## 설정 단계

### 1. Gemini API 키 발급

1. [Google AI Studio](https://aistudio.google.com/) 접속
2. API 키 생성
3. 키를 안전한 곳에 저장

### 2. n8n Credential 설정

1. n8n 접속 (http://localhost:5678)
2. **Settings** → **Credentials** → **Add Credential**
3. **HTTP Query Auth** 선택
4. 설정:
   - **Name**: `Gemini API Key`
   - **Query Auth**:
     - Name: `key`
     - Value: `(발급받은 API 키)`
5. **Save**

### 3. 워크플로우 가져오기

1. n8n 메인 화면에서 **Import** 클릭
2. `content-api-pipeline-v3-full.json` 파일 선택
3. **Import**

### 4. Credential 연결

1. 가져온 워크플로우 열기
2. **✨ Gemini AI 리뷰 생성** 노드 클릭
3. **Credential** 드롭다운에서 `Gemini API Key` 선택
4. **Save**

## 사용 방법

### 제품 추가하기

1. **📝 제품 정보 입력** 노드 클릭
2. 제품 정보 입력:

```
productId: 쿠팡 상품 ID (URL에서 추출)
name: 삼성 갤럭시 워치6 44mm
category: electronics | home | beauty
affiliateUrl: https://link.coupang.com/a/xxxxx
price: 329000
rating: 4.5
productFeatures: GPS, 심박수 측정, 수면 추적, 5ATM 방수, 40시간 배터리
fetchImage: true
autoDeploy: true
```

3. **Execute Workflow** 클릭

### 입력 필드 설명

| 필드 | 필수 | 설명 |
|------|------|------|
| productId | ✓ | 쿠팡 상품 ID (중복 불가) |
| name | ✓ | 제품명 (한글) |
| category | ✓ | electronics, home, beauty |
| affiliateUrl | ✓ | 쿠팡 파트너스 링크 |
| price | ✓ | 가격 (숫자만) |
| rating | | 평점 1-5 (소수점 가능, 기본: 4.5) |
| productFeatures | | 주요 특징 (AI가 참고) |
| fetchImage | | 이미지 자동 추출 (기본: true) |
| autoDeploy | | 자동 배포 (기본: true) |
| dryRun | | 테스트 모드 (기본: false) |

### productFeatures 작성 팁

AI가 더 좋은 리뷰를 생성하도록 구체적인 특징을 입력하세요:

```
# 좋은 예시
productFeatures: Bluetooth 5.3, ANC 노이즈캔슬링, 30시간 재생, IPX4 방수, 10분 충전 3시간 재생

# 나쁜 예시
productFeatures: 좋은 이어폰
```

## 배포 확인

1. 워크플로우 실행 완료 후 약 2분 대기
2. GitHub Actions 배포 확인: https://github.com/sosick0418/blog/actions
3. 사이트 확인: https://bichonhenry.cloud/review/[제품명]/

## 문제 해결

### "GEMINI_ERROR" 오류
- API 키가 올바른지 확인
- Google AI Studio에서 할당량 확인

### "DUPLICATE_PRODUCT" 오류
- 이미 같은 productId가 존재함
- 다른 productId 사용

### "GIT_PUSH_FAILED" 오류
- API 서버의 Git 설정 확인
- SSH 키 권한 확인

### 이미지가 placeholder로 나옴
- 쿠팡 페이지 구조가 변경되었을 수 있음
- imageUrl을 직접 입력

## 고급 설정

### 스케줄 자동화

1. **Schedule Trigger** 노드의 **disabled** 해제
2. cron 표현식 수정 (기본: 매일 오전 9시)
3. 외부 API에서 상품 목록 가져오도록 확장 가능

### 프롬프트 커스터마이징

**🤖 AI 프롬프트 생성** 노드의 JavaScript 코드에서 프롬프트 수정 가능:

- 리뷰 스타일 변경
- 섹션 추가/삭제
- 톤앤매너 조정

## API 엔드포인트

Content API 서버가 실행 중이어야 합니다:

```bash
cd api && npm start
# 또는
docker-compose up -d
```

- Health check: `GET http://localhost:3001/api/health`
- 제품 추가: `POST http://localhost:3001/api/products`
- 제품 목록: `GET http://localhost:3001/api/products`
