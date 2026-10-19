# Apr09_Tab_ApprAgree

- 종류: 화면
- 파일: `client/vi/apr/Apr09_Tab_ApprAgree.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Emp00_Lookup_SelectSingle`](../../emp/components/Emp00_Lookup_SelectSingle.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr09_ApprAgree.delete` | Apr09_Tab_ApprAgree:140 | [`Apr09_ApprAgree.java:76`](../../apr/services/Apr09_ApprAgree.md) | `UpdateDataModel(apr09_appr_agree)` 동적 DELETE |
| `apr.Apr09_ApprAgree.selectByAll` | Apr09_Tab_ApprAgree:73 | [`Apr09_ApprAgree.java:38`](../../apr/services/Apr09_ApprAgree.md) | [`apr09_appr_agree.selectByAll`](../../apr/sql/apr09_appr_agree.md) |
| `apr.Apr09_ApprAgree.update` | Apr09_Tab_ApprAgree:119 | [`Apr09_ApprAgree.java:66`](../../apr/services/Apr09_ApprAgree.md) | `UpdateDataModel(apr09_appr_agree)` 동적 INSERT/UPDATE → [`apr09_appr_agree.selectById`](../../apr/sql/apr09_appr_agree.md) |

## 테이블

[`apr09_appr_agree`](../../../db/tables/apr.md), [`emp00_trans_info`](../../../db/views.md)

## DB 함수

`f_cdnm`, `f_emp_kor_nm`, `f_org_nm`, `f_sysdate`, `f_trunc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Apr09_Tab_ApprAgree (`client/vi/apr/Apr09_Tab_ApprAgree.java`, 168줄)

- 레이아웃: north=searchBarBuilder.getSearchBar(), center=grid
- 입력·하위 화면: `apprStepComboBox` ComboBoxField("OrgLevelCode"), `lookupEmpInfo` LookupTriggerField, `lookupEmpTransInfo` Emp00_Lookup_SelectSingle
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - useYnFlag 80 "사용여부" Boolean
  - personName 140 "성명" Text 편집:lookupEmpInfo
  - titleName 140 "직책" Text
  - orgCodeName 200 "부서" Text
  - apprStepName 140 "결재등급" Text 편집:apprStepComboBox
  - note 340 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L44-47) → makeLayout(), setInitData()
[E1] searchBarBuilder[조회].Retrieve (L51) → retrieve()
[E2] searchBarBuilder[저장].Update (L52) → update()
[E3] searchBarBuilder[등록].Insert (L53) → insertRow()
[E4] searchBarBuilder[삭제].Delete (L54) → deleteRow()
       └ [E7] messageBox.DialogHide [YES] (L134) → 서비스 apr.Apr09_ApprAgree.delete
[E5] apprStepComboBox[OrgLevelCode].Collapse (L82) → 인라인 L82-88 (new CollapseHandler() { @Override pub…)
[E6] lookupEmpInfo.TriggerClick (L91) → openLookupEmpInfo()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setInitData() | L71-74 | 생성자 | 서비스 apr.Apr09_ApprAgree.selectByAll | 업무 |
| public retrieve() | L109-113 | E1 | 서비스 apr.Apr09_ApprAgree.selectByAll(companyId) | 업무 |
| public update() | L116-120 | E2 | 서비스 apr.Apr09_ApprAgree.update(companyId) | 업무 |
| public insertRow() | L123-128 | E3 | 상태 처리 | 업무 |
| public deleteRow() | L131-145 | E4 | ConfirmBox → E7 | 업무 |
| private openLookupEmpInfo() | L147-165 | E6 | 조회창 Emp00_Lookup_SelectSingle 열기 | 업무 |
| private makeLayout() | L49-69 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L76-106 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L98 useYnFlag 80 "사용여부" (apr09_use_yn_flag 컬럼 없음)
  gb.text('personNm', 140, '성명'),  // L99 SQL 계산 컬럼(selectByAll: f_emp_kor_nm(b.emp00_person_id))
  gb.text('titleNm', 140, '직책'),  // L100 SQL 계산 컬럼(selectByAll: f_cdnm('EmpTitleCode', apr09_title_cd, …)
  gb.text('orgCodeNm', 200, '부서'),  // L101 SQL 계산 컬럼(selectByAll: f_org_nm(b.emp00_org_code_id, f_sysdate…)
  gb.text('apprStepNm', 140, '결재등급', { editor: 'select' }),  // L102 SQL 계산 컬럼(selectByAll: f_cdnm('OrgLevelCode', apr09_appr_step,…)
  gb.text('note', 340, '비고', { editor: 'text' }),  // L103
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="register" onClick={insertRow}>등록</Button>
4. <Button type="delete" onClick={deleteRow}>삭제</Button>

