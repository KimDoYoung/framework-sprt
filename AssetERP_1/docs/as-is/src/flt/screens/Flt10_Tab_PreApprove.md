# Flt10_Tab_PreApprove

- 종류: 화면
- 메뉴: 준법감시 > 11. 임직원매매(준감인) > 사전승인 (#1128)
- 파일: `client/vi/flt/Flt10_Tab_PreApprove.java`
- 함께 쓰는 클래스 1개:
  - `Flt10_Lookup_RejectReasonWrite` `client/vi/flt/Flt10_Lookup_RejectReasonWrite.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Emp00_Lookup_SelectSingle`](../../emp/components/Emp00_Lookup_SelectSingle.md), [`Emp93_Lookup_SmsNoticeTarget`](../../emp/components/Emp93_Lookup_SmsNoticeTarget.md), [`Fnd10_Lookup_RelateFund`](../../fnd/components/Fnd10_Lookup_RelateFund.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `flt.Flt01_CompanyStd.selectByDate` | Flt10_Tab_PreApprove:632 | [`Flt01_CompanyStd.java:36`](../../flt/services/Flt01_CompanyStd.md) | [`flt01_company_std.selectByDate`](../../flt/sql/flt01_company_std.md) |
| `flt.Flt10_Tr.selectByCompanyId` | Flt10_Tab_PreApprove:427 | [`Flt10_Tr.java:39`](../../flt/services/Flt10_Tr.md) | [`flt10_tr.selectByCompanyId`](../../flt/sql/flt10_tr.md) |
| `flt.Flt10_Tr.sendMessage` | Flt10_Tab_PreApprove:305 | [`Flt10_Tr.java:327`](../../flt/services/Flt10_Tr.md) | [`emp01_person.selectById`](../../emp/sql/emp01_person.md), [`emp92_sms_notice.sendCheckMail`](../../emp/sql/emp92_sms_notice.md), [`emp92_sms_notice.sendCheckSms`](../../emp/sql/emp92_sms_notice.md), [`emp92_sms_notice.sendCheckTalk`](../../emp/sql/emp92_sms_notice.md), [`flt10_tr.getSendMessageList`](../../flt/sql/flt10_tr.md), [`flt10_tr.updateConfirmSmsYn`](../../flt/sql/flt10_tr.md), [`sys01_company.selectById`](../../sys/sql/sys01_company.md) |
| `flt.Flt10_Tr.update` | Flt10_Lookup_RejectReasonWrite:117 | [`Flt10_Tr.java:670`](../../flt/services/Flt10_Tr.md) | [`flt13_book_init.getInitDate`](../../flt/sql/flt13_book_init.md), `UpdateDataModel(flt10_tr)` 동적 INSERT/UPDATE → [`flt10_tr.selectById`](../../flt/sql/flt10_tr.md) |
| `flt.Flt10_Tr.updateStatusCode` | Flt10_Tab_PreApprove:579 | [`Flt10_Tr.java:521`](../../flt/services/Flt10_Tr.md) | [`flt01_company_std.getExpectTrDate2`](../../flt/sql/flt01_company_std.md), [`flt10_tr.updateStatusCode`](../../flt/sql/flt10_tr.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp92_sms_notice`](../../../db/tables/emp.md), [`flt01_company_std`](../../../db/tables/flt.md), [`flt02_emp`](../../../db/tables/flt.md), [`flt03_account`](../../../db/tables/flt.md), [`flt05_item_type`](../../../db/tables/flt.md), [`flt08_buy_lockup`](../../../db/tables/flt.md), [`flt10_tr`](../../../db/tables/flt.md), [`flt11_book`](../../../db/tables/flt.md), [`flt13_book_init`](../../../db/tables/flt.md), [`sys01_company`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_emp_kor_nm`, `f_get_biz_date`, `f_get_biz_date2`, `f_get_biz_days`, `f_get_floortrcheck`, `f_get_floortrfundholdcheck`, `f_get_floortrrcntbuydate`, `f_sysdate`, `f_today`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Flt10_Tab_PreApprove (`client/vi/flt/Flt10_Tab_PreApprove.java`, 663줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 조회기간: {startDate} ~: {closeDate} 승인구분: {expectComboBox} 신고자: {empKorName} {retrieveButton} {confirmButton} {rejectButton} {cancelButton} {fundStockButton} {sendMessageButton} {noticeButton}
- 툴바 `buttonBar2`: 검색: {searchText} {confirmBox}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `expectComboBox` StringComboBox, `empKorName` LookupTriggerField 빈칸="전체", `searchText` TextField 빈칸="신고자/종목유형/종목명", `confirmYnBox` CheckBox, `empSearch` Emp00_Lookup_SelectSingle, `lookup` Fnd10_Lookup_RelateFund
- 그리드 `buyGrid` (buildBuyGrid(), 체크박스(다중)):
  - personName 100 "신고자" TextCenter
  - regDate 100 "매수신고일" Date
  - expectTrDate 100 "매수유효일" Date
  - itemTypeName 150 "종목유형" TextCenter
  - itemName 200 "종목명" Text
  - expectTrQty 80 "매수수량" Double
  - expectTrAmt 120 "매수금액" Long
  - yearInvestLimitEmp 150 "연간투자금액(개인한도)" Long
  - yearInvestLimitStr 120 "연간투자금액" TextLongHtml 편집:"#404040"
  - totalInvestAmtStr 120 "총누적투자금액" TextLongHtml 편집:"#404040"
  - turnoverRateStr 120 "월매매회전율(%)" TextLongHtml 편집:"#404040"
  - checkBuyLockup 80 "매수제한" TextCenter
  - checkFundHold 80 "펀드<br>보유종목" TextCenter
  - statusName 100 "승인여부" TextHtmlCenter
  - confirmSmsYn 80 "알림발송" BooleanYn
- 그리드 `sellGrid` (buildSellGrid(), 체크박스(다중)):
  - personName 100 "신고자" TextCenter
  - regDate 100 "매도신고일" Date
  - expectTrDate 100 "매도유효일" Date
  - itemTypeName 150 "종목유형" TextCenter
  - itemName 200 "종목명" Text
  - bookDays 100 "보유기간" TextHtmlCenter
  - checkFundHold 80 "펀드<br>보유종목" TextCenter
  - expectTrQty 80 "매도수량" Double
  - expectTrAmt 120 "매도금액" Long
  - statusName 100 "승인여부" TextHtmlCenter
  - confirmSmsYn 80 "알림발송" BooleanYn

#### 이벤트
[E0] 화면 열림 (생성자 L93-155) → settings()
[E1] confirmYnBox.ValueChange (L166) → 인라인 L166-181 (new ValueChangeHandler<Boolean>() { @…)
[E2] empKorName.TriggerClick (L194) → 인라인 L194-207 (new TriggerClickHandler(){ @Override …)
[E3] empKorName.Change (L208) → 인라인 L208-215 (new ChangeHandler() { @Override publi…)
[E4] searchText.KeyPress [Enter] (L219) → retrieve()
[E5] buyGrid.CellClick (L228) → lookupOpenReason(), lookupEditReject()
[E6] sellGrid.CellClick (L243) → lookupOpenReason(), lookupEditReject()
[E7] retrieveButton[조회].Select (L258) → retrieve()
[E8] confirmButton[승인].Select (L264) → confirmChk()
       └ [E14] msgBox.DialogHide [YES] (L456) → updateReason()
[E9] rejectButton[반려].Select (L270) → rejectChk()
       └ [E16] msgBox.DialogHide [YES] (L520) → updateReason()
[E10] cancelButton[취소].Select (L276) → cancelChk()
       └ [E15] msgBox.DialogHide [YES] (L488) → updateStatusCode()
[E11] fundStockButton[펀드보유종목 확인].Select (L282) → 인라인 L282-288 (new SelectHandler() { @Override publi…)
[E12] sendMessageButton[일괄 알림발송].Select (L289) → sendMessage()
[E13] noticeButton[알림설정].Select (L295) → 인라인 L295-301 (new SelectHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private sendMessage() | L304-319 | E12 | 서비스 flt.Flt10_Tr.sendMessage(companyId, sendPersonId) | 업무 |
| public buildBuyGrid() | L321-357 | 필드 초기화 | 상태 처리 | 업무 |
| public buildSellGrid() | L359-394 | 필드 초기화 | 상태 처리 | 업무 |
| public retrieve() | L396-451 | E4,E7,sendMessage,updateStatusCode | 서비스 flt.Flt10_Tr.selectByCompanyId, flt.Flt10_Tr.selectByCompanyId(companyId, personIdStr, apprYn, trType, startDate, closeDate, searchText, noLimitYn, companyId, personIdStr, apprYn, trType, startDate, closeDate, searchText, noLimitYn) | 업무 |
| private confirmChk() | L453-483 | E8 | ConfirmBox → E14 | 업무 |
| private cancelChk() | L485-515 | E10 | 미선택 시 alert "승인(반려)전 내역이 존재합니다" → 확인창 E15 | 업무 |
| private rejectChk() | L517-547 | E9 | ConfirmBox → E16 | 업무 |
| private updateReason() | L549-566 | E14,E16 | 조회창 Flt10_Lookup_RejectReasonWrite 열기 | 업무 |
| public updateStatusCode() | L568-593 | E15,updateReason | 서비스 flt.Flt10_Tr.updateStatusCode(statusCode, rejectReason, personId, companyId) | 업무 |
| private lookupOpenReason() | L595-598 | E5,E6 | 상태 처리 | 업무 |
| private lookupEditReject() | L600-615 | E5,E6 | 조회창 Flt10_Lookup_RejectReasonWrite 열기 | 업무 |
| private setInitData() | L617-651 | settings | 서비스 flt.Flt01_CompanyStd.selectByDate(companyId, toDay) | 업무 |
| private settings() | L157-302 | 생성자 | 조회창 Emp00_Lookup_SelectSingle 열기, 조회창 Fnd10_Lookup_RelateFund 열기, 조회창 Emp93_Lookup_SmsNoticeTarget 열기, 이벤트 연결, 초기값: confirmYnBox=false, empKorName=codeModel.getKorName( | UI구성 (이벤트 절로 대체) |
| private setHtmlBarStyle() | L653-655 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlSpace() | L656-658 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L659-661 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildBuyGrid = () => [
  gb.textCenter('personNm', 100, '신고자'),  // L334
  gb.date('regDate', 100, '매수신고일'),  // L335
  gb.date('expectTrDate', 100, '매수유효일'),  // L336
  gb.textCenter('itemTypeNm', 150, '종목유형'),  // L337
  gb.text('itemNm', 200, '종목명'),  // L338
  gb.double('expectTrQty', 80, '매수수량'),  // L339
  gb.long('expectTrAmt', 120, '매수금액'),  // L340
  gb.long('yearInvestLimitEmp', 150, '연간투자금액(개인한도)'),  // L341
  // ⚠ 대응 없음 (GridBuilder L342) addTextLongHtml
  // ⚠ 대응 없음 (GridBuilder L343) addTextLongHtml
  // ⚠ 대응 없음 (GridBuilder L344) addTextLongHtml
  gb.textCenter('checkBuyLockup', 80, '매수제한'),  // L345
  gb.textCenter('checkFundHold', 80, '펀드<br>보유종목'),  // L346
  // ⚠ 대응 없음 (GridBuilder L348) addTextHtmlCenter
  gb.booleanYn('confirmSmsYn', 80, '알림발송'),  // L350
];

const buildSellGrid = () => [
  gb.textCenter('personNm', 100, '신고자'),  // L372
  gb.date('regDate', 100, '매도신고일'),  // L373
  gb.date('expectTrDate', 100, '매도유효일'),  // L374
  gb.textCenter('itemTypeNm', 150, '종목유형'),  // L375
  gb.text('itemNm', 200, '종목명'),  // L376
  // ⚠ 대응 없음 (GridBuilder L378) addTextHtmlCenter
  gb.textCenter('checkFundHold', 80, '펀드<br>보유종목'),  // L379
  gb.double('expectTrQty', 80, '매도수량'),  // L380
  gb.long('expectTrAmt', 120, '매도금액'),  // L381
  // ⚠ 대응 없음 (GridBuilder L384) addTextHtmlCenter
  gb.booleanYn('confirmSmsYn', 80, '알림발송'),  // L386
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirmChk}>승인</Button>
3. <Button type="cancel" onClick={rejectChk}>반려</Button>
4. <Button type="cancel" onClick={cancelChk}>취소</Button>
5. <Button type="view" onClick={() => /* 인라인 L282-288 (new SelectHandler() { @Override publi…) */}>펀드보유종목 확인</Button>
6. <Button type="send" onClick={sendMessage}>일괄 알림발송</Button>
7. <Button type="save" onClick={() => /* 인라인 L295-301 (new SelectHandler() { @Override publi…) */}>알림설정</Button>

### Flt10_Lookup_RejectReasonWrite (`client/vi/flt/Flt10_Lookup_RejectReasonWrite.java`, 136줄)

- 입력·하위 화면: `note` MyTextArea

#### 이벤트
[E0] 화면 열림 (생성자 L39-60) → settings(), show()
[E1] updateButton[저장].Select (L83) → preUpdate()
[E2] closeButton[취소].Select (L89) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L62-72 | 공개 메서드 | 상태 처리 | 업무 |
| public edit() | L74-80 | 공개 메서드 | 상태 처리 | 업무 |
| private preUpdate() | L98-110 | E1 | 상태 처리 | 업무 |
| private update() | L112-131 | preUpdate | 서비스 flt.Flt10_Tr.update | 업무 |
| private settings() | L82-96 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlHeaderStyle() | L133-135 | 생성자,open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={preUpdate}>저장</Button>
2. <Button type="cancel" onClick={hide}>취소</Button>

