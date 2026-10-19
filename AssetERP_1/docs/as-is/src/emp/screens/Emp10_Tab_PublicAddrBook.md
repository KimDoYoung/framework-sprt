# Emp10_Tab_PublicAddrBook

- 종류: 화면
- 메뉴: 문서작성 > 05. 메일관리 > 공용주소록 관리 (#1211)
- 파일: `client/vi/emp/Emp10_Tab_PublicAddrBook.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Emp57_Lookup_Insert`](../../emp/components/Emp57_Lookup_Insert.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `emp.Emp10_AddrBook.delete` | Emp10_Tab_PublicAddrBook:197 | [`Emp10_AddrBook.java:70`](../../emp/services/Emp10_AddrBook.md) | `UpdateDataModel(emp10_addr_book)` 동적 DELETE |
| `emp.Emp10_AddrBook.selectByPublicText` | Emp10_Tab_PublicAddrBook:145 | [`Emp10_AddrBook.java:52`](../../emp/services/Emp10_AddrBook.md) | [`emp10_addr_book.selectByPublicText`](../../emp/sql/emp10_addr_book.md) |
| `emp.Emp10_AddrBook.update` | Emp10_Tab_PublicAddrBook:157 | [`Emp10_AddrBook.java:61`](../../emp/services/Emp10_AddrBook.md) | `UpdateDataModel(emp10_addr_book)` 동적 INSERT/UPDATE → [`emp10_addr_book.selectById`](../../emp/sql/emp10_addr_book.md) |

## 테이블

[`emp01_person`](../../../db/tables/emp.md), [`emp10_addr_book`](../../../db/tables/emp.md)

## DB 함수

`f_emp_kor_nm`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Emp10_Tab_PublicAddrBook (`client/vi/emp/Emp10_Tab_PublicAddrBook.java`, 203줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 검색: {searchText} {retrieveButton} {insertButton} {updateButton} {deleteButton} {groupButton}
- 입력·하위 화면: `searchText` TextField 빈칸="담당자명/회사이름/비고", `lookup` Emp57_Lookup_Insert
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - contactName 100 "담당자명" Text 편집:TextField
  - emailAddress 220 "이메일" Text 편집:TextField
  - mobileTelNo 120 "핸드폰 번호" Text 편집:TextField
  - officeTelNo 120 "사무실 번호" Text 편집:TextField
  - companyName 180 "회사이름" Text 편집:TextField
  - posName 100 "직위" Text 편집:TextField
  - note 500 "비고" Text 편집:TextField
  - personName 100 "등록자" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L51-78) → settings(), retrieve()
[E1] searchText.KeyPress [Enter] (L83) → retrieve()
[E2] retrieveButton[조회].Select (L91) → retrieve()
[E3] insertButton[등록].Select (L97) → insertRow()
[E4] updateButton[저장].Select (L103) → update()
[E5] deleteButton[삭제].Select (L109) → deleteChk()
       └ [E7] msgBox.DialogHide [YES] (L171) → deleteRow()
[E6] groupButton[그룹설정].Select (L115) → 인라인 L115-121 (new SelectHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L140-152 | 생성자,E1,E2 | 서비스 emp.Emp10_AddrBook.selectByPublicText(searchText, companyId) | 업무 |
| public update() | L154-158 | E4 | 서비스 emp.Emp10_AddrBook.update(personId) | 업무 |
| public insertRow() | L160-166 | E3 | 상태 처리 | 업무 |
| private deleteChk() | L168-186 | E5 | ConfirmBox → E7 | 업무 |
| public deleteRow() | L188-198 | E7 | GridDeleteData emp.Emp10_AddrBook.delete(체크된 행 목록) | 업무 |
| private settings() | L80-122 | 생성자 | 조회창 Emp57_Lookup_Insert 열기, 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L124-137 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L200-202 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('contacterNm', 100, '담당자명', { editor: 'text' }),  // L127
  gb.text('emailAddr', 220, '이메일', { editor: 'text' }),  // L128
  gb.text('mobileTelno', 120, '핸드폰 번호', { editor: 'text' }),  // L129
  gb.text('officeTelno', 120, '사무실 번호', { editor: 'text' }),  // L130
  gb.text('companyNm', 180, '회사이름', { editor: 'text' }),  // L131
  gb.text('posNm', 100, '직위', { editor: 'text' }),  // L132
  gb.text('note', 500, '비고', { editor: 'text' }),  // L133
  gb.textCenter('personNm', 100, '등록자'),  // L134 SQL 계산 컬럼(selectByPublicText: f_emp_kor_nm(emp10_person_id))
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={deleteChk}>삭제</Button>
5. <Button type="group" onClick={() => /* 인라인 L115-121 (new SelectHandler() { @Override publi…) */}>그룹설정</Button>

