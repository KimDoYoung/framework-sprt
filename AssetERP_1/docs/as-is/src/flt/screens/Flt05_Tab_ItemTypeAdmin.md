# Flt05_Tab_ItemTypeAdmin

- 종류: 화면
- 메뉴: 기초자료 > 00. 내부통제 > 임직원매매 종목유형관리 (#1267)
- 파일: `client/vi/flt/Flt05_Tab_ItemTypeAdmin.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Sys01_Lookup_Company`](../../sys/components/Sys01_Lookup_Company.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `flt.Flt05_ItemType.delete` | Flt05_Tab_ItemTypeAdmin:399 | [`Flt05_ItemType.java:76`](../../flt/services/Flt05_ItemType.md) | `UpdateDataModel(flt05_item_type)` 동적 DELETE |
| `flt.Flt05_ItemType.insertInitData` | Flt05_Tab_ItemTypeAdmin:305 | [`Flt05_ItemType.java:58`](../../flt/services/Flt05_ItemType.md) | [`flt05_item_type.insertInitData`](../../flt/sql/flt05_item_type.md) |
| `flt.Flt05_ItemType.selectBySearchText` | Flt05_Tab_ItemTypeAdmin:331 | [`Flt05_ItemType.java:24`](../../flt/services/Flt05_ItemType.md) | [`flt05_item_type.selectBySearchText`](../../flt/sql/flt05_item_type.md) |
| `flt.Flt05_ItemType.update` | Flt05_Tab_ItemTypeAdmin:362 | [`Flt05_ItemType.java:71`](../../flt/services/Flt05_ItemType.md) | `UpdateDataModel(flt05_item_type)` 동적 INSERT/UPDATE → [`flt05_item_type.selectById`](../../flt/sql/flt05_item_type.md) |

## 테이블

[`flt05_item_type`](../../../db/tables/flt.md), [`sys01_company`](../../../db/tables/sys.md)

## DB 함수

`f_create_seq`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Flt05_Tab_ItemTypeAdmin (`client/vi/flt/Flt05_Tab_ItemTypeAdmin.java`, 411줄)

- 레이아웃: center=centerVlc, east=eastVlc
- 툴바 `buttonBarL`: 검색: {searchText} {retrieveButton} {insertButton} {updateButton} {deleteButton}
- 툴바 `buttonBarR`: 고객사: {companyField} {retrieveRButton} {insertRButton} {copyButton} {updateRButton} {deleteRButton}
- 입력·하위 화면: `searchText` TextField, `companyField` LookupTriggerField, `lookupCompany` Sys01_Lookup_Company
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - itemTypeCode 40 "코드" TextCenter 편집:TextField
  - itemTypeName 200 "유형명" Text 편집:TextField
  - seq 40 "순서" LongCenter 편집:LongField
  - startDate 90 "적용시작일" Date 편집:MyDateField
  - targetYn 80 "신고대상" Boolean
  - sellPreApprYn 80 "매도<br>사전승인" Boolean
  - lockUpCheckYn 95 "의무보유기간<br>체크여부" Boolean
  - stkPriceYn 95 "주식시세적용" Boolean
  - listStkYn 95 "상장지분증권" Boolean
- 그리드 `tgtGrid` (tgtBuildGrid()):
  - companyName 100 "고객사명" Text
  - itemTypeCode 40 "유형" TextCenter 편집:TextField
  - itemTypeName 200 "유형명" Text 편집:TextField
  - seq 40 "순서" LongCenter 편집:LongField
  - startDate 90 "적용시작일" Date 편집:MyDateField
  - targetYn 80 "신고대상" Boolean
  - sellPreApprYn 80 "매도<br>사전승인" Boolean
  - lockUpCheckYn 95 "의무보유기간<br>체크여부" Boolean
  - stkPriceYn 95 "주식시세적용" Boolean
  - listStkYn 95 "상장지분증권" Boolean

#### 이벤트
[E0] 화면 열림 (생성자 L75-123) → settings(), retrieve()
[E1] searchText.KeyPress [Enter] (L127) → retrieve()
[E2] companyField.TriggerClick [result != null] (L138) → retrieveCompany()
[E3] retrieveButton[조회].Select (L160) → retrieve()
[E4] insertButton[등록].Select (L166) → insertRow()
[E5] updateButton[저장].Select (L172) → update()
[E6] deleteButton[삭제].Select [YES] (L178) → deleteRow()
[E7] msgBox.DialogHide [YES] (L187) → deleteRow()
[E8] retrieveRButton[조회].Select (L204) → retrieveCompany()
[E9] insertRButton[등록].Select (L210) → insertRowCompany()
[E10] updateRButton[저장].Select (L216) → updateCompany()
[E11] deleteRButton[삭제].Select [YES] (L222) → deleteRowCompany()
[E12] msgBox.DialogHide [YES] (L231) → deleteRowCompany()
[E13] copyButton[등록(복사)].Select (L248) → initData()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public tgtBuildGrid() | L275-292 | 필드 초기화 | 상태 처리 | 업무 |
| private initData() | L294-321 | E13 | 미선택 시 alert "고객사를 선택해주세요", 서비스 flt.Flt05_ItemType.insertInitData(companyId) | 업무 |
| public retrieve() | L323-337 | 생성자,E1,E3 | 서비스 flt.Flt05_ItemType.selectBySearchText(companyId, searchText) | 업무 |
| public retrieveCompany() | L338-357 | E2,E8,initData | 서비스 flt.Flt05_ItemType.selectBySearchText(companyId, searchText) | 업무 |
| public update() | L360-363 | E5 | 서비스 flt.Flt05_ItemType.update | 업무 |
| private updateCompany() | L365-368 | E10 | 서비스 flt.Flt05_ItemType.update | 업무 |
| public insertRow() | L371-378 | E4 | 상태 처리 | 업무 |
| private insertRowCompany() | L380-393 | E9 | 상태 처리 | 업무 |
| public deleteRow() | L396-400 | E6,E7 | GridDeleteData flt.Flt05_ItemType.delete(체크된 행 목록) | 업무 |
| private deleteRowCompany() | L402-406 | E11,E12 | GridDeleteData flt.Flt05_ItemType.delete(체크된 행 목록) | 업무 |
| private settings() | L125-254 | 생성자 | 조회창 Sys01_Lookup_Company 열기, 확인창 표시, 이벤트 연결, 초기값: companyField=companyModel.getCompanyName(, companyField=null | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L256-273 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L408-410 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('itemTypeCd', 40, '코드', { editor: 'text' }),  // L262
  gb.text('itemTypeNm', 200, '유형명', { editor: 'text' }),  // L263
  gb.longCenter('seq', 40, '순서', { editor: 'number' }),  // L264
  gb.date('startDate', 90, '적용시작일', { editor: 'date' }),  // L265
  gb.boolean('targetYn', 80, '신고대상'),  // L266
  gb.boolean('sellPreApprYn', 80, '매도<br>사전승인'),  // L267
  gb.boolean('lockUpCheckYn', 95, '의무보유기간<br>체크여부'),  // L268
  gb.boolean('stkPriceYn', 95, '주식시세적용'),  // L269
  gb.boolean('listStkYn', 95, '상장지분증권'),  // L270
];

const tgtBuildGrid = () => [
  gb.text('companyNm', 100, '고객사명'),  // L280 SQL 계산 컬럼(selectBySearchText: sys01_company_nm)
  gb.textCenter('itemTypeCd', 40, '유형', { editor: 'text' }),  // L281
  gb.text('itemTypeNm', 200, '유형명', { editor: 'text' }),  // L282
  gb.longCenter('seq', 40, '순서', { editor: 'number' }),  // L283
  gb.date('startDate', 90, '적용시작일', { editor: 'date' }),  // L284
  gb.boolean('targetYn', 80, '신고대상'),  // L285
  gb.boolean('sellPreApprYn', 80, '매도<br>사전승인'),  // L286
  gb.boolean('lockUpCheckYn', 95, '의무보유기간<br>체크여부'),  // L287
  gb.boolean('stkPriceYn', 95, '주식시세적용'),  // L288
  gb.boolean('listStkYn', 95, '상장지분증권'),  // L289
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={deleteRow}>삭제</Button>
5. <Button type="search" onClick={retrieveCompany}>조회</Button>
6. <Button type="register" onClick={insertRowCompany}>등록</Button>
7. <Button type="register" onClick={initData}>등록(복사)</Button>
8. <Button type="save" onClick={updateCompany}>저장</Button>
9. <Button type="delete" onClick={deleteRowCompany}>삭제</Button>

