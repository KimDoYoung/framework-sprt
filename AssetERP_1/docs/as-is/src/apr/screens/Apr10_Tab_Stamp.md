# Apr10_Tab_Stamp

- 종류: 화면
- 메뉴: 문서작성 > 04. 전자결재 > 사용인감등록 (#1026)
- 파일: `client/vi/apr/Apr10_Tab_Stamp.java`
- 함께 쓰는 클래스 1개:
  - `Apr10_Move_OrgCode` `client/vi/apr/Apr10_Move_OrgCode.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Dcr40_Lookup_StampAuth`](../../dcr/components/Dcr40_Lookup_StampAuth.md), [`Emp00_Lookup_SelectSingle`](../../emp/components/Emp00_Lookup_SelectSingle.md), [`Org10_Lookup_RoleStamp`](../../org/components/Org10_Lookup_RoleStamp.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr10_Stamp.delete` | Apr10_Tab_Stamp:383 | [`Apr10_Stamp.java:148`](../../apr/services/Apr10_Stamp.md) | `UpdateDataModel(apr10_stamp)` 동적 DELETE |
| `apr.Apr10_Stamp.selectByCodeName` | Apr10_Tab_Stamp:273 | [`Apr10_Stamp.java:79`](../../apr/services/Apr10_Stamp.md) | [`apr10_stamp.selectByCodeName`](../../apr/sql/apr10_stamp.md) |
| `apr.Apr10_Stamp.update` | Apr10_Tab_Stamp:349 | [`Apr10_Stamp.java:142`](../../apr/services/Apr10_Stamp.md) | `UpdateDataModel(apr10_stamp)` 동적 INSERT/UPDATE → [`apr10_stamp.selectById`](../../apr/sql/apr10_stamp.md) |
| `org.Org01_Code.selectByCompanyId` | Apr10_Move_OrgCode:80 | [`Org01_Code.java:64`](../../org/services/Org01_Code.md) | [`org01_code.selectByParentId_1Bang`](../../org/sql/org01_code.md) |

## 테이블

[`apr10_stamp`](../../../db/tables/apr.md), [`dcr40_stamp_auth`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`org10_role_stamp`](../../../db/tables/org.md), [`sys01_company`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_emp_kor_nm`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`, `f_today`, `f_trunc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Apr10_Tab_Stamp (`client/vi/apr/Apr10_Tab_Stamp.java`, 408줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: {retrieveButton} {insertButton} {updateButton} {deleteButton}
- 입력·하위 화면: `lookupOrgInfo` LookupTriggerField, `lookupEmpInfo1` LookupTriggerField, `lookupEmpInfo2` LookupTriggerField, `lookup` Org10_Lookup_RoleStamp, `lookupEmp` Emp00_Lookup_SelectSingle
- 그리드 `grid` (buildGrid(), 체크박스):
  - orgName 180 "부서" Text 편집:lookupOrgInfo
  - aprEmpName 120 "(정)책임자" Text 편집:lookupEmpInfo1
  - secondEmpName 120 "(부)책임자" Text 편집:lookupEmpInfo2
  - stampName 180 "인감이름" Text 편집:TextField
  - startDate 90 "시작날짜" Date 편집:MyDateField
  - closeDate 90 "종료날짜" Date 편집:MyDateField
  - useName 200 "사용용도" Text 편집:TextField
  - stampId_string 60 "인감" Cell 편집:CustomImageCell
  - actionCell 30 " " Cell 편집:actionCell01
  - corpStampYn 70 "법인인감" Boolean
  - stepUseYn 70 "결재선<br>필수추가" Boolean
  - allUseYn 70 "전체사용" Boolean
  - roleName 140 "(전체사용이 아닌 경우)<br>사용가능 부서" Text
  - actionCell 30 " " Cell 편집:actionCell02
  - stampAuthCntStr 70 "미사용<br>문서분류" TextCenter
  - actionCell 30 " " Cell 편집:actionCell03
  - note 300 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L75-96) → settings(), retrieve()
[E1] fileUpdownForm.Change (L100) → update()
[E2] retrieveButton[조회].Select (L113) → retrieve()
[E3] insertButton[등록].Select (L119) → insertRow()
[E4] updateButton[저장].Select (L125) → update()
[E5] deleteButton[삭제].Select (L131) → deleteRow()
       └ [E9] msgBox.DialogHide [YES] (L378) → 서비스 apr.Apr10_Stamp.delete
[E6] lookupOrgInfo.TriggerClick (L143) → findOrg()
[E7] lookupEmpInfo1.TriggerClick (L150) → findEmp1()
[E8] lookupEmpInfo2.TriggerClick (L157) → findEmp2()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| protected findEmp1() | L228-239 | E7 | 조회창 Emp00_Lookup_SelectSingle 열기 | 업무 |
| protected findEmp2() | L241-252 | E8 | 조회창 Emp00_Lookup_SelectSingle 열기 | 업무 |
| protected findOrg() | L254-266 | E6 | 상태 처리 | 업무 |
| public retrieve() | L268-279 | 생성자,E2,buildGrid,update | 서비스 apr.Apr10_Stamp.selectByCodeName(orgId, companyId) | 업무 |
| public update() | L281-358 | E1,E4 | 서비스 apr.Apr10_Stamp.update | 업무 |
| public insertRow() | L360-370 | E3 | 상태 처리 | 업무 |
| public deleteRow() | L372-393 | E5 | ConfirmBox → E9 | 업무 |
| private settings() | L98-137 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L139-226 | 필드 초기화 | 조회창 Org10_Lookup_RoleStamp 열기, 조회창 Dcr40_Lookup_StampAuth 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| public render() | L399-406 | 공개 메서드 | 상태 처리 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('orgNm', 180, '부서'),  // L208
  gb.text('empNm', 120, '(정)책임자'),  // L209
  gb.text('secondEmpNm', 120, '(부)책임자'),  // L210
  gb.text('stampNm', 180, '인감이름', { editor: 'text' }),  // L211
  gb.date('startDate', 90, '시작날짜', { editor: 'date' }),  // L212
  gb.date('closeDate', 90, '종료날짜', { editor: 'date' }),  // L213
  gb.text('useNm', 200, '사용용도', { editor: 'text' }),  // L214
  // ⚠ 대응 없음 (GridBuilder L215) addCell
  // ⚠ 대응 없음 (GridBuilder L216) addCell
  gb.boolean('corpStampYn', 70, '법인인감'),  // L217
  gb.boolean('stepUseYn', 70, '결재선<br>필수추가'),  // L218
  gb.boolean('allUseYn', 70, '전체사용'),  // L219
  gb.text('roleNm', 140, '(전체사용이 아닌 경우)<br>사용가능 부서'),  // L220
  // ⚠ 대응 없음 (GridBuilder L221) addCell
  gb.textCenter('stampAuthCntStr', 70, '미사용<br>문서분류'),  // L222
  // ⚠ 대응 없음 (GridBuilder L223) addCell
  gb.text('note', 300, '비고', { editor: 'text' }),  // L224
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={deleteRow}>삭제</Button>

### Apr10_Move_OrgCode (`client/vi/apr/Apr10_Move_OrgCode.java`, 157줄)


#### 이벤트
[E1] oKButton[확인].Select (L58) → update()
[E2] cancelButton[취소].Select (L66) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public getKey() | L39-41 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L45-76 | 공개 메서드 | 상태 처리 | 업무 |
| private retrieve() | L79-85 | open | 서비스 org.Org01_Code.selectByCompanyId | 업무 |
| private update() | L87-97 | E1 | 미선택 시 alert "이동할 상위부서를 선택해주세요" | 업무 |
| private addChild() | L99-108 | getServiceResult | 상태 처리 | 업무 |
| public getServiceResult() | L111-126 | 공개 메서드 | 상태 처리 | 업무 |
| public getValue() | L130-132 | 공개 메서드 | 상태 처리 | 업무 |
| public setValue() | L134-135 | 공개 메서드 | 상태 처리 | 업무 |
| public getPath() | L137-139 | 공개 메서드 | 상태 처리 | 업무 |
| private getMenuTree() | L142-151 | open | 상태 처리 | 업무 |
| private setHtmlHeaderStyle() | L153-155 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>확인</Button>
2. <Button type="cancel" onClick={hide}>취소</Button>

