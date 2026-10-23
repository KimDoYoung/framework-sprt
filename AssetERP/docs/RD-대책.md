# RD(Report Designer) 대책

작성: 2026-10-22 (논의 중단 시점 정리). 상태: **TOBE 방식 미결정**.

## 1. RD란 (AS-IS 소스 근거)
- 상용 리포팅 제품 **Crownix(M2Soft) Reporting Server**로 추정(경로 `/data1/asseterp/acs/crownix/ReportingServer/report/`). Tomcat 위의 `ReportingServer` 웹앱. 템플릿은 `.mrd`.
- **DB는 RD 서버가 직접 접속**한다. 호출 시 `dbName`(`post_real`, `post_dev-devdb`, `post_dev-realdb`)으로 RD 서버의 접속 설정을 고른다. ERP 세션·권한을 거치지 않는다.
- **PDF 생성 가능.** 호출 방식 2가지(`IDMS-IC/application/src/main/java/myApp/client/service/RDUtil.java`):
  1. `getHtml()` — iframe으로 RD HTML5 뷰어(`/ReportingServer/html5/RDhtml/…`) 표시. 미리보기·인쇄.
  2. `download()` — 숨은 form POST → RD 서버가 `fileName` 경로에 파일 저장(PDF). 결재 첨부(K03 상신)가 이 방식. 저장 경로 앞에 `/../../../../../..` 임시 조치가 있다.
- GWT는 `.mrd` 이름(`page`/`fileName`)과 파라미터(쿼리스트링, `rv[key[value]]`)만 넘긴다. **리포트 SQL·레이아웃은 `.mrd` 안에 있다.**
- 사용 규모: `RDUtil`/`RDViewer`를 쓰는 파일 66개(회계 Act, 전자결재 Apr, 자산 Ast 등). 환경별 모드 REAL/LOCAL-REALDB/LOCAL-DEVDB/DEV-REALDB/DEV-DEVDB, 포트 5151/5252/5253.

## 2. TOBE 쟁점
- `.mrd` 원본이 소스에 없다(서버 밖). SQL·레이아웃을 읽을 수 없다. K03/K04는 RD 모양을 재현하지 않고 같은 데이터를 표/한 시트로 보여 주는 방식으로 우회했다.
- RD는 ERP 세션을 모른다. 권한 검증·감사가 ERP 밖에 있다.
- 상용 라이선스, 내부/외부 DNS 분리, 환경별 포트 운영 부담(코드 주석에 언급).
- `OMS/docs/scope.md`: `Emp00_RD_OrgPerson`/`Emp00_RDR_OrgPerson` 보류, "RD 리포트 대체"는 결정 필요한 공통 이슈.

## 3. 선택지
| 방식 | 장점 | 단점 |
|---|---|---|
| A. RD 유지 (React에서 iframe/링크 호출) | 66개와 `.mrd` 그대로 재사용, 변환 비용 최저 | 상용 제품에 계속 묶임, `.mrd`가 소스 밖 |
| B. Spring Boot에서 직접 생성 (JasperReports/OpenPDF/POI) | 자체 통제, 세션·권한 일원화 | 66개 레이아웃 재작성 |
| C. 화면 표 + 엑셀/CSV로 단순화 | 가장 빠름 | 결재 첨부 양식 PDF 등 공식 서식 대체 불가 |

잠정 의견: **A를 먼저 쓰고 B로 점진 전환.** 단, `.mrd` 확보 여부를 먼저 확인해야 한다.

## 4. 다음에 할 일 (미착수)
1. `.mrd` 파일을 구할 수 있는지(서버 `/data1/asseterp/acs/crownix/ReportingServer/report/`) 운영팀에 확인.
2. 66개 사용처를 도메인별·호출방식별(미리보기 vs PDF 저장)로 분류.
3. A로 갈 경우: TOBE에서 호출 파라미터(`rv`, `dbName`, `fileName`) 재현 방식과 인증(토큰/URL 서명) 설계.
4. 결정 후 `OMS/docs/scope.md`의 RD 이슈와 K03(상신)·`Emp00_RD*` 보류 항목에 반영.

## 5. 시뮬레이터 (2026-10-23)
- `tools/rd-simulator/` (Node, 의존성 없음)가 RD 호출 계약(뷰어·내려받기·서버 저장)과 호출 기록을 흉내 낸다. 사용법·계약은 그 폴더 `README.md`.
- AS-IS `properties`에는 RD 설정이 없다. URL·`dbName`·포트(5151/5252/5253)는 `RDUtil.getPageName()`에 하드코딩 → TOBE는 설정으로 뺀다.
- 사용처 65개 파일: 미리보기 39 · 내려받기 26 · 서버 저장 11(`expected-calls.json`). 보고서 내용은 `.mrd`·ERP 임시 테이블(`rdGroupId`)이 필요해 시뮬레이터가 만들지 않는다(L3).
- **설정·주소 발급 구현 (2026-10-23)**: `application.properties`의 `asseterp.rd.*`(url·db-name·dns·save-dir·local-dir) → `RdProperties` → `POST /api/v1/rd/urls`(`RdService`, 단위 테스트 4건). 요청 `{kind: viewer|download|save, mrd, options, exportType, fileName, rv}` → 응답 `{url, method}`. AS-IS `RDUtil.getPageName()`와 같은 주소 규칙이고, `rv`의 `companyId`·`personId`는 서버가 로그인 값으로 덮어쓴다(위조 방지). save의 `fileName`은 상대 이름만 받아 서버가 `/../../../../../..` + `save-dir`을 붙인다.
- 시뮬레이터와 맞추기: `tools/run-rd-server.sh start`를 `RD_SIM_ROOT=${asseterp.base.dir}`로 실행하면 서버 저장 파일이 `${asseterp.base.dir}/rd/`(= `local-dir`)에 생긴다. 운영은 RD 서버가 쓰는 `save-dir`과 ERP가 읽는 `local-dir`을 같은 디스크로 맞춘다. API → 시뮬레이터 저장 end-to-end 확인함(kfstest, `companyId` 위조값 1이 28000으로 덮임).
- 결정 남음: ① URL 서명·토큰 — RD 서버가 검증을 지원하는지 운영 확인 필요(지원하지 않으면 지금의 발급 API가 최선) ② 내부/외부 DNS 분기(AS-IS는 접속 IP `172.20.100`으로 고름) ③ 프런트 `RdViewer`/`useRdDownload` 부품(React에서 위 API → iframe/form) — RD를 부르는 첫 화면 ID에서 만든다.
