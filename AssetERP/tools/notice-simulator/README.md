# 알림 발송 시뮬레이터

AS-IS가 부르는 외부 알림 서비스 3종을 흉내 내는 개발용 서버(AA01). 실제로는 아무 데도 보내지 않고 **호출 계약(URL·헤더·본문·응답)과 호출 기록**만 맞춘다. 의존성 없음(Node 내장 모듈). RD 시뮬레이터(`tools/rd-simulator`)와 같은 방식이다.

```bash
tools/run-notice-server.sh start        # http://127.0.0.1:5161 (talk·sms), smtp :2525
tools/run-notice-server.sh calls [talk|sms|mail]
tools/run-notice-server.sh reset
NOTICE_SIM_HOST=127.0.0.1,172.18.0.1 tools/run-notice-server.sh start   # ERP가 Docker 안이면 게이트웨이 주소도 연다
```

| env | 기본 | 뜻 |
|:---|:---|:---|
| `NOTICE_SIM_HOST` | 127.0.0.1 | 접속을 받을 주소(쉼표로 여러 개). Tomcat이 Docker(`docker_default`)면 `127.0.0.1,172.18.0.1` |
| `NOTICE_SIM_PORT` | 5161 | talk·sms HTTP 포트 |
| `NOTICE_SIM_SMTP_PORT` | 2525 | 메일(SMTP) 포트 |
| `NOTICE_SIM_FAIL` | 없음 | 쉼표 목록 `talk,sms,mail` — 그 종류는 실패로 답한다(오류 경로 시험) |
| `NOTICE_SIM_TALK_KEY` | sim-talk-key | 앱알림 `x-api-key`로 기대하는 값 (다르면 기록의 `problems`) |

## 계약 (AS-IS 기준)
| 종류 | 호출 | 요청 | 응답 | AS-IS |
|:---|:---|:---|:---|:---|
| 앱알림 | `POST /talk/api/sendmsg` | 헤더 `x-api-key`, JSON `{email,title,body,fromEmail}` | 성공 200 `{ok:true,roomId}` · 실패 `{ok:false,error}` | `utils.talk.SendTalkAPI` (`https://talk.k-fs.co.kr:50443/talk/api/sendmsg`) |
| SMS | `POST /index.php/api_v2/sms_change_word` | JSON `{title,message,sender,username,receiver:[{name,mobile,note1}],key,type}` (번호는 하이픈 제거) | 200 `{status:"0",msg}` — `status`가 `"0"`이 아니면 실패 | `utils.sms.SendSMSAPI` (DirectSend `https://directsend.co.kr/index.php/api_v2/sms_change_word`) |
| 메일 | SMTP(AUTH LOGIN/PLAIN 아무 값이나 통과) | `From: Asset-ERP <주소>`, `To`, `Subject`(utf-8), `text/html; charset=utf-8` 본문 | `250 OK queued` | `utils.mail.SendMailMaster` (JavaMail) |

- 점검: `GET /__calls[?kind=talk|sms|mail]` — `kind·to·title·body·from·problems·result(ok|rejected|fail)`, `calls.jsonl`에도 남는다. `GET /__reset`, `GET /__health`.
- `problems`가 있으면 AS-IS 계약에서 어긋난 호출이다(빠진 필드, 하이픈이 남은 번호, 키 불일치 등).

## 한계
실제 도착·지연·스팸 분류·발송 잔액은 볼 수 없다. 문구와 수신자, 호출 조건만 확인한다.
