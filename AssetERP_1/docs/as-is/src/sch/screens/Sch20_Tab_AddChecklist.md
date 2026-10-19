# Sch20_Tab_AddChecklist

- 종류: 화면
- 메뉴: 스케줄 > (X)02. 체크리스트 > (X)체크리스트 생성 (#1441, 미사용)
- 파일: `client/vi/sch/Sch20_Tab_AddChecklist.java`
- 함께 쓰는 클래스 14개:
  - `Sch21_Page_AddChecklistContent` `client/vi/sch/Sch21_Page_AddChecklistContent.java`
  - `Sch22_Page_AddWriteGroup` `client/vi/sch/Sch22_Page_AddWriteGroup.java`
  - `Sch21_Edit_ChecklistContent` `client/vi/sch/Sch21_Edit_ChecklistContent.java`
  - `Sch05_Lookup_IcsClass` `client/vi/sch/Sch05_Lookup_IcsClass.java`
  - `Sch20_Edit_Checklist` `client/vi/sch/Sch20_Edit_Checklist.java`
  - `Sch03_Lookup_Short` `client/vi/sch/Sch03_Lookup_Short.java`
  - `Sch03_TabPage_Short99` `client/vi/sch/Sch03_TabPage_Short99.java`
  - `Sch03_Lookup_Cycle` `client/vi/sch/Sch03_Lookup_Cycle.java`
  - `Sch03_TabPage_Cycle06` `client/vi/sch/Sch03_TabPage_Cycle06.java`
  - `Sch03_TabPage_Cycle05` `client/vi/sch/Sch03_TabPage_Cycle05.java`
  - `Sch03_TabPage_Cycle04` `client/vi/sch/Sch03_TabPage_Cycle04.java`
  - `Sch03_TabPage_Cycle03` `client/vi/sch/Sch03_TabPage_Cycle03.java`
  - `Sch03_TabPage_Cycle02` `client/vi/sch/Sch03_TabPage_Cycle02.java`
  - `Sch03_TabPage_Cycle01` `client/vi/sch/Sch03_TabPage_Cycle01.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Ics01_Lookup_Content`](../../ics/components/Ics01_Lookup_Content.md), [`Ics01_Lookup_SelectParent`](../../ics/components/Ics01_Lookup_SelectParent.md), [`Sch05_Page_RelateIcs`](../../sch/components/Sch05_Page_RelateIcs.md), [`Sch22_Lookup_WriteGroup`](../../sch/components/Sch22_Lookup_WriteGroup.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `ics.Ics01_ClassTree.selectByTypeCodePaging` | Sch05_Lookup_IcsClass:107 | [`Ics01_ClassTree.java:96`](../../ics/services/Ics01_ClassTree.md) | [`ics01_class_tree.selectByTypeCodePaging`](../../ics/sql/ics01_class_tree.md), [`ics01_class_tree.selectByTypeCodePagingTotal`](../../ics/sql/ics01_class_tree.md) |
| `sch.Sch02_Share.selectByInfoId2` | Sch21_Edit_ChecklistContent:334 | [`Sch02_Share.java:45`](../../sch/services/Sch02_Share.md) | [`sch02_share.selectByInfoId2`](../../sch/sql/sch02_share.md) |
| `sch.Sch03_Deadline.delete` | Sch20_Edit_Checklist:326 | [`Sch03_Deadline.java:108`](../../sch/services/Sch03_Deadline.md) | `UpdateDataModel(sch03_deadline)` 동적 DELETE |
| `sch.Sch03_Deadline.deleteByInfoId` | Sch20_Edit_Checklist:225 | [`Sch03_Deadline.java:95`](../../sch/services/Sch03_Deadline.md) | [`sch03_deadline.deleteByInfoId`](../../sch/sql/sch03_deadline.md) |
| `sch.Sch03_Deadline.insertModel` | Sch03_Lookup_Cycle:259, Sch03_Lookup_Short:136 | [`Sch03_Deadline.java:76`](../../sch/services/Sch03_Deadline.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sch03_deadline.insert`](../../sch/sql/sch03_deadline.md), `UpdateDataModel(sch03_deadline)` 동적 INSERT/UPDATE → [`sch03_deadline.selectById`](../../sch/sql/sch03_deadline.md) |
| `sch.Sch03_Deadline.selectByInfoId` | Sch20_Edit_Checklist:288 | [`Sch03_Deadline.java:33`](../../sch/services/Sch03_Deadline.md) | [`sch03_deadline.selectByInfoId`](../../sch/sql/sch03_deadline.md) |
| `sch.Sch03_Deadline.updateModel` | Sch20_Edit_Checklist:302 | [`Sch03_Deadline.java:50`](../../sch/services/Sch03_Deadline.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sch03_deadline.insert`](../../sch/sql/sch03_deadline.md), [`sch03_deadline.selectById`](../../sch/sql/sch03_deadline.md) |
| `sch.Sch05_RelateIcs.delete` | Sch21_Edit_ChecklistContent:364 | [`Sch05_RelateIcs.java:68`](../../sch/services/Sch05_RelateIcs.md) | `UpdateDataModel(sch05_relate_ics)` 동적 DELETE |
| `sch.Sch05_RelateIcs.deleteCheckListCont` | Sch21_Page_AddChecklistContent:279 | [`Sch05_RelateIcs.java:53`](../../sch/services/Sch05_RelateIcs.md) | [`sch05_relate_ics.deleteCheckListCont`](../../sch/sql/sch05_relate_ics.md) |
| `sch.Sch05_RelateIcs.selectByIcsClassTreeId` | Sch05_Lookup_IcsClass:252 | [`Sch05_RelateIcs.java:34`](../../sch/services/Sch05_RelateIcs.md) | [`ics01_class_tree.selectByRelateIcsId`](../../ics/sql/ics01_class_tree.md) |
| `sch.Sch05_RelateIcs.selectByInfoId` | Sch21_Edit_ChecklistContent:323 | [`Sch05_RelateIcs.java:26`](../../sch/services/Sch05_RelateIcs.md) | [`sch05_relate_ics.selectByInfoId`](../../sch/sql/sch05_relate_ics.md) |
| `sch.Sch05_RelateIcs.update` | Sch21_Edit_ChecklistContent:361 | [`Sch05_RelateIcs.java:63`](../../sch/services/Sch05_RelateIcs.md) | `UpdateDataModel(sch05_relate_ics)` 동적 INSERT/UPDATE → [`sch05_relate_ics.selectById`](../../sch/sql/sch05_relate_ics.md) |
| `sch.Sch20_Checklist.delete` | Sch20_Tab_AddChecklist:210 | [`Sch20_Checklist.java:49`](../../sch/services/Sch20_Checklist.md) | `UpdateDataModel(sch20_checklist)` 동적 DELETE |
| `sch.Sch20_Checklist.selectByCheckId` | Sch21_Edit_ChecklistContent:247 | [`Sch20_Checklist.java:35`](../../sch/services/Sch20_Checklist.md) | [`sch20_checklist.selectByCheckId`](../../sch/sql/sch20_checklist.md) |
| `sch.Sch20_Checklist.selectById` | Sch20_Edit_Checklist:214 | [`Sch20_Checklist.java:20`](../../sch/services/Sch20_Checklist.md) | [`sch20_checklist.selectById`](../../sch/sql/sch20_checklist.md) |
| `sch.Sch20_Checklist.selectBySearchText` | Sch20_Tab_AddChecklist:168 | [`Sch20_Checklist.java:25`](../../sch/services/Sch20_Checklist.md) | [`sch20_checklist.selectBySearchText`](../../sch/sql/sch20_checklist.md) |
| `sch.Sch20_Checklist.update` | Sch20_Edit_Checklist:366 | [`Sch20_Checklist.java:41`](../../sch/services/Sch20_Checklist.md) | `UpdateDataModel(sch20_checklist)` 동적 INSERT/UPDATE → [`sch20_checklist.selectById`](../../sch/sql/sch20_checklist.md) |
| `sch.Sch21_ChecklistContent.delete` | Sch21_Page_AddChecklistContent:289 | [`Sch21_ChecklistContent.java:52`](../../sch/services/Sch21_ChecklistContent.md) | `UpdateDataModel(sch21_checklist_content)` 동적 DELETE |
| `sch.Sch21_ChecklistContent.selectBySearchText` | Sch21_Page_AddChecklistContent:211 | [`Sch21_ChecklistContent.java:26`](../../sch/services/Sch21_ChecklistContent.md) | [`sch21_checklist_content.selectBySearchText`](../../sch/sql/sch21_checklist_content.md) |
| `sch.Sch21_ChecklistContent.update` | Sch21_Edit_ChecklistContent:379 | [`Sch21_ChecklistContent.java:44`](../../sch/services/Sch21_ChecklistContent.md) | `UpdateDataModel(sch21_checklist_content)` 동적 INSERT/UPDATE → [`sch21_checklist_content.selectById`](../../sch/sql/sch21_checklist_content.md) |
| `sch.Sch22_WriteGroup.selectByChecklistContentId` | Sch22_Page_AddWriteGroup:43 | [`Sch22_WriteGroup.java:39`](../../sch/services/Sch22_WriteGroup.md) | [`sch22_write_group.selectByChecklistContentId`](../../sch/sql/sch22_write_group.md) |
| `sch.Sch22_WriteGroup.selectById` | Sch21_Edit_ChecklistContent:265 | [`Sch22_WriteGroup.java:18`](../../sch/services/Sch22_WriteGroup.md) | [`sch22_write_group.selectById`](../../sch/sql/sch22_write_group.md) |
| `sys.Sys00_Common.selectByKindGroupCode` | Sch03_TabPage_Cycle04:62, Sch03_TabPage_Cycle05:62 | [`Sys00_Common.java:106`](../../sys/services/Sys00_Common.md) | [`sys09_code.selectByKindGroupCode`](../../sys/sql/sys09_code.md) |
| `sys.Sys00_Common.selectDeadLine` | Sch20_Edit_Checklist:78 | [`Sys00_Common.java:21`](../../sys/services/Sys00_Common.md) | [`sys00_common.selectDeadLine`](../../sys/sql/sys00_common.md) |

## 테이블

[`emp01_person`](../../../db/tables/emp.md), [`ics01_class_tree`](../../../db/tables/ics.md), [`ics02_manager`](../../../db/tables/ics.md), [`ics03_company_info`](../../../db/tables/ics.md), [`ics05_relate_manager`](../../../db/tables/ics.md), [`ics19_revision_relate_ics`](../../../db/tables/ics.md), [`org01_code`](../../../db/tables/org.md), [`sch02_share`](../../../db/tables/sch.md), [`sch03_deadline`](../../../db/tables/sch.md), [`sch05_relate_ics`](../../../db/tables/sch.md), [`sch20_checklist`](../../../db/tables/sch.md), [`sch21_checklist_content`](../../../db/tables/sch.md), [`sch22_write_group`](../../../db/tables/sch.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md), [`tdm45_manl_relate_ics`](../../../db/tables/tdm.md)

## DB 함수

`f_cdnm`, `f_emp_kor_nm`, `f_get_deadline_nm`, `f_get_ics_nm`, `f_ics_class_tree_nm_allpath`, `f_org_nm`, `f_sysdate`, `f_today`, `f_trunc`, `getorg`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sch20_Tab_AddChecklist (`client/vi/sch/Sch20_Tab_AddChecklist.java`, 243줄)

- 레이아웃: north=vlc, center=checklistContentPage
- 툴바 `buttonBar`: 검색: {searchText} {checkBox} {retrieveButton} {insertButton} {deleteButton}
- 입력·하위 화면: `searchText` TextField, `checkBox` CheckBox, `checklistContentPage` Sch21_Page_AddChecklistContent, `lookup` Sch20_Edit_Checklist, `popup` Sch20_Edit_Checklist
- 그리드 `grid` (buildGrid(), 체크박스):
  - checklistName 700 "체크리스트" Text
  - cycleName 200 "체크기한" Text
  - priorityName 100 "우선순위" Text
  - useYn 60 "사용" Boolean
  - actionCell 60 "수정" Cell 편집:actionCell

#### 이벤트
[E0] 화면 열림 (생성자 L56-93) → settings(), retrieve()
[E1] grid.SelectionChanged (L85) → retrieveContent()
[E2] searchText.KeyPress [Enter] (L100) → retrieve()
[E3] retrieveButton[조회].Select (L108) → retrieve()
[E4] insertButton[등록].Select (L114) → insertRow()
[E5] deleteButton[삭제].Select (L120) → deleteCheck()
       └ [E6] msgBox.DialogHide [YES] (L190) → delete()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieveContent() | L155-161 | E1 | 상태 처리 | 업무 |
| private retrieve() | L163-176 | 생성자,E2,E3,buildGrid,insertRow | 서비스 sch.Sch20_Checklist.selectBySearchText(companyId, searchText, useYn) | 업무 |
| private deleteCheck() | L178-205 | E5 | ConfirmBox → E6 | 업무 |
| private delete() | L207-212 | E6 | GridDeleteData sch.Sch20_Checklist.delete(체크된 행 목록) | 업무 |
| private insertRow() | L214-234 | E4 | 팝업 Sch20_Edit_Checklist 열기 | 업무 |
| private settings() | L95-126 | 생성자 | 이벤트 연결, 초기값: checkBox=true("사용만 조회") | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L128-153 | 필드 초기화 | 팝업 Sch20_Edit_Checklist 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L236-238 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L240-242 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('checklistNm', 700, '체크리스트'),  // L146
  gb.text('cycleNm', 200, '체크기한'),  // L147
  gb.text('priorityNm', 100, '우선순위'),  // L148
  gb.boolean('useYn', 60, '사용'),  // L149
  // ⚠ 대응 없음 (GridBuilder L150) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="delete" onClick={deleteCheck}>삭제</Button>

### Sch21_Page_AddChecklistContent (`client/vi/sch/Sch21_Page_AddChecklistContent.java`, 310줄)

- 레이아웃: north=buttonBar, center=hlc
- 툴바 `buttonBar`: 검색: {searchText} {checkBox} {retrieveButton} {insertButton} {deleteButton} {manageButton} {batchMangerButton}
- 입력·하위 화면: `searchText` TextField 빈칸="체크내용/근거", `checkBox` CheckBox, `writeGroupPage` Sch22_Page_AddWriteGroup, `relateIcsPage` Sch05_Page_RelateIcs, `lookup` Sch22_Lookup_WriteGroup
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - content 700 "체크내용" TextArea
  - criterion 200 "근거" Text
  - useYn 60 "사용" Boolean
  - actionCell 60 "수정" Cell 편집:actionCell

#### 이벤트
[E0] 화면 열림 (생성자 L68-118) → settings()
[E1] grid.SelectionChanged (L110) → retrievePage()
[E2] searchText.KeyPress [Enter] (L126) → retrieve()
[E3] retrieveButton[조회].Select (L134) → retrieve()
[E4] insertButton[등록].Select [checklistId == null] (L140) → insertRow()
[E5] deleteButton[삭제].Select (L151) → deleteChk()
       └ [E8] msgBox.DialogHide [YES] (L259) → deleteRow()
[E6] manageButton[작성자그룹 관리].Select (L157) → 인라인 L157-163 (new SelectHandler() { @Override publi…)
[E7] batchMangerButton[작성자그룹 일괄지정].Select (L164) → 인라인 L164-169 (new SelectHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieve() | L197-199 | E2,E3,buildGrid,insertRow,deleteRow | 상태 처리 | 업무 |
| public retrieve() | L201-224 | E2,E3,buildGrid,insertRow,deleteRow | 서비스 sch.Sch21_ChecklistContent.selectBySearchText(checklistId, searchText, useYn) | 업무 |
| private retrievePage() | L226-233 | E1,retrieve | 상태 처리 | 업무 |
| private insertRow() | L235-254 | E4 | 팝업 Sch21_Edit_ChecklistContent 열기 | 업무 |
| private deleteChk() | L256-274 | E5 | ConfirmBox → E8 | 업무 |
| private deleteRow() | L276-301 | E8 | GridDeleteData sch.Sch05_RelateIcs.deleteCheckListCont, sch.Sch21_ChecklistContent.delete(체크된 행 목록) | 업무 |
| private settings() | L120-170 | 생성자 | 조회창 Sch22_Lookup_WriteGroup 열기, 이벤트 연결, 초기값: checkBox=true("사용만 조회") | UI구성 (이벤트 절로 대체) |
| package buildGrid() | L172-195 | 필드 초기화 | 팝업 Sch21_Edit_ChecklistContent 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L303-305 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L307-309 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textArea('content', 700, '체크내용'),  // L189
  gb.text('criterion', 200, '근거'),  // L190
  gb.boolean('useYn', 60, '사용'),  // L191
  // ⚠ 대응 없음 (GridBuilder L192) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="delete" onClick={deleteChk}>삭제</Button>
4. <Button type="group" onClick={() => /* 인라인 L157-163 (new SelectHandler() { @Override publi…) */}>작성자그룹 관리</Button>
5. <Button type="assign" onClick={() => /* 인라인 L164-169 (new SelectHandler() { @Override publi…) */}>작성자그룹 일괄지정</Button>

### Sch22_Page_AddWriteGroup (`client/vi/sch/Sch22_Page_AddWriteGroup.java`, 46줄)

- 그리드 `grid` (buildGrid(), 행번호숨김):
  - shareName 70 "구분" TextCenter
  - orgName 250 "작성부서" Text
  - personName 100 "작성자" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L21-23) → 초기화

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L35-45 | 공개 메서드 | 서비스 sch.Sch22_WriteGroup.selectByChecklistContentId(checklistContentId) | 업무 |
| private buildGrid() | L25-33 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('shareNm', 70, '구분'),  // L28 SQL 계산 컬럼(selectByChecklistContentId: f_cdnm('ShareCode', sch02_share_cd, sch…)
  gb.text('orgNm', 250, '작성부서'),  // L29 SQL 계산 컬럼(selectByChecklistContentId: org00_kor_nm)
  gb.textCenter('personNm', 100, '작성자'),  // L30 SQL 계산 컬럼(selectByChecklistContentId: a.emp01_kor_nm)
];
```

#### 사용된 버튼들
버튼 사용하지 않음

### Sch21_Edit_ChecklistContent (`client/vi/sch/Sch21_Edit_ChecklistContent.java`, 400줄)

- 툴바 `buttonBar05`: {hlc}
- 입력·하위 화면: `useYn` CheckBox, `title` TextField, `seq` LongField, `criterion` TextField, `writeGroup` LookupTriggerField, `content` TextArea 빈칸="내용을 입력해주세요", `lookup` Sch22_Lookup_WriteGroup
- 그리드 `relateIcsGrid` (relateIcsGrid()):
  - icsClassTreeFullName 500 "법규명" Text
  - deadlineName 170 "기한" Text
- 그리드 `shareGrid` (ShareGrid()):
  - shareName 70 "구분" TextCenter
  - orgName 250 "작성부서" Text
  - personName 100 "작성자" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L177-198) → settings(), getEditor(), show()
[E1] writeGroup.TriggerClick (L119) → openLookupWriteGroup()
[E2] insertButton[행 추가].Select (L125) → insertRow05()
[E3] deleteButton[행 삭제].Select (L131) → deleteRow05()
[E4] updateButton[저장].Select (L138) → update()
[E5] closeButton[닫기].Select (L144) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public insert() | L87-95 | 공개 메서드 | 상태 처리 | 업무 |
| public edit() | L97-116 | 공개 메서드 | 상태 처리 | 업무 |
| private relateIcsGrid() | L160-166 | 필드 초기화 | 상태 처리 | 업무 |
| private ShareGrid() | L168-175 | 필드 초기화 | 상태 처리 | 업무 |
| private getEditor() | L200-244 | 생성자 | 상태 처리 | 업무 |
| private servicePublic() | L246-262 | insert,edit | 서비스 sch.Sch20_Checklist.selectByCheckId(checkId) | 업무 |
| private serviceEdit() | L264-278 | edit | 서비스 sch.Sch22_WriteGroup.selectById(writeGroupId) | 업무 |
| private insertRow05() | L280-283 | E2 | 상태 처리 | 업무 |
| private deleteRow05() | L285-291 | E3 | 상태 처리 | 업무 |
| private openLookupIcs() | L293-317 | insertRow05 | 조회창 Sch05_Lookup_IcsClass 열기 | 업무 |
| private retrieve05() | L318-329 | edit | 서비스 sch.Sch05_RelateIcs.selectByInfoId(infoId) | 업무 |
| private retrievePage() | L331-340 | edit,openLookupWriteGroup | 서비스 sch.Sch02_Share.selectByInfoId2(infoId) | 업무 |
| private openLookupWriteGroup() | L342-357 | E1 | 조회창 Sch22_Lookup_WriteGroup 열기 | 업무 |
| private updateRelateIcs() | L359-370 | update | GridDeleteData sch.Sch05_RelateIcs.update, sch.Sch05_RelateIcs.delete | 업무 |
| private update() | L372-391 | E4 | 서비스 sch.Sch21_ChecklistContent.update | 업무 |
| private settings() | L118-158 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L393-395 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L397-399 | insert,edit | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const relateIcsGrid = () => [
  gb.text('icsClassTreeFullNm', 500, '법규명'),  // L162 SQL 계산 컬럼(selectById: f_ics_class_tree_nm_allpath(ics01_class…)
  gb.text('deadlineNm', 170, '기한'),  // L163 SQL 계산 컬럼(selectById: f_get_deadline_nm(sch05_deadline_id, '2…)
];

const ShareGrid = () => [
  gb.textCenter('shareNm', 70, '구분'),  // L170 SQL 계산 컬럼(selectById: f_cdnm('ShareCode', sch02_share_cd, sch…)
  gb.text('orgNm', 250, '작성부서'),  // L171 SQL 계산 컬럼(selectById: f_org_nm(sch02_org_id, f_sysdate()))
  gb.textCenter('personNm', 100, '작성자'),  // L172 SQL 계산 컬럼(selectById: f_emp_kor_nm(sch02_person_id))
];
```

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>
3. <Button type="addRow" onClick={insertRow05}>행 추가</Button>
4. <Button type="removeRow" onClick={deleteRow05}>행 삭제</Button>

### Sch05_Lookup_IcsClass (`client/vi/sch/Sch05_Lookup_IcsClass.java`, 292줄)

- 툴바 `buttonBar`: 분류: {classTreeName} 법규검색: {lawSearch} 조문검색: {statuteSearch} {retrieveButton} {detailSearchCheckBox}
- 입력·하위 화면: `classTreeName` LookupTriggerField, `classTreeId` LongField, `lawSearch` TextField 빈칸="법규코드/법규명", `statuteSearch` TextField 빈칸="관련조문", `detailSearchCheckBox` CheckBox, `lookup` Ics01_Lookup_Content
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - classTreeCode 70 "법규코드" TextCenter
  - classTreeName 300 "법규명" TextArea
  - content 400 "상세내용" TextLimitArea
  - actionCell 35 " " Cell 편집:actionCell
  - submitTo 200 "제출처" TextArea
  - cycleName 100 "주기" Text
  - relatedLaw 200 "관련조문" TextArea
  - classTreeFullName 250 "분류" TextArea

#### 이벤트
[E0] 화면 열림 (생성자 L72-123) → settings(), show(), retrieve()
[E1] classTreeName[전체].TriggerClick [result == null] (L131) → 인라인 L131-149 (new TriggerClickHandler(){ @Override …)
[E2] lawSearch.KeyPress [Enter] (L152) → retrieve()
[E3] statuteSearch.KeyPress [Enter] (L162) → retrieve()
[E4] retrieveButton[검색].Select (L172) → retrieve()
[E5] changeButton[확인].Select (L178) → update()
[E6] cancleButton[닫기].Select (L184) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieve() | L222-245 | 생성자,E2,E3,E4 | 상태 처리 | 업무 |
| private update() | L247-279 | E5 | 서비스 sch.Sch05_RelateIcs.selectByIcsClassTreeId | 업무 |
| private settings() | L125-190 | 생성자 | 조회창 Ics01_Lookup_SelectParent 열기, 이벤트 연결, 초기값: classTreeId=null, classTreeId=null, classTreeId=resultModel.getClassTreeId(, detailSearchCheckBox=false("상세내용 포함") | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L192-220 | 필드 초기화 | 조회창 Ics01_Lookup_Content 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L281-283 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L285-287 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L289-291 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('classTreeCd', 70, '법규코드'),  // L211
  gb.textArea('classTreeNm', 300, '법규명'),  // L212
  // ⚠ 대응 없음 (GridBuilder L213) addTextLimitArea
  // ⚠ 대응 없음 (GridBuilder L214) addCell
  gb.textArea('submitTo', 200, '제출처'),  // L215
  gb.text('cycleNm', 100, '주기'),  // L216
  gb.textArea('relatedLaw', 200, '관련조문'),  // L217
  gb.textArea('classTreeFullNm', 250, '분류'),  // L218
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>검색</Button>
2. <Button type="save" onClick={update}>확인</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

### Sch20_Edit_Checklist (`client/vi/sch/Sch20_Edit_Checklist.java`, 386줄)

- 툴바 `buttonBar03`: {hlc03}
- 입력·하위 화면: `useYn` CheckBox, `title` TextField 빈칸="내용을 입력해주세요", `priorityCode` TextField, `priorityName` ComboBoxField("PriorityCode"), `deadlineComboBox` CommonComboBoxField("sys.Sys00_Common.selectDeadLine") 빈칸="선택하세요", `lookupShort` Sch03_Lookup_Short("1"), `lookupCycle` Sch03_Lookup_Cycle("1")
- 그리드 `deadlineGrid` (deadlinedGrid()):
  - cycleName 120 "주기구분" TextCenter
  - deadlineFullName 300 "처리일 정보" Text
  - startDate 100 "시작일" Date
  - closeDate 100 "종료일" Date
  - actionCell 50 "수정" Cell 편집:editCell

#### 이벤트
[E0] 화면 열림 (생성자 L172-248) → getEditor(), show()
[E1] anchor03.MouseDown (L116) → retrieve03()
[E2] loadButton[선택].Select (L181) → load()
[E3] deleteButton[삭제].Select (L187) → deleteRow()
       └ [E8] messageBox.DialogHide [YES] (L320) → 서비스 sch.Sch03_Deadline.delete
[E4] shortButton[일회성조건].Select (L193) → shortInsert()
[E5] cycleButton[반복주기조건].Select (L199) → cycleInsert()
[E6] updateButton[저장].Select (L205) → update()
[E7] closeButton[닫기].Select [선택>0] (L211) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public insert() | L85-94 | 공개 메서드 | 상태 처리 | 업무 |
| public edit() | L96-110 | 공개 메서드 | 상태 처리 | 업무 |
| private ButtonSetting() | L112-135 | insert,edit | 상태 처리 | 업무 |
| private deadlinedGrid() | L137-170 | 필드 초기화 | 조회창 Sch03_Lookup_Short 열기, 조회창 Sch03_Lookup_Cycle 열기 | 업무 |
| private getEditor() | L250-282 | 생성자 | 상태 처리 | 업무 |
| private retrieve03() | L284-294 | E1,edit,deadlinedGrid,load,shortInsert,cycleInsert | 서비스 sch.Sch03_Deadline.selectByInfoId(companyId, infoId) | 업무 |
| public load() | L296-315 | E2 | 서비스 sch.Sch03_Deadline.updateModel(deadlineId, classTreeId, companyId, scheduleCode) | 업무 |
| public deleteRow() | L317-332 | E3 | ConfirmBox → E8 | 업무 |
| public shortInsert() | L334-341 | E4 | 조회창 Sch03_Lookup_Short 열기 | 업무 |
| public cycleInsert() | L343-350 | E5 | 조회창 Sch03_Lookup_Cycle 열기 | 업무 |
| private update() | L352-377 | E6 | 서비스 sch.Sch20_Checklist.update | 업무 |
| private setHtmlStyle() | L379-381 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L383-385 | insert,edit | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const deadlinedGrid = () => [
  gb.textCenter('cycleNm', 120, '주기구분'),  // L163 SQL 계산 컬럼(selectById: f_cdnm('CycleCode', sch03_cycle_cd, sch…)
  gb.text('deadlineFullNm', 300, '처리일 정보'),  // L164 SQL 계산 컬럼(selectById: f_get_deadline_nm(sch03_deadline_id, '2…)
  gb.date('startDate', 100, '시작일'),  // L165
  gb.date('closeDate', 100, '종료일'),  // L166
  // ⚠ 대응 없음 (GridBuilder L167) addCell
];
```

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>
3. <Button type="select" onClick={load}>선택</Button>
4. <Button type="addRow" onClick={shortInsert}>일회성조건</Button>
5. <Button type="addRow" onClick={cycleInsert}>반복주기조건</Button>
6. <Button type="delete" onClick={deleteRow}>삭제</Button>

### Sch03_Lookup_Short (`client/vi/sch/Sch03_Lookup_Short.java`, 152줄)

- 입력·하위 화면: `tabCycle99` Sch03_TabPage_Short99

#### 이벤트
[E0] 화면 열림 (생성자 L42-67) → Settings(), show(), SetModel()
[E1] updateButton[저장].Select (L102) → update()
[E2] closeButton[닫기].Select (L108) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private SetModel() | L69-71 | 생성자 | 상태 처리 | 업무 |
| private Settings() | L99-114 | 생성자 | 상태 처리 | 업무 |
| public update() | L116-130 | E1 | 상태 처리 | 업무 |
| private insertModel() | L132-147 | update | 서비스 sch.Sch03_Deadline.insertModel | 업무 |
| private setHtmlHeaderStyle() | L149-151 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Sch03_TabPage_Short99 (`client/vi/sch/Sch03_TabPage_Short99.java`, 242줄)

- 툴바 `buttonBar01`: {radioType01} 즉시:
- 툴바 `buttonBar02`: {radioType02} {fixDate}
- 툴바 `buttonBar03`: {radioType03} {num1} {periodName} {holidayName01}
- 입력·하위 화면: `radioType01` Radio, `radioType02` Radio, `radioType03` Radio, `fixDate` MyDateField, `num1` LongField, `periodCode` TextField, `periodName` ComboBoxField("PeriodCode") 빈칸="선택", `holidayCode01` TextField, `holidayName01` ComboBoxField("HolidaySettleCode") 빈칸="선택"

#### 이벤트
[E0] 화면 열림 (생성자 L57-72) → Settings(), getEditor(), activeCode01(), activeCode10()
[E1] toggleGroup.ValueChange (L91) → activeCode10(), activeCode01(), activeCode02()
[E2] periodName[PeriodCode].Collapse (L122) → 인라인 L122-127 (new CollapseHandler() { @Override pub…)
[E3] holidayName01[HolidaySettleCode].Collapse (L128) → 인라인 L128-133 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private Settings() | L74-105 | 생성자 | 상태 처리 | 업무 |
| private getEditor() | L107-165 | 생성자 | 상태 처리 | 업무 |
| public getModel() | L167-186 | 공개 메서드 | 상태 처리 | 업무 |
| public setModel() | L188-201 | 공개 메서드 | 상태 처리 | 업무 |
| private activeCode10() | L203-213 | 생성자,E1,setModel | 상태 처리 | 업무 |
| private activeCode01() | L215-225 | 생성자,E1,setModel | 상태 처리 | 업무 |
| private activeCode02() | L227-237 | E1,setModel | 상태 처리 | 업무 |
| private setHtmlCheckBoxStyle() | L239-241 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
버튼 사용하지 않음

### Sch03_Lookup_Cycle (`client/vi/sch/Sch03_Lookup_Cycle.java`, 283줄)

- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `tabCycle01` Sch03_TabPage_Cycle01, `tabCycle02` Sch03_TabPage_Cycle02, `tabCycle03` Sch03_TabPage_Cycle03, `tabCycle04` Sch03_TabPage_Cycle04, `tabCycle05` Sch03_TabPage_Cycle05, `tabCycle06` Sch03_TabPage_Cycle06

#### 이벤트
[E0] 화면 열림 (생성자 L61-114) → settings(), getDate(), show(), SetModel()
[E1] updateButton[저장].Select (L212) → update()
[E2] closeButton[닫기].Select (L218) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private SetModel() | L170-195 | 생성자 | 상태 처리 | 업무 |
| private getDate() | L197-209 | 생성자 | 상태 처리 | 업무 |
| public update() | L226-253 | E1 | 상태 처리 | 업무 |
| private insertModel() | L255-270 | update | 서비스 sch.Sch03_Deadline.insertModel | 업무 |
| private settings() | L211-224 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlCheckBoxStyle() | L272-274 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L276-278 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L280-282 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Sch03_TabPage_Cycle06 (`client/vi/sch/Sch03_TabPage_Cycle06.java`, 467줄)

- 툴바 `buttonBar01`: {radioType01} 년의 말일: {holidayName}
- 툴바 `buttonBar02`: {radioType02} {monthName01} {num101} {monthTypeName01} {dayName01} {num201} {dayTypeName01} {holidayName01}
- 툴바 `buttonBar03`: {radioType03} {monthName02} {num102} {monthTypeName02} {weekName02} {dayWeekName02} {holidayName02}
- 입력·하위 화면: `radioType01` Radio, `radioType02` Radio, `radioType03` Radio, `num101` LongField, `num201` LongField, `num102` LongField, `holidayCode` TextField, `holidayName` ComboBoxField("HolidaySettleCode") 빈칸="선택", `monthCode01` TextField, `monthName01` ComboBoxField("MonthCode") 빈칸="선택", `monthTypeCode01` TextField, `monthTypeName01` ComboBoxField("MonthTypeCode") 빈칸="선택", `dayCode01` TextField, `dayName01` ComboBoxField("DayCode") 빈칸="선택", `dayTypeCode01` TextField, `dayTypeName01` ComboBoxField("DsCode") 빈칸="선택", `holidayCode01` TextField, `holidayName01` ComboBoxField("HolidaySettleCode") 빈칸="선택", `monthCode02` TextField, `monthName02` ComboBoxField("MonthCode") 빈칸="선택", `monthTypeCode02` TextField, `monthTypeName02` ComboBoxField("MonthTypeCode") 빈칸="선택", `weekCode02` TextField, `weekName02` ComboBoxField("WeekOfMonth") 빈칸="선택", `dayWeekCode02` TextField, `dayWeekName02` ComboBoxField("DayOfWeekCode") 빈칸="선택", `holidayCode02` TextField, `holidayName02` ComboBoxField("HolidaySettleCode") 빈칸="선택"

#### 이벤트
[E0] 화면 열림 (생성자 L74-82) → Settings(), getEditor(), activeCode09()
[E1] dayName01[DayCode].Collapse (L135) → 인라인 L135-153 (new CollapseHandler() { @Override pub…)
[E2] monthName01[MonthCode].Collapse (L166) → 인라인 L166-184 (new CollapseHandler() { @Override pub…)
[E3] monthName02[MonthCode].Collapse (L196) → 인라인 L196-214 (new CollapseHandler() { @Override pub…)
[E4] toggleGroup.ValueChange (L215) → activeCode11(), activeCode12(), activeCode09()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private Settings() | L84-229 | 생성자 | 상태 처리 | 업무 |
| private getEditor() | L231-344 | 생성자 | 상태 처리 | 업무 |
| public getModel() | L346-376 | 공개 메서드 | 상태 처리 | 업무 |
| public setModel() | L378-426 | 공개 메서드 | 상태 처리 | 업무 |
| private activeCode09() | L428-438 | 생성자,E4,setModel | 상태 처리 | 업무 |
| private activeCode11() | L440-450 | E4,setModel | 상태 처리 | 업무 |
| private activeCode12() | L452-462 | E4,setModel | 상태 처리 | 업무 |
| private setHtmlCheckBoxStyle() | L464-466 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
버튼 사용하지 않음

### Sch03_TabPage_Cycle05 (`client/vi/sch/Sch03_TabPage_Cycle05.java`, 493줄)

- 툴바 `buttonBar01`: {radioType01} 반기의 말일: {holidayName}
- 툴바 `buttonBar02`: {radioType02} {monthName01} {num101} {monthTypeName01} {dayName01} {num201} {dayTypeName01} {holidayName01}
- 툴바 `buttonBar03`: {radioType03} {monthName02} {num102} {monthTypeName02} {weekName02} {dayWeekName02} {holidayName02}
- 입력·하위 화면: `radioType01` Radio, `radioType02` Radio, `radioType03` Radio, `num101` LongField, `num201` LongField, `num102` LongField, `holidayCode` TextField, `holidayName` ComboBoxField("HolidaySettleCode") 빈칸="선택", `monthCode01` TextField, `monthName01` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode") 빈칸="선택", `monthTypeCode01` TextField, `monthTypeName01` ComboBoxField("MonthTypeCode") 빈칸="선택", `dayCode01` TextField, `dayName01` ComboBoxField("DayCode") 빈칸="선택", `dayTypeCode01` TextField, `dayTypeName01` ComboBoxField("DsCode") 빈칸="선택", `holidayCode01` TextField, `holidayName01` ComboBoxField("HolidaySettleCode") 빈칸="선택", `monthCode02` TextField, `monthName02` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode") 빈칸="선택", `monthTypeCode02` TextField, `monthTypeName02` ComboBoxField("MonthTypeCode") 빈칸="선택", `weekCode02` TextField, `weekName02` ComboBoxField("WeekOfMonth") 빈칸="선택", `dayWeekCode02` TextField, `dayWeekName02` ComboBoxField("DayOfWeekCode") 빈칸="선택", `holidayCode02` TextField, `holidayName02` ComboBoxField("HolidaySettleCode") 빈칸="선택"

#### 이벤트
[E0] 화면 열림 (생성자 L86-94) → Settings(), getEditor(), activeCode08()
[E1] dayName01[DayCode].Collapse (L160) → 인라인 L160-178 (new CollapseHandler() { @Override pub…)
[E2] monthName01[sys.Sys00_Common.selectByKindGroupCode].Collapse (L192) → 인라인 L192-210 (new CollapseHandler() { @Override pub…)
[E3] monthName02[sys.Sys00_Common.selectByKindGroupCode].Collapse (L223) → 인라인 L223-241 (new CollapseHandler() { @Override pub…)
[E4] toggleGroup.ValueChange (L243) → activeCode08(), activeCode11(), activeCode12()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private Settings() | L96-257 | 생성자 | 상태 처리 | 업무 |
| private getEditor() | L259-372 | 생성자 | 상태 처리 | 업무 |
| public getModel() | L374-404 | 공개 메서드 | 상태 처리 | 업무 |
| public setModel() | L406-452 | 공개 메서드 | 상태 처리 | 업무 |
| private activeCode08() | L454-464 | 생성자,E4,setModel | 상태 처리 | 업무 |
| private activeCode11() | L466-476 | E4,setModel | 상태 처리 | 업무 |
| private activeCode12() | L478-488 | E4,setModel | 상태 처리 | 업무 |
| private setHtmlCheckBoxStyle() | L490-492 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
버튼 사용하지 않음

### Sch03_TabPage_Cycle04 (`client/vi/sch/Sch03_TabPage_Cycle04.java`, 490줄)

- 툴바 `buttonBar01`: {radioType01} 분기의 말일: {holidayName}
- 툴바 `buttonBar02`: {radioType02} {monthName01} {num101} {monthTypeName01} {dayName01} {num201} {dayTypeName01} {holidayName01}
- 툴바 `buttonBar03`: {radioType03} {monthName02} {num102} {monthTypeName02} {weekName02} {dayWeekName02} {holidayName02}
- 입력·하위 화면: `radioType01` Radio, `radioType02` Radio, `radioType03` Radio, `num101` LongField, `num201` LongField, `num102` LongField, `holidayCode` TextField, `holidayName` ComboBoxField("HolidaySettleCode") 빈칸="선택", `monthCode01` TextField, `monthName01` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode") 빈칸="선택", `monthTypeCode01` TextField, `monthTypeName01` ComboBoxField("MonthTypeCode") 빈칸="선택", `dayCode01` TextField, `dayName01` ComboBoxField("DayCode") 빈칸="선택", `dayTypeCode01` TextField, `dayTypeName01` ComboBoxField("DsCode") 빈칸="선택", `holidayCode01` TextField, `holidayName01` ComboBoxField("HolidaySettleCode") 빈칸="선택", `monthCode02` TextField, `monthName02` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode") 빈칸="선택", `monthTypeCode02` TextField, `monthTypeName02` ComboBoxField("MonthTypeCode") 빈칸="선택", `weekCode02` TextField, `weekName02` ComboBoxField("WeekOfMonth") 빈칸="선택", `dayWeekCode02` TextField, `dayWeekName02` ComboBoxField("DayOfWeekCode") 빈칸="선택", `holidayCode02` TextField, `holidayName02` ComboBoxField("HolidaySettleCode") 빈칸="선택"

#### 이벤트
[E0] 화면 열림 (생성자 L84-92) → Settings(), getEditor(), activeCode07()
[E1] dayName01[DayCode].Collapse (L154) → 인라인 L154-171 (new CollapseHandler() { @Override pub…)
[E2] monthName01[sys.Sys00_Common.selectByKindGroupCode].Collapse (L185) → 인라인 L185-203 (new CollapseHandler() { @Override pub…)
[E3] monthName02[sys.Sys00_Common.selectByKindGroupCode].Collapse (L217) → 인라인 L217-235 (new CollapseHandler() { @Override pub…)
[E4] toggleGroup.ValueChange (L237) → activeCode07(), activeCode11(), activeCode12()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private Settings() | L94-252 | 생성자 | 상태 처리 | 업무 |
| private getEditor() | L254-367 | 생성자 | 상태 처리 | 업무 |
| public getModel() | L369-400 | 공개 메서드 | 상태 처리 | 업무 |
| public setModel() | L402-449 | 공개 메서드 | 상태 처리 | 업무 |
| private activeCode07() | L451-461 | 생성자,E4,setModel | 상태 처리 | 업무 |
| private activeCode11() | L463-473 | E4,setModel | 상태 처리 | 업무 |
| private activeCode12() | L475-485 | E4,setModel | 상태 처리 | 업무 |
| private setHtmlCheckBoxStyle() | L487-489 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
버튼 사용하지 않음

### Sch03_TabPage_Cycle03 (`client/vi/sch/Sch03_TabPage_Cycle03.java`, 255줄)

- 툴바 `buttonBar01`: {radioType01} {dayName01} {num1} {dayTypeName01} {holidayName01}
- 툴바 `buttonBar02`: {radioType02} {weekName02} {dayWeekName02} {holidayName02}
- 입력·하위 화면: `radioType01` Radio, `radioType02` Radio, `num1` LongField, `dayCode01` TextField, `dayName01` ComboBoxField("DayCode") 빈칸="선택", `dayTypeCode01` TextField, `dayTypeName01` ComboBoxField("DsCode") 빈칸="선택", `holidayCode01` TextField, `holidayName01` ComboBoxField("HolidaySettleCode") 빈칸="선택", `weekCode02` TextField, `weekName02` ComboBoxField("WeekOfMonth") 빈칸="선택", `dayWeekCode02` TextField, `dayWeekName02` ComboBoxField("DayOfWeekCode") 빈칸="선택", `holidayCode02` TextField, `holidayName02` ComboBoxField("HolidaySettleCode") 빈칸="선택"

#### 이벤트
[E0] 화면 열림 (생성자 L56-64) → Settings(), getEditor(), activeCode05()
[E1] dayName01[DayCode].Collapse (L102) → 인라인 L102-112 (new CollapseHandler() { @Override pub…)
[E2] toggleGroup.ValueChange (L114) → activeCode05(), activeCode06()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private Settings() | L66-126 | 생성자 | 상태 처리 | 업무 |
| private getEditor() | L128-196 | 생성자 | 상태 처리 | 업무 |
| public getModel() | L198-217 | 공개 메서드 | 상태 처리 | 업무 |
| public setModel() | L219-236 | 공개 메서드 | 상태 처리 | 업무 |
| private activeCode05() | L238-245 | 생성자,E2,setModel | 상태 처리 | 업무 |
| private activeCode06() | L247-254 | E2,setModel | 상태 처리 | 업무 |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
버튼 사용하지 않음

### Sch03_TabPage_Cycle02 (`client/vi/sch/Sch03_TabPage_Cycle02.java`, 109줄)

- 툴바 `buttonBar01`: {radioType01} {dayWeekName01} {holidayName01}
- 입력·하위 화면: `radioType01` Radio, `dayWeekCode01` TextField, `dayWeekName01` ComboBoxField("DayOfWeekCode") 빈칸="선택", `holidayCode01` TextField, `holidayName01` ComboBoxField("HolidaySettleCode") 빈칸="선택"

#### 이벤트
[E0] 화면 열림 (생성자 L35-41) → Settings(), getEditor()
[E1] dayWeekName01[DayOfWeekCode].Collapse (L55) → 인라인 L55-60 (new CollapseHandler() { @Override pub…)
[E2] holidayName01[HolidaySettleCode].Collapse (L61) → 인라인 L61-66 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private Settings() | L43-51 | 생성자 | 상태 처리 | 업무 |
| private getEditor() | L53-83 | 생성자 | 상태 처리 | 업무 |
| public getModel() | L85-96 | 공개 메서드 | 상태 처리 | 업무 |
| public setModel() | L98-108 | 공개 메서드 | 상태 처리 | 업무 |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
버튼 사용하지 않음

### Sch03_TabPage_Cycle01 (`client/vi/sch/Sch03_TabPage_Cycle01.java`, 87줄)

- 툴바 `buttonBar01`: {radioType01} 매일:
- 입력·하위 화면: `radioType01` Radio

#### 이벤트
[E0] 화면 열림 (생성자 L29-35) → Settings(), getEditor()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private Settings() | L37-40 | 생성자 | 상태 처리 | 업무 |
| private getEditor() | L42-59 | 생성자 | 상태 처리 | 업무 |
| public getModel() | L61-70 | 공개 메서드 | 상태 처리 | 업무 |
| public setModel() | L72-82 | 공개 메서드 | 상태 처리 | 업무 |
| private setHtmlCheckBoxStyle() | L84-86 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
버튼 사용하지 않음

