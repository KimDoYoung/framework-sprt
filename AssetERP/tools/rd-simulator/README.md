# RD 시뮬레이터

AS-IS가 부르는 Crownix(RD) Reporting Server를 흉내 내는 개발용 서버. 실제 `.mrd`는 없으므로 **레이아웃은 재현하지 않고**, 호출 계약(URL·파라미터·저장·응답)과 호출 기록만 맞춘다. 의존성 없음(Node 내장 모듈).

```bash
node tools/rd-simulator/server.js            # http://0.0.0.0:5151, 가상 루트 tools/rd-simulator/data
RD_SIM_PORT=5252 RD_SIM_ROOT=/tmp/rd node tools/rd-simulator/server.js
```

| env | 기본 | 뜻 |
|:---|:---|:---|
| `RD_SIM_HOST` | 127.0.0.1 | 접속을 받을 주소. 기본은 이 PC에서만(외부 접속 불가), 다른 PC에 열려면 `0.0.0.0` |
| `RD_SIM_PORT` | 5151 | AS-IS 운영 포트. 개발 5252(DEV-REALDB)·5253(DEV-DEVDB) |
| `RD_SIM_ROOT` | `./data` | 가상 파일 루트. `fileName`의 `/../../..` 접두를 걷어내고 이 아래에 저장(밖으로 못 나감) |
| `RD_SIM_FAIL` | 없음 | 정규식. 맞는 `mrd`는 저장·내려받기를 실패시킨다(오류 경로 시험) |
| `RD_SIM_HTTPS_KEY`/`_CERT` | 없음 | 있으면 https (AS-IS는 `https://…:5151`) |

## 계약 (AS-IS `RDUtil.java` 기준)
| 호출 | page | 응답 | 사용처 |
|:---|:---|:---|:---:|
| 미리보기(iframe) | `CommonViewer.html` → `/ReportingServer/html5/RDhtml/` | 호출 정보를 표로 보여 주는 HTML | 39 |
| 내려받기(숨은 form POST) | `CommonInvokerDownload.jsp` → `/ReportingServer/jsp/` | `exportType`에 맞는 파일(xlsx·pdf·csv), `Content-Disposition: attachment` | 29 |
| 서버 저장(결재 첨부 등) | `CommonInvoker.jsp` | `fileName`(경로)에 파일을 쓰고 본문 `success` — GWT는 `success`·`1|` 포함 또는 20자 미만이면 성공으로 본다 | 11 |

- 쿼리: `dns`, `mrd`, `options`, `dbName`, `fileName`, `exportType` + `rv=key[value]key[value]`(값이 모두 이어 붙어 한 파라미터로 온다).
- `dbName`은 `post_real`·`post_dev-devdb`·`post_dev-realdb`만 정상으로 본다(아니면 기록의 `problems`).
- 한글은 PDF(Helvetica)에서 `?`로 나온다. xlsx·csv·HTML은 한글 그대로.

## 점검용 API
- `GET /__calls[?mrd=이름]` — 받은 호출 기록(`page·mrd·dbName·fileName·rv·params·result·savedTo·problems`), `calls.jsonl`에도 남는다.
- `GET /__reset`, `GET /__health`.
- `expected-calls.json` — AS-IS 사용처 65개 파일의 page 종류(viewer·download·save)와 mrd 이름. TOBE 호출이 이 목록과 맞는지 `/__calls`로 대조한다.

## 한계 (L3 아님)
RD는 `rdGroupId`로 ERP DB의 임시 데이터를 직접 읽어 그린다. 시뮬레이터는 DB를 읽지 않으므로 보고서 **내용**은 없다.
