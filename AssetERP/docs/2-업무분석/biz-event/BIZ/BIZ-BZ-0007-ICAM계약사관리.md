# BIZ-BZ-0007 KFS가 ICAM 계약사를 관리한다

> **한 줄 요약** — KFS(한국펀드서비스, 회사 28000) 영업 담당이 #1209 ICAM 계약사 관리에서 ICAM(펀드회계 시스템)을 쓰는 **운용사·자문사 계약**을 관리한다. 계약사(`biz10`)마다 **계약 이력**(계약상태·거래유무·거래형태·계약기간·(재)계약일·거래 개시·종료일·기본보수·담당자·대표·주소, `biz11`)과 이력별 **최저보수**(운용·자문·일임 최저보수, 분기/월 청구, 병행보수, `biz12`)를 두고, 탭에서 **공유자**(직원·부서, `biz15`)·**연관문서**(`biz14`)·**운용사 코드**(`biz13`, `sys15_corp`)·**개별계약서**(`biz16`, 결재 연결)·**이중사무관리 펀드**(`biz17`)·**보유펀드 보수**를 관리한다. 최저보수는 0008 청구의 기준이다.

| 항목 | 내용 |
|:---|:---|
| 누가 | KFS 영업·계약 담당(회사 28000 직원. 시험은 `yunhee api` 기본 계정 104) |
| 언제 | 새 계약·재계약·조건 변경 때 |
| 먼저 있어야 하는 것 | 운용사 코드(`sys15_corp`), 담당 직원 |
| 다음 이벤트 | BIZ-BZ-0008 최저보수 청구 |
| 실제 실행 | 회사 28000, 2026-11-14, API. 목록(2026, 전체) 29행 → AS-IS 29 = 29(그리드 20열, `searchText=%%`·`statusCode=%`·`sortType=1`). 시험 계약사 `ZZ칼파자산운용(시험)` 만들기(`POST /cont-corps` → `biz10`·`biz11`·`biz12` 각 +1, 운용 최저보수 6,000,000 분기별) → 운용사 `브이엠자산운용(주)` +1 → 개별계약 `ZZ시험펀드1호` +1 → 공유자 +1 → 삭제(`biz10`·`11`·`12`·`13`·`15` −1, **`biz16` 개별계약은 남음** ⚠#237 → 지움). **kalpa 사원 401이 KFS 시험 계약사 최저보수를 1원으로 바꾸고, KFS 계약 이력에 kalpa 결재문서를 붙임**(⚠#236) → 되돌림. 401의 계약사·운용사·개별계약 삭제는 0건(회사 조건) |
| 메뉴 | #1209 KFS > 10. ICAM 계약사관리 > ICAM 계약사 관리 (KFS 회사 메뉴). 화면 눈 확인 `대기(일괄)` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | KFS | #1209 | 연도(토글로 켜고 끔)·검색어·상태 콤보·[상태 체크]·만료 월 → [조회] (`GET /biz/cont-corps`) | 계약사별 최신 이력 한 줄(계약상태·거래유무·기간·보수 요약·담당) |
| 2 | 〃 | 〃 | [등록] → 편집 창: 이력 + 최저보수 → [저장] (`GET /cont-corps/next-id`, `POST /cont-corps`) | 계약사 + 이력 + 보수 한 번에 |
| 3 | 〃 | [계약이력] 탭 | 이력 행 추가·수정 (`POST /cont-corps` 같은 API) · 삭제 (`DELETE /cont-corps/histories`) · 보수정보 (`PUT /cont-corps/fee-infos`) | 재계약·자동연장 이력이 쌓임 |
| 4 | 〃 | [공유자] 탭 | 직원·부서 추가 → [저장] (`PUT /cont-corps/shares`) · [이전 이력 복사] (`POST /histories/{id}/shares/copy`) | 이력별 공유자 |
| 5 | 〃 | [연관문서] 탭 | 결재문서 고르기 (`POST /cont-corps/relate-apprs`) · 삭제 | 이력별 연관 결재문서 |
| 6 | 〃 | [운용사] 탭 | 운용 구분·운용사(`sys15_corp`)·최초 시작·최종 종료 → [저장] (`PUT /cont-corps/with-corps`) | 계약사의 ICAM 운용사 코드 |
| 7 | 〃 | [개별계약] 탭 | 일자·펀드명·개시일·보수·비고 → [저장] (`PUT /cont-corps/each-conts`) · 문서분류지정 → 상신 → 결재 ID (`PUT /each-conts/{id}/appr-id`) | 펀드별 개별계약서 |
| 8 | 〃 | [이중관리펀드] 탭 | 펀드·시작일·보수·부보수·구분 → [저장] (`PUT /cont-corps/dual-funds`) | |
| 9 | 〃 | [보유펀드] 탭 | 기준일 (`GET /cont-corps/{id}/hold-funds`) | 운용사의 ICAM 펀드별 보수 |
| 10 | 〃 | #1209 | 체크 → [삭제] → 확인창 [예] (`DELETE /cont-corps`) | 계약사와 공유자·연관문서·운용사·보수·이력 삭제 |
| 11 | 〃 | 〃 | [출력/다운로드] (`POST /cont-corps/rd-print`) | RD |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `biz10_cont_corp` | 계약사(회사 28000) | +1 → −1 |
| `biz11_cont_history` | 계약 이력 | +1 → −1 |
| `biz12_fee_info` | 이력별 최저보수·청구 방식·병행보수 | +1 → −1 (401이 1원으로 바꿨다 되돌림) |
| `biz13_with_corp` · `biz15_share` | 운용사 · 공유자 | 각 +1 → −1 |
| `biz14_relate_appr` | 연관문서 | 401 위조 +1 → 지움 |
| `biz16_each_contract` | 개별계약서 | +1 → 계약사 삭제 뒤 남음 → `biz-db-write`로 지움 |

## 업무 규칙 · 주의

- 목록 검색어는 서버가 `%검색어%`로 감싸고, 상태 전체는 `%`, 만료 월은 빈 값이면 null(원본 `Biz10_ContCorp.selectByText`).
- 계약사 삭제는 개별계약·이중관리펀드를 지우지 않는다 → [의심 #237](../../보안_및_버그_의심.md).
- KFS 전용 화면인데 KFS 관리자 검사(`@RequireSysAdmin`)가 없다. 조회·삭제는 회사 조건으로 막히지만 **보수정보 저장·연관문서는 다른 회사 사원도 된다** → [의심 #236](../../보안_및_버그_의심.md).
- 이중관리펀드는 ICAM 펀드코드가 있어야 해 이번에 넣지 않았다.

<details><summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: BIZ-BZ-0007
company: 28000 (KFS)
steps:
  - no: 1
    api: GET /api/v1/biz/cont-corps?check=false&stdYear=2026&statusCheck=false
    expect: rows 29
  - no: 2
    api: POST /api/v1/biz/cont-corps
    body: {contCorpId: null, history: {regDate: 2026-11-14, contCorpNm: ZZ칼파자산운용(시험), contStatusCd: "1", corpStatusCd: "10", trType: 전문사모, contPeriodCd: "01", contDate: 2026-11-14, startDate: 2026-12-01, closeDate: 2027-11-30, baseFee: "2.0", personId: 29049}, fee: {minFeeYn: "true", manageMinFee: 6000000, feeChargeType: "1", withYn: "false"}}
  - no: 3
    api: PUT /api/v1/biz/cont-corps/with-corps
    body: [{contCorpId: "{contCorpId}", manageType: "1", corpId: 202208050325133, firstStartDate: 2026-12-01}]
  - no: 4
    api: PUT /api/v1/biz/cont-corps/shares
    body: {adds: [{contHistoryId: "{contHistoryId}", shareCd: "1", personId: 29049}], deleteIds: []}
  - no: 5
    api: DELETE /api/v1/biz/cont-corps
    body: ["{contCorpId}"]
```
</details>

<details><summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Biz10_Tab_ContCorp`(#1209 E0~E11, `retrieve`·`delete` L395-414), 탭 `Biz11_TabPage_ContHistory`·`Biz13_TabPage_WithCorp`·`Biz16_TabPage_EachCont`·`Biz17_TabPage_DualManageFund`, 서버 `Biz10_ContCorp.selectByText` L27-48·`delete` L114, `Biz11_ContHistory.deleteContCorpId` L51-61, `Biz12_FeeInfo.modelUpdate`, `Biz14_RelateAppr.modelUpdate`.
- TOBE: `BizContCorpController`(`/api/v1/biz/cont-corps/**`), `BizContCorpService.saveFeeInfo` L160(`biz-authz --lint-delete-by-id` 검출).
- 확인: `compare GET /biz/cont-corps --sql biz10_cont_corp.selectByText --param 'searchText=%%' --param 'statusCode=%' --param sortType=1 --grid Biz10_Tab_ContCorp` 29=29.
</details>
