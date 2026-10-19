# Act10_Tab_ReprAccount

- 종류: 화면
- 메뉴: 관리자 > 05. 관리회계 > 대표계정 관리 (#1147)
- 메뉴: 기초자료 > 40. 관리회계 > 대표계정관리 (#1156)
- 파일: `client/vi/act/Act10_Tab_ReprAccount.java`
- 함께 쓰는 클래스 1개:
  - `Act10_Lookup_ReprAccount` `client/vi/act/Act10_Lookup_ReprAccount.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Sys01_Lookup_Company`](../../sys/components/Sys01_Lookup_Company.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `act.Act10_ReprAccount.delete` | Act10_Tab_ReprAccount:372 | [`Act10_ReprAccount.java:53`](../../act/services/Act10_ReprAccount.md) | `UpdateDataModel(act10_repr_account)` 동적 DELETE |
| `act.Act10_ReprAccount.insertInitData` | Act10_Tab_ReprAccount:277 | [`Act10_ReprAccount.java:31`](../../act/services/Act10_ReprAccount.md) | [`act10_repr_account.deleteByReprAccountCode`](../../act/sql/act10_repr_account.md), [`act10_repr_account.insertInitData`](../../act/sql/act10_repr_account.md) |
| `act.Act10_ReprAccount.selectByCompanyId` | Act10_Lookup_ReprAccount:158, Act10_Tab_ReprAccount:216 | [`Act10_ReprAccount.java:25`](../../act/services/Act10_ReprAccount.md) | [`act10_repr_account.selectByCompanyId`](../../act/sql/act10_repr_account.md) |
| `act.Act10_ReprAccount.update` | Act10_Tab_ReprAccount:345 | [`Act10_ReprAccount.java:48`](../../act/services/Act10_ReprAccount.md) | `UpdateDataModel(act10_repr_account)` 동적 INSERT/UPDATE → [`act10_repr_account.selectById`](../../act/sql/act10_repr_account.md) |

## 테이블

[`act10_repr_account`](../../../db/tables/act.md)

## DB 함수

`f_cdnm`, `f_create_seq`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Act10_Tab_ReprAccount (`client/vi/act/Act10_Tab_ReprAccount.java`, 384줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 코드/명: {searchText} 계정속성: {attributeComboBox} {retrieveButton} {insertButton} {updateButton} {deleteButton} {companyField} {dataButton}
- 입력·하위 화면: `searchText` TextField, `attributeComboBox` ComboBoxField("AccountAttributeCode", "%", "전체") 빈칸="전체", `companyField` LookupTriggerField, `lookupCompany` Sys01_Lookup_Company, `comboBoxAttribute` ComboBoxField("AccountAttributeCode"), `lookupTgtAccount` LookupTriggerField, `lookupReprAccount` Act10_Lookup_ReprAccount
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - reprAccountCode 120 "대표계정코드" TextCenter 편집:TextField
  - reprAccountName 250 "대표계정명" Text 편집:TextField
  - attributeName 120 "계정속성" Text 편집:comboBoxAttribute
  - tgtReprAccountName 250 "상대대표계정코드" Text 편집:lookupTgtAccount
  - note 450 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L76-113) → settings(), retrieve()
[E1] searchText.KeyPress [Enter] (L117) → retrieve()
[E2] companyField.TriggerClick [result == null] (L132) → 인라인 L132-154 (new TriggerClickHandler() { @Override…)
[E3] retrieveButton[조회].Select (L156) → retrieve()
[E4] insertButton[등록].Select (L162) → insertRow()
[E5] updateButton[저장].Select (L168) → update()
[E6] deleteButton[삭제].Select (L174) → deleteRow()
       └ [E11] msgBox.DialogHide [YES] (L365) → 서비스 act.Act10_ReprAccount.delete
[E7] dataButton[기초데이터생성].Select (L180) → initData()
[E8] comboBoxAttribute[AccountAttributeCode].Collapse (L193) → 인라인 L193-199 (new CollapseHandler() { @Override pub…)
[E9] lookupTgtAccount.TriggerClick (L202) → lookupTgtReprAccount()
[E10] lookupTgtAccount.ValueChange (L208) → setTgtReprAccount(), lookupTgtReprAccount()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private lookupTgtReprAccount() | L246-255 | E9,E10 | 조회창 Act10_Lookup_ReprAccount 열기 | 업무 |
| private setTgtReprAccount() | L257-261 | E10,lookupTgtReprAccount | 상태 처리 | 업무 |
| private initData() | L263-302 | E7 | 미선택 시 alert "선택한 고객사가 없습니다.", 서비스 act.Act10_ReprAccount.insertInitData(companyId) | 업무 |
| public retrieve() | L304-336 | 생성자,E1,E3 | 서비스 act.Act10_ReprAccount.selectByCompanyId(companyId, attributeCode, searchText), 건수 표시 | 업무 |
| public update() | L343-346 | E5 | 서비스 act.Act10_ReprAccount.update | 업무 |
| public insertRow() | L349-354 | E4 | 상태 처리 | 업무 |
| public deleteRow() | L357-383 | E6 | 미선택 시 alert "대표계정코드를 선택해주세요" → 확인창 E11 | 업무 |
| private settings() | L115-186 | 생성자 | 조회창 Sys01_Lookup_Company 열기, 이벤트 연결, 초기값: companyField=null, companyField=companyName | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L188-244 | 필드 초기화 | 서비스 act.Act10_ReprAccount.selectByCompanyId(companyId, searchText, attributeCode), 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L338-340 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('reprAccountCd', 120, '대표계정코드', { editor: 'text' }),  // L237
  gb.text('reprAccountNm', 250, '대표계정명', { editor: 'text' }),  // L238
  // ⚠DB없음 L239 attributeName 120 "계정속성" (act10_attribute_nm 컬럼 없음)
  // ⚠DB없음 L240 tgtReprAccountName 250 "상대대표계정코드" (act10_tgt_repr_account_nm 컬럼 없음)
  gb.text('note', 450, '비고', { editor: 'text' }),  // L241
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={deleteRow}>삭제</Button>
5. <Button type="unknown" onClick={initData}>기초데이터생성</Button>

### Act10_Lookup_ReprAccount (`client/vi/act/Act10_Lookup_ReprAccount.java`, 193줄)

- 툴바 `buttonBar`: 대표계정코드/명: {searchText} 계정속성: {attributeComboBox} {retrieveButton}
- 입력·하위 화면: `searchText` TextField, `attributeComboBox` ComboBoxField("AccountAttributeCode", "%", "전체") 빈칸="전체"
- 그리드 `grid` (buildGrid(), 체크박스):
  - attributeName 80 "속성" TextCenter
  - reprAccountCode 100 "대표계정코드" TextCenter
  - reprAccountName 300 "대표계정명" Text

#### 이벤트
[E1] grid.CellDoubleClick (L81) → confirm()
[E2] searchText.KeyPress [Enter] (L97) → retrieve()
[E3] retrieveButton[조회].Select (L106) → retrieve()
[E4] oKButton[확인].Select (L112) → confirm()
[E5] cancelButton[취소].Select (L118) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L48-51 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L53-89 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L138-159 | E2,E3,open | 서비스 act.Act10_ReprAccount.selectByCompanyId(companyId, searchText, attributeCode), 건수 표시 | 업무 |
| public confirm() | L161-172 | E1,E4 | 미선택 시 alert "선택된 대표계정코드가 없습니다." | 업무 |
| public getServiceResult() | L175-183 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L91-124 | open | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L126-136 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L185-187 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L189-191 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L131 attributeName 80 "속성" (act10_attribute_nm 컬럼 없음)
  gb.textCenter('reprAccountCd', 100, '대표계정코드'),  // L132
  gb.text('reprAccountNm', 300, '대표계정명'),  // L133
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="cancel" onClick={hide}>취소</Button>

