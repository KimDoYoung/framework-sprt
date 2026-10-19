# Est01_Tab_PfFeeType

- 종류: 화면
- 메뉴: 펀드관리 > 05. 부동산PF 용역수행 > 부동산PF 수수료 (#1375)
- 파일: `client/vi/est/Est01_Tab_PfFeeType.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Com11_Lookup_FormMappingMulti`](../../com/components/Com11_Lookup_FormMappingMulti.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `com.Com11_FormMappingMulti.getUpdateModel` | Est01_Tab_PfFeeType:131, Est01_Tab_PfFeeType:155 | [`Com11_FormMappingMulti.java:59`](../../com/services/Com11_FormMappingMulti.md) | [`com11_form_mapping_multi.selectByDetailCode`](../../com/sql/com11_form_mapping_multi.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(com11_form_mapping_multi)` 동적 INSERT/UPDATE → [`com11_form_mapping_multi.selectById`](../../com/sql/com11_form_mapping_multi.md) |
| `est.Est01_PfFeeType.delete` | Est01_Tab_PfFeeType:310 | [`Est01_PfFeeType.java:47`](../../est/services/Est01_PfFeeType.md) | `UpdateDataModel(est01_pf_fee_type)` 동적 DELETE |
| `est.Est01_PfFeeType.selectByCompanyId` | Est01_Tab_PfFeeType:193 | [`Est01_PfFeeType.java:24`](../../est/services/Est01_PfFeeType.md) | [`est01_pf_fee_type.selectByCompanyId`](../../est/sql/est01_pf_fee_type.md) |
| `est.Est01_PfFeeType.update` | Est01_Tab_PfFeeType:273 | [`Est01_PfFeeType.java:42`](../../est/services/Est01_PfFeeType.md) | `UpdateDataModel(est01_pf_fee_type)` 동적 INSERT/UPDATE → [`est01_pf_fee_type.selectById`](../../est/sql/est01_pf_fee_type.md) |
| `est.Est02_PfContract.checkList` | Est01_Tab_PfFeeType:237, Est01_Tab_PfFeeType:283 | [`Est02_PfContract.java:39`](../../est/services/Est02_PfContract.md) | [`est02_pf_contract.checkList`](../../est/sql/est02_pf_contract.md) |

## 테이블

[`com11_form_mapping_multi`](../../../db/tables/com.md), [`est01_pf_fee_type`](../../../db/tables/est.md), [`est02_pf_contract`](../../../db/tables/est.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md)

## DB 함수

`f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Est01_Tab_PfFeeType (`client/vi/est/Est01_Tab_PfFeeType.java`, 321줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: {retrieveButton} {insertButton} {updateButton} {deleteButton}
- 입력·하위 화면: `feeCodeComboBox` ComboBoxField("EstPfFeeCode"), `lookup` Com11_Lookup_FormMappingMulti
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - seq 100 "조회순서" LongCenter 편집:LongField
  - feeName 200 "부동산PF 수수료 항목" Text 편집:feeCodeComboBox
  - feeDesc 500 "정의" TextArea
  - startDate 100 "사용시작일" Date 편집:MyDateField
  - closeDate 100 "사용종료일" Date 편집:MyDateField
  - note 250 "비고" Text 편집:TextField
  - actionCell 120 "계획서양식" Cell 편집:actionCell01
  - actionCell 120 "결과보고서양식" Cell 편집:actionCell02

#### 이벤트
[E0] 화면 열림 (생성자 L65-86) → settings(), retrieve()
[E1] retrieveButton[조회].Select (L89) → retrieve()
[E2] insertButton[등록].Select (L95) → insertRow()
[E3] updateButton[저장].Select (L101) → updateChk()
       └ [E6] msgBox.DialogHide [YES] (L247) → update(), retrieve()
[E4] deleteButton[삭제].Select (L107) → deleteChk()
[E5] feeCodeComboBox[EstPfFeeCode].Collapse (L117) → 인라인 L117-125 (new CollapseHandler() { @Override pub…)
[E7] msgBox.DialogHide [YES] (L303) → 서비스 est.Est01_PfFeeType.delete

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L188-199 | 생성자,E1,E6 | 서비스 est.Est01_PfFeeType.selectByCompanyId(companyId) | 업무 |
| public insertRow() | L201-207 | E2 | 상태 처리 | 업무 |
| private updateChk() | L209-269 | E3 | ConfirmBox → E6 | 업무 |
| public update() | L271-274 | E6,updateChk | 서비스 est.Est01_PfFeeType.update | 업무 |
| private deleteChk() | L276-298 | E4 | 서비스 est.Est02_PfContract.checkList | 업무 |
| public deleteRow() | L300-320 | deleteChk | 확인창 표시, GridDeleteData est.Est01_PfFeeType.delete(체크된 행 목록) | 업무 |
| private settings() | L88-113 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L115-186 | 필드 초기화 | 조회창 Com11_Lookup_FormMappingMulti 열기, 서비스 com.Com11_FormMappingMulti.getUpdateModel, com.Com11_FormMappingMulti.getUpdateModel(companyId, kindCode, detailCode, linkCode, companyId, kindCode, detailCode, linkCode), 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.longCenter('seq', 100, '조회순서', { editor: 'number' }),  // L176
  gb.text('feeNm', 200, '부동산PF 수수료 항목', { editor: 'select' }),  // L177 SQL 계산 컬럼(selectByCompanyId: a.sys09_name)
  gb.textArea('feeDesc', 500, '정의'),  // L178 SQL 계산 컬럼(selectByCompanyId: a.sys09_desc)
  gb.date('startDate', 100, '사용시작일', { editor: 'date' }),  // L179
  gb.date('closeDate', 100, '사용종료일', { editor: 'date' }),  // L180
  gb.text('note', 250, '비고', { editor: 'text' }),  // L181
  // ⚠ 대응 없음 (GridBuilder L182) addCell
  // ⚠ 대응 없음 (GridBuilder L183) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={updateChk}>저장</Button>
4. <Button type="delete" onClick={deleteChk}>삭제</Button>

