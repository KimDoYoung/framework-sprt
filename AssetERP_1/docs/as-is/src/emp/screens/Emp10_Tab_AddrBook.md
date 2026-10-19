# Emp10_Tab_AddrBook

- 종류: 화면
- 메뉴: 문서작성 > 05. 메일관리 > 주소록 관리 (#1025)
- 파일: `client/vi/emp/Emp10_Tab_AddrBook.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Emp57_Lookup_Insert`](../../emp/components/Emp57_Lookup_Insert.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `emp.Emp10_AddrBook.delete` | Emp10_Tab_AddrBook:210 | [`Emp10_AddrBook.java:70`](../../emp/services/Emp10_AddrBook.md) | `UpdateDataModel(emp10_addr_book)` 동적 DELETE |
| `emp.Emp10_AddrBook.selectByText` | Emp10_Tab_AddrBook:162 | [`Emp10_AddrBook.java:43`](../../emp/services/Emp10_AddrBook.md) | [`emp10_addr_book.selectByText`](../../emp/sql/emp10_addr_book.md) |
| `emp.Emp10_AddrBook.update` | Emp10_Tab_AddrBook:174 | [`Emp10_AddrBook.java:61`](../../emp/services/Emp10_AddrBook.md) | `UpdateDataModel(emp10_addr_book)` 동적 INSERT/UPDATE → [`emp10_addr_book.selectById`](../../emp/sql/emp10_addr_book.md) |

## 테이블

[`emp10_addr_book`](../../../db/tables/emp.md)

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Emp10_Tab_AddrBook (`client/vi/emp/Emp10_Tab_AddrBook.java`, 216줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 담당자명: {searchText} {retrieveButton} {insertButton} {updateButton} {deleteButton} {groupButton}
- 입력·하위 화면: `searchText` TextField, `lookup` Emp57_Lookup_Insert
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - contactName 100 "담당자명" Text 편집:TextField
  - emailAddress 220 "이메일" Text 편집:TextField
  - mobileTelNo 120 "핸드폰 번호" Text 편집:TextField
  - officeTelNo 120 "사무실 번호" Text 편집:TextField
  - companyName 180 "회사이름" Text 편집:TextField
  - posName 100 "직위" Text 편집:TextField
  - note 500 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L53-80) → settings(), retrieve()
[E1] searchText.KeyPress [Enter] (L84) → retrieve()
[E2] retrieveButton[조회].Select (L92) → retrieve()
[E3] insertButton[등록].Select (L98) → insertRow()
[E4] updateButton[저장].Select (L104) → update()
[E5] deleteButton[삭제].Select (L110) → deleteChk()
       └ [E7] msgBox.DialogHide [YES] (L189) → deleteRow()
[E6] groupButton[그룹설정].Select (L116) → 인라인 L116-122 (new SelectHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L157-168 | 생성자,E1,E2 | 서비스 emp.Emp10_AddrBook.selectByText(searchText, personId) | 업무 |
| public update() | L171-175 | E4 | 서비스 emp.Emp10_AddrBook.update(personId) | 업무 |
| public insertRow() | L178-184 | E3 | 상태 처리 | 업무 |
| private deleteChk() | L186-204 | E5 | ConfirmBox → E7 | 업무 |
| public deleteRow() | L207-211 | E7 | GridDeleteData emp.Emp10_AddrBook.delete(체크된 행 목록) | 업무 |
| private settings() | L82-123 | 생성자 | 조회창 Emp57_Lookup_Insert 열기, 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L125-154 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L213-215 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('contacterNm', 100, '담당자명', { editor: 'text' }),  // L128
  gb.text('emailAddr', 220, '이메일', { editor: 'text' }),  // L129
  gb.text('mobileTelno', 120, '핸드폰 번호', { editor: 'text' }),  // L130
  gb.text('officeTelno', 120, '사무실 번호', { editor: 'text' }),  // L131
  gb.text('companyNm', 180, '회사이름', { editor: 'text' }),  // L132
  gb.text('posNm', 100, '직위', { editor: 'text' }),  // L133
  gb.text('note', 500, '비고', { editor: 'text' }),  // L134
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={deleteChk}>삭제</Button>
5. <Button type="group" onClick={() => /* 인라인 L116-122 (new SelectHandler() { @Override publi…) */}>그룹설정</Button>

