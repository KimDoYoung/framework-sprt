# Fnd01_Lookup_SelectMulti

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `apr`, `crm`, `mkt`, `opr`
- 파일: `client/vi/fnd/Fnd01_Lookup_SelectMulti.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `fnd.Fnd00_Fund.selectBySearchText` | Fnd01_Lookup_SelectMulti:214 | [`Fnd00_Fund.java:32`](../../fnd/services/Fnd00_Fund.md) | [`fnd00_fund.selectBySearchText`](../../fnd/sql/fnd00_fund.md), [`fnd00_fund.selectBySearchTextAdmin`](../../fnd/sql/fnd00_fund.md) |

## 테이블

[`fnd00_fund_sysdate`](../../../db/views.md), [`fnd01_fund_code`](../../../db/tables/fnd.md), [`fnd02_fund_info`](../../../db/tables/fnd.md), [`fnd03_consignment`](../../../db/tables/fnd.md), [`fnd06_office_work`](../../../db/tables/fnd.md), [`fnd08_org_auth`](../../../db/tables/fnd.md), [`fnd09_trust_bank`](../../../db/tables/fnd.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md)

## DB 함수

`f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Fnd01_Lookup_SelectMulti (`client/vi/fnd/Fnd01_Lookup_SelectMulti.java`, 261줄)

- 툴바 `buttonBar`: {radioRealFund} {radioTempFund} 펀드유형: {fundTypeComboBox} 검색: {searchText} {closeYnCheckBox} {classYnCheckBox} {retrieveButton}
- 입력·하위 화면: `searchText` TextField, `fundTypeComboBox` ComboBoxField("IcamFundType", "%", "전체"), `classYnCheckBox` CheckBox, `closeYnCheckBox` CheckBox, `textFundType` TextField, `radioRealFund` Radio, `radioTempFund` Radio
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - fundCode 80 "펀드코드" Text
  - fundName 350 "펀드명" Text
  - kofiaFundTypeName 100 "펀드유형" Text
  - kofiaClassTypeName 80 "클래스구분" Text
  - consignmentName 150 "수탁사" Text
  - startDate 90 "설정일" Date
  - empName1 90 "운용역" Text
  - note 200 "비고" Text

#### 이벤트
[E1] toggleFundType.ValueChange (L97) → retrieve()
[E2] searchText.KeyPress [Enter] (L114) → retrieve()
[E3] retrieveButton[조회].Select (L129) → retrieve()
[E4] okButton[확인].Select (L161) → confirm()
[E5] cancelButton[취소].Select (L169) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public openAdmin() | L67-70 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L72-75 | openAdmin | 상태 처리 | 업무 |
| public open() | L77-180 | openAdmin | 상태 처리 | 업무 |
| private retrieve() | L199-220 | E1,E2,E3,open | 서비스 fnd.Fnd00_Fund.selectBySearchText(companyId, orgId, searchText, fundType, classYn, closeYn, fundIdList, planYn) | 업무 |
| private confirm() | L222-233 | E4 | 미선택 시 alert "조회할 펀드를 선택해주세요" | 업무 |
| public getServiceResult() | L236-244 | 공개 메서드 | 상태 처리 | 업무 |
| public setMulti() | L246-248 | 공개 메서드 | 상태 처리 | 업무 |
| private buildGrid() | L182-197 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L250-252 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L254-256 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L258-260 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('fundCd', 80, '펀드코드'),  // L187
  gb.text('fundNm', 350, '펀드명'),  // L188
  gb.text('kofiaFundTypeNm', 100, '펀드유형'),  // L189
  gb.text('kofiaClassTypeNm', 80, '클래스구분'),  // L190
  gb.text('consignmentNm', 150, '수탁사'),  // L191
  gb.date('startDate', 90, '설정일'),  // L192
  gb.text('emp1Nm', 90, '운용역'),  // L193
  gb.text('note', 200, '비고'),  // L194
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="cancel" onClick={hide}>취소</Button>

