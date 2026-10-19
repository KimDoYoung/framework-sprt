# Biz01_Tab_PriorApproval

- 종류: 화면
- 메뉴: 준법감시 > 40. 이익제공(수령)현황 > 이익제공 상세현황 (#1136)
- 파일: `client/vi/biz/Biz01_Tab_PriorApproval.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Emp00_Lookup_SelectSingle`](../../emp/components/Emp00_Lookup_SelectSingle.md), [`Mkt01_Lookup_Select2`](../../mkt/components/Mkt01_Lookup_Select2.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `biz.Biz01_Promo.selectProvideList` | Biz01_Tab_PriorApproval:305 | [`Biz01_Promo.java:141`](../../biz/services/Biz01_Promo.md) | [`biz01_promo.selectProvideList`](../../biz/sql/biz01_promo.md) |
| `sys.Sys99_Print.insertRdProvideList` | Biz01_Tab_PriorApproval:228 | [`Sys99_Print.java:1106`](../../sys/services/Sys99_Print.md) | [`biz01_promo.selectProvideList`](../../biz/sql/biz01_promo.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |

## 테이블

[`biz01_promo`](../../../db/tables/biz.md), [`biz02_person`](../../../db/tables/biz.md), [`biz90_limit`](../../../db/tables/biz.md), [`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_emp_kor_nm`, `f_get_crdmanagerid`, `f_get_emptrans`, `f_nvl`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Biz01_Tab_PriorApproval (`client/vi/biz/Biz01_Tab_PriorApproval.java`, 369줄)

- 레이아웃: north=buttonBar, center=grid
- 툴바 `buttonBar`: 조회기간: {firstDate} ~: {lastDate} 제공/수령: {provideRcvComboBox} 제공(수령)자: {empNameLookupField} 거래상대방: {lookupComboBox} {crmNameLookupField} {retrieveButton} {provideListButton}
- 입력·하위 화면: `firstDate` MyDateField, `lastDate` MyDateField, `provideRcvComboBox` ComboBoxField("ProvideRcvType"), `lookupComboBox` StringComboBox, `empNameLookupField` LookupTriggerField 빈칸="전체", `crmNameLookupField` LookupTriggerField 빈칸="전체", `lookup` Emp00_Lookup_SelectSingle
- 그리드 `grid` (buildGrid()):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - provideDate 100 "일자" Date
  - orgName 150 "제공(수령)부서" Text
  - regEmpName 150 "제공(수령)자" TextCenter
  - providePurName 100 "목적" TextCenter
  - provideContentName 100 "내용" TextCenter
  - targetName 300 "거래상대방" Text
  - targetCompanyName 200 "회사" Text
  - targetEmpName 100 "직원" Text
  - targetOrgName 150 "부서" Text
  - averagePrice 120 "인당 경제적가치" Long
  - note 350 "비고" Text

#### 이벤트
[E0] 화면 열림 (생성자 L71-105) → setting()
[E1] provideRcvComboBox[ProvideRcvType].Collapse (L132) → retrieve()
[E2] lookupComboBox[전체].Collapse (L151) → 인라인 L151-161 (new CollapseHandler() { @Override pub…)
[E3] crmNameLookupField.TriggerClick (L164) → openMktLookup()
[E4] empNameLookupField.TriggerClick (L171) → openEmpLookup()
[E5] retrieveButton[조회].Select (L177) → retrieve()
[E6] provideListButton[출력/다운로드].Select (L183) → provideListRd()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setting() | L107-189 | 생성자 | 상태 처리 | 업무 |
| private provideListRd() | L215-278 | E6 | 서비스 sys.Sys99_Print.insertRdProvideList(companyId, personId, windowClassName, startDate, endDate, provideRcvType, crmName, empId) | 업무 |
| public retrieve() | L280-311 | E1,E5 | 서비스 biz.Biz01_Promo.selectProvideList(companyId, personId, startDate, endDate, provideRcvType, crmName, empId) | 업무 |
| private openEmpLookup() | L313-328 | E4 | 조회창 Emp00_Lookup_SelectSingle 열기 | 업무 |
| private openMktLookup() | L330-364 | E3 | 조회창 Mkt01_Lookup_Select2 열기 | 업무 |
| public buildGrid() | L191-213 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L366-368 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L195 newHeaderGroupMap07newHeaderGroupConfig13 100 "거래상대방" (ast06_new_header_group_map07new_header_group_config13 컬럼 없음)
  gb.date('provideDate', 100, '일자'),  // L198
  gb.text('orgNm', 150, '제공(수령)부서'),  // L199
  gb.textCenter('regEmpNm', 150, '제공(수령)자'),  // L200
  gb.textCenter('providePurNm', 100, '목적'),  // L201
  gb.textCenter('provideContentNm', 100, '내용'),  // L202
  gb.text('targetNm', 300, '거래상대방'),  // L203
  gb.text('targetCompanyNm', 200, '회사'),  // L204
  gb.text('targetEmpNm', 100, '직원'),  // L205
  gb.text('targetOrgNm', 150, '부서'),  // L206
  gb.long('averagePrice', 120, '인당 경제적가치'),  // L207
  gb.text('note', 350, '비고'),  // L208
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="download" onClick={provideListRd}>출력/다운로드</Button>

