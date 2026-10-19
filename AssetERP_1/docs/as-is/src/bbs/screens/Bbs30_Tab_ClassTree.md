# Bbs30_Tab_ClassTree

- 종류: 화면
- 메뉴: 커뮤니티 > 05. 게시판 > 게시판 (#1379)
- 파일: `client/vi/bbs/Bbs30_Tab_ClassTree.java`
- 함께 쓰는 클래스 8개:
  - `Bbs31_Grid_Content` `client/vi/bbs/Bbs31_Grid_Content.java`
  - `Bbs31_Lookup_Content` `client/vi/bbs/Bbs31_Lookup_Content.java`
  - `Bbs32_TapPage_Comment` `client/vi/bbs/Bbs32_TapPage_Comment.java`
  - `Bbs32_Lookup_FileList` `client/vi/bbs/Bbs32_Lookup_FileList.java`
  - `Bbs31_Edit_Content` `client/vi/bbs/Bbs31_Edit_Content.java`
  - `Bbs30_Lookup_ClassTree` `client/vi/bbs/Bbs30_Lookup_ClassTree.java`
  - `Bbs33_Lookup_Role` `client/vi/bbs/Bbs33_Lookup_Role.java`
  - `Bbs30_Lookup_ParentTree` `client/vi/bbs/Bbs30_Lookup_ParentTree.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Bbs02_Lookup_File`](../../bbs/components/Bbs02_Lookup_File.md), [`Emp00_Lookup_SelectMulti`](../../emp/components/Emp00_Lookup_SelectMulti.md), [`Org00_Lookup_SelectMulti`](../../org/components/Org00_Lookup_SelectMulti.md), [`Sys10_Lookup_FileViewer`](../../sys/components/Sys10_Lookup_FileViewer.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `bbs.Bbs30_ClassTree.delete` | Bbs30_Lookup_ClassTree:333 | [`Bbs30_ClassTree.java:104`](../../bbs/services/Bbs30_ClassTree.md) | `UpdateDataModel(bbs30_class_tree)` 동적 DELETE |
| `bbs.Bbs30_ClassTree.selectByParentTreeId` | Bbs30_Lookup_ClassTree:369 | [`Bbs30_ClassTree.java:65`](../../bbs/services/Bbs30_ClassTree.md) | [`bbs30_class_tree.selectByParentTreeId`](../../bbs/sql/bbs30_class_tree.md) |
| `bbs.Bbs30_ClassTree.selectByRoleUserTypeCode` | Bbs30_Tab_ClassTree:144 | [`Bbs30_ClassTree.java:52`](../../bbs/services/Bbs30_ClassTree.md) | [`bbs30_class_tree.selectByRoleUserTypeCode`](../../bbs/sql/bbs30_class_tree.md) |
| `bbs.Bbs30_ClassTree.selectByTypeCode` | Bbs30_Lookup_ClassTree:263, Bbs30_Lookup_ParentTree:90 | [`Bbs30_ClassTree.java:30`](../../bbs/services/Bbs30_ClassTree.md) | [`bbs30_class_tree.selectByTypeCode`](../../bbs/sql/bbs30_class_tree.md) |
| `bbs.Bbs30_ClassTree.update` | Bbs30_Lookup_ClassTree:302 | [`Bbs30_ClassTree.java:99`](../../bbs/services/Bbs30_ClassTree.md) | `UpdateDataModel(bbs30_class_tree)` 동적 INSERT/UPDATE → [`bbs30_class_tree.selectById`](../../bbs/sql/bbs30_class_tree.md) |
| `bbs.Bbs30_ClassTree.updateParentTreeId` | Bbs30_Lookup_ParentTree:111 | [`Bbs30_ClassTree.java:77`](../../bbs/services/Bbs30_ClassTree.md) | [`bbs30_class_tree.updateParentTreeId`](../../bbs/sql/bbs30_class_tree.md) |
| `bbs.Bbs30_ClassTree.updatePublicYn` | Bbs33_Lookup_Role:176 | [`Bbs30_ClassTree.java:88`](../../bbs/services/Bbs30_ClassTree.md) | [`bbs30_class_tree.updatePublicYn`](../../bbs/sql/bbs30_class_tree.md) |
| `bbs.Bbs31_Content.modelDelete` | Bbs31_Lookup_Content:177 | [`Bbs31_Content.java:79`](../../bbs/services/Bbs31_Content.md) | `UpdateDataModel(bbs31_content)` 동적 DELETE |
| `bbs.Bbs31_Content.modelUpdate` | Bbs31_Edit_Content:195 | [`Bbs31_Content.java:58`](../../bbs/services/Bbs31_Content.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(bbs31_content)` 동적 INSERT/UPDATE → [`bbs31_content.selectById`](../../bbs/sql/bbs31_content.md) |
| `bbs.Bbs31_Content.selectByClassTreeId` | Bbs30_Lookup_ClassTree:413 | [`Bbs31_Content.java:28`](../../bbs/services/Bbs31_Content.md) | [`bbs31_content.selectByClassTreeId`](../../bbs/sql/bbs31_content.md) |
| `bbs.Bbs31_Content.selectByClassTreeIdPaging` | Bbs31_Grid_Content:61 | [`Bbs31_Content.java:40`](../../bbs/services/Bbs31_Content.md) | [`bbs31_content.selectByClassTreeIdPaging`](../../bbs/sql/bbs31_content.md), [`bbs31_content.selectByClassTreeIdPagingTotal`](../../bbs/sql/bbs31_content.md) |
| `bbs.Bbs31_Content.selectById` | Bbs31_Lookup_Content:119 | [`Bbs31_Content.java:22`](../../bbs/services/Bbs31_Content.md) | [`bbs31_content.selectById`](../../bbs/sql/bbs31_content.md) |
| `bbs.Bbs31_Content.selectByParentTreeId` | Bbs30_Lookup_ClassTree:306 | [`Bbs31_Content.java:34`](../../bbs/services/Bbs31_Content.md) | [`bbs31_content.selectByParentTreeId`](../../bbs/sql/bbs31_content.md) |
| `bbs.Bbs32_Comment.delete` | Bbs32_TapPage_Comment:187 | [`Bbs32_Comment.java:84`](../../bbs/services/Bbs32_Comment.md) | `UpdateDataModel(bbs32_comment)` 동적 DELETE |
| `bbs.Bbs32_Comment.getSize` | Bbs32_TapPage_Comment:152 | [`Bbs32_Comment.java:39`](../../bbs/services/Bbs32_Comment.md) | [`bbs32_comment.getSize`](../../bbs/sql/bbs32_comment.md) |
| `bbs.Bbs32_Comment.modelUpdate` | Bbs32_TapPage_Comment:168 | [`Bbs32_Comment.java:50`](../../bbs/services/Bbs32_Comment.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(bbs32_comment)` 동적 INSERT/UPDATE → [`bbs32_comment.selectById`](../../bbs/sql/bbs32_comment.md) |
| `bbs.Bbs32_Comment.selectByContentId` | Bbs32_TapPage_Comment:142 | [`Bbs32_Comment.java:28`](../../bbs/services/Bbs32_Comment.md) | [`bbs32_comment.selectByContentId`](../../bbs/sql/bbs32_comment.md) |
| `bbs.Bbs33_Role.checkRole` | Bbs31_Grid_Content:142 | [`Bbs33_Role.java:30`](../../bbs/services/Bbs33_Role.md) | [`bbs33_role.checkRole`](../../bbs/sql/bbs33_role.md) |
| `bbs.Bbs33_Role.delete` | Bbs33_Lookup_Role:268 | [`Bbs33_Role.java:47`](../../bbs/services/Bbs33_Role.md) | `UpdateDataModel(bbs33_role)` 동적 DELETE |
| `bbs.Bbs33_Role.selectByClassTreeId` | Bbs33_Lookup_Role:155 | [`Bbs33_Role.java:24`](../../bbs/services/Bbs33_Role.md) | [`bbs33_role.selectByClassTreeId`](../../bbs/sql/bbs33_role.md) |
| `bbs.Bbs33_Role.update` | Bbs33_Lookup_Role:165 | [`Bbs33_Role.java:42`](../../bbs/services/Bbs33_Role.md) | `UpdateDataModel(bbs33_role)` 동적 INSERT/UPDATE → [`bbs33_role.selectById`](../../bbs/sql/bbs33_role.md) |
| `sys.Sys10_File.selectByParentId` | Bbs31_Edit_Content:172, Bbs31_Lookup_Content:197, Bbs32_Lookup_FileList:213 | [`Sys10_File.java:51`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |
| `sys.Sys11_RelateFile.checkFileDelete` | Bbs32_Lookup_FileList:224 | [`Sys11_RelateFile.java:59`](../../sys/services/Sys11_RelateFile.md) | [`sys11_relate_file.checkFileDelete01`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete02`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete03`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.deleteRelateFile`](../../sys/sql/sys11_relate_file.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr99_appr_del`](../../../db/tables/apr.md), [`bbs30_class_tree`](../../../db/tables/bbs.md), [`bbs31_content`](../../../db/tables/bbs.md), [`bbs32_comment`](../../../db/tables/bbs.md), [`bbs33_role`](../../../db/tables/bbs.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md)

## DB 함수

`f_emp_kor_nm`, `f_get_emptrans`, `f_org_parent_full_nm`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Bbs30_Tab_ClassTree (`client/vi/bbs/Bbs30_Tab_ClassTree.java`, 170줄)

- 레이아웃: west=vlc, center=cp02
- 툴바 `buttonBar01`: {insertButton}
- 툴바 `buttonBar02`: {anchor}
- 입력·하위 화면: `lookup` Bbs30_Lookup_ClassTree

#### 이벤트
[E0] 화면 열림 (생성자 L46-96) → settings(), retrieve()
[E1] anchor.MouseDown (L52) → retrieve()
[E2] grid.RowClick (L99) → 인라인 L99-104 (new RowClickHandler() { @Override pub…)
[E3] insertButton[게시물 항목 설정].Select (L105) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L129-164 | 생성자,E1,E3 | 서비스 bbs.Bbs30_ClassTree.selectByRoleUserTypeCode(companyId, orgId, personId, typeCode) | 업무 |
| private settings() | L98-117 | 생성자 | 조회창 Bbs30_Lookup_ClassTree 열기, 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L119-127 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| public setHtmlGridStyle() | L166-169 | 공개 메서드 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('parentTreeNm', 0, ' '),  // L121
  // ⚠DB없음 L122 actionCell 10 " " (bbs31_action_cell 컬럼 없음)
  // ⚠ 대응 없음 (GridBuilder L123) addTextBold
  gb.long('count', 60, ' '),  // L124
];
```

#### 사용된 버튼들
1. <Button type="save" onClick={retrieve}>게시물 항목 설정</Button>

### Bbs31_Grid_Content (`client/vi/bbs/Bbs31_Grid_Content.java`, 205줄)

- 툴바 `buttonBar`: 검색: {searhText} {retrieveButton} {insertButton}
- 입력·하위 화면: `searhText` TextField 빈칸="게시물 제목/작성자", `lookup` Bbs31_Lookup_Content
- 그리드 `grid` (buildGrid(), 체크박스):
  - regDateStr 200 "등록일시" TextCenter
  - titleRole 500 "제목" TextHtml
  - personName 100 "작성자" TextCenter
  - actionCell 60 "상세보기" Cell 편집:detailCell

#### 이벤트
[E0] 화면 열림 (생성자 L49-68) → settings()
[E1] searhText.KeyPress [Enter] (L73) → retrieve()
[E2] insertButton[게시물 작성].Select (L81) → insert()
[E3] retrieveButton[검색].Select (L87) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L134-160 | E1,E3,buildGrid,insert | 서비스 bbs.Bbs33_Role.checkRole(orgId, personId, classTreeId) | 업무 |
| private retrieve() | L162-180 | E1,E3,buildGrid,insert | 상태 처리 | 업무 |
| public insert() | L182-200 | E2 | 팝업 Bbs31_Edit_Content 열기 | 업무 |
| private settings() | L70-93 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L95-132 | 필드 초기화 | 조회창 Bbs31_Lookup_Content 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L202-204 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('regDateStr', 200, '등록일시'),  // L126 SQL 계산 컬럼(selectByClassTreeIdPaging: ( TO_CHAR(bbs31_reg_date, 'YY.MM.DD') |…)
  // ⚠ 대응 없음 (GridBuilder L127) addTextHtml
  gb.textCenter('personNm', 100, '작성자'),  // L128 SQL 계산 컬럼(selectByClassTreeIdPaging: f_emp_kor_nm(bbs31_person_id))
  // ⚠ 대응 없음 (GridBuilder L129) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>검색</Button>
2. <Button type="register" onClick={insert}>게시물 작성</Button>

### Bbs31_Lookup_Content (`client/vi/bbs/Bbs31_Lookup_Content.java`, 225줄)

- 입력·하위 화면: `tabPage` Bbs32_TapPage_Comment, `lookup` Bbs31_Edit_Content, `lookupFile` Bbs02_Lookup_File

#### 이벤트
[E0] 화면 열림 (생성자 L107-109) → settings()
[E1] updateButton[수정].Select (L112) → refresh()
[E2] deleteButton[삭제].Select (L134) → deleteChk()
       └ [E5] msgBox.DialogHide [YES] (L159) → delete()
[E3] closeButton[닫기].Select (L140) → hide()
[E4] fileButton[첨부파일 확인].Select (L147) → 인라인 L147-153 (new SelectHandler(){ @Override public…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L54-105 | 공개 메서드 | 상태 처리 | 업무 |
| private deleteChk() | L156-174 | E2 | ConfirmBox → E5 | 업무 |
| private delete() | L176-188 | E5 | 서비스 bbs.Bbs31_Content.modelDelete | 업무 |
| private refresh() | L190-194 | E1 | 상태 처리 | 업무 |
| private setFileButtonText() | L196-207 | open,refresh | 서비스 sys.Sys10_File.selectByParentId(parentId) | 업무 |
| private settings() | L111-154 | 생성자 | 팝업 Bbs31_Edit_Content 열기, 조회창 Bbs02_Lookup_File 열기, 서비스 bbs.Bbs31_Content.selectById(contentId), 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlCheckBoxStyle() | L209-211 | 미사용 후보 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L218-220 | open,refresh | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L222-224 | 미사용 후보 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={refresh}>수정</Button>
2. <Button type="delete" onClick={deleteChk}>삭제</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>
4. <Button type="unknown" onClick={() => /* 인라인 L147-153 (new SelectHandler(){ @Override public…) */}>첨부파일 확인</Button>

### Bbs32_TapPage_Comment (`client/vi/bbs/Bbs32_TapPage_Comment.java`, 193줄)

- 툴바 `buttonBar`: 댓글등록: {commentField} {insertButton}
- 입력·하위 화면: `commentField` MyTextArea 빈칸="내용을 입력하세요", `lookup` Bbs32_Lookup_FileList

#### 이벤트
[E0] 화면 열림 (생성자 L51-66) → settings()
[E1] insertButton[등 록].Select (L71) → update()
[E2] grid.CellClick [event.getCellIndex() == 3] (L81) → retrieve(), deleteChk()
       └ [E3] msgBox.DialogHide [YES] (L113) → delete()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private deleteChk() | L109-133 | E2 | ConfirmBox → E3 | 업무 |
| public retrieve() | L135-149 | E2,update | 서비스 bbs.Bbs32_Comment.selectByContentId(contentId, personId) | 업무 |
| private getSize() | L151-165 | retrieve | 서비스 bbs.Bbs32_Comment.getSize(companyId, contentId) | 업무 |
| private update() | L167-182 | E1 | 서비스 bbs.Bbs32_Comment.modelUpdate(companyId, personId, contentId, comment) | 업무 |
| private delete() | L184-188 | E3 | GridDeleteData bbs.Bbs32_Comment.delete(체크된 행 목록) | 업무 |
| private settings() | L68-99 | 생성자 | 조회창 Bbs32_Lookup_FileList 열기, 미선택 시 alert "내용을 입력해주세요", 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L101-107 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L190-192 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L103) addTextHtml
  // ⚠ 대응 없음 (GridBuilder L104) addTextSmall
  // ⚠ 대응 없음 (GridBuilder L105) addTextSmall
];
```

#### 사용된 버튼들
1. <Button type="unknown" onClick={update}>등 록</Button>

### Bbs32_Lookup_FileList (`client/vi/bbs/Bbs32_Lookup_FileList.java`, 255줄)

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

### Bbs31_Edit_Content (`client/vi/bbs/Bbs31_Edit_Content.java`, 254줄)

- 입력·하위 화면: `hideYn` CheckBox, `title` TextField, `personName` TextField, `regDate` MyDateField, `lookupFile` Bbs02_Lookup_File

#### 이벤트
[E0] 화면 열림 (생성자 L115-142) → settings(), getEditor()
[E1] updateButton[등록].Select (L145) → update()
[E2] closeButton[닫기].Select (L151) → hide()
[E3] addFileButton[첨부파일 등록(0)].Select (L157) → setFileButtonText()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public insert() | L68-91 | 공개 메서드 | 상태 처리 | 업무 |
| public edit() | L93-113 | 공개 메서드 | LabelHtml 래퍼 | 업무 |
| private setFileButtonText() | L171-182 | E3,edit | 서비스 sys.Sys10_File.selectByParentId(parentId) | 업무 |
| public update() | L184-207 | E1 | 서비스 bbs.Bbs31_Content.modelUpdate(editchk) | 업무 |
| private getEditor() | L209-221 | 생성자 | 상태 처리 | 업무 |
| private settings() | L144-169 | 생성자 | 조회창 Bbs02_Lookup_File 열기, 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtml() | L223-226 | 미사용 후보 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L238-240 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L242-244 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L246-248 | 미사용 후보 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L250-252 | insert,edit | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="register" onClick={update}>등록</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>
3. <Button type="unknown" onClick={setFileButtonText}>첨부파일 등록(0)</Button>

### Bbs30_Lookup_ClassTree (`client/vi/bbs/Bbs30_Lookup_ClassTree.java`, 455줄)

- 툴바 `buttonBar01`: {insertButton01} {updateButton01} {deleteButton01}
- 툴바 `buttonBar02`: {insertButton02} {updateButton02} {deleteButton02}
- 입력·하위 화면: `lookup` Bbs30_Lookup_ParentTree
- 그리드 `grid01` (buildGrid01()):
  - classTreeName 200 "게시물 분류명" Text 편집:TextField
  - useYn 50 "사용" Boolean
- 그리드 `grid02` (buildGrid02()):
  - actionCell 50 "이동" Cell 편집:actionCell01
  - classTreeName 200 "게시물 세부항목명" Text 편집:TextField
  - useYn 50 "사용" Boolean
  - publicYn 100 "전체공개" Boolean
  - actionCell 50 "권한" Cell 편집:actionCell02
  - seq 50 "순서" Long 편집:LongField

#### 이벤트
[E0] 화면 열림 (생성자 L76-113) → settings(), show()
[E1] insertButton01[등록].Select (L116) → insert01()
[E2] grid01.RowClick (L122) → retrieve02()
[E3] updateButton01[저장].Select (L128) → update01()
[E4] deleteButton01[삭제].Select (L134) → deleteChk01()
[E5] insertButton02[등록].Select (L141) → insert02()
[E6] updateButton02[저장].Select (L147) → update02()
[E7] deleteButton02[삭제].Select (L153) → deleteChk02()
[E8] closeButton[닫기].Select (L159) → hide()
[E9] msgBox.DialogHide [YES] (L326) → 서비스 bbs.Bbs30_ClassTree.delete
[E10] msgBox.DialogHide [YES] (L433) → 서비스 bbs.Bbs30_ClassTree.delete

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L71-74 | 공개 메서드 | 상태 처리 | 업무 |
| private buildGrid01() | L168-173 | 필드 초기화 | 상태 처리 | 업무 |
| private buildGrid02() | L175-256 | 필드 초기화 | 조회창 Bbs30_Lookup_ParentTree 열기, 조회창 Bbs33_Lookup_Role 열기, 미선택 시 alert "게시물 세부항목명은 필수입력 항목입니다" | 업무 |
| private retrieve01() | L258-274 | open | 서비스 bbs.Bbs30_ClassTree.selectByTypeCode(companyId, typeCode) | 업무 |
| public insert01() | L276-284 | E1 | 상태 처리 | 업무 |
| private update01() | L286-303 | E3 | 서비스 bbs.Bbs30_ClassTree.update | 업무 |
| private deleteChk01() | L305-321 | E4 | 서비스 bbs.Bbs31_Content.selectByParentTreeId(classTreeId) | 업무 |
| private delete01() | L323-343 | deleteChk01 | 확인창 표시, GridDeleteData bbs.Bbs30_ClassTree.delete(체크된 행 목록) | 업무 |
| private retrieve02() | L345-370 | E2,buildGrid02,retrieve01 | 서비스 bbs.Bbs30_ClassTree.selectByParentTreeId(companyId, typeCode, parentTreeId) | 업무 |
| public insert02() | L372-386 | E5 | 상태 처리 | 업무 |
| private update02() | L388-410 | E6 | 서비스 bbs.Bbs30_ClassTree.update | 업무 |
| private deleteChk02() | L412-428 | E7 | 서비스 bbs.Bbs31_Content.selectByClassTreeId(classTreeId) | 업무 |
| private delete02() | L430-450 | deleteChk02 | 확인창 표시, GridDeleteData bbs.Bbs30_ClassTree.delete(체크된 행 목록) | 업무 |
| private settings() | L115-166 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlHeaderStyle() | L452-454 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid01 = () => [
  gb.text('classTreeNm', 200, '게시물 분류명', { editor: 'text' }),  // L170
  gb.boolean('useYn', 50, '사용'),  // L171
];

const buildGrid02 = () => [
  // ⚠ 대응 없음 (GridBuilder L249) addCell
  gb.text('classTreeNm', 200, '게시물 세부항목명', { editor: 'text' }),  // L250
  gb.boolean('useYn', 50, '사용'),  // L251
  gb.boolean('publicYn', 100, '전체공개'),  // L252
  // ⚠ 대응 없음 (GridBuilder L253) addCell
  gb.long('seq', 50, '순서', { editor: 'number' }),  // L254
];
```

#### 사용된 버튼들
1. <Button type="register" onClick={insert01}>등록</Button>
2. <Button type="save" onClick={update01}>저장</Button>
3. <Button type="delete" onClick={deleteChk01}>삭제</Button>
4. <Button type="register" onClick={insert02}>등록</Button>
5. <Button type="save" onClick={update02}>저장</Button>
6. <Button type="delete" onClick={deleteChk02}>삭제</Button>
7. <Button type="unknown" onClick={hide}>닫기</Button>

### Bbs33_Lookup_Role (`client/vi/bbs/Bbs33_Lookup_Role.java`, 274줄)

- 툴바 `buttonBar`: {retrieveButton} {updateButton} {insertButton01} {insertButton02} {deleteButton}
- 입력·하위 화면: `lookupEmpTransInfo` Emp00_Lookup_SelectMulti, `orgSearch` Org00_Lookup_SelectMulti
- 그리드 `grid` (buildFileGrid(), 체크박스(다중)):
  - roleName 100 "구분" TextCenter
  - personName 110 "사원명" TextCenter
  - orgName 200 "부서명" Text

#### 이벤트
[E0] 화면 열림 (생성자 L71-100) → settings(), show()
[E1] retrieveButton[조회].Select (L103) → retrieve()
[E2] updateButton[저장].Select (L109) → update()
[E3] insertButton01[직원추가].Select (L115) → insertRow()
[E4] insertButton02[부서추가].Select (L121) → insertRow()
[E5] deleteButton[삭제].Select (L127) → deleteChk()
       └ [E7] msgBox.DialogHide [YES] (L248) → deleteRow()
[E6] closeButton[닫기].Select (L133) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L64-69 | 공개 메서드 | 상태 처리 | 업무 |
| private buildFileGrid() | L142-150 | 필드 초기화 | 상태 처리 | 업무 |
| public retrieve() | L152-161 | E1,open | 서비스 bbs.Bbs33_Role.selectByClassTreeId(classTreeId) | 업무 |
| public update() | L163-173 | E2 | 서비스 bbs.Bbs33_Role.update | 업무 |
| private updatePublicYn() | L175-187 | update | 서비스 bbs.Bbs30_ClassTree.updatePublicYn(classTreeId, publicYn) | 업무 |
| public insertRow() | L189-243 | E3,E4 | 조회창 Emp00_Lookup_SelectMulti 열기, 조회창 Org00_Lookup_SelectMulti 열기 | 업무 |
| private deleteChk() | L245-263 | E5 | ConfirmBox → E7 | 업무 |
| public deleteRow() | L265-269 | E7 | GridDeleteData bbs.Bbs33_Role.delete(체크된 행 목록) | 업무 |
| private settings() | L102-140 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlHeaderStyle() | L271-273 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildFileGrid = () => [
  gb.textCenter('roleNm', 100, '구분'),  // L145 SQL 계산 컬럼(selectByClassTreeId: CASE WHEN bbs33_role_cd = 'P' THEN '사원'…)
  gb.textCenter('personNm', 110, '사원명'),  // L146 SQL 계산 컬럼(selectByClassTreeId: f_emp_kor_nm(bbs33_person_id))
  gb.text('orgNm', 200, '부서명'),  // L147 SQL 계산 컬럼(selectByClassTreeId: CASE WHEN bbs33_role_cd = 'P' THEN f_ge…)
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="addRow" onClick={insertRow}>직원추가</Button>
4. <Button type="addRow" onClick={insertRow}>부서추가</Button>
5. <Button type="delete" onClick={deleteChk}>삭제</Button>
6. <Button type="unknown" onClick={hide}>닫기</Button>

### Bbs30_Lookup_ParentTree (`client/vi/bbs/Bbs30_Lookup_ParentTree.java`, 138줄)

- 그리드 `grid` (buildGrid01(), 체크박스):
  - classTreeName 200 "게시물 분류명" Text
  - useYn 50 "사용" BooleanYn2

#### 이벤트
[E0] 화면 열림 (생성자 L47-61) → settings(), show()
[E1] moveButton[이동].Select (L64) → update()
       └ [E3] msgBox.DialogHide [YES] (L106) → hide()
[E2] closeButton[닫기].Select (L70) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L41-45 | 공개 메서드 | 상태 처리 | 업무 |
| private buildGrid01() | L78-84 | 필드 초기화 | 상태 처리 | 업무 |
| private retrieve() | L86-96 | open | 서비스 bbs.Bbs30_ClassTree.selectByTypeCode(companyId, typeCode) | 업무 |
| private update() | L98-133 | E1 | ConfirmBox → E3 | 업무 |
| private settings() | L63-76 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlHeaderStyle() | L135-137 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid01 = () => [
  gb.text('classTreeNm', 200, '게시물 분류명'),  // L81
  gb.booleanYn2('useYn', 50, '사용'),  // L82
];
```

#### 사용된 버튼들
1. <Button type="unknown" onClick={update}>이동</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

