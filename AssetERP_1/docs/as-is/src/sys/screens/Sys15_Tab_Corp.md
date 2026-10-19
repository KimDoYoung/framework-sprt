# Sys15_Tab_Corp

- 종류: 화면
- 메뉴: 관리자 > 09. 기타 > 거래처 등록 (#1146)
- 메뉴: 기초자료 > 30. 자산&경영 > 거래처 관리 (#1155)
- 메뉴: 기초자료 > 90. 기타 > 기관정보 (#1434, 미사용)
- 파일: `client/vi/sys/Sys15_Tab_Corp.java`
- 함께 쓰는 클래스 2개:
  - `Sys15_Edit_Corp` `client/vi/sys/Sys15_Edit_Corp.java`
  - `Sys17_Grid_CorpAccount` `client/vi/sys/Sys17_Grid_CorpAccount.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Sys01_Lookup_Company`](../../sys/components/Sys01_Lookup_Company.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys15_Corp.delete` | Sys15_Tab_Corp:309 | [`Sys15_Corp.java:128`](../../sys/services/Sys15_Corp.md) | [`sys15_corp.checkUseCorpId`](../../sys/sql/sys15_corp.md), `UpdateDataModel(sys15_corp)` 동적 DELETE |
| `sys.Sys15_Corp.insertInitData` | Sys15_Tab_Corp:261 | [`Sys15_Corp.java:40`](../../sys/services/Sys15_Corp.md) | [`sys15_corp.insertInitData`](../../sys/sql/sys15_corp.md) |
| `sys.Sys15_Corp.selectByCompanyId` | Sys15_Tab_Corp:249 | [`Sys15_Corp.java:25`](../../sys/services/Sys15_Corp.md) | [`sys15_corp.selectByCompanyId`](../../sys/sql/sys15_corp.md) |
| `sys.Sys15_Corp.update` | Sys15_Edit_Corp:145 | [`Sys15_Corp.java:45`](../../sys/services/Sys15_Corp.md) | [`sys15_corp.insert`](../../sys/sql/sys15_corp.md), [`sys15_corp.selectById`](../../sys/sql/sys15_corp.md), [`sys15_corp.selectCorpCodeCheck`](../../sys/sql/sys15_corp.md), [`sys15_corp.selectNewCorpCodeByBizNo`](../../sys/sql/sys15_corp.md), [`sys15_corp.update`](../../sys/sql/sys15_corp.md) |
| `sys.Sys17_CorpAccount.delete` | Sys17_Grid_CorpAccount:184 | [`Sys17_CorpAccount.java:47`](../../sys/services/Sys17_CorpAccount.md) | `UpdateDataModel(sys17_corp_account)` 동적 DELETE |
| `sys.Sys17_CorpAccount.selectByCorpId` | Sys17_Grid_CorpAccount:203 | [`Sys17_CorpAccount.java:25`](../../sys/services/Sys17_CorpAccount.md) | [`sys17_corp_account.selectByCorpId`](../../sys/sql/sys17_corp_account.md) |
| `sys.Sys17_CorpAccount.update` | Sys17_Grid_CorpAccount:181 | [`Sys17_CorpAccount.java:33`](../../sys/services/Sys17_CorpAccount.md) | [`dbConfig.getEncrypts`](../../utils/sql/dbConfig.md), `UpdateDataModel(sys17_corp_account)` 동적 INSERT/UPDATE → [`sys17_corp_account.selectById`](../../sys/sql/sys17_corp_account.md) |

## 테이블

[`sys15_corp`](../../../db/tables/sys.md), [`sys17_corp_account`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_check_use_corp_id`, `f_create_seq`, `f_sysdate`, `to_decrypts`, `to_encrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sys15_Tab_Corp (`client/vi/sys/Sys15_Tab_Corp.java`, 338줄)

- 레이아웃: center=vlc, south=editForm
- 툴바 `buttonBar`: 거래처구분: {corpTypeComboBox} 거래처명: {searchText} {useCheckBox} {retrieveButton} {insertButton} {deleteButton} {companyField} {dataButton}
- 입력·하위 화면: `searchText` TextField, `useCheckBox` CheckBox, `companyField` LookupTriggerField, `editForm` Sys15_Edit_Corp, `corpTypeComboBox` ComboBoxField("CorpType", "%", "전체", "전체"), `lookupCompany` Sys01_Lookup_Company
- 그리드 `grid` (buildGrid(), 체크박스):
  - corpTypeName 120 "거래처구분" TextCenter
  - corpName 250 "거래처명" Text
  - bizNo 120 "사업자번호" TextCenter
  - corpCode 120 "거래처코드" TextCenter
  - seq 100 "조회순서" LongCenter
  - useYn 80 "사용" Boolean
  - note 300 "비고" Text
  - corpAccountCnt 100 "계좌정보" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L74-114) → settings()
[E1] searchText.KeyPress [Enter] (L123) → retrieve()
[E2] corpTypeComboBox[CorpType].Collapse (L141) → retrieve()
[E3] companyField.TriggerClick [result != null] (L150) → 인라인 L150-165 (new TriggerClickHandler() { @Override…)
[E4] retrieveButton[조회].Select (L167) → retrieve()
[E5] insertButton[등록].Select (L173) → insertRow()
[E6] deleteButton[삭제].Select (L179) → deleteRow()
       └ [E9] msgBox.DialogHide [YES] (L302) → 서비스 sys.Sys15_Corp.delete
[E7] dataButton[기초데이터생성].Select (L185) → initData()
[E8] grid.SelectionChanged [선택>0] (L191) → retrieveEditPage()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieveEditPage() | L201-213 | E8 | 상태 처리 | 업무 |
| public retrieve() | L232-258 | E1,E2,E4,settings | 서비스 sys.Sys15_Corp.selectByCompanyId(companyId, corpType, searchText, useYn) | 업무 |
| private initData() | L260-275 | E7 | 서비스 sys.Sys15_Corp.insertInitData(companyId) | 업무 |
| public update() | L278-280 | 공개 메서드 | 상태 처리 | 업무 |
| public insertRow() | L283-291 | E5 | 상태 처리 | 업무 |
| public deleteRow() | L294-329 | E6 | 미선택 시 alert "삭제할 거래처정보를 선택하여 주십시오." → 확인창 E9 | 업무 |
| private settings() | L116-199 | 생성자 | 조회창 Sys01_Lookup_Company 열기, 이벤트 연결, 초기값: useCheckBox=true("사용거래처만 보기"), companyField=companyModel.getCompanyName( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L215-230 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlCheckBoxLabelStyle() | L331-333 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L335-337 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('corpTypeNm', 120, '거래처구분'),  // L220
  gb.text('corpNm', 250, '거래처명'),  // L221
  gb.textCenter('bizNo', 120, '사업자번호'),  // L222
  gb.textCenter('corpCd', 120, '거래처코드'),  // L223
  gb.longCenter('seq', 100, '조회순서'),  // L224
  gb.boolean('useYn', 80, '사용'),  // L225
  gb.text('note', 300, '비고'),  // L226
  gb.textCenter('corpAccountCnt', 100, '계좌정보'),  // L227
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="delete" onClick={deleteRow}>삭제</Button>
4. <Button type="unknown" onClick={initData}>기초데이터생성</Button>

### Sys15_Edit_Corp (`client/vi/sys/Sys15_Edit_Corp.java`, 183줄)

- 입력·하위 화면: `corpType` TextField, `corpName` TextField, `corpCode` TextField 빈칸="미입력시 사업자번호로 등록.", `bizNo` TextField, `note` TextField, `tel` TextField, `addr` TextField, `corpTypeName` ComboBoxField("CorpType"), `seq` LongField, `useYn` CheckBox

#### 이벤트
[E0] 화면 열림 (생성자 L61-88) → getEditor()
[E1] updateButton[저장].Select (L69) → updateRow()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private getEditor() | L90-130 | 생성자 | 상태 처리 | 업무 |
| public retrieve() | L132-141 | 공개 메서드 | 상태 처리 | 업무 |
| public updateRow() | L143-159 | E1 | 서비스 sys.Sys15_Corp.update | 업무 |
| public init() | L172-174 | 공개 메서드 | 상태 처리 | 업무 |
| private setHtmlStyle() | L176-178 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L180-182 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={updateRow}>저장</Button>

### Sys17_Grid_CorpAccount (`client/vi/sys/Sys17_Grid_CorpAccount.java`, 211줄)

- 툴바 `buttonBar`: {insertButton} {deleteButton} {anchor}
- 입력·하위 화면: `bankCodeComboBox` ComboBoxField("BankCode")
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - bankName 150 "기관명" TextCenter 편집:bankCodeComboBox
  - accountNoDec 200 "계좌번호" Text 편집:TextField
  - accountName 150 "예금주명" TextCenter 편집:TextField
  - mainAccountYn 100 "대표계좌" Boolean

#### 이벤트
[E0] 화면 열림 (생성자 L51-74) → settings()
[E1] anchor.MouseDown (L56) → retrieve()
[E2] insertButton[행 추가].Select (L78) → insertRow()
[E3] deleteButton[행 삭제].Select (L84) → deleteRow()
[E4] bankCodeComboBox[BankCode].Collapse (L94) → 인라인 L94-102 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private insertRow() | L113-124 | E2 | 상태 처리 | 업무 |
| private deleteRow() | L126-132 | E3 | 상태 처리 | 업무 |
| private retrieve() | L134-136 | E1 | 상태 처리 | 업무 |
| public reset() | L138-142 | 공개 메서드 | 상태 처리 | 업무 |
| public update() | L144-191 | 공개 메서드 | GridDeleteData sys.Sys17_CorpAccount.update, sys.Sys17_CorpAccount.delete | 업무 |
| public retrieve() | L193-210 | E1 | 서비스 sys.Sys17_CorpAccount.selectByCorpId(corpId), 건수 표시 | 업무 |
| private settings() | L76-90 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L92-111 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('bankNm', 150, '기관명', { editor: 'select' }),  // L105 SQL 계산 컬럼(selectByCorpId: f_cdnm('BankCode', sys17_bank_cd, 0, f_…)
  gb.text('accountNoDec', 200, '계좌번호', { editor: 'text' }),  // L106 SQL 계산 컬럼(selectByCorpId: TO_DECRYPTS(sys17_account_no))
  gb.textCenter('accountNm', 150, '예금주명', { editor: 'text' }),  // L107
  gb.boolean('mainAccountYn', 100, '대표계좌'),  // L108
];
```

#### 사용된 버튼들
1. <Button type="addRow" onClick={insertRow}>행 추가</Button>
2. <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>

