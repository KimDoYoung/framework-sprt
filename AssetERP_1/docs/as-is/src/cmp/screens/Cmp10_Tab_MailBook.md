# Cmp10_Tab_MailBook

- 종류: 화면
- 메뉴: 문서작성 > 05. 메일관리 > 공용메일 관리 (#1212)
- 메뉴 키: `Cmp10_Tab_SubMailBook`
- 파일: `client/vi/cmp/Cmp10_Tab_MailBook.java`
- 함께 쓰는 클래스 2개:
  - `Cmp10_Tab_MailBookList` `client/vi/cmp/Cmp10_Tab_MailBookList.java`
  - `Cmp10_Edit_Tab_MailBook` `client/vi/cmp/Cmp10_Edit_Tab_MailBook.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Emp01_Lookup_PersonModel`](../../emp/components/Emp01_Lookup_PersonModel.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `cmp.Cmp10_MailBook.delete` | Cmp10_Tab_MailBook:199 | [`Cmp10_MailBook.java:73`](../../cmp/services/Cmp10_MailBook.md) | `UpdateDataModel(cmp10_mail_book)` 동적 DELETE |
| `cmp.Cmp10_MailBook.modelUpdate` | Cmp10_Edit_Tab_MailBook:188 | [`Cmp10_MailBook.java:38`](../../cmp/services/Cmp10_MailBook.md) | [`cmp10_mail_book.createPassword`](../../cmp/sql/cmp10_mail_book.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(cmp10_mail_book)` 동적 INSERT/UPDATE → [`cmp10_mail_book.selectById`](../../cmp/sql/cmp10_mail_book.md) |
| `cmp.Cmp10_MailBook.selectByCompanyId` | Cmp10_Tab_MailBook:138 | [`Cmp10_MailBook.java:26`](../../cmp/services/Cmp10_MailBook.md) | [`cmp10_mail_book.selectByCompanyId`](../../cmp/sql/cmp10_mail_book.md) |
| `cmp.Cmp11_MailRole.delete` | Cmp10_Tab_MailBookList:209 | [`Cmp11_MailRole.java:62`](../../cmp/services/Cmp11_MailRole.md) | `UpdateDataModel(cmp11_mail_role)` 동적 DELETE |
| `cmp.Cmp11_MailRole.deleteByMailBookId` | Cmp10_Tab_MailBook:190 | [`Cmp11_MailRole.java:28`](../../cmp/services/Cmp11_MailRole.md) | [`cmp11_mail_role.deleteByMailBookId`](../../cmp/sql/cmp11_mail_role.md) |
| `cmp.Cmp11_MailRole.selectByRoleId` | Cmp10_Tab_MailBookList:136 | [`Cmp11_MailRole.java:21`](../../cmp/services/Cmp11_MailRole.md) | [`cmp11_mail_role.selectByRoleId`](../../cmp/sql/cmp11_mail_role.md) |
| `cmp.Cmp11_MailRole.updateList` | Cmp10_Tab_MailBookList:182 | [`Cmp11_MailRole.java:33`](../../cmp/services/Cmp11_MailRole.md) | [`cmp11_mail_role.checkPerson`](../../cmp/sql/cmp11_mail_role.md), [`cmp11_mail_role.insert`](../../cmp/sql/cmp11_mail_role.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`) |
| `utils.mail.SendMailSMTP.checkCompanyMail` | Cmp10_Edit_Tab_MailBook:128 | [`SendMailSMTP.java:780`](../../utils/services/mail.SendMailSMTP.md) | [`sys01_company.selectById`](../../sys/sql/sys01_company.md) |

## 테이블

[`cmp10_mail_book`](../../../db/tables/cmp.md), [`cmp11_mail_role`](../../../db/tables/cmp.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`org00_org_info`](../../../db/views.md), [`sys01_company`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_code_seq`, `f_get_emptrans`, `f_org_seq`, `f_sysdate`, `f_today`, `to_decrypts`, `to_encrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Cmp10_Tab_MailBook (`client/vi/cmp/Cmp10_Tab_MailBook.java`, 208줄)

- 레이아웃: west=cp, center=mailBookList
- 툴바 `buttonBar`: {retrieveButton} {insertButton} {deleteButton}
- 입력·하위 화면: `mailBookList` Cmp10_Tab_MailBookList, `lookup` Cmp10_Edit_Tab_MailBook
- 그리드 `grid` (buildGrid()):
  - emailAddr 220 "이메일" Text
  - note 500 "비고" Text
  - actionCell 60 "수정" Cell 편집:editCell

#### 이벤트
[E0] 화면 열림 (생성자 L48-80) → settings(), retrieve()
[E1] retrieveButton[조회].Select (L85) → retrieve()
[E2] insertButton[등록].Select (L91) → insert()
[E3] deleteButton[삭제].Select (L97) → deleteCheck()
       └ [E5] msgBox.DialogHide [YES] (L169) → delete()
[E4] grid.SelectionChanged (L103) → retrieveMailBookList()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L133-147 | 생성자,E1,buildGrid,insert,delete | 서비스 cmp.Cmp10_MailBook.selectByCompanyId(companyId) | 업무 |
| private retrieveMailBookList() | L149-154 | E4 | 상태 처리 | 업무 |
| public insert() | L156-164 | E2 | 팝업 Cmp10_Edit_Tab_MailBook 열기 | 업무 |
| public deleteCheck() | L166-185 | E3 | ConfirmBox → E5 | 업무 |
| public delete() | L187-207 | E5 | GridDeleteData cmp.Cmp11_MailRole.deleteByMailBookId, cmp.Cmp10_MailBook.delete(체크된 행 목록) | 업무 |
| private settings() | L82-109 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L111-131 | 필드 초기화 | 팝업 Cmp10_Edit_Tab_MailBook 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('emailAddr', 220, '이메일'),  // L126
  gb.text('note', 500, '비고'),  // L127
  // ⚠ 대응 없음 (GridBuilder L128) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insert}>등록</Button>
3. <Button type="delete" onClick={deleteCheck}>삭제</Button>

### Cmp10_Tab_MailBookList (`client/vi/cmp/Cmp10_Tab_MailBookList.java`, 215줄)

- 툴바 `buttonBar`: 사원정보: {retrieveButton} {insertButton} {updateButton} {deleteButton}
- 입력·하위 화면: `popup` Emp01_Lookup_PersonModel
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - orgName 160 "조직" Text
  - titleName 100 "직책" Text
  - empNo 80 "사번" Text
  - empKorName 80 "성명" Text

#### 이벤트
[E0] 화면 열림 (생성자 L51-64) → settings(), retrieve()
[E1] retrieveButton[조회].Select (L67) → retrieve()
[E2] insertButton[등록].Select (L73) → insertRow()
[E3] updateButton[저장].Select (L79) → update()
[E4] deleteButton[삭제].Select [YES] (L85) → deleteRow()
[E5] msgBox.DialogHide [YES] (L90) → deleteRow()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L120-122 | 생성자,E1,update | 상태 처리 | 업무 |
| public retrieve() | L124-138 | 생성자,E1,update | 서비스 cmp.Cmp11_MailRole.selectByRoleId(mailBookId) | 업무 |
| private insertRow() | L140-168 | E2 | 조회창 Emp01_Lookup_PersonModel 열기 | 업무 |
| public update() | L170-204 | E3 | 서비스 cmp.Cmp11_MailRole.updateList | 업무 |
| public deleteRow() | L206-210 | E4,E5 | GridDeleteData cmp.Cmp11_MailRole.delete(체크된 행 목록) | 업무 |
| private settings() | L66-107 | 생성자 | 확인창 표시, 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L109-118 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L212-214 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('korNm', 160, '조직'),  // L112
  gb.text('titleNm', 100, '직책'),  // L113
  gb.text('empNo', 80, '사번'),  // L114
  gb.text('korNm', 80, '성명'),  // L115
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={deleteRow}>삭제</Button>

### Cmp10_Edit_Tab_MailBook (`client/vi/cmp/Cmp10_Edit_Tab_MailBook.java`, 213줄)

- 입력·하위 화면: `emailAddr` TextField, `decPassword` PasswordField, `note` MyTextArea

#### 이벤트
[E0] 화면 열림 (생성자 L77-124) → show()
[E1] checkButton[검증].Select (L84) → checkMail()
       └ [E3] msgBox.DialogHide [YES] (L147) → update()
[E2] closeButton[닫기].Select (L90) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public edit() | L54-63 | 공개 메서드 | 상태 처리 | 업무 |
| public insert() | L65-75 | 공개 메서드 | 상태 처리 | 업무 |
| private checkMail() | L126-182 | E1 | ConfirmBox → E3 | 업무 |
| private update() | L184-200 | E3 | 서비스 cmp.Cmp10_MailBook.modelUpdate(password) | 업무 |
| private setHtmlStyle() | L202-204 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L206-208 | edit,insert | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlButtonBottomStyle() | L210-212 | checkMail | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={checkMail}>검증</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

