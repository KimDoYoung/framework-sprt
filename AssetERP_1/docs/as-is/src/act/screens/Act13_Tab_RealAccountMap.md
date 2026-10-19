# Act13_Tab_RealAccountMap

- 종류: 화면
- 메뉴: 관리자 > 05. 관리회계 > 실계정맵핑 (#1163)
- 메뉴: 기초자료 > 40. 관리회계 > 실계정맵핑 (#1169)
- 파일: `client/vi/act/Act13_Tab_RealAccountMap.java`
- 함께 쓰는 클래스 1개:
  - `Act10_Lookup_ReprAccount` `client/vi/act/Act10_Lookup_ReprAccount.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Act01_Lookup_AccountCode`](../../act/components/Act01_Lookup_AccountCode.md), [`Sys01_Lookup_Company`](../../sys/components/Sys01_Lookup_Company.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `act.Act01_AccountCode.selectBySlipYn` | Act13_Tab_RealAccountMap:235 | [`Act01_AccountCode.java:40`](../../act/services/Act01_AccountCode.md) | [`act01_account_code.selectBySlipYn`](../../act/sql/act01_account_code.md) |
| `act.Act10_ReprAccount.selectByCompanyId` | Act10_Lookup_ReprAccount:158, Act13_Tab_RealAccountMap:200 | [`Act10_ReprAccount.java:25`](../../act/services/Act10_ReprAccount.md) | [`act10_repr_account.selectByCompanyId`](../../act/sql/act10_repr_account.md) |
| `act.Act13_RealAccountMap.delete` | Act13_Tab_RealAccountMap:408 | [`Act13_RealAccountMap.java:78`](../../act/services/Act13_RealAccountMap.md) | `UpdateDataModel(act13_real_account_map)` 동적 DELETE |
| `act.Act13_RealAccountMap.insertInitData` | Act13_Tab_RealAccountMap:313 | [`Act13_RealAccountMap.java:55`](../../act/services/Act13_RealAccountMap.md) | [`act13_real_account_map.deleteByAccountMap`](../../act/sql/act13_real_account_map.md), [`act13_real_account_map.insertInitData`](../../act/sql/act13_real_account_map.md) |
| `act.Act13_RealAccountMap.selectByCompanyId` | Act13_Tab_RealAccountMap:355 | [`Act13_RealAccountMap.java:25`](../../act/services/Act13_RealAccountMap.md) | [`act13_real_account_map.selectByCompanyId`](../../act/sql/act13_real_account_map.md) |
| `act.Act13_RealAccountMap.update` | Act13_Tab_RealAccountMap:381 | [`Act13_RealAccountMap.java:73`](../../act/services/Act13_RealAccountMap.md) | `UpdateDataModel(act13_real_account_map)` 동적 INSERT/UPDATE → [`act13_real_account_map.selectById`](../../act/sql/act13_real_account_map.md) |

## 테이블

[`act01_account_code`](../../../db/tables/act.md), [`act10_repr_account`](../../../db/tables/act.md), [`act13_real_account_map`](../../../db/tables/act.md)

## DB 함수

`f_cdnm`, `f_create_seq`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Act13_Tab_RealAccountMap (`client/vi/act/Act13_Tab_RealAccountMap.java`, 425줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 검색: {searchText} {retrieveButton} {insertButton} {updateButton} {deleteButton} {companyField} {dataButton}
- 입력·하위 화면: `searchText` TextField 빈칸="대표계정/맵핑ID/실계정과목/비고", `companyField` LookupTriggerField, `lookupCompany` Sys01_Lookup_Company, `lookupReprAccount` LookupTriggerField, `lookupRealAccount` LookupTriggerField
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - reprAccountCode 120 "대표계정코드" TextCenter 편집:lookupReprAccount
  - reprAccountName 200 "대표계정명" Text
  - accountMap 120 "계정맵핑ID" TextCenter 편집:TextField
  - realAccountCode 150 "실계정코드" TextCenter 편집:lookupRealAccount
  - realAccountName 300 "실계정과목" TextArea
  - note 400 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L76-109) → settings(), retrieve()
[E1] searchText.KeyPress [Enter] (L114) → retrieve()
[E2] retrieveButton[조회].Select (L123) → retrieve()
[E3] insertButton[등록].Select (L129) → insertRow()
[E4] updateButton[저장].Select (L135) → update()
[E5] deleteButton[삭제].Select (L141) → deleteRow()
       └ [E12] msgBox.DialogHide [YES] (L401) → 서비스 act.Act13_RealAccountMap.delete
[E6] companyField.TriggerClick [result == null] (L150) → 인라인 L150-172 (new TriggerClickHandler() { @Override…)
[E7] dataButton[기초데이터생성].Select (L173) → initData()
[E8] lookupReprAccount.TriggerClick (L186) → lookupReprAccount()
[E9] lookupReprAccount.ValueChange (L192) → setReprAccount(), lookupReprAccount()
[E10] lookupRealAccount.TriggerClick (L221) → lookupRealAccount()
[E11] lookupRealAccount.ValueChange (L227) → setRealAccount(), lookupRealAccount()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private lookupReprAccount() | L265-274 | E8,E9 | 조회창 Act10_Lookup_ReprAccount 열기 | 업무 |
| private setReprAccount() | L276-280 | E9,lookupReprAccount | 상태 처리 | 업무 |
| private lookupRealAccount() | L282-291 | E10,E11 | 조회창 Act01_Lookup_AccountCode 열기 | 업무 |
| private setRealAccount() | L293-297 | E11,lookupRealAccount | 상태 처리 | 업무 |
| private initData() | L299-338 | E7 | 미선택 시 alert "선택한 고객사가 없습니다.", 서비스 act.Act13_RealAccountMap.insertInitData(companyId) | 업무 |
| public retrieve() | L340-364 | 생성자,E1,E2 | 서비스 act.Act13_RealAccountMap.selectByCompanyId(companyId, searchText), 건수 표시 | 업무 |
| public update() | L367-382 | E4 | 서비스 act.Act13_RealAccountMap.update | 업무 |
| public insertRow() | L385-390 | E3 | 상태 처리 | 업무 |
| public deleteRow() | L393-419 | E5 | 미선택 시 alert "삭제할 실계정코드 맵핑정보를 선택해주세요" → 확인창 E12 | 업무 |
| private settings() | L111-179 | 생성자 | 조회창 Sys01_Lookup_Company 열기, 이벤트 연결, 초기값: companyField=null, companyField=companyName | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L181-263 | 필드 초기화 | 서비스 act.Act10_ReprAccount.selectByCompanyId, act.Act01_AccountCode.selectBySlipYn(companyId, searchText, attributeCode, companyId, searchText, attributeCode), 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L421-423 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('reprAccountCd', 120, '대표계정코드'),  // L255
  gb.text('reprAccountNm', 200, '대표계정명'),  // L256 SQL 계산 컬럼(selectByCompanyId: act10_repr_account_nm)
  gb.textCenter('accountMap', 120, '계정맵핑ID', { editor: 'text' }),  // L257
  gb.textCenter('realAccountCd', 150, '실계정코드'),  // L258
  gb.textArea('realAccountNm', 300, '실계정과목'),  // L259 SQL 계산 컬럼(selectByCompanyId: CASE WHEN COALESCE(act01_use_yn,'false'…)
  gb.text('note', 400, '비고', { editor: 'text' }),  // L260
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

