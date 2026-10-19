# Biz01_Tab_PriorApprovalSimple

- 종류: 화면
- 메뉴: 준법감시 > 40. 이익제공(수령)현황 > (s)이익제공 상세현황 (#1322)
- 파일: `client/vi/biz/Biz01_Tab_PriorApprovalSimple.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Crm09_Lookup_SelectSingle`](../../crm/components/Crm09_Lookup_SelectSingle.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `biz.Biz01_Promo.selectProvideListSimple` | Biz01_Tab_PriorApprovalSimple:260 | [`Biz01_Promo.java:146`](../../biz/services/Biz01_Promo.md) | [`biz01_promo.selectProvideListSimple`](../../biz/sql/biz01_promo.md) |
| `sys.Sys99_Print.insertRdProvideListSimple` | Biz01_Tab_PriorApprovalSimple:200 | [`Sys99_Print.java:1168`](../../sys/services/Sys99_Print.md) | [`biz01_promo.selectProvideListSimple`](../../biz/sql/biz01_promo.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |

## 테이블

[`biz01_promo`](../../../db/tables/biz.md), [`biz90_limit`](../../../db/tables/biz.md), [`sys01_company`](../../../db/tables/sys.md), [`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_emp_kor_nm`, `f_get_crdmanagerid`, `f_nvl`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Biz01_Tab_PriorApprovalSimple (`client/vi/biz/Biz01_Tab_PriorApprovalSimple.java`, 289줄)

- 레이아웃: north=buttonBar, center=grid
- 툴바 `buttonBar`: 조회기간: {firstDate} ~: {lastDate} 제공/수령: {provideRcvComboBox} 조회구분: {lookupComboBox} {crmName} {retrieveButton} {provideListButton}
- 입력·하위 화면: `firstDate` MyDateField, `lastDate` MyDateField, `provideRcvComboBox` ComboBoxField("ProvideRcvType", "%", "전체"), `lookupComboBox` StringComboBox, `crmName` LookupTriggerField, `lookup` Crm09_Lookup_SelectSingle
- 그리드 `grid` (buildGrid()):
  - provideRcvTypeName 120 "제공/수령" TextCenter
  - regEmpName 120 "제공자" TextCenter
  - provideDate 120 "제공일자" Date
  - providePurName 120 "제공목적" TextCenter
  - provideContentName 120 "제공내용" TextCenter
  - provideCompany 300 "거래상대방" Text
  - pepleCount 80 "인원" LongCenter
  - averagePrice2 120 "인당 경제적가치" Long
  - note 350 "비고" Text

#### 이벤트
[E0] 화면 열림 (생성자 L62-93) → setting()
[E1] lookupComboBox[전체].Collapse (L131) → 인라인 L131-141 (new CollapseHandler() { @Override pub…)
[E2] crmName.TriggerClick (L142) → openLookup()
[E3] retrieveButton[조회].Select (L148) → retrieve()
[E4] provideListButton[출력/다운로드].Select (L154) → provideListRd()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setting() | L95-160 | 생성자 | 상태 처리 | 업무 |
| private provideListRd() | L179-230 | E4 | 서비스 sys.Sys99_Print.insertRdProvideListSimple(companyId, personId, windowClassName, startDate, endDate, provideRcvType, crmName) | 업무 |
| public retrieve() | L232-266 | E3 | 서비스 biz.Biz01_Promo.selectProvideListSimple(companyId, personId, startDate, endDate, provideRcvType, crmName) | 업무 |
| private openLookup() | L268-284 | E2 | 조회창 Crm09_Lookup_SelectSingle 열기 | 업무 |
| public buildGrid() | L162-177 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L286-288 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('provideRcvTypeNm', 120, '제공/수령'),  // L166
  gb.textCenter('regEmpNm', 120, '제공자'),  // L167
  gb.date('provideDate', 120, '제공일자'),  // L168
  gb.textCenter('providePurNm', 120, '제공목적'),  // L169
  gb.textCenter('provideContentNm', 120, '제공내용'),  // L170
  gb.text('provideCompany', 300, '거래상대방'),  // L171
  gb.longCenter('pepleCount', 80, '인원'),  // L172
  gb.long('averagePrice2', 120, '인당 경제적가치'),  // L173
  gb.text('note', 350, '비고'),  // L174
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="download" onClick={provideListRd}>출력/다운로드</Button>

