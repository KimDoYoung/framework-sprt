# Pay50_Tab_ExpenseConfirm

- 종류: 화면
- 메뉴: 신청 > 80. 사업비 신청 > 사업비 지출승인(부서장) (#1384)
- 파일: `client/vi/pay/Pay50_Tab_ExpenseConfirm.java`
- 함께 쓰는 클래스 2개:
  - `Pay50_Lookup_Content` `client/vi/pay/Pay50_Lookup_Content.java`
  - `Pay50_Lookup_ConfirmReason` `client/vi/pay/Pay50_Lookup_ConfirmReason.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Com01_Lookup_RelateAppr`](../../com/components/Com01_Lookup_RelateAppr.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `pay.Pay50_Expense.confirmSendMessage` | Pay50_Tab_ExpenseConfirm:387 | [`Pay50_Expense.java:701`](../../pay/services/Pay50_Expense.md) | [`emp01_person.selectById`](../../emp/sql/emp01_person.md), [`emp92_sms_notice.sendCheckMail`](../../emp/sql/emp92_sms_notice.md), [`emp92_sms_notice.sendCheckSms`](../../emp/sql/emp92_sms_notice.md), [`emp92_sms_notice.sendCheckTalk`](../../emp/sql/emp92_sms_notice.md), [`pay50_expense.getConfirmSendMessageList`](../../pay/sql/pay50_expense.md), [`pay50_expense.updateConfirmSmsYn`](../../pay/sql/pay50_expense.md), [`sys01_company.selectById`](../../sys/sql/sys01_company.md) |
| `pay.Pay50_Expense.selectByDateConfirm` | Pay50_Tab_ExpenseConfirm:207 | [`Pay50_Expense.java:52`](../../pay/services/Pay50_Expense.md) | [`pay50_expense.selectByDateConfirm`](../../pay/sql/pay50_expense.md) |
| `pay.Pay50_Expense.updateConfirmReason` | Pay50_Tab_ExpenseConfirm:347 | [`Pay50_Expense.java:487`](../../pay/services/Pay50_Expense.md) | [`pay50_expense.updateConfirmReason`](../../pay/sql/pay50_expense.md) |
| `pay.Pay50_Expense.updateContent` | Pay50_Lookup_Content:193 | [`Pay50_Expense.java:519`](../../pay/services/Pay50_Expense.md) | [`pay50_expense.updateContent`](../../pay/sql/pay50_expense.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast07_settle`](../../../db/tables/ast.md), [`com01_relate_appr`](../../../db/tables/com.md), [`emp01_person`](../../../db/tables/emp.md), [`emp92_sms_notice`](../../../db/tables/emp.md), [`pay50_expense`](../../../db/tables/pay.md), [`sys01_company`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md), [`sys15_corp`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_emp_kor_nm`, `f_get_account_nm`, `f_get_emptrans`, `f_sysdate`, `f_today`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Pay50_Tab_ExpenseConfirm (`client/vi/pay/Pay50_Tab_ExpenseConfirm.java`, 411줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 조회기간: {startDate} ~: {closeDate} {checkBox} {retrieveButton} {confirmButton} {rejectButton} {cancelButton} {rejectSMSButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `checkBox` CheckBox, `lookup` Pay50_Lookup_Content
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - occDate 90 "발생일자" Date
  - regEmpName 70 "요청자" TextCenter
  - desc 320 "지출내역" Text
  - contentStatusName 60 "내역상세" TextCenter
  - actionCell 40 "" Cell 편집:contentViewCell
  - corpName 150 "지출처" Text
  - settleAmt 100 "지출금액" Long
  - dueDate 90 "지급요청일" Date
  - payMethodName 80 "지급방법" TextCenter
  - payAccountInfo 220 "지급요청계좌" Text
  - fileCountStr 60 "증빙자료" TextCenter
  - actionCell 40 "" Cell 편집:viewCell
  - confirmStatusName 70 "승인상태" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L65-94) → settings(), retrieve()
[E1] retrieveButton[조회].Select (L107) → retrieve()
[E2] confirmButton[승인].Select (L113) → confirm()
       └ [E7] msgBox.DialogHide [YES] (L235) → confirmChk()
[E3] rejectButton[반려].Select (L119) → reject()
       └ [E8] msgBox.DialogHide [YES] (L273) → confirmChk()
[E4] cancelButton[취소].Select (L125) → cancel()
       └ [E9] msgBox.DialogHide [YES] (L309) → confirmChk()
[E5] rejectSMSButton[반려건 일괄 알림발송].Select (L131) → rejectSMS()
[E6] grid.CellClick (L138) → lookupOpenReason()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieve() | L198-213 | 생성자,E1,updateConfirm,rejectSMS | 서비스 pay.Pay50_Expense.selectByDateConfirm(companyId, confirmerId, startDate, closeDate, confirmStatusCheckYn) | 업무 |
| private confirm() | L215-251 | E2 | 미선택 시 alert "승인할 내용을 선택해주세요" → 확인창 E7 | 업무 |
| private reject() | L253-289 | E3 | 미선택 시 alert "반려할 내용을 선택해주세요" → 확인창 E8 | 업무 |
| private cancel() | L291-325 | E4 | 미선택 시 alert "취소할 내용을 선택해주세요" → 확인창 E9 | 업무 |
| private confirmChk() | L327-344 | E7,E8,E9 | 조회창 Pay50_Lookup_ConfirmReason 열기 | 업무 |
| private updateConfirm() | L346-371 | confirmChk,lookupOpenReason | 서비스 pay.Pay50_Expense.updateConfirmReason(confirmStatusCode, confirmReason, confirmDate, confirmDate) | 업무 |
| private lookupOpenReason() | L373-384 | E6 | 조회창 Pay50_Lookup_ConfirmReason 열기 | 업무 |
| private rejectSMS() | L386-401 | E5 | 서비스 pay.Pay50_Expense.confirmSendMessage(companyId, sendPersonId) | 업무 |
| public settings() | L96-150 | 생성자 | 이벤트 연결, 초기값: startDate=ClientDateUtil.toDate(fromDateStr, closeDate=LoginUser.getToday(, checkBox=true("미승인내역만 조회") | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L152-196 | 필드 초기화 | 조회창 Pay50_Lookup_Content 열기, 조회창 Com01_Lookup_RelateAppr 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L403-405 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L407-409 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('occDate', 90, '발생일자'),  // L178
  gb.textCenter('regEmpNm', 70, '요청자'),  // L179
  gb.text('desc', 320, '지출내역'),  // L180
  gb.textCenter('contentStatusNm', 60, '내역상세'),  // L181
  // ⚠ 대응 없음 (GridBuilder L182) addCell
  gb.text('corpNm', 150, '지출처'),  // L183
  gb.long('settleAmt', 100, '지출금액'),  // L184
  gb.date('dueDate', 90, '지급요청일'),  // L185
  gb.textCenter('payMethodNm', 80, '지급방법'),  // L186
  gb.text('payAccountInfo', 220, '지급요청계좌'),  // L187
  gb.textCenter('fileCountStr', 60, '증빙자료'),  // L188
  // ⚠ 대응 없음 (GridBuilder L189) addCell
  gb.textCenter('confirmStatusNm', 70, '승인상태'),  // L190
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirm}>승인</Button>
3. <Button type="cancel" onClick={reject}>반려</Button>
4. <Button type="cancel" onClick={cancel}>취소</Button>
5. <Button type="send" onClick={rejectSMS}>반려건 일괄 알림발송</Button>

### Pay50_Lookup_Content (`client/vi/pay/Pay50_Lookup_Content.java`, 230줄)


#### 이벤트
[E0] 화면 열림 (생성자 L54-62) → 초기화
[E1] updateButton[저장].Select (L172) → update()
[E2] confirmButton[확인].Select (L178) → confirm()
[E3] closeButton[닫기].Select (L184) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L64-96 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L98-132 | 공개 메서드 | 상태 처리 | 업무 |
| public edit() | L134-169 | 공개 메서드 | 상태 처리 | 업무 |
| private update() | L192-205 | E1 | 서비스 pay.Pay50_Expense.updateContent(content, expenseId) | 업무 |
| private confirm() | L207-210 | E2 | 상태 처리 | 업무 |
| private settings() | L171-190 | open,edit | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlHeaderStyle() | L212-214 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="save" onClick={update}>저장</Button>

### Pay50_Lookup_ConfirmReason (`client/vi/pay/Pay50_Lookup_ConfirmReason.java`, 107줄)

- 입력·하위 화면: `note` MyTextArea

#### 이벤트
[E0] 화면 열림 (생성자 L30-51) → settings(), show()
[E1] updateButton[저장].Select (L74) → update()
[E2] closeButton[닫기].Select (L80) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L53-56 | 공개 메서드 | 상태 처리 | 업무 |
| public edit() | L58-62 | 공개 메서드 | 상태 처리 | 업무 |
| public view() | L64-71 | 공개 메서드 | 상태 처리 | 업무 |
| private update() | L93-102 | E1 | 상태 처리 | 업무 |
| private settings() | L73-91 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlHeaderStyle() | L104-106 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

