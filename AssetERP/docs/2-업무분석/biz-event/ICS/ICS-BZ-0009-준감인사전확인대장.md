# ICS-BZ-0009 준법감시인이 사전확인(심사필)을 승인하고 대장을 관리한다

> **한 줄 요약** — 광고물·보도자료처럼 **외부에 내기 전에 준법감시인의 확인(심사필)을 받아야 하는 건**을 직원이 결재문서 창에서 **사전확인 신청**(대장분류·내용·제공처·광고 정보)으로 올린다. 준법감시인은 #1425 준감인 사전확인대장에서 건을 골라 [승인]하면 **심사필번호(`연도-분류코드+순번`, 예 `2026-AD001`)**가 붙고, 의견을 남기며, [취소]하면 번호가 회수된다(다른 신청이 "과거 심사필번호"로 쓴 번호는 취소 불가). #1499 심사필 확인대장은 같은 자료를 **문서 열람 권한 기준**으로 본다. 대장분류(광고물 여부 포함)는 [대장분류설정]에서 회사가 정한다. 회사 설정 `dcrPreconfirmSkipYn`이 켜져 있으면 [신청]이 곧바로 80(PASS)이 되고 번호가 부여된다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 신청 직원(301), 준법감시인 박부장(201) |
| 언제 | 광고·보도자료 등을 내기 전, 수시 |
| 먼저 있어야 하는 것 | 준법감시인 지정(EMP-BZ-0007), 결재 체계(APR — 사전확인이 붙는 상신 문서), 대장분류 |
| 다음 이벤트 | 승인된 심사필번호를 광고 결재문서·과거 심사필번호에 사용, 현황은 #1499·RD 대장 출력 |
| 실제 실행 | kalpa, 2026-11-13. 박부장이 대장분류 2개(`AD` 광고물·광고 열 사용, `PR` 보도자료) 등록 → 301이 사전확인 2건 신청(광고물 `신규 펀드 온라인 배너 광고`, 보도자료 `신상품 보도자료`, 상신 문서 `2026.11 책무 이행점검 보고`에 붙임) → 박부장이 의견 기록·승인(`2026-AD001`) → 301·401이 대장·#1499 조회(3건) → 승인 취소(사용 중 번호는 "사용중인 심사필번호는 승인취소할 수 없습니다") → RD 출력 자료 생성. **시험 자료는 모두 지움**. ⚠ 일반 사원 401이 승인·의견·수정·삭제·분류 저장까지 했다 |
| 메뉴 | #1425 준법감시 > 90. 기타 > 준감인 사전확인대장, #1499 준법감시 > 90. 기타 > 심사필 확인대장. kalpa 메뉴 없음(API). 화면 눈 확인 `대기` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 준법감시인 | #1425 | [대장분류설정] → [등록] → 분류코드·분류명·광고물·사용 → [저장] | 대장분류(콤보에 나옴) |
| 2 | 직원 | 결재문서 창 | 사전확인 신청 창: 대장분류·내용·제공처(광고물이면 광고종류·매체·상품·기간·규격·수량) → [신청] | 사전확인 줄(상태 신청 10) |
| 3 | 준법감시인 | #1425 | 기간·대장분류·검색어 → [조회] → 줄의 의견 셀 → 의견 → [저장] | 의견 있음(의견 열) |
| 4 | 〃 | #1425 | 줄 체크 → [승인] → 확인 | 상태 승인, 심사필번호·승인자·승인일 |
| 5 | 〃 | #1425 | 줄 체크 → [취소] → 확인 | 상태 신청, 번호·승인자 지워짐 |
| 6 | 직원·준법감시인 | #1499 | 기간·대장분류 → [조회] | 문서 열람 권한 기준 대장 |
| 7 | 준법감시인 | #1425 | [엑셀다운로드] | RD 출력 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `ics41_dcr_type` | 대장분류(코드·이름·광고물·사용) | +2 → 지움 |
| `ics40_dcr_preconfirm` | 사전확인 신청(상태 10/20/80, 심사필번호 prefix·seq, 승인자·승인일·의견) | +3 → 지움(승인 시 번호 `2026-AD001` 부여) |
| `sys99_print` | RD 출력 자료(그룹 ID) | +3(출력 때마다 내 자료 지우고 새로 담음) |

## 업무 규칙 · 주의

- 승인 상태 `StatusCode`: 10 신청 · 20 승인 · 80 PASS(회사 설정으로 자동). 심사필번호 = `연도-분류코드` + 3자리 순번(분류별로 1씩).
- 승인 취소는 번호와 승인자를 지운다. 다른 신청의 과거 심사필번호(`ics40_pre_appr_no`)로 쓰인 번호는 "사용중인 심사필번호는 승인취소할 수 없습니다"(400).
- 신청 저장 검사는 **대장분류 필수·내용 필수** 두 가지뿐(원본과 같음). 광고물 분류인데 광고 정보가 비어도 저장된다(원본도).
- AS-IS 대조: #1425 `selectByConfirm` 1 = 1(그리드 19열 포함), #1499 `selectByReviewConfirm` 3 = 3(301·401 모두, 그리드 19열 포함).
- ⚠ **일반 사원이 승인·의견·수정·삭제·분류 저장을 할 수 있다** → [의심 #140](../../보안_및_버그_의심.md). 이미 승인된 건을 다시 승인하면 **번호가 새로 부여**(`PR001`→`PR002`)되고, 사용 중 분류 삭제·분류코드 중복도 서버가 막지 않는다 → [의심 #141](../../보안_및_버그_의심.md).
- 사전확인 신청 창(Ics40_Edit_DcrPreconfirm)과 신청자·준감인 의견 창(Ics40_Edit_Msg)은 결재문서 창에서 열린다(이번에는 API로 대신함).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: ICS-BZ-0009
needs: [APR-BZ-0001, EMP-BZ-0007]
steps:
  - no: 1
    actor: { company: kalpa, user: "201", password: "1111" }
    api: PUT /api/v1/ics/dcr-preconfirms/dcr-types
    body: [{ dcrTypeCode: AD, dcrTypeName: 광고물, adYn: true, useYn: true }, { dcrTypeCode: PR, dcrTypeName: 보도자료, adYn: false, useYn: true }]
    expect: { track: { ics41_dcr_type: +2 } }
  - no: 2
    actor: { company: kalpa, user: "301", password: "1111" }
    api: PUT /api/v1/ics/dcr-preconfirms
    body: { apprId: <상신 문서>, dcrTypeCode: AD, content: 신규 펀드 온라인 배너 광고, provideCo: (주)칼파미디어, adType: "01", mediaType: "01", applyYn: true, statusCode: "10" }
    expect: { track: { ics40_dcr_preconfirm: +1 } }
  - no: 3
    actor: { company: kalpa, user: "201", password: "1111" }
    api: PUT /api/v1/ics/dcr-preconfirms/{id}/confirm-msg
    body: { confirmMsg: 문구 수정 후 사용 }
  - no: 4
    actor: { company: kalpa, user: "201", password: "1111" }
    api: PUT /api/v1/ics/dcr-preconfirms/status
    body: { statusCode: "20", items: [{ dcrPreconfirmId: <id>, dcrTypeCode: AD, apprNo: "" }] }
    expect: { db: { ics40_status_cd: "20", ics40_appr_no_prefix: "2026-AD001" } }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Ics40_Tab_DcrPreConfirm`(#1425)·`Ics40_Tab_DcrReviewConfirm`(#1499)·`Ics41_Lookup_DcrType`·`Ics40_Edit_DcrPreconfirm`·`Ics40_Edit_Msg` — 서버 `Ics40_DcrPreconfirm`·`Ics41_DcrType`·`Sys99_Print.insertRdDcrPreConfirm` → `ics40_dcr_preconfirm`·`ics41_dcr_type`·`sys99_print`.
- TOBE: `IcsDcrPreconfirmController`(`/dcr-preconfirms` 17개 — `/status`·`/{id}/confirm-msg`·`/review`·`/dcr-types`·`/rd-download` 등)·`IcsDcrPreconfirmService`·`IcsDcrPreconfirmMapper.xml`.
</details>
