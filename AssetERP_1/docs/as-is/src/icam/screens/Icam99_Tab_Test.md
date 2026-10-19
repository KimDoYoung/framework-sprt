# Icam99_Tab_Test

- 종류: 화면
- 메뉴: I/F > 10. ICAM > 작업용 (#1097)
- 파일: `client/vi/icam/Icam99_Tab_Test.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `biz.Biz20_FeeCharge.insertFeeCharge` | Icam99_Tab_Test:483 | **(없음)** | - |
| `icam.Icam02_Data.selectByCompanyId` | Icam99_Tab_Test:544 | [`Icam02_Data.java:18`](../../icam/services/Icam02_Data.md) | [`icam02_data.selectByCompanyId`](../../icam/sql/icam02_data.md) |
| `icam.Icam99_Test.test` | Icam99_Tab_Test:521 | [`Icam99_Test.java:12`](../../icam/services/Icam99_Test.md) | - |
| `sys.Sys99_Print.insertComplianceState` | Icam99_Tab_Test:501 | [`Sys99_Print.java:324`](../../sys/services/Sys99_Print.md) | [`dbConfig.getBatchSeq`](../../utils/sql/dbConfig.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`emp03_trans.getRetireDate`](../../emp/sql/emp03_trans.md), [`emp03_trans.selectInOffice`](../../emp/sql/emp03_trans.md), [`ics30_compliance.selectComplianceResultByPersonId`](../../ics/sql/ics30_compliance.md), [`ics31_compliance_write.checkWriteByPersonId`](../../ics/sql/ics31_compliance_write.md), [`ics31_compliance_write.selectNonComplianceReason`](../../ics/sql/ics31_compliance_write.md), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |

## 테이블

[`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp33_except_biz`](../../../db/tables/emp.md), [`icam01_data_info`](../../../db/tables/icam.md), [`icam02_data`](../../../db/tables/icam.md), [`ics30_compliance`](../../../db/tables/ics.md), [`ics31_compliance_write`](../../../db/tables/ics.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys01_company`](../../../db/tables/sys.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_code_seq`, `f_get_compliance_result`, `f_get_emptrans`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Icam99_Tab_Test (`client/vi/icam/Icam99_Tab_Test.java`, 571줄)

- 레이아웃: center=vlc01, south=BottomBar
- 툴바 `buttonBar`: {stdDate} {retrieveButton} {batchButton4} {batchButton5} {batchButton7} {batchButton11} {batchButton14} {batchButton13} {batchButton12} {batchForm}
- 툴바 `buttonBar2`: {startDate} {closeDate} {batchButton8} {batchButton9} {batchButton15} {batchButton16} {batchButton17} {batchButton99}
- 툴바 `buttonBar3`: {textField} {batchButton18} {batchButton19}
- 툴바 `BottomBar`: {button1} {button2} {button3} {button4} {button6} {button7} {button8} {button9} {button10} {button11} {button12} {button13} {button14} {checkBox1} {colorButton1} {button5}
- 입력·하위 화면: `stdDate` MyDateField, `startDate` MyDateField, `closeDate` MyDateField, `textField` TextField, `checkBox1` CheckBox
- 그리드 `grid` (buildGrid(), 체크박스):
  - icamCompanyCode 70 "회사코드" Text
  - icamDate 100 "생성일" Date
  - fundCode 100 "펀드코드" Text
  - fundName 300 "펀드명" Text
  - assetCode 70 "자산구분" Text
  - assetName 150 "자산명" Text
  - itemCode 100 "종목코드" Text
  - itemName 250 "종목명" Text
  - seq 70 "순번" Long
  - infoCode 70 "정보코드" Text
  - infoName 200 "정보명" Text
  - trCode 70 "거래코드" Text
  - trName 200 "거래명" Text
  - tgtDate 100 "예정일자" Date
  - tgtAmt 120 "예정금액" Double
  - tgtStdDate 100 "자료기준일" Date
  - note 500 "비고" Text
  - createDateString 150 "작업일시" Text
  - creater 100 "작업자" Text
  - icsClassTreeId 80 "내부통제ID" Long
  - icsDeadlineId 80 "내부통제-기한ID" Long
  - confirmYn 80 "확인여부" Text
  - confirmPersonId 80 "확인자ID" Long

#### 이벤트
[E0] 화면 열림 (생성자 L96-309) → 초기화
[E1] retrieveButton[조회].Select (L111) → retrieve()
[E2] batchButton1[ICAM 정보코드 가져오기].Select (L117) → batch()
[E3] batchButton2[ICAM 연계정보 가져오기].Select (L123) → batch()
[E4] batchButton3[스케줄 당일미처리생성].Select (L129) → batch()
[E5] batchButton4[ICAM 종목정보 가져오기].Select (L135) → batch()
[E6] batchButton5[ICAM 원장 가져오기(fnd10)].Select (L141) → batch()
[E7] batchButton6[청구보수 생성 TEST].Select (L147) → serviceCall()
[E8] batchButton7[ICAM 시세가져오기].Select (L153) → batch()
[E9] batchButton8[ICAM 펀드원장 가져오기].Select (L159) → batch()
[E10] batchButton9[ICAM 공모주청약정보 가져오기].Select (L165) → batch()
[E11] batchButton10[임직원 내부통제 준수 현황표 생성].Select (L171) → serviceCall()
[E12] batchButton11[공모주38].Select (L177) → batch()
[E13] batchButton12[알람실행].Select (L183) → batch()
[E14] batchButton13[공모주 미일치생성].Select (L189) → batch()
[E15] batchButton14[IPOStock].Select (L195) → batch()
[E16] batchButton15[종목명 변경 반영].Select (L201) → batch()
[E17] batchButton16[당일상장주식Get].Select (L207) → batch()
[E18] batchButton17[일임계좌Get].Select (L213) → batch()
[E19] batchButton18[소실파일].Select (L219) → batch()
[E20] batchButton19[타사무관리펀드 보유종목Get(ifi34=>flt09)].Select (L225) → batch()
[E21] batchButton99[test].Select (L231) → batch()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public batch() | L343-479 | E2,E3,E4,E5,E6,E8,E9,E10,E12,E13,E14,E15,E16,E17,E18,E19,E20,E21 | 상태 처리 | 업무 |
| private serviceCall() | L481-535 | E7,E11 | 서비스 biz.Biz20_FeeCharge.insertFeeCharge, sys.Sys99_Print.insertComplianceState, icam.Icam99_Test.test(companyId, stdDate, companyId, personId, stdDate, windowClassName) | 업무 |
| public retrieve() | L538-553 | E1 | 서비스 icam.Icam02_Data.selectByCompanyId(companyId) | 업무 |
| public update() | L556-557 | 공개 메서드 | 상태 처리 | 업무 |
| public insertRow() | L560-561 | 공개 메서드 | 상태 처리 | 업무 |
| public deleteRow() | L564-565 | 공개 메서드 | 상태 처리 | 업무 |
| public buildGrid() | L311-341 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlCheckBoxLabelStyle() | L567-569 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('icamCompanyCd', 70, '회사코드'),  // L316
  gb.date('icamDate', 100, '생성일'),  // L317
  gb.text('fundCd', 100, '펀드코드'),  // L318
  gb.text('fundNm', 300, '펀드명'),  // L319
  gb.text('assetCd', 70, '자산구분'),  // L320
  gb.text('assetNm', 150, '자산명'),  // L321
  gb.text('itemCd', 100, '종목코드'),  // L322
  gb.text('itemNm', 250, '종목명'),  // L323
  gb.long('seq', 70, '순번'),  // L324
  gb.text('infoCd', 70, '정보코드'),  // L325
  gb.text('infoNm', 200, '정보명'),  // L326 SQL 계산 컬럼(selectByCompanyId: icam01_info_nm)
  gb.text('trCd', 70, '거래코드'),  // L327
  gb.text('trNm', 200, '거래명'),  // L328 SQL 계산 컬럼(selectByCompanyId: icam01_tr_nm)
  gb.date('tgtDate', 100, '예정일자'),  // L329
  gb.double('tgtAmt', 120, '예정금액'),  // L330
  gb.date('tgtStdDate', 100, '자료기준일'),  // L331
  gb.text('note', 500, '비고'),  // L332
  gb.text('createDateString', 150, '작업일시'),  // L333 SQL 계산 컬럼(selectByCompanyId: to_char(icam02_create_date,'yyyy-mm-dd …)
  gb.text('creater', 100, '작업자'),  // L334
  gb.long('icsClassTreeId', 80, '내부통제ID'),  // L335
  gb.long('icsDeadlineId', 80, '내부통제-기한ID'),  // L336
  gb.text('confirmYn', 80, '확인여부'),  // L337
  gb.long('confirmPersonId', 80, '확인자ID'),  // L338
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="unknown" onClick={batch}>ICAM 종목정보 가져오기</Button>
3. <Button type="unknown" onClick={batch}>ICAM 원장 가져오기(fnd10)</Button>
4. <Button type="unknown" onClick={batch}>ICAM 시세가져오기</Button>
5. <Button type="unknown" onClick={batch}>공모주38</Button>
6. <Button type="unknown" onClick={batch}>IPOStock</Button>
7. <Button type="unknown" onClick={batch}>공모주 미일치생성</Button>
8. <Button type="unknown" onClick={batch}>알람실행</Button>
9. <Button type="unknown" onClick={batch}>ICAM 정보코드 가져오기</Button>
10. <Button type="unknown" onClick={batch}>ICAM 연계정보 가져오기</Button>
11. <Button type="unknown" onClick={batch}>스케줄 당일미처리생성</Button>
12. <Button type="unknown" onClick={serviceCall}>청구보수 생성 TEST</Button>
13. <Button type="unknown" onClick={batch}>ICAM 펀드원장 가져오기</Button>
14. <Button type="unknown" onClick={batch}>ICAM 공모주청약정보 가져오기</Button>
15. <Button type="unknown" onClick={serviceCall}>임직원 내부통제 준수 현황표 생성</Button>
16. <Button type="unknown" onClick={batch}>종목명 변경 반영</Button>
17. <Button type="unknown" onClick={batch}>당일상장주식Get</Button>
18. <Button type="unknown" onClick={batch}>일임계좌Get</Button>
19. <Button type="unknown" onClick={batch}>소실파일</Button>
20. <Button type="unknown" onClick={batch}>타사무관리펀드 보유종목Get(ifi34=>flt09)</Button>
21. <Button type="unknown" onClick={undefined}>시작취소</Button>
22. <Button type="save" onClick={undefined}>확정</Button>
23. <Button type="delete" onClick={undefined}>삭제</Button>
24. <Button type="cancel" onClick={undefined}>취소</Button>
25. <Button type="unknown" onClick={undefined}>적용</Button>
26. <Button type="unknown" onClick={undefined}>신청</Button>
27. <Button type="cancel" onClick={undefined}>신청취소</Button>
28. <Button type="unknown" onClick={undefined}>검토요청</Button>
29. <Button type="cancel" onClick={undefined}>요청취소</Button>
30. <Button type="unknown" onClick={undefined}>검토진행</Button>
31. <Button type="unknown" onClick={undefined}>검토완료</Button>
32. <Button type="unknown" onClick={undefined}>검토취소</Button>
33. <Button type="save" onClick={undefined}>점검시작</Button>
34. <Button type="save" onClick={undefined}>승인시작</Button>
35. <Button type="register" onClick={undefined}>인사정보 가져오기</Button>
36. <Button type="unknown" onClick={batch}>test</Button>

