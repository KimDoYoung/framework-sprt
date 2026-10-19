# Emp60_Tab_Sign

- 종류: 화면
- 메뉴: 문서작성 > 04. 전자결재 > 결재서명관리 (#1501)
- 파일: `client/vi/emp/Emp60_Tab_Sign.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `emp.Emp60_Sign.delete` | Emp60_Tab_Sign:283 | [`Emp60_Sign.java:70`](../../emp/services/Emp60_Sign.md) | `UpdateDataModel(emp60_sign)` 동적 DELETE |
| `emp.Emp60_Sign.deleteChk` | Emp60_Tab_Sign:254 | [`Emp60_Sign.java:48`](../../emp/services/Emp60_Sign.md) | [`apr04_appr_step.signIdListChk`](../../apr/sql/apr04_appr_step.md) |
| `emp.Emp60_Sign.notSignIdList` | Emp60_Tab_Sign:175 | [`Emp60_Sign.java:35`](../../emp/services/Emp60_Sign.md) | [`emp60_sign.notSignIdList`](../../emp/sql/emp60_sign.md) |
| `emp.Emp60_Sign.selectByPersonId` | Emp60_Tab_Sign:154 | [`Emp60_Sign.java:25`](../../emp/services/Emp60_Sign.md) | [`emp60_sign.selectByPersonId`](../../emp/sql/emp60_sign.md) |
| `emp.Emp60_Sign.update` | Emp60_Tab_Sign:217 | [`Emp60_Sign.java:65`](../../emp/services/Emp60_Sign.md) | `UpdateDataModel(emp60_sign)` 동적 INSERT/UPDATE → [`emp60_sign.selectById`](../../emp/sql/emp60_sign.md) |

## 테이블

[`apr04_appr_step`](../../../db/tables/apr.md), [`emp60_sign`](../../../db/tables/emp.md), [`sys10_file`](../../../db/tables/sys.md)

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Emp60_Tab_Sign (`client/vi/emp/Emp60_Tab_Sign.java`, 308줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: {retrieveButton} {insertButton} {updateButton} {deleteButton}
- 그리드 `grid` (buildGrid()):
  - useYn 100 "사용" Boolean
  - signId_string 200 "서명" Cell 편집:CustomImageCell
  - actionCell 25 " " Cell 편집:actionCell01
  - note 700 "비고" TextArea 편집:MyTextArea

#### 이벤트
[E0] 화면 열림 (생성자 L70-91) → settings(), retrieve()
[E1] fileUpdownForm.Change (L95) → update()
[E2] retrieveButton[조회].Select (L108) → retrieve()
[E3] insertButton[등록].Select (L114) → insertRow()
[E4] updateButton[저장].Select (L120) → update()
[E5] deleteButton[삭제].Select (L126) → deleteChk()
[E6] msgBox.DialogHide [YES] (L278) → 서비스 emp.Emp60_Sign.delete

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L149-160 | 생성자,E2 | 서비스 emp.Emp60_Sign.selectByPersonId(personId) | 업무 |
| public update() | L162-213 | E1,E4 | 서비스 emp.Emp60_Sign.notSignIdList(personId, companyId, signIdList) | 업무 |
| private updateFinal() | L215-227 | update | 서비스 emp.Emp60_Sign.update | 업무 |
| public insertRow() | L229-242 | E3 | 상태 처리 | 업무 |
| private deleteChk() | L244-270 | E5 | 서비스 emp.Emp60_Sign.deleteChk(companyId, signIdList) | 업무 |
| private deleteRow() | L272-293 | deleteChk | 확인창 표시, GridDeleteData emp.Emp60_Sign.delete(체크된 행 목록) | 업무 |
| private settings() | L93-132 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L134-147 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| public render() | L299-306 | 공개 메서드 | 상태 처리 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.boolean('useYn', 100, '사용'),  // L142
  // ⚠ 대응 없음 (GridBuilder L143) addCell
  // ⚠ 대응 없음 (GridBuilder L144) addCell
  gb.textArea('note', 700, '비고', { editor: 'largeText' }),  // L145
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={deleteChk}>삭제</Button>

