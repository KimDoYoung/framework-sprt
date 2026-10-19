# Tdm20_Tab_Role

- 종류: 화면
- 메뉴: 책무 > 01. 기본정보 > 직책별 책무 등록 (#1414)
- 파일: `client/vi/tdm/Tdm20_Tab_Role.java`
- 함께 쓰는 클래스 8개:
  - `Tdm95_Lookup_ChangeHistory` `client/vi/tdm/Tdm95_Lookup_ChangeHistory.java`
  - `Tdm23_Lookup_RoleRelateOrg` `client/vi/tdm/Tdm23_Lookup_RoleRelateOrg.java`
  - `Tdm22_Lookup_RoleRelateCncl` `client/vi/tdm/Tdm22_Lookup_RoleRelateCncl.java`
  - `Tdm05_Lookup_SelectMulti` `client/vi/tdm/Tdm05_Lookup_SelectMulti.java`
  - `Tdm21_Lookup_RoleRelateTask` `client/vi/tdm/Tdm21_Lookup_RoleRelateTask.java`
  - `Tdm10_Lookup_SelectMulti` `client/vi/tdm/Tdm10_Lookup_SelectMulti.java`
  - `Tdm20_Lookup_SelectSingle` `client/vi/tdm/Tdm20_Lookup_SelectSingle.java`
  - `Tdm20_Edit_Role` `client/vi/tdm/Tdm20_Edit_Role.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Org00_Lookup_SelectMulti`](../../org/components/Org00_Lookup_SelectMulti.md), [`Org00_Lookup_SelectTdm`](../../org/components/Org00_Lookup_SelectTdm.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `tdm.Tdm05_Cncl.selectByDate` | Tdm05_Lookup_SelectMulti:132 | [`Tdm05_Cncl.java:33`](../../tdm/services/Tdm05_Cncl.md) | [`tdm05_cncl.selectByDate`](../../tdm/sql/tdm05_cncl.md) |
| `tdm.Tdm10_Task.selectByText` | Tdm10_Lookup_SelectMulti:171 | [`Tdm10_Task.java:25`](../../tdm/services/Tdm10_Task.md) | [`tdm10_task.selectByText`](../../tdm/sql/tdm10_task.md) |
| `tdm.Tdm20_Role.checkCeoRoleId` | Tdm20_Edit_Role:310 | [`Tdm20_Role.java:43`](../../tdm/services/Tdm20_Role.md) | [`tdm20_role.checkCeoRoleId`](../../tdm/sql/tdm20_role.md) |
| `tdm.Tdm20_Role.countUseByRoleId` | Tdm20_Tab_Role:342 | [`Tdm20_Role.java:53`](../../tdm/services/Tdm20_Role.md) | [`tdm20_role.countUseByRoleId`](../../tdm/sql/tdm20_role.md) |
| `tdm.Tdm20_Role.delete` | Tdm20_Tab_Role:401 | [`Tdm20_Role.java:94`](../../tdm/services/Tdm20_Role.md) | [`tdm20_role.countUseByRoleId`](../../tdm/sql/tdm20_role.md), `UpdateDataModel(tdm20_role)` 동적 DELETE |
| `tdm.Tdm20_Role.modelUpdate` | Tdm20_Edit_Role:357, Tdm20_Lookup_SelectSingle:205 | [`Tdm20_Role.java:66`](../../tdm/services/Tdm20_Role.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(tdm20_role)` 동적 INSERT/UPDATE → [`tdm20_role.selectById`](../../tdm/sql/tdm20_role.md) |
| `tdm.Tdm20_Role.selectByDate` | Tdm20_Lookup_SelectSingle:188, Tdm20_Tab_Role:317 | [`Tdm20_Role.java:33`](../../tdm/services/Tdm20_Role.md) | [`tdm20_role.selectByDate`](../../tdm/sql/tdm20_role.md) |
| `tdm.Tdm21_RoleRelateTask.delete` | Tdm21_Lookup_RoleRelateTask:262 | [`Tdm21_RoleRelateTask.java:41`](../../tdm/services/Tdm21_RoleRelateTask.md) | `UpdateDataModel(tdm21_role_relate_task)` 동적 DELETE |
| `tdm.Tdm21_RoleRelateTask.selectByRoloId` | Tdm21_Lookup_RoleRelateTask:183 | [`Tdm21_RoleRelateTask.java:23`](../../tdm/services/Tdm21_RoleRelateTask.md) | [`tdm21_role_relate_task.selectByRoloId`](../../tdm/sql/tdm21_role_relate_task.md) |
| `tdm.Tdm21_RoleRelateTask.update` | Tdm21_Lookup_RoleRelateTask:250 | [`Tdm21_RoleRelateTask.java:36`](../../tdm/services/Tdm21_RoleRelateTask.md) | `UpdateDataModel(tdm21_role_relate_task)` 동적 INSERT/UPDATE → [`tdm21_role_relate_task.selectById`](../../tdm/sql/tdm21_role_relate_task.md) |
| `tdm.Tdm22_RoleRelateCncl.delete` | Tdm22_Lookup_RoleRelateCncl:303 | [`Tdm22_RoleRelateCncl.java:36`](../../tdm/services/Tdm22_RoleRelateCncl.md) | `UpdateDataModel(tdm22_role_relate_cncl)` 동적 DELETE |
| `tdm.Tdm22_RoleRelateCncl.selectByRoleId` | Tdm22_Lookup_RoleRelateCncl:184 | [`Tdm22_RoleRelateCncl.java:21`](../../tdm/services/Tdm22_RoleRelateCncl.md) | [`tdm22_role_relate_cncl.selectByRoleId`](../../tdm/sql/tdm22_role_relate_cncl.md) |
| `tdm.Tdm22_RoleRelateCncl.update` | Tdm22_Lookup_RoleRelateCncl:291 | [`Tdm22_RoleRelateCncl.java:31`](../../tdm/services/Tdm22_RoleRelateCncl.md) | `UpdateDataModel(tdm22_role_relate_cncl)` 동적 INSERT/UPDATE → [`tdm22_role_relate_cncl.selectById`](../../tdm/sql/tdm22_role_relate_cncl.md) |
| `tdm.Tdm23_RoleRelateOrg.delete` | Tdm23_Lookup_RoleRelateOrg:243 | [`Tdm23_RoleRelateOrg.java:31`](../../tdm/services/Tdm23_RoleRelateOrg.md) | `UpdateDataModel(tdm23_role_relate_org)` 동적 DELETE |
| `tdm.Tdm23_RoleRelateOrg.selectByRoleId` | Tdm23_Lookup_RoleRelateOrg:169 | [`Tdm23_RoleRelateOrg.java:21`](../../tdm/services/Tdm23_RoleRelateOrg.md) | [`tdm23_role_relate_org.selectByRoleId`](../../tdm/sql/tdm23_role_relate_org.md) |
| `tdm.Tdm23_RoleRelateOrg.update` | Tdm23_Lookup_RoleRelateOrg:231 | [`Tdm23_RoleRelateOrg.java:26`](../../tdm/services/Tdm23_RoleRelateOrg.md) | `UpdateDataModel(tdm23_role_relate_org)` 동적 INSERT/UPDATE → [`tdm23_role_relate_org.selectById`](../../tdm/sql/tdm23_role_relate_org.md) |
| `tdm.Tdm95_ChangeHistory.selectByTargetId` | Tdm95_Lookup_ChangeHistory:221 | [`Tdm95_ChangeHistory.java:20`](../../tdm/services/Tdm95_ChangeHistory.md) | [`tdm95_change_history.selectByTargetId`](../../tdm/sql/tdm95_change_history.md) |
| `tdm.Tdm96_ChangeDetail.selectByChangeHistoryId` | Tdm95_Lookup_ChangeHistory:237 | [`Tdm96_ChangeDetail.java:22`](../../tdm/services/Tdm96_ChangeDetail.md) | [`tdm96_change_detail.selectByChangeHistoryId`](../../tdm/sql/tdm96_change_detail.md) |

## 테이블

[`tdm05_cncl`](../../../db/tables/tdm.md), [`tdm09_appr_step`](../../../db/tables/tdm.md), [`tdm10_task`](../../../db/tables/tdm.md), [`tdm11_task_relate_rule`](../../../db/tables/tdm.md), [`tdm12_task_relate_detail`](../../../db/tables/tdm.md), [`tdm14_task_type`](../../../db/tables/tdm.md), [`tdm20_role`](../../../db/tables/tdm.md), [`tdm21_role_relate_task`](../../../db/tables/tdm.md), [`tdm22_role_relate_cncl`](../../../db/tables/tdm.md), [`tdm23_role_relate_org`](../../../db/tables/tdm.md), [`tdm30_role_allc`](../../../db/tables/tdm.md), [`tdm95_change_history`](../../../db/tables/tdm.md), [`tdm96_change_detail`](../../../db/tables/tdm.md)

## DB 함수

`f_cdnm`, `f_sysdate`, `f_today`, `getorg`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Tdm20_Tab_Role (`client/vi/tdm/Tdm20_Tab_Role.java`, 419줄)

- 레이아웃: center=vlc
- 툴바 `buttonBarL`: 기준일: {baseDate} {allYn} 검색: {searchText} {retrieveButton} {insertButton} {deleteButton}
- 툴바 `buttonBarR`: {historyButton}
- 입력·하위 화면: `baseDate` MyDateField, `searchText` TextField 빈칸="직책/직책그룹/개요", `allYn` CheckBox, `lookup` Tdm95_Lookup_ChangeHistory
- 그리드 `grid` (buildGrid()):
  - actionCell 35 "수정" CellFrozen 편집:actionCell01
  - roleName 150 "직책" TextFrozen 편집:"left"
  - roleTypeName 110 "직책그룹" Text
  - roleTypeEtcName 160 "기타그룹명" Text
  - overview 500 "개요" TextArea
  - roleRelateTaskCnt 70 "연결책무" TextCenter
  - actionCell 35 " " Cell 편집:actionCell02
  - roleRelateCnclCnt 70 "연결회의체" TextCenter
  - actionCell 35 " " Cell 편집:actionCell03
  - roleRelateOrgCnt 70 "연결부서" TextCenter
  - actionCell 35 " " Cell 편집:actionCell04
  - ceoRoleName 160 "보고CEO" TextCenter
  - actionCell 35 " " Cell 편집:actionCell05
  - startDate 90 "사용시작일" Date
  - endDate 90 "사용종료일" Date
  - updName 80 "변경자" TextCenter
  - updDateStr 150 "변경일시" TextCenter
  - actionCell 70 "변경이력 " Cell 편집:historyCell

#### 이벤트
[E0] 화면 열림 (생성자 L67-104) → settings(), retrieve()
[E1] allYn[전체보기].ValueChange [allYn.getValue()] (L112) → retrieve()
[E2] searchText.KeyPress [Enter] (L126) → retrieve()
[E3] retrieveButton[조회].Select (L135) → retrieve()
[E4] insertButton[등록].Select (L141) → insertRow()
[E5] deleteButton[삭제].Select (L147) → deleteChk()
       └ [E7] msgBox.DialogHide [YES] (L356) → deleteRow()
[E6] historyButton[변경이력].Select (L153) → 인라인 L153-159 (new SelectHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L309-323 | 생성자,E1,E2,E3,buildGrid,insertRow | 서비스 tdm.Tdm20_Role.selectByDate(companyId, baseDate, allYn, searchText) | 업무 |
| public insertRow() | L325-333 | E4 | 팝업 Tdm20_Edit_Role 열기 | 업무 |
| private deleteChk() | L335-392 | E5 | 미선택 시 alert "삭제대상을 선택하세요" → 확인창 E7 | 업무 |
| public deleteRow() | L394-411 | E7 | GridDeleteData tdm.Tdm20_Role.delete(체크된 행 목록) | 업무 |
| private settings() | L106-160 | 생성자 | 조회창 Tdm95_Lookup_ChangeHistory 열기, 이벤트 연결, 초기값: baseDate=LoginUser.getToday(, allYn=true("전체보기") | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L162-307 | 필드 초기화 | 팝업 Tdm20_Edit_Role 열기, 조회창 Tdm21_Lookup_RoleRelateTask 열기, 조회창 Tdm22_Lookup_RoleRelateCncl 열기, 조회창 Tdm23_Lookup_RoleRelateOrg 열기, 조회창 Tdm20_Lookup_SelectSingle 열기, 조회창 Tdm95_Lookup_ChangeHistory 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L413-415 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L416-418 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L283) addCellFrozen
  // ⚠ 대응 없음 (GridBuilder L284) addTextFrozen
  gb.text('roleTypeNm', 110, '직책그룹'),  // L289
  gb.text('roleTypeEtcNm', 160, '기타그룹명'),  // L290
  gb.textArea('overview', 500, '개요'),  // L291
  gb.textCenter('roleRelateTaskCnt', 70, '연결책무'),  // L292
  // ⚠ 대응 없음 (GridBuilder L293) addCell
  gb.textCenter('roleRelateCnclCnt', 70, '연결회의체'),  // L294
  // ⚠ 대응 없음 (GridBuilder L295) addCell
  gb.textCenter('roleRelateOrgCnt', 70, '연결부서'),  // L296
  // ⚠ 대응 없음 (GridBuilder L297) addCell
  gb.textCenter('ceoRoleNm', 160, '보고CEO'),  // L298
  // ⚠ 대응 없음 (GridBuilder L299) addCell
  gb.date('startDate', 90, '사용시작일'),  // L300
  gb.date('endDate', 90, '사용종료일'),  // L301
  gb.textCenter('updNm', 80, '변경자'),  // L302
  gb.textCenter('updDateStr', 150, '변경일시'),  // L303
  // ⚠ 대응 없음 (GridBuilder L304) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="delete" onClick={deleteChk}>삭제</Button>
4. <Button type="unknown" onClick={() => /* 인라인 L153-159 (new SelectHandler() { @Override publi…) */}>변경이력</Button>

### Tdm95_Lookup_ChangeHistory (`client/vi/tdm/Tdm95_Lookup_ChangeHistory.java`, 254줄)

- 툴바 `buttonBar`: 구분: {dmlTypeComboBox} 검색: {searchText} {retrieveButton} * '사유' 및 '변경 전/후 데이터'는 더블 클릭하여 넓은 팝업으로 볼 수 있습니다:
- 입력·하위 화면: `dmlTypeComboBox` ComboBoxField("DataDmlType", "%", "전체", "전체"), `searchText` TextField 빈칸="처리자/사유/변경항목"
- 그리드 `grid` (buildGrid(), 행번호숨김):
  - rowNum 50 " " LongCenter
  - changeDateStr 150 "처리일시" TextCenter
  - changeEmpName 80 "처리자" TextCenter
  - changeType 70 "처리구분" TextCenter
  - reason 300 "사유" Text
- 그리드 `detailGrid` (detailBuildGrid()):
  - windowItemName 150 "변경항목" Text
  - beforeData 250 "변경 전 데이터" Text
  - afterData 250 "변경 후 데이터" Text

#### 이벤트
[E0] 화면 열림 (생성자 L60-65) → 초기화
[E1] dmlTypeComboBox[DataDmlType].Collapse (L109) → retrieve()
[E2] searchText.KeyPress [Enter] (L118) → retrieve()
[E3] grid.SelectionChanged [selectModel == null] (L127) → detailRetrieve()
[E4] grid.CellDoubleClick [cellIndex == 5] (L137) → 인라인 L137-147 (new CellDoubleClickHandler() { @Overr…)
[E5] detailGrid.CellDoubleClick [cellIndex == 2] (L148) → 인라인 L148-162 (new CellDoubleClickHandler() { @Overr…)
[E6] retrieveButton[조회].Select (L163) → retrieve()
[E7] closeButton[닫기].Select (L169) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public execute() | L47-50 | retrieve,detailRetrieve | 상태 처리 | 업무 |
| public open() | L67-70 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L72-105 | 공개 메서드 | 상태 처리 | 업무 |
| public detailBuildGrid() | L191-200 | 필드 초기화 | 상태 처리 | 업무 |
| public retrieve() | L202-230 | E1,E2,E6,execute | 서비스 tdm.Tdm95_ChangeHistory.selectByTargetId(companyId, targetTable, targetId, changeType, searchText) | 업무 |
| public detailRetrieve() | L232-243 | E3 | 서비스 tdm.Tdm96_ChangeDetail.selectByChangeHistoryId(changeHistoryId) | 업무 |
| private settings() | L107-175 | open | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L177-189 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L245-247 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L248-250 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L251-253 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.longCenter('rowNum', 50, ' '),  // L182 SQL 계산 컬럼(selectByTargetId: ROW_NUMBER() OVER(ORDER BY tdm95_change…)
  gb.textCenter('changeDateStr', 150, '처리일시'),  // L183 SQL 계산 컬럼(selectByTargetId: COALESCE(TO_CHAR(tdm95_change_date, 'yy…)
  gb.textCenter('changeEmpNm', 80, '처리자'),  // L184
  gb.textCenter('changeType', 70, '처리구분'),  // L185
  gb.text('reason', 300, '사유'),  // L186
];

const detailBuildGrid = () => [
  gb.text('windowItemNm', 150, '변경항목'),  // L195
  gb.text('beforeData', 250, '변경 전 데이터'),  // L196
  gb.text('afterData', 250, '변경 후 데이터'),  // L197
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Tdm23_Lookup_RoleRelateOrg (`client/vi/tdm/Tdm23_Lookup_RoleRelateOrg.java`, 264줄)

- 툴바 `buttonBar`: {insertButton} {deleteButton} {anchor}
- 입력·하위 화면: `lookupOrgCode` Org00_Lookup_SelectTdm
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - orgName 250 "부서" Text

#### 이벤트
[E1] anchor.MouseDown (L92) → retrieve()
[E2] insertButton[행 추가].Select (L103) → insertRow()
[E3] deleteButton[행 삭제].Select (L109) → deleteRow()
[E4] updateButton[저장].Select (L115) → update()
[E5] closeButton[닫기].Select [YES] (L121) → hide()
[E6] msgBox.DialogHide [YES] (L127) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L64-87 | 공개 메서드 | 상태 처리 | 업무 |
| private setting() | L89-150 | open | 확인창 표시 | 업무 |
| private retrieve() | L160-175 | E1,open,updateEnd | 서비스 tdm.Tdm23_RoleRelateOrg.selectByRoleId(companyId, stdDate, roleId) | 업무 |
| private insertRow() | L177-200 | E2 | 조회창 Org00_Lookup_SelectTdm 열기 | 업무 |
| private deleteRow() | L202-213 | E3 | 미선택 시 alert "삭제할 내역을 선택하세요" | 업무 |
| private update() | L215-252 | E4 | GridDeleteData tdm.Tdm23_RoleRelateOrg.update, tdm.Tdm23_RoleRelateOrg.delete | 업무 |
| private updateEnd() | L254-259 | update | 상태 처리 | 업무 |
| private buildGrid() | L152-158 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L261-263 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('orgNm', 250, '부서'),  // L155 SQL 계산 컬럼(selectByRoleId: org00_kor_nm)
];
```

#### 사용된 버튼들
1. <Button type="addRow" onClick={insertRow}>행 추가</Button>
2. <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

### Tdm22_Lookup_RoleRelateCncl (`client/vi/tdm/Tdm22_Lookup_RoleRelateCncl.java`, 346줄)

- 툴바 `buttonBar`: {insertButton} {deleteButton} {anchor}
- 입력·하위 화면: `tdmCnclMemberComboBox` ComboBoxField("TdmCnclMemberType") 빈칸="선택하세요", `lookup` Tdm05_Lookup_SelectMulti
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - cnclName 250 "회의체" Text
  - memberTypeName 100 "역활" TextCenter 편집:"0069B4"
  - startDate 100 "사용시작일" Date 편집:"0069B4"
  - endDate 100 "사용종료일" Date 편집:MyDateField

#### 이벤트
[E1] anchor.MouseDown (L94) → retrieve()
[E2] insertButton[행 추가].Select (L105) → insertRow()
[E3] deleteButton[행 삭제].Select (L111) → deleteRow()
[E4] updateButton[저장].Select (L117) → update()
[E5] closeButton[닫기].Select [YES] (L123) → hide()
[E6] msgBox.DialogHide [YES] (L129) → hide()
[E7] tdmCnclMemberComboBox[TdmCnclMemberType].ValueChange (L157) → 인라인 L157-164 (new ValueChangeHandler<String>() { @O…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L67-89 | 공개 메서드 | 상태 처리 | 업무 |
| private setting() | L91-152 | open | 확인창 표시 | 업무 |
| private retrieve() | L178-190 | E1,open,updateEnd | 서비스 tdm.Tdm22_RoleRelateCncl.selectByRoleId(roleId) | 업무 |
| private insertRow() | L192-219 | E2 | 조회창 Tdm05_Lookup_SelectMulti 열기 | 업무 |
| private deleteRow() | L221-232 | E3 | 미선택 시 alert "삭제할 내역을 선택하세요" | 업무 |
| private update() | L234-312 | E4 | GridDeleteData tdm.Tdm22_RoleRelateCncl.update, tdm.Tdm22_RoleRelateCncl.delete | 업무 |
| private isDateOverlap() | L314-334 | update | 상태 처리 | 업무 |
| private updateEnd() | L336-341 | update | 상태 처리 | 업무 |
| private buildGrid() | L154-176 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L343-345 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('cnclNm', 250, '회의체'),  // L168 SQL 계산 컬럼(selectByRoleId: tdm05_cncl_nm)
  gb.textCenter('memberTypeNm', 100, '역활', { editor: 'select' }),  // L169 SQL 계산 컬럼(selectByRoleId: f_cdnm('TdmCnclMemberType', tdm22_membe…)
  gb.date('startDate', 100, '사용시작일', { editor: 'date' }),  // L170
  gb.date('endDate', 100, '사용종료일', { editor: 'date' }),  // L171
];
```

#### 사용된 버튼들
1. <Button type="addRow" onClick={insertRow}>행 추가</Button>
2. <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

### Tdm05_Lookup_SelectMulti (`client/vi/tdm/Tdm05_Lookup_SelectMulti.java`, 158줄)

- 툴바 `buttonBar`: 기준일: {baseDate} {retrieveButton}
- 입력·하위 화면: `baseDate` MyDateField
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - cnclName 250 "회의체" Text
  - openCycleName 100 "개최주기" TextCenter
  - mainDecision 450 "주요의결사항" TextArea

#### 이벤트
[E0] 화면 열림 (생성자 L59-84) → settings(), show()
[E1] grid.CellDoubleClick (L89) → confirm()
[E2] retrieveButton[조회].Select (L95) → retrieve()
[E3] updateButton[확인].Select (L101) → confirm()
[E4] closeButton[닫기].Select (L107) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L49-52 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L54-57 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L125-138 | E2,open | 서비스 tdm.Tdm05_Cncl.selectByDate(companyId, baseDate, roleId) | 업무 |
| public confirm() | L140-149 | E1,E3 | 상태 처리 | 업무 |
| private settings() | L86-113 | 생성자 | 이벤트 연결, 초기값: baseDate=LoginUser.getToday( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L115-123 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L151-153 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L155-157 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('cnclNm', 250, '회의체'),  // L118
  gb.textCenter('openCycleNm', 100, '개최주기'),  // L119
  gb.textArea('mainDecision', 450, '주요의결사항'),  // L120
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

### Tdm21_Lookup_RoleRelateTask (`client/vi/tdm/Tdm21_Lookup_RoleRelateTask.java`, 283줄)

- 툴바 `buttonBar`: {insertButton} {deleteButton} {anchor}
- 입력·하위 화면: `lookup` Tdm10_Lookup_SelectMulti
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - taskClassName 120 "책무구분" TextCenter
  - taskTypeName 270 "책무유형" TextArea
  - taskName 450 "책무" TextArea
  - startDate 90 "사용시작일" Date
  - endDate 90 "사용종료일" Date

#### 이벤트
[E0] 화면 열림 (생성자 L61-66) → 초기화
[E1] anchor.MouseDown (L101) → retrieve()
[E2] insertButton[행 추가].Select (L112) → insertRow()
[E3] deleteButton[행 삭제].Select (L118) → deleteRow()
[E4] updateButton[저장].Select (L124) → update()
[E5] closeButton[닫기].Select [YES] (L130) → hide()
[E6] msgBox.DialogHide [YES] (L137) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public view() | L68-75 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L77-96 | view | 상태 처리 | 업무 |
| private retrieve() | L177-189 | E1,open,updateEnd | 서비스 tdm.Tdm21_RoleRelateTask.selectByRoloId(roleId) | 업무 |
| private insertRow() | L191-219 | E2 | 조회창 Tdm10_Lookup_SelectMulti 열기 | 업무 |
| private deleteRow() | L221-232 | E3 | 미선택 시 alert "삭제할 내역을 선택하세요" | 업무 |
| private update() | L234-271 | E4 | GridDeleteData tdm.Tdm21_RoleRelateTask.update, tdm.Tdm21_RoleRelateTask.delete | 업무 |
| private updateEnd() | L273-278 | update | 상태 처리 | 업무 |
| private settings() | L98-163 | open | 확인창 표시, 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L165-175 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L280-282 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('taskClassNm', 120, '책무구분'),  // L168 SQL 계산 컬럼(selectByRoloId: f_cdnm('TdmTaskClassCode', tdm10_task_c…)
  gb.textArea('taskTypeNm', 270, '책무유형'),  // L169 SQL 계산 컬럼(selectByRoloId: tdm14_task_type_nm)
  gb.textArea('taskNm', 450, '책무'),  // L170 SQL 계산 컬럼(selectByRoloId: tdm10_task_nm)
  gb.date('startDate', 90, '사용시작일'),  // L171 SQL 계산 컬럼(selectByRoloId: tdm10_start_date)
  gb.date('endDate', 90, '사용종료일'),  // L172 SQL 계산 컬럼(selectByRoloId: tdm10_end_date)
];
```

#### 사용된 버튼들
1. <Button type="addRow" onClick={insertRow}>행 추가</Button>
2. <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

### Tdm10_Lookup_SelectMulti (`client/vi/tdm/Tdm10_Lookup_SelectMulti.java`, 197줄)

- 툴바 `buttonBar`: 기준일: {baseDate} 책무구분: {taskClassComboBox} 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `baseDate` MyDateField, `searchText` TextField 빈칸="책무유형/책무", `taskClassComboBox` ComboBoxField("TdmTaskClassCode", "%", "전체", "전체")
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - taskClassName 120 "책무구분" Text
  - taskTypeName 270 "책무유형" Text
  - taskName 450 "책무" Text
  - commonYn 80 "공통책무" BooleanYn2
  - ceoYn 80 "CEO책무" BooleanYn2

#### 이벤트
[E0] 화면 열림 (생성자 L67-98) → settings(), show()
[E1] taskClassComboBox[TdmTaskClassCode].Collapse (L107) → retrieve()
[E2] searchText.KeyPress [Enter] (L116) → retrieve()
[E3] grid.CellDoubleClick (L124) → confirm()
[E4] retrieveButton[조회].Select (L130) → retrieve()
[E5] updateButton[확인].Select (L136) → confirm()
[E6] closeButton[닫기].Select (L142) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public execute() | L50-53 | retrieve | 상태 처리 | 업무 |
| public open() | L62-65 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L162-177 | E1,E2,E4,execute,open | 서비스 tdm.Tdm10_Task.selectByText(companyId, baseDate, taskClassCode, dedupYn, searchText) | 업무 |
| public confirm() | L179-188 | E3,E5 | 상태 처리 | 업무 |
| private settings() | L100-148 | 생성자 | 이벤트 연결, 초기값: baseDate=LoginUser.getToday( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L150-160 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L190-192 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L194-196 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('taskClassNm', 120, '책무구분'),  // L153
  gb.text('taskTypeNm', 270, '책무유형'),  // L154
  gb.text('taskNm', 450, '책무'),  // L155
  gb.booleanYn2('commonYn', 80, '공통책무'),  // L156
  gb.booleanYn2('ceoYn', 80, 'CEO책무'),  // L157
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

### Tdm20_Lookup_SelectSingle (`client/vi/tdm/Tdm20_Lookup_SelectSingle.java`, 231줄)

- 툴바 `buttonBar`: 기준일: {baseDate} 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `baseDate` MyDateField, `searchText` TextField 빈칸="직책/직책그룹/개요"
- 그리드 `grid` (buildGrid(), 체크박스):
  - roleName 200 "직책" Text
  - roleTypeName 120 "직책그룹" Text
  - roleTypeEtcName 170 "기타그룹명" Text
  - overview 600 "개요" TextArea

#### 이벤트
[E0] 화면 열림 (생성자 L62-67) → 초기화
[E1] searchText.KeyPress [Enter] (L128) → retrieve()
[E2] grid.CellDoubleClick (L136) → confirm()
[E3] retrieveButton[조회].Select (L142) → retrieve()
[E4] updateButton[확인].Select (L148) → confirm()
[E5] closeButton[닫기].Select (L154) → hide()
[E6] allButton[전체].Select (L160) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public openAll() | L69-75 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L77-80 | openAll | 상태 처리 | 업무 |
| public open() | L82-86 | openAll | 상태 처리 | 업무 |
| public open() | L88-118 | openAll | 상태 처리 | 업무 |
| public retrieve() | L180-194 | E1,E3,open | 서비스 tdm.Tdm20_Role.selectByDate(companyId, baseDate, searchText, roleType) | 업무 |
| public confirm() | L196-222 | E2,E4 | 미선택 시 alert "선택된 직책이 없습니다", 서비스 tdm.Tdm20_Role.modelUpdate | 업무 |
| private settings() | L120-167 | open | 이벤트 연결, 초기값: baseDate=stdDate | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L169-178 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L224-226 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L228-230 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('roleNm', 200, '직책'),  // L172
  gb.text('roleTypeNm', 120, '직책그룹'),  // L173
  gb.text('roleTypeEtcNm', 170, '기타그룹명'),  // L174
  gb.textArea('overview', 600, '개요'),  // L175
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>
4. <Button type="unknown" onClick={hide}>전체</Button>

### Tdm20_Edit_Role (`client/vi/tdm/Tdm20_Edit_Role.java`, 520줄)

- 입력·하위 화면: `roleName` TextField, `roleType` TextField, `roleTypeName` ComboBoxField("TdmRoleType"), `roleTypeEtcName` TextField, `overview` MyTextArea, `startDate` MyDateField, `endDate` MyDateField, `ceoRoleName` LookupTriggerField, `ceoRoleId` LongField, `lookup` Tdm20_Lookup_SelectSingle

#### 이벤트
[E0] 화면 열림 (생성자 L122-138) → setting(), show()
[E1] roleTypeName[직책그룹].Collapse (L141) → 인라인 L141-151 (new CollapseHandler() { @Override pub…)
[E2] ceoRoleName[보고CEO].TriggerClick [result != null] (L153) → 인라인 L153-172 (new TriggerClickHandler(){ @Override …)
[E3] updateButton[저장].Select (L173) → updateChk()
[E4] closeButton[닫기].Select (L179) → hide()
[E5] roleRelateTaskButton[연결책무(0건)].Select [result != null] (L186) → 인라인 L186-201 (new SelectHandler() { @Override publi…)
[E6] roleRelateCnclButton[연결회의체(0건)].Select [result != null] (L203) → 인라인 L203-218 (new SelectHandler() { @Override publi…)
[E7] roleRelateOrgButton[연결부서(0건)].Select [result != null] (L220) → 인라인 L220-235 (new SelectHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public insert() | L80-100 | 공개 메서드 | 상태 처리 | 업무 |
| public edit() | L102-120 | 공개 메서드 | 상태 처리 | 업무 |
| private setting() | L140-236 | 생성자 | 조회창 Tdm20_Lookup_SelectSingle 열기, 조회창 Tdm21_Lookup_RoleRelateTask 열기, 조회창 Tdm22_Lookup_RoleRelateCncl 열기, 조회창 Tdm23_Lookup_RoleRelateOrg 열기, LabelHtml 래퍼 | 업무 |
| private getEditor() | L238-276 | insert,edit | 상태 처리 | 업무 |
| private updateChk() | L278-328 | E3 | 서비스 tdm.Tdm20_Role.checkCeoRoleId(roleId) | 업무 |
| private preUpdate() | L330-354 | updateChk | 상태 처리 | 업무 |
| private update() | L356-372 | preUpdate | 서비스 tdm.Tdm20_Role.modelUpdate(historyMap) | 업무 |
| private getHistoryMap() | L374-487 | preUpdate | 상태 처리 | 업무 |
| private retrieveRelate() | L489-507 | edit | LabelHtml 래퍼 | 업무 |
| private setHtmlStyle() | L509-511 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L513-515 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L517-519 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={() => /* 인라인 L186-201 (new SelectHandler() { @Override publi…) */}>연결책무(0건)</Button>
2. <Button type="unknown" onClick={() => /* 인라인 L203-218 (new SelectHandler() { @Override publi…) */}>연결회의체(0건)</Button>
3. <Button type="unknown" onClick={() => /* 인라인 L220-235 (new SelectHandler() { @Override publi…) */}>연결부서(0건)</Button>
4. <Button type="save" onClick={updateChk}>저장</Button>
5. <Button type="unknown" onClick={hide}>닫기</Button>

