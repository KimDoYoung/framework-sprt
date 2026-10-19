# Tdm41_Tab_ManlDutyOrg

- 종류: 화면
- 메뉴: 책무 > 03. 부서책무매뉴얼 > 매뉴얼 부서지정 (#1421)
- 파일: `client/vi/tdm/Tdm41_Tab_ManlDutyOrg.java`
- 함께 쓰는 클래스 7개:
  - `Tdm41_TabPage_ManlDutyOrg` `client/vi/tdm/Tdm41_TabPage_ManlDutyOrg.java`
  - `Tdm44_Lookup_ManlDutyOrg` `client/vi/tdm/Tdm44_Lookup_ManlDutyOrg.java`
  - `Tdm23_Lookup_SelectOrg` `client/vi/tdm/Tdm23_Lookup_SelectOrg.java`
  - `Tdm41_Lookup_ChangeOrg_Tmp` `client/vi/tdm/Tdm41_Lookup_ChangeOrg_Tmp.java`
  - `Tdm40_Lookup_SelectSingle` `client/vi/tdm/Tdm40_Lookup_SelectSingle.java`
  - `Tdm20_Lookup_SelectRole` `client/vi/tdm/Tdm20_Lookup_SelectRole.java`
  - `Tdm10_Lookup_SelectSingle` `client/vi/tdm/Tdm10_Lookup_SelectSingle.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `tdm.Tdm10_Task.selectByText` | Tdm10_Lookup_SelectSingle:176 | [`Tdm10_Task.java:25`](../../tdm/services/Tdm10_Task.md) | [`tdm10_task.selectByText`](../../tdm/sql/tdm10_task.md) |
| `tdm.Tdm20_Role.selectByDate` | Tdm20_Lookup_SelectRole:193 | [`Tdm20_Role.java:33`](../../tdm/services/Tdm20_Role.md) | [`tdm20_role.selectByDate`](../../tdm/sql/tdm20_role.md) |
| `tdm.Tdm20_Role.selectCheckTargetRole` | Tdm20_Lookup_SelectRole:188 | [`Tdm20_Role.java:38`](../../tdm/services/Tdm20_Role.md) | [`tdm20_role.selectCheckTargetRole`](../../tdm/sql/tdm20_role.md) |
| `tdm.Tdm23_RoleRelateOrg.selectByRoleId` | Tdm23_Lookup_SelectOrg:179 | [`Tdm23_RoleRelateOrg.java:21`](../../tdm/services/Tdm23_RoleRelateOrg.md) | [`tdm23_role_relate_org.selectByRoleId`](../../tdm/sql/tdm23_role_relate_org.md) |
| `tdm.Tdm40_ManlJob.selectByText` | Tdm40_Lookup_SelectSingle:156, Tdm41_Tab_ManlDutyOrg:280 | [`Tdm40_ManlJob.java:24`](../../tdm/services/Tdm40_ManlJob.md) | [`tdm40_manl_job.selectByText`](../../tdm/sql/tdm40_manl_job.md) |
| `tdm.Tdm41_ManlDuty.changeOrgId2` | Tdm41_Lookup_ChangeOrg_Tmp:152 | [`Tdm41_ManlDuty.java:96`](../../tdm/services/Tdm41_ManlDuty.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`tdm42_manl_org.countLockByRoleId`](../../tdm/sql/tdm42_manl_org.md), [`tdm42_manl_org.deleteByTdm43`](../../tdm/sql/tdm42_manl_org.md), [`tdm42_manl_org.insert`](../../tdm/sql/tdm42_manl_org.md), [`tdm42_manl_org.selectByNewOrgId`](../../tdm/sql/tdm42_manl_org.md), [`tdm43_manl.updateOrgIdByTaskId`](../../tdm/sql/tdm43_manl.md), [`tdm44_manl_duty_org.updateOrgIdByTaskId`](../../tdm/sql/tdm44_manl_duty_org.md) |
| `tdm.Tdm41_ManlDuty.groupByManlJobId` | Tdm41_Tab_ManlDutyOrg:74 | [`Tdm41_ManlDuty.java:52`](../../tdm/services/Tdm41_ManlDuty.md) | [`tdm41_manl_duty.groupByManlJobId`](../../tdm/sql/tdm41_manl_duty.md) |
| `tdm.Tdm41_ManlDuty.selectByTextPaging` | Tdm41_TabPage_ManlDutyOrg:91 | [`Tdm41_ManlDuty.java:33`](../../tdm/services/Tdm41_ManlDuty.md) | [`tdm41_manl_duty.selectByTextPaging`](../../tdm/sql/tdm41_manl_duty.md), [`tdm41_manl_duty.selectByTextPagingTotal`](../../tdm/sql/tdm41_manl_duty.md) |
| `tdm.Tdm41_ManlDuty.selectTaskAndOrg` | Tdm41_Lookup_ChangeOrg_Tmp:124 | [`Tdm41_ManlDuty.java:47`](../../tdm/services/Tdm41_ManlDuty.md) | [`tdm41_manl_duty.selectTaskAndOrg`](../../tdm/sql/tdm41_manl_duty.md) |
| `tdm.Tdm42_ManlOrg.confirmChk` | Tdm41_Tab_ManlDutyOrg:378 | [`Tdm42_ManlOrg.java:60`](../../tdm/services/Tdm42_ManlOrg.md) | [`tdm41_manl_duty.countNullOrgId`](../../tdm/sql/tdm41_manl_duty.md), [`tdm42_manl_org.confirmChk`](../../tdm/sql/tdm42_manl_org.md), [`tdm43_manl.countByManlJobId`](../../tdm/sql/tdm43_manl.md) |
| `tdm.Tdm42_ManlOrg.deleteByManlJobId` | Tdm41_Tab_ManlDutyOrg:446 | [`Tdm42_ManlOrg.java:203`](../../tdm/services/Tdm42_ManlOrg.md) | [`tdm42_manl_org.deleteByManlJobId`](../../tdm/sql/tdm42_manl_org.md), [`tdm43_manl.deleteByManlJobId`](../../tdm/sql/tdm43_manl.md), [`tdm44_manl_duty_org.clearEndYn`](../../tdm/sql/tdm44_manl_duty_org.md) |
| `tdm.Tdm42_ManlOrg.insertManlOrg` | Tdm41_Tab_ManlDutyOrg:425 | [`Tdm42_ManlOrg.java:153`](../../tdm/services/Tdm42_ManlOrg.md) | [`tdm40_manl_job.selectSimpleById`](../../tdm/sql/tdm40_manl_job.md), [`tdm42_manl_org.insertByManlJobId`](../../tdm/sql/tdm42_manl_org.md) |
| `tdm.Tdm44_ManlDutyOrg.delete` | Tdm44_Lookup_ManlDutyOrg:199 | [`Tdm44_ManlDutyOrg.java:63`](../../tdm/services/Tdm44_ManlDutyOrg.md) | `UpdateDataModel(tdm44_manl_duty_org)` 동적 DELETE |
| `tdm.Tdm44_ManlDutyOrg.insert` | Tdm41_TabPage_ManlDutyOrg:324 | [`Tdm44_ManlDutyOrg.java:34`](../../tdm/services/Tdm44_ManlDutyOrg.md) | [`tdm44_manl_duty_org.insert`](../../tdm/sql/tdm44_manl_duty_org.md), [`tdm44_manl_duty_org.insertCheck`](../../tdm/sql/tdm44_manl_duty_org.md) |
| `tdm.Tdm44_ManlDutyOrg.selectByManlDutyId` | Tdm44_Lookup_ManlDutyOrg:238 | [`Tdm44_ManlDutyOrg.java:25`](../../tdm/services/Tdm44_ManlDutyOrg.md) | [`tdm44_manl_duty_org.selectByManlDutyId`](../../tdm/sql/tdm44_manl_duty_org.md) |
| `tdm.Tdm44_ManlDutyOrg.update` | Tdm44_Lookup_ManlDutyOrg:213 | [`Tdm44_ManlDutyOrg.java:58`](../../tdm/services/Tdm44_ManlDutyOrg.md) | `UpdateDataModel(tdm44_manl_duty_org)` 동적 INSERT/UPDATE → [`tdm44_manl_duty_org.selectById`](../../tdm/sql/tdm44_manl_duty_org.md) |

## 테이블

[`tdm09_appr_step`](../../../db/tables/tdm.md), [`tdm10_task`](../../../db/tables/tdm.md), [`tdm11_task_relate_rule`](../../../db/tables/tdm.md), [`tdm12_task_relate_detail`](../../../db/tables/tdm.md), [`tdm13_task_relate_duty`](../../../db/tables/tdm.md), [`tdm14_task_type`](../../../db/tables/tdm.md), [`tdm20_role`](../../../db/tables/tdm.md), [`tdm21_role_relate_task`](../../../db/tables/tdm.md), [`tdm22_role_relate_cncl`](../../../db/tables/tdm.md), [`tdm23_role_relate_org`](../../../db/tables/tdm.md), [`tdm40_manl_job`](../../../db/tables/tdm.md), [`tdm41_manl_duty`](../../../db/tables/tdm.md), [`tdm42_manl_org`](../../../db/tables/tdm.md), [`tdm43_manl`](../../../db/tables/tdm.md), [`tdm44_manl_duty_org`](../../../db/tables/tdm.md), [`tdm51_chck_org`](../../../db/tables/tdm.md), [`tdm52_chck_manl`](../../../db/tables/tdm.md), [`tdm58_chck_appr_step`](../../../db/tables/tdm.md)

## DB 함수

`f_cdnm`, `f_create_seq`, `f_get_tdmorg_id2`, `f_org_nm`, `f_sysdate`, `f_today`, `getorg`, `gettdm30roleallc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Tdm41_Tab_ManlDutyOrg (`client/vi/tdm/Tdm41_Tab_ManlDutyOrg.java`, 515줄)

- 레이아웃: north=vlc, center=tabPage
- 툴바 `buttonBar01`: 매뉴얼작업: {manlJobLookup} 직책: {roleLookup} 책무: {taskLookup} {retrieveButton} {confirmButton} {cancelButton} {changeOrgButton}
- 입력·하위 화면: `manlJobLookup` LookupTriggerField 빈칸="필수선택입니다", `roleLookup` LookupTriggerField 빈칸="전체", `taskLookup` LookupTriggerField 빈칸="전체", `tabPage` Tdm41_TabPage_ManlDutyOrg("Loading", "manlJobId", "roleId", "tdm.Tdm41_ManlDuty.groupByManlJobId"), `lookup` Tdm40_Lookup_SelectSingle
- 그리드 `grid` (buildGrid()):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - roleName 250 "직책" Text
  - taskCnt 120 "전체" LongCnt 편집:"#404040"
  - taskIndvCnt 120 "개별" LongCnt 편집:"#404040"
  - taskCommonCnt 120 "공통" LongCnt 편집:"#404040"
  - taskCeoCnt 120 "CEO" LongCnt 편집:"#404040"
  - taskRelateDetailCnt 120 "책무세부건수" LongCnt 편집:"#404040"
  - taskRelateDutyCnt 120 "관리의무건수" LongCnt 편집:"#404040"
  - taskRelateDutyNoneCnt 120 "부서미등록<br>관리의무건수" LongCnt 편집:"#DD5E5E"

#### 이벤트
[E0] 화면 열림 (생성자 L83-127) → settings()
[E1] manlJobLookup.TriggerClick [result != null] (L137) → execute(), retrieve()
[E2] roleLookup.TriggerClick [result != null] (L158) → execute(), retrieve()
[E3] taskLookup.TriggerClick [result != null] (L181) → execute(), retrieve()
[E4] retrieveButton[조회].Select (L201) → retrieve()
[E5] confirmButton[확정].Select [YES] (L207) → confirmChk()
       └ [E11] msgBox.DialogHide [YES] (L396) → confirm(), cancel()
[E6] msgBox.DialogHide [YES] (L217) → confirmChk()
[E7] cancelButton[확정취소].Select [YES] (L234) → confirmChk()
[E8] msgBox.DialogHide [YES] (L244) → confirmChk()
[E9] changeOrgButton[점검항목 부서변경].Select (L262) → lookupChangeOrg()
[E10] grid.RowClick (L269) → retrieveTabPage()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public execute() | L68-80 | E1,E2,E3,autoRetrieve,retrieve,lookupChangeOrg | 서비스 tdm.Tdm41_ManlDuty.groupByManlJobId(manlJobId, roleId) | 업무 |
| private autoRetrieve() | L279-314 | settings | 조회창 Tdm40_Lookup_SelectSingle 열기, 서비스 tdm.Tdm40_ManlJob.selectByText(companyId, orgId, searchText, writingYn, checkYn) | 업무 |
| private retrieve() | L344-366 | E1,E2,E3,E4,autoRetrieve,lookupChangeOrg | 서비스 tdm.Tdm41_ManlDuty.groupByManlJobId(manlJobId, roleId, taskId) | 업무 |
| private retrieveTabPage() | L368-375 | E10,retrieve | 상태 처리 | 업무 |
| private confirmChk() | L377-422 | E5,E6,E7,E8 | ConfirmBox → E11 | 업무 |
| private confirm() | L424-443 | E11,confirmChk | 서비스 tdm.Tdm42_ManlOrg.insertManlOrg(manlJobId, companyId, empId, updName) | 업무 |
| private cancel() | L445-462 | E11,confirmChk | 서비스 tdm.Tdm42_ManlOrg.deleteByManlJobId(manlJobId, updName) | 업무 |
| private lookupChangeOrg() | L464-477 | E9 | 조회창 Tdm41_Lookup_ChangeOrg_Tmp 열기 | 업무 |
| private settings() | L129-277 | 생성자 | 조회창 Tdm40_Lookup_SelectSingle 열기, 조회창 Tdm20_Lookup_SelectRole 열기, 조회창 Tdm10_Lookup_SelectSingle 열기, 확인창 표시, 이벤트 연결, 초기값: manlJobLookup=resultModel.getJobName(, roleLookup=resultModel.getRoleName(, roleLookup=null, taskLookup=resultModel.getTaskName(, taskLookup=null | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L316-342 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L512-514 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L328 newHeaderGroupMap02newHeaderGroupConfig14 100 "책무건수" (tdm41_new_header_group_map02new_header_group_config14 컬럼 없음)
  gb.text('roleNm', 250, '직책'),  // L330 SQL 계산 컬럼(groupByManlJobId: tdm20_role_nm)
  // ⚠ 대응 없음 (GridBuilder L331) addLongCnt
  // ⚠ 대응 없음 (GridBuilder L332) addLongCnt
  // ⚠ 대응 없음 (GridBuilder L333) addLongCnt
  // ⚠ 대응 없음 (GridBuilder L334) addLongCnt
  // ⚠ 대응 없음 (GridBuilder L335) addLongCnt
  // ⚠ 대응 없음 (GridBuilder L336) addLongCnt
  // ⚠ 대응 없음 (GridBuilder L337) addLongCnt
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirmChk}>확정</Button>
3. <Button type="cancel" onClick={confirmChk}>확정취소</Button>
4. <Button type="unknown" onClick={lookupChangeOrg}>점검항목 부서변경</Button>

### Tdm41_TabPage_ManlDutyOrg (`client/vi/tdm/Tdm41_TabPage_ManlDutyOrg.java`, 385줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: {searchText} {unRegYn} {selectAllButton} {selectNoneButton} {selectOrgButton}
- 입력·하위 화면: `searchText` TextField 빈칸="책무/책무세부/담당부서", `unRegYn` CheckBox, `orgSearch` Tdm23_Lookup_SelectOrg, `lookup` Tdm44_Lookup_ManlDutyOrg

#### 이벤트
[E0] 화면 열림 (생성자 L72-102) → settings(), retrieve()
[E1] searchText.KeyPress [Enter] (L110) → retrieve()
[E2] unRegYn[미지정만 보기].Change (L126) → retrieve()
[E3] retrieveButton[조회].Select [manlJobId == null] (L133) → retrieve()
[E4] selectAllButton[전체선택].Select (L144) → 인라인 L144-151 (new SelectHandler() { @Override publi…)
[E5] selectNoneButton[전체해제].Select (L152) → 인라인 L152-159 (new SelectHandler() { @Override publi…)
[E6] selectOrgButton[부서일괄지정].Select [YES] (L160) → updateOrgCodeId()
[E7] msgBox.DialogHide [YES] (L204) → updateOrgCodeId()
[E8] grid.RowClick [selectModel.getSelectYn()] (L242) → 인라인 L242-260 (new RowClickHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private lookupOrg() | L302-321 | buildGrid | 조회창 Tdm44_Lookup_ManlDutyOrg 열기 | 업무 |
| private updateOrgCodeId() | L323-336 | E6,E7 | 서비스 tdm.Tdm44_ManlDutyOrg.insert(orgList, manlDutyList, updName) | 업무 |
| public retrieve() | L353-359 | 생성자,E1,E2,E3,lookupOrg,updateOrgCodeId | 상태 처리 | 업무 |
| private retrieve() | L361-380 | 생성자,E1,E2,E3,lookupOrg,updateOrgCodeId | 상태 처리 | 업무 |
| private settings() | L104-261 | 생성자 | 조회창 Tdm23_Lookup_SelectOrg 열기, 확인창 표시, 이벤트 연결, 초기값: unRegYn=false("미지정만 보기") | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L263-300 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlCheckBoxLabelStyle() | L382-384 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="addRow" onClick={() => /* 인라인 L144-151 (new SelectHandler() { @Override publi…) */}>전체선택</Button>
2. <Button type="removeRow" onClick={() => /* 인라인 L152-159 (new SelectHandler() { @Override publi…) */}>전체해제</Button>
3. <Button type="save" onClick={updateOrgCodeId}>부서일괄지정</Button>
4. <Button type="search" onClick={retrieve}>조회</Button>

### Tdm44_Lookup_ManlDutyOrg (`client/vi/tdm/Tdm44_Lookup_ManlDutyOrg.java`, 251줄)

- 툴바 `buttonBar`: {hlc}
- 입력·하위 화면: `orgSearch` Tdm23_Lookup_SelectOrg
- 그리드 `grid` (grid(), 체크박스(다중)):
  - orgName 300 "부서" Text

#### 이벤트
[E0] 화면 열림 (생성자 L68-105) → settings(), show()
[E1] anchor.MouseDown (L79) → retrieve()
[E2] insertButton[행 추가].Select (L108) → insertRow()
[E3] deleteButton[행 삭제].Select (L114) → deleteRow()
[E4] updateButton[저장].Select (L120) → update()
[E5] closeButton[닫기].Select (L126) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L61-66 | 공개 메서드 | 상태 처리 | 업무 |
| private grid() | L134-140 | 필드 초기화 | 상태 처리 | 업무 |
| private openLookupOrgInfo() | L142-178 | insertRow | 조회창 Tdm23_Lookup_SelectOrg 열기 | 업무 |
| private insertRow() | L180-183 | E2 | 상태 처리 | 업무 |
| private update() | L185-222 | E4 | GridDeleteData tdm.Tdm44_ManlDutyOrg.delete, tdm.Tdm44_ManlDutyOrg.update | 업무 |
| private deleteRow() | L224-230 | E3 | 상태 처리 | 업무 |
| private retrieve() | L232-245 | E1,open,update | 서비스 tdm.Tdm44_ManlDutyOrg.selectByManlDutyId(manlDutyId) | 업무 |
| private settings() | L107-132 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlHeaderStyle() | L247-249 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const grid = () => [
  gb.text('orgNm', 300, '부서'),  // L137 SQL 계산 컬럼(selectByManlDutyId: f_org_nm(tdm44_org_id, f_sysdate()))
];
```

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>
3. <Button type="addRow" onClick={insertRow}>행 추가</Button>
4. <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>

### Tdm23_Lookup_SelectOrg (`client/vi/tdm/Tdm23_Lookup_SelectOrg.java`, 213줄)

- 툴바 `searchBar`: 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `searchText` TextField 빈칸="담당부서"
- 그리드 `grid` (buildGrid(), 체크박스(다중), 체크박스):
  - orgCode 100 "부서코드" TextCenter
  - orgName 270 "부서명" Text

#### 이벤트
[E0] 화면 열림 (생성자 L53-58) → 초기화
[E1] searchText.KeyPress [Enter] (L104) → retrieve()
[E2] grid.CellDoubleClick (L114) → confirm()
[E3] retrieveButton[조회].Select (L121) → retrieve()
[E4] oKButton[확인].Select (L127) → confirm()
[E5] nullButton[선택안함].Select [callback != null] (L133) → hide()
[E6] cancelButton[닫기].Select (L142) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public openTdm09() | L60-63 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L65-68 | openTdm09 | 상태 처리 | 업무 |
| public open() | L70-97 | openTdm09 | 상태 처리 | 업무 |
| private setting() | L99-148 | open | 상태 처리 | 업무 |
| public retrieve() | L166-185 | E1,E3,open | 서비스 tdm.Tdm23_RoleRelateOrg.selectByRoleId(companyId, roleId, stdDate, searchText, tdm09Yn) | 업무 |
| public confirm() | L187-203 | E2,E4 | 미선택 시 alert "담당부서를 선택하세요" | 업무 |
| private buildGrid() | L150-164 | setting | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L205-207 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L209-211 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('orgCd', 100, '부서코드'),  // L160 SQL 계산 컬럼(selectByRoleId: org00_org_cd)
  gb.text('orgNm', 270, '부서명'),  // L161 SQL 계산 컬럼(selectByRoleId: org00_kor_nm)
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="unknown" onClick={hide}>선택안함</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

### Tdm41_Lookup_ChangeOrg_Tmp (`client/vi/tdm/Tdm41_Lookup_ChangeOrg_Tmp.java`, 188줄)

- 툴바 `buttonBar`: {retrieveButton} {updateButton}
- 입력·하위 화면: `orgSearch` Tdm23_Lookup_SelectOrg
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - taskName 350 "책무" Text
  - taskRelateDutyCnt 100 "관리의무 건수" LongCenter
  - orgName 250 "담당부서" Text

#### 이벤트
[E0] 화면 열림 (생성자 L59-81) → settings(), show()
[E1] retrieveButton[조회].Select (L84) → retrieve()
[E2] updateButton[부서변경].Select (L90) → changeOrg()
       └ [E4] msgBox.DialogHide [YES] (L147) → retrieve()
[E3] closeButton[닫기].Select [callback != null] (L96) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L51-57 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L118-130 | E1,E4,open | 서비스 tdm.Tdm41_ManlDuty.selectTaskAndOrg(manlJobId, roleId) | 업무 |
| private changeOrg() | L132-183 | E2 | 조회창 Tdm23_Lookup_SelectOrg 열기, 미선택 시 alert "변경대상을 선택하세요" → 확인창 E4 | 업무 |
| private settings() | L83-105 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L107-116 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L185-187 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('taskNm', 350, '책무'),  // L111 SQL 계산 컬럼(selectTaskAndOrg: tdm10_task_nm)
  gb.longCenter('taskRelateDutyCnt', 100, '관리의무 건수'),  // L112 SQL 계산 컬럼(selectTaskAndOrg: COUNT(*))
  gb.text('orgNm', 250, '담당부서'),  // L113 SQL 계산 컬럼(selectTaskAndOrg: org00_kor_nm)
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="unknown" onClick={changeOrg}>부서변경</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

### Tdm40_Lookup_SelectSingle (`client/vi/tdm/Tdm40_Lookup_SelectSingle.java`, 185줄)

- 툴바 `buttonBar`: 검색: {searchText} {writingYn} {retrieveButton}
- 입력·하위 화면: `searchText` TextField 빈칸="매뉴얼작업명/직책", `writingYn` CheckBox
- 그리드 `grid` (buildGrid(), 체크박스):
  - jobName 300 "매뉴얼작업명" Text
  - roleName 200 "직책" Text
  - manlApplyStartDate 100 "매뉴얼<br>적용시작일" Date
  - startDate 100 "작성시작일" Date
  - endDate 100 "작성마감일" Date
  - dutyCntStr 100 "작성현황" TextCenter
  - dutyEndYn 90 "완료여부" BooleanYn2
  - dutyEndDate 100 "완료일" Date

#### 이벤트
[E0] 화면 열림 (생성자 L64-91) → settings(), show()
[E1] searchText.KeyPress [Enter] (L96) → retrieve()
[E2] grid.CellDoubleClick (L106) → confirm()
[E3] retrieveButton[조회].Select (L112) → retrieve()
[E4] updateButton[확인].Select (L118) → confirm()
[E5] closeButton[닫기].Select (L124) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L52-62 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L147-162 | E1,E3,open | 서비스 tdm.Tdm40_ManlJob.selectByText(companyId, orgId, searchText, writingYn, checkYn) | 업무 |
| public confirm() | L164-172 | E2,E4 | 미선택 시 alert "선택된 매뉴얼이 없습니다" | 업무 |
| private settings() | L93-130 | 생성자 | 이벤트 연결, 초기값: writingYn=true("작성중만 조회") | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L132-145 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L174-176 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L178-180 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L182-184 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('jobNm', 300, '매뉴얼작업명'),  // L135
  gb.text('roleNm', 200, '직책'),  // L136 SQL 계산 컬럼(selectByText: tdm20_role_nm)
  gb.date('manlApplyStartDate', 100, '매뉴얼<br>적용시작일'),  // L137
  gb.date('startDate', 100, '작성시작일'),  // L138
  gb.date('endDate', 100, '작성마감일'),  // L139
  gb.textCenter('dutyCntStr', 100, '작성현황'),  // L140 SQL 계산 컬럼(selectByText: CASE WHEN tdm41_manl_job_id IS NULL THE…)
  gb.booleanYn2('dutyEndYn', 90, '완료여부'),  // L141 SQL 계산 컬럼(selectByText: CASE WHEN tdm41_end_cnt = tdm41_org_cnt…)
  gb.date('dutyEndDate', 100, '완료일'),  // L142 SQL 계산 컬럼(selectByText: CASE WHEN tdm41_end_cnt = tdm41_org_cnt…)
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

### Tdm20_Lookup_SelectRole (`client/vi/tdm/Tdm20_Lookup_SelectRole.java`, 225줄)

- 툴바 `buttonBar`: 기준일: {baseDate} 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `baseDate` MyDateField, `searchText` TextField 빈칸="직책"
- 그리드 `grid` (buildGrid(), 체크박스):
  - roleName 420 "직책" Text

#### 이벤트
[E0] 화면 열림 (생성자 L60-65) → 초기화
[E1] searchText.KeyPress [Enter] (L130) → retrieve()
[E2] grid.CellDoubleClick (L138) → confirm()
[E3] retrieveButton[조회].Select (L144) → retrieve()
[E4] updateButton[확인].Select (L150) → confirm()
[E5] closeButton[닫기].Select (L156) → hide()
[E6] allButton[전체].Select (L162) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public openAll() | L67-70 | 공개 메서드 | 상태 처리 | 업무 |
| public openAll() | L72-78 | 공개 메서드 | 상태 처리 | 업무 |
| public openTarget() | L80-88 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L90-120 | openAll,openTarget | 상태 처리 | 업무 |
| public retrieve() | L179-206 | E1,E3,open | 서비스 tdm.Tdm20_Role.selectCheckTargetRole, tdm.Tdm20_Role.selectByDate(companyId, searchText, checkYm, personId, baseDate, orgId) | 업무 |
| public confirm() | L208-216 | E2,E4 | 미선택 시 alert "선택된 직책이 없습니다" | 업무 |
| private settings() | L122-169 | open | 이벤트 연결, 초기값: baseDate=stdDate | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L171-177 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L218-220 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L222-224 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('roleNm', 420, '직책'),  // L174
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>
4. <Button type="unknown" onClick={hide}>전체</Button>

### Tdm10_Lookup_SelectSingle (`client/vi/tdm/Tdm10_Lookup_SelectSingle.java`, 203줄)

- 툴바 `buttonBar`: 기준일: {baseDate} 책무구분: {taskClassComboBox} 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `baseDate` MyDateField, `searchText` TextField 빈칸="책무유형/책무", `taskClassComboBox` ComboBoxField("TdmTaskClassCode", "%", "전체", "전체")
- 그리드 `grid` (buildGrid(), 체크박스):
  - taskClassName 120 "책무구분" Text
  - taskName 550 "책무" Text

#### 이벤트
[E0] 화면 열림 (생성자 L66-98) → settings(), show()
[E1] taskClassComboBox[TdmTaskClassCode].Collapse (L107) → retrieve()
[E2] searchText.KeyPress [Enter] (L116) → retrieve()
[E3] grid.CellDoubleClick (L124) → confirm()
[E4] retrieveButton[조회].Select (L130) → retrieve()
[E5] confirmButton[확인].Select (L136) → confirm()
[E6] allButton[전체].Select [callback != null] (L142) → hide()
[E7] closeButton[닫기].Select (L151) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public execute() | L48-51 | retrieve | 상태 처리 | 업무 |
| public open() | L61-64 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L168-182 | E1,E2,E4,execute,open | 서비스 tdm.Tdm10_Task.selectByText(companyId, baseDate, taskClassCode, searchText) | 업무 |
| public confirm() | L184-194 | E3,E5 | 미선택 시 alert "선택된 책무가 없습니다" | 업무 |
| private settings() | L100-157 | 생성자 | 이벤트 연결, 초기값: baseDate=LoginUser.getToday( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L159-166 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L196-198 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L200-202 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('taskClassNm', 120, '책무구분'),  // L162
  gb.text('taskNm', 550, '책무'),  // L163
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="unknown" onClick={hide}>전체</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

