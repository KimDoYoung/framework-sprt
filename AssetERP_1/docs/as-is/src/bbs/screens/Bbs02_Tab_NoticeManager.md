# Bbs02_Tab_NoticeManager

- 종류: 화면
- 메뉴: 커뮤니티 > 02. 공지사항 > 사내공지등록 (#1064)
- 파일: `client/vi/bbs/Bbs02_Tab_NoticeManager.java`
- 함께 쓰는 클래스 4개:
  - `Bbs07_Lookup_Comment` `client/vi/bbs/Bbs07_Lookup_Comment.java`
  - `Bbs07_Lookup_FileList` `client/vi/bbs/Bbs07_Lookup_FileList.java`
  - `Bbs02_Edit_Notice` `client/vi/bbs/Bbs02_Edit_Notice.java`
  - `Bbs02_Lookup_LoadBbs` `client/vi/bbs/Bbs02_Lookup_LoadBbs.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Bbs02_Lookup_File`](../../bbs/components/Bbs02_Lookup_File.md), [`Bbs02_Popup_NoticeAdmin`](../../bbs/components/Bbs02_Popup_NoticeAdmin.md), [`Emp01_Lookup_PersonModel`](../../emp/components/Emp01_Lookup_PersonModel.md), [`Emp57_Lookup_Insert`](../../emp/components/Emp57_Lookup_Insert.md), [`Emp57_Lookup_List`](../../emp/components/Emp57_Lookup_List.md), [`Sch06_Lookup_AlarmSetup`](../../sch/components/Sch06_Lookup_AlarmSetup.md), [`Sys10_Lookup_FileViewer`](../../sys/components/Sys10_Lookup_FileViewer.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `bbs.Bbs02_Notice.delete` | Bbs02_Edit_Notice:615 | [`Bbs02_Notice.java:196`](../../bbs/services/Bbs02_Notice.md) | `UpdateDataModel(bbs02_notice)` 동적 DELETE |
| `bbs.Bbs02_Notice.selectByCompanyIdPaging` | Bbs02_Lookup_LoadBbs:108, Bbs02_Tab_NoticeManager:77 | [`Bbs02_Notice.java:131`](../../bbs/services/Bbs02_Notice.md) | [`bbs02_notice.selectByCompanyIdPaging`](../../bbs/sql/bbs02_notice.md), [`bbs02_notice.selectByCompanyIdTotal`](../../bbs/sql/bbs02_notice.md) |
| `bbs.Bbs02_Notice.update` | Bbs02_Edit_Notice:689 | [`Bbs02_Notice.java:181`](../../bbs/services/Bbs02_Notice.md) | [`bbs02_notice.getNoticeNo`](../../bbs/sql/bbs02_notice.md), `UpdateDataModel(bbs02_notice)` 동적 INSERT/UPDATE → [`bbs02_notice.selectById`](../../bbs/sql/bbs02_notice.md) |
| `bbs.Bbs03_Target.delete` | Bbs02_Edit_Notice:581 | [`Bbs03_Target.java:90`](../../bbs/services/Bbs03_Target.md) | `UpdateDataModel(bbs03_target)` 동적 DELETE |
| `bbs.Bbs03_Target.deleteAllTarget` | Bbs02_Edit_Notice:585 | [`Bbs03_Target.java:76`](../../bbs/services/Bbs03_Target.md) | [`bbs03_target.deleteAll`](../../bbs/sql/bbs03_target.md) |
| `bbs.Bbs03_Target.selectByNoticeId` | Bbs02_Edit_Notice:575 | [`Bbs03_Target.java:24`](../../bbs/services/Bbs03_Target.md) | [`bbs03_target.selectByNoticeId`](../../bbs/sql/bbs03_target.md) |
| `bbs.Bbs03_Target.update` | Bbs02_Edit_Notice:684 | [`Bbs03_Target.java:85`](../../bbs/services/Bbs03_Target.md) | `UpdateDataModel(bbs03_target)` 동적 INSERT/UPDATE → [`bbs03_target.selectById`](../../bbs/sql/bbs03_target.md) |
| `bbs.Bbs07_Comment.delete` | Bbs07_Lookup_Comment:175 | [`Bbs07_Comment.java:84`](../../bbs/services/Bbs07_Comment.md) | `UpdateDataModel(bbs07_comment)` 동적 DELETE |
| `bbs.Bbs07_Comment.getSize` | Bbs07_Lookup_Comment:151 | [`Bbs07_Comment.java:39`](../../bbs/services/Bbs07_Comment.md) | [`bbs07_comment.getSize`](../../bbs/sql/bbs07_comment.md) |
| `bbs.Bbs07_Comment.selectByNoticeId` | Bbs07_Lookup_Comment:141 | [`Bbs07_Comment.java:27`](../../bbs/services/Bbs07_Comment.md) | [`bbs07_comment.selectByNoticeId`](../../bbs/sql/bbs07_comment.md) |
| `sch.Sch06_Alarm.selectByTargetId` | Bbs02_Edit_Notice:516 | [`Sch06_Alarm.java:23`](../../sch/services/Sch06_Alarm.md) | [`sch06_alarm.selectByTargetId`](../../sch/sql/sch06_alarm.md) |
| `sys.Sys00_Common.selectByKindGroupCode` | Bbs02_Edit_Notice:104, Bbs02_Lookup_LoadBbs:149, Bbs02_Tab_NoticeManager:98 | [`Sys00_Common.java:106`](../../sys/services/Sys00_Common.md) | [`sys09_code.selectByKindGroupCode`](../../sys/sql/sys09_code.md) |
| `sys.Sys09_Code.selectByCode3` | Bbs02_Edit_Notice:105, Bbs02_Lookup_LoadBbs:173, Bbs02_Tab_NoticeManager:122 | [`Sys09_Code.java:115`](../../sys/services/Sys09_Code.md) | [`sys09_code.selectByCode3`](../../sys/sql/sys09_code.md) |
| `sys.Sys10_File.selectByParentId` | Bbs02_Edit_Notice:503, Bbs07_Lookup_FileList:213 | [`Sys10_File.java:51`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |
| `sys.Sys11_RelateFile.checkFileDelete` | Bbs07_Lookup_FileList:224 | [`Sys11_RelateFile.java:59`](../../sys/services/Sys11_RelateFile.md) | [`sys11_relate_file.checkFileDelete01`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete02`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete03`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.deleteRelateFile`](../../sys/sql/sys11_relate_file.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr99_appr_del`](../../../db/tables/apr.md), [`bbs02_notice`](../../../db/tables/bbs.md), [`bbs03_target`](../../../db/tables/bbs.md), [`bbs04_target_company`](../../../db/tables/bbs.md), [`bbs07_comment`](../../../db/tables/bbs.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md), [`org00_org_info`](../../../db/views.md), [`sch06_alarm`](../../../db/tables/sch.md), [`sys01_company`](../../../db/tables/sys.md), [`sys04_role`](../../../db/tables/sys.md), [`sys05_user_role`](../../../db/tables/sys.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_code_seq`, `f_create_notice_no`, `f_emp_kor_nm`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_today`, `f_trunc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Bbs02_Tab_NoticeManager (`client/vi/bbs/Bbs02_Tab_NoticeManager.java`, 261줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 공지구분: {noticeTypeCombo} {noticeDetailCombo} 검색: {searchText} {retrieveButton} {insertButton} {groupButton}
- 입력·하위 화면: `searchText` TextField 빈칸="상태/공지구분/제목/기타메모", `noticeTypeCombo` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode", "%", "전체", "전체"), `noticeDetailCombo` CommonComboBoxField("sys.Sys09_Code.selectByCode3", "%", "전체", "전체"), `lookup` Emp57_Lookup_Insert, `editNotice` Bbs02_Edit_Notice
- 그리드 `grid` (buildGrid()):
  - topYn 35 "" Pin
  - fromDate 100 "공지일" Date
  - toDate 100 "종료일" Date
  - openYn 50 "상태" TextCenter
  - noticeNo 100 "공지번호" TextCenter
  - noticeDetailFullName 200 "공지구분" Text
  - title 500 "제목" Text
  - commentCnt 40 "댓글" LongCenter
  - actionCell 30 "" Cell 편집:actionCell
  - actionCell 50 "수정" Cell 편집:editCell
  - note 300 "기타메모" Text

#### 이벤트
[E0] 화면 열림 (생성자 L53-90) → setting(), retrieve()
[E1] noticeTypeCombo[sys.Sys00_Common.selectByKindGroupCode].Collapse (L106) → retrieve()
[E2] noticeDetailCombo[sys.Sys09_Code.selectByCode3].Collapse (L147) → retrieve()
[E3] searchText.KeyPress [Enter] (L156) → retrieve()
[E4] retrieveButton[조회].Select (L164) → retrieve()
[E5] insertButton[등록].Select (L170) → insertRow()
[E6] groupButton[그룹설정].Select (L176) → 인라인 L176-182 (new SelectHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setting() | L93-183 | 생성자 | 조회창 Emp57_Lookup_Insert 열기, 서비스 sys.Sys00_Common.selectByKindGroupCode, sys.Sys09_Code.selectByCode3, sys.Sys09_Code.selectByCode3 | 업무 |
| public retrieve() | L220-241 | 생성자,E1,E2,E3,E4,setting | 상태 처리 | 업무 |
| public update() | L244-245 | 공개 메서드 | 상태 처리 | 업무 |
| public insertRow() | L248-251 | E5 | 팝업 Bbs02_Edit_Notice 열기 | 업무 |
| public deleteRow() | L254-255 | 공개 메서드 | 상태 처리 | 업무 |
| public buildGrid() | L185-217 | 필드 초기화 | 팝업 Bbs02_Edit_Notice 열기, 조회창 Bbs07_Lookup_Comment 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L257-259 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L204) addPin
  gb.date('fromDate', 100, '공지일'),  // L205
  gb.date('toDate', 100, '종료일'),  // L206
  gb.textCenter('openYn', 50, '상태'),  // L207
  gb.textCenter('noticeNo', 100, '공지번호'),  // L208
  gb.text('noticeDetailFullNm', 200, '공지구분'),  // L209
  gb.text('title', 500, '제목'),  // L210
  gb.longCenter('commentCnt', 40, '댓글'),  // L211
  // ⚠ 대응 없음 (GridBuilder L212) addCell
  // ⚠ 대응 없음 (GridBuilder L213) addCell
  gb.text('note', 300, '기타메모'),  // L214
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="group" onClick={() => /* 인라인 L176-182 (new SelectHandler() { @Override publi…) */}>그룹설정</Button>

### Bbs07_Lookup_Comment (`client/vi/bbs/Bbs07_Lookup_Comment.java`, 181줄)

- 툴바 `buttonBar`: {countComment}
- 입력·하위 화면: `lookup` Bbs07_Lookup_FileList

#### 이벤트
[E0] 화면 열림 (생성자 L55-77) → settings(), show()
[E1] closeButton[닫기].Select (L80) → hide()
[E2] grid.CellClick [event.getCellIndex() == 3] (L86) → retrieve(), deleteChk()
       └ [E3] msgBox.DialogHide [YES] (L115) → delete()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L50-53 | 공개 메서드 | 상태 처리 | 업무 |
| private deleteChk() | L112-131 | E2 | ConfirmBox → E3 | 업무 |
| public retrieve() | L133-148 | E2,open | 서비스 bbs.Bbs07_Comment.selectByNoticeId(companyId, personId, noticeId) | 업무 |
| private getSize() | L150-166 | retrieve | 서비스 bbs.Bbs07_Comment.getSize(companyId, noticeId) | 업무 |
| private delete() | L172-176 | E3 | GridDeleteData bbs.Bbs07_Comment.delete(체크된 행 목록) | 업무 |
| private settings() | L79-102 | 생성자 | 조회창 Bbs07_Lookup_FileList 열기, 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L104-110 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L168-170 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L178-180 | getSize,필드 초기화 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L106) addTextHtml
  // ⚠ 대응 없음 (GridBuilder L107) addTextSmall
  // ⚠ 대응 없음 (GridBuilder L108) addTextSmall
];
```

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>

### Bbs07_Lookup_FileList (`client/vi/bbs/Bbs07_Lookup_FileList.java`, 255줄)

- 툴바 `buttonBar`: {uploadFileButton} {fileUploadForm}
- 입력·하위 화면: `lookupViewer` Sys10_Lookup_FileViewer
- 그리드 `fileGrid` (buildFileGrid()):
  - fileName 440 "첨부파일" Text
  - actionCell 50 "보기" Cell 편집:viewCell
  - actionCell 50 "받기" Cell 편집:downloadCell
  - actionCell 50 "삭제" Cell 편집:deleteCell

#### 이벤트
[E0] 화면 열림 (생성자 L76-128) → settings(), show()
[E1] fileUpload.Change (L91) → 인라인 L91-98 (new ChangeHandler() { @Override publi…)
[E2] fileUploadForm.SubmitComplete (L101) → retrieve()
[E3] uploadFileButton[파일업로드].Select (L131) → 인라인 L131-136 (new SelectHandler() { @Override publi…)
[E4] fileDeleteForm.SubmitComplete (L139) → retrieve()
[E5] closeButton[닫기].Select (L145) → hide()
[E6] msgBox.DialogHide [YES] (L173) → checkFileDelete()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L63-74 | 공개 메서드 | 상태 처리 | 업무 |
| private buildFileGrid() | L154-208 | 필드 초기화 | 조회창 Sys10_Lookup_FileViewer 열기, 확인창 표시 | 업무 |
| public retrieve() | L210-219 | E2,E4,open,checkFileDelete | 서비스 sys.Sys10_File.selectByParentId(parentId) | 업무 |
| private checkFileDelete() | L221-246 | E6 | 서비스 sys.Sys11_RelateFile.checkFileDelete(fileId, parentId) | 업무 |
| public clear() | L252-254 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L130-152 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlHeaderStyle() | L248-250 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildFileGrid = () => [
  gb.text('fileNm', 440, '첨부파일'),  // L202
  // ⚠ 대응 없음 (GridBuilder L203) addCell
  // ⚠ 대응 없음 (GridBuilder L204) addCell
  // ⚠ 대응 없음 (GridBuilder L205) addCell
];
```

#### 사용된 버튼들
1. <Button type="upload" onClick={() => /* 인라인 L131-136 (new SelectHandler() { @Override publi…) */}>파일업로드</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Bbs02_Edit_Notice (`client/vi/bbs/Bbs02_Edit_Notice.java`, 742줄)

- 툴바 `buttonBar`: 개별 대상자: {insertButton} {deleteTargetButton} {deleteAllButton} {groupButton}
- 입력·하위 화면: `title` TextField, `userName` TextField, `noticeType` TextField, `noticeDetailCode` TextField, `notice` MyTextArea, `note` MyTextArea, `fromDate` MyDateField, `toDate` MyDateField, `topNoticeYn` CheckBox, `topNoticeCloseDate` MyDateField, `commentYn` CheckBox, `openYn` StringComboBox, `noticeTypeName` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode"), `noticeDetailName` CommonComboBoxField("sys.Sys09_Code.selectByCode3", "없음"), `lookup` Emp57_Lookup_List, `lookupFile` Bbs02_Lookup_File, `popup` Bbs02_Popup_NoticeAdmin, `editor` Bbs02_Lookup_LoadBbs
- 그리드 `targetGrid` (buildGrid(), 체크박스(다중)):
  - orgName 140 "조직" Text
  - titleName 100 "직책" Text
  - empNo 80 "사번" Text
  - empName 80 "성명" Text

#### 이벤트
[E0] 화면 열림 (생성자 L126-389) → getEditor()
[E1] noticeTypeName[공지구분].Collapse (L149) → setGridButton()
[E2] insertButton[등록].Select (L177) → insertRow()
[E3] deleteTargetButton[삭제].Select (L195) → deleteTargetModel()
[E4] deleteAllButton[전체삭제].Select [YES] (L201) → deleteAllTarget()
[E5] messageBox.DialogHide [YES] (L207) → deleteAllTarget()
[E6] groupButton[그룹].Select [result != null] (L218) → 인라인 L218-252 (new SelectHandler() { @Override publi…)
[E7] copyButton[불러오기].Select (L253) → loadBbs()
[E8] updateButton[저장].Select (L259) → update()
[E9] deleteButton[삭제].Select (L265) → delete()
       └ [E15] msgBox.DialogHide [YES] (L609) → deleteAllTarget(), hide()
[E10] closeButton[닫기].Select ["NEW".equals(actionName)] (L271) → hide()
[E11] addFileButton[첨부파일 등록(0)].Select (L280) → setFileButtonText()
[E12] alarmButton[예약알람설정(0)].Select (L292) → setAlarmButtonText()
[E13] previewButton[미리보기].Select (L304) → 인라인 L304-312 (new SelectHandler() { @Override publi…)
[E14] topNoticeYn[상단고정].ValueChange (L313) → setTopNoticeYn()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setTopNoticeYn() | L391-398 | E14,newNotice,editNotice | 상태 처리 | 업무 |
| public newNotice() | L400-441 | 공개 메서드 | 상태 처리 | 업무 |
| public editNotice() | L443-483 | 공개 메서드 | 상태 처리 | 업무 |
| private setGridButton() | L485-500 | E1,newNotice,editNotice | 상태 처리 | 업무 |
| private setFileButtonText() | L502-513 | E11,editNotice | 서비스 sys.Sys10_File.selectByParentId(parentId) | 업무 |
| private setAlarmButtonText() | L515-526 | E12,editNotice | 서비스 sch.Sch06_Alarm.selectByTargetId(targetId) | 업무 |
| private insertRow() | L538-568 | E2 | 조회창 Emp01_Lookup_PersonModel 열기 | 업무 |
| private retrieveGrid() | L570-576 | editNotice,deleteAllTarget | 서비스 bbs.Bbs03_Target.selectByNoticeId(noticeId, companyId, fromDate) | 업무 |
| private deleteTargetModel() | L578-582 | E3 | GridDeleteData bbs.Bbs03_Target.delete(체크된 행 목록) | 업무 |
| private deleteAllTarget() | L584-596 | E4,E5,E15 | 서비스 bbs.Bbs03_Target.deleteAllTarget | 업무 |
| private delete() | L598-632 | E9 | ConfirmBox → E15 | 업무 |
| private loadBbs() | L634-646 | E7 | 조회창 Bbs02_Lookup_LoadBbs 열기 | 업무 |
| public update() | L648-680 | E8 | 상태 처리 | 업무 |
| private updateTarget() | L682-685 | update | 서비스 bbs.Bbs03_Target.update | 업무 |
| private updateData() | L687-695 | update | 서비스 bbs.Bbs02_Notice.update | 업무 |
| private getEditor() | L697-709 | 생성자 | 상태 처리 | 업무 |
| private buildGrid() | L528-536 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtml() | L711-714 | 미사용 후보 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L726-728 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L730-732 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L734-736 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L738-740 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('korNm', 140, '조직'),  // L531
  gb.text('titleNm', 100, '직책'),  // L532
  gb.text('empNo', 80, '사번'),  // L533
  gb.text('korNm', 80, '성명'),  // L534
];
```

#### 사용된 버튼들
1. <Button type="register" onClick={insertRow}>등록</Button>
2. <Button type="delete" onClick={deleteTargetModel}>삭제</Button>
3. <Button type="delete" onClick={deleteAllTarget}>전체삭제</Button>
4. <Button type="group" onClick={() => /* 인라인 L218-252 (new SelectHandler() { @Override publi…) */}>그룹</Button>
5. <Button type="save" onClick={update}>저장</Button>
6. <Button type="delete" onClick={delete}>삭제</Button>
7. <Button type="unknown" onClick={hide}>닫기</Button>
8. <Button type="unknown" onClick={setFileButtonText}>첨부파일 등록(0)</Button>
9. <Button type="unknown" onClick={setAlarmButtonText}>예약알람설정(0)</Button>
10. <Button type="unknown" onClick={() => /* 인라인 L304-312 (new SelectHandler() { @Override publi…) */}>미리보기</Button>
11. <Button type="register" onClick={loadBbs}>불러오기</Button>

### Bbs02_Lookup_LoadBbs (`client/vi/bbs/Bbs02_Lookup_LoadBbs.java`, 321줄)

- 레이아웃: west=vlc, center=cp
- 툴바 `buttonBar`: 공지구분: {noticeTypeCombo} {noticeDetailCombo} 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `searchText` TextField 빈칸="제목", `noticeTypeCombo` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode", "%", "전체", "전체"), `noticeDetailCombo` CommonComboBoxField("sys.Sys09_Code.selectByCode3", "%", "전체", "전체")
- 그리드 `grid` (buildGrid(), 체크박스):
  - fromDate 100 "공지일" Date
  - noticeNo 100 "공지번호" TextCenter
  - noticeDetailFullName 200 "공지구분" Text
  - title 500 "제목" Text

#### 이벤트
[E0] 화면 열림 (생성자 L84-142) → settings()
[E1] noticeTypeCombo[sys.Sys00_Common.selectByKindGroupCode].Collapse (L157) → retrieve()
[E2] noticeDetailCombo[sys.Sys09_Code.selectByCode3].Collapse (L198) → retrieve()
[E3] searchText.KeyPress [Enter] (L206) → retrieve()
[E4] grid.CellClick (L214) → setHtml()
[E5] retrieveButton[조회].Select (L224) → retrieve()
[E6] insertButton[확인].Select (L230) → insert()
[E7] closeButton[닫기].Select (L236) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L79-82 | 공개 메서드 | 상태 처리 | 업무 |
| private insert() | L268-275 | E6 | 미선택 시 alert "문서를 선택해주세요" | 업무 |
| public retrieve() | L286-308 | E1,E2,E3,E5,settings | 상태 처리 | 업무 |
| public getServiceResult() | L311-320 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L144-242 | 생성자 | 서비스 sys.Sys00_Common.selectByKindGroupCode, sys.Sys09_Code.selectByCode3, sys.Sys09_Code.selectByCode3, 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L244-253 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtml() | L255-258 | E4 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L260-262 | 미사용 후보 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L264-266 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L277-279 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('fromDate', 100, '공지일'),  // L248
  gb.textCenter('noticeNo', 100, '공지번호'),  // L249
  gb.text('noticeDetailFullNm', 200, '공지구분'),  // L250
  gb.text('title', 500, '제목'),  // L251
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={insert}>확인</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

