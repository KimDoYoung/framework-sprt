# Tgt01_Tab_Co

- 종류: 화면
- 메뉴: 고유자산 > (X)02. 부동산 > 매매처정보관리 (#1055)
- 파일: `client/vi/tgt/Tgt01_Tab_Co.java`
- 함께 쓰는 클래스 1개:
  - `Tgt02_Grid_CoAcct` `client/vi/tgt/Tgt02_Grid_CoAcct.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `tgt.Tgt01_Co.delete` | Tgt01_Tab_Co:211 | [`Tgt01_Co.java:51`](../../tgt/services/Tgt01_Co.md) | `UpdateDataModel(tgt01_co)` 동적 DELETE |
| `tgt.Tgt01_Co.selectByText` | Tgt01_Tab_Co:171 | [`Tgt01_Co.java:28`](../../tgt/services/Tgt01_Co.md) | [`tgt01_co.selectByText`](../../tgt/sql/tgt01_co.md) |
| `tgt.Tgt01_Co.update` | Tgt01_Tab_Co:184 | [`Tgt01_Co.java:46`](../../tgt/services/Tgt01_Co.md) | `UpdateDataModel(tgt01_co)` 동적 INSERT/UPDATE → [`tgt01_co.selectById`](../../tgt/sql/tgt01_co.md) |
| `tgt.Tgt02_CoAcct.delete` | Tgt02_Grid_CoAcct:125 | [`Tgt02_CoAcct.java:41`](../../tgt/services/Tgt02_CoAcct.md) | `UpdateDataModel(tgt02_co_acct)` 동적 DELETE |
| `tgt.Tgt02_CoAcct.selectByCoId` | Tgt02_Grid_CoAcct:107 | [`Tgt02_CoAcct.java:30`](../../tgt/services/Tgt02_CoAcct.md) | [`tgt02_co_acct.selectByCoId`](../../tgt/sql/tgt02_co_acct.md) |
| `tgt.Tgt02_CoAcct.update` | Tgt02_Grid_CoAcct:113 | [`Tgt02_CoAcct.java:36`](../../tgt/services/Tgt02_CoAcct.md) | `UpdateDataModel(tgt02_co_acct)` 동적 INSERT/UPDATE → [`tgt02_co_acct.selectById`](../../tgt/sql/tgt02_co_acct.md) |

## 테이블

[`tgt01_co`](../../../db/tables/tgt.md), [`tgt02_co_acct`](../../../db/tables/tgt.md)

## DB 함수

`f_cdnm`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Tgt01_Tab_Co (`client/vi/tgt/Tgt01_Tab_Co.java`, 229줄)

- 레이아웃: center=vlc, south=hlc02
- 툴바 `buttonBar`: 검색: {searchText} {retrieveButton} {insertButton} {updateButton} {deleteButton}
- 입력·하위 화면: `searchText` TextField 빈칸="문자열을 입력하세요.", `gbComboBox` ComboBoxField("MM")
- 그리드 `grid` (buildGrid(), 체크박스):
  - useYn 80 "사용여부" Boolean
  - gbName 100 "구분" Text 편집:gbComboBox
  - coCode 100 "매매처코드" Text 편집:TextField
  - coName 300 "매매처명" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L57-60) → init(), retrieve()
[E1] searchText.KeyPress [Enter] (L67) → retrieve()
[E2] retrieveButton[조회].Select (L77) → retrieve()
[E3] insertButton[등록].Select (L85) → insertRow()
[E4] updateButton[저장].Select (L93) → update()
[E5] deleteButton[삭제].Select (L101) → deleteRow()
       └ [E8] messageBox.DialogHide (L205) → 서비스 tgt.Tgt01_Co.delete
[E6] grid.SelectionChanged (L130) → 인라인 L130-136 (new SelectionChangedHandler<Tgt01_CoM…)
[E7] gbComboBox[MM].Collapse (L147) → 인라인 L147-153 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private init() | L62-139 | 생성자 | 상태 처리 | 업무 |
| public retrieve() | L165-179 | 생성자,E1,E2,init | 서비스 tgt.Tgt01_Co.selectByText(searchText, companyId) | 업무 |
| public update() | L182-186 | E4 | 서비스 tgt.Tgt01_Co.update | 업무 |
| public insertRow() | L189-200 | E3 | 상태 처리 | 업무 |
| public deleteRow() | L203-224 | E5 | ConfirmBox → E8 | 업무 |
| private buildGrid() | L141-162 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L226-228 | init | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.boolean('useYn', 80, '사용여부'),  // L156
  gb.text('gbNm', 100, '구분', { editor: 'select' }),  // L157 SQL 계산 컬럼(selectByText: f_cdnm('MM', tgt01_gb, 0, f_sysdate()))
  gb.text('coCd', 100, '매매처코드', { editor: 'text' }),  // L158
  gb.text('coNm', 300, '매매처명', { editor: 'text' }),  // L159
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={deleteRow}>삭제</Button>

### Tgt02_Grid_CoAcct (`client/vi/tgt/Tgt02_Grid_CoAcct.java`, 147줄)

- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - encAcctNo 150 "계좌번호" Text 편집:TextField
  - openDate 100 "개설일" Date 편집:MyDateField
  - fundCode 150 "펀드코드" Text 편집:TextField
  - acctName 300 "펀드명" Text 편집:TextField
  - closeDate 100 "폐쇠일" Date 편집:MyDateField
  - note 400 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L42-77) → 초기화
[E1] insertButton[등록].Select (L51) → insertRow()
[E2] updateButton[저장].Select (L59) → update()
[E3] deleteButton[삭제].Select (L67) → deleteRow()
       └ [E4] messageBox.DialogHide (L119) → 서비스 tgt.Tgt02_CoAcct.delete

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L96-99 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L102-108 | 공개 메서드 | 서비스 tgt.Tgt02_CoAcct.selectByCoId(coId) | 업무 |
| public update() | L111-114 | E2 | 서비스 tgt.Tgt02_CoAcct.update | 업무 |
| public deleteRow() | L117-138 | E3 | ConfirmBox → E4 | 업무 |
| public insertRow() | L141-146 | E1 | 상태 처리 | 업무 |
| private buildGrid() | L79-94 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('encAcctNo', 150, '계좌번호', { editor: 'text' }),  // L84
  gb.date('openDate', 100, '개설일', { editor: 'date' }),  // L85
  gb.text('fundCd', 150, '펀드코드', { editor: 'text' }),  // L86
  gb.text('acctNm', 300, '펀드명', { editor: 'text' }),  // L87
  gb.date('closeDate', 100, '폐쇠일', { editor: 'date' }),  // L88
  gb.text('note', 400, '비고', { editor: 'text' }),  // L89
];
```

#### 사용된 버튼들
1. <Button type="register" onClick={insertRow}>등록</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="delete" onClick={deleteRow}>삭제</Button>

