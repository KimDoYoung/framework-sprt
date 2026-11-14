# FLT-BZ-0003 직원이 인적사항을 등록하고 법규준수서약서(A06)를 결재받는다

> **한 줄 요약** — 직원이 #1369 임직원매매 사용순서의 첫 단계 [인적사항]을 열어 **적용시작일·연간추가 투자한도·보고주기(분기별/월별)**를 등록하고(`flt02_emp`), **자기매매 법규준수서약서**를 링크코드 A06 결재문서로 상신해 승인받는다(`flt04_oath`). 가족 동의서 파일도 이 창에서 올린다(`flt07_family_consent`). 서약서가 끝나야 계좌신고(0004)로 넘어간다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 직원(kalpa 사원 401) → 결재자(과장 301) |
| 언제 | 입사·대상자 지정 때, 해마다 서약 |
| 먼저 있어야 하는 것 | FLT-BZ-0002 기준(보고 시작일), **A06 문서분류 지정**(DCR-BZ-0004 — kalpa·회사 0 모두 비어 있었음), 공통코드 `FloorTrCheckCycle`(1 분기별 · 2 월별) |
| 다음 이벤트 | FLT-BZ-0004 계좌신고 |
| 실제 실행 | kalpa, 2026-11-14, API. ① 401 `PUT /flt/emp-settings`(2026-11-14, 연간추가 투자한도 30,000,000, 분기별) → `flt02_emp` +1(`202611149150133`), AS-IS 1 = 1. ② A06·A08·A09가 kalpa에서 문서분류 미지정 → 회사 관리자가 `PUT /dcr/links`로 A06 → `컴플라이언스/임직원 금융투자상품 매매/…법규준수 서약서`, A08 → `…/사전신고 및 준법감시인 승인`, A09 → `…/매매현황 보고` 지정. ③ `yunhee biz-appr A06 --ref <대상자> -u 401 --approver 301 --link-path /api/v1/flt/emp-settings/oath/appr-id --confirm` → 결재 `202611149150140` 상신 → 연결 → 301 승인 30, `GET /flt/emp-settings/oath` 상태 "완료", AS-IS 1 = 1. ④ 연간추가 투자한도 999,999,999,999 저장도 됨(원본 화면도 한도 검사 없음 — 회사 총투자한도 검사는 사전신고 때) → 되돌림 |
| 메뉴 | #1369 준법감시 > 10. 임직원매매 > 임직원매매 사용순서 → [인적사항] 창(`Flt02_Lookup_Emp`). kalpa 메뉴 없음. 화면 눈 확인 `대기(일괄)` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 | 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 직원 | #1369 | ① [인적사항] 클릭 | 인적사항 창(`GET /flt/emp-settings`, `…/oath`, 회사 기준 표시 `GET /flt/emps/info/setting`) |
| 2 | 〃 | 인적사항 창 | [행 추가] → 적용시작일·연간추가 투자한도·보고주기 → [저장] (`PUT /flt/emp-settings`) | "적용시작일자를 입력하세요"·"보고주기를 선택하세요" 검사 |
| 3 | 〃 | 〃 | [서약서 작성] → 결재문서 창(A06 분류) → 결재선 → [상신] → 연결(`PUT /flt/emp-settings/oath/appr-id`) | 서약서 결재 진행 |
| 4 | 결재자 | 결재문서 창 | [승인] | 서약서 완료 |
| 5 | 직원 | 인적사항 창 | 가족 동의서 [업로드] (`POST /flt/emp-settings/family-consents`) | 동의서 파일(이번엔 안 함) |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `flt02_emp` | 401 대상자(2026-11-14, 3천만, 분기별) | +1 (남겨 둠) |
| `flt04_oath` | 서약서 결재 연결 | +1 |
| `apr01_appr`·`apr04_appr_step` | 서약서 결재(완료) | +1 |
| `dcr30_link` | kalpa A06·A08·A09 문서분류 | 3건 갱신(남겨 둠 — 0006·0008용) |

## 업무 규칙 · 주의

- **새 고객사는 A06·A08·A09 문서분류를 지정하지 않으면 서약서·사전신고·정기보고를 올릴 수 없다.** 회사 0 기초에도 A06·A08은 비어 있어 [문서분류지정복사](DCR-BZ-0004)로도 채워지지 않는다(회사 28000은 A09만 지정).
- 연간추가 투자한도는 직원이 적는 값이고 서버·원본 화면 모두 상한 검사가 없다. 회사 총투자한도 초과 검사는 매수 사전신고(0006)에서 본다(재현 예정).
- `biz-appr`가 A06 상신·연결·승인을 한 번에 했다(본문은 기본 "(본문 없음)").

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: FLT-BZ-0003
needs: [FLT-BZ-0002, DCR-BZ-0004]
steps:
  - no: 1
    actor: { company: kalpa, user: "401", password: "1111" }
    api: PUT /api/v1/flt/emp-settings
    body: [ { empId: null, startDate: "2026-11-14", yearInvestLimit: 30000000, checkCycle: "1" } ]
    expect: { track: { flt02_emp: +1 } }
  - no: 2
    tool: yunhee biz-appr A06 --ref {empId} -u 401 -c kalpa --approver 301 --link-path /api/v1/flt/emp-settings/oath/appr-id --link-style body --link-body '{"apprId": {apprId}}' --confirm
    expect: { oath: { statusCode: "30" } }
```
</details>

<details>
<summary>근거</summary>

- AS-IS: `Flt00_Tab_Info`(#1369 E0·E1 → `Flt02_Lookup_Emp`), `Flt02_Lookup_Emp`(`Flt02_Emp.update` L54·`selectByPersonId` L25, `Flt04_Oath.updateApprId` L45·`selectByPersonId` L26, `Dcr30_Link.selectByLinkCode`(A06), `Flt07_FamilyConsent`), `Flt02_Lookup_Emp.update`(필수 검사만).
- TOBE: `FltEmpSettingController`(`/api/v1/flt/emp-settings`·`/oath`·`/oath/appr-id`·`/family-consents`), 프론트 `Flt02_Lookup_Emp.tsx` L108(`getDocClass('A06')`)·L220.
</details>
