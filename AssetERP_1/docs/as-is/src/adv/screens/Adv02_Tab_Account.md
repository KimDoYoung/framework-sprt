# Adv02_Tab_Account

- 종류: 화면
- 메뉴: 펀드관리 > 03. 일임(자문)관리 > 일임계좌 등록 (#1388)
- 파일: `client/vi/adv/Adv02_Tab_Account.java`
- 함께 쓰는 클래스 1개:
  - `Adv02_Edit_Account` `client/vi/adv/Adv02_Edit_Account.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Sys15_Lookup_Corp`](../../sys/components/Sys15_Lookup_Corp.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `adv.Adv02_Account.delete` | Adv02_Edit_Account:213, Adv02_Tab_Account:336 | [`Adv02_Account.java:76`](../../adv/services/Adv02_Account.md) | `UpdateDataModel(adv02_account)` 동적 DELETE |
| `adv.Adv02_Account.selectByManageNamePaging` | Adv02_Tab_Account:91 | [`Adv02_Account.java:32`](../../adv/services/Adv02_Account.md) | [`adv02_account.selectByManageNamePaging`](../../adv/sql/adv02_account.md), [`adv02_account.selectByManageNamePagingTotal`](../../adv/sql/adv02_account.md) |
| `adv.Adv02_Account.update` | Adv02_Edit_Account:191 | [`Adv02_Account.java:44`](../../adv/services/Adv02_Account.md) | [`adv02_account.checkManageCode`](../../adv/sql/adv02_account.md), [`dbConfig.getEncrypts`](../../utils/sql/dbConfig.md), `UpdateDataModel(adv02_account)` 동적 INSERT/UPDATE → [`adv02_account.selectById`](../../adv/sql/adv02_account.md) |

## 테이블

[`adv02_account`](../../../db/tables/adv.md)

## DB 함수

`to_decrypts`, `to_encrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Adv02_Tab_Account (`client/vi/adv/Adv02_Tab_Account.java`, 350줄)

- 레이아웃: center=vlc, south=tabPage
- 툴바 `buttonBar`: 검색: {searchText} {retrieveButton} {insertButton} {copyButton} {tempDownloadButton} {excelUploadButton}
- 입력·하위 화면: `searchText` TextField 빈칸="관리코드/계좌명", `tabPage` Adv02_Edit_Account
- 그리드 `grid` (buildGrid(), 체크박스):
  - manageCode 150 "관리코드" TextCenter
  - manageName 300 "계좌명" Text
  - trCorpName 150 "증권사명" Text
  - accountNoDec 300 "계좌번호" Text
  - startDate 90 "최초설정일자" Date
  - closeDate 90 "해지일자" Date
  - workDate 90 "작업일시" Date
  - worker 90 "작업자" Text

#### 이벤트
[E0] 화면 열림 (생성자 L73-118) → settings(), retrieve()
[E1] searchText.KeyPress [Enter] (L124) → retrieve()
[E2] retrieveButton[조회].Select (L133) → retrieve()
[E3] insertButton[등록].Select (L139) → insertRow()
[E4] copyButton[등록(복사)].Select (L145) → copyInsertRow()
[E5] grid.RowClick (L151) → retrieveEditPage()
[E6] tempDownloadButton[템플릿].Select (L157) → 인라인 L157-162 (new SelectHandler(){ @Override public…)
[E7] uploadExcelForm.SubmitComplete (L168) → retrieve()
[E8] excelUploadButton[엑셀업로드].Select (L174) → excelUpload()
[E9] uploadExcelForm.SubmitComplete (L208) → 인라인 L208-218 (new SubmitCompleteHandler() { @Overri…)
[E10] fileUploadField.Change (L220) → 인라인 L220-225 (new ChangeHandler() { @Override publi…)
[E11] messageBox.DialogHide (L321) → deleteSelectedRow()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private excelUpload() | L198-227 | E8 | 상태 처리 | 업무 |
| private retrieveEditPage() | L229-239 | E5,insertRow | 상태 처리 | 업무 |
| public retrieve() | L241-268 | 생성자,E1,E2,E7 | 상태 처리 | 업무 |
| public insertRow() | L270-284 | E3 | 상태 처리 | 업무 |
| public copyInsertRow() | L286-316 | E4 | 미선택 시 alert "복사할 대상을 선택해주세요." | 업무 |
| public deleteRow() | L318-331 | 공개 메서드 | 확인창 표시 | 업무 |
| private deleteSelectedRow() | L333-345 | E11 | GridDeleteData adv.Adv02_Account.delete(체크된 행 목록) | 업무 |
| private settings() | L120-180 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L182-196 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L347-349 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('manageCd', 150, '관리코드'),  // L185
  gb.text('manageNm', 300, '계좌명'),  // L186
  gb.text('trCorpNm', 150, '증권사명'),  // L188
  gb.text('accountNoDec', 300, '계좌번호'),  // L189 SQL 계산 컬럼(selectByManageNamePaging: TO_DECRYPTS(adv02_account_no))
  gb.date('startDate', 90, '최초설정일자'),  // L190
  gb.date('closeDate', 90, '해지일자'),  // L191
  gb.date('workDate', 90, '작업일시'),  // L192
  gb.text('worker', 90, '작업자'),  // L193
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="register" onClick={copyInsertRow}>등록(복사)</Button>
4. <Button type="download" onClick={() => /* 인라인 L157-162 (new SelectHandler(){ @Override public…) */}>템플릿</Button>
5. <Button type="upload" onClick={excelUpload}>엑셀업로드</Button>

### Adv02_Edit_Account (`client/vi/adv/Adv02_Edit_Account.java`, 228줄)

- 입력·하위 화면: `manageCode` TextField, `manageName` TextField, `accountNoDec` TextField, `startDate` MyDateField, `closeDate` MyDateField, `trCorpName` LookupTriggerField 빈칸="증권사를 선택해주세요", `lookup` Sys15_Lookup_Corp

#### 이벤트
[E0] 화면 열림 (생성자 L64-85) → settings(), getEditor()
[E1] updateButton[저장].Select (L93) → updateRow()
[E2] trCorpName[증권사명].TriggerClick [result != null] (L102) → 인라인 L102-120 (new TriggerClickHandler() { @Override…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private getEditor() | L101-147 | 생성자 | 조회창 Sys15_Lookup_Corp 열기 | 업무 |
| public retrieve() | L149-157 | 공개 메서드 | 상태 처리 | 업무 |
| public updateRow() | L159-207 | E1 | 서비스 adv.Adv02_Account.update | 업무 |
| public deleteRow() | L209-219 | 공개 메서드 | GridDeleteData adv.Adv02_Account.delete(체크된 행 목록) | 업무 |
| public init() | L221-223 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L87-99 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L225-227 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={updateRow}>저장</Button>

