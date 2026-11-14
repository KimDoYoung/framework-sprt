# BIZ-BZ-0001 준법감시인이 이익제공(수령) 한도기준을 정하고 직원 자동등록을 설정한다

> **한 줄 요약** — #1130 이익제공 기준관리(준감인)에서 적용시작일·제공/수령 구분별로 **영업규정 한도(일반·경조)**와 **편익상대방 한도(인별 1회·인별 연간·회사별 연간)**, 거래상대방 필수입력 여부를 정한다(`biz90_limit`). [직원 자동등록 설정] 창에서는 제공 목적(판매·운용·관리)별로 내용코드(식사·골프·선물…)마다 "이익제공 입력 때 사용자 본인을 내부 인원으로 자동 등록할지"를 정한다(`biz04_provide_setup`).

| 항목 | 내용 |
|:---|:---|
| 누가 | 고객사 준법감시인(kalpa는 지정된 사람이 없어 과장 301로 실행) |
| 언제 | 도입 때, 영업규정·한도가 바뀔 때(적용시작일로 이력) |
| 먼저 있어야 하는 것 | 회사 개설(SYS). 공통코드 `ProvideRcvType`·`ProvidePurCode`·`ProvideContentCode`는 회사 0 공통 |
| 다음 이벤트 | BIZ-BZ-0002 법인카드 이익제공 입력, 0003 현금·물품 입력, 0005 한도초과 현황 |
| 실제 실행 | kalpa, 2026-11-14, API. 이익제공(1) 2026-01-01 기준 1행이 이미 있음(30,000·50,000) → 301 `PUT /biz/limits`로 **이익수령(2)** 2026-01-01 30,000·50,000 +1 → AS-IS 2 = 2(그리드 9열). 직원 자동등록: 판매(10) 목적 식사(1001) `empSetYn=true` +1 → AS-IS 6 = 6(`providePurCode=10%`). **사원 401이 한도를 9,999,999로 고침**(⚠#231) → 되돌림 |
| 메뉴 | #1130 준법감시 > 40. 이익제공(수령)현황 > 이익제공 기준관리(준감인). kalpa 메뉴 없음. 화면 눈 확인 `대기(일괄)` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 준감인 | #1130 | 화면 열림·[조회] (`GET /biz/limits`) | 적용시작일·제공/수령·일반·경조·인별 1회·인별 연간·회사별 연간·거래상대방 필수입력 |
| 2 | 〃 | 〃 | [등록] → 적용시작일·제공/수령(콤보)·한도액 → [저장] (`PUT /biz/limits`) | 새 기준 행. 같은 날·같은 구분이 있으면 그 행을 고친다(update 0건이면 insert) |
| 3 | 〃 | 〃 | 행 선택 → [삭제] → 확인창 [예] (`DELETE /biz/limits`) | 행 지워짐 |
| 4 | 〃 | [직원 자동등록 설정] 창 | 목적 콤보(판매·운용·관리) → 내용코드별 체크 → [저장] (`GET`·`PUT /biz/provide-setups`) | 체크한 내용코드는 이익제공 입력 때 사용자 본인이 내부 인원으로 자동 등록된다(0002) |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `biz90_limit` | 회사·적용시작일·구분(1 제공/2 수령)별 한도 | kalpa +1(`202611149150264` 이익수령) |
| `biz04_provide_setup` | 회사·내용코드별 직원 자동등록 여부. 행이 없으면 화면은 `false`로 보인다(조회가 공통코드 + LEFT JOIN) | kalpa +1(1001 식사 `true`) |

## 업무 규칙 · 주의

- 한도는 "적용시작일 이전 가장 최근 행"이 쓰인다. 영업규정 한도(일반·경조)는 목적이 일반(10·20·50)인지 경조(11·21)인지로 고른다.
- 직원 자동등록 창 조회는 `sys09_code LIKE '{목적코드}%'` — 목적 10이면 10xx 내용코드, 50이면 50xx.
- 한도·자동등록 저장에 권한 검사가 없다 → [의심 #231](../../보안_및_버그_의심.md)(원본도 회사 조건뿐).

<details><summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: BIZ-BZ-0001
company: kalpa
as: 301
steps:
  - no: 1
    api: GET /api/v1/biz/limits
  - no: 2
    api: PUT /api/v1/biz/limits
    body: [{limitId: null, startDate: 2026-01-01, provideRcvType: "2", saleRuleLimit1: 30000, saleRuleLimit2: 50000, companyLimit1: 0, companyLimit2: 0, companyLimit3: 0, targetInfoReqYn: "N"}]
    expect: rows +1
  - no: 3
    api: GET /api/v1/biz/provide-setups?providePurCode=10
  - no: 4
    api: PUT /api/v1/biz/provide-setups
    body: [{provideSetupId: null, provideContentCode: "1001", empSetYn: "true"}]
```
</details>

<details><summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Biz90_Tab_Limit`(#1130 E0~E7), `Biz04_Lookup_EmpSetup` L162(`providePurCode + "%"`), 서버 `Biz90_Limit.selectByCompanyId`·`update`·`delete`, `Biz04_ProvideSetup.selectByProvidePurCode`·`upsert`, SQL `biz04_provide_setup.selectByProvidePurCode`.
- TOBE: `BizLimitController`(`/api/v1/biz/limits` GET·PUT·DELETE, `/limits/provide`), `BizProvideSetupController`(`/api/v1/biz/provide-setups`).
- 확인: `yunhee compare GET /api/v1/biz/limits --sql biz90_limit.selectByCompanyId --grid Biz90_Tab_Limit` 2=2, `compare GET /biz/provide-setups -p providePurCode=10 --sql biz04_provide_setup.selectByProvidePurCode --param 'providePurCode=10%'` 6=6.
</details>
