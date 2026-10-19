# Org01_Tab_OrgCode

- 종류: 화면
- 메뉴: 경영관리 > 01. 조직 및 사원관리 > 조직정보 등록 (#1028)
- 메뉴: 기본정보 > 기본정보 > 조직정보 등록 (#1451)
- 파일: `client/vi/org/Org01_Tab_OrgCode.java`
- 함께 쓰는 클래스 4개:
  - `Org02_Lookup_OrgInfo` `client/vi/org/Org02_Lookup_OrgInfo.java`
  - `Org02_Edit_Info` `client/vi/org/Org02_Edit_Info.java`
  - `Org01_Move_OrgCode` `client/vi/org/Org01_Move_OrgCode.java`
  - `Org01_Edit_OrgCode` `client/vi/org/Org01_Edit_OrgCode.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Org02_View_Chart`](../../org/components/Org02_View_Chart.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `org.Org01_Code.delete` | Org01_Edit_OrgCode:350, Org02_Edit_Info:228 | [`Org01_Code.java:169`](../../org/services/Org01_Code.md) | [`org01_code.selectByBaseDate`](../../org/sql/org01_code.md), [`org02_info.selectCountByCodeId`](../../org/sql/org02_info.md), `UpdateDataModel(org02_info)` 동적 DELETE, `UpdateDataModel(org01_code)` 동적 DELETE |
| `org.Org01_Code.selectByCompanyId` | Org01_Move_OrgCode:82, Org01_Tab_OrgCode:163 | [`Org01_Code.java:64`](../../org/services/Org01_Code.md) | [`org01_code.selectByParentId_1Bang`](../../org/sql/org01_code.md) |
| `org.Org01_Code.update` | Org01_Edit_OrgCode:320, Org02_Edit_Info:245 | [`Org01_Code.java:106`](../../org/services/Org01_Code.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`org01_code.selectByBaseDate`](../../org/sql/org01_code.md), [`org02_info.selectById`](../../org/sql/org02_info.md), `UpdateDataModel(org02_info)` 동적 INSERT/UPDATE → [`org02_info.selectById`](../../org/sql/org02_info.md), `UpdateDataModel(org01_code)` 동적 INSERT/UPDATE → [`org01_code.selectById`](../../org/sql/org01_code.md) |
| `org.Org02_Info.delete` | Org02_Lookup_OrgInfo:247 | [`Org02_Info.java:65`](../../org/services/Org02_Info.md) | `UpdateDataModel(org02_info)` 동적 DELETE |
| `org.Org02_Info.deleteCheck` | Org02_Lookup_OrgInfo:157 | [`Org02_Info.java:31`](../../org/services/Org02_Info.md) | [`emp03_trans.deleteOrgCheck`](../../emp/sql/emp03_trans.md), [`org01_code.checkUseOrgId`](../../org/sql/org01_code.md), [`org02_info.deleteOrgCheck`](../../org/sql/org02_info.md) |
| `org.Org02_Info.deleteOrg` | Org02_Lookup_OrgInfo:204 | [`Org02_Info.java:52`](../../org/services/Org02_Info.md) | [`org01_code.deleteOrg`](../../org/sql/org01_code.md), [`org02_info.deleteOrg`](../../org/sql/org02_info.md) |
| `org.Org02_Info.selectByOnlyOrgCodeId` | Org02_Lookup_OrgInfo:141 | [`Org02_Info.java:20`](../../org/services/Org02_Info.md) | [`org02_info.selectByOnlyOrgCodeId`](../../org/sql/org02_info.md) |
| `sys.Sys01_Company.selectById` | Org01_Edit_OrgCode:116, Org02_Edit_Info:188 | [`Sys01_Company.java:20`](../../sys/services/Sys01_Company.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys01_company.selectById`](../../sys/sql/sys01_company.md), [`sys01_company.updateMainImageId`](../../sys/sql/sys01_company.md) |

## 테이블

[`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys01_company`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_emp_kor_nm`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`, `f_today`, `f_trunc`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Org01_Tab_OrgCode (`client/vi/org/Org01_Tab_OrgCode.java`, 275줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 기준일: {baseDate} {retrieveButton} {addSubMenu} {viewOrgChart}
- 입력·하위 화면: `baseDate` MyDateField, `editOrgCode` Org01_Edit_OrgCode, `lookupOrgInfo` Org02_Lookup_OrgInfo
- 그리드 `treeGrid` (buildTreeGrid(), 트리):
  - korName 450 "조직명" Text
  - orgCode 80 "조직코드" TextCenter
  - levelName 100 "조직구분" Text
  - orgHeadList 120 "조직 장" Text
  - tdmYn 80 "책무점검" BooleanYn2
  - sortOrder 80 "조회순서" TextCenter
  - modDate 100 "최근변경일" Date
  - actionCell 50 "수정" Cell 편집:editOrgInfoCell
  - modReason 250 "변경사유" Text
  - openDate 100 "개설일" Date
  - closeDate 100 "폐쇄일" Date

#### 이벤트
[E0] 화면 열림 (생성자 L68-123) → retrieve()
[E1] retrieveButton[조회].Select (L76) → retrieve()
[E2] addSubMenu[하위조직등록].Select (L93) → insertChild()
[E3] viewOrgChart[조직도보기].Select (L103) → viewOrgChart()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| protected viewOrgChart() | L125-133 | E3 | 상태 처리 | 업무 |
| public buildTreeGrid() | L135-160 | 필드 초기화 | 상태 처리 | 업무 |
| private retrieve() | L162-168 | 생성자,E1,insertOrgCode,editOrgCode | 서비스 org.Org01_Code.selectByCompanyId | 업무 |
| private addChildItem() | L170-180 | getServiceResult | 상태 처리 | 업무 |
| private insertOrgCode() | L182-214 | insertChild | 팝업 Org01_Edit_OrgCode 열기 | 업무 |
| private insertChild() | L216-227 | E2 | 미선택 시 alert "먼저 상위 조직을 선택해주세요" | 업무 |
| private editOrgCode() | L229-240 | buildTreeGrid | 조회창 Org02_Lookup_OrgInfo 열기 | 업무 |
| public getServiceResult() | L243-269 | 공개 메서드 | 상태 처리 | 업무 |
| private setHtmlBarStyle() | L271-273 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildTreeGrid = () => [
  gb.text('korNm', 450, '조직명'),  // L147
  gb.textCenter('orgCd', 80, '조직코드'),  // L148
  gb.text('levelNm', 100, '조직구분'),  // L149
  gb.text('orgHeadList', 120, '조직 장'),  // L150 SQL 계산 컬럼(selectByParentId_1Bang: ( SELECT ARRAY_TO_STRING(ARRAY_AGG(f_em…)
  gb.booleanYn2('tdmYn', 80, '책무점검'),  // L151
  gb.textCenter('sortOrder', 80, '조회순서'),  // L152
  gb.date('modDate', 100, '최근변경일'),  // L153
  // ⚠ 대응 없음 (GridBuilder L154) addCell
  gb.text('modReason', 250, '변경사유'),  // L155
  gb.date('openDate', 100, '개설일'),  // L156
  gb.date('closeDate', 100, '폐쇄일'),  // L157
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertChild}>하위조직등록</Button>
3. <Button type="org" onClick={viewOrgChart}>조직도보기</Button>

### Org02_Lookup_OrgInfo (`client/vi/org/Org02_Lookup_OrgInfo.java`, 258줄)

- 입력·하위 화면: `editOrgCode` Org02_Edit_Info
- 그리드 `grid` (buildGrid()):
  - modDate 100 "개설(변경)일" Date
  - korName 300 "조직(부서)명" Text

#### 이벤트
[E0] 화면 열림 (생성자 L55-80) → 초기화
[E1] deleteButton[삭제].Select (L56) → deleteCheck()
       └ [E5] messageBox.DialogHide [YES] (L183) → deleteRow()
[E2] updateButton[저장].Select (L62) → updateCheck()
[E3] closeButton[닫기].Select (L68) → hide()
[E4] grid.CellClick (L74) → init()
[E6] msgBox.DialogHide [YES] (L199) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public showData() | L82-114 | 공개 메서드 | 상태 처리 | 업무 |
| private init() | L126-136 | E4 | 상태 처리 | 업무 |
| private retrieve() | L138-149 | showData,updateCheck | 서비스 org.Org02_Info.selectByOnlyOrgCodeId(orgCodeId) | 업무 |
| private deleteCheck() | L151-194 | E1 | ConfirmBox → E5 | 업무 |
| private deleteMsg() | L196-228 | deleteCheck | 확인창 표시, 서비스 org.Org02_Info.deleteOrg | 업무 |
| private updateCheck() | L230-242 | E2 | 상태 처리 | 업무 |
| public deleteRow() | L244-252 | E5 | GridDeleteData org.Org02_Info.delete(체크된 행 목록) | 업무 |
| private buildGrid() | L116-124 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L254-256 | showData | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('modDate', 100, '개설(변경)일'),  // L120
  gb.text('korNm', 300, '조직(부서)명'),  // L121
];
```

#### 사용된 버튼들
1. <Button type="delete" onClick={deleteCheck}>삭제</Button>
2. <Button type="save" onClick={updateCheck}>저장</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

### Org02_Edit_Info (`client/vi/org/Org02_Edit_Info.java`, 262줄)

- 입력·하위 화면: `orgCode` TextField, `openDate` MyDateField, `openReason` TextField, `closeDate` MyDateField, `closeReason` TextField, `parentCodeId` LongField, `korName` TextField, `levelCode` TextField, `levelName` ComboBoxField("OrgLevelCode"), `engName` TextField, `modDate` MyDateField, `modReason` TextField, `sortOrder` TextField, `note` TextField, `dcrIdWord` TextField, `tdmYn` CheckBox, `parentOrgName` TextField

#### 이벤트
[E0] 화면 열림 (생성자 L91-174) → show()
[E1] levelName[조직레벨].Collapse (L99) → 인라인 L99-104 (new CollapseHandler(){ @Override publ…)
[E2] parentLookupButton[상위조직변경].Select (L105) → 메시지 "동일한 조직은 등록할 수 없습니다"
[E3] messageBox.DialogHide [YES] (L211) → delete()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public editData() | L176-206 | 공개 메서드 | 서비스 sys.Sys01_Company.selectById(companyId) | 업무 |
| public deleteCheck() | L208-220 | 공개 메서드 | 확인창 표시 | 업무 |
| private delete() | L222-234 | E3 | 서비스 org.Org01_Code.delete(companyId, baseDate) | 업무 |
| public update() | L236-252 | 공개 메서드 | 서비스 org.Org01_Code.update(companyId, baseDate) | 업무 |
| private setHtmlStyle() | L254-256 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L258-260 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="change" onClick={() => /* 메시지 "동일한 조직은 등록할 수 없습니다" */}>상위조직변경</Button>

### Org01_Move_OrgCode (`client/vi/org/Org01_Move_OrgCode.java`, 159줄)


#### 이벤트
[E1] oKButton[확인].Select (L59) → update()
[E2] cancelButton[취소].Select (L67) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public getKey() | L40-42 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L46-78 | 공개 메서드 | 상태 처리 | 업무 |
| private retrieve() | L81-87 | open | 서비스 org.Org01_Code.selectByCompanyId | 업무 |
| private update() | L89-99 | E1 | 미선택 시 alert "먼저 이동할 상위부서를 선택해주세요" | 업무 |
| private addChild() | L101-110 | getServiceResult | 상태 처리 | 업무 |
| public getServiceResult() | L113-128 | 공개 메서드 | 상태 처리 | 업무 |
| public getValue() | L132-134 | 공개 메서드 | 상태 처리 | 업무 |
| public setValue() | L136-137 | 공개 메서드 | 상태 처리 | 업무 |
| public getPath() | L139-141 | 공개 메서드 | 상태 처리 | 업무 |
| private getMenuTree() | L144-153 | open | 상태 처리 | 업무 |
| private setHtmlHeaderStyle() | L155-157 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>확인</Button>
2. <Button type="cancel" onClick={hide}>취소</Button>

### Org01_Edit_OrgCode (`client/vi/org/Org01_Edit_OrgCode.java`, 366줄)

- 입력·하위 화면: `orgCode` TextField, `openDate` MyDateField, `openReason` TextField, `closeDate` MyDateField, `closeReason` TextField, `korName` TextField, `levelCode` TextField, `engName` TextField, `modReason` TextField, `sortOrder` TextField, `note` TextField, `dcrIdWord` TextField, `tdmYn` CheckBox, `parentCodeId` LongField, `levelName` ComboBoxField("OrgLevelCode"), `modDate` MyDateField, `parentOrgName` TextField

#### 이벤트
[E1] levelName[조직레벨].Collapse (L146) → 인라인 L146-151 (new CollapseHandler(){ @Override publ…)
[E2] parentLookupButton[상위조직변경].Select (L152) → 메시지 "동일한 조직은 등록할 수 없습니다"
[E3] updateButton[저장].Select (L171) → update()
[E4] closeButton[닫기].Select (L177) → hide()
[E5] deleteButton[삭제].Select (L262) → deleteCheck()
       └ [E6] messageBox.DialogHide [YES] (L332) → delete()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public editData() | L115-282 | 공개 메서드 | 서비스 sys.Sys01_Company.selectById(companyId) | 업무 |
| public update() | L284-327 | E3 | 서비스 org.Org01_Code.update(companyId, baseDate) | 업무 |
| private deleteCheck() | L329-341 | E5 | ConfirmBox → E6 | 업무 |
| private delete() | L343-357 | E6 | 서비스 org.Org01_Code.delete(companyId, baseDate) | 업무 |
| private setHtmlHeaderStyle() | L359-361 | editData | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L363-365 | editData | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="delete" onClick={deleteCheck}>삭제</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>
4. <Button type="change" onClick={() => /* 메시지 "동일한 조직은 등록할 수 없습니다" */}>상위조직변경</Button>

