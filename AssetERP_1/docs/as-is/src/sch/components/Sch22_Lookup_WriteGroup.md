# Sch22_Lookup_WriteGroup

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `chk`, `ics`
- 파일: `client/vi/sch/Sch22_Lookup_WriteGroup.java`
- 함께 쓰는 클래스 1개:
  - `Sch02_Page_Share` `client/vi/sch/Sch02_Page_Share.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Emp00_Lookup_SelectMulti`](../../emp/components/Emp00_Lookup_SelectMulti.md), [`Emp00_Lookup_SelectSingle`](../../emp/components/Emp00_Lookup_SelectSingle.md), [`Org00_Lookup_SelectMulti`](../../org/components/Org00_Lookup_SelectMulti.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sch.Sch02_Share.checkWriteGroup` | Sch02_Page_Share:233 | [`Sch02_Share.java:78`](../../sch/services/Sch02_Share.md) | [`sch02_share.checkWriteGroup`](../../sch/sql/sch02_share.md) |
| `sch.Sch02_Share.delete` | Sch02_Page_Share:215 | [`Sch02_Share.java:95`](../../sch/services/Sch02_Share.md) | `UpdateDataModel(sch02_share)` 동적 DELETE |
| `sch.Sch02_Share.deleteByInfoId` | Sch22_Lookup_WriteGroup:272 | [`Sch02_Share.java:69`](../../sch/services/Sch02_Share.md) | [`sch02_share.deleteByInfoId`](../../sch/sql/sch02_share.md) |
| `sch.Sch02_Share.selectByInfoId2` | Sch02_Page_Share:266 | [`Sch02_Share.java:45`](../../sch/services/Sch02_Share.md) | [`sch02_share.selectByInfoId2`](../../sch/sql/sch02_share.md) |
| `sch.Sch02_Share.update` | Sch02_Page_Share:223 | [`Sch02_Share.java:90`](../../sch/services/Sch02_Share.md) | `UpdateDataModel(sch02_share)` 동적 INSERT/UPDATE → [`sch02_share.selectById`](../../sch/sql/sch02_share.md) |
| `sch.Sch22_WriteGroup.checkByWriteGroupId` | Sch22_Lookup_WriteGroup:245 | [`Sch22_WriteGroup.java:47`](../../sch/services/Sch22_WriteGroup.md) | [`sch22_write_group.checkByWriteGroupId`](../../sch/sql/sch22_write_group.md) |
| `sch.Sch22_WriteGroup.delete` | Sch22_Lookup_WriteGroup:282 | [`Sch22_WriteGroup.java:57`](../../sch/services/Sch22_WriteGroup.md) | `UpdateDataModel(sch22_write_group)` 동적 DELETE |
| `sch.Sch22_WriteGroup.selectByCompanyId` | Sch22_Lookup_WriteGroup:217 | [`Sch22_WriteGroup.java:23`](../../sch/services/Sch22_WriteGroup.md) | [`sch22_write_group.selectByCompanyId`](../../sch/sql/sch22_write_group.md) |
| `sch.Sch22_WriteGroup.update` | Sch22_Lookup_WriteGroup:222 | [`Sch22_WriteGroup.java:52`](../../sch/services/Sch22_WriteGroup.md) | `UpdateDataModel(sch22_write_group)` 동적 INSERT/UPDATE → [`sch22_write_group.selectById`](../../sch/sql/sch22_write_group.md) |

## 테이블

[`chk02_daily_list`](../../../db/tables/chk.md), [`chk03_daily_list_write`](../../../db/tables/chk.md), [`emp01_person`](../../../db/tables/emp.md), [`ics11_checklist_company`](../../../db/tables/ics.md), [`ics15_checklist_write`](../../../db/tables/ics.md), [`org01_code`](../../../db/tables/org.md), [`sch02_share`](../../../db/tables/sch.md), [`sch22_write_group`](../../../db/tables/sch.md)

## DB 함수

`f_cdnm`, `f_emp_kor_nm`, `f_get_emptrans`, `f_get_last_day`, `f_org_nm`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sch22_Lookup_WriteGroup (`client/vi/sch/Sch22_Lookup_WriteGroup.java`, 295줄)

- 툴바 `buttonBar`: {retrieveButton} {insertButton} {updateButton} {deleteButton}
- 입력·하위 화면: `pageShare` Sch02_Page_Share, `lookupEmp` LookupTriggerField, `lookup` Emp00_Lookup_SelectSingle
- 그리드 `grid` (buildGrid(), 체크박스):
  - writeGroupName 300 "작성그룹명" Text 편집:TextField
  - confirmerName 100 "확인자" Text 편집:lookupEmp

#### 이벤트
[E0] 화면 열림 (생성자 L81-110) → settings(), show(), retrieve()
[E1] retrieveButton[조회].Select (L114) → retrieve()
[E2] insertButton[등록].Select (L120) → insertRow()
[E3] updateButton[저장].Select (L126) → update()
[E4] deleteButton[삭제].Select (L132) → deleteCheck()
       └ [E10] msgBox.DialogHide [YES] (L240) → delete()
[E5] grid.SelectionChanged (L138) → retrievePage()
[E6] confirmButton[확인].Select [선택>0] (L144) → hide()
[E7] nullButton[작성그룹없음].Select [callback != null] (L156) → hide()
[E8] closeButton[닫기].Select (L165) → hide()
[E9] lookupEmp.TriggerClick [result != null] (L177) → 인라인 L177-196 (new TriggerClickHandler(){ @Override …)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public edit() | L67-71 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L73-79 | 공개 메서드 | 상태 처리 | 업무 |
| private retrievePage() | L206-212 | E5 | 상태 처리 | 업무 |
| public retrieve() | L214-218 | 생성자,E1 | 서비스 sch.Sch22_WriteGroup.selectByCompanyId(companyId) | 업무 |
| public update() | L220-223 | E3 | 서비스 sch.Sch22_WriteGroup.update | 업무 |
| public insertRow() | L225-230 | E2 | 상태 처리 | 업무 |
| private deleteCheck() | L232-269 | E4 | ConfirmBox → E10 | 업무 |
| public delete() | L271-290 | E10 | GridDeleteData sch.Sch02_Share.deleteByInfoId, sch.Sch22_WriteGroup.delete(체크된 행 목록) | 업무 |
| private settings() | L113-171 | 생성자 | 미선택 시 alert "좌측 그룹을 선택해주세요", 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L173-204 | 필드 초기화 | 조회창 Emp00_Lookup_SelectSingle 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L292-294 | edit,open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('writeGroupNm', 300, '작성그룹명', { editor: 'text' }),  // L200
  gb.text('confirmerNm', 100, '확인자'),  // L201 SQL 계산 컬럼(selectByCompanyId: emp01_kor_nm)
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={deleteCheck}>삭제</Button>
5. <Button type="save" onClick={hide}>확인</Button>
6. <Button type="unknown" onClick={hide}>작성그룹없음</Button>
7. <Button type="unknown" onClick={hide}>닫기</Button>

### Sch02_Page_Share (`client/vi/sch/Sch02_Page_Share.java`, 274줄)

- 입력·하위 화면: `orgSearch` Org00_Lookup_SelectMulti, `lookupEmpTransInfo` Emp00_Lookup_SelectMulti
- 그리드 `grid` (grid(), 체크박스(다중)):
  - shareName 70 "구분" TextCenter
  - orgName 250 "작성부서" Text
  - personName 100 "작성자" TextCenter
  - startDate 100 "적용시작일" Date 편집:MyDateField
  - closeDate 100 "적용종료일" Date 편집:MyDateField

#### 이벤트
[E0] 화면 열림 (생성자 L63-88) → settings(), retrieve()
[E1] anchor.MouseDown (L68) → retrieve()
[E2] insertButton01[부서추가].Select (L91) → insertRow()
[E3] insertButton02[직원추가].Select (L97) → insertRow()
[E4] updateButton[저장].Select (L103) → update()
[E5] deleteButton[행 삭제].Select (L109) → deleteRow()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private insertRow() | L117-123 | E2,E3 | 상태 처리 | 업무 |
| private grid() | L125-136 | 필드 초기화 | 상태 처리 | 업무 |
| private openLookupOrgInfo() | L138-167 | insertRow | 조회창 Org00_Lookup_SelectMulti 열기 | 업무 |
| private openLookupEmpInfo() | L169-200 | insertRow | 조회창 Emp00_Lookup_SelectMulti 열기 | 업무 |
| private update() | L202-224 | E4 | GridDeleteData sch.Sch02_Share.delete, sch.Sch02_Share.update | 업무 |
| private deleteRow() | L226-251 | E5 | 서비스 sch.Sch02_Share.checkWriteGroup | 업무 |
| public retrieve() | L253-273 | 생성자,E1 | 서비스 sch.Sch02_Share.selectByInfoId2(infoId) | 업무 |
| private settings() | L90-115 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |

#### Grid Spec
```javascript
const grid = () => [
  gb.textCenter('shareNm', 70, '구분'),  // L129 SQL 계산 컬럼(selectByInfoId2: f_cdnm('ShareCode', sch02_share_cd, sch…)
  gb.text('orgNm', 250, '작성부서'),  // L130 SQL 계산 컬럼(selectByInfoId2: CONCAT(f_org_nm(sch02_org_id, f_sysdate…)
  gb.textCenter('personNm', 100, '작성자'),  // L131 SQL 계산 컬럼(selectByInfoId2: f_emp_kor_nm(sch02_person_id))
  gb.date('startDate', 100, '적용시작일', { editor: 'date' }),  // L132
  gb.date('closeDate', 100, '적용종료일', { editor: 'date' }),  // L133
];
```

#### 사용된 버튼들
1. <Button type="addRow" onClick={insertRow}>부서추가</Button>
2. <Button type="addRow" onClick={insertRow}>직원추가</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>

