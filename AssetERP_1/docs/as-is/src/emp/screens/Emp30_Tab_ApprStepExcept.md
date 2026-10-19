# Emp30_Tab_ApprStepExcept

- 종류: 화면
- 메뉴: 문서작성 > 04. 전자결재 > 결재선 예외처리 (#1439)
- 파일: `client/vi/emp/Emp30_Tab_ApprStepExcept.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Emp00_Lookup_SelectSingle`](../../emp/components/Emp00_Lookup_SelectSingle.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `emp.Emp30_ApprStepExcept.delete` | Emp30_Tab_ApprStepExcept:202 | [`Emp30_ApprStepExcept.java:33`](../../emp/services/Emp30_ApprStepExcept.md) | `UpdateDataModel(emp30_appr_step_except)` 동적 DELETE |
| `emp.Emp30_ApprStepExcept.selectByCompanyId` | Emp30_Tab_ApprStepExcept:153 | [`Emp30_ApprStepExcept.java:23`](../../emp/services/Emp30_ApprStepExcept.md) | [`emp30_appr_step_except.selectByCompanyId`](../../emp/sql/emp30_appr_step_except.md) |
| `emp.Emp30_ApprStepExcept.update` | Emp30_Tab_ApprStepExcept:164 | [`Emp30_ApprStepExcept.java:28`](../../emp/services/Emp30_ApprStepExcept.md) | `UpdateDataModel(emp30_appr_step_except)` 동적 INSERT/UPDATE → [`emp30_appr_step_except.selectById`](../../emp/sql/emp30_appr_step_except.md) |

## 테이블

[`emp30_appr_step_except`](../../../db/tables/emp.md)

## DB 함수

`f_emp_kor_nm`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Emp30_Tab_ApprStepExcept (`client/vi/emp/Emp30_Tab_ApprStepExcept.java`, 208줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 담당자명: {searchTextField} {retrieveButton} {insertButton} {updateButton} {deleteButton}
- 입력·하위 화면: `searchTextField` TextField, `lookupEmpInfo` LookupTriggerField, `lookupEmpTransInfo` Emp00_Lookup_SelectSingle
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - regDate 100 "등록일" Date
  - personName 100 "사원명" TextCenter 편집:lookupEmpInfo
  - useYn 80 "사용여부" Boolean
  - note 500 "사유(비고)" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L55-112) → retrieve()
[E1] searchTextField.KeyPress [Enter] (L62) → retrieve()
[E2] retrieveButton[조회].Select (L71) → retrieve()
[E3] insertButton[등록].Select (L78) → insertRow()
[E4] updateButton[저장].Select (L85) → update()
[E5] deleteButton[삭제].Select (L92) → deleteChk()
       └ [E7] msgBox.DialogHide [YES] (L181) → deleteRow()
[E6] lookupEmpInfo.TriggerClick (L116) → openLookupEmpInfo()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private openLookupEmpInfo() | L133-145 | E6 | 조회창 Emp00_Lookup_SelectSingle 열기 | 업무 |
| public retrieve() | L148-159 | 생성자,E1,E2 | 서비스 emp.Emp30_ApprStepExcept.selectByCompanyId(companyId) | 업무 |
| public update() | L162-165 | E4 | 서비스 emp.Emp30_ApprStepExcept.update | 업무 |
| public insertRow() | L168-176 | E3 | 상태 처리 | 업무 |
| private deleteChk() | L178-196 | E5 | ConfirmBox → E7 | 업무 |
| public deleteRow() | L199-203 | E7 | GridDeleteData emp.Emp30_ApprStepExcept.delete(체크된 행 목록) | 업무 |
| public buildGrid() | L114-131 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L205-207 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('regDate', 100, '등록일'),  // L125
  gb.textCenter('personNm', 100, '사원명'),  // L126 SQL 계산 컬럼(selectByCompanyId: f_emp_kor_nm(emp30_person_id))
  gb.boolean('useYn', 80, '사용여부'),  // L127
  gb.text('note', 500, '사유(비고)', { editor: 'text' }),  // L128
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={deleteChk}>삭제</Button>

