# Est03_Tab_PfHistory

- 종류: 화면
- 메뉴: 펀드관리 > 05. 부동산PF 용역수행 > 용역수행내역 등록 (#1377)
- 파일: `client/vi/est/Est03_Tab_PfHistory.java`
- 함께 쓰는 클래스 3개:
  - `Est03_TabPage_PfHistory` `client/vi/est/Est03_TabPage_PfHistory.java`
  - `Est04_Grid_PfFile` `client/vi/est/Est04_Grid_PfFile.java`
  - `Est02_Lookup_PfContract` `client/vi/est/Est02_Lookup_PfContract.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Emp00_Lookup_SelectSingle`](../../emp/components/Emp00_Lookup_SelectSingle.md), [`Sys10_Lookup_FileViewer`](../../sys/components/Sys10_Lookup_FileViewer.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `est.Est02_PfContract.selectByText` | Est02_Lookup_PfContract:135 | [`Est02_PfContract.java:27`](../../est/services/Est02_PfContract.md) | [`est02_pf_contract.selectByText`](../../est/sql/est02_pf_contract.md) |
| `est.Est03_PfHistory.delete` | Est03_Tab_PfHistory:268 | [`Est03_PfHistory.java:151`](../../est/services/Est03_PfHistory.md) | `UpdateDataModel(est03_pf_history)` 동적 DELETE |
| `est.Est03_PfHistory.getConfirmerParent` | Est03_Tab_PfHistory:202 | [`Est03_PfHistory.java:88`](../../est/services/Est03_PfHistory.md) | [`est03_pf_history.getConfirmerParent`](../../est/sql/est03_pf_history.md) |
| `est.Est03_PfHistory.modelUpdate` | Est03_TabPage_PfHistory:275, Est03_TabPage_PfHistory:358 | [`Est03_PfHistory.java:114`](../../est/services/Est03_PfHistory.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`est03_pf_history.checkNo`](../../est/sql/est03_pf_history.md), `UpdateDataModel(est03_pf_history)` 동적 INSERT/UPDATE → [`est03_pf_history.selectById`](../../est/sql/est03_pf_history.md) |
| `est.Est03_PfHistory.selectByPfContractId` | Est03_Tab_PfHistory:188 | [`Est03_PfHistory.java:27`](../../est/services/Est03_PfHistory.md) | [`est03_pf_history.selectByPfContractId`](../../est/sql/est03_pf_history.md) |
| `est.Est04_PfFile.delete` | Est04_Grid_PfFile:307 | [`Est04_PfFile.java:33`](../../est/services/Est04_PfFile.md) | `UpdateDataModel(est04_pf_file)` 동적 DELETE |
| `est.Est04_PfFile.selectByPfHistoryId` | Est04_Grid_PfFile:249 | [`Est04_PfFile.java:22`](../../est/services/Est04_PfFile.md) | [`est04_pf_file.selectByPfHistoryId`](../../est/sql/est04_pf_file.md) |
| `est.Est04_PfFile.update` | Est04_Grid_PfFile:304 | [`Est04_PfFile.java:28`](../../est/services/Est04_PfFile.md) | `UpdateDataModel(est04_pf_file)` 동적 INSERT/UPDATE → [`est04_pf_file.selectById`](../../est/sql/est04_pf_file.md) |
| `sys.Sys10_File.selectByParentId` | Est04_Grid_PfFile:109 | [`Sys10_File.java:51`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |
| `sys.Sys11_RelateFile.checkFileDelete` | Est04_Grid_PfFile:327 | [`Sys11_RelateFile.java:59`](../../sys/services/Sys11_RelateFile.md) | [`sys11_relate_file.checkFileDelete01`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete02`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete03`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.deleteRelateFile`](../../sys/sql/sys11_relate_file.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr99_appr_del`](../../../db/tables/apr.md), [`emp01_person`](../../../db/tables/emp.md), [`est01_pf_fee_type`](../../../db/tables/est.md), [`est02_pf_contract`](../../../db/tables/est.md), [`est03_pf_history`](../../../db/tables/est.md), [`est04_pf_file`](../../../db/tables/est.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_emp_kor_nm`, `f_get_confirmer_parent`, `f_get_emptrans`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Est03_Tab_PfHistory (`client/vi/est/Est03_Tab_PfHistory.java`, 283줄)

- 레이아웃: center=vlc, south=tabPage
- 툴바 `buttonBar`: 체결용역: {contractName01} {contractName02} {retrieveButton} {insertButton} {deleteButton}
- 입력·하위 화면: `contractName01` LookupTriggerField 빈칸="체결용역을 선택해주세요", `contractName02` TextField, `tabPage` Est03_TabPage_PfHistory, `lookup` Est02_Lookup_PfContract
- 그리드 `grid` (buildGrid()):
  - no 100 "수행번호" LongCenter
  - startDate 100 "수행시작일" Date
  - closeDate 100 "수행종료일" Date
  - content 350 "수행내역" Text
  - detail 350 "상세내역" Text
  - personName 100 "담당자" Text
  - statusName 100 "승인상태" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L63-89) → settings()
[E1] contractName01.TriggerClick (L97) → retrieve()
[E2] retrieveButton[조회].Select (L120) → retrieve()
[E3] insertButton[등록].Select (L126) → insertRow()
[E4] deleteButton[삭제].Select (L132) → deleteRow()
       └ [E6] msgBox.DialogHide [YES] (L261) → 서비스 est.Est03_PfHistory.delete
[E5] grid.RowClick (L146) → retrieveTabpage()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieveTabpage() | L154-162 | E5 | 상태 처리 | 업무 |
| public retrieve() | L177-194 | E1,E2 | 서비스 est.Est03_PfHistory.selectByPfContractId(companyId, pfContractId) | 업무 |
| private insertRow() | L196-232 | E3 | 서비스 est.Est03_PfHistory.getConfirmerParent(personId, date) | 업무 |
| public deleteRow() | L258-278 | E4 | ConfirmBox → E6 | 업무 |
| private settings() | L91-152 | 생성자 | 조회창 Est02_Lookup_PfContract 열기, 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L164-175 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L280-282 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.longCenter('no', 100, '수행번호'),  // L166
  gb.date('startDate', 100, '수행시작일'),  // L167
  gb.date('closeDate', 100, '수행종료일'),  // L168
  gb.text('content', 350, '수행내역'),  // L169
  gb.text('detail', 350, '상세내역'),  // L170
  gb.text('personNm', 100, '담당자'),  // L171
  gb.textCenter('statusNm', 100, '승인상태'),  // L172
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="delete" onClick={deleteRow}>삭제</Button>

### Est03_TabPage_PfHistory (`client/vi/est/Est03_TabPage_PfHistory.java`, 437줄)

- 입력·하위 화면: `no` LongField, `startDate` MyDateField, `closeDate` MyDateField, `personId` LongField, `personName` LookupTriggerField, `confirmerId` LongField, `confirmerName` LookupTriggerField, `statusName` TextField, `content` TextField, `detail` MyTextArea, `lookupEmpTransInfo` Emp00_Lookup_SelectSingle

#### 이벤트
[E0] 화면 열림 (생성자 L78-94) → settings(), getEditor()
[E1] personName[담당자].TriggerClick (L99) → 인라인 L99-113 (new TriggerClickHandler(){ @Override …)
[E2] confirmerName[승인자].TriggerClick (L115) → 인라인 L115-129 (new TriggerClickHandler(){ @Override …)
[E3] updateButton[저장].Select (L130) → update()
[E4] confirmButton[승인신청].Select [YES] (L136) → confirm()
[E5] msgBox.DialogHide [YES] (L141) → confirm()
[E6] cancleButton[신청취소].Select [YES] (L159) → confirm()
[E7] msgBox.DialogHide [YES] (L170) → confirm()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private getEditor() | L191-232 | 생성자 | 상태 처리 | 업무 |
| public update() | L234-295 | E3 | 서비스 est.Est03_PfHistory.modelUpdate | 업무 |
| private confirm() | L297-384 | E4,E5,E6,E7 | 서비스 est.Est03_PfHistory.modelUpdate | 업무 |
| public retrieve() | L387-397 | 공개 메서드 | 상태 처리 | 업무 |
| private setEnable() | L399-421 | confirm,retrieve | 상태 처리 | 업무 |
| public init() | L424-426 | 공개 메서드 | 상태 처리 | 업무 |
| public getGrid() | L433-436 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L96-189 | 생성자 | 조회창 Emp00_Lookup_SelectSingle 열기, 확인창 표시, 이벤트 연결, 초기값: personName=empTransInfoModel.getEmpPersonModel(("담당자"), personId=empTransInfoModel.getEmpPersonModel(, confirmerName=empTransInfoModel.getEmpPersonModel(("승인자"), confirmerId=empTransInfoModel.getEmpPersonModel( | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L428-430 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="register" onClick={confirm}>승인신청</Button>
3. <Button type="cancel" onClick={confirm}>신청취소</Button>

### Est04_Grid_PfFile (`client/vi/est/Est04_Grid_PfFile.java`, 359줄)

- 툴바 `buttonBar`: {insertButton} {deleteButton} {fileDownloadForm} {fileDeleteForm}
- 입력·하위 화면: `viewer` Sys10_Lookup_FileViewer
- 그리드 `grid` (buildGrid()):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - fileDesc 120 "증빙파일형식" Text 편집:TextField
  - fileName 150 "파일명" Text
  - actionCell 50 "등록" Cell 편집:fileUpButton
  - actionCell 50 "받기" Cell 편집:downloadCell
  - actionCell 50 "삭제" Cell 편집:fileDeleteButton
  - checkRoute 250 "증빙 확인 경로<br>(증빙첨부 불가시)" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L76-172) → 초기화
[E1] fileDeleteForm.SubmitComplete (L89) → retrieve()
[E2] fileUpdownForm.Change (L96) → 서비스 sys.Sys10_File.selectByParentId(parentId)
[E3] retrieveButton[조회].Select (L124) → retrieve()
[E4] insertButton[행 추가].Select (L130) → insertRow()
[E5] deleteButton[행 삭제].Select (L141) → deleteRow()
[E6] grid.CellClick [event.getCellIndex() == 2] (L152) → 인라인 L152-163 (new CellClickHandler() { @Override pu…)
[E7] msgBox.DialogHide [YES] (L212) → fileDelete()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L242-255 | E1,E3,fileDelete | 서비스 est.Est04_PfFile.selectByPfHistoryId(pfHistoryId) | 업무 |
| private retrieve() | L257-268 | E1,E3,fileDelete | 서비스 est.Est04_PfFile.selectByPfHistoryId(pfHistoryId) | 업무 |
| public updateChk() | L270-314 | 공개 메서드 | GridDeleteData est.Est04_PfFile.update, est.Est04_PfFile.delete | 업무 |
| public insertRow() | L316-322 | E4 | 상태 처리 | 업무 |
| public fileDelete() | L324-349 | E7 | 서비스 sys.Sys11_RelateFile.checkFileDelete(fileId, parentId) | 업무 |
| public deleteRow() | L351-357 | E5 | 상태 처리 | 업무 |
| public buildGrid() | L174-240 | 필드 초기화 | 확인창 표시, 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L231 newHeaderGroupMap02newHeaderGroupConfig14 100 "증빙파일" (est04_new_header_group_map02new_header_group_config14 컬럼 없음)
  gb.text('fileDesc', 120, '증빙파일형식', { editor: 'text' }),  // L232
  gb.text('fileNm', 150, '파일명'),  // L233 SQL 계산 컬럼(selectByPfHistoryId: sys10_file_nm)
  // ⚠ 대응 없음 (GridBuilder L234) addCell
  // ⚠ 대응 없음 (GridBuilder L235) addCell
  // ⚠ 대응 없음 (GridBuilder L236) addCell
  gb.text('checkRoute', 250, '증빙 확인 경로<br>(증빙첨부 불가시)', { editor: 'text' }),  // L237
];
```

#### 사용된 버튼들
1. <Button type="addRow" onClick={insertRow}>행 추가</Button>
2. <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>
3. <Button type="search" onClick={retrieve}>조회</Button>

### Est02_Lookup_PfContract (`client/vi/est/Est02_Lookup_PfContract.java`, 164줄)

- 툴바 `buttonBar`: 조회기준일: {startDate} 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `startDate` MyDateField, `searchText` TextField 빈칸="차주명/사업자명/수수료명"
- 그리드 `grid` (buildGrid(), 체크박스):
  - borrower 250 "차주명" Text
  - projectSiteName 300 "사업자명" Text
  - projectSiteAddr 300 "사업장 주소지" Text
  - feeName 250 "용역(수수료)명" Text
  - startDate 100 "수행시작일" Date
  - closeDate 100 "수행종료일" Date

#### 이벤트
[E0] 화면 열림 (생성자 L78-80) → settings()
[E1] searchText.KeyPress [Enter] (L87) → retrieve()
[E2] confirmButton[확인].Select (L95) → confirm()
[E3] closeButton[닫기].Select (L101) → hide()
[E4] grid.CellDoubleClick (L107) → confirm()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L49-76 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L128-141 | E1,open | 서비스 est.Est02_PfContract.selectByText(companyId, startDate, searchText) | 업무 |
| public confirm() | L143-155 | E2,E4 | 미선택 시 alert "선택된 체결용역이 없습니다" | 업무 |
| private settings() | L82-113 | 생성자 | 이벤트 연결, 초기값: startDate=LoginUser.getToday( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L115-126 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L157-159 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L161-163 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('borrower', 250, '차주명'),  // L118
  gb.text('projectSiteNm', 300, '사업자명'),  // L119
  gb.text('projectSiteAddr', 300, '사업장 주소지'),  // L120
  gb.text('feeNm', 250, '용역(수수료)명'),  // L121
  gb.date('startDate', 100, '수행시작일'),  // L122
  gb.date('closeDate', 100, '수행종료일'),  // L123
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={undefined}>조회</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

