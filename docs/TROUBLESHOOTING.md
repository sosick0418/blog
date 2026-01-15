# 문제 해결 가이드 (Troubleshooting Guide)

자주 발생하는 문제와 해결 방법입니다.

## 빌드 오류

### npm run build 실패

**증상**: 빌드 명령어 실행 시 에러 발생

**해결**:
```bash
# 의존성 재설치
rm -rf node_modules
npm install

# 다시 빌드
npm run build
```

### 템플릿 렌더링 오류

**증상**: Nunjucks 템플릿 에러

**해결**:
1. 포스트의 frontmatter YAML 문법 확인
2. 따옴표 안의 특수문자 이스케이프 확인
3. `date` 필드가 올바른 형식인지 확인 (YYYY-MM-DD)

## LLM 콘텐츠 생성 문제

### "LLM Skipped: API not configured"

**원인**: GEMINI_API_KEY가 설정되지 않음

**해결**:
```bash
# .env 파일에 API 키 추가
echo "GEMINI_API_KEY=your-api-key" >> .env

# API 키 발급: https://aistudio.google.com/apikey
```

### "LLM generation failed"

**원인**: API 호출 실패 (할당량 초과, 네트워크 문제)

**해결**:
1. Google AI Studio에서 API 할당량 확인
2. 네트워크 연결 확인
3. `--no-llm` 플래그로 플레이스홀더 사용:
   ```bash
   npm run orchestrate -- --product-json '...' --no-llm
   ```

### 플레이스홀더 콘텐츠가 생성됨

**원인**: 정상 동작 (LLM 미설정 시 graceful fallback)

**해결**: GEMINI_API_KEY 설정 후 재실행

## Git 오류

### GIT_ADD_FAILED

**원인**: 파일 스테이징 실패

**해결**:
```bash
# Git 상태 확인
git status

# 수동으로 스테이징
git add src/posts/파일명.md
```

### GIT_COMMIT_FAILED

**원인**: 커밋 생성 실패

**해결**:
```bash
# 변경사항 확인
git diff --cached

# 수동 커밋
git commit -m "content: manual commit"
```

### GIT_PUSH_FAILED

**원인**: 원격 저장소 푸시 실패

**해결**:
```bash
# 원격 상태 확인
git remote -v

# 최신 변경사항 가져오기
git pull --rebase origin main

# 다시 푸시
git push origin main
```

### 인증 오류

**증상**: `fatal: Authentication failed`

**해결**:
```bash
# GitHub CLI로 인증
gh auth login

# 또는 SSH 키 설정
# https://docs.github.com/en/authentication/connecting-to-github-with-ssh
```

## n8n 문제

### n8n 접속 불가

**증상**: http://localhost:5678 접속 안 됨

**해결**:
```bash
# 컨테이너 상태 확인
docker compose ps

# 컨테이너 재시작
docker compose restart n8n

# 로그 확인
docker compose logs n8n
```

### Execute Command 노드 오류

**증상**: "Command execution failed"

**해결**:
1. n8n 로그에서 상세 에러 확인
2. 스크립트 경로 확인 (/app/scripts/...)
3. 환경 변수가 컨테이너에 전달되었는지 확인

### 워크플로우가 실행되지 않음

**증상**: 스케줄 트리거가 작동 안 함

**해결**:
1. 워크플로우가 "Active" 상태인지 확인
2. Schedule Trigger 노드가 enabled 인지 확인
3. 타임존 설정 확인 (Asia/Seoul)

## 배포 문제

### GitHub Actions 실패

**증상**: 배포 워크플로우 실패

**해결**:
1. GitHub 저장소 → Actions 탭에서 에러 확인
2. 빌드 로그 검토
3. 로컬에서 `npm run build` 성공하는지 확인

### 사이트가 업데이트 안 됨

**증상**: 푸시 후에도 사이트 변경 없음

**해결**:
```bash
# GitHub Actions 상태 확인
gh run list --limit 3

# 브라우저 캐시 삭제 또는 시크릿 모드로 확인
# Ctrl+Shift+R (강력 새로고침)
```

### 커스텀 도메인 문제

**증상**: 도메인 접속 안 됨

**해결**:
1. DNS 설정 확인 (A 레코드가 GitHub Pages IP를 가리키는지)
2. GitHub 저장소 Settings → Pages에서 도메인 설정 확인
3. DNS 전파 대기 (최대 48시간, 보통 10-30분)

## 에러 코드 참조

| 에러 코드 | 원인 | 해결 방법 |
|-----------|------|-----------|
| `INVALID_INPUT` | 잘못된 입력 파라미터 | --help로 사용법 확인 |
| `POST_GENERATION_FAILED` | 포스트 생성 실패 | 로그에서 상세 에러 확인 |
| `GIT_ADD_FAILED` | Git 스테이징 실패 | git status 확인 |
| `GIT_COMMIT_FAILED` | Git 커밋 실패 | 변경사항 확인 |
| `GIT_PUSH_FAILED` | Git 푸시 실패 | 인증 및 원격 상태 확인 |
| `FILE_READ_FAILED` | 파일 읽기 실패 | 파일 경로 확인 |

## 도움 받기

문제가 해결되지 않으면:

1. 로그 확인 (`--verbose` 플래그 사용)
2. GitHub Issues에 문의
3. 에러 메시지와 실행 환경 정보 포함

```bash
# 디버그 모드 실행
npm run orchestrate -- --product-json '...' --verbose --dry-run
```
