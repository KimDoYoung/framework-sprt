# ACT-BZ-0005 재무제표(손익계산서·재무상태표·금감원보고용)를 본다

> **한 줄 요약** — 회계 담당이 기준일자와 비교기준(전기말·반기·분기)을 골라 **손익계산서**·**재무상태표**를 보고, 금감원 제출용 재무제표는 기준년월·구분으로 출력한다. 마감 전 날짜는 결산원장(`act05`)이 없어서, 조회할 때 **가결산원장(`act07`)을 그 자리에서 만들어** 계산한다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 회계 담당·경영진 |
| 언제 | 월·분기·결산 때 |
| 먼저 있어야 하는 것 | ACT-BZ-0003 승인 전표, ACT-BZ-0004 [계정원장 정리] |
| 다음 이벤트 | ACT-BZ-0006 회계마감 |
| 실제 실행 | kalpa, 2026-11-13, API. 비교일자 `compare-date`(전기말 2025-12-31·반기 2026-06-30) → 시험 전표(접대비 50,000, 승인) 뒤 정리 → 손익계산서(2026-11-13 vs 11-12) **접대비 350,000 vs 300,000**(차이 50,000 일치)·재무상태표 20행 → 재종류 3은 거절 → 사원 402도 조회(⚠#200) → 출력 준비(`/rd`: `sys99_print` +16)·금감원 출력 준비(`/fss-rd` 구분 `GA023`: +446) → 시험 전표 삭제·정리 다시 → 접대비 300,000/300,000 원복. 화면 눈 확인 `대기(일괄)` |
| 메뉴 | #1178 손익계산서, #1179 재무상태표, #1225 금감원보고용 재무제표 (관리회계 > 22. 재무제표). kalpa 메뉴 없음 |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 | 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 회계 담당 | #1178·#1179 | 기준일자 → 비교기준 선택(`GET /act/gen-ledger-reports/compare-date`) → 비교일자 | 비교일자 자동 계산 |
| 2 | 〃 | #1178(손익 `reportType=2`)·#1179(재무상태 `1`) | 0 제외 체크 → [조회] (`GET /act/gen-ledger-reports`) | 계정과목별 당기·비교기간 잔액 |
| 3 | 〃 | #1178·#1179 | [출력/다운로드] (`POST …/rd`) | 출력자료 `sys99_print` 생성 → RD 보고서 |
| 4 | 〃 | #1225 | 기준년월·구분(재무상태표 GA023 등) → [조회]/출력 (`POST …/fss-rd`) | 금감원 양식 출력자료 생성 |

## DB에 남는 것

| 테이블 | 무엇 | kalpa 실행 |
|:---|:---|:---|
| `act07_gen_ledger_closetmp` | 가결산원장(기준일·비교일에 결산원장이 없으면 지우고 다시 만듦) | 행 수는 3153 그대로, ID는 조회마다 새로 바뀜 |
| `sys99_print` | 출력자료(사원·창 클래스별로 지우고 다시 씀) | `rd` +16, `fss-rd` +446 |

## 업무 규칙 · 주의

- 재무제표 종류: `reportType` 1 재무상태표 / 2 손익계산서, 그 외는 "재무제표 종류를 확인하세요."(400). 비교기준 코드 1 전기말·2 반기·3 분기, 그 외 "비교기준을 확인하세요."
- 숫자는 전표 → [계정원장 정리] → 재무제표 순이다. 정리를 안 하면 새 전표가 안 들어간다(0004). 승인 여부와 상관없이 들어간다.
- 조회가 `GET`인데 **가결산원장을 지우고 만든다**(`@Transactional`). 읽기만 하는 화면이 DB를 쓰는 구조라, 여러 사람이 같은 날짜를 동시에 조회하면 서로의 가결산을 지울 수 있다 → [의심 #200](../../보안_및_버그_의심.md).
- 사원 402도 재무제표를 읽는다(손익 454행) → #200에 함께 적음.
- #1225는 서버에 조회용 GET이 없고 출력(`fss-rd`)으로 화면을 채운다(TOBE 설계). 구분 코드를 모르는 값(`1`)은 오류 없이 빈 결과(변화 0)다.

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: ACT-BZ-0005
needs: [ACT-BZ-0003, ACT-BZ-0004]
steps:
  - no: 1
    actor: { company: kalpa, user: admin, password: "1111" }
    api: GET /api/v1/act/gen-ledger-reports/compare-date?stdDate=2026-11-13&compareCode=1
  - no: 2
    api: GET /api/v1/act/gen-ledger-reports?stdDate=2026-11-13&compareDate=2026-11-12&reportType=2
    expect: { rows: ">0" }
  - no: 3
    api: POST /api/v1/act/gen-ledger-reports/rd
    body: { windowClassName: Act04_Tab_ReportPL, stdDate: "2026-11-13", compareDate: "2026-11-12", exceptZeroYn: true, reportType: "2" }
    expect: { track: { sys99_print: "+N" } }
```
</details>

<details>
<summary>근거</summary>

- AS-IS: `Act04_Tab_ReportPL`(#1178)·`Act04_Tab_ReportBS`(#1179)·`Act04_Tab_ReportFSS`(#1225), 서버 `Act04_GenLedger.selectBSPL`(가결산원장 생성 포함)·`Sys99_Print.insertRdReportPL/BS/FSS`.
- TOBE: `ActGenLedgerReportController`·`ActGenLedgerReportService.searchBSPL/insertRdReport/insertRdReportFss`.
</details>
