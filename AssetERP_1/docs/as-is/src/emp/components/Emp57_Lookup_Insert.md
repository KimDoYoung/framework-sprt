# Emp57_Lookup_Insert

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `bbs`
- 파일: `client/vi/emp/Emp57_Lookup_Insert.java`
- 함께 쓰는 클래스 3개:
  - `Emp57_TabPage_Insert` `client/vi/emp/Emp57_TabPage_Insert.java`
  - `Emp10_Lookup_List` `client/vi/emp/Emp10_Lookup_List.java`
  - `Emp57_Edit_GroupName` `client/vi/emp/Emp57_Edit_GroupName.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `emp.Emp00_TransInfo.selectByText` | Emp10_Lookup_List:249 | [`Emp00_TransInfo.java:33`](../../emp/services/Emp00_TransInfo.md) | [`emp00_trans_info.selectByText`](../../emp/sql/emp00_trans_info.md) |
| `emp.Emp10_AddrBook.selectByPublicText` | Emp10_Lookup_List:268 | [`Emp10_AddrBook.java:52`](../../emp/services/Emp10_AddrBook.md) | [`emp10_addr_book.selectByPublicText`](../../emp/sql/emp10_addr_book.md) |
| `emp.Emp10_AddrBook.selectByText` | Emp10_Lookup_List:227 | [`Emp10_AddrBook.java:43`](../../emp/services/Emp10_AddrBook.md) | [`emp10_addr_book.selectByText`](../../emp/sql/emp10_addr_book.md) |
| `emp.Emp57_AddrBookGroup.delete` | Emp57_TabPage_Insert:146 | [`Emp57_AddrBookGroup.java:82`](../../emp/services/Emp57_AddrBookGroup.md) | `UpdateDataModel(emp57_addr_book_group)` 동적 DELETE |
| `emp.Emp57_AddrBookGroup.deleteAll` | Emp57_Lookup_Insert:200 | [`Emp57_AddrBookGroup.java:58`](../../emp/services/Emp57_AddrBookGroup.md) | [`emp57_addr_book_group.deleteAll`](../../emp/sql/emp57_addr_book_group.md) |
| `emp.Emp57_AddrBookGroup.getPersonList` | Emp57_Lookup_Insert:137 | [`Emp57_AddrBookGroup.java:36`](../../emp/services/Emp57_AddrBookGroup.md) | [`emp57_addr_book_group.getPersonList`](../../emp/sql/emp57_addr_book_group.md) |
| `emp.Emp57_AddrBookGroup.modelUpdate` | Emp57_Edit_GroupName:149 | [`Emp57_AddrBookGroup.java:64`](../../emp/services/Emp57_AddrBookGroup.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(emp57_addr_book_group)` 동적 INSERT/UPDATE → [`emp57_addr_book_group.selectById`](../../emp/sql/emp57_addr_book_group.md) |
| `emp.Emp57_AddrBookGroup.selectByParentId` | Emp57_TabPage_Insert:176 | [`Emp57_AddrBookGroup.java:26`](../../emp/services/Emp57_AddrBookGroup.md) | [`emp57_addr_book_group.selectByParentId`](../../emp/sql/emp57_addr_book_group.md) |
| `emp.Emp57_AddrBookGroup.update` | Emp57_TabPage_Insert:161 | [`Emp57_AddrBookGroup.java:77`](../../emp/services/Emp57_AddrBookGroup.md) | `UpdateDataModel(emp57_addr_book_group)` 동적 INSERT/UPDATE → [`emp57_addr_book_group.selectById`](../../emp/sql/emp57_addr_book_group.md) |

## 테이블

[`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md), [`emp08_license`](../../../db/tables/emp.md), [`emp10_addr_book`](../../../db/tables/emp.md), [`emp57_addr_book_group`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys01_company`](../../../db/tables/sys.md), [`sys04_role`](../../../db/tables/sys.md), [`sys05_user_role`](../../../db/tables/sys.md), [`sys06_menu`](../../../db/tables/sys.md), [`sys07_role_menu`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_emp_kor_nm`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_org_parent_info_nm`, `f_sysdate`, `f_today`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Emp57_Lookup_Insert (`client/vi/emp/Emp57_Lookup_Insert.java`, 216줄)

- 툴바 `buttonBar`: {insertButton} {deleteButton}
- 입력·하위 화면: `tabPage` Emp57_TabPage_Insert, `lookup` Emp57_Edit_GroupName
- 그리드 `grid` (buildGrid()):
  - actionCell 40 "수정" Cell 편집:actionCell
  - groupName 230 "그룹명" Text
  - publicYn 70 "전체공개" BooleanYn2
  - personName 100 "등록자" TextCenter

#### 이벤트
[E1] insertButton[등록].Select (L84) → insertRow()
[E2] deleteButton[삭제].Select (L90) → deleteRow()
       └ [E5] msgBox.DialogHide [YES] (L161) → deleteAll()
       └ [E6] msgBox.DialogHide [YES] (L180) → deleteAll()
[E3] cancelButton[닫기].Select (L96) → hide()
[E4] grid.RowClick (L102) → 인라인 L102-107 (new RowClickHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L50-79 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L134-143 | open,buildGrid,insertRow,deleteAll | 서비스 emp.Emp57_AddrBookGroup.getPersonList(personId) | 업무 |
| private insertRow() | L145-153 | E1 | 팝업 Emp57_Edit_GroupName 열기 | 업무 |
| private deleteRow() | L155-197 | E2 | ConfirmBox → E5 | 업무 |
| private deleteAll() | L199-211 | E5,E6 | 서비스 emp.Emp57_AddrBookGroup.deleteAll | 업무 |
| private settings() | L81-108 | open | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L110-132 | 필드 초기화 | 팝업 Emp57_Edit_GroupName 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L213-215 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L127) addCell
  gb.text('groupNm', 230, '그룹명'),  // L128
  gb.booleanYn2('publicYn', 70, '전체공개'),  // L129
  gb.textCenter('personNm', 100, '등록자'),  // L130 SQL 계산 컬럼(getPersonList: f_emp_kor_nm(emp57_person_id))
];
```

#### 사용된 버튼들
1. <Button type="register" onClick={insertRow}>등록</Button>
2. <Button type="delete" onClick={deleteRow}>삭제</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

### Emp57_TabPage_Insert (`client/vi/emp/Emp57_TabPage_Insert.java`, 184줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: {insertButton} {updateButton} {deleteButton}
- 입력·하위 화면: `lookup` Emp10_Lookup_List
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - parentGubun 50 "구분" TextCenter
  - parentName 250 "담당자/사원명" Text
  - emailAddress 220 "이메일" Text
  - mobileTelNo 120 "핸드폰 번호" Text
  - note 500 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L46-61) → settings()
[E1] insertButton[등록].Select (L66) → insertRow()
[E2] updateButton[저장].Select (L72) → update()
[E3] deleteButton[삭제].Select (L78) → deleteRow()
       └ [E4] msgBox.DialogHide [YES] (L139) → 서비스 emp.Emp57_AddrBookGroup.delete

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private insertRow() | L99-134 | E1 | 조회창 Emp10_Lookup_List 열기 | 업무 |
| private deleteRow() | L136-157 | E3 | ConfirmBox → E4 | 업무 |
| private update() | L159-162 | E2 | 서비스 emp.Emp57_AddrBookGroup.update | 업무 |
| public retrieve() | L164-182 | 공개 메서드 | 서비스 emp.Emp57_AddrBookGroup.selectByParentId(companyId, parentId) | 업무 |
| private settings() | L63-85 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L87-97 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('parentGubun', 50, '구분'),  // L90 SQL 계산 컬럼(selectByParentId: emp57.parent_gubun)
  gb.text('parentNm', 250, '담당자/사원명'),  // L91 SQL 계산 컬럼(selectByParentId: emp57.parent_nm)
  gb.text('emailAddr', 220, '이메일'),  // L92 SQL 계산 컬럼(selectByParentId: emp57.email_addr)
  gb.text('mobileTelno', 120, '핸드폰 번호'),  // L93 SQL 계산 컬럼(selectByParentId: emp57.mobile_telno)
  gb.text('note', 500, '비고', { editor: 'text' }),  // L94
];
```

#### 사용된 버튼들
1. <Button type="register" onClick={insertRow}>등록</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="delete" onClick={deleteRow}>삭제</Button>

### Emp10_Lookup_List (`client/vi/emp/Emp10_Lookup_List.java`, 282줄)

- 툴바 `buttonBar`: 검색어: {searchText} {retrieveButton}
- 입력·하위 화면: `searchText` TextField
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - companyName 120 "회사이름" Text
  - contactName 120 "담당자명" Text
  - emailAddress 120 "이메일" Text
  - mobileTelNo 120 "핸드폰 번호" Text
  - officeTelNo 120 "사무실 번호" Text
- 그리드 `personGrid` (buildEmpGrid(), 체크박스(다중)):
  - parentFullName 200 "부서명" Text
  - empKorName 100 "성명" Text
  - posName 100 "직위" Text
  - emailAddress 150 "이메일주소" Text
- 그리드 `publicGrid` (buildPublicGrid(), 체크박스(다중)):
  - companyName 120 "회사이름" Text
  - contactName 120 "담당자명" Text
  - emailAddress 120 "이메일" Text
  - mobileTelNo 120 "핸드폰 번호" Text
  - officeTelNo 120 "사무실 번호" Text

#### 이벤트
[E0] 화면 열림 (생성자 L62-64) → init()
[E1] searchText.KeyPress [Enter] (L146) → retrieve()
[E2] closeButton[닫기].Select (L154) → hide()
[E3] confirmButton[확인].Select (L160) → hide()
[E4] retrieveButton[검색].Select (L195) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public insert() | L54-60 | 공개 메서드 | 상태 처리 | 업무 |
| public buildEmpGrid() | L84-94 | 필드 초기화 | 상태 처리 | 업무 |
| public buildPublicGrid() | L96-107 | 필드 초기화 | 상태 처리 | 업무 |
| private init() | L109-112 | 생성자 | 상태 처리 | 업무 |
| private makeButtonEvent() | L145-201 | init | 상태 처리 | 업무 |
| private retrieve() | L203-213 | E1,E4,insert | 상태 처리 | 업무 |
| private retrieveAddressGrid() | L215-233 | retrieve | 서비스 emp.Emp10_AddrBook.selectByText(personId, searchText) | 업무 |
| private retrievePersonGrid() | L235-254 | insert,retrieve | 서비스 emp.Emp00_TransInfo.selectByText(companyId, transCode, transDate, searchText) | 업무 |
| public retrievePublicAddressGrid() | L256-274 | insert,retrieve | 서비스 emp.Emp10_AddrBook.selectByPublicText(searchText, companyId) | 업무 |
| private makeLayout() | L114-143 | init | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L71-82 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L276-278 | makeLayout | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L279-281 | makeLayout | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('companyNm', 120, '회사이름'),  // L75
  gb.text('contacterNm', 120, '담당자명'),  // L76
  gb.text('emailAddr', 120, '이메일'),  // L77
  gb.text('mobileTelno', 120, '핸드폰 번호'),  // L78
  gb.text('officeTelno', 120, '사무실 번호'),  // L79
];

const buildEmpGrid = () => [
  gb.text('parentFullNm', 200, '부서명'),  // L88
  gb.text('korNm', 100, '성명'),  // L89
  gb.text('posNm', 100, '직위'),  // L90
  gb.text('emailAddr', 150, '이메일주소'),  // L91
];

const buildPublicGrid = () => [
  gb.text('companyNm', 120, '회사이름'),  // L100
  gb.text('contacterNm', 120, '담당자명'),  // L101
  gb.text('emailAddr', 120, '이메일'),  // L102
  gb.text('mobileTelno', 120, '핸드폰 번호'),  // L103
  gb.text('officeTelno', 120, '사무실 번호'),  // L104
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>검색</Button>
2. <Button type="save" onClick={hide}>확인</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

### Emp57_Edit_GroupName (`client/vi/emp/Emp57_Edit_GroupName.java`, 169줄)

- 입력·하위 화면: `groupName` TextField, `publicYn` CheckBox

#### 이벤트
[E1] updateButton[저장].Select (L96) → updateChk()
       └ [E3] msgBox.DialogHide [YES] (L127) → update()
[E2] closeButton[닫기].Select (L102) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public insert() | L46-72 | 공개 메서드 | 상태 처리 | 업무 |
| public edit() | L74-93 | 공개 메서드 | 상태 처리 | 업무 |
| private getEditor() | L110-119 | insert,edit | 상태 처리 | 업무 |
| private updateChk() | L121-146 | E1 | ConfirmBox → E3 | 업무 |
| private update() | L148-160 | E3,updateChk | 서비스 emp.Emp57_AddrBookGroup.modelUpdate | 업무 |
| private settings() | L95-108 | insert,edit | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L162-164 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L166-168 | insert,edit | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={updateChk}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

