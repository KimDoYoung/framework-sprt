# 알림 발송 시뮬레이터

AS-IS가 부르는 외부 알림 서비스 3종을 흉내 내는 개발용 서버(AA01). 실제로는 아무 데도 보내지 않고 **호출 계약(URL·헤더·본문·응답)과 호출 기록**만 맞춘다. 의존성 없음(Node 내장 모듈). RD 시뮬레이터(`tools/rd-simulator`)와 같은 방식이다.

```bash
tools/run-notice-server.sh start        # http://127.0.0.1:5161 (talk·sms), smtp :2525
tools/run-notice-server.sh calls [talk|sms|mail]
tools/run-notice-server.sh reset
NOTICE_SIM_HOST=0.0.0.0 tools/run-notice-server.sh start   # 서버 프로파일의 주소(집 192.168.0.130 · 사무실 172.20.100.114)로 Docker 안 Tomcat이 접속하려면 0.0.0.0
```

| env | 기본 | 뜻 |
|:---|:---|:---|
| `NOTICE_SIM_HOST` | 127.0.0.1 | 접속을 받을 주소(쉼표로 여러 개). ERP Tomcat은 Docker 안이라 서버 프로파일의 주소로 접속하므로 `0.0.0.0`(RD 시뮬레이터와 같다) |
| `NOTICE_SIM_PORT` | 5161 | talk·sms HTTP 포트 |
| `NOTICE_SIM_SMTP_PORT` | 2525 | 메일(SMTP) 포트 |
| `NOTICE_SIM_FAIL` | 없음 | 쉼표 목록 `talk,sms,mail` — 그 종류는 실패로 답한다(오류 경로 시험) |
| `NOTICE_SIM_TALK_KEY` | sim-talk-key | 앱알림 `x-api-key`로 기대하는 값 (다르면 기록의 `problems`) |

- **주소는 서버 프로파일**에 둔다(RD 주소 `asseterp.rd.url`과 같은 방식): `application-omen.properties`(집, 192.168.0.130)·`application-t3600.properties`·`application-test.properties`(사무실, 172.20.100.114)의 `asseterp.notice.talk-url`·`sms-url`·`mail-host`. 공통 `application.properties`는 `mode=sim`과 기본값(localhost)만.

- **방화벽**: 호스트가 ufw를 쓰면 Docker 안 Tomcat이 호스트 포트(5161·2525)에 닿지 않는다(패킷이 버려져 접속이 멈춘다). 한 번 열어 둔다: `sudo ufw allow from 172.16.0.0/12 to any port 5161,2525 proto tcp`. 확인: `docker exec omen-tomcat bash -c 'timeout 3 bash -c "echo > /dev/tcp/192.168.0.130/5161"; echo rc=$?'` → `rc=0`이어야 한다(`124`면 막힌 것).

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
