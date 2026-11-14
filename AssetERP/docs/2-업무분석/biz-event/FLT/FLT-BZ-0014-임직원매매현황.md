# FLT-BZ-0014 준법감시인이 임직원매매현황을 본다

> **한 줄 요약** — #1351 임직원매매현황은 기준일 현재 회사 **전 직원 한 줄씩**의 요약판이다: 부서·이름·서약서 여부·가족 동의·신고 계좌 수·보고주기·최근 보고일·연간추가 투자한도/연간 투자금액·총 투자금액·회전율·일평균 잔고·위반 건수·메모. 셀을 누르면 가족 동의서·계좌·위반내역 창이 열리고, 메모(`flt15_tr_status`)를 남긴다. 엑셀로 내려받는다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 준법감시인(301) |
| 언제 | 수시 |
| 먼저 있어야 하는 것 | FLT-BZ-0003~0012의 자료 |
| 다음 이벤트 | FLT-BZ-0013 책임자보고 |
| 실제 실행 | kalpa, 2026-11-14, API. 301 `GET /flt/emps/info?stdDate=2026-11-14` → 7행. 401: 서약 ○ · 계좌 2건(그날 폐쇄한 배우자 계좌 포함) · 분기별 · 연간추가 한도 30,000,000 / 연간 투자 760,000 · 총 투자 8,510,000 · 회전율 18.65% · 일평균 8,951,000 · **위반 3건**(0012와 같음) · 최근 보고일 없음(4분기 보고의 기준일이 12-31이라 11-14 기준으로는 아직). 나머지 6명은 계좌 0건. AS-IS 대조는 원본 SQL(`flt02_emp.selectByCompanyId`)이 `<include refid="flt10_tr.selectEmp"/>`·`<include refid="flt10_tr.selectViolate"/>`로 이뤄져 `compare`가 풀지 못해 하지 못함. 사원 401도 같은 API가 됨(⚠#229와 같은 모양) |
| 메뉴 | #1351 준법감시 > 11. 임직원매매(준감인) > 임직원매매현황. kalpa 메뉴 없음. 화면 눈 확인 `대기(일괄)` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 | 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 준감인 | #1351 | 기준일·검색 → [조회] (`GET /flt/emps/info`) | 직원별 요약 |
| 2 | 〃 | 〃 | 가족·계좌·위반 셀 → 창 / 메모 셀 → 메모 창(`flt15_tr_status`) | 상세 |
| 3 | 〃 | 〃 | [엑셀다운로드] (`GET /flt/emps/info/excel`) | 엑셀 |

## 업무 규칙 · 주의

- 계좌 수는 폐쇄일 당일 계좌도 센다(0006의 계좌 목록과 같음).
- 관리자 API에 권한 검사가 없다 → [의심 #229](../../보안_및_버그_의심.md).

<details>
<summary>근거</summary>

- AS-IS: `Flt02_Tab_EmpInfo`(#1351 E0~E4, `Flt02_Emp.selectByCompanyId` L34 — `flt10_tr.selectEmp`·`selectViolate` 포함, `Flt01_CompanyStd.selectByDate`, 창 `Flt07_Lookup_FamilyConsent`·`Flt03_Lookup_AccountView`·`Flt10_Lookup_ViolateView`·`Flt15_Lookup_Note`).
- TOBE: `FltEmpController`(`/api/v1/flt/emps/info`·`/setting`·`/excel`).
</details>
