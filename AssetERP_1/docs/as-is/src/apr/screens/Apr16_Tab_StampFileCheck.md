# Apr16_Tab_StampFileCheck

- 종류: 화면
- 메뉴: 경영관리 > 91. 법인서류 > 인감날인본 업로드확인 (#1350)
- 파일: `client/vi/apr/Apr16_Tab_StampFileCheck.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Apr10_Lookup_Stamp`](../../apr/components/Apr10_Lookup_Stamp.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr16_StampDoc.selectStampCheck` | Apr16_Tab_StampFileCheck:176 | [`Apr16_StampDoc.java:56`](../../apr/services/Apr16_StampDoc.md) | [`apr16_stamp_doc.selectStampCheck`](../../apr/sql/apr16_stamp_doc.md) |
| `apr.Apr16_StampDoc.updateConfirmDate` | Apr16_Tab_StampFileCheck:272 | [`Apr16_StampDoc.java:92`](../../apr/services/Apr16_StampDoc.md) | [`apr16_stamp_doc.updateConfirmDate`](../../apr/sql/apr16_stamp_doc.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`apr16_stamp_doc`](../../../db/tables/apr.md), [`emp01_person`](../../../db/tables/emp.md), [`sys10_file`](../../../db/tables/sys.md)

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Apr16_Tab_StampFileCheck (`client/vi/apr/Apr16_Tab_StampFileCheck.java`, 315줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 신청일자: {startDate} ~: {closeDate} 인감선택: {stampField} {checkYn} {retrieveButton} {confirmButton} {cancelButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `checkYn` CheckBox, `stampField` LookupTriggerField 빈칸="전체", `lookupStamp` Apr10_Lookup_Stamp, `editor` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - applDate 90 "신청일자" Date
  - applEmpName 100 "신청자" TextCenter
  - stampName 200 "날인인감" Text
  - stampQty 70 "날인부수" LongCenter
  - provideCo 250 "제출처" Text
  - purpose 250 "내용" TextHtml
  - apprStatusName 70 "연관문서" DynamicCell 편집:actionCell
  - stampDate 90 "날인일자" Date
  - stampFileChk 70 "날인본<br>첨부여부" TextCenter
  - confirmDate 90 "확인일자" Date
  - confirmerName 100 "확인자" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L68-98) → settings(), retrieve()
[E1] stampField.TriggerClick (L115) → findLookupStampSeq()
[E2] retrieveButton[조회].Select (L121) → retrieve()
[E3] confirmButton[확인].Select (L127) → confirmChk()
       └ [E5] messageBox.DialogHide (L246) → confirm()
[E4] cancelButton[확인취소].Select (L133) → confirmChk()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieve() | L166-182 | 생성자,E2,findLookupStampSeq,confirm | 서비스 apr.Apr16_StampDoc.selectStampCheck(companyId, startDate, closeDate, stampId, notStampFileYn) | 업무 |
| private findLookupStampSeq() | L184-202 | E1 | 조회창 Apr10_Lookup_Stamp 열기 | 업무 |
| private confirmChk() | L204-256 | E3,E4 | 미선택 시 alert "선택된 내역이 없습니다" → 확인창 E5 | 업무 |
| private confirm() | L258-282 | E5 | 서비스 apr.Apr16_StampDoc.updateConfirmDate | 업무 |
| private lookupAppr() | L284-306 | buildGrid | 팝업 Apr01_Edit_ApprDoc 열기, 미선택 시 alert "해당문서의 열람권한이 없습니다" | 업무 |
| public settings() | L100-139 | 생성자 | 이벤트 연결, 초기값: checkYn=false("날인본 미첨부 내역만 조회"), startDate=ClientDateUtil.toDate(fromDateStr, closeDate=LoginUser.getToday( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L141-164 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L308-310 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L312-314 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('applDate', 90, '신청일자'),  // L151
  gb.textCenter('applEmpNm', 100, '신청자'),  // L152 SQL 계산 컬럼(selectStampCheck: a.emp01_kor_nm)
  gb.text('stampNm', 200, '날인인감'),  // L153 SQL 계산 컬럼(selectStampCheck: apr10_stamp_nm)
  gb.longCenter('stampQty', 70, '날인부수'),  // L154
  gb.text('provideCo', 250, '제출처'),  // L155
  // ⚠ 대응 없음 (GridBuilder L156) addTextHtml
  // ⚠ 대응 없음 (GridBuilder L157) addDynamicCell
  gb.date('stampDate', 90, '날인일자'),  // L158
  gb.textCenter('stampFileChk', 70, '날인본<br>첨부여부'),  // L159 SQL 계산 컬럼(selectStampCheck: CASE WHEN stamp_file_cnt = 0 THEN 'X' E…)
  gb.date('confirmDate', 90, '확인일자'),  // L160
  gb.textCenter('confirmerNm', 100, '확인자'),  // L161 SQL 계산 컬럼(selectStampCheck: b.emp01_kor_nm)
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirmChk}>확인</Button>
3. <Button type="cancel" onClick={confirmChk}>확인취소</Button>

