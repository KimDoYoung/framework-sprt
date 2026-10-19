# Adv11_Tab_BookExtr

- 종류: 화면
- 메뉴: 펀드관리 > 03. 일임(자문)관리 > 일임보유주식등록(타사무) (#1427)
- 파일: `client/vi/adv/Adv11_Tab_BookExtr.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Com50_Lookup_StkItem`](../../com/components/Com50_Lookup_StkItem.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `adv.Adv11_BookExtr.delete` | Adv11_Tab_BookExtr:301 | [`Adv11_BookExtr.java:44`](../../adv/services/Adv11_BookExtr.md) | `UpdateDataModel(adv11_book_extr)` 동적 DELETE |
| `adv.Adv11_BookExtr.selectByStdDate` | Adv11_Tab_BookExtr:230 | [`Adv11_BookExtr.java:22`](../../adv/services/Adv11_BookExtr.md) | [`adv11_book_extr.selectByStdDate`](../../adv/sql/adv11_book_extr.md) |
| `adv.Adv11_BookExtr.selectRecentStdDate` | Adv11_Tab_BookExtr:315 | [`Adv11_BookExtr.java:28`](../../adv/services/Adv11_BookExtr.md) | [`adv11_book_extr.selectRecentStdDate`](../../adv/sql/adv11_book_extr.md) |
| `adv.Adv11_BookExtr.update` | Adv11_Tab_BookExtr:279 | [`Adv11_BookExtr.java:39`](../../adv/services/Adv11_BookExtr.md) | `UpdateDataModel(adv11_book_extr)` 동적 INSERT/UPDATE → [`adv11_book_extr.selectById`](../../adv/sql/adv11_book_extr.md) |

## 테이블

[`adv11_book_extr`](../../../db/tables/adv.md)

## DB 함수

`f_cdnm`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Adv11_Tab_BookExtr (`client/vi/adv/Adv11_Tab_BookExtr.java`, 354줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 기준일: {stdDate} 검색: {searchText} {retrieveButton} {insertRowButton} {updateButton} {deleteButton} {tempDownloadButton} {excelUploadButton} {downloadForm} {uploadExcelForm}
- 입력·하위 화면: `stdDate` MyDateField, `searchText` TextField 빈칸="관리계좌코드/관리계좌명/종목코드/종목명", `lookupItemField` LookupTriggerField, `lookup` Com50_Lookup_StkItem
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - stdDate 100 "기준일" Date 편집:MyDateField
  - manageCode 100 "관리계좌코드" TextCenter 편집:TextField
  - manageName 350 "관리계좌명" Text 편집:TextField
  - itemCode 150 "종목코드" TextCenter 편집:lookupItemField
  - itemName 350 "종목명" Text

#### 이벤트
[E0] 화면 열림 (생성자 L80-112) → settings(), retrieve()
[E1] searchText.KeyPress [Enter] (L128) → retrieve()
[E2] retrieveButton[조회].Select (L137) → retrieve()
[E3] insertRowButton[등록].Select (L143) → insertRow()
[E4] updateButton[저장].Select (L149) → update()
[E5] deleteButton[삭제].Select (L155) → delete()
       └ [E10] messageBox.DialogHide (L295) → 서비스 adv.Adv11_BookExtr.delete, 메시지 "삭제가 완료되었습니다"
[E6] excelUploadButton[엑셀업로드].Select (L161) → excelUpload()
[E7] tempDownloadButton[템플릿].Select (L168) → 인라인 L168-173 (new SelectHandler(){ @Override public…)
[E8] uploadExcelForm.SubmitComplete (L175) → retrieve()
[E9] lookupItemField.TriggerClick (L192) → lookupItem()
[E11] fileUploadField.Change (L341) → 인라인 L341-346 (new ChangeHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private lookupItem() | L210-221 | E9 | 조회창 Com50_Lookup_StkItem 열기 | 업무 |
| private retrieve() | L223-236 | 생성자,E1,E2,E8,setStdDate | 서비스 adv.Adv11_BookExtr.selectByStdDate(companyId, stdDate, searchText) | 업무 |
| private insertRow() | L238-245 | E3 | 상태 처리 | 업무 |
| private update() | L247-291 | E4 | 서비스 adv.Adv11_BookExtr.update | 업무 |
| private delete() | L293-312 | E5 | ConfirmBox → E10 | 업무 |
| private setStdDate() | L314-330 | settings | 서비스 adv.Adv11_BookExtr.selectRecentStdDate(companyId, stdDate) | 업무 |
| private excelUpload() | L332-349 | E6 | 상태 처리 | 업무 |
| private settings() | L114-187 | 생성자 | 이벤트 연결, 초기값: stdDate=LoginUser.getToday( | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L189-208 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L351-353 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('stdDate', 100, '기준일', { editor: 'date' }),  // L201
  gb.textCenter('manageCd', 100, '관리계좌코드', { editor: 'text' }),  // L202
  gb.text('manageNm', 350, '관리계좌명', { editor: 'text' }),  // L203
  gb.textCenter('itemCd', 150, '종목코드'),  // L204
  gb.text('itemNm', 350, '종목명'),  // L205
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={delete}>삭제</Button>
5. <Button type="download" onClick={() => /* 인라인 L168-173 (new SelectHandler(){ @Override public…) */}>템플릿</Button>
6. <Button type="upload" onClick={excelUpload}>엑셀업로드</Button>

