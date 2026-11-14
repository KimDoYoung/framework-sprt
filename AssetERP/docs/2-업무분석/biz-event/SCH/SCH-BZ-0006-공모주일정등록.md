# SCH-BZ-0006 ADMIN이 공모주 일정을 등록한다(엑셀·주간사·종목매칭·미일치)

> **한 줄 요약** — ADMIN(회사 0)이 #1293 공모주 일정등록에서 **모든 회사가 함께 보는** 공모주 일정(`sch10_ipo`: 시장·종목명·발행기관코드·수요예측·청약·납입·상장일·희망공모가·공모가·철회)을 [등록]·[저장]하거나 **[템플릿] → [엑셀업로드]**로 한꺼번에 올린다(시장+종목명이 같으면 갱신). **[홈페이지 등록]**으로 주간사 홈페이지(`sch12_ipo_corp`), **[종목코드매칭]**으로 발행기관코드 ↔ 실제 종목코드(`sch15_ipo_item_matching`), **[미일치내역]**으로 크롤링한 공모주(`sch13`)와 등록한 일정이 다른 것(`sch14_ipo_mismatch`)을 보고 확인완료한다.

| 항목 | 내용 |
|:---|:---|
| 누가 | ADMIN(`admin/admin/1111`) |
| 언제 | 공모 일정이 나올 때(수시) |
| 먼저 있어야 하는 것 | — |
| 다음 이벤트 | 0007(회사 직원이 봄), FND-BZ-0008(수요예측·청약) |
| 실제 실행 | 2026-11-14, API. `PUT /sch/ipos` `ZZ에너지(시험)` +1 → 엑셀 2행(같은 이름 갱신 공모가 9,500 + `ZZ로보틱스(시험)` 새로) `POST /sch/ipos/excel` → 2건, `sch10` +1. 목록 AS-IS `sch10_ipo.selectBySearchTextAdmin` 3 = 3(13열). 주간사 `ZZ증권` +1·종목매칭 +1. 미일치 17행(조회 때마다 DB 함수가 새로 만듦) 확인완료 → 되돌림. 끝에 시험 공모주 2건·주간사·매칭 삭제. kalpa 401의 `PUT ipos`·`ipo-corps`·`ipo-mismatches` → 403 |
| 메뉴 | #1293 기초자료 > 30. 자산&경영 > 공모주 일정등록 (ADMIN만). 화면 눈 확인 `대기(일괄)` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | ADMIN | #1293 | 조회일자(수요예측 등)·기간·시장·검색 → [조회] (`GET /sch/ipos?dateType=1&startDate=&closeDate=`) | 공모주 일정 |
| 2 | 〃 | 〃 | [등록] → 칸 입력 → [저장] (`PUT /sch/ipos`) | 저장 |
| 3 | 〃 | 〃 | [템플릿](`GET /sch/ipos/template`) → 채움 → [엑셀업로드] (`POST /sch/ipos/excel`, 파트 이름 `excelUpload`, 2행부터 13칸) | "N건" → 다시 조회 |
| 4 | 〃 | 〃 | [홈페이지 등록] → 주간사·홈페이지 (`PUT /sch/ipo-corps`) | 주간사 목록 |
| 5 | 〃 | 〃 | [종목코드매칭] → 발행기관코드·실제 종목코드 (`PUT /sch/ipo-item-matchings`) | 매칭 |
| 6 | 〃 | 〃 | [미일치내역] → 미확인만 (`GET /sch/ipo-mismatches?checkYn=true`) → 확인완료 [저장] (`PUT`) | 미일치 목록 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `sch10_ipo` | 공모주 일정(회사 0) — 주간사는 엑셀 때 비고에 들어감 | +2 → 지움 |
| `sch12_ipo_corp` · `sch15_ipo_item_matching` | 주간사 · 종목매칭 | +1 · +1 → 지움 |
| `sch14_ipo_mismatch` | 미일치(`f_create_ipoMismatch()`가 조회마다 미확인 행을 지우고 다시 만듦) | 17행 그대로 |

## 업무 규칙 · 주의

- 쓰기는 ADMIN·KFS 관리자(`isSysAdmin`)만, 읽기는 모두(공통 자료).
- 엑셀은 한 행이라도 틀리면 전체 롤백. 날짜 칸은 날짜 값 또는 `yyyy-MM-dd`·`yyyyMMdd` 글자.
- **미일치의 "공모주일정 없음" 행은 확인완료해도 다음 조회에 다시 미확인으로 생긴다**, 조회마다 ID가 바뀐다 → [#252](../../보안_및_버그_의심.md).
- **공모주를 지워도 회사별 설정(`sch11`)·공유자가 남는다** → [#253](../../보안_및_버그_의심.md).

<details><summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: SCH-BZ-0006
company: admin (회사 0)
user: admin
steps:
  - {no: 1, api: PUT /api/v1/sch/ipos, body: [{marketCode: "2", itemName: "ZZ에너지(시험)", issCorpCode: ZZ001, demandStartDate: 2026-12-01, demandCloseDate: 2026-12-02, subscriptionStartDate: 2026-12-07, subscriptionCloseDate: 2026-12-08, payDate: 2026-12-10, listDate: 2026-12-16, priceBracket: "8,000 ~ 10,000 원", cancelYn: false}], expect: sch10_ipo +1}
  - {no: 2, api: POST /api/v1/sch/ipos/excel, form: "excelUpload=@ipo-upload.xlsx (2행)", expect: "data 2, sch10_ipo +1"}
  - {no: 3, api: GET /api/v1/sch/ipos?dateType=1&startDate=2026-11-01&closeDate=2026-12-31, expect: rows 3}
  - {no: 4, api: PUT /api/v1/sch/ipo-corps, body: [{corpName: ZZ증권, homepage: "https://zz-sec.example"}]}
  - {no: 5, api: GET /api/v1/sch/ipo-mismatches?checkYn=true, expect: rows 17}
  - {no: 6, user: "kalpa 401", api: PUT /api/v1/sch/ipos, expect: 403}
```
</details>

<details><summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Sch10_Tab_IpoAdmin`(E3 조회·E5 저장·E6 삭제·E7 템플릿·E8 엑셀·E9 홈페이지·E10 미일치·E11 종목매칭·E12 주식등록), `ExcelUpload.ipoUpload` L2124-2211, `Sch10_Ipo.update` L41-64(공유자 기본값 넣기는 2023-08 주석 처리), DB 함수 `f_create_ipomismatch`.
- TOBE: `SchIpoService.update`·`delete` L70-94·`upload` L223-258, `SchIpoCorpService`, `SchIpoItemMatchingService`, `SchIpoMismatchService` L29-50.
- 확인: `compare GET /sch/ipos --sql sch10_ipo.selectBySearchTextAdmin`(ManagerYn true) 3 = 3.
</details>
