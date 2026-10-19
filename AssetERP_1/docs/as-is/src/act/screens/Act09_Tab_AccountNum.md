# Act09_Tab_AccountNum

- 종류: 화면
- 메뉴: 관리자 > 05. 관리회계 > 결산회기관리 (#1206)
- 파일: `client/vi/act/Act09_Tab_AccountNum.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `act.Act09_AccountNum.delete` | Act09_Tab_AccountNum:174 | [`Act09_AccountNum.java:81`](../../act/services/Act09_AccountNum.md) | `UpdateDataModel(act09_account_num)` 동적 DELETE |
| `act.Act09_AccountNum.selectByRetrieve` | Act09_Tab_AccountNum:125 | [`Act09_AccountNum.java:58`](../../act/services/Act09_AccountNum.md) | [`act09_account_num.selectByRetrieve`](../../act/sql/act09_account_num.md) |
| `act.Act09_AccountNum.update` | Act09_Tab_AccountNum:139 | [`Act09_AccountNum.java:72`](../../act/services/Act09_AccountNum.md) | `UpdateDataModel(act09_account_num)` 동적 INSERT/UPDATE → [`act09_account_num.selectById`](../../act/sql/act09_account_num.md) |

## 테이블

[`act09_account_num`](../../../db/tables/act.md)

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Act09_Tab_AccountNum (`client/vi/act/Act09_Tab_AccountNum.java`, 176줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: {retrieveButton} {insertButton} {updateButton} {deleteButton}
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - num 100 "회기" Long 편집:LongField
  - startDate 120 "회기시작일" Date 편집:MyDateField
  - closeDate 120 "회기종료일" Date 편집:MyDateField
  - note 500 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L46-104) → retrieve()
[E1] retrieveButton[조회].Select (L62) → retrieve()
[E2] insertButton[등록].Select (L69) → insertRow()
[E3] updateButton[저장].Select (L76) → update()
[E4] deleteButton[삭제].Select (L83) → deleteChk()
       └ [E5] msgBox.DialogHide [YES] (L153) → deleteRow()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L121-133 | 생성자,E1 | 서비스 act.Act09_AccountNum.selectByRetrieve(companyId), 건수 표시 | 업무 |
| public update() | L136-140 | E3 | 서비스 act.Act09_AccountNum.update(companyId) | 업무 |
| public insertRow() | L143-148 | E2 | 상태 처리 | 업무 |
| private deleteChk() | L150-168 | E4 | ConfirmBox → E5 | 업무 |
| public deleteRow() | L171-175 | E5 | GridDeleteData act.Act09_AccountNum.delete(체크된 행 목록) | 업무 |
| public buildGrid() | L106-118 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.long('num', 100, '회기', { editor: 'number' }),  // L112
  gb.date('startDate', 120, '회기시작일', { editor: 'date' }),  // L113
  gb.date('closeDate', 120, '회기종료일', { editor: 'date' }),  // L114
  gb.text('note', 500, '비고', { editor: 'text' }),  // L115
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={deleteChk}>삭제</Button>

