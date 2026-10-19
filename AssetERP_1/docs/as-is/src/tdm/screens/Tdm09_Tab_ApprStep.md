# Tdm09_Tab_ApprStep

- 종류: 화면
- 메뉴: 책무 > 01. 기본정보 > 직책별 부서승인선 등록 (#1463)
- 파일: `client/vi/tdm/Tdm09_Tab_ApprStep.java`
- 함께 쓰는 클래스 2개:
  - `Tdm23_Lookup_SelectOrg` `client/vi/tdm/Tdm23_Lookup_SelectOrg.java`
  - `Tdm20_Lookup_SelectRole` `client/vi/tdm/Tdm20_Lookup_SelectRole.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Emp01_Lookup_PersonModel`](../../emp/components/Emp01_Lookup_PersonModel.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `tdm.Tdm09_ApprStep.delete` | Tdm09_Tab_ApprStep:427 | [`Tdm09_ApprStep.java:94`](../../tdm/services/Tdm09_ApprStep.md) | `UpdateDataModel(tdm09_appr_step)` 동적 DELETE |
| `tdm.Tdm09_ApprStep.deleteByParentId` | Tdm09_Tab_ApprStep:394 | [`Tdm09_ApprStep.java:85`](../../tdm/services/Tdm09_ApprStep.md) | [`tdm09_appr_step.deleteByParentId`](../../tdm/sql/tdm09_appr_step.md), `UpdateDataModel(tdm09_appr_step)` 동적 DELETE |
| `tdm.Tdm09_ApprStep.inUpdateData` | Tdm09_Tab_ApprStep:367 | [`Tdm09_ApprStep.java:40`](../../tdm/services/Tdm09_ApprStep.md) | [`tdm09_appr_step.modelUpsert`](../../tdm/sql/tdm09_appr_step.md) |
| `tdm.Tdm09_ApprStep.modelUpdate` | Tdm09_Tab_ApprStep:462 | [`Tdm09_ApprStep.java:62`](../../tdm/services/Tdm09_ApprStep.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(tdm09_appr_step)` 동적 INSERT/UPDATE → [`tdm09_appr_step.selectById`](../../tdm/sql/tdm09_appr_step.md) |
| `tdm.Tdm09_ApprStep.selectByCompanyId` | Tdm09_Tab_ApprStep:293 | [`Tdm09_ApprStep.java:25`](../../tdm/services/Tdm09_ApprStep.md) | [`tdm09_appr_step.selectByCompanyId`](../../tdm/sql/tdm09_appr_step.md) |
| `tdm.Tdm09_ApprStep.selectByParentId` | Tdm09_Tab_ApprStep:317 | [`Tdm09_ApprStep.java:30`](../../tdm/services/Tdm09_ApprStep.md) | [`tdm09_appr_step.selectByParentId`](../../tdm/sql/tdm09_appr_step.md) |
| `tdm.Tdm09_ApprStep.update` | Tdm09_Tab_ApprStep:344 | [`Tdm09_ApprStep.java:75`](../../tdm/services/Tdm09_ApprStep.md) | [`tdm09_appr_step.updateByParentId`](../../tdm/sql/tdm09_appr_step.md), `UpdateDataModel(tdm09_appr_step)` 동적 INSERT/UPDATE → [`tdm09_appr_step.selectById`](../../tdm/sql/tdm09_appr_step.md) |
| `tdm.Tdm20_Role.selectByDate` | Tdm20_Lookup_SelectRole:193 | [`Tdm20_Role.java:33`](../../tdm/services/Tdm20_Role.md) | [`tdm20_role.selectByDate`](../../tdm/sql/tdm20_role.md) |
| `tdm.Tdm20_Role.selectCheckTargetRole` | Tdm20_Lookup_SelectRole:188 | [`Tdm20_Role.java:38`](../../tdm/services/Tdm20_Role.md) | [`tdm20_role.selectCheckTargetRole`](../../tdm/sql/tdm20_role.md) |
| `tdm.Tdm23_RoleRelateOrg.selectByRoleId` | Tdm23_Lookup_SelectOrg:179 | [`Tdm23_RoleRelateOrg.java:21`](../../tdm/services/Tdm23_RoleRelateOrg.md) | [`tdm23_role_relate_org.selectByRoleId`](../../tdm/sql/tdm23_role_relate_org.md) |

## 테이블

[`emp01_person`](../../../db/tables/emp.md), [`tdm08_manager_info`](../../../db/tables/tdm.md), [`tdm09_appr_step`](../../../db/tables/tdm.md), [`tdm20_role`](../../../db/tables/tdm.md), [`tdm21_role_relate_task`](../../../db/tables/tdm.md), [`tdm22_role_relate_cncl`](../../../db/tables/tdm.md), [`tdm23_role_relate_org`](../../../db/tables/tdm.md), [`tdm51_chck_org`](../../../db/tables/tdm.md), [`tdm52_chck_manl`](../../../db/tables/tdm.md), [`tdm58_chck_appr_step`](../../../db/tables/tdm.md)

## DB 함수

`f_cdnm`, `f_create_seq`, `f_emp_kor_nm`, `f_sysdate`, `f_today`, `getorg`, `getperson`, `gettdm30roleallc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Tdm09_Tab_ApprStep (`client/vi/tdm/Tdm09_Tab_ApprStep.java`, 562줄)

- 레이아웃: west=westVlc, center=centerVlc
- 툴바 `buttonBarL`: {searchText} {retrieveButton} {insertButton} {updateButton} {deleteButton}
- 툴바 `buttonBarR`: {insertStepButton} {anchor}
- 입력·하위 화면: `searchText` TextField 빈칸="검색어(직책/부서/담당자)를 입력하세요", `lookup01` LookupTriggerField, `lookup` Tdm20_Lookup_SelectRole, `lookup02` LookupTriggerField, `popup` Emp01_Lookup_PersonModel
- 그리드 `grid` (buildGrid(), 체크박스):
  - roleName 200 "책무직책" Text 편집:lookup01
  - exctName 100 "책무임원" TextCenter
  - orgName 150 "책무이행점검<br>수행부서" Text 편집:lookup02
  - managerName 100 "부서책무<br>담당자" TextCenter
- 그리드 `stepGrid` (stepBuildGrid(), 행번호숨김):
  - apprStepInfo 120 "구분" TextCenter
  - apprEmpName 100 "승인자" TextCenter
  - posName 100 "직위" TextCenter
  - apprOrgName 150 "부서명" TextCenter
  - actionCell 70 "위로" Cell 편집:upButton
  - actionCell 70 "아래로" Cell 편집:downButton
  - actionCell 70 "삭제" Cell 편집:deleteButton

#### 이벤트
[E0] 화면 열림 (생성자 L79-128) → settings(), retrieve()
[E1] anchor.MouseDown (L95) → retrieveStep()
[E2] searchText.KeyPress [Enter] (L133) → retrieve()
[E3] retrieveButton[조회].Select (L142) → retrieve()
[E4] insertButton[등록].Select (L148) → insert()
[E5] updateButton[저장].Select (L154) → update()
[E6] deleteButton[삭제].Select [YES] (L160) → delete()
[E7] msgBox.DialogHide [YES] (L169) → delete()
[E8] insertStepButton[등록].Select [selectModel == null] (L186) → openLookupEmpInfo()
[E9] grid.SelectionChanged [선택>0] (L199) → retrieveStep()
[E10] lookup01.TriggerClick (L215) → 인라인 L215-229 (new TriggerClickHandler(){ @Override …)
[E11] lookup02.TriggerClick (L233) → lookupOrgCode()
[E12] msgBox.DialogHide [YES] (L405) → deleteStep()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public stepBuildGrid() | L250-283 | 필드 초기화 | 상태 처리 | 업무 |
| public retrieve() | L285-302 | 생성자,E2,E3,update,delete | 서비스 tdm.Tdm09_ApprStep.selectByCompanyId(companyId, typeCode, searchText) | 업무 |
| private retrieveStep() | L304-323 | E1,E9,deleteStep,openLookupEmpInfo | 서비스 tdm.Tdm09_ApprStep.selectByParentId(companyId, apprStepId, typeCode) | 업무 |
| private update() | L325-350 | E5,changeRow | 서비스 tdm.Tdm09_ApprStep.update | 업무 |
| private update() | L352-379 | E5,changeRow | 서비스 tdm.Tdm09_ApprStep.inUpdateData | 업무 |
| private insert() | L381-388 | E4 | 상태 처리 | 업무 |
| private delete() | L390-400 | E6,E7 | GridDeleteData tdm.Tdm09_ApprStep.deleteByParentId(체크된 행 목록) | 업무 |
| private deleteStepChk() | L402-421 | changeRow | 확인창 표시 | 업무 |
| private deleteStep() | L423-433 | E12 | GridDeleteData tdm.Tdm09_ApprStep.delete(체크된 행 목록) | 업무 |
| private openLookupEmpInfo() | L435-474 | E8 | 조회창 Emp01_Lookup_PersonModel 열기, 서비스 tdm.Tdm09_ApprStep.modelUpdate | 업무 |
| private lookupOrgCode() | L476-516 | E11 | 조회창 Tdm23_Lookup_SelectOrg 열기, 미선택 시 alert "책무직책을 먼저 선택하세요" | 업무 |
| private changeRow() | L518-552 | stepBuildGrid | 상태 처리 | 업무 |
| private getSeq() | L554-559 | changeRow | 상태 처리 | 업무 |
| private settings() | L130-207 | 생성자 | 확인창 표시, 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L209-248 | 필드 초기화 | 조회창 Tdm20_Lookup_SelectRole 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('roleNm', 200, '책무직책'),  // L242 SQL 계산 컬럼(selectByCompanyId: (SELECT tdm20_role_nm FROM tdm20_role W…)
  gb.textCenter('exctNm', 100, '책무임원'),  // L243 SQL 계산 컬럼(selectByCompanyId: emp01_kor_nm)
  gb.text('orgNm', 150, '책무이행점검<br>수행부서'),  // L244 SQL 계산 컬럼(selectByCompanyId: org00_kor_nm)
  gb.textCenter('managerNm', 100, '부서책무<br>담당자'),  // L245 SQL 계산 컬럼(selectByCompanyId: (SELECT f_emp_kor_nm(tdm08_person_id) F…)
];

const stepBuildGrid = () => [
  gb.textCenter('apprStepInfo', 120, '구분'),  // L274 SQL 계산 컬럼(selectByParentId: ROW_NUMBER() OVER(ORDER BY tdm09_appr_s…)
  gb.textCenter('apprEmpNm', 100, '승인자'),  // L275 SQL 계산 컬럼(selectByParentId: emp00_kor_nm)
  gb.textCenter('posNm', 100, '직위'),  // L276 SQL 계산 컬럼(selectByParentId: f_cdnm('EmpPosCode', emp00_pos_cd, tdm0…)
  gb.textCenter('apprOrgNm', 150, '부서명'),  // L277 SQL 계산 컬럼(selectByParentId: emp00_org_code_nm)
  // ⚠ 대응 없음 (GridBuilder L278) addCell
  // ⚠ 대응 없음 (GridBuilder L279) addCell
  // ⚠ 대응 없음 (GridBuilder L280) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insert}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={delete}>삭제</Button>
5. <Button type="register" onClick={openLookupEmpInfo}>등록</Button>

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

