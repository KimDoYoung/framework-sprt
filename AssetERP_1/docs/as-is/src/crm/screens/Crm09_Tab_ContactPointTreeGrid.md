# Crm09_Tab_ContactPointTreeGrid

- 종류: 화면
- 메뉴: 커뮤니티 > 03. 업무활동 > (X)거래처 및 업무활동 등록 (#1063, 미사용)
- 파일: `client/vi/crm/Crm09_Tab_ContactPointTreeGrid.java`
- 함께 쓰는 클래스 6개:
  - `Crm09_Tab_ContactPoint` `client/vi/crm/Crm09_Tab_ContactPoint.java`
  - `Crm12_Grid_WorkDetail` `client/vi/crm/Crm12_Grid_WorkDetail.java`
  - `Crm12_Lookup_WorkDetail` `client/vi/crm/Crm12_Lookup_WorkDetail.java`
  - `Crm15_Lookup_Share` `client/vi/crm/Crm15_Lookup_Share.java`
  - `Crm09_Lookup_ContactPoint` `client/vi/crm/Crm09_Lookup_ContactPoint.java`
  - `Crm14_Lookup_ShareDefault` `client/vi/crm/Crm14_Lookup_ShareDefault.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Emp00_Lookup_SelectMulti`](../../emp/components/Emp00_Lookup_SelectMulti.md), [`Fnd01_Lookup_SelectMulti`](../../fnd/components/Fnd01_Lookup_SelectMulti.md), [`Org00_Lookup_SelectMulti`](../../org/components/Org00_Lookup_SelectMulti.md), [`Sys09_Tree_Code`](../../sys/components/Sys09_Tree_Code.md), [`Sys10_Lookup_File`](../../sys/components/Sys10_Lookup_File.md), [`Sys10_Lookup_FileViewer`](../../sys/components/Sys10_Lookup_FileViewer.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `crm.Crm09_Contact.delete` | Crm09_Tab_ContactPoint:383 | [`Crm09_Contact.java:121`](../../crm/services/Crm09_Contact.md) | `UpdateDataModel(crm09_contact)` 동적 DELETE |
| `crm.Crm09_Contact.modelUpdate` | Crm09_Lookup_ContactPoint:267 | [`Crm09_Contact.java:103`](../../crm/services/Crm09_Contact.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(crm09_contact)` 동적 INSERT/UPDATE → [`crm09_contact.selectById`](../../crm/sql/crm09_contact.md) |
| `crm.Crm09_Contact.selectByPaging` | Crm09_Tab_ContactPoint:82 | [`Crm09_Contact.java:82`](../../crm/services/Crm09_Contact.md) | [`crm09_contact.selectByNamePaging`](../../crm/sql/crm09_contact.md), [`crm09_contact.selectByNameTotal`](../../crm/sql/crm09_contact.md) |
| `crm.Crm12_WorkDetail.checkByContactId` | Crm09_Tab_ContactPoint:351 | [`Crm12_WorkDetail.java:43`](../../crm/services/Crm12_WorkDetail.md) | [`crm12_work_detail.checkByContactId`](../../crm/sql/crm12_work_detail.md) |
| `crm.Crm12_WorkDetail.delete` | Crm12_Grid_WorkDetail:250 | [`Crm12_WorkDetail.java:82`](../../crm/services/Crm12_WorkDetail.md) | `UpdateDataModel(crm12_work_detail)` 동적 DELETE |
| `crm.Crm12_WorkDetail.modelUpdate` | Crm12_Lookup_WorkDetail:490 | [`Crm12_WorkDetail.java:58`](../../crm/services/Crm12_WorkDetail.md) | [`crm15_share.deleteByWorkDetailId`](../../crm/sql/crm15_share.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(crm12_work_detail)` 동적 INSERT/UPDATE → [`crm12_work_detail.selectById`](../../crm/sql/crm12_work_detail.md) |
| `crm.Crm12_WorkDetail.selectByContactId` | Crm12_Grid_WorkDetail:185 | [`Crm12_WorkDetail.java:25`](../../crm/services/Crm12_WorkDetail.md) | [`crm12_work_detail.selectByContactId`](../../crm/sql/crm12_work_detail.md) |
| `crm.Crm13_RelateFund.delete` | Crm12_Lookup_WorkDetail:432 | [`Crm13_RelateFund.java:42`](../../crm/services/Crm13_RelateFund.md) | `UpdateDataModel(crm13_relate_fund)` 동적 DELETE |
| `crm.Crm13_RelateFund.selectByWorkDetailId` | Crm12_Lookup_WorkDetail:532 | [`Crm13_RelateFund.java:22`](../../crm/services/Crm13_RelateFund.md) | [`crm13_relate_fund.selectByWorkDetailId`](../../crm/sql/crm13_relate_fund.md) |
| `crm.Crm13_RelateFund.updateList` | Crm12_Lookup_WorkDetail:504 | [`Crm13_RelateFund.java:30`](../../crm/services/Crm13_RelateFund.md) | [`crm13_relate_fund.deleteByWorkDetailId`](../../crm/sql/crm13_relate_fund.md), `UpdateDataModel(crm13_relate_fund)` 동적 INSERT/UPDATE → [`crm13_relate_fund.selectById`](../../crm/sql/crm13_relate_fund.md) |
| `crm.Crm14_ShareDefault.delete` | Crm14_Lookup_ShareDefault:252 | [`Crm14_ShareDefault.java:35`](../../crm/services/Crm14_ShareDefault.md) | `UpdateDataModel(crm14_share_default)` 동적 DELETE |
| `crm.Crm14_ShareDefault.selectByContactId` | Crm14_Lookup_ShareDefault:315 | [`Crm14_ShareDefault.java:20`](../../crm/services/Crm14_ShareDefault.md) | [`crm14_share_default.selectByContactId`](../../crm/sql/crm14_share_default.md) |
| `crm.Crm14_ShareDefault.selectShareInfo` | Crm14_Lookup_ShareDefault:282 | [`Crm14_ShareDefault.java:25`](../../crm/services/Crm14_ShareDefault.md) | [`crm14_share_default.selectShareInfo`](../../crm/sql/crm14_share_default.md) |
| `crm.Crm14_ShareDefault.update` | Crm14_Lookup_ShareDefault:266 | [`Crm14_ShareDefault.java:30`](../../crm/services/Crm14_ShareDefault.md) | `UpdateDataModel(crm14_share_default)` 동적 INSERT/UPDATE → [`crm14_share_default.selectById`](../../crm/sql/crm14_share_default.md) |
| `crm.Crm15_Share.delete` | Crm15_Lookup_Share:251 | [`Crm15_Share.java:49`](../../crm/services/Crm15_Share.md) | `UpdateDataModel(crm15_share)` 동적 DELETE |
| `crm.Crm15_Share.deleteDefaultShare` | Crm12_Lookup_WorkDetail:273 | [`Crm15_Share.java:39`](../../crm/services/Crm15_Share.md) | [`crm15_share.deleteByWorkDetailId`](../../crm/sql/crm15_share.md) |
| `crm.Crm15_Share.insertDefaultShare` | Crm12_Lookup_WorkDetail:257 | [`Crm15_Share.java:30`](../../crm/services/Crm15_Share.md) | [`crm15_share.insertDefaultShare`](../../crm/sql/crm15_share.md), [`crm15_share.selectShareInfo`](../../crm/sql/crm15_share.md) |
| `crm.Crm15_Share.selectByWorkDetailId` | Crm15_Lookup_Share:314 | [`Crm15_Share.java:20`](../../crm/services/Crm15_Share.md) | [`crm15_share.selectByWorkDetailId`](../../crm/sql/crm15_share.md) |
| `crm.Crm15_Share.selectShareInfo` | Crm15_Lookup_Share:281 | [`Crm15_Share.java:25`](../../crm/services/Crm15_Share.md) | [`crm15_share.selectShareInfo`](../../crm/sql/crm15_share.md) |
| `crm.Crm15_Share.update` | Crm15_Lookup_Share:265 | [`Crm15_Share.java:44`](../../crm/services/Crm15_Share.md) | `UpdateDataModel(crm15_share)` 동적 INSERT/UPDATE → [`crm15_share.selectById`](../../crm/sql/crm15_share.md) |
| `sys.Sys10_File.selectByParentId` | Crm12_Lookup_WorkDetail:538 | [`Sys10_File.java:51`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |
| `sys.Sys11_RelateFile.checkFileDelete` | Crm12_Lookup_WorkDetail:544 | [`Sys11_RelateFile.java:59`](../../sys/services/Sys11_RelateFile.md) | [`sys11_relate_file.checkFileDelete01`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete02`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete03`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.deleteRelateFile`](../../sys/sql/sys11_relate_file.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr99_appr_del`](../../../db/tables/apr.md), [`crm09_contact`](../../../db/tables/crm.md), [`crm12_work_detail`](../../../db/tables/crm.md), [`crm13_relate_fund`](../../../db/tables/crm.md), [`crm14_share_default`](../../../db/tables/crm.md), [`crm15_share`](../../../db/tables/crm.md), [`fnd01_fund_code`](../../../db/tables/fnd.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_create_seq`, `f_emp_kor_nm`, `f_get_emptrans`, `f_get_fund_nm`, `f_org_nm`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Crm09_Tab_ContactPointTreeGrid (`client/vi/crm/Crm09_Tab_ContactPointTreeGrid.java`, 66줄)

- 레이아웃: west=treePanel, center=contactForm
- 입력·하위 화면: `contactForm` Crm09_Tab_ContactPoint, `buildTree` Sys09_Tree_Code, `contactName` TextField, `itemTypeCode` TextField, `itemTypeName` TextField

#### 이벤트
[E0] 화면 열림 (생성자 L25-61) → retrieveTree()
[E1] sysTree.SelectionChanged (L29) → 인라인 L29-35 (new SelectionChangedHandler<Sys09_Cod…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieveTree() | L63-65 | 생성자 | 상태 처리 | 업무 |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
버튼 사용하지 않음

### Crm09_Tab_ContactPoint (`client/vi/crm/Crm09_Tab_ContactPoint.java`, 400줄)

- 레이아웃: north=buttonBar, center=vlcGrid, south=workDetail
- 툴바 `buttonBar`: 검색: {searchText} {retrieveButton} {insertButton} {copyButton} {deleteButton}
- 입력·하위 화면: `searchText` TextField 빈칸="회사명/담당자명/주요 논의 사항/비고", `itemTypeCode` TextField, `itemTypeName` TextField, `lookup` Crm09_Lookup_ContactPoint
- 그리드 `grid` (buildGrid(), 체크박스):
  - contactName 200 "거래처명" Text
  - contactEmpName 100 "담당자" Text
  - contactPos 80 "직위" Text
  - contactOrgName 200 "부서" Text
  - contactMobileNo 150 "Tel" Text
  - contactEmailAddr 180 "E-mail" Text
  - majorIssues 200 "주요 논의 사항" Text
  - actionCell 40 "수정" Cell 편집:modiCell
  - contactDate 100 "등록일" Date
  - personOrgAdd 200 "등록자" Text

#### 이벤트
[E0] 화면 열림 (생성자 L67-105) → setting(), retrieve()
[E1] searchText.KeyPress [Enter] (L111) → retrieve()
[E2] grid.SelectionChanged [선택>0] (L120) → retrieveWorkDetail()
[E3] retrieveButton[조회].Select (L129) → retrieve()
[E4] insertButton[등록].Select (L135) → insertRow()
[E5] deleteButton[삭제].Select (L141) → preDelete()
       └ [E7] messageBox.DialogHide (L366) → deleteRow()
[E6] copyButton[등록(복사)].Select (L147) → copyInsertRow()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setting() | L107-153 | 생성자 | 상태 처리 | 업무 |
| private retrieveWorkDetail() | L187-189 | E2 | 상태 처리 | 업무 |
| public retrieveCall() | L191-221 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L223-257 | 생성자,E1,E3 | 상태 처리 | 업무 |
| public retrieve() | L260-291 | 생성자,E1,E3 | 상태 처리 | 업무 |
| public update() | L294-295 | 공개 메서드 | 상태 처리 | 업무 |
| public insertRow() | L298-305 | E4 | 조회창 Crm09_Lookup_ContactPoint 열기 | 업무 |
| public copyInsertRow() | L307-336 | E6 | 상태 처리 | 업무 |
| private preDelete() | L338-378 | E5 | ConfirmBox → E7 | 업무 |
| public deleteRow() | L381-395 | E7 | GridDeleteData crm.Crm09_Contact.delete(체크된 행 목록) | 업무 |
| public buildGrid() | L155-185 | 필드 초기화 | 조회창 Crm09_Lookup_ContactPoint 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L397-399 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('contactNm', 200, '거래처명'),  // L173
  gb.text('contactEmpNm', 100, '담당자'),  // L174
  gb.text('contactPos', 80, '직위'),  // L175
  gb.text('contactOrgNm', 200, '부서'),  // L176
  gb.text('contactMobileNo', 150, 'Tel'),  // L177
  gb.text('contactEmailAddr', 180, 'E-mail'),  // L178
  gb.text('majorIssues', 200, '주요 논의 사항'),  // L179
  // ⚠ 대응 없음 (GridBuilder L180) addCell
  gb.date('contactDt', 100, '등록일'),  // L181
  gb.text('personOrgAdd', 200, '등록자'),  // L182
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="register" onClick={copyInsertRow}>등록(복사)</Button>
4. <Button type="delete" onClick={preDelete}>삭제</Button>

### Crm12_Grid_WorkDetail (`client/vi/crm/Crm12_Grid_WorkDetail.java`, 274줄)

- 툴바 `buttonBar`: ▼ 업무활동내역: {startDate} ~: {closeDate} 검색: {searchText} {allContactYn} {retrieveButton} {insertButton} {deleteButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `allContactYn` CheckBox, `searchText` TextField 빈칸="거래처/담당자/활동내용/작성자", `lookup` Sys10_Lookup_File
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - actionCell 40 "수정" Cell 편집:editCell
  - workDate 100 "활동일" Date
  - contactName 150 "거래처" Text
  - workName 350 "활동내용" Text
  - fundName 250 "연결펀드" Text
  - fileCount 70 "첨부파일" TextCenter
  - actionCell 35 " " Cell 편집:viewCell
  - regDate 100 "작성일" Date
  - personOrgName 200 "작성자" Text
  - shareInfo 200 "공유" Text
  - privateYn 70 "비공개" BooleanYn2

#### 이벤트
[E0] 화면 열림 (생성자 L57-85) → setting()
[E1] searchText.KeyPress [Enter] (L96) → retrieve()
[E2] retrieveButton[조회].Select (L108) → retrieve()
[E3] insertButton[등록].Select (L114) → insert()
[E4] deleteButton[삭제].Select (L120) → preDelete()
       └ [E5] messageBox.DialogHide [YES] (L237) → delete()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setting() | L87-126 | 생성자 | 상태 처리 | 업무 |
| public retrieve() | L172-191 | E1,E2,buildGrid,insert | 서비스 crm.Crm12_WorkDetail.selectByContactId(companyId, personId, contactId, startDate, closeDate, allContactYn, searchText) | 업무 |
| private getContactId() | L193-199 | retrieve,insert | 상태 처리 | 업무 |
| private insert() | L201-219 | E3 | 조회창 Crm12_Lookup_WorkDetail 열기, 미선택 시 alert "상단의 거래처명을 먼저 선택해주세요" | 업무 |
| private preDelete() | L221-246 | E4 | ConfirmBox → E5 | 업무 |
| private delete() | L248-262 | E5 | GridDeleteData crm.Crm12_WorkDetail.delete | 업무 |
| public buildGrid() | L128-170 | 필드 초기화 | 조회창 Sys10_Lookup_File 열기, 조회창 Crm12_Lookup_WorkDetail 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L264-266 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L267-269 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L270-272 | setting | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L156) addCell
  gb.date('workDate', 100, '활동일'),  // L157
  gb.text('contactNm', 150, '거래처'),  // L158
  gb.text('workNm', 350, '활동내용'),  // L160
  gb.text('fundNm', 250, '연결펀드'),  // L161
  gb.textCenter('fileCnt', 70, '첨부파일'),  // L162
  // ⚠ 대응 없음 (GridBuilder L163) addCell
  gb.date('regDate', 100, '작성일'),  // L164
  gb.text('personOrgNm', 200, '작성자'),  // L165
  gb.text('shareInfo', 200, '공유'),  // L166
  gb.booleanYn2('privateYn', 70, '비공개'),  // L167
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insert}>등록</Button>
3. <Button type="delete" onClick={preDelete}>삭제</Button>

### Crm12_Lookup_WorkDetail (`client/vi/crm/Crm12_Lookup_WorkDetail.java`, 579줄)

- 입력·하위 화면: `privateYn` CheckBox, `regDate` MyDateField, `workDate` MyDateField, `workContent` MyTextArea, `workName` TextField, `contactName` TextField, `shareInfo` TextField, `lookup` Crm15_Lookup_Share, `lookupFundInfo` Fnd01_Lookup_SelectMulti, `lookupViewer` Sys10_Lookup_FileViewer
- 그리드 `relateFundGrid` (buildRelateFundGrid(), 체크박스):
  - fundCode 80 "코드" Text
  - fundName 480 "연관펀드명" Text
  - actionCell 80 "삭제" Cell 편집:editDocCell
- 그리드 `relateFileGrid` (buildRelateFileGrid(), 체크박스):
  - fileName 405 "첨부파일" TextNotSort
  - fileYnCheck 65 " " TextNotSort
  - actionCell 50 "받기" Cell 편집:downloadCell
  - actionCell 50 "삭제" Cell 편집:deleteCell
  - actionCell 50 "보기" Cell 편집:viewCell

#### 이벤트
[E0] 화면 열림 (생성자 L101-125) → settings(), getEditor(), show()
[E1] privateYn[비공개].ValueChange [privateYn.getValue()] (L191) → setShareEnabled()
[E2] fileDeleteForm.SubmitComplete (L208) → retrieve02()
[E3] insertButton[연결펀드].Select (L214) → insertRelateFundList()
[E4] uploadButton[첨부파일].Select (L220) → upload()
[E5] updateButton[저장].Select (L226) → updateRow()
[E6] cancleButton[닫기].Select ["NEW".equals(actionName)] (L232) → deleteDefaultShare(), hide()
[E7] shareButton[설정].Select (L243) → lookupShare()
[E8] fileUpload.Change (L345) → 인라인 L345-352 (new ChangeHandler() { @Override publi…)
[E9] fileUploadForm.SubmitComplete (L354) → retrieve02()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public insert() | L127-149 | 공개 메서드 | 상태 처리 | 업무 |
| public edit() | L151-163 | insert | 상태 처리 | 업무 |
| public open() | L165-184 | 공개 메서드 | 상태 처리 | 업무 |
| private setShareEnabled() | L251-254 | E1,edit,open | 상태 처리 | 업무 |
| private insertDefaultShare() | L256-270 | insert | 서비스 crm.Crm15_Share.insertDefaultShare(contactId, workDetailId) | 업무 |
| private deleteDefaultShare() | L272-288 | E6 | 서비스 crm.Crm15_Share.deleteDefaultShare(workDetailId) | 업무 |
| private lookupShare() | L290-300 | E7 | 조회창 Crm15_Lookup_Share 열기 | 업무 |
| private insertRelateFundList() | L302-337 | E3 | 조회창 Fnd01_Lookup_SelectMulti 열기 | 업무 |
| private upload() | L339-366 | E4 | 상태 처리 | 업무 |
| private getEditor() | L368-419 | 생성자 | 상태 처리 | 업무 |
| private buildRelateFundGrid() | L421-440 | 필드 초기화 | GridDeleteData crm.Crm13_RelateFund.delete(체크된 행 목록) | 업무 |
| private buildRelateFileGrid() | L442-477 | 필드 초기화 | 조회창 Sys10_Lookup_FileViewer 열기 | 업무 |
| private updateRow() | L479-522 | E5 | 서비스 crm.Crm12_WorkDetail.modelUpdate, crm.Crm13_RelateFund.updateList(workDetailId) | 업무 |
| private retrieve() | L524-527 | edit,open | 상태 처리 | 업무 |
| private retrieve01() | L529-533 | retrieve | 서비스 crm.Crm13_RelateFund.selectByWorkDetailId(workDetailId) | 업무 |
| private retrieve02() | L535-539 | E2,E9,retrieve,checkFileDelete | 서비스 sys.Sys10_File.selectByParentId(parentId) | 업무 |
| private checkFileDelete() | L541-566 | buildRelateFileGrid | 서비스 sys.Sys11_RelateFile.checkFileDelete(fileId, parentId) | 업무 |
| private settings() | L186-249 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlCheckBoxLabelStyle() | L568-570 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L572-574 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L576-578 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildRelateFundGrid = () => [
  gb.text('fundCd', 80, '코드'),  // L435 SQL 계산 컬럼(selectByWorkDetailId: fnd01_fund_cd)
  gb.text('fundNm', 480, '연관펀드명'),  // L436 SQL 계산 컬럼(selectByWorkDetailId: f_get_fund_nm(fnd01_company_id, fnd01_f…)
  // ⚠ 대응 없음 (GridBuilder L437) addCell
];

const buildRelateFileGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L471) addTextNotSort
  // ⚠ 대응 없음 (GridBuilder L472) addTextNotSort
  // ⚠ 대응 없음 (GridBuilder L473) addCell
  // ⚠ 대응 없음 (GridBuilder L474) addCell
  // ⚠ 대응 없음 (GridBuilder L475) addCell
];
```

#### 사용된 버튼들
1. <Button type="register" onClick={insertRelateFundList}>등록</Button>
2. <Button type="upload" onClick={upload}>파일업로드</Button>
3. <Button type="register" onClick={lookupShare}>설정</Button>
4. <Button type="save" onClick={updateRow}>저장</Button>
5. <Button type="unknown" onClick={() => /* deleteDefaultShare(), hide() */}>닫기</Button>

### Crm15_Lookup_Share (`client/vi/crm/Crm15_Lookup_Share.java`, 321줄)

- 툴바 `buttonBar`: {hlc}
- 입력·하위 화면: `radio01` Radio, `radio02` Radio, `orgSearch` Org00_Lookup_SelectMulti, `lookupEmpTransInfo` Emp00_Lookup_SelectMulti
- 그리드 `grid` (grid(), 체크박스(다중)):
  - shareName 70 "구분" TextCenter
  - orgName 250 "부서" Text
  - personName 100 "성명" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L76-106) → show()
[E1] updateButton[저장].Select (L83) → update()
[E2] closeButton[닫기].Select (L89) → hide()
[E3] anchor.MouseDown (L122) → retrieve()
[E4] insertButton[행 추가].Select (L136) → insertRow()
[E5] deleteButton[행 삭제].Select (L142) → deleteRow()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L108-111 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L113-117 | 공개 메서드 | 상태 처리 | 업무 |
| private ButtonSetting() | L119-158 | open | 상태 처리 | 업무 |
| private grid() | L160-169 | 필드 초기화 | 상태 처리 | 업무 |
| private openLookupOrgInfo() | L171-197 | insertRow | 조회창 Org00_Lookup_SelectMulti 열기 | 업무 |
| private openLookupEmpInfo() | L199-227 | insertRow | 조회창 Emp00_Lookup_SelectMulti 열기 | 업무 |
| private insertRow() | L229-237 | E4 | 상태 처리 | 업무 |
| private update() | L239-274 | E1 | GridDeleteData crm.Crm15_Share.delete, crm.Crm15_Share.update | 업무 |
| private updateEnd() | L276-299 | update | 서비스 crm.Crm15_Share.selectShareInfo(workDetailId) | 업무 |
| private deleteRow() | L301-307 | E5 | 상태 처리 | 업무 |
| private retrieve() | L309-315 | E3,open | 서비스 crm.Crm15_Share.selectByWorkDetailId(workDetailId) | 업무 |
| private setHtmlHeaderStyle() | L317-319 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const grid = () => [
  gb.textCenter('shareNm', 70, '구분'),  // L164 SQL 계산 컬럼(selectByWorkDetailId: f_cdnm('ShareCode', crm15_share_cd, crm…)
  gb.text('orgNm', 250, '부서'),  // L165 SQL 계산 컬럼(selectByWorkDetailId: f_org_nm(crm15_org_id, COALESCE(crm12_r…)
  gb.textCenter('personNm', 100, '성명'),  // L166 SQL 계산 컬럼(selectByWorkDetailId: f_emp_kor_nm(crm15_person_id))
];
```

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>
3. <Button type="addRow" onClick={insertRow}>행 추가</Button>
4. <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>

### Crm09_Lookup_ContactPoint (`client/vi/crm/Crm09_Lookup_ContactPoint.java`, 315줄)

- 입력·하위 화면: `majorIssues` MyTextArea, `note` MyTextArea, `contactName` TextField, `contactEmpName` TextField, `contactOrgName` TextField, `contactTitle` TextField, `contactPos` TextField, `contactTelNo` TextField, `contactMobileNo` TextField, `contactEmailAddr` TextField, `itemTypeCode` TextField, `shareInfo` TextField, `itemTypeName` ComboBoxField("CrmItemTypeCode"), `lookup` Crm14_Lookup_ShareDefault

#### 이벤트
[E0] 화면 열림 (생성자 L140-181) → getEditor(), show()
[E1] updateButton[저장].Select (L160) → updateRow()
[E2] cancleButton[닫기].Select [grid != null && newYn] (L166) → hide()
[E3] shareButton[설정].Select (L175) → lookupShare()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public openEdit() | L73-82 | 공개 메서드 | 상태 처리 | 업무 |
| public openNew() | L84-106 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L108-120 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L122-138 | 공개 메서드 | 상태 처리 | 업무 |
| private postOpen() | L183-191 | openEdit,openNew,open | 상태 처리 | 업무 |
| private getEditor() | L193-243 | 생성자 | 상태 처리 | 업무 |
| private updateRow() | L245-281 | E1 | 서비스 crm.Crm09_Contact.modelUpdate | 업무 |
| private lookupShare() | L283-293 | E3 | 조회창 Crm14_Lookup_ShareDefault 열기 | 업무 |
| public init() | L295-297 | 공개 메서드 | 상태 처리 | 업무 |
| private setHtmlStyle() | L299-301 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L303-305 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L307-309 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlGrayStyle() | L311-313 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="register" onClick={lookupShare}>설정</Button>
2. <Button type="save" onClick={updateRow}>저장</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

### Crm14_Lookup_ShareDefault (`client/vi/crm/Crm14_Lookup_ShareDefault.java`, 322줄)

- 툴바 `buttonBar`: {hlc}
- 입력·하위 화면: `radio01` Radio, `radio02` Radio, `orgSearch` Org00_Lookup_SelectMulti, `lookupEmpTransInfo` Emp00_Lookup_SelectMulti
- 그리드 `grid` (grid(), 체크박스(다중)):
  - shareName 70 "구분" TextCenter
  - orgName 250 "부서" Text
  - personName 100 "성명" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L77-107) → show()
[E1] updateButton[저장].Select (L84) → update()
[E2] closeButton[닫기].Select (L90) → hide()
[E3] anchor.MouseDown (L123) → retrieve()
[E4] insertButton[행 추가].Select (L137) → insertRow()
[E5] deleteButton[행 삭제].Select (L143) → deleteRow()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L109-112 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L114-118 | 공개 메서드 | 상태 처리 | 업무 |
| private ButtonSetting() | L120-159 | open | 상태 처리 | 업무 |
| private grid() | L161-170 | 필드 초기화 | 상태 처리 | 업무 |
| private openLookupOrgInfo() | L172-198 | insertRow | 조회창 Org00_Lookup_SelectMulti 열기 | 업무 |
| private openLookupEmpInfo() | L200-228 | insertRow | 조회창 Emp00_Lookup_SelectMulti 열기 | 업무 |
| private insertRow() | L230-238 | E4 | 상태 처리 | 업무 |
| private update() | L240-275 | E1 | GridDeleteData crm.Crm14_ShareDefault.delete, crm.Crm14_ShareDefault.update | 업무 |
| private updateEnd() | L277-300 | update | 서비스 crm.Crm14_ShareDefault.selectShareInfo(contactId) | 업무 |
| private deleteRow() | L302-308 | E5 | 상태 처리 | 업무 |
| private retrieve() | L310-316 | E3,open | 서비스 crm.Crm14_ShareDefault.selectByContactId(contactId) | 업무 |
| private setHtmlHeaderStyle() | L318-320 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const grid = () => [
  gb.textCenter('shareNm', 70, '구분'),  // L165 SQL 계산 컬럼(selectByContactId: f_cdnm('ShareCode', crm14_share_cd, crm…)
  gb.text('orgNm', 250, '부서'),  // L166 SQL 계산 컬럼(selectByContactId: f_org_nm(crm14_org_id, f_today()))
  gb.textCenter('personNm', 100, '성명'),  // L167 SQL 계산 컬럼(selectByContactId: f_emp_kor_nm(crm14_person_id))
];
```

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>
3. <Button type="addRow" onClick={insertRow}>행 추가</Button>
4. <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>

