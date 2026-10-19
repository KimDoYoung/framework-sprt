# Bbs02_Tab_NoticeAdmin

- 종류: 화면
- 메뉴: 커뮤니티 > 02. 공지사항 > KFS공지등록 (#1246)
- 파일: `client/vi/bbs/Bbs02_Tab_NoticeAdmin.java`
- 함께 쓰는 클래스 3개:
  - `Bbs02_Edit_NoticeAdmin` `client/vi/bbs/Bbs02_Edit_NoticeAdmin.java`
  - `Bbs09_Lookup_History` `client/vi/bbs/Bbs09_Lookup_History.java`
  - `Bbs02_Edit_Message` `client/vi/bbs/Bbs02_Edit_Message.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Bbs02_Lookup_File`](../../bbs/components/Bbs02_Lookup_File.md), [`Bbs02_Popup_NoticeAdmin`](../../bbs/components/Bbs02_Popup_NoticeAdmin.md), [`Emp00_Lookup_SelectMulti`](../../emp/components/Emp00_Lookup_SelectMulti.md), [`Sch06_Lookup_AlarmSetup`](../../sch/components/Sch06_Lookup_AlarmSetup.md), [`Sys01_Lookup_SelectMulti`](../../sys/components/Sys01_Lookup_SelectMulti.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `bbs.Bbs02_Notice.delete` | Bbs02_Edit_NoticeAdmin:598 | [`Bbs02_Notice.java:196`](../../bbs/services/Bbs02_Notice.md) | `UpdateDataModel(bbs02_notice)` 동적 DELETE |
| `bbs.Bbs02_Notice.modelUpdate` | Bbs02_Edit_NoticeAdmin:676 | [`Bbs02_Notice.java:167`](../../bbs/services/Bbs02_Notice.md) | [`bbs02_notice.getNoticeNo`](../../bbs/sql/bbs02_notice.md), `UpdateDataModel(bbs02_notice)` 동적 INSERT/UPDATE → [`bbs02_notice.selectById`](../../bbs/sql/bbs02_notice.md) |
| `bbs.Bbs02_Notice.selectByPublicYnPaging` | Bbs02_Tab_NoticeAdmin:100 | [`Bbs02_Notice.java:137`](../../bbs/services/Bbs02_Notice.md) | [`bbs02_notice.selectByPublicYnPaging`](../../bbs/sql/bbs02_notice.md), [`bbs02_notice.selectByPublicYnTotal`](../../bbs/sql/bbs02_notice.md) |
| `bbs.Bbs04_TargetCompany.delete` | Bbs02_Edit_NoticeAdmin:565 | [`Bbs04_TargetCompany.java:69`](../../bbs/services/Bbs04_TargetCompany.md) | `UpdateDataModel(bbs04_target_company)` 동적 DELETE |
| `bbs.Bbs04_TargetCompany.deleteAllTarget` | Bbs02_Edit_NoticeAdmin:569 | [`Bbs04_TargetCompany.java:56`](../../bbs/services/Bbs04_TargetCompany.md) | [`bbs04_target_company.deleteAll`](../../bbs/sql/bbs04_target_company.md) |
| `bbs.Bbs04_TargetCompany.selectByNoticeId` | Bbs02_Edit_NoticeAdmin:559 | [`Bbs04_TargetCompany.java:20`](../../bbs/services/Bbs04_TargetCompany.md) | [`bbs04_target_company.selectByNoticeId`](../../bbs/sql/bbs04_target_company.md) |
| `bbs.Bbs04_TargetCompany.update` | Bbs02_Edit_NoticeAdmin:699 | [`Bbs04_TargetCompany.java:64`](../../bbs/services/Bbs04_TargetCompany.md) | `UpdateDataModel(bbs04_target_company)` 동적 INSERT/UPDATE → [`bbs04_target_company.selectById`](../../bbs/sql/bbs04_target_company.md) |
| `bbs.Bbs09_NoticeHistory.insert` | Bbs02_Edit_NoticeAdmin:659 | [`Bbs09_NoticeHistory.java:34`](../../bbs/services/Bbs09_NoticeHistory.md) | [`bbs09_notice_history.insert`](../../bbs/sql/bbs09_notice_history.md) |
| `bbs.Bbs09_NoticeHistory.selectByNoticeId` | Bbs09_Lookup_History:118 | [`Bbs09_NoticeHistory.java:24`](../../bbs/services/Bbs09_NoticeHistory.md) | [`bbs09_notice_history.selectByNoticeId`](../../bbs/sql/bbs09_notice_history.md) |
| `sch.Sch06_Alarm.selectByTargetId` | Bbs02_Edit_NoticeAdmin:544 | [`Sch06_Alarm.java:23`](../../sch/services/Sch06_Alarm.md) | [`sch06_alarm.selectByTargetId`](../../sch/sql/sch06_alarm.md) |
| `sms.Sms03_GroupSend.sendNoticeMessage` | Bbs02_Tab_NoticeAdmin:316 | [`Sms03_GroupSend.java:37`](../../sms/services/Sms03_GroupSend.md) | - |
| `sys.Sys00_Common.selectByKindCode` | Bbs02_Edit_NoticeAdmin:166 | [`Sys00_Common.java:111`](../../sys/services/Sys00_Common.md) | [`sys09_code.selectByKindCode`](../../sys/sql/sys09_code.md) |
| `sys.Sys00_Common.selectByKindGroupCode` | Bbs02_Edit_NoticeAdmin:269, Bbs02_Tab_NoticeAdmin:125 | [`Sys00_Common.java:106`](../../sys/services/Sys00_Common.md) | [`sys09_code.selectByKindGroupCode`](../../sys/sql/sys09_code.md) |
| `sys.Sys09_Code.selectByCode3` | Bbs02_Tab_NoticeAdmin:149 | [`Sys09_Code.java:115`](../../sys/services/Sys09_Code.md) | [`sys09_code.selectByCode3`](../../sys/sql/sys09_code.md) |
| `sys.Sys10_File.selectByParentId` | Bbs02_Edit_NoticeAdmin:531 | [`Sys10_File.java:51`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |

## 테이블

[`bbs02_notice`](../../../db/tables/bbs.md), [`bbs04_target_company`](../../../db/tables/bbs.md), [`bbs09_notice_history`](../../../db/tables/bbs.md), [`sch06_alarm`](../../../db/tables/sch.md), [`sys01_company`](../../../db/tables/sys.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_create_notice_no`, `f_create_seq`, `f_emp_kor_nm`, `f_sysdate`, `f_today`, `f_trunc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Bbs02_Tab_NoticeAdmin (`client/vi/bbs/Bbs02_Tab_NoticeAdmin.java`, 356줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 공지구분: {noticeTypeComboBox} {noticeDetailComboBox} 공지기간: {startDate} ~: {closeDate} 상태: {openYnComboBox} 검색: {searchText} {retrieveButton} {insertButton}
- 입력·하위 화면: `openYnComboBox` StringComboBox, `startDate` MyDateField, `closeDate` MyDateField, `searchText` TextField 빈칸="공지구분/제목/기타메모", `noticeTypeComboBox` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode", "%", "전체", "전체"), `noticeDetailComboBox` CommonComboBoxField("sys.Sys09_Code.selectByCode3", "%", "전체", "전체"), `editNotice` Bbs02_Edit_NoticeAdmin, `lookup` Bbs02_Edit_Message, `lookupEmpTransInfo` Emp00_Lookup_SelectMulti
- 그리드 `grid` (buildGrid()):
  - fromDate 100 "공지일" Date
  - toDate 100 "종료일" Date
  - openYn 70 "상태" TextCenter
  - noticeDetailFullName 200 "공지구분" Text
  - noticeNo 100 "공지번호" TextCenter
  - title 500 "제목" Text
  - actionCell 50 "상세보기" Cell 편집:editCell
  - note 200 "기타메모" Text
  - actionCell 100 "문자발송" Cell 편집:sendCell

#### 이벤트
[E0] 화면 열림 (생성자 L70-111) → settings()
[E1] noticeTypeComboBox[sys.Sys00_Common.selectByKindGroupCode].Collapse (L133) → retrieve(), setDateField()
[E2] noticeDetailComboBox[sys.Sys09_Code.selectByCode3].Collapse (L169) → retrieve()
[E3] openYnComboBox[전체].Collapse (L191) → retrieve()
[E4] searchText.KeyPress [Enter] (L200) → retrieve()
[E5] retrieveButton[조회].Select (L209) → retrieve()
[E6] insertButton[등록].Select (L215) → insertRow()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L254-293 | E1,E2,E3,E4,E5,settings | 상태 처리 | 업무 |
| private sendMessage() | L295-305 | buildGrid | 팝업 Bbs02_Edit_Message 열기 | 업무 |
| private sendList() | L307-335 | sendMessage | 조회창 Emp00_Lookup_SelectMulti 열기, 서비스 sms.Sms03_GroupSend.sendNoticeMessage(companyId, message) | 업무 |
| public insertRow() | L337-340 | E6 | 팝업 Bbs02_Edit_NoticeAdmin 열기 | 업무 |
| private setDateField() | L342-350 | E1 | 상태 처리 | 업무 |
| private settings() | L113-221 | 생성자 | 서비스 sys.Sys00_Common.selectByKindGroupCode, sys.Sys09_Code.selectByCode3, sys.Sys09_Code.selectByCode3, 이벤트 연결, 초기값: startDate=tmpDate, closeDate=LoginUser.getToday( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L223-252 | 필드 초기화 | 팝업 Bbs02_Edit_NoticeAdmin 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L353-355 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('fromDate', 100, '공지일'),  // L242
  gb.date('toDate', 100, '종료일'),  // L243
  gb.textCenter('openYn', 70, '상태'),  // L244
  gb.text('noticeDetailFullNm', 200, '공지구분'),  // L245
  gb.textCenter('noticeNo', 100, '공지번호'),  // L246
  gb.text('title', 500, '제목'),  // L247
  // ⚠ 대응 없음 (GridBuilder L248) addCell
  gb.text('note', 200, '기타메모'),  // L249
  // ⚠ 대응 없음 (GridBuilder L250) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>

### Bbs02_Edit_NoticeAdmin (`client/vi/bbs/Bbs02_Edit_NoticeAdmin.java`, 750줄)

- 툴바 `buttonBar`: 개별 고객별: {insertButton} {deleteTargetButton} {deleteAllButton}
- 입력·하위 화면: `title` TextField, `notice` MyTextArea, `toDate` MyDateField, `openYn` StringComboBox, `note` MyTextArea, `userName` TextField, `noticeType` TextField, `noticeDetailCode` TextField, `publicYn` CheckBox, `publicCompanyYn` CheckBox, `commentYn` CheckBox, `fromDate` MyDateField, `lookup` Bbs09_Lookup_History, `lookupFile` Bbs02_Lookup_File, `popup` Bbs02_Popup_NoticeAdmin, `noticeTypeName` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode") 빈칸="선택하세요", `noticeDetailName` CommonComboBoxField("sys.Sys00_Common.selectByKindCode") 빈칸="선택하세요"
- 그리드 `targetGrid` (buildGrid(), 체크박스(다중)):
  - companyName 400 "고객사명" Text

#### 이벤트
[E0] 화면 열림 (생성자 L178-395) → init(), getEditor()
[E1] header.Dom (L189) → 인라인 L189-195 (new ClickHandler() { @Override public…)
[E2] updateButton[저장].Select (L199) → update()
[E3] deleteButton[삭제].Select (L205) → delete()
       └ [E14] msgBox.DialogHide [YES] (L592) → deleteAllTarget(), hide()
[E4] closeButton[닫기].Select (L211) → hide()
[E5] addFileButton[첨부파일 등록(0)].Select (L217) → setFileButtonText()
[E6] publicCompanyYn[전체고객사].ValueChange (L230) → setPublicCompanyYn()
[E7] alarmButton[예약알람설정(0)].Select (L236) → setAlarmButton()
[E8] previewButton[미리보기].Select (L248) → 인라인 L248-256 (new SelectHandler() { @Override publi…)
[E9] noticeTypeName[공지구분].ValueChange (L272) → refreshCode()
[E10] insertButton[등록].Select (L288) → insertRow()
[E11] deleteTargetButton[삭제].Select (L302) → deleteTargetModel()
[E12] deleteAllButton[전체삭제].Select [YES] (L308) → deleteAllTarget()
[E13] messageBox.DialogHide [YES] (L314) → deleteAllTarget()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private init() | L153-157 | 생성자 | 상태 처리 | 업무 |
| private refreshCode() | L159-176 | E9 | 서비스 sys.Sys00_Common.selectByKindCode | 업무 |
| private setAuthButton() | L397-405 | editNotice | 상태 처리 | 업무 |
| private insertRow() | L414-442 | E10 | 조회창 Sys01_Lookup_SelectMulti 열기 | 업무 |
| private setPublicCompanyYn() | L444-452 | E6,newNotice,editNotice | 상태 처리 | 업무 |
| public newNotice() | L454-483 | 공개 메서드 | 상태 처리 | 업무 |
| public editNotice() | L485-528 | 공개 메서드 | 상태 처리 | 업무 |
| private setFileButtonText() | L530-541 | E5,editNotice | 서비스 sys.Sys10_File.selectByParentId(parentId) | 업무 |
| private setAlarmButton() | L543-554 | E7,editNotice | 서비스 sch.Sch06_Alarm.selectByTargetId(targetId) | 업무 |
| private retrieveGrid() | L556-560 | editNotice,deleteAllTarget | 서비스 bbs.Bbs04_TargetCompany.selectByNoticeId(noticeId) | 업무 |
| private deleteTargetModel() | L562-566 | E11 | GridDeleteData bbs.Bbs04_TargetCompany.delete(체크된 행 목록) | 업무 |
| private deleteAllTarget() | L568-579 | E12,E13,E14 | 서비스 bbs.Bbs04_TargetCompany.deleteAllTarget | 업무 |
| private delete() | L581-615 | E3 | ConfirmBox → E14 | 업무 |
| public update() | L617-656 | E2 | 상태 처리 | 업무 |
| private updateHistory() | L658-673 | update | 서비스 bbs.Bbs09_NoticeHistory.insert(noticeId, personId, openYn, latestNotice) | 업무 |
| private updateData() | L675-695 | update,updateHistory | 서비스 bbs.Bbs02_Notice.modelUpdate | 업무 |
| private updateTarget() | L697-700 | update,updateHistory | 서비스 bbs.Bbs04_TargetCompany.update | 업무 |
| private getEditor() | L702-714 | 생성자 | 상태 처리 | 업무 |
| private buildGrid() | L407-412 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtml() | L716-719 | 미사용 후보 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L731-733 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L735-737 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L739-741 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L743-745 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L747-749 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('companyNm', 400, '고객사명'),  // L410 SQL 계산 컬럼(selectByNoticeId: b.sys01_company_nm)
];
```

#### 사용된 버튼들
1. <Button type="register" onClick={insertRow}>등록</Button>
2. <Button type="delete" onClick={deleteTargetModel}>삭제</Button>
3. <Button type="delete" onClick={deleteAllTarget}>전체삭제</Button>
4. <Button type="save" onClick={update}>저장</Button>
5. <Button type="delete" onClick={delete}>삭제</Button>
6. <Button type="unknown" onClick={hide}>닫기</Button>
7. <Button type="unknown" onClick={setFileButtonText}>첨부파일 등록(0)</Button>
8. <Button type="unknown" onClick={setAlarmButton}>예약알람설정(0)</Button>
9. <Button type="unknown" onClick={() => /* 인라인 L248-256 (new SelectHandler() { @Override publi…) */}>미리보기</Button>

### Bbs09_Lookup_History (`client/vi/bbs/Bbs09_Lookup_History.java`, 129줄)

- 툴바 `buttonBar`: {anchor}
- 입력·하위 화면: `popup` Bbs02_Popup_NoticeAdmin
- 그리드 `grid` (buildGrid()):
  - regDateStr 200 "수정일시" TextCenter
  - openYn 80 "구분" TextCenter
  - personName 100 "사원명" TextCenter
  - contentYn 80 "내용변경" BooleanYn
  - actionCell 70 "상세보기" Cell 편집:viewCell

#### 이벤트
[E1] anchor.MouseDown (L48) → retrieve()
[E2] closeButton[닫기].Select (L69) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L38-80 | 공개 메서드 | 상태 처리 | 업무 |
| private viewNotice() | L108-111 | buildGrid | 팝업 Bbs02_Popup_NoticeAdmin 열기 | 업무 |
| private retrieve() | L113-124 | E1,open | 서비스 bbs.Bbs09_NoticeHistory.selectByNoticeId(noticeId) | 업무 |
| private buildGrid() | L82-105 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L126-128 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('regDateStr', 200, '수정일시'),  // L98 SQL 계산 컬럼(selectByNoticeId: TO_CHAR(bbs09_reg_date, 'YYYY.MM.DD HH2…)
  gb.textCenter('openYn', 80, '구분'),  // L99
  gb.textCenter('personNm', 100, '사원명'),  // L100 SQL 계산 컬럼(selectByNoticeId: f_emp_kor_nm(bbs09_person_id))
  gb.booleanYn('contentYn', 80, '내용변경'),  // L101 SQL 계산 컬럼(selectByNoticeId: ( CASE WHEN bbs09_notice IS NULL THEN '…)
  // ⚠ 대응 없음 (GridBuilder L102) addCell
];
```

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>

### Bbs02_Edit_Message (`client/vi/bbs/Bbs02_Edit_Message.java`, 68줄)

- 입력·하위 화면: `message` TextArea

#### 이벤트
[E0] 화면 열림 (생성자 L21-34) → 초기화
[E1] sendButton[발송].Select (L40) → hide()
[E2] closeButton[취소].Select (L53) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L36-63 | 공개 메서드 | 상태 처리 | 업무 |
| private setHtmlHeaderStyle() | L65-67 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="send" onClick={hide}>발송</Button>
2. <Button type="cancel" onClick={hide}>취소</Button>

