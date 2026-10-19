# Biz51_Tab_ErpContCorp

- 종류: 화면
- 메뉴: KFS > 11. ERP 계약사관리 > AssetERP 계약사관리 (#1402)
- 파일: `client/vi/biz/Biz51_Tab_ErpContCorp.java`
- 함께 쓰는 클래스 4개:
  - `Biz52_Lookup_ErpFee` `client/vi/biz/Biz52_Lookup_ErpFee.java`
  - `Biz51_Edit_ErpContCorp` `client/vi/biz/Biz51_Edit_ErpContCorp.java`
  - `Biz50_Lookup_ErpSetup` `client/vi/biz/Biz50_Lookup_ErpSetup.java`
  - `Biz50_Lookup_MailMapping` `client/vi/biz/Biz50_Lookup_MailMapping.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Com01_Lookup_RelateAppr`](../../com/components/Com01_Lookup_RelateAppr.md), [`Sys01_Lookup_Company`](../../sys/components/Sys01_Lookup_Company.md), [`Sys15_Lookup_Corp`](../../sys/components/Sys15_Lookup_Corp.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `biz.Biz50_ErpSetup.delete` | Biz50_Lookup_ErpSetup:299 | [`Biz50_ErpSetup.java:95`](../../biz/services/Biz50_ErpSetup.md) | `UpdateDataModel(biz50_erp_setup)` 동적 DELETE |
| `biz.Biz50_ErpSetup.getNote` | Biz50_Lookup_ErpSetup:209 | [`Biz50_ErpSetup.java:59`](../../biz/services/Biz50_ErpSetup.md) | [`biz50_erp_setup.getNote`](../../biz/sql/biz50_erp_setup.md) |
| `biz.Biz50_ErpSetup.insertMailForm` | Biz50_Lookup_ErpSetup:319, Biz50_Lookup_MailMapping:125 | [`Biz50_ErpSetup.java:76`](../../biz/services/Biz50_ErpSetup.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(biz50_erp_setup)` 동적 INSERT/UPDATE → [`biz50_erp_setup.selectById`](../../biz/sql/biz50_erp_setup.md) |
| `biz.Biz50_ErpSetup.selectAll` | Biz50_Lookup_ErpSetup:206 | [`Biz50_ErpSetup.java:24`](../../biz/services/Biz50_ErpSetup.md) | [`biz50_erp_setup.selectAll`](../../biz/sql/biz50_erp_setup.md) |
| `biz.Biz50_ErpSetup.selectByStartDate` | Biz52_Lookup_ErpFee:312 | [`Biz50_ErpSetup.java:32`](../../biz/services/Biz50_ErpSetup.md) | [`biz50_erp_setup.selectByStartDate`](../../biz/sql/biz50_erp_setup.md) |
| `biz.Biz50_ErpSetup.selectMailForm` | Biz50_Lookup_ErpSetup:303 | [`Biz50_ErpSetup.java:51`](../../biz/services/Biz50_ErpSetup.md) | [`biz50_erp_setup.selectMailForm`](../../biz/sql/biz50_erp_setup.md) |
| `biz.Biz50_ErpSetup.update` | Biz50_Lookup_ErpSetup:245 | [`Biz50_ErpSetup.java:90`](../../biz/services/Biz50_ErpSetup.md) | `UpdateDataModel(biz50_erp_setup)` 동적 INSERT/UPDATE → [`biz50_erp_setup.selectById`](../../biz/sql/biz50_erp_setup.md) |
| `biz.Biz50_ErpSetup.updateNote` | Biz50_Lookup_ErpSetup:254 | [`Biz50_ErpSetup.java:67`](../../biz/services/Biz50_ErpSetup.md) | [`biz50_erp_setup.updateNote`](../../biz/sql/biz50_erp_setup.md) |
| `biz.Biz51_ErpContCorp.deleteList` | Biz51_Tab_ErpContCorp:238 | [`Biz51_ErpContCorp.java:56`](../../biz/services/Biz51_ErpContCorp.md) | [`biz51_erp_cont_corp.deleteById`](../../biz/sql/biz51_erp_cont_corp.md), [`biz52_erp_fee.deleteByErpContCorpId`](../../biz/sql/biz52_erp_fee.md), [`com01_relate_appr.deleteByKeyTableId`](../../com/sql/com01_relate_appr.md), [`sys10_file.deleteByParentId`](../../sys/sql/sys10_file.md) |
| `biz.Biz51_ErpContCorp.insertUpdate` | Biz51_Edit_ErpContCorp:331 | [`Biz51_ErpContCorp.java:42`](../../biz/services/Biz51_ErpContCorp.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(biz51_erp_cont_corp)` 동적 INSERT/UPDATE → [`biz51_erp_cont_corp.selectById`](../../biz/sql/biz51_erp_cont_corp.md) |
| `biz.Biz51_ErpContCorp.selectByContStatusCode` | Biz51_Tab_ErpContCorp:213 | [`Biz51_ErpContCorp.java:24`](../../biz/services/Biz51_ErpContCorp.md) | [`biz51_erp_cont_corp.selectByContStatusCode`](../../biz/sql/biz51_erp_cont_corp.md) |
| `biz.Biz51_ErpContCorp.selectById` | Biz51_Tab_ErpContCorp:255 | [`Biz51_ErpContCorp.java:19`](../../biz/services/Biz51_ErpContCorp.md) | [`biz51_erp_cont_corp.selectById`](../../biz/sql/biz51_erp_cont_corp.md) |
| `biz.Biz52_ErpFee.delete` | Biz52_Lookup_ErpFee:387 | [`Biz52_ErpFee.java:58`](../../biz/services/Biz52_ErpFee.md) | `UpdateDataModel(biz52_erp_fee)` 동적 DELETE |
| `biz.Biz52_ErpFee.selectByErpContCorpId` | Biz52_Lookup_ErpFee:216 | [`Biz52_ErpFee.java:23`](../../biz/services/Biz52_ErpFee.md) | [`biz52_erp_fee.selectByErpContCorpId`](../../biz/sql/biz52_erp_fee.md) |
| `biz.Biz52_ErpFee.selectByStartDate` | Biz51_Edit_ErpContCorp:158 | [`Biz52_ErpFee.java:32`](../../biz/services/Biz52_ErpFee.md) | [`biz52_erp_fee.selectByStartDate`](../../biz/sql/biz52_erp_fee.md) |
| `biz.Biz52_ErpFee.update` | Biz52_Lookup_ErpFee:247 | [`Biz52_ErpFee.java:53`](../../biz/services/Biz52_ErpFee.md) | `UpdateDataModel(biz52_erp_fee)` 동적 INSERT/UPDATE → [`biz52_erp_fee.selectById`](../../biz/sql/biz52_erp_fee.md) |
| `getSeq` | Biz51_Edit_ErpContCorp:100 | (공통) 채번 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`) |
| `sys.Sys00_Common.selectByKindGroupCode` | Biz51_Edit_ErpContCorp:126 | [`Sys00_Common.java:106`](../../sys/services/Sys00_Common.md) | [`sys09_code.selectByKindGroupCode`](../../sys/sql/sys09_code.md) |

## 테이블

[`biz50_erp_setup`](../../../db/tables/biz.md), [`biz51_erp_cont_corp`](../../../db/tables/biz.md), [`biz52_erp_fee`](../../../db/tables/biz.md), [`com01_relate_appr`](../../../db/tables/com.md), [`sys01_company`](../../../db/tables/sys.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md), [`sys15_corp`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_create_seq`, `f_sysdate`, `f_today`, `f_trunc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Biz51_Tab_ErpContCorp (`client/vi/biz/Biz51_Tab_ErpContCorp.java`, 293줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 검색: {searchText} {statusCheckBox} {retrieveButton} {insertButton} {deleteButton} {settingButton}
- 입력·하위 화면: `searchText` TextField 빈칸="계약사명/비고", `statusCheckBox` CheckBox, `lookupErpFee` Biz52_Lookup_ErpFee, `lookup` Com01_Lookup_RelateAppr, `lookupErpSetup` Biz50_Lookup_ErpSetup
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - actionCell 50 "수정" Cell 편집:editCell
  - erpProductCode 60 "상품코드" TextCenter
  - corpName 170 "계약사명" Text
  - contStatusName 60 "계약상태" TextCenter
  - serviceTypeName 70 "서비스종류" TextCenter
  - firstContDate 90 "최초계약일" Date
  - contDate 90 "(재)계약일" Date
  - contEndDate 90 "계약종료일" Date
  - erpStartDate 90 "시스템<br>사용시작일" Date
  - erpEndDate 90 "시스템<br>사용종료일" Date
  - erpFeeName 300 "사용료" Text
  - actionCell 40 "" Cell 편집:feeCell
  - managerName 90 "담당자" TextCenter
  - managerTel 120 "담당자<br>연락처" TextCenter
  - note 200 "비고" TextArea
  - locationName 90 "서브도메인" Text
  - fileCountStr 60 "증빙자료" TextCenter
  - actionCell 40 "" Cell 편집:dataCell

#### 이벤트
[E0] 화면 열림 (생성자 L58-84) → settings(), retrieve()
[E1] searchText.KeyPress [Enter] (L92) → retrieve()
[E2] retrieveButton[조회].Select (L101) → retrieve()
[E3] insertButton[등록].Select (L107) → insert()
[E4] deleteButton[삭제].Select (L113) → deleteRow()
       └ [E6] messageBox.DialogHide [YES] (L229) → retrieve()
[E5] settingButton[기본설정].Select (L119) → setting()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieve() | L200-219 | 생성자,E1,E2,E6,buildGrid,insert,setting | 서비스 biz.Biz51_ErpContCorp.selectByContStatusCode(contStatusCode, searchText) | 업무 |
| private deleteRow() | L221-252 | E4 | ConfirmBox → E6 | 업무 |
| private lookupEnd() | L254-265 | buildGrid | 서비스 biz.Biz51_ErpContCorp.selectById(erpContCorpId) | 업무 |
| public insert() | L267-274 | E3 | 팝업 Biz51_Edit_ErpContCorp 열기 | 업무 |
| private setting() | L276-283 | E5 | 조회창 Biz50_Lookup_ErpSetup 열기 | 업무 |
| public settings() | L86-126 | 생성자 | 이벤트 연결, 초기값: statusCheckBox=true("계약건만 보기") | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L128-198 | 필드 초기화 | 팝업 Biz51_Edit_ErpContCorp 열기, 조회창 Biz52_Lookup_ErpFee 열기, 조회창 Com01_Lookup_RelateAppr 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L285-287 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L289-291 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L177) addCell
  gb.textCenter('erpProductCd', 60, '상품코드'),  // L178
  gb.text('corpNm', 170, '계약사명'),  // L179
  gb.textCenter('contStatusNm', 60, '계약상태'),  // L180
  gb.textCenter('serviceTypeNm', 70, '서비스종류'),  // L181
  gb.date('firstContDate', 90, '최초계약일'),  // L182
  gb.date('contDate', 90, '(재)계약일'),  // L183
  gb.date('contEndDate', 90, '계약종료일'),  // L184
  gb.date('erpStartDate', 90, '시스템<br>사용시작일'),  // L185
  gb.date('erpEndDate', 90, '시스템<br>사용종료일'),  // L186
  gb.text('erpFeeNm', 300, '사용료'),  // L187
  // ⚠ 대응 없음 (GridBuilder L188) addCell
  gb.textCenter('managerNm', 90, '담당자'),  // L189
  gb.textCenter('managerTel', 120, '담당자<br>연락처'),  // L190
  gb.textArea('note', 200, '비고'),  // L191
  gb.text('locationNm', 90, '서브도메인'),  // L192
  gb.textCenter('fileCountStr', 60, '증빙자료'),  // L193
  // ⚠ 대응 없음 (GridBuilder L194) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insert}>등록</Button>
3. <Button type="delete" onClick={deleteRow}>삭제</Button>
4. <Button type="settings" onClick={setting}>기본설정</Button>

### Biz52_Lookup_ErpFee (`client/vi/biz/Biz52_Lookup_ErpFee.java`, 398줄)

- 툴바 `buttonBar`: {retrieveButton} {insertButton} {updateButton} {deleteButton}
- 입력·하위 화면: `dateCombo01` ComboBoxField("DateCode"), `dateCombo02` ComboBoxField("DateCode"), `vatCombo` ComboBoxField("VatCode"), `userCountStdCombo` ComboBoxField("UserCountStdMonthCode"), `chargeCalcMonthTypeCombo` ComboBoxField("MonthType")
- 그리드 `grid` (buildGrid(), 체크박스):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - startDate 100 "적용시작일" Date 편집:MyDateField
  - closeDate 100 "적용종료일" Date 편집:MyDateField
  - erpFee 100 "시스템사용료" Long 편집:LongField
  - dataFee 100 "DATA사용료" Long 편집:LongField
  - smsBaseCount 90 "기본제공<br>월문자건수" Long 편집:LongField
  - smsAddPrice 90 "추가 건당<br>문자사용료" Long 편집:LongField
  - serverBaseUsage 100 "기본제공<br>서버사용량(GB)" Long 편집:LongField
  - serverAddUnit 100 "서버사용량<br>추가단위(GB)" Long 편집:LongField
  - serverAddPrice 100 "서버사용량<br>추가당 금액" Long 편집:LongField
  - userBaseCount 90 "기본제공<br>사용인원" Long 편집:LongField
  - userAddPrice 90 "추가 인당<br>사용료(원)" Long 편집:LongField
  - chargeCalcMonthTypeName 100 "청구계산월" TextCenter 편집:chargeCalcMonthType…
  - userCountStdStr 100 "인원산정기준월" TextCenter 편집:userCountStdCombo
  - chargeDayStr 80 "월청구일" TextCenter 편집:dateCombo01
  - depositDueDayStr 80 "입금기한일" TextCenter 편집:dateCombo02
  - vatName 70 "VAT" TextCenter 편집:vatCombo
  - addFeeSmsYn 60 "문자" Boolean
  - addFeeServerYn 60 "서버" Boolean
  - addFeeUserYn 60 "사용자" Boolean

#### 이벤트
[E0] 화면 열림 (생성자 L77-102) → settings(), show()
[E1] retrieveButton[조회].Select (L105) → retrieve()
[E2] insertButton[등록].Select (L111) → insertRow()
[E3] updateButton[저장].Select (L117) → update()
[E4] deleteButton[삭제].Select (L123) → deleteChk()
       └ [E11] msgBox.DialogHide [YES] (L367) → deleteRow()
[E5] cancelButton[닫기].Select (L129) → close()
[E6] dateCombo01[DateCode].Collapse (L141) → 인라인 L141-147 (new CollapseHandler() { @Override pub…)
[E7] dateCombo02[DateCode].Collapse (L150) → 인라인 L150-156 (new CollapseHandler() { @Override pub…)
[E8] vatCombo[VatCode].Collapse (L159) → 인라인 L159-165 (new CollapseHandler() { @Override pub…)
[E9] userCountStdCombo[UserCountStdMonthCode].Collapse (L168) → 인라인 L168-174 (new CollapseHandler() { @Override pub…)
[E10] chargeCalcMonthTypeCombo[MonthType].Collapse (L177) → 인라인 L177-183 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L71-75 | 공개 메서드 | 상태 처리 | 업무 |
| private retrieve() | L210-223 | E1,open,update | 서비스 biz.Biz52_ErpFee.selectByErpContCorpId(companyId, erpContCorpId) | 업무 |
| private update() | L225-253 | E3 | 서비스 biz.Biz52_ErpFee.update | 업무 |
| private insertRow() | L255-362 | E2 | 서비스 biz.Biz50_ErpSetup.selectByStartDate(noteYn, stdDate, companyId) | 업무 |
| private deleteChk() | L364-382 | E4 | ConfirmBox → E11 | 업무 |
| private deleteRow() | L384-388 | E11 | GridDeleteData biz.Biz52_ErpFee.delete(체크된 행 목록) | 업무 |
| private close() | L390-393 | E5 | 상태 처리 | 업무 |
| private settings() | L104-135 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L137-208 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L395-397 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L185 newHeaderGroupMap018newHeaderGroupConfig13 100 "추가요금청구" (biz52_new_header_group_map018new_header_group_config13 컬럼 없음)
  gb.date('startDate', 100, '적용시작일', { editor: 'date' }),  // L187
  gb.date('closeDate', 100, '적용종료일', { editor: 'date' }),  // L188
  gb.long('erpFee', 100, '시스템사용료', { editor: 'number' }),  // L189
  gb.long('dataFee', 100, 'DATA사용료', { editor: 'number' }),  // L190
  gb.long('smsBaseCount', 90, '기본제공<br>월문자건수', { editor: 'number' }),  // L191
  gb.long('smsAddPrice', 90, '추가 건당<br>문자사용료', { editor: 'number' }),  // L192
  gb.long('serverBaseUsage', 100, '기본제공<br>서버사용량(GB)', { editor: 'number' }),  // L193
  gb.long('serverAddUnit', 100, '서버사용량<br>추가단위(GB)', { editor: 'number' }),  // L194
  gb.long('serverAddPrice', 100, '서버사용량<br>추가당 금액', { editor: 'number' }),  // L195
  gb.long('userBaseCount', 90, '기본제공<br>사용인원', { editor: 'number' }),  // L196
  gb.long('userAddPrice', 90, '추가 인당<br>사용료(원)', { editor: 'number' }),  // L197
  gb.textCenter('chargeCalcMonthTypeNm', 100, '청구계산월'),  // L198 SQL 계산 컬럼(selectByErpContCorpId: f_cdnm('MonthType', biz52_charge_calc_m…)
  gb.textCenter('userCountStdStr', 100, '인원산정기준월'),  // L199 SQL 계산 컬럼(selectByErpContCorpId: f_cdnm('UserCountStdMonthCode', biz52_u…)
  gb.textCenter('chargeDayStr', 80, '월청구일'),  // L200 SQL 계산 컬럼(selectByErpContCorpId: f_cdnm('DateCode', biz52_charge_day, #{…)
  gb.textCenter('depositDueDayStr', 80, '입금기한일'),  // L201 SQL 계산 컬럼(selectByErpContCorpId: f_cdnm('DateCode', biz52_deposit_due_da…)
  gb.textCenter('vatNm', 70, 'VAT'),  // L202 SQL 계산 컬럼(selectByErpContCorpId: f_cdnm('VatCode', biz52_vat_cd, #{compa…)
  gb.boolean('addFeeSmsYn', 60, '문자'),  // L203
  gb.boolean('addFeeServerYn', 60, '서버'),  // L204
  gb.boolean('addFeeUserYn', 60, '사용자'),  // L205
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={deleteChk}>삭제</Button>
5. <Button type="unknown" onClick={close}>닫기</Button>

### Biz51_Edit_ErpContCorp (`client/vi/biz/Biz51_Edit_ErpContCorp.java`, 363줄)

- 입력·하위 화면: `corpName` LookupTriggerField, `serviceTypeName` ComboBoxField("ErpServiceType"), `locationName` LookupTriggerField, `firstContDate` MyDateField, `contDate` MyDateField, `contEndDate` MyDateField, `erpStartDate` MyDateField, `erpEndDate` MyDateField, `erpFeeName` LookupTriggerField, `managerName` TextField, `managerTel` TextField, `managerEmail` TextField 빈칸="이메일1; 이메일2;", `companyCeo` TextField, `companyAddr` TextField, `note` MyTextArea, `serviceType` TextField, `contStatusCode` TextField, `companyId` LongField, `corpId` LongField, `contStatusName` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode"), `lookupErpFee` Biz52_Lookup_ErpFee, `lookupCompany` Sys01_Lookup_Company, `lookupCorp` Sys15_Lookup_Corp

#### 이벤트
[E0] 화면 열림 (생성자 L96-112) → init()
[E1] erpFeeName[사용료].TriggerClick [list.size() != 0] (L151) → checkLongNull()
[E2] locationName[서브 도메인].TriggerClick [result != null] (L181) → 인라인 L181-200 (new TriggerClickHandler(){ @Override …)
[E3] corpName[계약사명].TriggerClick [result != null] (L203) → 인라인 L203-221 (new TriggerClickHandler(){ @Override …)
[E4] updateButton[저장].Select (L222) → update()
[E5] closeButton[닫기].Select (L228) → hide()
[E6] contStatusName[계약상태].Collapse (L237) → 인라인 L237-242 (new CollapseHandler() { @Override pub…)
[E7] serviceTypeName[서비스 종류].Collapse (L243) → 인라인 L243-248 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public init() | L121-144 | 생성자 | 서비스 sys.Sys00_Common.selectByKindGroupCode | 업무 |
| private getEditor() | L236-321 | init | 상태 처리 | 업무 |
| public update() | L323-342 | E4 | 서비스 biz.Biz51_ErpContCorp.insertUpdate | 업무 |
| private checkLongNull() | L344-354 | E1 | 상태 처리 | 업무 |
| private settings() | L146-234 | init | 조회창 Biz52_Lookup_ErpFee 열기, 조회창 Sys01_Lookup_Company 열기, 조회창 Sys15_Lookup_Corp 열기, 서비스 biz.Biz52_ErpFee.selectByStartDate(stdDate, companyId, erpContCorpId), 이벤트 연결, 초기값: erpFeeName="시스템사용료 : " + checkLongNull(erpFeeModel.getErpFee(("사용료"), erpFeeName=null("사용료"), locationName=companyModel.getLocationName(("서브 도메인"), companyId=companyModel.getCompanyId(, locationName=null("서브 도메인"), companyId=null, corpId=corpModel.getCorpId(, corpName=corpModel.getCorpName(("계약사명"), corpName=null("계약사명"), corpId=null | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L356-358 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L360-362 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Biz50_Lookup_ErpSetup (`client/vi/biz/Biz50_Lookup_ErpSetup.java`, 345줄)

- 툴바 `buttonBar01`: {retrieveButton} {insertButton} {updateButton} {deleteButton} {mappingButton}
- 툴바 `buttonBar02`: {label}
- 입력·하위 화면: `note` MyTextArea, `dateCombo01` ComboBoxField("DateCode"), `dateCombo02` ComboBoxField("DateCode"), `vatCombo` ComboBoxField("VatCode"), `lookupMailMapping` Biz50_Lookup_MailMapping
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - startDate 100 "적용시작일" Date 편집:MyDateField
  - smsBaseCount 110 "기본제공<br>월문자건수" Long 편집:LongField
  - smsAddPrice 110 "추가 건당<br>문자사용료" Long 편집:LongField
  - serverBaseUsage 110 "기본제공<br>서버사용량(GB)" Long 편집:LongField
  - serverAddUnit 110 "서버사용량<br>추가단위(GB)" Long 편집:LongField
  - serverAddPrice 110 "서버사용량<br>추가당 금액" Long 편집:LongField
  - userBaseCount 110 "기본제공<br>사용인원" Long 편집:LongField
  - userAddPrice 110 "추가 인당<br>사용료(원)" Long 편집:LongField
  - chargeDayStr 80 "월청구일" TextCenter 편집:dateCombo01
  - depositDueDayStr 80 "입금기한일" TextCenter 편집:dateCombo02
  - vatName 70 "VAT" TextCenter 편집:vatCombo

#### 이벤트
[E0] 화면 열림 (생성자 L75-111) → settings(), show()
[E1] retrieveButton[조회].Select (L114) → retrieve()
[E2] insertButton[등록].Select (L120) → insertRow()
[E3] updateButton[저장].Select (L126) → update(), updateNote()
[E4] deleteButton[삭제].Select (L133) → deleteChk()
       └ [E10] msgBox.DialogHide [YES] (L279) → deleteRow()
[E5] cancelButton[닫기].Select (L139) → hide()
[E6] mappingButton[메일양식].Select (L146) → mappingSet()
[E7] dateCombo01[DateCode].Collapse (L158) → 인라인 L158-164 (new CollapseHandler() { @Override pub…)
[E8] dateCombo02[DateCode].Collapse (L167) → 인라인 L167-173 (new CollapseHandler() { @Override pub…)
[E9] vatCombo[VatCode].Collapse (L176) → 인라인 L176-182 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L69-73 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L200-229 | E1,open | 서비스 biz.Biz50_ErpSetup.selectAll, biz.Biz50_ErpSetup.getNote(companyId, noteYn) | 업무 |
| public update() | L231-251 | E3 | 서비스 biz.Biz50_ErpSetup.update | 업무 |
| public updateNote() | L253-266 | E3 | 서비스 biz.Biz50_ErpSetup.updateNote(note, noteYn) | 업무 |
| public insertRow() | L268-274 | E2 | 상태 처리 | 업무 |
| private deleteChk() | L276-294 | E4 | ConfirmBox → E10 | 업무 |
| public deleteRow() | L296-300 | E10 | GridDeleteData biz.Biz50_ErpSetup.delete(체크된 행 목록) | 업무 |
| public mappingSet() | L302-340 | E6 | 조회창 Biz50_Lookup_MailMapping 열기, 서비스 biz.Biz50_ErpSetup.selectMailForm, biz.Biz50_ErpSetup.insertMailForm(noteYn) | 업무 |
| private settings() | L113-152 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L154-198 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L342-344 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('startDate', 100, '적용시작일', { editor: 'date' }),  // L185
  gb.long('smsBaseCount', 110, '기본제공<br>월문자건수', { editor: 'number' }),  // L186
  gb.long('smsAddPrice', 110, '추가 건당<br>문자사용료', { editor: 'number' }),  // L187
  gb.long('serverBaseUsage', 110, '기본제공<br>서버사용량(GB)', { editor: 'number' }),  // L188
  gb.long('serverAddUnit', 110, '서버사용량<br>추가단위(GB)', { editor: 'number' }),  // L189
  gb.long('serverAddPrice', 110, '서버사용량<br>추가당 금액', { editor: 'number' }),  // L190
  gb.long('userBaseCount', 110, '기본제공<br>사용인원', { editor: 'number' }),  // L191
  gb.long('userAddPrice', 110, '추가 인당<br>사용료(원)', { editor: 'number' }),  // L192
  gb.textCenter('chargeDayStr', 80, '월청구일'),  // L193 SQL 계산 컬럼(selectAll: f_cdnm('DateCode', biz50_charge_day, #{…)
  gb.textCenter('depositDueDayStr', 80, '입금기한일'),  // L194 SQL 계산 컬럼(selectAll: f_cdnm('DateCode', biz50_deposit_due_da…)
  gb.textCenter('vatNm', 70, 'VAT'),  // L195 SQL 계산 컬럼(selectAll: f_cdnm('VatCode', biz50_vat_cd, #{compa…)
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={() => /* update(), updateNote() */}>저장</Button>
3. <Button type="register" onClick={insertRow}>등록</Button>
4. <Button type="delete" onClick={deleteChk}>삭제</Button>
5. <Button type="unknown" onClick={mappingSet}>메일양식</Button>
6. <Button type="unknown" onClick={hide}>닫기</Button>

### Biz50_Lookup_MailMapping (`client/vi/biz/Biz50_Lookup_MailMapping.java`, 155줄)

- 입력·하위 화면: `content` TextField

#### 이벤트
[E0] 화면 열림 (생성자 L54-88) → getEditor(), show()
[E1] updateButton[저장].Select (L70) → update()
[E2] closeButton[닫기].Select (L76) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L50-52 | 공개 메서드 | 상태 처리 | 업무 |
| private getEditor() | L90-119 | 생성자 | 상태 처리 | 업무 |
| public update() | L122-135 | E1 | 서비스 biz.Biz50_ErpSetup.insertMailForm | 업무 |
| private setHtmlStyle() | L147-149 | 미사용 후보 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L151-153 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

