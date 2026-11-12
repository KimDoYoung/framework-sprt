# APR-BZ-0010 구)법인서류·인감날인을 신청하고 처리한다

> **한 줄 요약** — [0008](APR-BZ-0008-법인서류날인.md)의 **옛 방식**이다(2026-08에 새 화면 #1330이 생기기 전까지 쓰던 길이라 메뉴에 "구)"가 붙어 있다). 직원이 #1510에서 인감증명서·법인등기부등본 **신청 매수**와 제공처·목적을 적고(필요하면 인감날인 줄을 붙이고 관련 결재문서를 연결), 경영관리팀이 #1507에서 "신청내역 가져오기"로 **접수(등록일)**하고 서류 **발급·사용 매수**를 관리하며, #1508에서 **날인일자**를 적고, #1509에서 **날인본 업로드를 확인**한다. 새 화면과 달리 신청 한 건에 **관련 결재문서를 여러 개 연결**하고 **인감날인 여러 줄**(`apr19_relate_stamp`)을 붙인다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 직원(`kalpa/401/Kalpa1234!`) → 경영관리팀(과장 `kalpa/301`) |
| 언제 | 수시(옛 방식이라 새 화면으로 옮기는 중 — 지금은 새 화면 #1330 권장) |
| 먼저 있어야 하는 것 | [APR-BZ-0007](APR-BZ-0007-사용인감대표명의.md)(인감), 연결할 결재문서([0001](APR-BZ-0001-기안상신.md)·[0002](APR-BZ-0002-승인반려.md)) |
| 다음 이벤트 | 날인본 업로드 확인 뒤 끝. 새 방식은 [APR-BZ-0008](APR-BZ-0008-법인서류날인.md) |
| 실제 실행 | kalpa, 2026-11-12, API(T3600 DB). 직원 401이 신청 저장 → 301이 접수·발급매수·관련 결재문서 연결·인감날인 줄 등록·날인일자·확인 → 401이 같은 API 호출 |
| 메뉴 | #1510 신청 > 90. 기타신청 > 구)법인서류 및 날인 신청 → #1507 경영관리 > 91. 법인서류 > 구)법인서류 매수관리 → #1508 구)인감날인대장 → #1509 구)인감날인본 업로드확인. **kalpa에는 네 메뉴가 모두 없다** — API로만 실행, 화면 눈 확인 `대기` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 직원 | **#1510** | 신청일자(올해 1/1~오늘)·검색어(제공처·목적)·`미처리만 조회`(기본 ✓) → [조회] | **내가 낸** 신청 목록(신청일자·제공처·목적·인감증명서/등기부등본 신청매수·요청자·비고·연관상신 건수) |
| 2 | 〃 | 〃 | [등록] → 줄에 신청일자·제공처·목적·요청자·비고·**인감증명서 신청매수·법인등기부등본 신청매수** 입력 → [저장] | 신청이 저장된다(새 줄의 신청사원 = 로그인 사원). 접수된 줄이 변경에 섞이면 "접수된 항목이 포함되어있습니다."(화면) |
| 3 | 〃 | 〃 | 줄 선택 → 오른쪽 **인감날인** 표 [등록] → 인감(조회창)·날인 매수·인감반출 ✓ → [저장] | 인감날인 줄이 붙는다(한 신청에 여러 줄) |
| 4 | 〃 | 〃 | 줄의 **연관상신** 셀 → 연관상신 창 [불러오기] → 결재문서 고르기 | 관련 결재문서(제목·상신일·시행일·상신자·상태)가 목록에 붙는다. 이미 다른 신청에 붙은 문서면 "이미 연결된 문서입니다."(`하나의 상신문서는 여러개의 신청내역을 가질 수 없다`) |
| 5 | 〃 | 〃 | [등록(복사)] | 고른 줄의 제공처·목적·비고·요청자·신청매수를 복사한 새 신청(신청일 = 오늘) |
| 6 | 〃 | 〃 | 처리 전 줄 [삭제] | 줄이 지워진다. 접수·날인된 줄이면 "처리된 항목은 삭제 불가능합니다."/"날인일자가 등록된 항목은 수정이 불가능합니다."(화면) |
| 7 | 과장 | **#1507** | 상단 "※ 법인서류 신청내역이 존재합니다. **신청내역 가져오기**" → 고르기 → [확인] | 선택한 신청에 **등록일(오늘)**이 찍혀 매수관리 목록에 들어온다 |
| 8 | 〃 | 〃 | [등록] → 등록일·**발급매수**(인감증명서·등기부등본) 입력 → [저장], 그리드에서 사용매수 고치고 [저장] | 하단 요약표 `법인인감증명서 / 법인등기부등본`의 **발급·사용·잔여** 합계 |
| 9 | 〃 | 〃 | [삭제] | 신청에서 온 줄(신청일 있음)은 등록일만 비우고 신청내역으로 되돌리며, 직접 등록한 줄은 지운다 |
| 10 | 〃 | **#1508** | 조회기간·인감·`반출만`·검색어 → [조회] → 줄 [수정]으로 **날인일자** → [출력/다운로드] | 인감날인 줄이 신청일·신청자·인감·매수·반출·제공처·목적·연관상신 건수·날인일자와 함께 나온다. 인감날인 대장 번호(`stampSeq`)는 대외문서 결재 완료 때 붙는다 |
| 11 | 〃 | **#1509** | 신청일자·인감·`날인본 미첨부 내역만 조회` → [조회] → 줄 선택 → [확인]/[확인취소] | 확인일자·확인자(김과장). "이미 확인완료된 건이 포함되어 있습니다"·"확인처리되지 않은 건이 포함되어 있습니다"·"확인자가 본인인 경우에만 확인취소가 가능합니다"(화면 검사) |

## DB에 남는 것

| 테이블 | 무엇 | 단계 |
|:---|:---|:---|
| `apr17_corp_doc` | 신청·매수 한 줄: 신청사원·신청일·제공처·목적·요청자·비고, **신청매수**(`stamp_cert_call_cnt`·`corp_reg_call_cnt`), 접수 때 `reg_date`, 관리 때 **발급·사용매수**(`…_issue_cnt`·`…_use_cnt`) | 2 +1, 7 `reg_date`, 8 매수·+직접 줄 |
| `apr19_relate_stamp` | 인감날인 줄(인감·매수·반출·날인일자 `stamp_date`·확인자·확인일) | 3 +줄 수, 10 `stamp_date`, 11 `confirmer_id`·`confirm_date` |
| `apr18_relate_corp_doc` | 신청에 연결한 결재문서 | 4 +줄 수 |
| `sys99_print` | 출력(#1507·#1508 [출력/다운로드]) | 이번에 안 함 |

## 결과를 볼 수 있는 화면

- #1510(내 신청), #1507(`GET /api/v1/apr/corp-docs/registered`·`/totals` — 매수 요약 `발급·사용·잔여`), #1508(`GET /api/v1/apr/relate-stamps`, 부서용 `/by-org`), #1509(`GET /api/v1/apr/relate-stamps/stamp-check`), 연관상신 창(`GET /api/v1/apr/corp-docs/{id}/relates`).

## 업무 규칙 · 주의

- **실행 결과(2026-11-12)**: 직원 401이 신청 1건(인감증명서 2매·등기부등본 1매)을 저장했다 → 301이 신청내역 가져오기로 등록일을 찍고, 발급 5·사용 2·등기부 발급 3·사용 1로 고치고, 직접 등록 줄(인감증명서 발급 10)을 더하니 요약이 `법인인감증명서 발급 15 / 사용 2 / 잔여 13`이었다. 인감날인 줄 2개(3매·반출 1매)를 붙이고 날인일자 2026-11-13을 적고 [확인]하니 확인자 `김과장`·확인일 오늘. 결재문서 연결은 같은 문서를 다른 신청에 또 붙이면 409 "이미 연결된 문서입니다."로 막혔다. [삭제]는 직접 등록 줄(신청일 없음)은 지우고 신청에서 온 줄은 등록일만 비우는 것을 실행으로 확인했다. [등록(복사)]는 코드로만 확인했다.
- **서버가 모른다고 한 화면 검사 모음**: 접수된 줄·날인일자가 있는 줄의 수정·삭제 금지(`update` L272-310, `deleteChk` L312-347), 확인자 본인만 확인취소·이미 확인된 건 재확인 금지(`confirmChk` L204-266), 내 신청만 수정(저장은 `callEmpId`를 안 봄)이 모두 **화면에만 있다**. 서버는 회사 ID로만 거른다 — 아래 의심.
- **회사 데이터와 가져온 문서**: 연결 대상 결재문서가 같은 회사의 것인지·내가 볼 수 있는지 서버가 보지 않는다(`insertRelate`, 아래 의심 1).
- **신청을 지워도 따라 붙은 줄은 남는다**: 신청(`apr17`)을 지워도 인감날인 줄(`apr19`)·연결 결재문서(`apr18`)가 그대로 남는다(원본 `Apr17_CorpDoc.delete`가 `apr17`만 지움).
- `GET /corp-docs`(신청내역 가져오기 창)는 아직 접수하지 않은 신청을 준다(신청 두 건 중 매수·제공처를 채운 한 건만 나왔다 — 거르는 조건은 확인 못 함). 매수관리 목록(`/registered`)은 등록일 구간, `/applications`는 로그인 사원의 신청(`procResult` = 미처리만).
- 인감날인 대장 번호 `stampSeq`·`apprId`(연관 결재문서 번호)는 **대외문서 + 인감 + 결재 완료**일 때만 붙는다(0008과 같음). 이번 신청들은 빈칸이다. `relateStampId`는 화면에서 행 번호(1, 2)로 나오고 실제 ID는 `realRelateStampId`다(응답 값 — 화면 값 일치 확인 필요).
- 안 한 것: 화면 눈 확인, [출력/다운로드](RD) 두 곳, 날인본 첨부(`stampFileYn` — 결재문서 날인본 파일 필요), 부서용 #1484 같은 `by-org`, 연결 결재문서 열람(`열람권한이 없습니다` 화면 안내), 구)와 새 방식 사이 자료 이전.

### 의심 (보고용)

1. 연결할 결재문서의 존재·회사·내 문서 여부를 서버가 안 본다 — 없는 ID `999`와 **다른 회사의 결재문서**(`202512169211040`)가 연결되고, 연관상신 목록에 그 회사 문서의 제목·상신자(`2025년도 상반기 인사평가 수행결과 보고`·타사 직원)가 그대로 나온다. 직원 401이 301의 신청에 자기 문서를 붙이고 연결 줄도 지웠다.
2. 접수된(`reg_date`)·날인일자가 있는 신청의 수정·삭제 금지가 화면에만 있어 서버는 통과시킨다 — 접수 뒤 직원 401이 신청매수·제공처를 고쳤고(접수한 줄), 날인일자가 적힌 신청을 직원이 지웠으며 인감날인·연결 줄이 고아로 남았다. 남의 신청도 수정됐다(301이 401의 제공처·매수 수정).
3. 메뉴 권한 없는 직원 401이 #1507~#1509 읽기·쓰기 API를 모두 불렀다 — 매수 읽기, 인감날인 날인일자 수정(`PUT /relate-stamps/stamp-date`), 과장의 확인을 취소(`PUT /relate-stamps/confirm check:false`)하고 이미 확인된 줄을 자기 확인으로 다시 확인할 수 있다(확인자가 바뀐다는 점은 301이 재확인으로 되돌렸다).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: APR-BZ-0010
needs: [APR-BZ-0007, EMP-BZ-0001]
steps:
  - no: 2
    actor: { company: kalpa, user: "401", password: "Kalpa1234!" }
    api: PUT /api/v1/apr/corp-docs/applications
    body: [{ corpDocId: 0, callDate: "2026-11-12", stampCertCallCnt: 2, corpRegCallCnt: 1, provideCo: 금융위원회, purpose: APR0010 구법인서류 신청, requester: 김사원, note: 시험 }]
    expect: { table: apr17_corp_doc, delta: +1 }
  - no: 7~8
    actor: { user: "301" }
    api:
      - GET /api/v1/apr/corp-docs                      # 신청내역 가져오기 창
      - POST /api/v1/apr/corp-docs/reg-date            # [corpDocId]
      - PUT /api/v1/apr/corp-docs/registered           # 발급·사용 매수 + { corpDocId: 0, regDate, stampCertIssueCnt: 10 } 직접 줄
    expect: { api: GET /api/v1/apr/corp-docs/totals, fields: { typeName: 법인인감증명서, issueSum: 15, useSum: 2, remain: 13 } }
  - no: 4
    api:
      - POST /api/v1/apr/corp-docs/{corpDocId}/relates/{apprId}   # 같은 apprId 다시 → 409 "이미 연결된 문서입니다."
      - GET /api/v1/apr/corp-docs/{corpDocId}/relates
  - no: 3
    api: PUT /api/v1/apr/corp-docs/stamps              # [{ relateStampId: 0, corpDocId, stampId, stampCnt: 3, outYn: false }, { …, stampCnt: 1, outYn: true }]
    expect: { table: apr19_relate_stamp, delta: +2 }
  - no: 10~11
    api:
      - PUT /api/v1/apr/relate-stamps/stamp-date       # { relateStampId, stampDate: "2026-11-13" }
      - PUT /api/v1/apr/relate-stamps/confirm          # { ids, check: true }
      - GET /api/v1/apr/relate-stamps/stamp-check?startDate=2026-01-01&closeDate=2026-12-31&notStampFileYn=false
    expect: { fields: { confirmerName: 김과장 } }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS 화면: `Apr17_Tab_CorpDocApp`(#1510, E0~E10, `update` L272-310, `deleteChk` L312-347, `copyInsertRow` L349-375) + `Apr19_Grid_RelateStamp`(인감날인 표, E1~E5) + `Apr18_Lookup_RelateAppr`(연관상신 창, E1~E5, `insert` L166-194), `Apr17_Tab_CorpDoc`(#1507, E0~E8, `check` L276-294, `delete` L335-397) + `Apr17_Lookup_CorpDoc`(신청내역 가져오기 창, `update` L114-163), `Apr19_Tab_StampList`(#1508)·`Apr19_Tab_StampFileCheck`(#1509, `confirmChk` L204-266).
- AS-IS 서버: `apr.Apr17_CorpDoc`(`selectByAppDate` L41, `selectByCompanyId` L33, `selectByCorpRegDate` L54, `selectByRegDate` L64, `regDateUpdate` L74, `regDelete` L87, `copyUpdate` L95, `update` L117, `delete` L122), `apr.Apr18_RelateCorpDoc`(`modelUpdate` L34 — `checkByApprId`로 중복 연결 검사, `delete` L67), `apr.Apr19_RelateStamp`(`selectByCorpDocId` L24, `update` L63, `delete` L68), `sys.Sys99_Print.insertRdCorpDoc` L3087.
- TOBE: `AprCorpDocController` `/api/v1/apr/corp-docs`(`GET`·`POST /reg-date`·`GET·POST·DELETE …/relates`), `AprCorpDocService.insertRelate` L45-49(결재문서 존재·회사 검사 없음), `AprCorpDocManageController`(`/registered`·`/totals`·`/applications`·`/applications/copy`·`/stamps`·`/{corpDocId}/stamps`), `AprCorpDocManageService`(`saveApplications` L92-105 — 회사 ID로만 수정, `deleteApplications` L120-123), `AprRelateStampController` `/api/v1/apr/relate-stamps`(`GET`·`/by-org`·`/stamp-check`·`PUT /stamp-date`·`/confirm`·`/rd-print`), `AprRelateStampService.confirm` L86-93(확인자 본인 검사 없음).
- TOBE 상태(2026-11-12): 실행(API). 화면 눈 확인 `대기`.
</details>
