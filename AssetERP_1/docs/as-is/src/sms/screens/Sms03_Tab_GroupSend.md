# Sms03_Tab_GroupSend

- 종류: 화면
- 메뉴: 커뮤니티 > 90. 기타 > 사원별 문자발송 (#1186)
- 파일: `client/vi/sms/Sms03_Tab_GroupSend.java`
- 함께 쓰는 클래스 2개:
  - `Sms03_Page_UserList` `client/vi/sms/Sms03_Page_UserList.java`
  - `Sms03_Edit_GroupSend` `client/vi/sms/Sms03_Edit_GroupSend.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Emp57_Lookup_List`](../../emp/components/Emp57_Lookup_List.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `emp.Emp00_TransInfo.selectByText` | Sms03_Page_UserList:118 | [`Emp00_TransInfo.java:33`](../../emp/services/Emp00_TransInfo.md) | [`emp00_trans_info.selectByText`](../../emp/sql/emp00_trans_info.md) |
| `sms.Sms03_GroupSend.delete` | Sms03_Tab_GroupSend:168 | [`Sms03_GroupSend.java:167`](../../sms/services/Sms03_GroupSend.md) | `UpdateDataModel(sms03_group_send)` 동적 DELETE |
| `sms.Sms03_GroupSend.selectByCompanyId` | Sms03_Tab_GroupSend:124 | [`Sms03_GroupSend.java:31`](../../sms/services/Sms03_GroupSend.md) | [`sms03_group_send.selectByCompanyId`](../../sms/sql/sms03_group_send.md) |
| `sms.Sms03_GroupSend.sendMessage` | Sms03_Page_UserList:158, Sms03_Page_UserList:208 | [`Sms03_GroupSend.java:62`](../../sms/services/Sms03_GroupSend.md) | [`sms03_group_send.selectById`](../../sms/sql/sms03_group_send.md), [`sys01_company.selectById`](../../sys/sql/sys01_company.md) |
| `sms.Sms03_GroupSend.update` | Sms03_Edit_GroupSend:134 | [`Sms03_GroupSend.java:162`](../../sms/services/Sms03_GroupSend.md) | `UpdateDataModel(sms03_group_send)` 동적 INSERT/UPDATE → [`sms03_group_send.selectById`](../../sms/sql/sms03_group_send.md) |

## 테이블

[`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md), [`emp08_license`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sms03_group_send`](../../../db/tables/sms.md), [`sys01_company`](../../../db/tables/sys.md), [`sys04_role`](../../../db/tables/sys.md), [`sys05_user_role`](../../../db/tables/sys.md), [`sys06_menu`](../../../db/tables/sys.md), [`sys07_role_menu`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_org_parent_info_nm`, `f_sysdate`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sms03_Tab_GroupSend (`client/vi/sms/Sms03_Tab_GroupSend.java`, 170줄)

- 레이아웃: west=vlc, center=hlc
- 툴바 `buttonBar`: {retrieveButton} {insertButton} {deleteButton}
- 입력·하위 화면: `editForm` Sms03_Edit_GroupSend, `userGrid` Sms03_Page_UserList
- 그리드 `grid` (buildGrid()):
  - title 250 "제목" Text
  - startDate 100 "생성일자" Date
  - note 150 "비고" Text

#### 이벤트
[E0] 화면 열림 (생성자 L45-75) → settings(), retrieve()
[E1] retrieveButton[조회].Select (L78) → retrieve()
[E2] insertButton[등록].Select (L84) → insertRow()
[E3] deleteButton[삭제].Select (L90) → deleteCheck()
       └ [E5] msgBox.DialogHide [YES] (L147) → delete()
[E4] grid.SelectionChanged (L98) → 인라인 L98-105 (new SelectionChangedHandler<Sms03_Gro…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L119-133 | 생성자,E1 | 서비스 sms.Sms03_GroupSend.selectByCompanyId(companyId) | 업무 |
| public insertRow() | L135-142 | E2 | 상태 처리 | 업무 |
| private deleteCheck() | L144-163 | E3 | ConfirmBox → E5 | 업무 |
| public delete() | L165-169 | E5 | GridDeleteData sms.Sms03_GroupSend.delete(체크된 행 목록) | 업무 |
| private settings() | L77-106 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L108-117 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('title', 250, '제목'),  // L112
  gb.date('startDate', 100, '생성일자'),  // L113
  gb.text('note', 150, '비고'),  // L114
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="delete" onClick={deleteCheck}>삭제</Button>

### Sms03_Page_UserList (`client/vi/sms/Sms03_Page_UserList.java`, 225줄)

- 툴바 `buttonBar`: {retrieveButton} {sendButton} {groupButton}
- 입력·하위 화면: `lookup` Emp57_Lookup_List
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - orgKorName 160 "조직" Text
  - titleName 100 "직책" Text
  - empNo 80 "사번" Text
  - empKorName 80 "성명" Text

#### 이벤트
[E0] 화면 열림 (생성자 L47-59) → settings(), retrieve()
[E1] retrieveButton[조회].Select (L62) → retrieve()
[E2] sendButton[발송].Select (L68) → sendCheck()
       └ [E5] msgBox.DialogHide [YES] (L179) → sendMessage()
[E3] groupButton[그룹].Select [result != null] (L74) → sendCheck()
[E4] msgBox.DialogHide [YES] (L129) → sendMessage()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public setGroupSendId() | L105-107 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L109-124 | 생성자,E1 | 서비스 emp.Emp00_TransInfo.selectByText(companyId, transDate, transCode, searchText) | 업무 |
| private sendCheck() | L126-145 | E2,E3 | ConfirmBox → E5 | 업무 |
| public sendMessage() | L147-174 | E4,E5 | 미선택 시 alert "보내실 내용을 좌측에서 선택해주세요", 서비스 sms.Sms03_GroupSend.sendMessage(companyId, groupSendId) | 업무 |
| private sendCheck() | L176-195 | E2,E3 | ConfirmBox → E5 | 업무 |
| public sendMessage() | L197-224 | E4,E5 | 서비스 sms.Sms03_GroupSend.sendMessage(companyId, groupSendId) | 업무 |
| private settings() | L61-90 | 생성자 | 조회창 Emp57_Lookup_List 열기, 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L92-103 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('korNm', 160, '조직'),  // L97
  gb.text('titleNm', 100, '직책'),  // L98
  gb.text('empNo', 80, '사번'),  // L99
  gb.text('korNm', 80, '성명'),  // L100
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="send" onClick={sendCheck}>발송</Button>
3. <Button type="group" onClick={sendCheck}>그룹</Button>

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

