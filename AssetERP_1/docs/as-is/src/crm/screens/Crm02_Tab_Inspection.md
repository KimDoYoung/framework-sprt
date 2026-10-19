# Crm02_Tab_Inspection

- 종류: 화면
- 파일: `client/vi/crm/Crm02_Tab_Inspection.java`
- 함께 쓰는 클래스 2개:
  - `Crm02_Edit_Inspection` `client/vi/crm/Crm02_Edit_Inspection.java`
  - `Crm02_Grid_ApprFile` `client/vi/crm/Crm02_Grid_ApprFile.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Sys09_Tree_Code`](../../sys/components/Sys09_Tree_Code.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `crm.Crm02_Inspection.selectByFindText` | Crm02_Tab_Inspection:93 | [`Crm02_Inspection.java:29`](../../crm/services/Crm02_Inspection.md) | [`crm02_inspection.selectByFindText`](../../crm/sql/crm02_inspection.md) |
| `crm.Crm02_Inspection.update` | Crm02_Edit_Inspection:248 | [`Crm02_Inspection.java:56`](../../crm/services/Crm02_Inspection.md) | `UpdateDataModel(crm02_inspection)` 동적 INSERT/UPDATE → [`crm02_inspection.selectById`](../../crm/sql/crm02_inspection.md) |
| `sys.Sys10_File.selectByParentId` | Crm02_Grid_ApprFile:77 | [`Sys10_File.java:51`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |
| `sys.Sys11_RelateFile.checkFileDelete` | Crm02_Grid_ApprFile:138 | [`Sys11_RelateFile.java:59`](../../sys/services/Sys11_RelateFile.md) | [`sys11_relate_file.checkFileDelete01`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete02`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete03`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.deleteRelateFile`](../../sys/sql/sys11_relate_file.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr99_appr_del`](../../../db/tables/apr.md), [`crm02_inspection`](../../../db/tables/crm.md), [`emp01_person`](../../../db/tables/emp.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Crm02_Tab_Inspection (`client/vi/crm/Crm02_Tab_Inspection.java`, 226줄)

- 레이아웃: center=vlc, west=treePanel
- 툴바 `buttonBar`: 검색: {findText} {retrieveButton}
- 입력·하위 화면: `findText` TextField 빈칸="제목/내용", `buildTree` Sys09_Tree_Code, `typeCode` TextField, `typeName` TextField, `editItem` Crm02_Edit_Inspection
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - fromDate 100 "공지일" Date
  - title 400 "제목" Text
  - inspectionInfo 400 "내용" Text
  - actionCell 80 "상세보기" Cell 편집:downloadCell
  - createDate 100 "작성일" Date
  - korName 80 "작성자" Text

#### 이벤트
[E0] 화면 열림 (생성자 L57-60) → init(), retrieve()
[E1] findText.KeyPress [Enter] (L66) → retrieve()
[E2] sysTree.SelectionChanged (L76) → 서비스 crm.Crm02_Inspection.selectByFindText(companyId, typeCode, findText)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private init() | L62-135 | 생성자 | 서비스 crm.Crm02_Inspection.selectByFindText(companyId, typeCode, findText) | 업무 |
| public retrieveTree() | L137-139 | init | 상태 처리 | 업무 |
| public retrieve() | L184-205 | 생성자,E1,buildGrid | 서비스 crm.Crm02_Inspection.selectByFindText(companyId, typeCode, typeCode, findText) | 업무 |
| public update() | L207-210 | 공개 메서드 | 상태 처리 | 업무 |
| public insertRow() | L212-215 | 공개 메서드 | 상태 처리 | 업무 |
| public deleteRow() | L217-220 | 공개 메서드 | 상태 처리 | 업무 |
| public buildGrid() | L141-181 | 필드 초기화 | 팝업 Crm02_Edit_Inspection 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L222-224 | init | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('fromDate', 100, '공지일'),  // L173
  gb.text('title', 400, '제목'),  // L174
  gb.text('inspectionInfo', 400, '내용'),  // L175
  // ⚠ 대응 없음 (GridBuilder L176) addCell
  gb.date('createDate', 100, '작성일'),  // L177
  gb.text('korNm', 80, '작성자'),  // L178
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={undefined}>조회</Button>

### Crm02_Edit_Inspection (`client/vi/crm/Crm02_Edit_Inspection.java`, 315줄)

- 입력·하위 화면: `typeCode` TextField, `fromDate` MyDateField, `toDate` MyDateField, `createDate` MyDateField, `title` TextArea 빈칸="제목을 입력해주세요.", `inspectionInfo` TextArea 빈칸="내용을 입력해주세요.", `note` TextArea, `typeName` ComboBoxField("CmpInspectionCode") 빈칸="구분을 선택해주세요", `korName` TextField

#### 이벤트
[E0] 화면 열림 (생성자 L73-179) → 초기화
[E1] uploadFileButton[첨부파일 등록].Select (L127) → 인라인 L127-132 (new SelectHandler() { @Override publi…)
[E2] updateButton[저장].Select (L135) → update()
[E3] closeButton[닫기].Select (L143) → hide()
[E4] fileUpload.Change (L156) → 인라인 L156-163 (new ChangeHandler() { @Override publi…)
[E5] fileUploadForm.SubmitComplete (L166) → resetFileUpload()
[E6] fileUpload.Change (L297) → 인라인 L297-304 (new ChangeHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L181-212 | 공개 메서드 | 상태 처리 | 업무 |
| public manager() | L214-222 | 공개 메서드 | 상태 처리 | 업무 |
| public user() | L224-232 | 공개 메서드 | 상태 처리 | 업무 |
| private update() | L234-266 | E2 | 서비스 crm.Crm02_Inspection.update(inspectionModel) | 업무 |
| public retrieve() | L268-279 | 공개 메서드 | 상태 처리 | 업무 |
| private retrieveApproval() | L281-284 | retrieve | 상태 처리 | 업무 |
| public getServiceResult() | L287-288 | update | 상태 처리 | 업무 |
| private resetFileUpload() | L290-305 | E5 | 상태 처리 | 업무 |
| private setHtmlStyle() | L307-309 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L311-313 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>
3. <Button type="unknown" onClick={() => /* 인라인 L127-132 (new SelectHandler() { @Override publi…) */}>첨부파일 등록</Button>

### Crm02_Grid_ApprFile (`client/vi/crm/Crm02_Grid_ApprFile.java`, 161줄)

- 그리드 `fileGrid` (buildApprFileGrid(), 체크박스):
  - fileName 520 "첨부파일" Text
  - actionCell 60 "파일받기" Cell 편집:downloadCell
  - actionCell 60 "파일삭제" Cell 편집:deleteCell

#### 이벤트
[E0] 화면 열림 (생성자 L45-64) → 초기화
[E1] fileDeleteForm.SubmitComplete (L50) → retrieve()
[E2] messageBox.DialogHide [YES] (L118) → checkFileDelete()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieve() | L66-68 | E1,checkFileDelete | 상태 처리 | 업무 |
| public retrieve() | L70-92 | E1,checkFileDelete | 서비스 sys.Sys10_File.selectByParentId(parentId) | 업무 |
| private buildApprFileGrid() | L94-133 | 필드 초기화 | 확인창 표시 | 업무 |
| private checkFileDelete() | L135-160 | E2 | 서비스 sys.Sys11_RelateFile.checkFileDelete(fileId, parentId) | 업무 |

#### Grid Spec
```javascript
const buildApprFileGrid = () => [
  gb.text('fileNm', 520, '첨부파일'),  // L100
  // ⚠ 대응 없음 (GridBuilder L129) addCell
  // ⚠ 대응 없음 (GridBuilder L130) addCell
];
```

#### 사용된 버튼들
버튼 사용하지 않음

