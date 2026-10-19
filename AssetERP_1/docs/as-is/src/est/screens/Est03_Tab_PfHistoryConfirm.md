# Est03_Tab_PfHistoryConfirm

- 종류: 화면
- 메뉴: 펀드관리 > 05. 부동산PF 용역수행 > 용역수행내역 승인 (#1382)
- 파일: `client/vi/est/Est03_Tab_PfHistoryConfirm.java`
- 함께 쓰는 클래스 3개:
  - `Est03_TabPage_PfHistoryConfirm` `client/vi/est/Est03_TabPage_PfHistoryConfirm.java`
  - `Est04_Grid_PfFileConfirm` `client/vi/est/Est04_Grid_PfFileConfirm.java`
  - `Est02_Lookup_PfContract` `client/vi/est/Est02_Lookup_PfContract.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Sys10_Lookup_FileViewer`](../../sys/components/Sys10_Lookup_FileViewer.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `est.Est02_PfContract.selectById` | Est03_Tab_PfHistoryConfirm:206 | [`Est02_PfContract.java:21`](../../est/services/Est02_PfContract.md) | [`est02_pf_contract.selectById`](../../est/sql/est02_pf_contract.md) |
| `est.Est02_PfContract.selectByText` | Est02_Lookup_PfContract:135 | [`Est02_PfContract.java:27`](../../est/services/Est02_PfContract.md) | [`est02_pf_contract.selectByText`](../../est/sql/est02_pf_contract.md) |
| `est.Est03_PfHistory.selectByConfirmer01` | Est03_Tab_PfHistoryConfirm:283 | [`Est03_PfHistory.java:51`](../../est/services/Est03_PfHistory.md) | [`est03_pf_history.selectByConfirmer01`](../../est/sql/est03_pf_history.md) |
| `est.Est03_PfHistory.selectByConfirmer02` | Est03_Tab_PfHistoryConfirm:301 | [`Est03_PfHistory.java:65`](../../est/services/Est03_PfHistory.md) | [`est03_pf_history.selectByConfirmer02`](../../est/sql/est03_pf_history.md) |
| `est.Est03_PfHistory.updateConfirm` | Est03_Tab_PfHistoryConfirm:236 | [`Est03_PfHistory.java:99`](../../est/services/Est03_PfHistory.md) | [`est03_pf_history.updateConfirm`](../../est/sql/est03_pf_history.md) |
| `est.Est04_PfFile.selectByPfHistoryId` | Est04_Grid_PfFileConfirm:139 | [`Est04_PfFile.java:22`](../../est/services/Est04_PfFile.md) | [`est04_pf_file.selectByPfHistoryId`](../../est/sql/est04_pf_file.md) |
| `sys.Sys10_File.selectByParentId` | Est04_Grid_PfFileConfirm:72 | [`Sys10_File.java:51`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`emp01_person`](../../../db/tables/emp.md), [`est01_pf_fee_type`](../../../db/tables/est.md), [`est02_pf_contract`](../../../db/tables/est.md), [`est03_pf_history`](../../../db/tables/est.md), [`est04_pf_file`](../../../db/tables/est.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_emp_kor_nm`, `f_get_emptrans`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Est03_Tab_PfHistoryConfirm (`client/vi/est/Est03_Tab_PfHistoryConfirm.java`, 321줄)

- 레이아웃: center=vlc, south=tabPage
- 툴바 `buttonBar01`: {startDate} 검색: {searchText} {confirmCheckBox}
- 툴바 `buttonBar02`: {contractName01} {contractName02}
- 툴바 `buttonBar01_2`: {retrieveButton} {confirmButton} {cancleButton}
- 입력·하위 화면: `contractName01` LookupTriggerField 빈칸="체결용역을 선택해주세요", `contractName02` TextField, `tabPage` Est03_TabPage_PfHistoryConfirm, `radioSearchType1` Radio, `radioSearchType2` Radio, `startDate` MyDateField, `searchText` TextField 빈칸="차주명/사업자명/수수료명", `confirmCheckBox` CheckBox, `lookup` Est02_Lookup_PfContract
- 그리드 `grid` (buildGrid()):
  - no 100 "수행번호" LongCenter
  - startDate 100 "수행시작일" Date
  - closeDate 100 "수행종료일" Date
  - content 350 "수행내역" Text
  - detail 350 "상세내역" Text
  - personName 100 "담당자" Text
  - confirmerName 100 "담당자" Text
  - statusName 100 "승인상태" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L77-106) → settings()
[E1] toggleSearchType.ValueChange (L144) → 인라인 L144-159 (new ValueChangeHandler<HasValue<Boole…)
[E2] contractName01.TriggerClick (L166) → retrieve()
[E3] retrieveButton[조회].Select (L189) → retrieve()
[E4] confirmButton[승인].Select (L195) → confirm()
[E5] cancleButton[취소].Select (L201) → confirm()
[E6] grid.RowClick (L225) → retrieveTabpage()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private confirm() | L233-247 | E4,E5 | 서비스 est.Est03_PfHistory.updateConfirm(pfHistoryId, confirm) | 업무 |
| private retrieveTabpage() | L249-257 | E6 | 상태 처리 | 업무 |
| public retrieve() | L273-308 | E2,E3,confirm | 서비스 est.Est03_PfHistory.selectByConfirmer01, est.Est03_PfHistory.selectByConfirmer02(companyId, personId, startDate, searchText, confirm, companyId, personId, pfContractId) | 업무 |
| private settings() | L108-231 | 생성자 | 조회창 Est02_Lookup_PfContract 열기, 미선택 시 alert "결과보고서가 존재하여 승인취소가 불가능합니다", 서비스 est.Est02_PfContract.selectById(pfContractId), 이벤트 연결, 초기값: startDate=LoginUser.getToday(, confirmCheckBox=false("미승인만 보기"), radioSearchType1=true("일자기준 :"), radioSearchType2=false("체결용역 :") | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L259-271 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlCheckBoxLabelStyle() | L310-312 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlRadioLabelStyle12() | L314-316 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L318-320 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.longCenter('no', 100, '수행번호'),  // L261
  gb.date('startDate', 100, '수행시작일'),  // L262
  gb.date('closeDate', 100, '수행종료일'),  // L263
  gb.text('content', 350, '수행내역'),  // L264
  gb.text('detail', 350, '상세내역'),  // L265
  gb.text('personNm', 100, '담당자'),  // L266
  gb.text('confirmerNm', 100, '담당자'),  // L267
  gb.textCenter('statusNm', 100, '승인상태'),  // L268
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirm}>승인</Button>
3. <Button type="cancel" onClick={confirm}>취소</Button>

### Est03_TabPage_PfHistoryConfirm (`client/vi/est/Est03_TabPage_PfHistoryConfirm.java`, 133줄)

- 입력·하위 화면: `no` LongField, `startDate` MyDateField, `closeDate` MyDateField, `personName` TextField, `confirmerName` TextField, `statusName` TextField, `content` TextField, `detail` MyTextArea

#### 이벤트
[E0] 화면 열림 (생성자 L48-56) → settings(), getEditor()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private getEditor() | L69-110 | 생성자 | 상태 처리 | 업무 |
| public retrieve() | L113-117 | 공개 메서드 | 상태 처리 | 업무 |
| public init() | L120-122 | 공개 메서드 | 상태 처리 | 업무 |
| public getGrid() | L129-132 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L58-67 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L124-126 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
버튼 사용하지 않음

### Est04_Grid_PfFileConfirm (`client/vi/est/Est04_Grid_PfFileConfirm.java`, 159줄)

- 입력·하위 화면: `viewer` Sys10_Lookup_FileViewer
- 그리드 `grid` (buildGrid()):
  - fileDesc 120 "증빙파일형식" Text
  - fileName 250 "증빙파일(파일명)" Text
  - actionCell 50 "받기" Cell 편집:downloadCell
  - checkRoute 250 "증빙 확인 경로<br>(증빙첨부 불가시)" Text

#### 이벤트
[E0] 화면 열림 (생성자 L47-110) → 초기화
[E1] fileDeleteForm.SubmitComplete (L52) → retrieve()
[E2] fileUpdownForm.Change (L59) → 서비스 sys.Sys10_File.selectByParentId(parentId)
[E3] grid.CellClick [event.getCellIndex() == 2] (L87) → 인라인 L87-98 (new CellClickHandler() { @Override pu…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L132-145 | E1 | 서비스 est.Est04_PfFile.selectByPfHistoryId(pfHistoryId) | 업무 |
| private retrieve() | L147-158 | E1 | 서비스 est.Est04_PfFile.selectByPfHistoryId(pfHistoryId) | 업무 |
| public buildGrid() | L112-130 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('fileDesc', 120, '증빙파일형식'),  // L124
  gb.text('fileNm', 250, '증빙파일(파일명)'),  // L125 SQL 계산 컬럼(selectByPfHistoryId: sys10_file_nm)
  // ⚠ 대응 없음 (GridBuilder L126) addCell
  gb.text('checkRoute', 250, '증빙 확인 경로<br>(증빙첨부 불가시)'),  // L127
];
```

#### 사용된 버튼들
버튼 사용하지 않음

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

