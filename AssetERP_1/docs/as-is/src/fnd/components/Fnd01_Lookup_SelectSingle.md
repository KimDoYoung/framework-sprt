# Fnd01_Lookup_SelectSingle

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `dcr`
- 파일: `client/vi/fnd/Fnd01_Lookup_SelectSingle.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `fnd.Fnd00_Fund.selectBySearchText` | Fnd01_Lookup_SelectSingle:223 | [`Fnd00_Fund.java:32`](../../fnd/services/Fnd00_Fund.md) | [`fnd00_fund.selectBySearchText`](../../fnd/sql/fnd00_fund.md), [`fnd00_fund.selectBySearchTextAdmin`](../../fnd/sql/fnd00_fund.md) |

## 테이블

[`fnd00_fund_sysdate`](../../../db/views.md), [`fnd01_fund_code`](../../../db/tables/fnd.md), [`fnd02_fund_info`](../../../db/tables/fnd.md), [`fnd03_consignment`](../../../db/tables/fnd.md), [`fnd06_office_work`](../../../db/tables/fnd.md), [`fnd08_org_auth`](../../../db/tables/fnd.md), [`fnd09_trust_bank`](../../../db/tables/fnd.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md)

## DB 함수

`f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Fnd01_Lookup_SelectSingle (`client/vi/fnd/Fnd01_Lookup_SelectSingle.java`, 268줄)

- 툴바 `buttonBar`: {radioRealFund} {radioTempFund} 펀드유형: {fundTypeComboBox} 검색: {searchText} {closeYnCheckBox} {classYnCheckBox} {retrieveButton}
- 입력·하위 화면: `searchText` TextField, `fundTypeComboBox` ComboBoxField("IcamFundType", "%", "전체"), `closeYnCheckBox` CheckBox, `classYnCheckBox` CheckBox, `textFundType` TextField, `radioRealFund` Radio, `radioTempFund` Radio
- 그리드 `grid` (buildGrid(), 체크박스):
  - fundCode 80 "펀드코드" Text
  - fundName 350 "펀드명" Text
  - kofiaFundTypeName 100 "펀드유형" Text
  - kofiaClassTypeName 80 "클래스구분" Text
  - kofiaTrustName 150 "수탁사" Text
  - startDate 90 "설정일" Date
  - empName1 90 "운용역" Text
  - note 200 "비고" Text

#### 이벤트
[E1] noneButton[전체].Select (L75) → hide()
[E2] toggleFundType.ValueChange (L103) → retrieve()
[E3] grid.RowDoubleClick (L118) → confirm()
[E4] searchText.KeyPress [Enter] (L127) → retrieve()
[E5] retrieveButton[조회].Select (L142) → retrieve()
[E6] okButton[확인].Select (L173) → confirm()
[E7] cancelButton[취소].Select (L179) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L68-71 | openNone | 상태 처리 | 업무 |
| public openNone() | L73-84 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L86-192 | openNone | 상태 처리 | 업무 |
| private retrieve() | L211-229 | E2,E4,E5,open | 서비스 fnd.Fnd00_Fund.selectBySearchText(companyId, orgId, searchText, fundType, classYn, closeYn, fundIdList, planYn) | 업무 |
| private confirm() | L231-240 | E3,E6 | 미선택 시 alert "선택된 펀드가 없습니다" | 업무 |
| public getServiceResult() | L243-251 | 공개 메서드 | 상태 처리 | 업무 |
| public setMulti() | L253-255 | 공개 메서드 | 상태 처리 | 업무 |
| private buildGrid() | L194-209 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L257-259 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L261-263 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L265-267 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('fundCd', 80, '펀드코드'),  // L199
  gb.text('fundNm', 350, '펀드명'),  // L200
  gb.text('kofiaFundTypeNm', 100, '펀드유형'),  // L201
  gb.text('kofiaClassTypeNm', 80, '클래스구분'),  // L202
  gb.text('kofiaTrustNm', 150, '수탁사'),  // L203
  gb.date('startDate', 90, '설정일'),  // L204
  gb.text('emp1Nm', 90, '운용역'),  // L205
  gb.text('note', 200, '비고'),  // L206
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="cancel" onClick={hide}>취소</Button>
4. <Button type="unknown" onClick={hide}>전체</Button>

