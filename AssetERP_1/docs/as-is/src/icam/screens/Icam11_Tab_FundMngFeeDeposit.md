# Icam11_Tab_FundMngFeeDeposit

- 종류: 화면
- 메뉴: 관리회계 > 30. 펀드운용보수관리 > 운용보수 입금계좌 관리 (#1217)
- 파일: `client/vi/icam/Icam11_Tab_FundMngFeeDeposit.java`
- 함께 쓰는 클래스 1개:
  - `Icam11_Grid_MngFeeDeposit` `client/vi/icam/Icam11_Grid_MngFeeDeposit.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Ast01_Lookup_CorpAccount`](../../ast/components/Ast01_Lookup_CorpAccount.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `icam.Icam11_FeeDeposit.delete` | Icam11_Grid_MngFeeDeposit:180 | [`Icam11_FeeDeposit.java:36`](../../icam/services/Icam11_FeeDeposit.md) | `UpdateDataModel(icam11_fee_deposit)` 동적 DELETE |
| `icam.Icam11_FeeDeposit.selectByCompanyId` | Icam11_Tab_FundMngFeeDeposit:141 | [`Icam11_FeeDeposit.java:21`](../../icam/services/Icam11_FeeDeposit.md) | [`icam11_fee_deposit.selectByCompanyId`](../../icam/sql/icam11_fee_deposit.md) |
| `icam.Icam11_FeeDeposit.selectByFundCode2` | Icam11_Grid_MngFeeDeposit:117 | [`Icam11_FeeDeposit.java:26`](../../icam/services/Icam11_FeeDeposit.md) | [`icam11_fee_deposit.selectByFundCode2`](../../icam/sql/icam11_fee_deposit.md) |
| `icam.Icam11_FeeDeposit.update` | Icam11_Grid_MngFeeDeposit:155 | [`Icam11_FeeDeposit.java:31`](../../icam/services/Icam11_FeeDeposit.md) | `UpdateDataModel(icam11_fee_deposit)` 동적 INSERT/UPDATE → [`icam11_fee_deposit.selectById`](../../icam/sql/icam11_fee_deposit.md) |

## 테이블

[`ast01_class_tree`](../../../db/tables/ast.md), [`icam10_fee`](../../../db/tables/icam.md), [`icam11_fee_deposit`](../../../db/tables/icam.md), [`sys15_corp`](../../../db/tables/sys.md)

## DB 함수

`f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Icam11_Tab_FundMngFeeDeposit (`client/vi/icam/Icam11_Tab_FundMngFeeDeposit.java`, 174줄)

- 레이아웃: north=buttonBar, west=grid, center=depositGrid
- 툴바 `buttonBar`: 검색: {searchTextField} {retrieveButton} {insertButton} {updateButton} {deleteButton}
- 입력·하위 화면: `searchTextField` TextField 빈칸="펀드코드/펀드명/수탁사/예금계좌"
- 그리드 `grid` (buildGrid(), 체크박스):
  - fundCode 100 "펀드코드" TextCenter
  - fundName 450 "펀드명" Text
  - consignmentName 250 "수탁사" Text
  - depositName 200 "예금계좌" Text

#### 이벤트
[E0] 화면 열림 (생성자 L41-79) → setting()
[E1] grid.RowClick (L57) → retrievePage()
[E2] searchTextField.KeyPress [Enter] (L85) → retrieve()
[E3] retrieveButton[조회].Select (L94) → retrieve()
[E4] insertButton[등록].Select (L100) → 인라인 L100-105 (new SelectHandler() { @Override publi…)
[E5] deleteButton[삭제].Select (L106) → 인라인 L106-111 (new SelectHandler() { @Override publi…)
[E6] updateButton[저장].Select (L112) → 인라인 L112-117 (new SelectHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setting() | L81-118 | 생성자 | 상태 처리 | 업무 |
| public retrieve() | L134-151 | E2,E3 | 서비스 icam.Icam11_FeeDeposit.selectByCompanyId(companyId, searchText) | 업무 |
| private retrievePage() | L153-156 | E1,retrieve | 상태 처리 | 업무 |
| public update() | L159-160 | 공개 메서드 | 상태 처리 | 업무 |
| public insertRow() | L163-164 | 공개 메서드 | 상태 처리 | 업무 |
| public deleteRow() | L167-168 | 공개 메서드 | 상태 처리 | 업무 |
| public buildGrid() | L120-131 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L170-172 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('fundCd', 100, '펀드코드'),  // L125
  gb.text('fundNm', 450, '펀드명'),  // L126 SQL 계산 컬럼(selectByCompanyId: icam10_fund_nm)
  gb.text('consignmentNm', 250, '수탁사'),  // L127 SQL 계산 컬럼(selectByCompanyId: icam10_consignment_nm)
  gb.text('depositNm', 200, '예금계좌'),  // L128 SQL 계산 컬럼(selectByCompanyId: ast01_class_tree_nm)
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={() => /* 인라인 L100-105 (new SelectHandler() { @Override publi…) */}>등록</Button>
3. <Button type="save" onClick={() => /* 인라인 L112-117 (new SelectHandler() { @Override publi…) */}>저장</Button>
4. <Button type="delete" onClick={() => /* 인라인 L106-111 (new SelectHandler() { @Override publi…) */}>삭제</Button>

### Icam11_Grid_MngFeeDeposit (`client/vi/icam/Icam11_Grid_MngFeeDeposit.java`, 193줄)

- 레이아웃: center=grid
- 입력·하위 화면: `depositName` LookupTriggerField, `lookupCorpAccount` Ast01_Lookup_CorpAccount
- 그리드 `grid` (buildGrid(), 체크박스):
  - startDate 100 "적용시작일" Date 편집:MyDateField
  - depositName 150 "예금계좌" Text 편집:depositName

#### 이벤트
[E0] 화면 열림 (생성자 L43-52) → 초기화
[E1] depositName.TriggerClick [result != null] (L76) → 인라인 L76-97 (new TriggerClickHandler() { @Override…)
[E2] msgBox.DialogHide [YES] (L173) → 서비스 icam.Icam11_FeeDeposit.delete

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L106-126 | 공개 메서드 | 서비스 icam.Icam11_FeeDeposit.selectByFundCode2(companyId, icamCompanyCode, fundCode, searchText) | 업무 |
| public retrieve() | L128-130 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L133-134 | 공개 메서드 | 상태 처리 | 업무 |
| public update() | L137-156 | 공개 메서드 | 서비스 icam.Icam11_FeeDeposit.update | 업무 |
| public insertRow() | L159-167 | 공개 메서드 | 상태 처리 | 업무 |
| public deleteRow() | L170-191 | 공개 메서드 | 확인창 표시, GridDeleteData icam.Icam11_FeeDeposit.delete(체크된 행 목록) | 업무 |
| public buildGrid() | L54-104 | 필드 초기화 | 조회창 Ast01_Lookup_CorpAccount 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('startDate', 100, '적용시작일', { editor: 'date' }),  // L100
  gb.text('depositNm', 150, '예금계좌'),  // L101 SQL 계산 컬럼(selectByFundCode2: ast01_class_tree_nm)
];
```

#### 사용된 버튼들
버튼 사용하지 않음

