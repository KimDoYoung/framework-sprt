# PAY-BZ-0002 KFS가 급여 기초정보(지급·공제 항목, 요율, 세액표, 임금계산방법)를 갖추고 고객사에 내려 준다

> **한 줄 요약** — 급여 계산에 쓰는 표는 대부분 **모든 고객사 공통**(회사 열 없음)이다. KFS 관리자가 #1279 급여기초정보관리의 9개 탭(지급/공제 항목, 임금계산방법, 율, 근로소득 간이세액표, 근로소득 공제표, 인적공제금액, 과세표준 구간별 기본세율, 근로소득 세액공제·한도, 기타설정)을 적용일별로 관리하고, **임금계산방법만 회사별**이라 [기초데이터생성]으로 회사 0의 적용일을 고객사에 복사한다. 고객사는 #1278 급여기초정보에서 같은 탭을 **읽기만** 한다.

| 항목 | 내용 |
|:---|:---|
| 누가 | KFS 관리자(#1279), 고객사 경영관리팀(#1278 — 조회) |
| 언제 | 해마다(세법·요율 개정), 고객사 도입 때(임금계산방법 복사) |
| 먼저 있어야 하는 것 | SYS-BZ-0001 |
| 다음 이벤트 | PAY-BZ-0004(월 급여 계산) |
| 실제 실행 | 2026-11-12, API: KFS가 kalpa에 임금계산방법 `2023-04-01` 기초데이터 생성(+6: 국민연금·건강보험·장기요양·고용보험·소득세·지방소득세). 탭별 조회(항목 36·율 5·세액표 등 적용일 `2023-01-01`·`2023-02-01`). 사원 401 쓰기 시험(아래) |
| 메뉴 | #1279 기초자료 > 30. 자산&경영 > 급여기초정보관리(KFS), #1278 경영관리 > 04. 급여관리 > 급여기초정보. kalpa 회사 메뉴에는 PAY 메뉴가 없다. 화면 눈 확인 `대기` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | KFS 관리자 | #1279 | 탭 고르기 → (적용일 탭은 왼쪽 적용일 줄 선택) | 오른쪽에 그 적용일의 표 |
| 2 | 〃 | 세액표·공제표·기타설정 탭 | [등록] → 새 적용일(생성 창: 가장 최근 적용일 내용을 복사) | 새 적용일 줄과 복사된 표 |
| 3 | 〃 | 〃 | 표 고치기 → [저장], 줄 [삭제] | 저장·삭제(회사 0이 아니면 단추가 안 보인다) |
| 4 | 〃 | 임금계산방법 탭 | 고객사·기준 적용일 → [기초데이터생성] | 고객사에 회사 0의 그 적용일 산출식이 복사된다(그 적용일이 있으면 지우고 다시) |
| 5 | 경영관리 | #1278 | 탭 보기 | 같은 표(읽기만), 임금계산방법은 내 회사 것 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `pay04_formula` | 회사별 임금계산방법(적용일·항목·산출식) | kalpa +6 |
| `pay20_item`·`pay21_rate`·`pay22~24`·`pay25_person_deduct`·`pay26~29` | 공통 표(회사 열 없음) | 변화 없음 |

## 업무 규칙 · 주의

- 공통 표 저장·삭제는 TOBE 서버가 **KFS 관리자만** 허용한다(`requireSysAdmin`). 401 `PUT /api/v1/pay/items` → `ACCESS_DENIED`. 원본 서버는 검사 없이 화면 단추만 숨긴다.
- ⚠ **임금계산방법(회사별)은 서버가 막지 않는다.** `PayFormulaService`의 머리 주석은 "쓰기는 관리자 회사만"인데 `createDate`·`save`·`delete`·`deleteDate`에 검사가 없다(`basicDataCreate`만 있음). 실행: 사원 401이 kalpa 국민연금 산출식을 `… * 2`로 고치고(200) 새 적용일 `2026-12-01`을 만들었다(+6). 둘 다 되돌렸다 → [의심 #74](../../보안_및_버그_의심.md). 산출식은 설명 글이라 계산값을 바꾸지는 않지만 급여명세서·대장에 보이는 회사 기준이다.
- 세액표·공제표 등 적용일이 `2023-02-01`이 마지막이다(로컬 DB). 2024년 이후 세법 개정분이 없어 2026년 급여는 2023년 표로 계산된다(운영 DB 확인 필요, 데이터 문제).
- 원본 `Pay20_Tab_Deduct`(#1278)와 `Pay20_Tab_DeductAdmin`(#1279)은 탭 구성이 같고, 각 탭이 `LoginUser.getCompanyId() == 0`일 때만 편집 단추를 보인다(`Pay20_TabPage_Item` L71 등).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: PAY-BZ-0002
needs: [SYS-BZ-0001]
steps:
  - no: 4
    actor: { company: admin, user: admin, password: "1111" }
    api: POST /api/v1/pay/formulas/basic-data
    body: { companyId: <kalpa>, startDate: "2023-04-01" }
    expect: { data: 6, track: { pay04_formula: +6 } }
  - no: 5
    actor: { company: kalpa, user: "301", password: "1111" }
    api: GET /api/v1/pay/formulas?startDate=2023-04-01
    expect: { rows: 6 }
  - no: 3b
    actor: { company: kalpa, user: "401", password: "1111" }
    api: PUT /api/v1/pay/items
    expect: { error: ACCESS_DENIED }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Pay20_Tab_DeductAdmin`·`Pay20_Tab_Deduct`(탭 9개 L31-56), `Pay20_TabPage_Item`, `Pay04_TabPage_Formula`, `Pay21_TabPage_Rate`, `Pay23_TabPage_SimpleTaxTable`, `Pay24_TabPage_DeductTable`, `Pay25_TabPage_PersonDeduct`, `Pay26_TabPage_TaxCalcTable`, `Pay27_TabPage_TaxDeductTable`(·`Pay28` 한도), `Pay29_TabPage_OtherSetupDate`와 생성 창들, 서버 `pay.Pay04_Formula`·`Pay20_Item`~`Pay29_OtherSetup`.
- TOBE: `/api/v1/pay/items`·`/rates`·`/formulas`(`/dates`·`/basic-data`)·`/simple-taxes`·`/deduct-tables`·`/person-deducts`·`/tax-calcs`·`/tax-deducts`·`/other-setups`, `PayFormulaService` L46-123, 화면 `Pay20_Tab_DeductAdmin.tsx`·`Pay20_Tab_Deduct.tsx`.
</details>
