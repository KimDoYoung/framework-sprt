# Emp10_Lookup_MailAddress

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `dcr`
- 파일: `client/vi/emp/Emp10_Lookup_MailAddress.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Emp57_Lookup_List`](../../emp/components/Emp57_Lookup_List.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `emp.Emp00_TransInfo.selectByText` | Emp10_Lookup_MailAddress:266 | [`Emp00_TransInfo.java:33`](../../emp/services/Emp00_TransInfo.md) | [`emp00_trans_info.selectByText`](../../emp/sql/emp00_trans_info.md) |
| `emp.Emp10_AddrBook.selectByPublicText` | Emp10_Lookup_MailAddress:285 | [`Emp10_AddrBook.java:52`](../../emp/services/Emp10_AddrBook.md) | [`emp10_addr_book.selectByPublicText`](../../emp/sql/emp10_addr_book.md) |
| `emp.Emp10_AddrBook.selectByText` | Emp10_Lookup_MailAddress:244 | [`Emp10_AddrBook.java:43`](../../emp/services/Emp10_AddrBook.md) | [`emp10_addr_book.selectByText`](../../emp/sql/emp10_addr_book.md) |

## 테이블

[`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md), [`emp08_license`](../../../db/tables/emp.md), [`emp10_addr_book`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys01_company`](../../../db/tables/sys.md), [`sys04_role`](../../../db/tables/sys.md), [`sys05_user_role`](../../../db/tables/sys.md), [`sys06_menu`](../../../db/tables/sys.md), [`sys07_role_menu`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_emp_kor_nm`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_org_parent_info_nm`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Emp10_Lookup_MailAddress (`client/vi/emp/Emp10_Lookup_MailAddress.java`, 299줄)

- 툴바 `buttonBar`: 검색어: {searchText} {retrieveButton} {groupButton}
- 입력·하위 화면: `searchText` TextField, `lookup` Emp57_Lookup_List
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
[E0] 화면 열림 (생성자 L55-57) → init()
[E1] searchText.KeyPress [Enter] (L149) → retrieve()
[E2] closeButton[닫기].Select (L157) → hide()
[E3] confirmButton[확인].Select (L163) → hide()
[E4] retrieveButton[검색].Select (L197) → retrieve()
[E5] groupButton[그룹].Select [result != null] (L203) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L64-70 | 공개 메서드 | 상태 처리 | 업무 |
| public buildEmpGrid() | L85-95 | 필드 초기화 | 상태 처리 | 업무 |
| public buildPublicGrid() | L97-108 | 필드 초기화 | 상태 처리 | 업무 |
| private init() | L110-113 | 생성자 | 상태 처리 | 업무 |
| private makeButtonEvent() | L148-218 | init | 조회창 Emp57_Lookup_List 열기 | 업무 |
| private retrieve() | L220-230 | E1,E4,open | 상태 처리 | 업무 |
| private retrieveAddressGrid() | L232-250 | retrieve | 서비스 emp.Emp10_AddrBook.selectByText(personId, searchText) | 업무 |
| private retrievePersonGrid() | L252-271 | open,retrieve | 서비스 emp.Emp00_TransInfo.selectByText(companyId, transCode, transDate, searchText) | 업무 |
| public retrievePublicAddressGrid() | L273-291 | open,retrieve | 서비스 emp.Emp10_AddrBook.selectByPublicText(searchText, companyId) | 업무 |
| private makeLayout() | L115-146 | init | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L72-83 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L293-295 | makeLayout | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L296-298 | makeLayout | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('companyNm', 120, '회사이름'),  // L76
  gb.text('contacterNm', 120, '담당자명'),  // L77
  gb.text('emailAddr', 120, '이메일'),  // L78
  gb.text('mobileTelno', 120, '핸드폰 번호'),  // L79
  gb.text('officeTelno', 120, '사무실 번호'),  // L80
];

const buildEmpGrid = () => [
  gb.text('parentFullNm', 200, '부서명'),  // L89
  gb.text('korNm', 100, '성명'),  // L90
  gb.text('posNm', 100, '직위'),  // L91
  gb.text('emailAddr', 150, '이메일주소'),  // L92
];

const buildPublicGrid = () => [
  gb.text('companyNm', 120, '회사이름'),  // L101
  gb.text('contacterNm', 120, '담당자명'),  // L102
  gb.text('emailAddr', 120, '이메일'),  // L103
  gb.text('mobileTelno', 120, '핸드폰 번호'),  // L104
  gb.text('officeTelno', 120, '사무실 번호'),  // L105
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>검색</Button>
2. <Button type="group" onClick={hide}>그룹</Button>
3. <Button type="save" onClick={hide}>확인</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

