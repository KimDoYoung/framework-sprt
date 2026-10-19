# Sms03_Tab_SendAdmin

- 종류: 화면
- 메뉴: 관리자 > 01. 고객관리 > 고객별 문자발송 (#1367)
- 파일: `client/vi/sms/Sms03_Tab_SendAdmin.java`
- 함께 쓰는 클래스 3개:
  - `Sms04_Lookup_History` `client/vi/sms/Sms04_Lookup_History.java`
  - `Sms03_Page_UserListAdmin` `client/vi/sms/Sms03_Page_UserListAdmin.java`
  - `Sms03_Edit_GroupSend` `client/vi/sms/Sms03_Edit_GroupSend.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Sys85_Lookup_ClientInfoList`](../../sys/components/Sys85_Lookup_ClientInfoList.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `emp.Emp01_Person.selectByPaging` | Sms03_Page_UserListAdmin:116 | [`Emp01_Person.java:57`](../../emp/services/Emp01_Person.md) | [`emp01_person.selectByCompanyIdPaging`](../../emp/sql/emp01_person.md), [`emp01_person.selectByCompanyIdTotal`](../../emp/sql/emp01_person.md) |
| `sms.Sms03_GroupSend.delete` | Sms03_Tab_SendAdmin:183 | [`Sms03_GroupSend.java:167`](../../sms/services/Sms03_GroupSend.md) | `UpdateDataModel(sms03_group_send)` 동적 DELETE |
| `sms.Sms03_GroupSend.selectByCompanyId` | Sms03_Tab_SendAdmin:139 | [`Sms03_GroupSend.java:31`](../../sms/services/Sms03_GroupSend.md) | [`sms03_group_send.selectByCompanyId`](../../sms/sql/sms03_group_send.md) |
| `sms.Sms03_GroupSend.sendGroupMessage` | Sms03_Page_UserListAdmin:338 | [`Sms03_GroupSend.java:97`](../../sms/services/Sms03_GroupSend.md) | [`sms03_group_send.selectById`](../../sms/sql/sms03_group_send.md) |
| `sms.Sms03_GroupSend.update` | Sms03_Edit_GroupSend:134 | [`Sms03_GroupSend.java:162`](../../sms/services/Sms03_GroupSend.md) | `UpdateDataModel(sms03_group_send)` 동적 INSERT/UPDATE → [`sms03_group_send.selectById`](../../sms/sql/sms03_group_send.md) |
| `sms.Sms04_GroupSendHistory.selectByText` | Sms04_Lookup_History:102 | [`Sms04_GroupSendHistory.java:31`](../../sms/services/Sms04_GroupSendHistory.md) | [`sms04_group_send_history.selectByText`](../../sms/sql/sms04_group_send_history.md) |
| `sys.Sys00_Common.selectCompanyName` | Sms03_Page_UserListAdmin:60 | [`Sys00_Common.java:41`](../../sys/services/Sys00_Common.md) | [`sys00_common.selectCompanyName`](../../sys/sql/sys00_common.md) |

## 테이블

[`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`sms03_group_send`](../../../db/tables/sms.md), [`sms04_group_send_history`](../../../db/tables/sms.md), [`sys01_company`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md)

## DB 함수

`f_get_emptrans`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sms03_Tab_SendAdmin (`client/vi/sms/Sms03_Tab_SendAdmin.java`, 185줄)

- 레이아웃: west=vlc, center=hlc
- 툴바 `buttonBar`: {retrieveButton} {insertButton} {deleteButton}
- 입력·하위 화면: `editForm` Sms03_Edit_GroupSend, `userGrid` Sms03_Page_UserListAdmin, `lookup` Sms04_Lookup_History
- 그리드 `grid` (buildGrid()):
  - actionCell 40 " " Cell 편집:actionCell
  - title 250 "제목" Text
  - startDate 100 "생성일자" Date
  - note 150 "비고" Text

#### 이벤트
[E0] 화면 열림 (생성자 L47-77) → settings(), retrieve()
[E1] retrieveButton[조회].Select (L80) → retrieve()
[E2] insertButton[등록].Select (L86) → insertRow()
[E3] deleteButton[삭제].Select (L92) → deleteCheck()
       └ [E5] msgBox.DialogHide [YES] (L162) → delete()
[E4] grid.SelectionChanged (L100) → 인라인 L100-112 (new SelectionChangedHandler<Sms03_Gro…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L134-148 | 생성자,E1 | 서비스 sms.Sms03_GroupSend.selectByCompanyId(companyId) | 업무 |
| public insertRow() | L150-157 | E2 | 상태 처리 | 업무 |
| private deleteCheck() | L159-178 | E3 | ConfirmBox → E5 | 업무 |
| public delete() | L180-184 | E5 | GridDeleteData sms.Sms03_GroupSend.delete(체크된 행 목록) | 업무 |
| private settings() | L79-113 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L115-132 | 필드 초기화 | 조회창 Sms04_Lookup_History 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L127) addCell
  gb.text('title', 250, '제목'),  // L128
  gb.date('startDate', 100, '생성일자'),  // L129
  gb.text('note', 150, '비고'),  // L130
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="delete" onClick={deleteCheck}>삭제</Button>

### Sms04_Lookup_History (`client/vi/sms/Sms04_Lookup_History.java`, 117줄)

- 툴바 `buttonBar`: 검색: {searchTextField} {retrieveButton}
- 입력·하위 화면: `searchTextField` TextField 빈칸="고객사/휴대폰"
- 그리드 `grid` (buildGrid()):
  - sendDateStr 150 "발송일시" TextCenter
  - targetName 250 "고객사" Text
  - targetTelNo 120 "휴대폰" Text

#### 이벤트
[E0] 화면 열림 (생성자 L42-67) → settings(), show(), retrieve()
[E1] retrieveButton[조회].Select (L72) → retrieve()
[E2] closeButton[닫기].Select (L78) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L37-40 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L95-108 | 생성자,E1,open | 서비스 sms.Sms04_GroupSendHistory.selectByText(groupSendId, companyId, searchText) | 업무 |
| private settings() | L69-84 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| package buildGrid() | L86-93 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L110-112 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L114-116 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('sendDateStr', 150, '발송일시'),  // L89 SQL 계산 컬럼(selectByText: TO_CHAR(sms04_send_date, 'yyyy-mm-dd hh…)
  gb.text('targetNm', 250, '고객사'),  // L90
  gb.text('targetTelNo', 120, '휴대폰'),  // L91
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Sms03_Page_UserListAdmin (`client/vi/sms/Sms03_Page_UserListAdmin.java`, 363줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar01`: 고객사: {companyName} 검색: {searchText} {useYn} {retrieveButton} {listButton}
- 툴바 `buttonBar02`: ▼ 문자발송 대상리스트: {sendButton}
- 입력·하위 화면: `companyName` CommonComboBoxField("sys.Sys00_Common.selectCompanyName", "%", "전체"), `searchText` TextField 빈칸="고객사명/사원명/휴대폰/비고", `useYn` CheckBox, `lookup` Sys85_Lookup_ClientInfoList
- 그리드 `grid01` (buildGrid01()):
  - actionCell 40 " " Cell 편집:actionCell
  - companyName 250 "고객사" Text
  - orgName 180 "부서명" Text
  - posName 100 "직위" Text
  - korName 100 "사원명" Text
  - mobileTelNo 120 "휴대폰" Text
- 그리드 `grid02` (buildGrid02()):
  - actionCell 40 " " Cell 편집:actionCell
  - companyName 250 "고객사" Text
  - orgName 180 "부서명" Text
  - posName 100 "직위" Text
  - korName 100 "사원명" Text
  - mobileTelNo 120 "휴대폰" Text

#### 이벤트
[E0] 화면 열림 (생성자 L92-134) → settings(), retrieve()
[E1] companyName[sys.Sys00_Common.selectCompanyName].Collapse (L140) → retrieve()
[E2] searchText.KeyPress [Enter] (L148) → retrieve()
[E3] retrieveButton[조회].Select (L158) → retrieve()
[E4] sendButton[발송].Select (L164) → sendCheck()
       └ [E6] msgBox.DialogHide [YES] (L309) → sendMessage()
[E5] listButton[기타고객사 추가].Select [result != null] (L170) → 인라인 L170-202 (new SelectHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public setGroupSendId() | L70-90 | 공개 메서드 | 상태 처리 | 업무 |
| private buildGrid01() | L205-220 | 필드 초기화 | 상태 처리 | 업무 |
| private buildGrid02() | L222-238 | 필드 초기화 | 상태 처리 | 업무 |
| private addList() | L240-264 | buildGrid01 | 상태 처리 | 업무 |
| private retrieve() | L266-304 | 생성자,E1,E2,E3 | 상태 처리 | 업무 |
| private sendCheck() | L306-325 | E4 | ConfirmBox → E6 | 업무 |
| public sendMessage() | L327-354 | E6 | 서비스 sms.Sms03_GroupSend.sendGroupMessage(companyId, groupSendId) | 업무 |
| private settings() | L136-203 | 생성자 | 조회창 Sys85_Lookup_ClientInfoList 열기, 이벤트 연결, 초기값: companyName="한국펀드서비스(주("sys.Sys00_Common.selectCompanyName"), useYn=true("사용고객만 보기") | UI구성 (이벤트 절로 대체) |
| private setHtmlCheckBoxLabelStyle() | L356-358 | 생성자,settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L360-362 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid01 = () => [
  // ⚠ 대응 없음 (GridBuilder L213) addCell
  gb.text('companyNm', 250, '고객사'),  // L214 SQL 계산 컬럼(selectByCompanyIdPaging: sys01_company_nm)
  gb.text('orgNm', 180, '부서명'),  // L215 SQL 계산 컬럼(selectByCompanyIdPaging: f_get_empTrans(emp01_person_id, f_sysda…)
  gb.text('posNm', 100, '직위'),  // L216 SQL 계산 컬럼(selectByCompanyIdPaging: f_get_empTrans(emp01_person_id, f_sysda…)
  gb.text('korNm', 100, '사원명'),  // L217
  gb.text('mobileTelno', 120, '휴대폰'),  // L218
];

const buildGrid02 = () => [
  // ⚠ 대응 없음 (GridBuilder L231) addCell
  gb.text('companyNm', 250, '고객사'),  // L232 SQL 계산 컬럼(selectByCompanyIdPaging: sys01_company_nm)
  gb.text('orgNm', 180, '부서명'),  // L233 SQL 계산 컬럼(selectByCompanyIdPaging: f_get_empTrans(emp01_person_id, f_sysda…)
  gb.text('posNm', 100, '직위'),  // L234 SQL 계산 컬럼(selectByCompanyIdPaging: f_get_empTrans(emp01_person_id, f_sysda…)
  gb.text('korNm', 100, '사원명'),  // L235
  gb.text('mobileTelno', 120, '휴대폰'),  // L236
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="assign" onClick={() => /* 인라인 L170-202 (new SelectHandler() { @Override publi…) */}>기타고객사 추가</Button>
3. <Button type="send" onClick={sendCheck}>발송</Button>

### Sms03_Edit_GroupSend (`client/vi/sms/Sms03_Edit_GroupSend.java`, 154줄)

- 입력·하위 화면: `title` TextField, `content` MyTextArea, `note` TextField

#### 이벤트
[E0] 화면 열림 (생성자 L48-68) → getEditor()
[E1] updateButton[저장].Select (L62) → update()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private getEditor() | L70-103 | 생성자 | 상태 처리 | 업무 |
| public retrieve() | L105-111 | 공개 메서드 | 상태 처리 | 업무 |
| public update() | L113-144 | E1 | 서비스 sms.Sms03_GroupSend.update | 업무 |
| private setHtmlStyle() | L146-148 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L150-152 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>

