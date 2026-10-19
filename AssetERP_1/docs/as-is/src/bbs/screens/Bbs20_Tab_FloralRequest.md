# Bbs20_Tab_FloralRequest

- 종류: 화면
- 메뉴: 신청 > 90. 기타신청 > 화환 신청 (#1363)
- 파일: `client/vi/bbs/Bbs20_Tab_FloralRequest.java`
- 함께 쓰는 클래스 2개:
  - `Bbs21_Lookup_FloralRequestShare` `client/vi/bbs/Bbs21_Lookup_FloralRequestShare.java`
  - `Bbs20_Lookup_Message` `client/vi/bbs/Bbs20_Lookup_Message.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Bbs20_Edit_FloralRequest`](../../bbs/components/Bbs20_Edit_FloralRequest.md), [`Emp00_Lookup_SelectMulti`](../../emp/components/Emp00_Lookup_SelectMulti.md), [`Org00_Lookup_SelectMulti`](../../org/components/Org00_Lookup_SelectMulti.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `bbs.Bbs20_FloralRequest.delete` | Bbs20_Tab_FloralRequest:253 | [`Bbs20_FloralRequest.java:93`](../../bbs/services/Bbs20_FloralRequest.md) | `UpdateDataModel(bbs20_floral_request)` 동적 DELETE |
| `bbs.Bbs20_FloralRequest.selectByText` | Bbs20_Tab_FloralRequest:276 | [`Bbs20_FloralRequest.java:29`](../../bbs/services/Bbs20_FloralRequest.md) | [`bbs20_floral_request.selectByText`](../../bbs/sql/bbs20_floral_request.md) |
| `bbs.Bbs20_FloralRequest.sendMessage` | Bbs20_Lookup_Message:146 | [`Bbs20_FloralRequest.java:58`](../../bbs/services/Bbs20_FloralRequest.md) | [`emp01_person.selectById`](../../emp/sql/emp01_person.md) |
| `bbs.Bbs21_FloralRequestShare.delete` | Bbs21_Lookup_FloralRequestShare:249 | [`Bbs21_FloralRequestShare.java:52`](../../bbs/services/Bbs21_FloralRequestShare.md) | `UpdateDataModel(bbs21_floral_request_share)` 동적 DELETE |
| `bbs.Bbs21_FloralRequestShare.selectByFloralRequestId` | Bbs21_Lookup_FloralRequestShare:310 | [`Bbs21_FloralRequestShare.java:22`](../../bbs/services/Bbs21_FloralRequestShare.md) | [`bbs21_floral_request_share.selectByFloralRequestId`](../../bbs/sql/bbs21_floral_request_share.md) |
| `bbs.Bbs21_FloralRequestShare.selectShareInfo` | Bbs21_Lookup_FloralRequestShare:277 | [`Bbs21_FloralRequestShare.java:28`](../../bbs/services/Bbs21_FloralRequestShare.md) | [`bbs21_floral_request_share.selectShareInfo`](../../bbs/sql/bbs21_floral_request_share.md) |
| `bbs.Bbs21_FloralRequestShare.update` | Bbs21_Lookup_FloralRequestShare:263 | [`Bbs21_FloralRequestShare.java:47`](../../bbs/services/Bbs21_FloralRequestShare.md) | `UpdateDataModel(bbs21_floral_request_share)` 동적 INSERT/UPDATE → [`bbs21_floral_request_share.selectById`](../../bbs/sql/bbs21_floral_request_share.md) |
| `emp.Emp00_TransInfo.selectByText` | Bbs20_Lookup_Message:181 | [`Emp00_TransInfo.java:33`](../../emp/services/Emp00_TransInfo.md) | [`emp00_trans_info.selectByText`](../../emp/sql/emp00_trans_info.md) |

## 테이블

[`bbs20_floral_request`](../../../db/tables/bbs.md), [`bbs21_floral_request_share`](../../../db/tables/bbs.md), [`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md), [`emp08_license`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys01_company`](../../../db/tables/sys.md), [`sys04_role`](../../../db/tables/sys.md), [`sys05_user_role`](../../../db/tables/sys.md), [`sys06_menu`](../../../db/tables/sys.md), [`sys07_role_menu`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_emp_kor_nm`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_org_parent_info_nm`, `f_sysdate`, `f_today`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Bbs20_Tab_FloralRequest (`client/vi/bbs/Bbs20_Tab_FloralRequest.java`, 295줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar01`: 조회기간: {startDate} ~: {closeDate} 검색: {searchText} {confirmYn} {retrieveButton} {insertButton} {deleteButton}
- 툴바 `buttonBar02`: 신청상태가 '반려'인 경우 '반려' 글자를 클릭하여 반려사유를 확인할 수 있습니다:
- 입력·하위 화면: `searchText` TextField 빈칸="신청자/거래처/거래처담당자", `startDate` MyDateField, `closeDate` MyDateField, `confirmYn` CheckBox, `lookup` Bbs20_Edit_FloralRequest
- 그리드 `grid` (buildGrid(), 체크박스):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - actionCell 40 "수정" Cell 편집:editCell
  - regDate 90 "신청일" Date
  - personInfo 130 "신청자" Text
  - occasionsName 80 "경조구분" TextCenter
  - reason 200 "신청사유" Text
  - sendEmp 150 "보내는 사람" Text
  - rcvCompany 150 "회사명" Text
  - rcvInfo 150 "담당자" Text
  - sendRequestDate 90 "발송요청일" Date
  - shareInfo 120 "신청공유" Text
  - actionCell 40 " " Cell 편집:editCell2
  - statusName 80 "신청상태" TextCenter
  - endDate 90 "완료일" Date
  - actionCell 80 "문자발송" Cell 편집:sendCell

#### 이벤트
[E0] 화면 열림 (생성자 L63-97) → settings(), retrieve()
[E1] searchText.KeyPress [Enter] (L108) → retrieve()
[E2] retrieveButton[조회].Select (L116) → retrieve()
[E3] insertButton[등록].Select (L122) → retrieve()
[E4] deleteButton[삭제].Select (L134) → deleteRow()
       └ [E6] msgBox.DialogHide [YES] (L246) → 서비스 bbs.Bbs20_FloralRequest.delete
[E5] grid.CellClick (L140) → 메시지 "반려사유가 존재하지 않습니다"

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private sendMessage() | L221-224 | buildGrid | 조회창 Bbs20_Lookup_Message 열기 | 업무 |
| private deleteRow() | L226-264 | E4 | 미선택 시 alert "완료처리된 신청내역은 삭제가 불가능합니다." → 확인창 E6 | 업무 |
| public retrieve() | L266-282 | 생성자,E1,E2,E3,buildGrid | 서비스 bbs.Bbs20_FloralRequest.selectByText(companyId, personId, startDate, closeDate, searchText, confirmYn) | 업무 |
| private settings() | L99-158 | 생성자 | 팝업 Bbs20_Edit_FloralRequest 열기, 미선택 시 alert "반려사유가 존재하지 않습니다", 이벤트 연결, 초기값: startDate=ClientDateUtil.toDate(DateTimeFormat.getFormat("yyyy-01-01", closeDate=LoginUser.getToday(, confirmYn=true("미완료건만 보기") | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L160-219 | 필드 초기화 | 팝업 Bbs20_Edit_FloralRequest 열기, 조회창 Bbs21_Lookup_FloralRequestShare 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlCheckBoxLabelStyle() | L284-286 | settings,buildGrid | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L288-290 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L292-294 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L197 newHeaderGroupMap08newHeaderGroupConfigsetHtmlCheckBoxLabelStyle12 100 "받는 사람" (sys10_new_header_group_map08new_header_group_configset_html_check_box_label_style12 컬럼 없음)
  // ⚠ 대응 없음 (GridBuilder L198) addCell
  gb.date('regDate', 90, '신청일'),  // L199
  gb.text('personInfo', 130, '신청자'),  // L200
  gb.textCenter('occasionsNm', 80, '경조구분'),  // L201
  gb.text('reason', 200, '신청사유'),  // L202
  gb.text('sendEmp', 150, '보내는 사람'),  // L203
  gb.text('rcvCompany', 150, '회사명'),  // L206
  // ⚠DB없음 L207 rcvInfo 150 "담당자" (sys10_rcv_info 컬럼 없음)
  gb.date('sendRequestDate', 90, '발송요청일'),  // L211
  gb.text('shareInfo', 120, '신청공유'),  // L212
  // ⚠ 대응 없음 (GridBuilder L213) addCell
  gb.textCenter('statusNm', 80, '신청상태'),  // L214
  gb.date('endDate', 90, '완료일'),  // L215
  // ⚠ 대응 없음 (GridBuilder L216) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={retrieve}>등록</Button>
3. <Button type="delete" onClick={deleteRow}>삭제</Button>

### Bbs21_Lookup_FloralRequestShare (`client/vi/bbs/Bbs21_Lookup_FloralRequestShare.java`, 317줄)

- 툴바 `buttonBar`: {hlc}
- 입력·하위 화면: `radio01` Radio, `radio02` Radio, `orgSearch` Org00_Lookup_SelectMulti, `lookupEmpTransInfo` Emp00_Lookup_SelectMulti
- 그리드 `grid` (grid(), 체크박스(다중)):
  - shareName 70 "구분" TextCenter
  - orgName 250 "부서" Text
  - personName 100 "성명" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L76-106) → show()
[E1] updateButton[저장].Select (L83) → update()
[E2] closeButton[닫기].Select (L89) → hide()
[E3] anchor.MouseDown (L122) → retrieve()
[E4] insertButton[행 추가].Select (L136) → insertRow()
[E5] deleteButton[행 삭제].Select (L142) → deleteRow()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L108-111 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L113-117 | 공개 메서드 | 상태 처리 | 업무 |
| private ButtonSetting() | L119-158 | open | 상태 처리 | 업무 |
| package grid() | L160-169 | 필드 초기화 | 상태 처리 | 업무 |
| private openLookupOrgInfo() | L171-196 | insertRow | 조회창 Org00_Lookup_SelectMulti 열기 | 업무 |
| private openLookupEmpInfo() | L198-225 | insertRow | 조회창 Emp00_Lookup_SelectMulti 열기 | 업무 |
| private insertRow() | L227-235 | E4 | 상태 처리 | 업무 |
| private update() | L237-272 | E1 | GridDeleteData bbs.Bbs21_FloralRequestShare.delete, bbs.Bbs21_FloralRequestShare.update | 업무 |
| private updateEnd() | L274-295 | update | 서비스 bbs.Bbs21_FloralRequestShare.selectShareInfo(floralRequestId) | 업무 |
| private deleteRow() | L297-303 | E5 | 상태 처리 | 업무 |
| private retrieve() | L305-311 | E3,open | 서비스 bbs.Bbs21_FloralRequestShare.selectByFloralRequestId(floralRequestId) | 업무 |
| private setHtmlHeaderStyle() | L313-315 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const grid = () => [
  gb.textCenter('shareNm', 70, '구분'),  // L164 SQL 계산 컬럼(selectByFloralRequestId: f_cdnm('ShareCode', bbs21_share_cd, 0, …)
  gb.text('orgNm', 250, '부서'),  // L165 SQL 계산 컬럼(selectByFloralRequestId: f_org_nm(bbs21_org_id, COALESCE(bbs20_r…)
  gb.textCenter('personNm', 100, '성명'),  // L166 SQL 계산 컬럼(selectByFloralRequestId: f_emp_kor_nm(bbs21_person_id))
];
```

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>
3. <Button type="addRow" onClick={insertRow}>행 추가</Button>
4. <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>

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

