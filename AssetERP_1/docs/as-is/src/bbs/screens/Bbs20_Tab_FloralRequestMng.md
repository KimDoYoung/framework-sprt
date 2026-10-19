# Bbs20_Tab_FloralRequestMng

- 종류: 화면
- 메뉴: 경영관리 > 90. 신청서관리 > 화환신청 확인 (#1362)
- 파일: `client/vi/bbs/Bbs20_Tab_FloralRequestMng.java`
- 함께 쓰는 클래스 3개:
  - `Bbs22_Lookup_FloralMessage` `client/vi/bbs/Bbs22_Lookup_FloralMessage.java`
  - `Bbs20_Lookup_RelateFile` `client/vi/bbs/Bbs20_Lookup_RelateFile.java`
  - `Bbs20_Lookup_Message` `client/vi/bbs/Bbs20_Lookup_Message.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Bbs20_Edit_FloralRequest`](../../bbs/components/Bbs20_Edit_FloralRequest.md), [`Sys10_Lookup_FileViewer`](../../sys/components/Sys10_Lookup_FileViewer.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `bbs.Bbs20_FloralRequest.selectByTextAdmin` | Bbs20_Tab_FloralRequestMng:246 | [`Bbs20_FloralRequest.java:44`](../../bbs/services/Bbs20_FloralRequest.md) | [`bbs20_floral_request.selectByTextAdmin`](../../bbs/sql/bbs20_floral_request.md) |
| `bbs.Bbs20_FloralRequest.sendMessage` | Bbs20_Lookup_Message:146 | [`Bbs20_FloralRequest.java:58`](../../bbs/services/Bbs20_FloralRequest.md) | [`emp01_person.selectById`](../../emp/sql/emp01_person.md) |
| `bbs.Bbs20_FloralRequest.update` | Bbs20_Tab_FloralRequestMng:233 | [`Bbs20_FloralRequest.java:88`](../../bbs/services/Bbs20_FloralRequest.md) | `UpdateDataModel(bbs20_floral_request)` 동적 INSERT/UPDATE → [`bbs20_floral_request.selectById`](../../bbs/sql/bbs20_floral_request.md) |
| `bbs.Bbs22_FloralMessage.checkOccasionsCode` | Bbs22_Lookup_FloralMessage:71 | [`Bbs22_FloralMessage.java:39`](../../bbs/services/Bbs22_FloralMessage.md) | [`bbs22_floral_message.deleteCode`](../../bbs/sql/bbs22_floral_message.md), [`bbs22_floral_message.insertCode`](../../bbs/sql/bbs22_floral_message.md) |
| `bbs.Bbs22_FloralMessage.selectByCompanyId` | Bbs22_Lookup_FloralMessage:91 | [`Bbs22_FloralMessage.java:24`](../../bbs/services/Bbs22_FloralMessage.md) | [`bbs22_floral_message.selectByCompanyId`](../../bbs/sql/bbs22_floral_message.md) |
| `bbs.Bbs22_FloralMessage.update` | Bbs22_Lookup_FloralMessage:85 | [`Bbs22_FloralMessage.java:49`](../../bbs/services/Bbs22_FloralMessage.md) | `UpdateDataModel(bbs22_floral_message)` 동적 INSERT/UPDATE → [`bbs22_floral_message.selectById`](../../bbs/sql/bbs22_floral_message.md) |
| `emp.Emp00_TransInfo.selectByText` | Bbs20_Lookup_Message:181 | [`Emp00_TransInfo.java:33`](../../emp/services/Emp00_TransInfo.md) | [`emp00_trans_info.selectByText`](../../emp/sql/emp00_trans_info.md) |
| `sys.Sys00_Common.selectByKindGroupCode` | Bbs20_Tab_FloralRequestMng:137 | [`Sys00_Common.java:106`](../../sys/services/Sys00_Common.md) | [`sys09_code.selectByKindGroupCode`](../../sys/sql/sys09_code.md) |
| `sys.Sys10_File.selectByParentId` | Bbs20_Lookup_RelateFile:101 | [`Sys10_File.java:51`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |

## 테이블

[`bbs20_floral_request`](../../../db/tables/bbs.md), [`bbs21_floral_request_share`](../../../db/tables/bbs.md), [`bbs22_floral_message`](../../../db/tables/bbs.md), [`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md), [`emp08_license`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys01_company`](../../../db/tables/sys.md), [`sys04_role`](../../../db/tables/sys.md), [`sys05_user_role`](../../../db/tables/sys.md), [`sys06_menu`](../../../db/tables/sys.md), [`sys07_role_menu`](../../../db/tables/sys.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_create_seq`, `f_emp_kor_nm`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_org_parent_info_nm`, `f_sysdate`, `f_today`, `f_trunc`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Bbs20_Tab_FloralRequestMng (`client/vi/bbs/Bbs20_Tab_FloralRequestMng.java`, 261줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 조회기간: {startDate} ~: {closeDate} 검색: {searchText} {confirmYn} {retrieveButton} {updateButton} {commentButton}
- 입력·하위 화면: `searchText` TextField 빈칸="신청자/거래처/거래처담당자", `startDate` MyDateField, `closeDate` MyDateField, `confirmYn` CheckBox, `lookup` Bbs22_Lookup_FloralMessage, `statusComboBox` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode")
- 그리드 `grid` (buildGrid(), 체크박스):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - actionCell 40 "보기" Cell 편집:viewCell1
  - regDate 90 "신청일" Date
  - personInfo 130 "신청자" Text
  - occasionsName 70 "경조구분" TextCenter
  - reason 200 "신청사유" Text
  - sendEmp 150 "발신인" Text
  - rcvCompany 150 "회사명" Text
  - rcvInfo 150 "담당자" Text
  - sendRequestDate 90 "발송요청일" Date
  - fileCount 70 "증빙자료" LongCenter
  - actionCell 40 " " Cell 편집:viewCell2
  - statusName 80 "신청상태" TextCenter 편집:"0069B4"
  - endDate 90 "완료일" Date 편집:"0069B4"
  - actionCell 70 "문자발송" Cell 편집:sendCell
  - note 150 "비고" Text 편집:"0069B4"
  - rejectReason 250 "반려사유" Text 편집:"0069B4"

#### 이벤트
[E0] 화면 열림 (생성자 L62-91) → settings(), retrieve()
[E1] searchText.KeyPress [Enter] (L102) → retrieve()
[E2] retrieveButton[조회].Select (L110) → retrieve()
[E3] updateButton[저장].Select (L116) → update()
[E4] commentButton[경조구분별 문구등록].Select (L122) → 인라인 L122-128 (new SelectHandler() { @Override publi…)
[E5] statusComboBox[sys.Sys00_Common.selectByKindGroupCode].Collapse (L138) → 인라인 L138-146 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private sendMessage() | L202-205 | buildGrid | 조회창 Bbs20_Lookup_Message 열기 | 업무 |
| private update() | L207-235 | E3 | 서비스 bbs.Bbs20_FloralRequest.update | 업무 |
| public retrieve() | L237-252 | 생성자,E1,E2,buildGrid | 서비스 bbs.Bbs20_FloralRequest.selectByTextAdmin(companyId, startDate, closeDate, searchText, confirmYn) | 업무 |
| private settings() | L93-129 | 생성자 | 조회창 Bbs22_Lookup_FloralMessage 열기, 이벤트 연결, 초기값: startDate=ClientDateUtil.toDate(DateTimeFormat.getFormat("yyyy-01-01", closeDate=LoginUser.getToday(, confirmYn=true("미완료건만 보기") | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L131-200 | 필드 초기화 | 팝업 Bbs20_Edit_FloralRequest 열기, 조회창 Bbs20_Lookup_RelateFile 열기, 서비스 sys.Sys00_Common.selectByKindGroupCode, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlCheckBoxLabelStyle() | L254-256 | settings,buildGrid | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L258-260 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L176 newHeaderGroupMap08newHeaderGroupConfigsetHtmlCheckBoxLabelStyle12 100 "받는 사람" (sys10_new_header_group_map08new_header_group_configset_html_check_box_label_style12 컬럼 없음)
  // ⚠ 대응 없음 (GridBuilder L177) addCell
  gb.date('regDate', 90, '신청일'),  // L178
  gb.text('personInfo', 130, '신청자'),  // L179
  gb.textCenter('occasionsNm', 70, '경조구분'),  // L180
  gb.text('reason', 200, '신청사유'),  // L181
  gb.text('sendEmp', 150, '발신인'),  // L182
  gb.text('rcvCompany', 150, '회사명'),  // L185
  // ⚠DB없음 L186 rcvInfo 150 "담당자" (sys10_rcv_info 컬럼 없음)
  gb.date('sendRequestDate', 90, '발송요청일'),  // L190
  gb.longCenter('fileCount', 70, '증빙자료'),  // L191
  // ⚠ 대응 없음 (GridBuilder L192) addCell
  gb.textCenter('statusNm', 80, '신청상태', { editor: 'select' }),  // L193
  gb.date('endDate', 90, '완료일', { editor: 'date' }),  // L194
  // ⚠ 대응 없음 (GridBuilder L195) addCell
  gb.text('note', 150, '비고', { editor: 'text' }),  // L196
  gb.text('rejectReason', 250, '반려사유', { editor: 'text' }),  // L197
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="register" onClick={() => /* 인라인 L122-128 (new SelectHandler() { @Override publi…) */}>경조구분별 문구등록</Button>

### Bbs22_Lookup_FloralMessage (`client/vi/bbs/Bbs22_Lookup_FloralMessage.java`, 97줄)

- 그리드 `grid` (buildGrid()):
  - occasionsName 100 "경조구분" TextCenter
  - message 400 "문구" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L37-61) → show()
[E1] updateButton[저장].Select (L44) → update()
[E2] closeButton[닫기].Select (L50) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L33-35 | 공개 메서드 | 상태 처리 | 업무 |
| private insertCode() | L70-81 | open | 서비스 bbs.Bbs22_FloralMessage.checkOccasionsCode(companyId) | 업무 |
| private update() | L83-86 | E1 | 서비스 bbs.Bbs22_FloralMessage.update | 업무 |
| private retrieve() | L88-92 | insertCode | 서비스 bbs.Bbs22_FloralMessage.selectByCompanyId(companyId) | 업무 |
| private buildGrid() | L63-68 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L94-96 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('occasionsNm', 100, '경조구분'),  // L65 SQL 계산 컬럼(selectByCompanyId: f_cdnm('OccasionsCode', bbs22_occasions…)
  gb.text('message', 400, '문구', { editor: 'text' }),  // L66
];
```

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Bbs20_Lookup_RelateFile (`client/vi/bbs/Bbs20_Lookup_RelateFile.java`, 112줄)

- 입력·하위 화면: `viewer` Sys10_Lookup_FileViewer
- 그리드 `fileGrid` (buildApprFileGrid(), 체크박스):
  - fileName 400 "첨부파일명" Text
  - actionCell 40 "받기" Cell 편집:downloadCell
  - actionCell 40 "보기" Cell 편집:viewCell

#### 이벤트
[E0] 화면 열림 (생성자 L42-65) → show()
[E1] closeButton[닫기].Select (L50) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L37-40 | 공개 메서드 | 상태 처리 | 업무 |
| private buildApprFileGrid() | L67-94 | 필드 초기화 | 조회창 Sys10_Lookup_FileViewer 열기 | 업무 |
| private retrieve() | L96-107 | open | 서비스 sys.Sys10_File.selectByParentId(parentId) | 업무 |
| private setHtmlHeaderStyle() | L109-111 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildApprFileGrid = () => [
  gb.text('fileNm', 400, '첨부파일명'),  // L90
  // ⚠ 대응 없음 (GridBuilder L91) addCell
  // ⚠ 대응 없음 (GridBuilder L92) addCell
];
```

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>

### Bbs20_Lookup_Message (`client/vi/bbs/Bbs20_Lookup_Message.java`, 196줄)

- 툴바 `buttonBar`: 검색: {findTextField} {retrieveButton}
- 입력·하위 화면: `findTextField` TextField 빈칸="사원명/부서명/사원번호"
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - parentFullName 200 "조직" Text
  - titleName 120 "직책" Text
  - empNo 80 "사번" Text
  - empKorName 100 "성명" Text
  - transDate 100 "발령일" Date

#### 이벤트
[E0] 화면 열림 (생성자 L63-87) → settings(), show()
[E1] findTextField.KeyPress [Enter] (L92) → retrieve()
[E2] retrieveButton[조회].Select (L100) → retrieve()
[E3] updateButton[발송].Select (L106) → sendMessage()
[E4] closeButton[닫기].Select (L112) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L53-61 | 공개 메서드 | 상태 처리 | 업무 |
| private sendMessage() | L132-162 | E3 | 서비스 bbs.Bbs20_FloralRequest.sendMessage(companyId, content) | 업무 |
| private getGridList() | L164-170 | sendMessage | 상태 처리 | 업무 |
| public retrieve() | L172-187 | E1,E2,open | 서비스 emp.Emp00_TransInfo.selectByText(companyId, searchText, transDate, transCode, isSeparateAddTitle) | 업무 |
| private settings() | L89-118 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L120-130 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L189-191 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L193-195 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('parentFullNm', 200, '조직'),  // L124
  gb.text('titleNm', 120, '직책'),  // L125
  gb.text('empNo', 80, '사번'),  // L126
  gb.text('korNm', 100, '성명'),  // L127
  gb.date('transDate', 100, '발령일'),  // L128
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="send" onClick={sendMessage}>발송</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

