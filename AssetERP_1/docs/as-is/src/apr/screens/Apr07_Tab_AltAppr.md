# Apr07_Tab_AltAppr

- 종류: 화면
- 메뉴: 문서작성 > 04. 전자결재 > 대결자 지정 (#1021)
- 파일: `client/vi/apr/Apr07_Tab_AltAppr.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Emp00_Lookup_SelectSingle`](../../emp/components/Emp00_Lookup_SelectSingle.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr07_AltAppr.delete` | Apr07_Tab_AltAppr:314 | [`Apr07_AltAppr.java:153`](../../apr/services/Apr07_AltAppr.md) | `UpdateDataModel(apr07_alt_appr)` 동적 DELETE |
| `apr.Apr07_AltAppr.notAltApprIdList` | Apr07_Tab_AltAppr:227 | [`Apr07_AltAppr.java:56`](../../apr/services/Apr07_AltAppr.md) | [`apr07_alt_appr.notAltApprIdList`](../../apr/sql/apr07_alt_appr.md) |
| `apr.Apr07_AltAppr.selectByEmpId` | Apr07_Tab_AltAppr:179 | [`Apr07_AltAppr.java:42`](../../apr/services/Apr07_AltAppr.md) | [`apr07_alt_appr.selectByEmpId`](../../apr/sql/apr07_alt_appr.md) |
| `apr.Apr07_AltAppr.update` | Apr07_Tab_AltAppr:279 | [`Apr07_AltAppr.java:148`](../../apr/services/Apr07_AltAppr.md) | `UpdateDataModel(apr07_alt_appr)` 동적 INSERT/UPDATE → [`apr07_alt_appr.selectById`](../../apr/sql/apr07_alt_appr.md) |

## 테이블

[`apr07_alt_appr`](../../../db/tables/apr.md), [`emp01_person`](../../../db/tables/emp.md)

## DB 함수

`f_get_emptrans`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Apr07_Tab_AltAppr (`client/vi/apr/Apr07_Tab_AltAppr.java`, 326줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: {label01} {retrieveButton} {insertButton} {updateButton} {deleteButton}
- 입력·하위 화면: `lookupEmpInfo` LookupTriggerField, `minDate` MyDateField, `lookupEmpTransInfo` Emp00_Lookup_SelectSingle
- 그리드 `grid` (buildGrid(), 체크박스):
  - altEmpName 100 "성명" Text 편집:lookupEmpInfo
  - altEmpNo 80 "사번" Text
  - altOrgName 200 "부서명" Text
  - altTitleName 150 "직책" Text
  - startDate 100 "시작일" Date 편집:minDate
  - closeDate 100 "종료일" Date 편집:minDate
  - stampYn 120 "인감날인은<br>(부)책임자가 대리" Boolean
  - reasonCd 500 "대결사유" Text 편집:TextField
  - emgrPoint 300 "비상연락망(비고)" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L62-65) → makeLayout(), retrieve()
[E1] retrieveButton[조회].Select (L68) → retrieve()
[E2] insertButton[등록].Select (L74) → insertRow()
[E3] updateButton[저장].Select (L80) → update()
[E4] deleteButton[삭제].Select (L86) → deleteChk()
       └ [E6] msgBox.DialogHide [YES] (L294) → delete()
[E5] lookupEmpInfo.TriggerClick (L118) → openLookupEmpInfo()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private getCenterLayout() | L142-154 | makeLayout | 상태 처리 | 업무 |
| private openLookupEmpInfo() | L156-174 | E5 | 조회창 Emp00_Lookup_SelectSingle 열기 | 업무 |
| private retrieve() | L176-180 | 생성자,E1 | 서비스 apr.Apr07_AltAppr.selectByEmpId(empId) | 업무 |
| private insertRow() | L182-194 | E2 | 상태 처리 | 업무 |
| private update() | L196-275 | E3 | 서비스 apr.Apr07_AltAppr.notAltApprIdList(empId, companyId, altApprIdList) | 업무 |
| private updateFinal() | L277-289 | update | 서비스 apr.Apr07_AltAppr.update | 업무 |
| private deleteChk() | L291-309 | E4 | ConfirmBox → E6 | 업무 |
| private delete() | L311-315 | E6 | GridDeleteData apr.Apr07_AltAppr.delete(체크된 행 목록) | 업무 |
| public getServiceResult() | L318-321 | update | 상태 처리 | 업무 |
| private makeLayout() | L67-112 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L114-140 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlCheckBoxStyle() | L323-325 | 필드 초기화 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('altEmpNm', 100, '성명'),  // L129 SQL 계산 컬럼(selectByEmpId: org.emp01_kor_nm)
  gb.text('altEmpNo', 80, '사번'),  // L130 SQL 계산 컬럼(selectByEmpId: org.emp01_emp_no)
  gb.text('altOrgNm', 200, '부서명'),  // L131 SQL 계산 컬럼(selectByEmpId: f_get_empTrans(org.emp01_person_id, apr…)
  gb.text('altTitleNm', 150, '직책'),  // L132 SQL 계산 컬럼(selectByEmpId: f_get_empTrans(org.emp01_person_id, apr…)
  gb.date('startDate', 100, '시작일'),  // L133
  gb.date('closeDate', 100, '종료일'),  // L134
  gb.boolean('stampYn', 120, '인감날인은<br>(부)책임자가 대리'),  // L135
  gb.text('reasonCd', 500, '대결사유', { editor: 'text' }),  // L136
  gb.text('emgrPoint', 300, '비상연락망(비고)', { editor: 'text' }),  // L137
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={deleteChk}>삭제</Button>

