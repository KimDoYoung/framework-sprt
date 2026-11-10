# 외부 연동 시뮬레이터 (AI 점검의견 · 새 메일 시스템)

AS-IS가 부르는 외부 서버 2종을 흉내 내는 개발용 서버(2026-11-10). 실제로는 AI도 메일도 쓰지 않고 **호출 계약(URL·헤더·본문·응답)과 호출 기록**만 맞춘다. 의존성 없음(Node 내장 모듈). 알림 시뮬레이터(`tools/notice-simulator`)와 같은 방식이다.

```bash
EXT_SIM_HOST=0.0.0.0 tools/run-ext-server.sh start    # http://<호스트>:5171 — Docker 안 Tomcat과 브라우저(메일 쓰기창)가 모두 접속하므로 0.0.0.0
tools/run-ext-server.sh calls [bot|mail-write|mail-send]
tools/run-ext-server.sh reset
```

| env | 기본 | 뜻 |
|:---|:---|:---|
| `EXT_SIM_HOST` | 127.0.0.1 | 접속을 받을 주소(쉼표로 여러 개) |
| `EXT_SIM_PORT` | 5171 | HTTP 포트 |
| `EXT_SIM_FAIL` | 없음 | 쉼표 목록 `bot,mail` — 그 종류는 실패로 답한다(오류 경로 시험) |
| `EXT_SIM_MAIL_TOKEN` | sim-assetmail-token | assetMail `X-Service-Token`으로 기대하는 값 (다르면 401) |
| `EXT_SIM_BOT_DELAY_MS` | 800 | AI 응답을 늦추는 시간("작성중" 가림 확인용) |

- **주소는 서버 프로파일**에 둔다: `application-omen/t3600/test.properties`의 `asseterp.bot.url`·`asseterp.assetmail.base-url`. 공통 `application.properties`는 localhost 기본값과 `asseterp.assetmail.service-token`(환경변수 `ASSETMAIL_SERVICE_TOKEN`, 없으면 시뮬레이터 값).
- **방화벽**: ufw를 쓰면 한 번 연다 `sudo ufw allow from 172.16.0.0/12 to any port 5171 proto tcp` (알림 시뮬레이터 README와 같은 이유).

## 계약 (AS-IS 기준)
| 종류 | 호출 | 요청 | 응답 | AS-IS |
|:---|:---|:---|:---|:---|
| AI 점검의견 | `POST /api/erp/completion` | 헤더 `Cache-Control: no-cache`, JSON `{user_prompt, task_type}` (`task_type`=책무구조이행점검) | 200 `{success, content, error}` — `success`가 false면 `error` | `utils.bot.BotService` (`https://bot.k-fs.co.kr:51443/api/erp/completion`) ← `Tdm52_ChckManl.getBotCheckCmnt` |
| 새 메일 쓰기창 | `POST /api/erp/mail-write` | 헤더 `X-Service-Token`, JSON `{refKey, personId, header, content, fileKey, fileList[], sso_token}` | 200 `{open_url}` · 실패 `{message}` | `utils.mail.AssetMailSend.openMailWrite` (`ASSETMAIL_BASE` 또는 `https://dev.mail.k-fs.co.kr`) ← `SendMailSMTP.assetMailSend` |
| 메일 쓰기창 | `GET /mail/write/{id}` | 브라우저 새 창(1000×760) | 받는 사람·제목·내용·첨부 ID를 보여 주는 흉내 화면. [보내기]는 `mail-send` 기록만 | assetMail 웹 화면 |

- AI 답은 고정 문장 틀이다(점검결과에 "미흡·부적정·불충분·개선"이 있으면 조치 문장, 아니면 적정 문장). 실제 AI가 아니다.
- `open_url`은 ERP가 부른 주소(Host 헤더)와 같은 호스트로 만든다 — 원본이 주소가 다르면 거절하기 때문이다(TOBE는 https 대신 같은 scheme을 검사).
- `sso_token`은 ERP가 `tmp_token`에 넣은 값이다. 시뮬레이터는 DB를 보지 않으므로 앞 8글자만 기록한다.
- 점검: `GET /__calls[?kind=bot|mail-write|mail-send]` (`problems`가 있으면 계약에서 어긋난 호출), `calls.jsonl`, `GET /__reset`, `GET /__health`.

## 한계
AI 글의 품질, 실제 메일 도착, assetMail의 SSO 토큰 확인(tmp_token 조회)은 볼 수 없다. 호출 조건·본문·화면 흐름만 확인한다.
