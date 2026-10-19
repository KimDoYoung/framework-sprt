# Emp50_Tab_TransportExpense

- 종류: 화면
- 메뉴: 신청 > 80. 사업비 신청 > 여비교통비 신청 (#1349)
- 파일: `client/vi/emp/Emp50_Tab_TransportExpense.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Dcr30_Move_DcrClass`](../../dcr/components/Dcr30_Move_DcrClass.md), [`Sys10_Lookup_FileViewer`](../../sys/components/Sys10_Lookup_FileViewer.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectById` | Emp50_Tab_TransportExpense:256, Emp50_Tab_TransportExpense:737 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `dcr.Dcr30_Link.selectByLinkCode` | Emp50_Tab_TransportExpense:690 | [`Dcr30_Link.java:46`](../../dcr/services/Dcr30_Link.md) | [`dcr01_class_tree.selectByLinkCode`](../../dcr/sql/dcr01_class_tree.md) |
| `emp.Emp50_TransportExpense.copyUpdate` | Emp50_Tab_TransportExpense:898 | [`Emp50_TransportExpense.java:42`](../../emp/services/Emp50_TransportExpense.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(emp50_transport_expense)` 동적 INSERT/UPDATE → [`emp50_transport_expense.selectById`](../../emp/sql/emp50_transport_expense.md) |
| `emp.Emp50_TransportExpense.delete` | Emp50_Tab_TransportExpense:949 | [`Emp50_TransportExpense.java:60`](../../emp/services/Emp50_TransportExpense.md) | `UpdateDataModel(emp50_transport_expense)` 동적 DELETE |
| `emp.Emp50_TransportExpense.selectByYearMonth` | Emp50_Tab_TransportExpense:387 | [`Emp50_TransportExpense.java:26`](../../emp/services/Emp50_TransportExpense.md) | [`emp50_transport_expense.selectByYearMonth`](../../emp/sql/emp50_transport_expense.md) |
| `emp.Emp50_TransportExpense.update` | Emp50_Tab_TransportExpense:572 | [`Emp50_TransportExpense.java:55`](../../emp/services/Emp50_TransportExpense.md) | `UpdateDataModel(emp50_transport_expense)` 동적 INSERT/UPDATE → [`emp50_transport_expense.selectById`](../../emp/sql/emp50_transport_expense.md) |
| `emp.Emp51_RelateAppr.insert` | Emp50_Tab_TransportExpense:772 | [`Emp51_RelateAppr.java:86`](../../emp/services/Emp51_RelateAppr.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`emp51_relate_appr.deleteByApprId`](../../emp/sql/emp51_relate_appr.md), [`emp51_relate_appr.insert`](../../emp/sql/emp51_relate_appr.md), [`emp51_relate_appr.selectByPersonId`](../../emp/sql/emp51_relate_appr.md), [`emp51_relate_appr.selectByRegno`](../../emp/sql/emp51_relate_appr.md) |
| `emp.Emp51_RelateAppr.selectApprId` | Emp50_Tab_TransportExpense:726 | [`Emp51_RelateAppr.java:70`](../../emp/services/Emp51_RelateAppr.md) | [`emp51_relate_appr.selectByPersonId`](../../emp/sql/emp51_relate_appr.md) |
| `emp.Emp51_RelateAppr.selectByCloseYn` | Emp50_Tab_TransportExpense:451, Emp50_Tab_TransportExpense:826 | [`Emp51_RelateAppr.java:56`](../../emp/services/Emp51_RelateAppr.md) | [`emp51_relate_appr.selectByCloseYn`](../../emp/sql/emp51_relate_appr.md) |
| `emp.Emp51_RelateAppr.selectByPersonId` | Emp50_Tab_TransportExpense:401 | [`Emp51_RelateAppr.java:26`](../../emp/services/Emp51_RelateAppr.md) | [`emp51_relate_appr.selectByPersonId`](../../emp/sql/emp51_relate_appr.md) |
| `emp.Emp51_RelateAppr.updateApprId` | Emp50_Tab_TransportExpense:851 | [`Emp51_RelateAppr.java:140`](../../emp/services/Emp51_RelateAppr.md) | [`emp51_relate_appr.updateApprId`](../../emp/sql/emp51_relate_appr.md) |
| `sys.Sys11_RelateFile.checkFileDelete` | Emp50_Tab_TransportExpense:922 | [`Sys11_RelateFile.java:59`](../../sys/services/Sys11_RelateFile.md) | [`sys11_relate_file.checkFileDelete01`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete02`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete03`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.deleteRelateFile`](../../sys/sql/sys11_relate_file.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`apr99_appr_del`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp50_transport_expense`](../../../db/tables/emp.md), [`emp51_relate_appr`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_get_dcr_no`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Emp50_Tab_TransportExpense (`client/vi/emp/Emp50_Tab_TransportExpense.java`, 988줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: {fileDeleteForm} 기준년월: {yyyyText} {periodComboBox} {retrieveButton} {insertButton} {copyButton} {updateButton} {deleteButton} {notice}
- 입력·하위 화면: `periodComboBox` ComboBoxField("MonthsCode"), `yyyyText` TextField, `classTreeFullName` LookupTriggerField 빈칸="문서분류가 미지정 상태입니다. 관리자에게 문의해주세요", `apprStepCode` TextField, `apprStepName` TextField, `editor` Apr01_Edit_ApprDoc, `viewer` Sys10_Lookup_FileViewer, `transportCodeComboBox` ComboBoxField("TransportCode"), `apprDoc` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - date 100 "일자" Date 편집:MyDateField
  - startPoint 150 "출발지" Text 편집:TextField
  - closePoint 150 "도착지" Text 편집:TextField
  - startTime 100 "출발" TextCenter 편집:TextField
  - closeTime 100 "도착" TextCenter 편집:TextField
  - amt 150 "금액" Long 편집:LongField
  - transportName 100 "교통수단" Text 편집:transportCodeComboB…
  - receiptStr 60 "여부" TextCenterCursor
  - actionCell 60 "등록" Cell 편집:fileUpButton
  - actionCell 60 "삭제" Cell 편집:fileDeleteButton
  - note 200 "비고<br>(비밀번호)" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L121-332) → retrieve(), defaultName()
[E1] yyyyText.ValueChange (L130) → retrieve()
[E2] periodComboBox[MonthsCode].Collapse (L141) → retrieve()
[E3] fileDeleteForm.SubmitComplete (L165) → retrieve()
[E4] fileUpdownForm.Change (L173) → retrieve()
[E5] yyyyText.KeyPress [Enter] (L193) → retrieve()
[E6] periodComboBox[MonthsCode].ValueChange (L202) → retrieve()
[E7] retrieveButton[조회].Select (L209) → retrieve()
[E8] insertButton[등록].Select (L216) → preCheck()
[E9] updateButton[저장].Select (L223) → preCheck()
[E10] deleteButton[삭제].Select (L229) → preCheck()
[E11] copyButton[등록(복사)].Select (L235) → preCheck()
[E12] apprButton[상신].Select (L242) → insertLinkApproval()
[E13] apprViewButton[문서보기].Select (L253) → apprChk()
[E14] classTreeFullName[문서분류].TriggerClick (L279) → openLookupDoc()
[E15] grid.CellClick [event.getCellIndex() == 9] (L286) → 인라인 L286-299 (new CellClickHandler() { @Override pu…)
[E16] transportCodeComboBox[TransportCode].Collapse (L338) → 인라인 L338-345 (new CollapseHandler() { @Override pub…)
[E17] msgBox.DialogHide [YES] (L566) → 서비스 emp.Emp50_TransportExpense.update
[E18] msgBox.DialogHide [YES] (L628) → deleteRow()
[E19] msgBox.DialogHide [YES] (L657) → fileDelete()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L381-397 | 생성자,E1,E2,E3,E4,E5,E6,E7,insertLinkApproval,updateApprId,fileDelete | 서비스 emp.Emp50_TransportExpense.selectByYearMonth(yyyymm, companyId, personId) | 업무 |
| private apprChk() | L399-447 | E13,retrieve | 서비스 emp.Emp51_RelateAppr.selectByPersonId | 업무 |
| private closeChk() | L449-469 | retrieve | 서비스 emp.Emp51_RelateAppr.selectByCloseYn | 업무 |
| public preCheck() | L471-519 | E8,E9,E10,E11 | 상태 처리 | 업무 |
| private update() | L521-587 | preCheck | 확인창 표시, 서비스 emp.Emp50_TransportExpense.update, emp.Emp50_TransportExpense.update | 업무 |
| public insertRow() | L589-602 | preCheck | 상태 처리 | 업무 |
| private fileUploadChk() | L604-623 | buildGrid | 미선택 시 alert "이미 상신된 데이터는 수정할 수 없습니다." | 업무 |
| private deleteChk() | L625-643 | preCheck | 확인창 표시 | 업무 |
| private fileDeleteChk() | L645-675 | buildGrid | 확인창 표시 | 업무 |
| private openLookupDoc() | L678-687 | E14 | 상태 처리 | 업무 |
| private defaultName() | L689-708 | 생성자 | 서비스 dcr.Dcr30_Link.selectByLinkCode | 업무 |
| private insertLinkApproval() | L710-813 | E12 | 팝업 Apr01_Edit_ApprDoc 열기, 서비스 emp.Emp51_RelateAppr.selectApprId, apr.Apr01_Appr.selectById, emp.Emp51_RelateAppr.insert | 업무 |
| private checkAppr() | L815-822 | preCheck,fileUploadChk,fileDeleteChk | 상태 처리 | 업무 |
| private checkClose() | L824-847 | preCheck,insertLinkApproval | 서비스 emp.Emp51_RelateAppr.selectByCloseYn | 업무 |
| private updateApprId() | L850-862 | insertLinkApproval | 서비스 emp.Emp51_RelateAppr.updateApprId(relateApprId, apprId) | 업무 |
| public copyInsertRow() | L864-895 | preCheck | 상태 처리 | 업무 |
| public copyUpdateRow() | L897-909 | copyInsertRow | 서비스 emp.Emp50_TransportExpense.copyUpdate | 업무 |
| private getGridList() | L911-917 | insertLinkApproval | 상태 처리 | 업무 |
| public fileDelete() | L919-944 | E19 | 서비스 sys.Sys11_RelateFile.checkFileDelete(fileId, parentId) | 업무 |
| public deleteRow() | L946-950 | E18 | GridDeleteData emp.Emp50_TransportExpense.delete(체크된 행 목록) | 업무 |
| private getYYYYMM() | L952-966 | retrieve,apprChk,closeChk,insertRow,insertLinkApproval,checkClose | 상태 처리 | 업무 |
| private getTotalAmt() | L968-974 | insertLinkApproval | 상태 처리 | 업무 |
| public buildGrid() | L334-379 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L976-978 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L980-982 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L984-986 | 필드 초기화 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L361 newHeaderGroupMap03newHeaderGroupConfig12 100 "행선지" (sys10_new_header_group_map03new_header_group_config12 컬럼 없음)
  // ⚠DB없음 L362 newHeaderGroupMap05newHeaderGroupConfig12 100 "시간" (sys10_new_header_group_map05new_header_group_config12 컬럼 없음)
  // ⚠DB없음 L363 newHeaderGroupMap09newHeaderGroupConfig13 100 "영수증" (sys10_new_header_group_map09new_header_group_config13 컬럼 없음)
  gb.date('date', 100, '일자', { editor: 'date' }),  // L366
  gb.text('startPoint', 150, '출발지', { editor: 'text' }),  // L367
  gb.text('closePoint', 150, '도착지', { editor: 'text' }),  // L368
  gb.textCenter('startTime', 100, '출발', { editor: 'text' }),  // L369
  gb.textCenter('closeTime', 100, '도착', { editor: 'text' }),  // L370
  gb.long('amt', 150, '금액', { editor: 'number' }),  // L371
  gb.text('transportNm', 100, '교통수단', { editor: 'select' }),  // L372
  // ⚠ 대응 없음 (GridBuilder L373) addTextCenterCursor
  // ⚠ 대응 없음 (GridBuilder L374) addCell
  // ⚠ 대응 없음 (GridBuilder L375) addCell
  gb.text('note', 200, '비고<br>(비밀번호)', { editor: 'text' }),  // L376
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={preCheck}>등록</Button>
3. <Button type="register" onClick={preCheck}>등록(복사)</Button>
4. <Button type="save" onClick={preCheck}>저장</Button>
5. <Button type="delete" onClick={preCheck}>삭제</Button>
6. <Button type="register" onClick={insertLinkApproval}>상신</Button>
7. <Button type="search" onClick={apprChk}>문서보기</Button>

