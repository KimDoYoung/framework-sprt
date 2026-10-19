# Apr07_Lookup_AltAppr

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `emp`
- 파일: `client/vi/apr/Apr07_Lookup_AltAppr.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Emp00_Lookup_SelectSingle`](../../emp/components/Emp00_Lookup_SelectSingle.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr07_AltAppr.delete` | Apr07_Lookup_AltAppr:350 | [`Apr07_AltAppr.java:153`](../../apr/services/Apr07_AltAppr.md) | `UpdateDataModel(apr07_alt_appr)` 동적 DELETE |
| `apr.Apr07_AltAppr.notAltApprIdList` | Apr07_Lookup_AltAppr:264 | [`Apr07_AltAppr.java:56`](../../apr/services/Apr07_AltAppr.md) | [`apr07_alt_appr.notAltApprIdList`](../../apr/sql/apr07_alt_appr.md) |
| `apr.Apr07_AltAppr.selectByToDay` | Apr07_Lookup_AltAppr:78 | [`Apr07_AltAppr.java:69`](../../apr/services/Apr07_AltAppr.md) | [`apr07_alt_appr.selectByToDay`](../../apr/sql/apr07_alt_appr.md) |
| `apr.Apr07_AltAppr.update` | Apr07_Lookup_AltAppr:315 | [`Apr07_AltAppr.java:148`](../../apr/services/Apr07_AltAppr.md) | `UpdateDataModel(apr07_alt_appr)` 동적 INSERT/UPDATE → [`apr07_alt_appr.selectById`](../../apr/sql/apr07_alt_appr.md) |

## 테이블

[`apr07_alt_appr`](../../../db/tables/apr.md), [`emp01_person`](../../../db/tables/emp.md)

## DB 함수

`f_get_emptrans`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Apr07_Lookup_AltAppr (`client/vi/apr/Apr07_Lookup_AltAppr.java`, 360줄)

- 툴바 `buttonBar`: {insertRowButton} {saveButton} {deleteButton}
- 툴바 `iconBar`: {anchor}
- 입력·하위 화면: `lookupEmpInfo` LookupTriggerField, `lookupEmpTransInfo` Emp00_Lookup_SelectSingle
- 그리드 `grid` (buildGrid(), 체크박스):
  - altEmpName 80 "성명" TextCenter 편집:lookupEmpInfo
  - altEmpNo 100 "사번" Text
  - altOrgName 150 "부서명" Text
  - altTitleName 80 "직책" TextCenter
  - startDate 100 "시작일" Date 편집:MyDateField
  - closeDate 100 "종료일" Date 편집:MyDateField
  - stampYn 120 "인감날인은<br>(부)책임자가 대리" Boolean
  - reasonCd 250 "대결사유" Text 편집:TextField
  - emgrPoint 120 "비상연락(비고)" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L86-127) → settings(), show()
[E1] anchor.MouseDown (L104) → retrieve()
[E2] insertRowButton[등록].Select (L130) → insertRow()
[E3] saveButton[저장].Select (L136) → update()
[E4] deleteButton[삭제].Select (L142) → deleteChk()
       └ [E7] msgBox.DialogHide [YES] (L330) → delete()
[E5] closeButton[닫기].Select (L148) → hide()
[E6] lookupEmpInfo.TriggerClick (L159) → openLookupEmpInfo()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L75-84 | 공개 메서드 | 서비스 apr.Apr07_AltAppr.selectByToDay(empId) | 업무 |
| private openLookupEmpInfo() | L179-195 | E6 | 조회창 Emp00_Lookup_SelectSingle 열기 | 업무 |
| private retrieve() | L197-202 | E1 | 서비스 apr.Apr07_AltAppr.selectByToDay(empId) | 업무 |
| private insertRow() | L204-214 | E2,open | 상태 처리 | 업무 |
| private insertRow() | L216-231 | E2,open | 상태 처리 | 업무 |
| private update() | L233-311 | E3 | 서비스 apr.Apr07_AltAppr.notAltApprIdList(empId, altApprIdList) | 업무 |
| private updateFinal() | L313-325 | update | 서비스 apr.Apr07_AltAppr.update | 업무 |
| private deleteChk() | L327-345 | E4 | ConfirmBox → E7 | 업무 |
| private delete() | L347-351 | E7 | GridDeleteData apr.Apr07_AltAppr.delete(체크된 행 목록) | 업무 |
| private settings() | L129-154 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L156-177 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L353-355 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L357-359 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('altEmpNm', 80, '성명'),  // L166 SQL 계산 컬럼(selectByToDay: org.emp01_kor_nm)
  gb.text('altEmpNo', 100, '사번'),  // L167 SQL 계산 컬럼(selectByToDay: org.emp01_emp_no)
  gb.text('altOrgNm', 150, '부서명'),  // L168 SQL 계산 컬럼(selectByToDay: f_get_empTrans(org.emp01_person_id, apr…)
  gb.textCenter('altTitleNm', 80, '직책'),  // L169 SQL 계산 컬럼(selectByToDay: f_get_empTrans(org.emp01_person_id, apr…)
  gb.date('startDate', 100, '시작일', { editor: 'date' }),  // L170
  gb.date('closeDate', 100, '종료일', { editor: 'date' }),  // L171
  gb.boolean('stampYn', 120, '인감날인은<br>(부)책임자가 대리'),  // L172
  gb.text('reasonCd', 250, '대결사유', { editor: 'text' }),  // L173
  gb.text('emgrPoint', 120, '비상연락(비고)', { editor: 'text' }),  // L174
];
```

#### 사용된 버튼들
1. <Button type="register" onClick={insertRow}>등록</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="delete" onClick={deleteChk}>삭제</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

