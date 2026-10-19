# Adv05_Tab_OrgAuth

- 종류: 화면
- 메뉴: 펀드관리 > 03. 일임(자문)관리 > 일임계좌 권한설정 (#1389)
- 파일: `client/vi/adv/Adv05_Tab_OrgAuth.java`
- 함께 쓰는 클래스 2개:
  - `Adv05_Page_OrgAuth` `client/vi/adv/Adv05_Page_OrgAuth.java`
  - `Adv05_Lookup_OrgAuth` `client/vi/adv/Adv05_Lookup_OrgAuth.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Adv02_Lookup_SelectMulti`](../../adv/components/Adv02_Lookup_SelectMulti.md), [`Org00_Lookup_SelectMulti`](../../org/components/Org00_Lookup_SelectMulti.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `adv.Adv02_Account.selectByManageNamePaging` | Adv05_Tab_OrgAuth:60 | [`Adv02_Account.java:32`](../../adv/services/Adv02_Account.md) | [`adv02_account.selectByManageNamePaging`](../../adv/sql/adv02_account.md), [`adv02_account.selectByManageNamePagingTotal`](../../adv/sql/adv02_account.md) |
| `adv.Adv05_OrgAuth.updateAuthYn` | Adv05_Lookup_OrgAuth:303 | [`Adv05_OrgAuth.java:29`](../../adv/services/Adv05_OrgAuth.md) | [`adv05_org_auth.checkOrgAuth`](../../adv/sql/adv05_org_auth.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(adv05_org_auth)` 동적 INSERT/UPDATE → [`adv05_org_auth.selectById`](../../adv/sql/adv05_org_auth.md) |
| `org.Org01_Code.selectByAccountId` | Adv05_Page_OrgAuth:100 | [`Org01_Code.java:244`](../../org/services/Org01_Code.md) | [`org01_code.selectByAccountId`](../../org/sql/org01_code.md) |
| `org.Org01_Code.updateAccountAuth` | Adv05_Page_OrgAuth:139 | [`Org01_Code.java:409`](../../org/services/Org01_Code.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(adv05_org_auth)` 동적 INSERT/UPDATE → [`adv05_org_auth.selectById`](../../adv/sql/adv05_org_auth.md) |

## 테이블

[`adv02_account`](../../../db/tables/adv.md), [`adv05_org_auth`](../../../db/tables/adv.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md)

## DB 함수

`f_sysdate`, `f_today`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Adv05_Tab_OrgAuth (`client/vi/adv/Adv05_Tab_OrgAuth.java`, 174줄)

- 레이아웃: north=buttonBar, west=vlcGrid, center=tabPage
- 툴바 `buttonBar`: 검색: {searchText} {retrieveButton} {authAllButton}
- 입력·하위 화면: `searchText` TextField 빈칸="관리코드/계좌명", `tabPage` Adv05_Page_OrgAuth, `lookup` Adv05_Lookup_OrgAuth
- 그리드 `grid` (buildGrid(), 체크박스):
  - manageCode 150 "관리코드" TextCenter
  - manageName 300 "계좌명" Text
  - trCorpCode 150 "증권사코드" Text
  - trCorpName 150 "증권사명" Text
  - accountNoDec 300 "계좌번호" Text
  - startDate 90 "최초설정일자" Date
  - closeDate 90 "해지일자" Date
  - workDate 90 "작업일시" Date
  - worker 90 "작업자" Text

#### 이벤트
[E0] 화면 열림 (생성자 L45-82) → settings()
[E1] searchText.KeyPress [Enter] (L89) → retrieve()
[E2] retrieveButton[조회].Select (L98) → retrieve()
[E3] authAllButton[일괄 권한설정].Select (L104) → retrieve()
[E4] grid.RowClick (L116) → retrieveEditPage()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieveEditPage() | L140-146 | E4 | 상태 처리 | 업무 |
| public retrieve() | L148-169 | E1,E2,E3 | 상태 처리 | 업무 |
| private settings() | L84-122 | 생성자 | 조회창 Adv05_Lookup_OrgAuth 열기, 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L124-138 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L171-173 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('manageCd', 150, '관리코드'),  // L127
  gb.text('manageNm', 300, '계좌명'),  // L128
  gb.text('trCorpCd', 150, '증권사코드'),  // L129
  gb.text('trCorpNm', 150, '증권사명'),  // L130
  gb.text('accountNoDec', 300, '계좌번호'),  // L131 SQL 계산 컬럼(selectByManageNamePaging: TO_DECRYPTS(adv02_account_no))
  gb.date('startDate', 90, '최초설정일자'),  // L132
  gb.date('closeDate', 90, '해지일자'),  // L133
  gb.date('workDate', 90, '작업일시'),  // L134
  gb.text('worker', 90, '작업자'),  // L135
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={retrieve}>일괄 권한설정</Button>

### Adv05_Page_OrgAuth (`client/vi/adv/Adv05_Page_OrgAuth.java`, 151줄)

- 그리드 `treeGrid` (buildTreeGrid(), 트리):
  - korName 300 "조직명" Text
  - orgCode 60 "조직코드" Text
  - authYnAccount 40 "권한" Boolean
  - note 300 "비고" Text

#### 이벤트
[E0] 화면 열림 (생성자 L33-45) → settings()
[E1] updateButton[저장].Select (L48) → update()
[E2] treeGrid.CellMouseDown [event.getRowIndex() >= 0] (L54) → getColumn()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private getColumn() | L66-88 | E2 | 상태 처리 | 업무 |
| public buildTreeGrid() | L90-97 | 필드 초기화 | 상태 처리 | 업무 |
| public retrieve() | L99-105 | update | 서비스 org.Org01_Code.selectByAccountId | 업무 |
| private addChildItem() | L107-116 | getServiceResult | 상태 처리 | 업무 |
| public getServiceResult() | L119-133 | 공개 메서드 | 상태 처리 | 업무 |
| private update() | L135-145 | E1 | 서비스 org.Org01_Code.updateAccountAuth(accountId) | 업무 |
| public retrieve() | L147-150 | update | 상태 처리 | 업무 |
| private settings() | L47-64 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |

#### Grid Spec
```javascript
const buildTreeGrid = () => [
  gb.text('korNm', 300, '조직명'),  // L92
  gb.text('orgCd', 60, '조직코드'),  // L93
  gb.boolean('authYn', 40, '권한'),  // L94
  gb.text('note', 300, '비고'),  // L95
];
```

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>

### Adv05_Lookup_OrgAuth (`client/vi/adv/Adv05_Lookup_OrgAuth.java`, 334줄)

- 툴바 `buttonBar01`: 일임계좌: {insertButton01} {deleteButton01}
- 툴바 `buttonBar02`: 부서: {insertButton02} {deleteButton02}
- 입력·하위 화면: `lookup` Adv02_Lookup_SelectMulti
- 그리드 `grid01` (buildGrid01(), 체크박스(다중)):
  - manageCode 100 "관리코드" TextCenter
  - manageName 150 "계좌명" Text
  - trCorpCode 100 "증권사코드" Text
  - trCorpName 100 "증권사명" Text
  - accountNoDec 150 "계좌번호" Text
- 그리드 `grid02` (buildGrid02(), 체크박스(다중)):
  - korName 300 "조직명" Text
  - orgCode 60 "조직코드" Text

#### 이벤트
[E0] 화면 열림 (생성자 L75-120) → settings()
[E1] insertButton01[행 추가].Select (L123) → insertRow01()
[E2] deleteButton01[행 삭제].Select (L129) → deleteRow01()
[E3] insertButton02[행 추가].Select (L135) → insertRow02()
[E4] deleteButton02[행 삭제].Select (L141) → deleteRow02()
[E5] confirmButton[권한부여].Select (L147) → confirm()
       └ [E8] msgBox.DialogHide [YES] (L296) → hide()
[E6] cancleButton[권한삭제].Select (L154) → confirm()
[E7] closeButton[닫기].Select (L160) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L70-73 | 공개 메서드 | 상태 처리 | 업무 |
| public buildGrid01() | L168-178 | 필드 초기화 | 상태 처리 | 업무 |
| private insertRow01() | L180-208 | E1 | 조회창 Adv02_Lookup_SelectMulti 열기 | 업무 |
| private deleteRow01() | L210-215 | E2 | 상태 처리 | 업무 |
| public buildGrid02() | L217-224 | 필드 초기화 | 상태 처리 | 업무 |
| private insertRow02() | L226-251 | E3 | 조회창 Org00_Lookup_SelectMulti 열기 | 업무 |
| private deleteRow02() | L253-258 | E4 | 상태 처리 | 업무 |
| private confirm() | L260-325 | E5,E6 | ConfirmBox → E8 | 업무 |
| private settings() | L122-166 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlBarStyle() | L327-329 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L331-333 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid01 = () => [
  gb.textCenter('manageCd', 100, '관리코드'),  // L171
  gb.text('manageNm', 150, '계좌명'),  // L172
  gb.text('trCorpCd', 100, '증권사코드'),  // L173
  gb.text('trCorpNm', 100, '증권사명'),  // L174
  gb.text('accountNoDec', 150, '계좌번호'),  // L175 SQL 계산 컬럼(selectById: TO_DECRYPTS(adv02_account_no))
];

const buildGrid02 = () => [
  gb.text('korNm', 300, '조직명'),  // L220
  gb.text('orgCd', 60, '조직코드'),  // L221
];
```

#### 사용된 버튼들
1. <Button type="unknown" onClick={confirm}>권한부여</Button>
2. <Button type="unknown" onClick={confirm}>권한삭제</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>
4. <Button type="addRow" onClick={insertRow01}>행 추가</Button>
5. <Button type="removeRow" onClick={deleteRow01}>행 삭제</Button>
6. <Button type="addRow" onClick={insertRow02}>행 추가</Button>
7. <Button type="removeRow" onClick={deleteRow02}>행 삭제</Button>

