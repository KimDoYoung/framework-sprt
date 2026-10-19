# Tdm05_Tab_Cncl

- 종류: 화면
- 메뉴: 책무 > 01. 기본정보 > 회의체 등록 (#1415)
- 파일: `client/vi/tdm/Tdm05_Tab_Cncl.java`
- 함께 쓰는 클래스 3개:
  - `Tdm22_Lookup_RoleRelateCncl2` `client/vi/tdm/Tdm22_Lookup_RoleRelateCncl2.java`
  - `Tdm20_Lookup_SelectMulti` `client/vi/tdm/Tdm20_Lookup_SelectMulti.java`
  - `Tdm05_Edit_Cncl` `client/vi/tdm/Tdm05_Edit_Cncl.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys00_Common.selectByKindGroupCode` | Tdm05_Edit_Cncl:105 | [`Sys00_Common.java:106`](../../sys/services/Sys00_Common.md) | [`sys09_code.selectByKindGroupCode`](../../sys/sql/sys09_code.md) |
| `tdm.Tdm05_Cncl.delete` | Tdm05_Tab_Cncl:225 | [`Tdm05_Cncl.java:56`](../../tdm/services/Tdm05_Cncl.md) | [`tdm05_cncl.countUseByCnclId`](../../tdm/sql/tdm05_cncl.md), `UpdateDataModel(tdm05_cncl)` 동적 DELETE |
| `tdm.Tdm05_Cncl.modelUpdate` | Tdm05_Edit_Cncl:185 | [`Tdm05_Cncl.java:38`](../../tdm/services/Tdm05_Cncl.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(tdm05_cncl)` 동적 INSERT/UPDATE → [`tdm05_cncl.selectById`](../../tdm/sql/tdm05_cncl.md) |
| `tdm.Tdm05_Cncl.selectByDate` | Tdm05_Tab_Cncl:182 | [`Tdm05_Cncl.java:33`](../../tdm/services/Tdm05_Cncl.md) | [`tdm05_cncl.selectByDate`](../../tdm/sql/tdm05_cncl.md) |
| `tdm.Tdm20_Role.selectByDate` | Tdm20_Lookup_SelectMulti:154 | [`Tdm20_Role.java:33`](../../tdm/services/Tdm20_Role.md) | [`tdm20_role.selectByDate`](../../tdm/sql/tdm20_role.md) |
| `tdm.Tdm22_RoleRelateCncl.delete` | Tdm22_Lookup_RoleRelateCncl2:307 | [`Tdm22_RoleRelateCncl.java:36`](../../tdm/services/Tdm22_RoleRelateCncl.md) | `UpdateDataModel(tdm22_role_relate_cncl)` 동적 DELETE |
| `tdm.Tdm22_RoleRelateCncl.selectByCnclId` | Tdm22_Lookup_RoleRelateCncl2:187 | [`Tdm22_RoleRelateCncl.java:26`](../../tdm/services/Tdm22_RoleRelateCncl.md) | [`tdm22_role_relate_cncl.selectByCnclId`](../../tdm/sql/tdm22_role_relate_cncl.md) |
| `tdm.Tdm22_RoleRelateCncl.update` | Tdm22_Lookup_RoleRelateCncl2:295 | [`Tdm22_RoleRelateCncl.java:31`](../../tdm/services/Tdm22_RoleRelateCncl.md) | `UpdateDataModel(tdm22_role_relate_cncl)` 동적 INSERT/UPDATE → [`tdm22_role_relate_cncl.selectById`](../../tdm/sql/tdm22_role_relate_cncl.md) |

## 테이블

[`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md), [`tdm05_cncl`](../../../db/tables/tdm.md), [`tdm20_role`](../../../db/tables/tdm.md), [`tdm21_role_relate_task`](../../../db/tables/tdm.md), [`tdm22_role_relate_cncl`](../../../db/tables/tdm.md), [`tdm23_role_relate_org`](../../../db/tables/tdm.md)

## DB 함수

`f_cdnm`, `f_sysdate`, `f_today`, `f_trunc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Tdm05_Tab_Cncl (`client/vi/tdm/Tdm05_Tab_Cncl.java`, 243줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 기준일: {baseDate} {allYn} {retrieveButton} {insertButton} {deleteButton}
- 입력·하위 화면: `baseDate` MyDateField, `allYn` CheckBox, `lookup` Tdm05_Edit_Cncl
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - actionCell 50 "수정" Cell 편집:modifyCell
  - cnclName 200 "회의체" Text
  - openCycleName 80 "개최주기" TextCenter
  - mainDecision 630 "주요의결사항" TextArea
  - startDate 100 "사용시작일" Date
  - endDate 100 "사용종료일" Date
  - relateRoleCnt 70 "연결직책" TextCenter
  - actionCell 35 " " Cell 편집:relateRoleCell
  - updName 100 "변경자" TextCenter
  - updDateStr 150 "변경일시" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L53-79) → settings(), retrieve()
[E1] allYn[전체보기].ValueChange [allYn.getValue()] (L87) → retrieve()
[E2] retrieveButton[조회].Select (L99) → retrieve()
[E3] insertButton[등록].Select (L105) → insertRow()
[E4] deleteButton[삭제].Select (L111) → deleteChk()
       └ [E5] msgBox.DialogHide [YES] (L203) → deleteRow()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L175-188 | 생성자,E1,E2,buildGrid,insertRow | 서비스 tdm.Tdm05_Cncl.selectByDate(companyId, baseDate, allYn) | 업무 |
| public insertRow() | L190-198 | E3 | 팝업 Tdm05_Edit_Cncl 열기 | 업무 |
| private deleteChk() | L200-218 | E4 | ConfirmBox → E5 | 업무 |
| public deleteRow() | L220-235 | E5 | GridDeleteData tdm.Tdm05_Cncl.delete(체크된 행 목록) | 업무 |
| private settings() | L81-117 | 생성자 | 이벤트 연결, 초기값: baseDate=LoginUser.getToday(, allYn=true("전체보기") | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L119-173 | 필드 초기화 | 팝업 Tdm05_Edit_Cncl 열기, 조회창 Tdm22_Lookup_RoleRelateCncl2 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L237-239 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L240-242 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L161) addCell
  gb.text('cnclNm', 200, '회의체'),  // L162
  gb.textCenter('openCycleNm', 80, '개최주기'),  // L163
  gb.textArea('mainDecision', 630, '주요의결사항'),  // L164
  gb.date('startDate', 100, '사용시작일'),  // L165
  gb.date('endDate', 100, '사용종료일'),  // L166
  gb.textCenter('relateRoleCnt', 70, '연결직책'),  // L167
  // ⚠ 대응 없음 (GridBuilder L168) addCell
  gb.textCenter('updNm', 100, '변경자'),  // L169
  gb.textCenter('updDateStr', 150, '변경일시'),  // L170
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="delete" onClick={deleteChk}>삭제</Button>

### Tdm22_Lookup_RoleRelateCncl2 (`client/vi/tdm/Tdm22_Lookup_RoleRelateCncl2.java`, 350줄)

- 툴바 `buttonBar`: {insertButton} {deleteButton} {anchor}
- 입력·하위 화면: `tdmCnclMemberComboBox` ComboBoxField("TdmCnclMemberType") 빈칸="선택하세요", `lookup` Tdm20_Lookup_SelectMulti
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - roleName 250 "직책" Text
  - memberTypeName 100 "역할" TextCenter 편집:"0069B4"
  - startDate 100 "사용시작일" Date 편집:"0069B4"
  - endDate 100 "사용종료일" Date 편집:MyDateField

#### 이벤트
[E1] anchor.MouseDown (L96) → retrieve()
[E2] insertButton[행 추가].Select (L107) → insertRow()
[E3] deleteButton[행 삭제].Select (L113) → deleteRow()
[E4] updateButton[저장].Select (L119) → update()
[E5] closeButton[닫기].Select [YES] (L125) → hide()
[E6] msgBox.DialogHide [YES] (L131) → hide()
[E7] tdmCnclMemberComboBox[TdmCnclMemberType].ValueChange (L159) → 인라인 L159-166 (new ValueChangeHandler<String>() { @O…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L68-91 | 공개 메서드 | 상태 처리 | 업무 |
| private setting() | L93-154 | open | 확인창 표시 | 업무 |
| private retrieve() | L180-193 | E1,open,updateEnd | 서비스 tdm.Tdm22_RoleRelateCncl.selectByCnclId(cnclId, stdDate) | 업무 |
| private insertRow() | L195-222 | E2 | 조회창 Tdm20_Lookup_SelectMulti 열기 | 업무 |
| private deleteRow() | L224-235 | E3 | 미선택 시 alert "삭제할 내역을 선택하세요" | 업무 |
| private update() | L237-316 | E4 | GridDeleteData tdm.Tdm22_RoleRelateCncl.update, tdm.Tdm22_RoleRelateCncl.delete | 업무 |
| private isDateOverlap() | L318-338 | update | 상태 처리 | 업무 |
| private updateEnd() | L340-345 | update | 상태 처리 | 업무 |
| private buildGrid() | L156-178 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L347-349 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('roleNm', 250, '직책'),  // L170 SQL 계산 컬럼(selectByCnclId: tdm20_role_nm)
  gb.textCenter('memberTypeNm', 100, '역할', { editor: 'select' }),  // L171 SQL 계산 컬럼(selectByCnclId: f_cdnm('TdmCnclMemberType', tdm22_membe…)
  gb.date('startDate', 100, '사용시작일', { editor: 'date' }),  // L172
  gb.date('endDate', 100, '사용종료일', { editor: 'date' }),  // L173
];
```

#### 사용된 버튼들
1. <Button type="addRow" onClick={insertRow}>행 추가</Button>
2. <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

### Tdm20_Lookup_SelectMulti (`client/vi/tdm/Tdm20_Lookup_SelectMulti.java`, 179줄)

- 툴바 `buttonBar`: 기준일: {baseDate} 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `baseDate` MyDateField, `searchText` TextField 빈칸="직책/직책그룹/개요"
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - roleName 200 "직책" Text
  - roleTypeName 120 "직책그룹" Text
  - roleTypeEtcName 170 "기타그룹명" Text
  - overview 600 "개요" TextArea

#### 이벤트
[E0] 화면 열림 (생성자 L53-58) → 초기화
[E1] searchText.KeyPress [Enter] (L102) → retrieve()
[E2] grid.CellDoubleClick (L110) → confirm()
[E3] retrieveButton[조회].Select (L116) → retrieve()
[E4] updateButton[확인].Select (L122) → confirm()
[E5] closeButton[닫기].Select (L128) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L60-63 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L65-92 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L147-160 | E1,E3,open | 서비스 tdm.Tdm20_Role.selectByDate(companyId, baseDate, searchText) | 업무 |
| public confirm() | L162-170 | E2,E4 | 미선택 시 alert "선택된 직책이 없습니다" | 업무 |
| private settings() | L94-134 | open | 이벤트 연결, 초기값: baseDate=stdDate | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L136-145 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L172-174 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L176-178 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('roleNm', 200, '직책'),  // L139
  gb.text('roleTypeNm', 120, '직책그룹'),  // L140
  gb.text('roleTypeEtcNm', 170, '기타그룹명'),  // L141
  gb.textArea('overview', 600, '개요'),  // L142
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

### Tdm05_Edit_Cncl (`client/vi/tdm/Tdm05_Edit_Cncl.java`, 208줄)

- 입력·하위 화면: `cnclName` TextField, `openCycleCode` TextField, `mainDecision` MyTextArea, `startDate` MyDateField, `endDate` MyDateField, `openCycleName` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode")

#### 이벤트
[E0] 화면 열림 (생성자 L84-97) → setting(), show()
[E1] openCycleName[개최주기].Collapse (L106) → 인라인 L106-111 (new CollapseHandler() { @Override pub…)
[E2] updateButton[저장].Select (L113) → update()
[E3] closeButton[닫기].Select (L119) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public insert() | L59-74 | 공개 메서드 | 상태 처리 | 업무 |
| public edit() | L76-82 | 공개 메서드 | 상태 처리 | 업무 |
| private setting() | L99-125 | 생성자 | 서비스 sys.Sys00_Common.selectByKindGroupCode | 업무 |
| private getEditor() | L127-161 | insert,edit | 상태 처리 | 업무 |
| public update() | L163-195 | E2 | 서비스 tdm.Tdm05_Cncl.modelUpdate | 업무 |
| private setHtmlStyle() | L197-199 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L201-203 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L205-207 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

