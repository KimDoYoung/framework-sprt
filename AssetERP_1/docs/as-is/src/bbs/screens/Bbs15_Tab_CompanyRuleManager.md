# Bbs15_Tab_CompanyRuleManager

- 종류: 화면
- 메뉴: 준법감시 > 02. 회사규정 > 회사규정(관리자) (#1477)
- 메뉴: 커뮤니티 > 01. 회사규정 > 회사규정(관리자) (#1345)
- 메뉴: 기초자료 > 10. 책무 > 회사규정관리 (#1483)
- 파일: `client/vi/bbs/Bbs15_Tab_CompanyRuleManager.java`
- 함께 쓰는 클래스 2개:
  - `Bbs15_Edit_CompanyRuleManager` `client/vi/bbs/Bbs15_Edit_CompanyRuleManager.java`
  - `Bbs15_Lookup_File` `client/vi/bbs/Bbs15_Lookup_File.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Sys01_Lookup_Company`](../../sys/components/Sys01_Lookup_Company.md), [`Sys10_Lookup_FileViewer`](../../sys/components/Sys10_Lookup_FileViewer.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `bbs.Bbs15_CompanyRule.delete` | Bbs15_Tab_CompanyRuleManager:321 | [`Bbs15_CompanyRule.java:172`](../../bbs/services/Bbs15_CompanyRule.md) | [`bbs15_company_rule.countLastCheck`](../../bbs/sql/bbs15_company_rule.md), [`bbs15_company_rule.countRelateTask`](../../bbs/sql/bbs15_company_rule.md), `UpdateDataModel(bbs15_company_rule)` 동적 DELETE |
| `bbs.Bbs15_CompanyRule.pushData` | Bbs15_Tab_CompanyRuleManager:406 | [`Bbs15_CompanyRule.java:83`](../../bbs/services/Bbs15_CompanyRule.md) | [`bbs15_company_rule.insertRequest`](../../bbs/sql/bbs15_company_rule.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys01_company.selectById`](../../sys/sql/sys01_company.md), [`sys10_file.insertUpdate`](../../sys/sql/sys10_file.md), [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |
| `bbs.Bbs15_CompanyRule.selectBySearchTextManager` | Bbs15_Tab_CompanyRuleManager:304 | [`Bbs15_CompanyRule.java:38`](../../bbs/services/Bbs15_CompanyRule.md) | [`bbs15_company_rule.selectBySearchTextManager`](../../bbs/sql/bbs15_company_rule.md) |
| `bbs.Bbs15_CompanyRule.update` | Bbs15_Edit_CompanyRuleManager:320 | [`Bbs15_CompanyRule.java:43`](../../bbs/services/Bbs15_CompanyRule.md) | [`bbs15_company_rule.countUseByCompanyRuleCode`](../../bbs/sql/bbs15_company_rule.md), [`bbs15_company_rule.selectById`](../../bbs/sql/bbs15_company_rule.md), [`tdm11_task_relate_rule.countRelateByRuleCode`](../../tdm/sql/tdm11_task_relate_rule.md), `UpdateDataModel(bbs15_company_rule)` 동적 INSERT/UPDATE → [`bbs15_company_rule.selectById`](../../bbs/sql/bbs15_company_rule.md) |
| `sys.Sys09_Code.selectByCodeKind` | Bbs15_Edit_CompanyRuleManager:111 | [`Sys09_Code.java:82`](../../sys/services/Sys09_Code.md) | [`sys09_code.selectByCodeKind`](../../sys/sql/sys09_code.md) |
| `sys.Sys10_File.selectByParentId` | Bbs15_Edit_CompanyRuleManager:261, Bbs15_Lookup_File:197 | [`Sys10_File.java:51`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |
| `sys.Sys11_RelateFile.checkFileDelete` | Bbs15_Lookup_File:232 | [`Sys11_RelateFile.java:59`](../../sys/services/Sys11_RelateFile.md) | [`sys11_relate_file.checkFileDelete01`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete02`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete03`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.deleteRelateFile`](../../sys/sql/sys11_relate_file.md) |
| `sys.Sys99_Print.insertRdCompanyRule` | Bbs15_Tab_CompanyRuleManager:433 | [`Sys99_Print.java:5100`](../../sys/services/Sys99_Print.md) | [`bbs15_company_rule.selectBySearchTextManager`](../../bbs/sql/bbs15_company_rule.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr99_appr_del`](../../../db/tables/apr.md), [`bbs15_company_rule`](../../../db/tables/bbs.md), [`sys01_company`](../../../db/tables/sys.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md), [`sys99_print`](../../../db/tables/sys.md), [`tdm10_task`](../../../db/tables/tdm.md), [`tdm11_task_relate_rule`](../../../db/tables/tdm.md), [`tdm20_role`](../../../db/tables/tdm.md), [`tdm21_role_relate_task`](../../../db/tables/tdm.md), [`tdm30_role_allc`](../../../db/tables/tdm.md), [`tdm31_role_desc`](../../../db/tables/tdm.md), [`tdm34_role_allc_detail`](../../../db/tables/tdm.md)

## DB 함수

`f_cdnm`, `f_sysdate`, `f_today`, `f_trunc`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Bbs15_Tab_CompanyRuleManager (`client/vi/bbs/Bbs15_Tab_CompanyRuleManager.java`, 538줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 고객사: {companyField} 구분: {companyRuleName} 검색: {searchTextField} {retrieveButton} {insertButton} {copyButton} {deleteButton} {excelDownloadButton} {excelUploadButton} {pushDataButton} {uploadExcelForm}
- 입력·하위 화면: `searchTextField` TextField 빈칸="규정명/규정코드", `companyField` LookupTriggerField, `companyRuleName` ComboBoxField("CompanyRuleType", "%", "전체", "전체"), `lookupCompany` Sys01_Lookup_Company, `lookup` Bbs15_Edit_CompanyRuleManager
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - ruleTypeName 150 "구분" Text
  - companyRuleCode 100 "규정코드" TextCenter
  - title 450 "규정명" Text
  - revisionDate 100 "제개정일" Date
  - revisionNo 70 "개정회차" LongCenter
  - fileCnt 130 "규정 첨부파일 갯수" LongCenter
  - publicYn 50 "공개" BooleanYn2
  - closeDate 100 "종료일" Date
  - note 300 "비고" Text
  - actionCell 55 "수정" Cell 편집:editCell
  - creName 90 "작성자" TextCenter
  - updName 90 "변경자" TextCenter
  - updDateStr 150 "작성(변경)일" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L94-136) → settings(), retrieve()
[E1] searchTextField.KeyPress [Enter] (L141) → retrieve()
[E2] companyField.TriggerClick [result != null] (L153) → execute()
[E3] companyRuleName[CompanyRuleType].Collapse (L180) → retrieve()
[E4] retrieveButton[조회].Select (L187) → retrieve()
[E5] insertButton[등록].Select (L193) → insert()
[E6] deleteButton[삭제].Select (L199) → deleteRow()
       └ [E12] messageBox.DialogHide [YES] (L315) → execute()
[E7] copyButton[등록(복사)].Select (L205) → copyInsert()
[E8] excelDownloadButton[엑셀다운로드].Select (L211) → downLoad()
[E9] excelUploadButton[엑셀업로드].Select (L224) → excelUpload()
[E10] pushDataButton[내보내기].Select (L231) → pushData()
[E11] uploadExcelForm.SubmitComplete (L241) → 메시지 "업로드 완료"
[E13] fileUploadField.Change (L378) → 인라인 L378-383 (new ChangeHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public execute() | L88-91 | E2,E12,buildGrid,retrieve,insert,copyInsert,pushData | 상태 처리 | 업무 |
| private retrieve() | L288-310 | 생성자,E1,E3,E4,execute,buildGrid,insert,copyInsert | 서비스 bbs.Bbs15_CompanyRule.selectBySearchTextManager(companyId, ruleType, searchText) | 업무 |
| private deleteRow() | L312-337 | E6 | ConfirmBox → E12 | 업무 |
| public insert() | L339-347 | E5 | 팝업 Bbs15_Edit_CompanyRuleManager 열기 | 업무 |
| public copyInsert() | L349-366 | E7 | 팝업 Bbs15_Edit_CompanyRuleManager 열기 | 업무 |
| private excelUpload() | L368-386 | E9 | 상태 처리 | 업무 |
| private pushData() | L388-426 | E10 | 조회창 Sys01_Lookup_Company 열기, 미선택 시 alert "선택된 내역이 없습니다.", 서비스 bbs.Bbs15_CompanyRule.pushData(companyId) | 업무 |
| private downLoad() | L428-479 | E8 | 서비스 sys.Sys99_Print.insertRdCompanyRule(companyId, personId, windowClassName, ruleType, searchText) | 업무 |
| public settings() | L138-252 | 생성자 | 조회창 Sys01_Lookup_Company 열기, 이벤트 연결, 초기값: companyField=companyModel.getCompanyName(, companyField="Admin (관리자 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L254-286 | 필드 초기화 | 팝업 Bbs15_Edit_CompanyRuleManager 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L534-536 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('ruleTypeNm', 150, '구분'),  // L271
  gb.textCenter('companyRuleCd', 100, '규정코드'),  // L272
  gb.text('title', 450, '규정명'),  // L273
  gb.date('revisionDate', 100, '제개정일'),  // L274
  gb.longCenter('revisionNo', 70, '개정회차'),  // L275
  gb.longCenter('fileCnt', 130, '규정 첨부파일 갯수'),  // L276
  gb.booleanYn2('publicYn', 50, '공개'),  // L277
  gb.date('closeDate', 100, '종료일'),  // L278
  gb.text('note', 300, '비고'),  // L279
  // ⚠ 대응 없음 (GridBuilder L280) addCell
  gb.textCenter('creNm', 90, '작성자'),  // L281
  gb.textCenter('updNm', 90, '변경자'),  // L282
  gb.textCenter('updDateStr', 150, '작성(변경)일'),  // L283
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insert}>등록</Button>
3. <Button type="register" onClick={copyInsert}>등록(복사)</Button>
4. <Button type="delete" onClick={deleteRow}>삭제</Button>
5. <Button type="download" onClick={downLoad}>엑셀다운로드</Button>
6. <Button type="upload" onClick={excelUpload}>엑셀업로드</Button>
7. <Button type="unknown" onClick={pushData}>내보내기</Button>

### Bbs15_Edit_CompanyRuleManager (`client/vi/bbs/Bbs15_Edit_CompanyRuleManager.java`, 382줄)

- 입력·하위 화면: `title` TextField, `content` MyTextArea, `note` MyTextArea, `seq` LongField, `ruleType` TextField, `revisionDate` MyDateField, `revisionNo` LongField, `companyRuleCode` TextField, `publicYn` CheckBox, `closeDate` MyDateField, `ruleTypeName` CommonComboBoxField("sys.Sys09_Code.selectByCodeKind") 빈칸="(선택하세요)", `lookupFile` Bbs15_Lookup_File

#### 이벤트
[E0] 화면 열림 (생성자 L85-168) → getEditor()
[E1] updateButton[저장].Select (L94) → update()
[E2] closeButton[닫기].Select (L100) → hide()
[E3] addFileButton[첨부파일(0건)].Select (L115) → setFileButtonText()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public editCompanyRule() | L170-190 | 공개 메서드 | 상태 처리 | 업무 |
| public newCompanyRule() | L192-216 | 공개 메서드 | 상태 처리 | 업무 |
| public copyCompanyRule() | L218-258 | 공개 메서드 | 상태 처리 | 업무 |
| private setFileButtonText() | L260-271 | E3,editCompanyRule | 서비스 sys.Sys10_File.selectByParentId(parentId) | 업무 |
| public update() | L273-316 | E1 | 상태 처리 | 업무 |
| private updateData() | L318-335 | update | 서비스 bbs.Bbs15_CompanyRule.update | 업무 |
| private getEditor() | L337-349 | 생성자 | 상태 처리 | 업무 |
| private setHtml() | L351-354 | 미사용 후보 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L366-368 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L370-372 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L374-376 | 미사용 후보 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L378-380 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={setFileButtonText}>첨부파일(0건)</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

### Bbs15_Lookup_File (`client/vi/bbs/Bbs15_Lookup_File.java`, 270줄)

- 툴바 `buttonBar`: {updateButton}
- 입력·하위 화면: `viewer` Sys10_Lookup_FileViewer
- 그리드 `fileGrid` (buildApprFileGrid(), 체크박스):
  - fileName 640 "첨부파일명" Text
  - actionCell 80 "다운로드" Cell 편집:downloadCell
  - actionCell 80 "삭제" Cell 편집:deleteCell
  - actionCell 80 "미리보기" Cell 편집:viewCell

#### 이벤트
[E1] updateButton[파일업로드].Select (L79) → 인라인 L79-84 (new SelectHandler(){ @Override public…)
[E2] okButton[닫기].Select (L87) → confirm()
[E3] fileUpload.Change (L101) → 인라인 L101-108 (new ChangeHandler() { @Override publi…)
[E4] fileUploadForm.SubmitComplete (L111) → resetFileUpload(), retrieve()
[E5] fileDeleteForm.SubmitComplete (L138) → retrieve()
[E6] fileUpload.Change (L219) → 인라인 L219-226 (new ChangeHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public openUser() | L57-63 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L65-68 | openUser | 상태 처리 | 업무 |
| public open() | L70-150 | openUser | 상태 처리 | 업무 |
| private buildApprFileGrid() | L152-189 | 필드 초기화 | 조회창 Sys10_Lookup_FileViewer 열기 | 업무 |
| private retrieve() | L191-203 | E4,E5,open,checkFileDelete | 서비스 sys.Sys10_File.selectByParentId(parentId) | 업무 |
| private confirm() | L205-210 | E2 | 상태 처리 | 업무 |
| private resetFileUpload() | L212-227 | E4 | 상태 처리 | 업무 |
| private checkFileDelete() | L229-254 | buildApprFileGrid | 서비스 sys.Sys11_RelateFile.checkFileDelete(fileId, parentId) | 업무 |
| public getServiceResult() | L257-264 | checkFileDelete | 상태 처리 | 업무 |
| private setHtmlHeaderStyle() | L266-268 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildApprFileGrid = () => [
  gb.text('fileNm', 640, '첨부파일명'),  // L183
  // ⚠ 대응 없음 (GridBuilder L184) addCell
  // ⚠ 대응 없음 (GridBuilder L185) addCell
  // ⚠ 대응 없음 (GridBuilder L186) addCell
];
```

#### 사용된 버튼들
1. <Button type="upload" onClick={() => /* 인라인 L79-84 (new SelectHandler(){ @Override public…) */}>파일업로드</Button>
2. <Button type="unknown" onClick={confirm}>닫기</Button>

