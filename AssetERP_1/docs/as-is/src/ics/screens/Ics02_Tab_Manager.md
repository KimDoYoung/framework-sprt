# Ics02_Tab_Manager

- 종류: 화면
- 메뉴: 준법감시 > 01. 법규관리 > 법규 관리그룹 등록 (#1213)
- 파일: `client/vi/ics/Ics02_Tab_Manager.java`
- 함께 쓰는 클래스 1개:
  - `Ics04_Page_Share` `client/vi/ics/Ics04_Page_Share.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Emp00_Lookup_SelectMulti`](../../emp/components/Emp00_Lookup_SelectMulti.md), [`Emp00_Lookup_SelectSingle`](../../emp/components/Emp00_Lookup_SelectSingle.md), [`Org00_Lookup_SelectMulti`](../../org/components/Org00_Lookup_SelectMulti.md), [`Org00_Lookup_SelectSingle`](../../org/components/Org00_Lookup_SelectSingle.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `ics.Ics02_Manager.checkRelateIcs` | Ics02_Tab_Manager:280 | [`Ics02_Manager.java:64`](../../ics/services/Ics02_Manager.md) | [`ics05_relate_manager.checkRelateIcs`](../../ics/sql/ics05_relate_manager.md) |
| `ics.Ics02_Manager.delete` | Ics02_Tab_Manager:317 | [`Ics02_Manager.java:153`](../../ics/services/Ics02_Manager.md) | `UpdateDataModel(ics02_manager)` 동적 DELETE |
| `ics.Ics02_Manager.insert` | Ics02_Tab_Manager:219 | [`Ics02_Manager.java:77`](../../ics/services/Ics02_Manager.md) | [`ics04_share.selectByManagerId`](../../ics/sql/ics04_share.md), [`ics05_relate_manager.selectByManagerId`](../../ics/sql/ics05_relate_manager.md), [`sch02_share.delete`](../../sch/sql/sch02_share.md), [`sch02_share.insert`](../../sch/sql/sch02_share.md) |
| `ics.Ics02_Manager.selectByCompanyId` | Ics02_Tab_Manager:247 | [`Ics02_Manager.java:28`](../../ics/services/Ics02_Manager.md) | [`ics02_manager.selectByCompanyId`](../../ics/sql/ics02_manager.md) |
| `ics.Ics02_Manager.update` | Ics02_Tab_Manager:257 | [`Ics02_Manager.java:148`](../../ics/services/Ics02_Manager.md) | `UpdateDataModel(ics02_manager)` 동적 INSERT/UPDATE → [`ics02_manager.selectById`](../../ics/sql/ics02_manager.md) |
| `ics.Ics04_Share.delete` | Ics04_Page_Share:194 | [`Ics04_Share.java:41`](../../ics/services/Ics04_Share.md) | `UpdateDataModel(ics04_share)` 동적 DELETE |
| `ics.Ics04_Share.selectByManagerId` | Ics04_Page_Share:117 | [`Ics04_Share.java:25`](../../ics/services/Ics04_Share.md) | [`ics04_share.selectByManagerId`](../../ics/sql/ics04_share.md) |
| `ics.Ics04_Share.update` | Ics04_Page_Share:188 | [`Ics04_Share.java:36`](../../ics/services/Ics04_Share.md) | `UpdateDataModel(ics04_share)` 동적 INSERT/UPDATE → [`ics04_share.selectById`](../../ics/sql/ics04_share.md) |

## 테이블

[`ics02_manager`](../../../db/tables/ics.md), [`ics04_share`](../../../db/tables/ics.md), [`ics05_relate_manager`](../../../db/tables/ics.md), [`sch02_share`](../../../db/tables/sch.md)

## DB 함수

`f_cdnm`, `f_create_seq`, `f_emp_kor_nm`, `f_org_nm`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ics02_Tab_Manager (`client/vi/ics/Ics02_Tab_Manager.java`, 323줄)

- 레이아웃: west=cp, center=sharePage
- 툴바 `buttonBar`: 법규관리 그룹: {retrieveButton} {insertButton} {updateButton} {deleteButton}
- 입력·하위 화면: `sharePage` Ics04_Page_Share, `lookupEmp` LookupTriggerField, `lookupEmpTransInfo` Emp00_Lookup_SelectSingle
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - defaultYn 40 "" BooleanIcon
  - managerGroupName 360 "관리그룹명" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L66-115) → settings(), retrieve()
[E1] retrieveButton[조회].Select (L124) → retrieve()
[E2] insertButton[등록].Select (L130) → insertRow()
[E3] updateButton[저장].Select (L136) → update()
[E4] deleteButton[삭제].Select (L142) → deleteChedk()
       └ [E8] msgBox.DialogHide [YES] (L293) → deleteRow()
[E5] grid.SelectionChanged (L148) → retrieveShare()
[E6] lookupEmp.TriggerClick [result != null] (L162) → 인라인 L162-182 (new TriggerClickHandler(){ @Override …)
[E7] msgBox.DialogHide [YES] (L214) → 서비스 ics.Ics02_Manager.insert(companyId), 메시지 "전체적용이 완료되었습니다"

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieveShare() | L190-199 | E5 | 상태 처리 | 업무 |
| private selectCheck() | L201-242 | 미사용 후보 | 확인창 표시, 서비스 ics.Ics02_Manager.insert(companyId) | 업무 |
| private retrieve() | L244-253 | 생성자,E1 | 서비스 ics.Ics02_Manager.selectByCompanyId(companyId) | 업무 |
| public update() | L255-258 | E3 | 서비스 ics.Ics02_Manager.update | 업무 |
| public insertRow() | L260-266 | E2 | 상태 처리 | 업무 |
| public deleteChedk() | L268-312 | E4 | ConfirmBox → E8 | 업무 |
| public deleteRow() | L314-318 | E8 | GridDeleteData ics.Ics02_Manager.delete(체크된 행 목록) | 업무 |
| private settings() | L117-154 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L156-188 | 필드 초기화 | 조회창 Emp00_Lookup_SelectSingle 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L320-322 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L184) addBooleanIcon
  gb.text('managerGroupNm', 360, '관리그룹명', { editor: 'text' }),  // L185
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={deleteChedk}>삭제</Button>

### Ics04_Page_Share (`client/vi/ics/Ics04_Page_Share.java`, 200줄)

- 툴바 `buttonBar`: 법규관리 공유부서: {retrieveButton} {updateButton} {insertButton02} {deleteButton}
- 입력·하위 화면: `lookupEmpTransInfo` Emp00_Lookup_SelectMulti, `orgSearch` Org00_Lookup_SelectMulti
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - shareName 120 "구분" TextCenter
  - orgName 360 "부서" Text

#### 이벤트
[E0] 화면 열림 (생성자 L48-91) → 초기화
[E1] retrieveButton[조회].Select (L49) → retrieve()
[E2] insertButton02[부서추가].Select (L61) → insertRow02()
[E3] updateButton[저장].Select (L67) → update()
[E4] deleteButton[삭제].Select (L73) → deleteRow()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieve() | L103-105 | E1 | 상태 처리 | 업무 |
| public retrieve() | L107-119 | E1 | 서비스 ics.Ics04_Share.selectByManagerId(companyId, managerId) | 업무 |
| private insertRow01() | L121-155 | 미사용 후보 | 조회창 Emp00_Lookup_SelectMulti 열기 | 업무 |
| private insertRow02() | L157-184 | E2 | 조회창 Org00_Lookup_SelectMulti 열기 | 업무 |
| public update() | L186-189 | E3 | 서비스 ics.Ics04_Share.update | 업무 |
| private deleteRow() | L191-195 | E4 | GridDeleteData ics.Ics04_Share.delete(체크된 행 목록) | 업무 |
| private buildGrid() | L93-101 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L197-199 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('shareNm', 120, '구분'),  // L96 SQL 계산 컬럼(selectByManagerId: f_cdnm('ShareCode', ics04_share_cd, ics…)
  gb.text('orgNm', 360, '부서'),  // L97 SQL 계산 컬럼(selectByManagerId: f_org_nm(ics04_org_id, f_sysdate()))
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="addRow" onClick={insertRow02}>부서추가</Button>
4. <Button type="delete" onClick={deleteRow}>삭제</Button>

