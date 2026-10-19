# Fnd32_Tab_Account

- 종류: 화면
- 메뉴: 펀드관리 > 04. 공모주청약 > 공모주 참여계좌 관리 (#1290)
- 파일: `client/vi/fnd/Fnd32_Tab_Account.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Sys15_Lookup_Corp`](../../sys/components/Sys15_Lookup_Corp.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `fnd.Fnd32_Account.copyUpdate` | Fnd32_Tab_Account:394 | [`Fnd32_Account.java:50`](../../fnd/services/Fnd32_Account.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`fnd32_account.encrypts`](../../fnd/sql/fnd32_account.md), `UpdateDataModel(fnd32_account)` 동적 INSERT/UPDATE → [`fnd32_account.selectById`](../../fnd/sql/fnd32_account.md) |
| `fnd.Fnd32_Account.delete` | Fnd32_Tab_Account:450 | [`Fnd32_Account.java:71`](../../fnd/services/Fnd32_Account.md) | `UpdateDataModel(fnd32_account)` 동적 DELETE |
| `fnd.Fnd32_Account.selectByText` | Fnd32_Tab_Account:305 | [`Fnd32_Account.java:26`](../../fnd/services/Fnd32_Account.md) | [`fnd32_account.selectByText`](../../fnd/sql/fnd32_account.md) |
| `fnd.Fnd32_Account.updateList` | Fnd32_Tab_Account:328 | [`Fnd32_Account.java:36`](../../fnd/services/Fnd32_Account.md) | [`fnd32_account.encrypts`](../../fnd/sql/fnd32_account.md), `UpdateDataModel(fnd32_account)` 동적 INSERT/UPDATE → [`fnd32_account.selectById`](../../fnd/sql/fnd32_account.md) |

## 테이블

[`fnd32_account`](../../../db/tables/fnd.md)

## DB 함수

`f_cdnm`, `f_get_corp_nm`, `f_sysdate`, `f_today`, `to_decrypts`, `to_encrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Fnd32_Tab_Account (`client/vi/fnd/Fnd32_Tab_Account.java`, 456줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 검색: {searchTextField} 계좌상태: {accountSComboBox} {retrieveButton} {copyButton} {insertButton} {updateButton} {deleteButton} {tempDownloadButton} {downloadForm} {excelUploadButton} {uploadExcelForm}
- 입력·하위 화면: `searchTextField` TextField 빈칸="증권사/운용대상/구분/계좌번호/은행연계계좌/비고", `accountSComboBox` ComboBoxField("AccountStateCode", "%", "전체"), `corpLookup` LookupTriggerField, `lookupCorp` Sys15_Lookup_Corp, `bankCorpLookup` LookupTriggerField, `accountStateComboBox` ComboBoxField("AccountStateCode"), `accountCode1ComboBox` ComboBoxField("Fnd32Code1"), `accountCode2ComboBox` ComboBoxField("Fnd32Code2"), `ipoOutComboBox` ComboBoxField("IpoOutCode")
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - setupDate 100 "개설일자" Date 편집:MyDateField
  - corpName 120 "증권사" Text 편집:corpLookup
  - branch 120 "관리점" Text 편집:TextField
  - accountName1 100 "운용대상" Text 편집:accountCode1ComboBox
  - accountName2 100 "구분" Text 편집:accountCode2ComboBox
  - accountName 150 "계좌명" Text 편집:TextField
  - decAccountNo 150 "계좌번호" Text 편집:TextField
  - bankCorpName 100 "연계은행" Text 편집:bankCorpLookup
  - decBankLinkNo 150 "은행연계계좌" Text 편집:TextField
  - accountStateName 80 "상태" Text 편집:accountStateComboBox
  - ipoOutName 120 "상장일출고" Text 편집:ipoOutComboBox
  - managerTel 120 "담당자연락처" Text 편집:TextField
  - note 280 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L84-119) → settings()
[E1] searchTextField.KeyPress [Enter] (L124) → retrieve()
[E2] retrieveButton[조회].Select (L141) → retrieve()
[E3] insertButton[등록].Select (L147) → insertRow()
[E4] copyButton[등록(복사)].Select (L153) → copyInsertRow()
[E5] updateButton[저장].Select (L159) → update()
[E6] deleteButton[삭제].Select (L165) → deleteChk()
       └ [E17] msgBox.DialogHide [YES] (L429) → deleteRow()
[E7] tempDownloadButton[템플릿].Select (L171) → 인라인 L171-176 (new SelectHandler(){ @Override public…)
[E8] excelUploadButton[엑셀업로드].Select (L177) → excelUpload()
[E9] uploadExcelForm.SubmitComplete (L189) → retrieve()
[E10] corpLookup.TriggerClick [result == null] (L200) → 인라인 L200-219 (new TriggerClickHandler(){ @Override …)
[E11] bankCorpLookup.TriggerClick [result == null] (L222) → 인라인 L222-241 (new TriggerClickHandler(){ @Override …)
[E12] accountStateComboBox[AccountStateCode].Collapse (L243) → 인라인 L243-250 (new CollapseHandler() { @Override pub…)
[E13] accountCode1ComboBox[Fnd32Code1].Collapse (L253) → 인라인 L253-260 (new CollapseHandler() { @Override pub…)
[E14] accountCode2ComboBox[Fnd32Code2].Collapse (L262) → 인라인 L262-269 (new CollapseHandler() { @Override pub…)
[E15] ipoOutComboBox[IpoOutCode].Collapse (L271) → 인라인 L271-278 (new CollapseHandler() { @Override pub…)
[E16] fileUploadField.Change (L416) → 인라인 L416-421 (new ChangeHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L299-311 | E1,E2,E9,settings,update | 서비스 fnd.Fnd32_Account.selectByText(searchText, companyId, accountStateCode), 건수 표시 | 업무 |
| public update() | L314-340 | E5 | 서비스 fnd.Fnd32_Account.updateList | 업무 |
| public insertRow() | L343-351 | E3 | 상태 처리 | 업무 |
| public copyInsertRow() | L353-391 | E4 | 상태 처리 | 업무 |
| public copyUpdateRow() | L393-404 | copyInsertRow | 서비스 fnd.Fnd32_Account.copyUpdate | 업무 |
| private excelUpload() | L406-424 | E8 | 상태 처리 | 업무 |
| private deleteChk() | L426-444 | E6 | ConfirmBox → E17 | 업무 |
| public deleteRow() | L447-451 | E17 | GridDeleteData fnd.Fnd32_Account.delete(체크된 행 목록) | 업무 |
| private settings() | L121-195 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L197-296 | 필드 초기화 | 조회창 Sys15_Lookup_Corp 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L453-455 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('setupDate', 100, '개설일자', { editor: 'date' }),  // L281
  gb.text('corpNm', 120, '증권사'),  // L282 SQL 계산 컬럼(selectByText: f_get_corp_nm(fnd32_corp_id))
  gb.text('branch', 120, '관리점', { editor: 'text' }),  // L283
  gb.text('accountNm1', 100, '운용대상', { editor: 'select' }),  // L284 SQL 계산 컬럼(selectByText: f_cdnm('Fnd32Code1', fnd32_account_cd1,…)
  gb.text('accountNm2', 100, '구분', { editor: 'select' }),  // L285 SQL 계산 컬럼(selectByText: f_cdnm('Fnd32Code2', fnd32_account_cd2,…)
  gb.text('accountNm', 150, '계좌명', { editor: 'text' }),  // L286
  gb.text('decAccountNo', 150, '계좌번호', { editor: 'text' }),  // L287 SQL 계산 컬럼(selectByText: to_decrypts(fnd32_account_no))
  gb.text('bankCorpNm', 100, '연계은행'),  // L288 SQL 계산 컬럼(selectByText: f_get_corp_nm(fnd32_bank_corp_id))
  gb.text('decBankLinkNo', 150, '은행연계계좌', { editor: 'text' }),  // L289 SQL 계산 컬럼(selectByText: to_decrypts(fnd32_bank_link_no))
  gb.text('accountStateNm', 80, '상태', { editor: 'select' }),  // L290 SQL 계산 컬럼(selectByText: f_cdnm('AccountStateCode', fnd32_accoun…)
  gb.text('ipoOutNm', 120, '상장일출고', { editor: 'select' }),  // L291 SQL 계산 컬럼(selectByText: f_cdnm('IpoOutCode', fnd32_ipo_out_cd, …)
  gb.text('managerTel', 120, '담당자연락처', { editor: 'text' }),  // L292
  gb.text('note', 280, '비고', { editor: 'text' }),  // L293
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={copyInsertRow}>등록(복사)</Button>
3. <Button type="register" onClick={insertRow}>등록</Button>
4. <Button type="save" onClick={update}>저장</Button>
5. <Button type="delete" onClick={deleteChk}>삭제</Button>
6. <Button type="download" onClick={() => /* 인라인 L171-176 (new SelectHandler(){ @Override public…) */}>템플릿</Button>
7. <Button type="upload" onClick={excelUpload}>엑셀업로드</Button>

