# Sch10_Tab_IpoAdmin

- 종류: 화면
- 메뉴: 기초자료 > 30. 자산&경영 > 공모주 일정등록 (#1293)
- 파일: `client/vi/sch/Sch10_Tab_IpoAdmin.java`
- 함께 쓰는 클래스 2개:
  - `Sch15_Lookup_IpoItemMatching` `client/vi/sch/Sch15_Lookup_IpoItemMatching.java`
  - `Sch12_Lookup_IpoCorp` `client/vi/sch/Sch12_Lookup_IpoCorp.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Com50_Lookup_StkItem`](../../com/components/Com50_Lookup_StkItem.md), [`Sch14_Lookup_IpoMismatch`](../../sch/components/Sch14_Lookup_IpoMismatch.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sch.Sch10_Ipo.delete` | Sch10_Tab_IpoAdmin:378 | [`Sch10_Ipo.java:61`](../../sch/services/Sch10_Ipo.md) | `UpdateDataModel(sch10_ipo)` 동적 DELETE |
| `sch.Sch10_Ipo.selectBySearchTextAdmin` | Sch10_Tab_IpoAdmin:319 | [`Sch10_Ipo.java:31`](../../sch/services/Sch10_Ipo.md) | [`sch10_ipo.selectBySearchTextAdmin`](../../sch/sql/sch10_ipo.md) |
| `sch.Sch10_Ipo.update` | Sch10_Tab_IpoAdmin:333 | [`Sch10_Ipo.java:36`](../../sch/services/Sch10_Ipo.md) | `UpdateDataModel(sch10_ipo)` 동적 INSERT/UPDATE → [`sch10_ipo.selectById`](../../sch/sql/sch10_ipo.md) |
| `sch.Sch12_IpoCorp.delete` | Sch12_Lookup_IpoCorp:177 | [`Sch12_IpoCorp.java:62`](../../sch/services/Sch12_IpoCorp.md) | `UpdateDataModel(sch12_ipo_corp)` 동적 DELETE |
| `sch.Sch12_IpoCorp.selectBySearchText` | Sch12_Lookup_IpoCorp:148 | [`Sch12_IpoCorp.java:23`](../../sch/services/Sch12_IpoCorp.md) | [`sch12_ipo_corp.selectBySearchText`](../../sch/sql/sch12_ipo_corp.md) |
| `sch.Sch12_IpoCorp.update` | Sch12_Lookup_IpoCorp:158 | [`Sch12_IpoCorp.java:57`](../../sch/services/Sch12_IpoCorp.md) | `UpdateDataModel(sch12_ipo_corp)` 동적 INSERT/UPDATE → [`sch12_ipo_corp.selectById`](../../sch/sql/sch12_ipo_corp.md) |
| `sch.Sch15_IpoItemMatching.delete` | Sch15_Lookup_IpoItemMatching:172 | [`Sch15_IpoItemMatching.java:31`](../../sch/services/Sch15_IpoItemMatching.md) | `UpdateDataModel(sch15_ipo_item_matching)` 동적 DELETE |
| `sch.Sch15_IpoItemMatching.selectByText` | Sch15_Lookup_IpoItemMatching:143 | [`Sch15_IpoItemMatching.java:21`](../../sch/services/Sch15_IpoItemMatching.md) | [`sch15_ipo_item_matching.selectByText`](../../sch/sql/sch15_ipo_item_matching.md) |
| `sch.Sch15_IpoItemMatching.update` | Sch15_Lookup_IpoItemMatching:153 | [`Sch15_IpoItemMatching.java:26`](../../sch/services/Sch15_IpoItemMatching.md) | `UpdateDataModel(sch15_ipo_item_matching)` 동적 INSERT/UPDATE → [`sch15_ipo_item_matching.selectById`](../../sch/sql/sch15_ipo_item_matching.md) |

## 테이블

[`icam25_ipo`](../../../db/tables/icam.md), [`sch02_share`](../../../db/tables/sch.md), [`sch10_ipo`](../../../db/tables/sch.md), [`sch11_ipo_company`](../../../db/tables/sch.md), [`sch12_ipo_corp`](../../../db/tables/sch.md), [`sch15_ipo_item_matching`](../../../db/tables/sch.md)

## DB 함수

`f_cdnm`, `f_emp_kor_nm`, `f_org_nm`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sch10_Tab_IpoAdmin (`client/vi/sch/Sch10_Tab_IpoAdmin.java`, 418줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 조회일자: {dateComboBox} {startDate} ~: {closeDate} 시장구분: {marketComboBox} 검색: {searchText} {retrieveButton} {insertButton} {updateButton} {deleteButton} {stkItemButton}
- 툴바 `buttonBar2`: {tempDownloadButton} {downloadForm} {excelUploadButton} {insertHomepageButton} {mismatchButton} {itemMatchingButton} {uploadExcelForm}
- 입력·하위 화면: `searchText` TextField 빈칸="종목명/주간사/발행기관코드", `startDate` MyDateField, `closeDate` MyDateField, `marketComboBox` ComboBoxField("MarketCode", "%", "전체") 빈칸="전체", `dateComboBox` ComboBoxField("IpoScheduleDateType", "수요예측일"), `lookup` Sch14_Lookup_IpoMismatch, `marketCodeComboBox` ComboBoxField("MarketCode"), `lookupIpoCorp` Sch12_Lookup_IpoCorp
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - marketName 100 "시장구분" TextCenter 편집:marketCodeComboBox
  - itemName 250 "종목" Text 편집:TextField
  - issCorpCode 80 "발행기관" TextCenter 편집:TextField
  - demandStartDate 95 "시작일" Date 편집:MyDateField
  - demandCloseDate 95 "종료일" Date 편집:MyDateField
  - subscriptionStartDate 95 "시작일" Date 편집:MyDateField
  - subscriptionCloseDate 95 "종료일" Date 편집:MyDateField
  - payDate 120 "납입(환불)일" Date 편집:MyDateField
  - listDate 120 "상장(예정)일" Date 편집:MyDateField
  - priceBracket 150 "희망공모가" TextCenter 편집:TextField
  - price 80 "공모가" Long 편집:LongField
  - note 250 "주간사" TextArea 편집:TextArea
  - cancelYn 100 "미사용" Boolean

#### 이벤트
[E0] 화면 열림 (생성자 L89-143) → settings(), retrieve()
[E1] searchText.KeyPress [Enter] (L166) → retrieve()
[E2] retrieveButton[조회].Select (L175) → retrieve()
[E3] insertButton[등록].Select (L181) → insertRow()
[E4] updateButton[저장].Select (L187) → update()
[E5] deleteButton[삭제].Select (L193) → deleteRow()
       └ [E14] msgBox.DialogHide [YES] (L371) → 서비스 sch.Sch10_Ipo.delete
[E6] tempDownloadButton[템플릿].Select (L199) → 인라인 L199-204 (new SelectHandler(){ @Override public…)
[E7] excelUploadButton[엑셀업로드].Select (L205) → excelUpload()
[E8] insertHomepageButton[홈페이지 등록].Select (L211) → lookupIpoCorp()
[E9] mismatchButton[미일치내역].Select (L217) → 인라인 L217-223 (new SelectHandler() { @Override publi…)
[E10] itemMatchingButton[종목코드매칭].Select (L224) → 인라인 L224-230 (new SelectHandler() { @Override publi…)
[E11] stkItemButton[주식등록].Select (L231) → 인라인 L231-241 (new SelectHandler() { @Override publi…)
[E12] uploadExcelForm.SubmitComplete (L249) → retrieve()
[E13] marketCodeComboBox[MarketCode].Collapse (L262) → 인라인 L262-269 (new CollapseHandler() { @Override pub…)
[E15] fileUploadField.Change (L400) → 인라인 L400-405 (new ChangeHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L292-328 | 생성자,E1,E2,E12,settings,update | 서비스 sch.Sch10_Ipo.selectBySearchTextAdmin(companyId, dateType, startDate, closeDate, searchText, marketCode, ManagerYn) | 업무 |
| public update() | L331-347 | E4 | 서비스 sch.Sch10_Ipo.update | 업무 |
| public insertRow() | L350-355 | E3 | 상태 처리 | 업무 |
| public deleteRow() | L358-389 | E5 | 미선택 시 alert "삭제대상을 선택해주세요" → 확인창 E14 | 업무 |
| private excelUpload() | L391-408 | E7 | 상태 처리 | 업무 |
| private lookupIpoCorp() | L410-413 | E8 | 조회창 Sch12_Lookup_IpoCorp 열기 | 업무 |
| private settings() | L145-255 | 생성자 | 조회창 Sch14_Lookup_IpoMismatch 열기, 조회창 Sch15_Lookup_IpoItemMatching 열기, 조회창 Com50_Lookup_StkItem 열기, 이벤트 연결, 초기값: startDate=ClientDateUtil.toDate(DateTimeFormat.getFormat("yyyy-01-01", closeDate=ClientDateUtil.toDate(DateTimeFormat.getFormat("yyyy-12-31" | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L257-290 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L415-417 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L271 newHeaderGroupMap05newHeaderGroupConfig12 100 "수요예측일정" (sch10_new_header_group_map05new_header_group_config12 컬럼 없음)
  // ⚠DB없음 L272 newHeaderGroupMap07newHeaderGroupConfig12 100 "청약일정" (sch10_new_header_group_map07new_header_group_config12 컬럼 없음)
  gb.textCenter('marketNm', 100, '시장구분', { editor: 'select' }),  // L275 SQL 계산 컬럼(selectBySearchTextAdmin: f_cdnm('MarketCode', sch10_market_cd, s…)
  gb.text('itemNm', 250, '종목', { editor: 'text' }),  // L276
  gb.textCenter('issCorpCd', 80, '발행기관', { editor: 'text' }),  // L277
  gb.date('demandStartDate', 95, '시작일', { editor: 'date' }),  // L278
  gb.date('demandCloseDate', 95, '종료일', { editor: 'date' }),  // L279
  gb.date('subscriptionStartDate', 95, '시작일', { editor: 'date' }),  // L280
  gb.date('subscriptionCloseDate', 95, '종료일', { editor: 'date' }),  // L281
  gb.date('payDate', 120, '납입(환불)일', { editor: 'date' }),  // L282
  gb.date('listDate', 120, '상장(예정)일', { editor: 'date' }),  // L283
  gb.textCenter('priceBracket', 150, '희망공모가', { editor: 'text' }),  // L284
  gb.long('price', 80, '공모가', { editor: 'number' }),  // L285
  gb.textArea('note', 250, '주간사', { editor: 'largeText' }),  // L286
  gb.boolean('cancelYn', 100, '미사용'),  // L287
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={deleteRow}>삭제</Button>
5. <Button type="register" onClick={() => /* 인라인 L231-241 (new SelectHandler() { @Override publi…) */}>주식등록</Button>
6. <Button type="download" onClick={() => /* 인라인 L199-204 (new SelectHandler(){ @Override public…) */}>템플릿</Button>
7. <Button type="upload" onClick={excelUpload}>엑셀업로드</Button>
8. <Button type="register" onClick={lookupIpoCorp}>홈페이지 등록</Button>
9. <Button type="unknown" onClick={() => /* 인라인 L217-223 (new SelectHandler() { @Override publi…) */}>미일치내역</Button>
10. <Button type="unknown" onClick={() => /* 인라인 L224-230 (new SelectHandler() { @Override publi…) */}>종목코드매칭</Button>

### Sch15_Lookup_IpoItemMatching (`client/vi/sch/Sch15_Lookup_IpoItemMatching.java`, 190줄)

- 툴바 `buttonBar`: {searchText} {retrieveButton} {insertButton} {updateButton} {deleteButton}
- 입력·하위 화면: `searchText` TextField 빈칸="검색어(종목코드/종목명) 입력"
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - itemCode 100 "종목코드" TextCenter 편집:TextField
  - validItemCode 100 "유효한<br>종목코드" TextCenter 편집:TextField
  - itemName 300 "종목명" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L57-123) → show()
[E1] searchText.KeyPress [Enter] (L67) → retrieve()
[E2] retrieveButton[조회].Select (L75) → retrieve()
[E3] insertButton[등록].Select (L81) → insertRow()
[E4] deleteButton[삭제].Select (L87) → deleteRow()
       └ [E7] msgBox.DialogHide [YES] (L165) → 서비스 sch.Sch15_IpoItemMatching.delete
[E5] updateButton[저장].Select (L93) → update()
[E6] cancleButton[닫기].Select (L99) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L53-55 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L138-149 | E1,E2,open | 서비스 sch.Sch15_IpoItemMatching.selectByText(searchText) | 업무 |
| public update() | L151-154 | E5 | 서비스 sch.Sch15_IpoItemMatching.update | 업무 |
| public insertRow() | L156-160 | E3 | 상태 처리 | 업무 |
| public deleteRow() | L162-183 | E4 | ConfirmBox → E7 | 업무 |
| package buildGrid() | L125-136 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L185-187 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('itemCd', 100, '종목코드', { editor: 'text' }),  // L131
  gb.textCenter('validItemCd', 100, '유효한<br>종목코드', { editor: 'text' }),  // L132
  gb.text('itemNm', 300, '종목명', { editor: 'text' }),  // L133
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={deleteRow}>삭제</Button>
5. <Button type="unknown" onClick={hide}>닫기</Button>

### Sch12_Lookup_IpoCorp (`client/vi/sch/Sch12_Lookup_IpoCorp.java`, 195줄)

- 툴바 `buttonBar`: {searchText} {retrieveButton} {insertButton} {updateButton} {deleteButton}
- 입력·하위 화면: `searchText` TextField 빈칸="주간사/홈페이지"
- 그리드 `grid` (buildGrid(), 체크박스):
  - corpName 200 "주간사명" Text 편집:TextField
  - homepage 300 "홈페이지주소" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L57-123) → show()
[E1] searchText.KeyPress [Enter] (L67) → retrieve()
[E2] retrieveButton[조회].Select (L75) → retrieve()
[E3] insertButton[등록].Select (L81) → insertRow()
[E4] deleteButton[삭제].Select (L87) → deleteRow()
       └ [E7] msgBox.DialogHide [YES] (L170) → 서비스 sch.Sch12_IpoCorp.delete
[E5] updateButton[저장].Select (L93) → update()
[E6] cancleButton[닫기].Select (L99) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L53-55 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L136-154 | E1,E2,open | 서비스 sch.Sch12_IpoCorp.selectBySearchText(searchText) | 업무 |
| public update() | L156-159 | E5 | 서비스 sch.Sch12_IpoCorp.update | 업무 |
| public insertRow() | L161-165 | E3 | 상태 처리 | 업무 |
| public deleteRow() | L167-188 | E4 | ConfirmBox → E7 | 업무 |
| private buildGrid() | L125-134 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L190-192 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('corpNm', 200, '주간사명', { editor: 'text' }),  // L130
  gb.text('homepage', 300, '홈페이지주소', { editor: 'text' }),  // L131
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={deleteRow}>삭제</Button>
5. <Button type="unknown" onClick={hide}>닫기</Button>

