# Dcr10_Tab_MailHistory_Manager

- 종류: 화면
- 메뉴: 관리자 > 04. 전자결재 > 발신메일 목록(관리자) (#1024)
- 파일: `client/vi/dcr/Dcr10_Tab_MailHistory_Manager.java`
- 함께 쓰는 클래스 1개:
  - `Dcr10_Lookup_MailViwer` `client/vi/dcr/Dcr10_Lookup_MailViwer.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Fnd01_Lookup_SelectSingle`](../../fnd/components/Fnd01_Lookup_SelectSingle.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectById` | Dcr10_Tab_MailHistory_Manager:171 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `dcr.Dcr10_MailHistory.selectByTitleText` | Dcr10_Tab_MailHistory_Manager:233 | [`Dcr10_MailHistory.java:50`](../../dcr/services/Dcr10_MailHistory.md) | [`dcr10_mail_history.selectByTitleText`](../../dcr/sql/dcr10_mail_history.md) |
| `sys.Sys10_File.selectMailFileHistory` | Dcr10_Lookup_MailViwer:157 | [`Sys10_File.java:161`](../../sys/services/Sys10_File.md) | [`sys10_file.selectMailFileHistory`](../../sys/sql/sys10_file.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr03_relate_fund`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`cmp10_mail_book`](../../../db/tables/cmp.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr10_mail_history`](../../../db/tables/dcr.md), [`dcr11_mail_file_history`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys10_file`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_get_dcr_no`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Dcr10_Tab_MailHistory_Manager (`client/vi/dcr/Dcr10_Tab_MailHistory_Manager.java`, 247줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 발신일자: {startDateField} {endDateField} {mailGubun} 연관펀드: {fundName} 검색: {titleTextField} {retrieveButton}
- 입력·하위 화면: `startDateField` MyDateField, `endDateField` MyDateField, `fundName` LookupTriggerField, `titleTextField` TextField 빈칸="제목", `mailGubun` StringComboBox, `mailSender` Dcr10_Lookup_MailViwer, `editor` Apr01_Edit_ApprDoc, `lookupSingleFund` Fnd01_Lookup_SelectSingle
- 그리드 `grid` (buildGrid()):
  - sendTimeString 150 "보낸시간" Text
  - personName 100 "발신자" TextCenter
  - senderEmail 150 "발신" Text
  - receiverEmail 300 "수신" Text
  - referencerEmail 300 "참조" Text
  - titleText 300 "제목" Text
  - actionCell 60 "내용" Cell 편집:actionCell1
  - actionCell 60 "문서" Cell 편집:actionCell2

#### 이벤트
[E0] 화면 열림 (생성자 L66-95) → settings()
[E1] titleTextField.KeyPress [Enter] (L123) → retrieve()
[E2] fundName.TriggerClick (L134) → openLookupOpr()
[E3] retrieveButton[조회].Select (L140) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private openLookupOpr() | L207-222 | E2 | 조회창 Fnd01_Lookup_SelectSingle 열기 | 업무 |
| public retrieve() | L224-242 | E1,E3,settings | 서비스 dcr.Dcr10_MailHistory.selectByTitleText(companyId, startDate, endDate, titleText, fundId, mailGubun) | 업무 |
| private settings() | L97-148 | 생성자 | 이벤트 연결, 초기값: startDateField=startDate, endDateField=endDate, titleTextField="", fundName="전체" | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L150-205 | 필드 초기화 | 조회창 Dcr10_Lookup_MailViwer 열기 → 콜백: unmask, 팝업 Apr01_Edit_ApprDoc 열기, 미선택 시 alert "해당 메일의 연관된 문서가 존재하지않습니다", 서비스 apr.Apr01_Appr.selectById, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L244-246 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('sendTimeStr', 150, '보낸시간'),  // L195 SQL 계산 컬럼(selectByTitleText: to_char(dcr10_send_time,'yyyy-mm-dd hh2…)
  gb.textCenter('personNm', 100, '발신자'),  // L196 SQL 계산 컬럼(selectByTitleText: f_emp_kor_nm(dcr10_person_id))
  gb.text('senderEmail', 150, '발신'),  // L197
  gb.text('receiverEmail', 300, '수신'),  // L198
  gb.text('referencerEmail', 300, '참조'),  // L199
  gb.text('titleText', 300, '제목'),  // L200
  // ⚠ 대응 없음 (GridBuilder L201) addCell
  // ⚠ 대응 없음 (GridBuilder L202) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

### Dcr10_Lookup_MailViwer (`client/vi/dcr/Dcr10_Lookup_MailViwer.java`, 186줄)

- 입력·하위 화면: `mailInfo` TextField, `sender` TextField, `receiver` TextField, `ccReceiver` TextField, `title` TextField
- 그리드 `fileGrid` (buildGrid(), 체크박스):
  - fileName 570 "첨부파일" Text
  - actionCell 70 "받기" Cell 편집:downloadCell

#### 이벤트
[E0] 화면 열림 (생성자 L61-121) → settings()
[E1] closeButton[닫기].Select (L144) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L152-172 | 공개 메서드 | 서비스 sys.Sys10_File.selectMailFileHistory(mailFileHistoryId) | 업무 |
| private settings() | L143-150 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L123-141 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlStyle() | L179-181 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L183-185 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('fileNm', 570, '첨부파일'),  // L137
  // ⚠ 대응 없음 (GridBuilder L138) addCell
];
```

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>

