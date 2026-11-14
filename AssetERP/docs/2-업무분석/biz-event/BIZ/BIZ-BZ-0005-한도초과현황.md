# BIZ-BZ-0005 준법감시인이 편익상대방 한도초과 현황을 본다

> **한 줄 요약** — 준법감시인이 #1133 편익상대방 이익제공 현황(이익제공 한도초과현황)에서 연도·제공/수령 구분으로 **한도를 넘은 이익제공(수령)**을 세 탭으로 본다: **인별 1회 초과건**(1인당 금액 = 금액 ÷ 인원 > 1회 한도), **인별 연간 초과건**(거래상대방별 연간 합계), **회사별 연간 초과건**(거래상대방 회사별 연간 합계). 기준액은 0001의 한도 — [이익제공 편익 기준액 적용](기본 켜짐)이면 영업규정 한도(일반·경조), 끄면 편익상대방 한도(인별 1회·연간·회사 연간)이고, [임의점검 이익제공 편익상대방 한도액]을 켜면 화면에 적은 금액으로 점검한다. [한도액 복구]는 0001 값을 다시 불러온다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 준법감시인(kalpa는 과장 301로 실행) |
| 언제 | 매월·연말 점검 |
| 먼저 있어야 하는 것 | BIZ-BZ-0001 한도, 0002·0003 내역과 인원 |
| 다음 이벤트 | BIZ-BZ-0006 상세현황 |
| 실제 실행 | kalpa, 2026-11-14, API(조회). 2026년, 기준액 적용(영업규정 일반 30,000·경조 50,000): 인별 1회 4행(주유소 80,000 ÷ 2 = 40,000 등) · 인별 연간 4행 · 회사별 연간 3행. 임의점검(1회 50,000·연간 100,000·회사 150,000): 3행 · 2행(삼성증권 홍길동 155,000) · 2행(삼성증권 210,000). **AS-IS 6조합 모두 일치**(4=4·3=3·4=4·2=2·3=3·2=2, 그리드 8·4·3열). 이익수령은 kalpa 편익상대방 한도가 0이라 50,000 선물도 초과로 잡힌다. **402(사원)도 같은 현황을 받음**(⚠#235 보강). 엑셀은 `대기(일괄)` |
| 메뉴 | #1133 준법감시 > 40. 이익제공(수령)현황 > 편익상대방 이익제공 현황. kalpa 메뉴 없음. 화면 눈 확인 `대기(일괄)` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 준감인 | #1133 | 화면 열림 — 올해, 한도액 칸(`GET /biz/limits/provide?stdYear=`) | 인별 1회·인별 연간·회사 연간 한도액 |
| 2 | 〃 | 〃 | 연도 Enter·[조회]·탭 바꾸기 (`GET /biz/limit-checks/person-day`·`person-year`·`company-year`, `yearText`·`provideRcvType`·`overCheck`·`limitCheck`·`limit1~3`) | 초과건 목록 |
| 3 | 〃 | 〃 | [이익제공 편익 기준액 적용] 끄기 / [임의점검…한도액] 켜고 금액 입력 | 기준액이 바뀌어 다시 조회 |
| 4 | 〃 | 〃 | [한도액 복구] | 한도액 칸이 0001 값으로 |
| 5 | 〃 | 〃 | [엑셀다운로드] (`GET /biz/limit-checks/excel`) | `이익제공 한도초과현황(2026).xls`(시트 3개) |

## DB에 남는 것

조회만.

## 업무 규칙 · 주의

- 1인당 금액(`biz01_average_price`)은 금액 ÷ 인원(직원 + 거래처). 거래처를 안 넣은 내역은 상대방이 `*미등록*`으로 묶인다 — 0001 거래상대방 필수입력을 켜야 상대방별 연간 점검이 맞는다.
- 이익수령(2)은 언제나 편익상대방 1회 한도(`biz90_company_limit1`)로 본다. 한도가 0이면 모든 수령이 초과다.
- 일반/경조는 목적코드 둘째 자리(`0` = 일반, 그 밖 = 경조)로 가른다.
- 사원도 이 API를 부를 수 있다 → [의심 #235](../../보안_및_버그_의심.md).

<details><summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: BIZ-BZ-0005
company: kalpa
as: 301
steps:
  - no: 1
    api: GET /api/v1/biz/limits/provide?stdYear=2026
  - no: 2
    api: GET /api/v1/biz/limit-checks/person-day?yearText=2026&overCheck=true&limitCheck=false
    expect: rows 4
  - no: 3
    api: GET /api/v1/biz/limit-checks/person-year?yearText=2026&overCheck=false&limitCheck=true&limit1=50000&limit2=100000&limit3=150000
    expect: rows 2
  - no: 4
    api: GET /api/v1/biz/limit-checks/company-year?yearText=2026&overCheck=false&limitCheck=true&limit1=50000&limit2=100000&limit3=150000
    expect: rows 2
```
</details>

<details><summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Biz01_Tab_LimitCheckList`(#1133 E0~E7, `retrieveTabpage` 파라미터), 탭 `Biz01_TabPage_PersonDay`·`PersonYear`·`CompanyYear`, SQL `biz01_promo.selectByPersonDay` L48-60·`selectByPersonYear`·`selectByCompanyYear`.
- TOBE: `BizLimitCheckController`(`/api/v1/biz/limit-checks/*`, `BizLimitCheckReq`), `BizLimitController` `/limits/provide`.
- 확인: `compare GET /biz/limit-checks/{탭} … --sql biz01_promo.selectBy{탭} --param overCheck=… --param limitCheck=… --grid Biz01_TabPage_{탭}` 6조합 일치(SQL이 `#{overCheck} = 'true'`로 글자 비교라 `-p` 글자 값이 맞다).
</details>
