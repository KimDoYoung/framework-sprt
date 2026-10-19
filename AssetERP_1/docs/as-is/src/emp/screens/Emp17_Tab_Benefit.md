# Emp17_Tab_Benefit

- 종류: 화면
- 메뉴: 신청 > 80. 사업비 신청 > 복리후생비 신청 (#1221)
- 파일: `client/vi/emp/Emp17_Tab_Benefit.java`
- 함께 쓰는 클래스 1개:
  - `Emp17_Lookup_Benefit` `client/vi/emp/Emp17_Lookup_Benefit.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Dcr30_Lookup_Link`](../../dcr/components/Dcr30_Lookup_Link.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectById` | Emp17_Tab_Benefit:207 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `dcr.Dcr30_Link.selectByLinkCode` | Emp17_Lookup_Benefit:334 | [`Dcr30_Link.java:46`](../../dcr/services/Dcr30_Link.md) | [`dcr01_class_tree.selectByLinkCode`](../../dcr/sql/dcr01_class_tree.md) |
| `emp.Emp17_Benefit.delete` | Emp17_Tab_Benefit:303 | [`Emp17_Benefit.java:242`](../../emp/services/Emp17_Benefit.md) | `UpdateDataModel(emp17_benefit)` 동적 DELETE |
| `emp.Emp17_Benefit.deleteBenefitId` | Emp17_Lookup_Benefit:285 | [`Emp17_Benefit.java:228`](../../emp/services/Emp17_Benefit.md) | [`emp17_benefit.deleteBenefitId`](../../emp/sql/emp17_benefit.md) |
| `emp.Emp17_Benefit.modelUpdate` | Emp17_Lookup_Benefit:258 | [`Emp17_Benefit.java:180`](../../emp/services/Emp17_Benefit.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(emp17_benefit)` 동적 INSERT/UPDATE → [`emp17_benefit.selectById`](../../emp/sql/emp17_benefit.md) |
| `emp.Emp17_Benefit.selectByPersonId` | Emp17_Tab_Benefit:283 | [`Emp17_Benefit.java:70`](../../emp/services/Emp17_Benefit.md) | [`emp17_benefit.selectByPersonId`](../../emp/sql/emp17_benefit.md) |
| `emp.Emp17_Benefit.updateApprId` | Emp17_Lookup_Benefit:303 | [`Emp17_Benefit.java:193`](../../emp/services/Emp17_Benefit.md) | [`emp17_benefit.updateApprId`](../../emp/sql/emp17_benefit.md) |
| `emp.Emp55_BenefitInfo.selectByBenefitCode` | Emp17_Lookup_Benefit:318 | [`Emp55_BenefitInfo.java:39`](../../emp/services/Emp55_BenefitInfo.md) | [`emp55_benefit_info.selectByBenefitCode`](../../emp/sql/emp55_benefit_info.md) |
| `sys.Sys00_Common.selectBenefit` | Emp17_Lookup_Benefit:75, Emp17_Tab_Benefit:76 | [`Sys00_Common.java:146`](../../sys/services/Sys00_Common.md) | [`sys00_common.selectBenefit`](../../sys/sql/sys00_common.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp17_benefit`](../../../db/tables/emp.md), [`emp55_benefit_info`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_get_account_nm`, `f_get_dcr_no`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Emp17_Tab_Benefit (`client/vi/emp/Emp17_Tab_Benefit.java`, 343줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 조회기간: {startDate} ~: {closeDate} 신청구분: {benefitTypeName} 지급여부: {benefitYn} 검색: {searchTextField} {retrieveButton} {insertButton} {deleteButton} {dcrLinkButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `searchTextField` TextField 빈칸="문서명", `benefitYn` StringComboBox, `benefitTypeName` CommonComboBoxField("sys.Sys00_Common.selectBenefit", "%", "전체"), `lookup` Dcr30_Lookup_Link, `editor` Apr01_Edit_ApprDoc, `popup` Emp17_Lookup_Benefit
- 그리드 `grid` (buildGrid(), 체크박스):
  - issueDate 100 "신청일" Date
  - benefitName 150 "신청구분" Text
  - apprTitleName 400 "문서명" Text
  - issueAmt 150 "신청금액" Long
  - occDate 100 "발생일자" Date
  - benefitDetail 160 "내용" Text
  - apprStatusName 100 "결재상태" TextCenter
  - actionCell 80 "문서보기" Cell 편집:actionCell
  - benefitYnStr 100 "지급여부" TextCenter
  - note 350 "알림" TextArea

#### 이벤트
[E0] 화면 열림 (생성자 L78-124) → settings(), retrieve()
[E1] retrieveButton[조회].Select (L137) → retrieve()
[E2] insertButton[등록].Select (L143) → insertBenefit()
[E3] deleteButton[삭제].Select (L149) → deleteRow()
       └ [E8] messageBox.DialogHide [YES] (L297) → 서비스 emp.Emp17_Benefit.delete
[E4] searchTextField.KeyPress [Enter] (L156) → retrieve()
[E5] benefitTypeName[sys.Sys00_Common.selectBenefit].Collapse (L165) → retrieve()
[E6] benefitYn[전체].Collapse (L171) → retrieve()
[E7] dcrLinkButton[문서분류지정].Select (L177) → 인라인 L177-188 (new SelectHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieve() | L255-289 | 생성자,E1,E4,E5,E6,insertBenefit,comboBoxRetrieve | 서비스 emp.Emp17_Benefit.selectByPersonId(companyId, personId, startDate, closeDate, benefitCode, benefitYn, searchText) | 업무 |
| private deleteRow() | L291-314 | E3 | 미선택 시 alert "결재 중인 문서가 존재하여 삭제할 수 없습니다." → 확인창 E8 | 업무 |
| public insertBenefit() | L316-324 | E2 | 조회창 Emp17_Lookup_Benefit 열기 | 업무 |
| private comboBoxRetrieve() | L326-337 | settings | 상태 처리 | 업무 |
| public settings() | L126-189 | 생성자 | 조회창 Dcr30_Lookup_Link 열기, 이벤트 연결, 초기값: startDate=ClientDateUtil.toDate(fromDateStr, closeDate=LoginUser.getToday( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L191-253 | 필드 초기화 | 팝업 Apr01_Edit_ApprDoc 열기, 미선택 시 alert "상신문서가 존재하지 않습니다", 서비스 apr.Apr01_Appr.selectById, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L339-341 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('issueDate', 100, '신청일'),  // L241
  gb.text('benefitNm', 150, '신청구분'),  // L242 SQL 계산 컬럼(selectById: f_cdnm('EmpBenefitType', emp17_benefit_…)
  gb.text('apprTitleNm', 400, '문서명'),  // L243 SQL 계산 컬럼(selectById: apr01_title)
  gb.long('issueAmt', 150, '신청금액'),  // L244
  gb.date('occDate', 100, '발생일자'),  // L245
  gb.text('benefitDetail', 160, '내용'),  // L246
  gb.textCenter('statusNm', 100, '결재상태'),  // L247 SQL 계산 컬럼(selectById: f_cdnm('AprStatusCode', apr01_status_cd…)
  // ⚠ 대응 없음 (GridBuilder L248) addCell
  // ⚠DB없음 L249 benefitYnStr 100 "지급여부" (emp17_benefit_yn_str 컬럼 없음)
  gb.textArea('note', 350, '알림'),  // L250
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertBenefit}>등록</Button>
3. <Button type="delete" onClick={deleteRow}>삭제</Button>
4. <Button type="save" onClick={() => /* 인라인 L177-188 (new SelectHandler() { @Override publi…) */}>문서분류지정</Button>

### Emp17_Lookup_Benefit (`client/vi/emp/Emp17_Lookup_Benefit.java`, 491줄)

- 입력·하위 화면: `yearText` TextField, `monthComboBox` ComboBoxField("MonthsCode"), `issueAmt` LongField, `benefitDetail` TextField 빈칸="ex) 자기계발비 / 체력단련비", `occDate` DateField, `benefitName` CommonComboBoxField("sys.Sys00_Common.selectBenefit") 빈칸="선택", `benefitCode` TextField, `editor` Apr01_Edit_ApprDoc

#### 이벤트
[E0] 화면 열림 (생성자 L101-145) → show()
[E1] updateButton[상신].Select (L118) → update()
[E2] closeButton[닫기].Select (L124) → hide()
[E3] benefitName[신청구분].Collapse (L149) → 인라인 L149-154 (new CollapseHandler() { @Override pub…)
[E4] benefitName[신청구분].Selection (L156) → updateRow02(), searchDcr()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public insert() | L87-99 | 공개 메서드 | 상태 처리 | 업무 |
| private getEditor() | L147-188 | insert | 상태 처리 | 업무 |
| public update() | L190-300 | E1 | 팝업 Apr01_Edit_ApprDoc 열기, 서비스 yyyy.MM.dd, emp.Emp17_Benefit.modelUpdate, emp.Emp17_Benefit.deleteBenefitId(benefitId, companyId) | 업무 |
| private updateApprId() | L302-315 | update | 서비스 emp.Emp17_Benefit.updateApprId | 업무 |
| private searchDcr() | L317-354 | E4 | 서비스 emp.Emp55_BenefitInfo.selectByBenefitCode, dcr.Dcr30_Link.selectByLinkCode | 업무 |
| private updateRow02() | L368-383 | E4 | 상태 처리 | 업무 |
| public createMapping() | L386-402 | update | 상태 처리 | 업무 |
| private checkStringNull() | L404-412 | createMapping | 상태 처리 | 업무 |
| private checkDate01Null() | L414-424 | createMapping | 상태 처리 | 업무 |
| private checkDate02Null() | L426-436 | createMapping | 상태 처리 | 업무 |
| private checkLongNull() | L438-448 | createMapping | 상태 처리 | 업무 |
| private NumberToKorean() | L450-477 | createMapping | 상태 처리 | 업무 |
| private setHtmlStyle() | L479-481 | getEditor,updateRow02 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L483-485 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L487-489 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="register" onClick={update}>상신</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

