# Flt02_Tab_EmpInfo

- 종류: 화면
- 메뉴: 준법감시 > 11. 임직원매매(준감인) > 임직원매매현황 (#1351)
- 파일: `client/vi/flt/Flt02_Tab_EmpInfo.java`
- 함께 쓰는 클래스 4개:
  - `Flt15_Lookup_Note` `client/vi/flt/Flt15_Lookup_Note.java`
  - `Flt10_Lookup_ViolateView` `client/vi/flt/Flt10_Lookup_ViolateView.java`
  - `Flt07_Lookup_FamilyConsent` `client/vi/flt/Flt07_Lookup_FamilyConsent.java`
  - `Flt03_Lookup_AccountView` `client/vi/flt/Flt03_Lookup_AccountView.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Sys10_Lookup_FileViewer`](../../sys/components/Sys10_Lookup_FileViewer.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `flt.Flt01_CompanyStd.selectByDate` | Flt02_Tab_EmpInfo:155, Flt02_Tab_EmpInfo:235 | [`Flt01_CompanyStd.java:36`](../../flt/services/Flt01_CompanyStd.md) | [`flt01_company_std.selectByDate`](../../flt/sql/flt01_company_std.md) |
| `flt.Flt02_Emp.selectByCompanyId` | Flt02_Tab_EmpInfo:224 | [`Flt02_Emp.java:34`](../../flt/services/Flt02_Emp.md) | [`flt02_emp.selectByCompanyId`](../../flt/sql/flt02_emp.md) |
| `flt.Flt03_Account.selectByDate` | Flt03_Lookup_AccountView:116 | [`Flt03_Account.java:50`](../../flt/services/Flt03_Account.md) | [`flt03_account.selectByDate`](../../flt/sql/flt03_account.md) |
| `flt.Flt10_Tr.selectViolate` | Flt10_Lookup_ViolateView:109 | [`Flt10_Tr.java:85`](../../flt/services/Flt10_Tr.md) | [`flt10_tr.selectViolate`](../../flt/sql/flt10_tr.md) |
| `flt.Flt15_TrStatus.selectByPersonId` | Flt15_Lookup_Note:70 | [`Flt15_TrStatus.java:23`](../../flt/services/Flt15_TrStatus.md) | [`flt15_tr_status.insert`](../../flt/sql/flt15_tr_status.md), [`flt15_tr_status.selectByPersonId`](../../flt/sql/flt15_tr_status.md) |
| `flt.Flt15_TrStatus.update` | Flt15_Lookup_Note:100 | [`Flt15_TrStatus.java:38`](../../flt/services/Flt15_TrStatus.md) | `UpdateDataModel(flt15_tr_status)` 동적 INSERT/UPDATE → [`flt15_tr_status.selectById`](../../flt/sql/flt15_tr_status.md) |
| `sys.Sys10_File.selectByFamilyConsentId` | Flt07_Lookup_FamilyConsent:112 | [`Sys10_File.java:252`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByFamilyConsentId`](../../sys/sql/sys10_file.md) |
| `sys.Sys99_Print.insertRdEmpInfo` | Flt02_Tab_EmpInfo:244 | [`Sys99_Print.java:4730`](../../sys/services/Sys99_Print.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`flt02_emp.selectByCompanyId2`](../../flt/sql/flt02_emp.md), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md), [`flt01_company_std`](../../../db/tables/flt.md), [`flt02_emp`](../../../db/tables/flt.md), [`flt03_account`](../../../db/tables/flt.md), [`flt04_oath`](../../../db/tables/flt.md), [`flt06_account_close`](../../../db/tables/flt.md), [`flt07_family_consent`](../../../db/tables/flt.md), [`flt10_tr`](../../../db/tables/flt.md), [`flt15_tr_status`](../../../db/tables/flt.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys01_company`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md), [`sys15_corp`](../../../db/tables/sys.md), [`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_create_seq`, `f_get_emptrans`, `f_get_floortrcheck`, `f_get_itemtype_nm`, `f_get_last_day`, `f_get_quarter_date`, `f_sysdate`, `f_today`, `getperson`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Flt02_Tab_EmpInfo (`client/vi/flt/Flt02_Tab_EmpInfo.java`, 333줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 기준일: {stdDate} 검색: {searchText} {retrieveButton} {downloadButton}
- 입력·하위 화면: `stdDate` MyDateField, `searchText` TextField 빈칸="본부(부서)/사원명", `lookup` Flt15_Lookup_Note
- 그리드 `grid` (buildGrid()):
  - orgName 200 "본부(부서)" Text
  - personName 80 "사원명" TextCenter
  - oathYnName 80 "서약서<br>서명유무" TextCenter
  - familyYnName 100 "가족동의서" TextCenterCursor
  - accountCntStr 80 "계좌건수" TextCenterCursor
  - checkCycleName 80 "보고주기" TextCenter
  - rcntReportDate 100 "최근보고일" Date
  - yearInvestLimit 120 "연간투자한도" Long
  - yearInvestAmt 120 "연간투자금액" Long
  - totalInvestAmt 120 "누적투자금액" Long
  - turnoverRate 120 "월매매회전율(%)" Double
  - dailyAvg 120 "월간<br>일평균잔고" Long
  - violateCntStr 80 "위반건수" TextCenterCursor
  - note 80 "준감인의견" TextCenter
  - actionCell 40 "" Cell 편집:editCell

#### 이벤트
[E0] 화면 열림 (생성자 L61-91) → settings(), retrieve()
[E1] searchText.KeyPress [Enter] (L104) → retrieve()
[E2] grid.CellClick [event.getCellIndex() == 4] (L115) → lookupFamily(), lookupAccount(), lookupViolate()
[E3] retrieveButton[조회].Select (L138) → retrieve()
[E4] downloadButton[엑셀다운로드].Select (L145) → createRdExcel()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setGridHidden() | L153-174 | settings | 서비스 flt.Flt01_CompanyStd.selectByDate(companyId, toDay) | 업무 |
| private lookupNote() | L206-215 | buildGrid | 조회창 Flt15_Lookup_Note 열기 | 업무 |
| public retrieve() | L217-230 | 생성자,E1,E3 | 서비스 flt.Flt02_Emp.selectByCompanyId(companyId, stdDate, searchText) | 업무 |
| private createRdExcel() | L232-303 | E4 | 서비스 flt.Flt01_CompanyStd.selectByDate, sys.Sys99_Print.insertRdEmpInfo(companyId, toDay, companyId, personId, windowClassName, stdDate, searchText) | 업무 |
| private lookupAccount() | L305-310 | E2 | 조회창 Flt03_Lookup_AccountView 열기 | 업무 |
| private lookupViolate() | L312-317 | E2 | 조회창 Flt10_Lookup_ViolateView 열기 | 업무 |
| private lookupFamily() | L319-324 | E2 | 조회창 Flt07_Lookup_FamilyConsent 열기 | 업무 |
| private settings() | L93-151 | 생성자 | 이벤트 연결, 초기값: stdDate=date | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L176-204 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L326-328 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L330-332 | 필드 초기화 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('orgNm', 200, '본부(부서)'),  // L187 SQL 계산 컬럼(selectByCompanyId: org02_kor_nm)
  gb.textCenter('personNm', 80, '사원명'),  // L188 SQL 계산 컬럼(selectByCompanyId: emp01_kor_nm)
  gb.textCenter('oathYnNm', 80, '서약서<br>서명유무'),  // L189 SQL 계산 컬럼(selectByCompanyId: oath_yn_nm)
  // ⚠ 대응 없음 (GridBuilder L190) addTextCenterCursor
  // ⚠ 대응 없음 (GridBuilder L191) addTextCenterCursor
  gb.textCenter('checkCycleNm', 80, '보고주기'),  // L192 SQL 계산 컬럼(selectByDate: f_cdnm('FloorTrCheckCycle', flt02_check…)
  gb.date('rcntReportDate', 100, '최근보고일'),  // L193 SQL 계산 컬럼(selectByCompanyId: rcnt_report_date)
  gb.long('yearInvestLimit', 120, '연간투자한도'),  // L194
  gb.long('yearInvestAmt', 120, '연간투자금액'),  // L195 SQL 계산 컬럼(selectByCompanyId: emp01_year_invest_limit)
  gb.long('totalInvestAmt', 120, '누적투자금액'),  // L196 SQL 계산 컬럼(selectByCompanyId: emp01_total_invest_amt)
  gb.double('turnoverRate', 120, '월매매회전율(%)'),  // L197 SQL 계산 컬럼(selectByCompanyId: emp01_turnover_rate)
  gb.long('dailyAvg', 120, '월간<br>일평균잔고'),  // L198 SQL 계산 컬럼(selectByCompanyId: f_get_floorTrCheck('4', emp01_company_i…)
  // ⚠ 대응 없음 (GridBuilder L199) addTextCenterCursor
  gb.textCenter('note', 80, '준감인의견'),  // L200 SQL 계산 컬럼(selectByCompanyId: CASE WHEN length(COALESCE(flt15_note,''…)
  // ⚠ 대응 없음 (GridBuilder L201) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="download" onClick={createRdExcel}>엑셀다운로드</Button>

### Flt15_Lookup_Note (`client/vi/flt/Flt15_Lookup_Note.java`, 126줄)

- 입력·하위 화면: `note` MyTextArea

#### 이벤트
[E0] 화면 열림 (생성자 L41-62) → settings(), show()
[E1] updateButton[저장].Select (L85) → update()
[E2] closeButton[닫기].Select (L91) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L64-82 | 공개 메서드 | 서비스 flt.Flt15_TrStatus.selectByPersonId(companyId, personId, stdDate) | 업무 |
| private update() | L99-121 | E1 | 서비스 flt.Flt15_TrStatus.update | 업무 |
| private settings() | L84-97 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlHeaderStyle() | L123-125 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Flt10_Lookup_ViolateView (`client/vi/flt/Flt10_Lookup_ViolateView.java`, 125줄)

- 툴바 `buttonBar`: 기준일: {baseDateField} {retrieveButton}
- 입력·하위 화면: `baseDateField` MyDateField
- 그리드 `grid` (buildGrid()):
  - personName 120 "사원명" TextCenter
  - checkName 200 "위반내역" Text
  - checkStd 100 "기준정보" Text
  - checkViolate 100 "위반정보" Text
  - trDate 100 "위반거래일" Date
  - trItemName 200 "위반종목" Text
  - rejectReason 200 "사전승인의견" TextArea
  - trNote 200 "매매사유" TextArea

#### 이벤트
[E0] 화면 열림 (생성자 L39-76) → show()
[E1] retrieveButton[조회].Select (L49) → retrieve()
[E2] cancelButton[닫기].Select (L55) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L78-82 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L101-115 | E1,open | 서비스 flt.Flt10_Tr.selectViolate(companyId, personId, stdDate) | 업무 |
| private buildGrid() | L84-99 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L117-119 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L121-123 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('personNm', 120, '사원명'),  // L88
  gb.text('checkNm', 200, '위반내역'),  // L89
  gb.text('checkStd', 100, '기준정보'),  // L90
  gb.text('checkViolate', 100, '위반정보'),  // L91
  gb.date('trDate', 100, '위반거래일'),  // L92
  gb.text('trItemNm', 200, '위반종목'),  // L93
  gb.textArea('rejectReason', 200, '사전승인의견'),  // L94
  gb.textArea('trNote', 200, '매매사유'),  // L95
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Flt07_Lookup_FamilyConsent (`client/vi/flt/Flt07_Lookup_FamilyConsent.java`, 125줄)

- 입력·하위 화면: `baseDateField` MyDateField, `lookupViewer` Sys10_Lookup_FileViewer
- 그리드 `grid` (buildGrid(), 체크박스):
  - fileName 400 "첨부파일" Text
  - actionCell 50 "보기" Cell 편집:viewCell
  - actionCell 50 "받기" Cell 편집:downloadCell

#### 이벤트
[E0] 화면 열림 (생성자 L42-68) → show()
[E1] cancelButton[닫기].Select (L52) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L70-73 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L107-118 | open | 서비스 sys.Sys10_File.selectByFamilyConsentId(personId) | 업무 |
| private buildGrid() | L75-105 | 필드 초기화 | 조회창 Sys10_Lookup_FileViewer 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L120-122 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('fileNm', 400, '첨부파일'),  // L99
  // ⚠ 대응 없음 (GridBuilder L100) addCell
  // ⚠ 대응 없음 (GridBuilder L101) addCell
];
```

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>

### Flt03_Lookup_AccountView (`client/vi/flt/Flt03_Lookup_AccountView.java`, 134줄)

- 툴바 `buttonBar`: 기준일: {baseDateField} {closeYnCheckBox} {retrieveButton}
- 입력·하위 화면: `baseDateField` MyDateField, `closeYnCheckBox` CheckBox
- 그리드 `grid` (buildGrid()):
  - corpName 150 "개설기관" Text
  - accountNoDec 150 "계좌번호" Text
  - accountName 80 "계좌명" TextCenter
  - familyRelateName 70 "관계" TextCenter
  - itemTypeName 130 "종목유형" Text
  - setupDate 90 "계좌개설일" Date
  - apprRegDate 90 "상신일" Date
  - apprStatusName 80 "상신상태" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L41-83) → show()
[E1] retrieveButton[조회].Select (L54) → retrieve()
[E2] cancelButton[닫기].Select (L60) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L85-89 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L107-122 | E1,open | 서비스 flt.Flt03_Account.selectByDate(companyId, personId, setupDate, closeAccountYn), 건수 표시 | 업무 |
| private buildGrid() | L91-105 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L124-126 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L127-129 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L130-132 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('corpNm', 150, '개설기관'),  // L95
  gb.text('accountNoDec', 150, '계좌번호'),  // L96
  gb.textCenter('accountNm', 80, '계좌명'),  // L97
  gb.textCenter('familyRelateNm', 70, '관계'),  // L98
  gb.text('itemTypeNm', 130, '종목유형'),  // L99
  gb.date('setupDate', 90, '계좌개설일'),  // L100
  gb.date('apprRegDate', 90, '상신일'),  // L101
  gb.textCenter('apprStatusNm', 80, '상신상태'),  // L102
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

