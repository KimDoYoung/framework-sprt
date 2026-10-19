# Emp22_Tab_EtcLeave

- 종류: 화면
- 메뉴: 경영관리 > 02. 휴가/출장 관리 > 포상휴가관리 (#1234)
- 파일: `client/vi/emp/Emp22_Tab_EtcLeave.java`
- 함께 쓰는 클래스 1개:
  - `Emp23_Page_EtcLeavePerson` `client/vi/emp/Emp23_Page_EtcLeavePerson.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Dcr30_Lookup_Link`](../../dcr/components/Dcr30_Lookup_Link.md), [`Emp01_Lookup_PersonModel`](../../emp/components/Emp01_Lookup_PersonModel.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectById` | Emp22_Tab_EtcLeave:184 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `dcr.Dcr30_Link.selectByLinkCode` | Emp22_Tab_EtcLeave:304 | [`Dcr30_Link.java:46`](../../dcr/services/Dcr30_Link.md) | [`dcr01_class_tree.selectByLinkCode`](../../dcr/sql/dcr01_class_tree.md) |
| `emp.Emp22_EtcLeave.delete` | Emp22_Tab_EtcLeave:375 | [`Emp22_EtcLeave.java:133`](../../emp/services/Emp22_EtcLeave.md) | `UpdateDataModel(emp22_etc_leave)` 동적 DELETE |
| `emp.Emp22_EtcLeave.deleteApprId` | Emp22_Tab_EtcLeave:365 | [`Emp22_EtcLeave.java:101`](../../emp/services/Emp22_EtcLeave.md) | [`apr01_appr.deleteAppr`](../../apr/sql/apr01_appr.md), [`apr01_appr.insertApprDel`](../../apr/sql/apr01_appr.md) |
| `emp.Emp22_EtcLeave.selectByDate` | Emp22_Tab_EtcLeave:291 | [`Emp22_EtcLeave.java:57`](../../emp/services/Emp22_EtcLeave.md) | [`emp22_etc_leave.selectByDate`](../../emp/sql/emp22_etc_leave.md) |
| `emp.Emp22_EtcLeave.selectById` | Emp22_Tab_EtcLeave:192, Emp23_Page_EtcLeavePerson:138, Emp23_Page_EtcLeavePerson:169 | [`Emp22_EtcLeave.java:21`](../../emp/services/Emp22_EtcLeave.md) | [`emp22_etc_leave.selectById`](../../emp/sql/emp22_etc_leave.md) |
| `emp.Emp22_EtcLeave.update` | Emp22_Tab_EtcLeave:457 | [`Emp22_EtcLeave.java:111`](../../emp/services/Emp22_EtcLeave.md) | [`apr01_appr.deleteAppr`](../../apr/sql/apr01_appr.md), [`apr01_appr.insertApprDel`](../../apr/sql/apr01_appr.md), `UpdateDataModel(emp22_etc_leave)` 동적 INSERT/UPDATE → [`emp22_etc_leave.selectById`](../../emp/sql/emp22_etc_leave.md) |
| `emp.Emp22_EtcLeave.updateApprId` | Emp22_Tab_EtcLeave:264 | [`Emp22_EtcLeave.java:89`](../../emp/services/Emp22_EtcLeave.md) | [`emp22_etc_leave.updateApprId`](../../emp/sql/emp22_etc_leave.md) |
| `emp.Emp23_EtcLeavePerson.delete` | Emp23_Page_EtcLeavePerson:192 | [`Emp23_EtcLeavePerson.java:52`](../../emp/services/Emp23_EtcLeavePerson.md) | `UpdateDataModel(emp23_etc_leave_person)` 동적 DELETE |
| `emp.Emp23_EtcLeavePerson.selectByEtcLeaveId` | Emp23_Page_EtcLeavePerson:103 | [`Emp23_EtcLeavePerson.java:37`](../../emp/services/Emp23_EtcLeavePerson.md) | [`emp23_etc_leave_person.selectByEtcLeaveId`](../../emp/sql/emp23_etc_leave_person.md) |
| `emp.Emp23_EtcLeavePerson.update` | Emp23_Page_EtcLeavePerson:160 | [`Emp23_EtcLeavePerson.java:47`](../../emp/services/Emp23_EtcLeavePerson.md) | `UpdateDataModel(emp23_etc_leave_person)` 동적 INSERT/UPDATE → [`emp23_etc_leave_person.selectById`](../../emp/sql/emp23_etc_leave_person.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`apr99_appr_del`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp22_etc_leave`](../../../db/tables/emp.md), [`emp23_etc_leave_person`](../../../db/tables/emp.md), [`org00_org_info`](../../../db/views.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_code_seq`, `f_create_seq`, `f_emp_kor_nm`, `f_get_dcr_no`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_org_seq`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Emp22_Tab_EtcLeave (`client/vi/emp/Emp22_Tab_EtcLeave.java`, 472줄)

- 레이아웃: center=vlc, east=etcPersonPage
- 툴바 `buttonBar`: 조회기간: {startDate} ~: {closeDate} 검색: {searchText} {retrieveButton} {insertButton} {deleteButton} {updateButton} {dcrLinkButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `searchText` TextField, `etcPersonPage` Emp23_Page_EtcLeavePerson, `lookup` Dcr30_Lookup_Link, `editor` Apr01_Edit_ApprDoc, `apprDoc` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - reason 400 "사유" Text 편집:TextField
  - days 100 "포상일수" Long 편집:LongField
  - startDate 100 "사용시작일" Date 편집:MyDateField
  - closeDate 100 "사용만료일" Date 편집:MyDateField
  - apprStatusName 100 "결재상태" TextCenter
  - actionCell 80 "결재요청" Cell 편집:actionCell
  - note 400 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L76-117) → settings(), retrieve()
[E1] searchText.KeyPress [Enter] (L127) → retrieve()
[E2] retrieveButton[조회].Select (L136) → retrieve()
[E3] insertButton[등록].Select (L142) → insertRow()
[E4] deleteButton[삭제].Select (L148) → deleteCheck()
       └ [E8] msgBox.DialogHide [YES] (L345) → delete()
[E5] dcrLinkButton[문서분류지정].Select (L154) → retrieveDoc()
[E6] updateButton[저장].Select (L166) → preUpdate()
       └ [E9] msgBox.DialogHide [YES] (L435) → update()
[E7] grid.SelectionChanged (L172) → retrieveEtcPerson()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private insertLinkApproval() | L238-261 | buildGrid | 팝업 Apr01_Edit_ApprDoc 열기, 미선택 시 alert "[문서분류지정]에서 먼저 문서분류를 선택해주세요" | 업무 |
| private updateApprId() | L263-275 | insertLinkApproval | 서비스 emp.Emp22_EtcLeave.updateApprId(apprId, etcLeaveId) | 업무 |
| private retrieveEtcPerson() | L277-283 | E7 | 상태 처리 | 업무 |
| private retrieve() | L285-301 | 생성자,E1,E2,updateApprId | 서비스 emp.Emp22_EtcLeave.selectByDate(companyId, startDate, closeDate, searchText) | 업무 |
| private retrieveDoc() | L303-321 | E5,retrieve | 서비스 dcr.Dcr30_Link.selectByLinkCode | 업무 |
| private deleteCheck() | L323-360 | E4 | ConfirmBox → E8 | 업무 |
| private delete() | L362-382 | E8 | GridDeleteData emp.Emp22_EtcLeave.deleteApprId, emp.Emp22_EtcLeave.delete(체크된 행 목록) | 업무 |
| private insertRow() | L384-391 | E3 | 상태 처리 | 업무 |
| private preUpdate() | L393-453 | E6 | ConfirmBox → E9 | 업무 |
| private update() | L455-467 | E9,preUpdate | 서비스 emp.Emp22_EtcLeave.update | 업무 |
| private settings() | L119-178 | 생성자 | 조회창 Dcr30_Lookup_Link 열기, 이벤트 연결, 초기값: startDate=ClientDateUtil.toDate(DateTimeFormat.getFormat("yyyy-01-01", closeDate=LoginUser.getToday( | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L180-236 | 필드 초기화 | 팝업 Apr01_Edit_ApprDoc 열기, 서비스 apr.Apr01_Appr.selectById, emp.Emp22_EtcLeave.selectById, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L469-471 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('reason', 400, '사유', { editor: 'text' }),  // L227
  gb.long('days', 100, '포상일수', { editor: 'number' }),  // L228
  gb.date('startDate', 100, '사용시작일', { editor: 'date' }),  // L229
  gb.date('closeDate', 100, '사용만료일', { editor: 'date' }),  // L230
  gb.textCenter('apprStatusNm', 100, '결재상태'),  // L231 SQL 계산 컬럼(selectById: f_cdnm('AprStatusCode', apr01.apr01_sta…)
  // ⚠ 대응 없음 (GridBuilder L232) addCell
  gb.text('note', 400, '비고', { editor: 'text' }),  // L233
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="delete" onClick={deleteCheck}>삭제</Button>
4. <Button type="save" onClick={preUpdate}>저장</Button>
5. <Button type="save" onClick={retrieveDoc}>문서분류지정</Button>

### Emp23_Page_EtcLeavePerson (`client/vi/emp/Emp23_Page_EtcLeavePerson.java`, 199줄)

- 툴바 `buttonBar`: {insertButton} {updateButton} {deleteButton}
- 입력·하위 화면: `popup` Emp01_Lookup_PersonModel
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - orgName 180 "조직" Text
  - personName 100 "성명" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L44-77) → 초기화
[E1] insertButton[등록].Select [etcLeaveId == null] (L45) → insertRow()
[E2] updateButton[저장].Select (L56) → updateCheck()
[E3] deleteButton[삭제].Select (L62) → deleteCheck()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieve() | L90-92 | update,deleteRow | 상태 처리 | 업무 |
| public retrieve() | L94-105 | update,deleteRow | 서비스 emp.Emp23_EtcLeavePerson.selectByEtcLeaveId(etcLeaveId) | 업무 |
| private insertRow() | L107-135 | E1 | 조회창 Emp01_Lookup_PersonModel 열기 | 업무 |
| private updateCheck() | L137-156 | E2 | 서비스 emp.Emp22_EtcLeave.selectById | 업무 |
| private update() | L158-166 | updateCheck | 서비스 emp.Emp23_EtcLeavePerson.update | 업무 |
| private deleteCheck() | L168-187 | E3 | 미선택 시 alert "상신 중인 문서의 정보는 수정이 불가능합니다", 서비스 emp.Emp22_EtcLeave.selectById | 업무 |
| private deleteRow() | L189-198 | deleteCheck | GridDeleteData emp.Emp23_EtcLeavePerson.delete(체크된 행 목록) | 업무 |
| private buildGrid() | L79-88 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('orgNm', 180, '조직'),  // L84 SQL 계산 컬럼(selectByEtcLeaveId: f_get_emptrans(emp23_person_id, f_sysda…)
  gb.textCenter('personNm', 100, '성명'),  // L85 SQL 계산 컬럼(selectByEtcLeaveId: f_emp_kor_nm(emp23_person_id))
];
```

#### 사용된 버튼들
1. <Button type="register" onClick={insertRow}>등록</Button>
2. <Button type="save" onClick={updateCheck}>저장</Button>
3. <Button type="delete" onClick={deleteCheck}>삭제</Button>

