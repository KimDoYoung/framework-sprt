# ICAM-BZ-0001 ADMIN이 ICAM 펀드정보를 가져온다

> **한 줄 요약** — ADMIN(회사 0)이 #1096 ICAM 펀드정보에서 고객사를 고르고(비우면 전체) **[ICAM Get]**을 누르면 배치 `icamFund`가 ICAM의 펀드 기본(`icam03_fund.selectIcamFund`)을 전영업일~전일 날짜별로 읽어 `icam03_fund`에 넣고, 같은 내용을 AssetERP 펀드(`fnd01_fund`·`fnd02`)와 수탁사·수탁은행·사무수탁사(`fnd03`·`fnd09`·`fnd06`)에 반영한다. **[타사무 Get]**은 타사무 펀드(`extrFund`). 조회는 회사의 최근 펀드 목록 → 행을 고르면 그 펀드의 변경이력.

| 항목 | 내용 |
|:---|:---|
| 누가 | ADMIN(회사 0, `admin/admin/1111`) |
| 언제 | 매일(원래는 cron 배치 `icamFund`), 고객사가 새로 생기거나 펀드가 바뀔 때 화면에서 다시 |
| 먼저 있어야 하는 것 | 고객사의 `sys01_icam_company_cd`(ICAM 회사코드). KFS 28000은 `2018` |
| 다음 이벤트 | 0003 발생보수 가져오기, FND 펀드 화면(#1327 펀드 조회(변경이력) 등) |
| 실제 실행 | 2026-11-14, API. 회사 28000 최근 펀드 AS-IS 4 = 4(그리드 5열), 펀드 322004 변경이력 AS-IS 6 = 6·total 6(그리드 33열). **[ICAM Get] `POST /icam/funds/batch` → 400 "ICAM 연동(외부 ICAM DB)이 아직 없어…"**(⚠#179 — 화면 버튼이 배치에 연결돼 있지 않다). kalpa 401의 전체(`ALL`) 가져오기는 403 |
| 메뉴 | #1096 I/F > 10. ICAM > ICAM 펀드정보 (ADMIN·DEMO·PTR·TWO·TEST 회사). 화면 눈 확인 `대기(일괄)` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | ADMIN | #1096 | 고객사 조회창(`Sys01_Lookup_Company`)에서 회사 → [조회] (`GET /icam/funds/recent?companyId=`) | 그 회사의 최근 펀드(펀드코드·명·KOFIA·예탁원 코드·수탁·유형 …) |
| 2 | 〃 | 〃 | 행 선택 (`GET /icam/funds?companyId=&fundCode=`) | 오른쪽 변경이력(기준일별 33열, 페이징) |
| 3 | 〃 | 〃 | [ICAM Get] — 회사를 비우면 "전체고객사의 펀드정보를 가져오시겠습니까?" [예] (`POST /icam/funds/batch {actionCode:"icamFund", companyId}`) | 원본: 배치 실행 결과. **TOBE: 400 안내** |
| 4 | 〃 | 〃 | [타사무 Get] (`actionCode:"extrFund"`) | 3과 같음 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `icam03_fund` | 날짜별 ICAM 펀드(41열) | 그대로(1,011행) — 배치를 못 돌림 |
| `fnd01_fund`·`fnd02_*`·`fnd03`·`fnd06`·`fnd09` | AssetERP 펀드·수탁사·사무수탁사 | 그대로 |

## 업무 규칙 · 주의

- 전체(`ALL`)는 ADMIN만(TOBE `IcamFundService.runBatch` L43, 비관리자는 자기 회사만 — `allowedCompany`).
- 배치 본체 `IcamFundAction`(SB13, ICAM 시뮬레이터 `data/icam-simulator/icam/icam03_fund.selectIcamFund.csv`)은 있다. cron 진입점 `/api/v1/batch/icamFund`(API key·IP 제한)로만 돈다. 화면은 `IcamBatchRunner` 구현이 `DisabledIcamBatchRunner` 하나뿐이라 늘 거절한다 → [의심 #179](../../보안_및_버그_의심.md).
- KFS 104(회사 28000, #1096 메뉴 없음)도 `GET /icam/funds/recent`로 자기 회사 펀드를 본다(자기 회사 자료라 문제 삼지 않음).

<details><summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: ICAM-BZ-0001
company: 0 (ADMIN)
steps:
  - no: 1
    api: GET /api/v1/icam/funds/recent?companyId=28000
    expect: rows 4
  - no: 2
    api: GET /api/v1/icam/funds?companyId=28000&fundCode=322004&limit=100
    expect: total 6
  - no: 3
    api: POST /api/v1/icam/funds/batch
    body: {actionCode: icamFund, companyId: "28000"}
    expect: 400 (#179 — 연결되면 200)
```
</details>

<details><summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Icam03_Tab_Fund`(#1096 E1~E5, `icamFundGet` L151-173·`batchCall` L199-211 → `/BatchMain?actionCode=icamFund`), `Icam03_Grid_Fund` L49, SQL `icam03_fund.selectRecentFund`·`selectByNamePaging`.
- TOBE: `IcamFundController` L29-47, `IcamFundService` L28-47, `DisabledIcamBatchRunner` L17-20, 배치 `biz/batch/action/IcamFundAction` L52-105.
- 확인: `compare GET /icam/funds/recent --sql icam03_fund.selectRecentFund --grid Icam03_Tab_Fund` 4=4, `compare GET /icam/funds --sql icam03_fund.selectByNamePaging --total-sql …Total --grid Icam03_Grid_Fund` 6=6.
</details>
