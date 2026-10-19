# Sys86_Tab_Websocket

- 종류: 화면
- 메뉴: 관리자 > 01. 고객관리 > 로그아웃 알림 관리 (#1404)
- 파일: `client/vi/sys/Sys86_Tab_Websocket.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `emp.Emp01_Person.selectByLoginUserPaging` | Sys86_Tab_Websocket:96 | [`Emp01_Person.java:69`](../../emp/services/Emp01_Person.md) | [`emp01_person.selectByLoginUserPaging`](../../emp/sql/emp01_person.md), [`emp01_person.selectByLoginUserTotal`](../../emp/sql/emp01_person.md) |
| `sys.Sys00_Common.selectCompanyName` | Sys86_Tab_Websocket:50 | [`Sys00_Common.java:41`](../../sys/services/Sys00_Common.md) | [`sys00_common.selectCompanyName`](../../sys/sql/sys00_common.md) |

## 테이블

[`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`sys01_company`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md)

## DB 함수

`f_get_emptrans`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sys86_Tab_Websocket (`client/vi/sys/Sys86_Tab_Websocket.java`, 451줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 고객사: {companyName} 검색: {searchText} {retrieveButton} {sendButton} {sendAllButton} {forceLogoutButton} {forceLogoutAllButton} {timerLabel}
- 입력·하위 화면: `companyName` CommonComboBoxField("sys.Sys00_Common.selectCompanyName", "%", "전체"), `searchText` TextField 빈칸="고객사명/사원명/휴대폰"
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - companyName 300 "고객사" Text
  - korName 100 "사원명" TextCenter
  - empNo 150 "사번" TextCenter
  - posName 100 "직위" TextCenter
  - officeTelNo 120 "사무실" Text
  - mobileTelNo 120 "휴대폰" Text

#### 이벤트
[E0] 화면 열림 (생성자 L65-114) → settings(), retrieve()
[E1] searchText.KeyPress [Enter] (L124) → retrieve()
[E2] companyName[sys.Sys00_Common.selectCompanyName].Collapse (L132) → retrieve()
[E3] retrieveButton[조회].Select (L138) → retrieve()
[E4] sendButton[개별전송].Select [list.size() == 0] (L144) → sendMessage(), startTimer()
[E5] sendAllButton[전체전송].Select [result != null] (L166) → sendMessageAll(), startTimer()
[E6] forceLogoutButton[개별로그아웃].Select [YES] (L182) → sendForceLogout()
[E7] msgBox.DialogHide [YES] (L192) → sendForceLogout()
[E8] forceLogoutAllButton[전체로그아웃].Select [YES] (L211) → sendForceLogoutAll()
[E9] msgBox.DialogHide [YES] (L216) → sendForceLogoutAll()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieve() | L250-277 | 생성자,E1,E2,E3 | 상태 처리 | 업무 |
| private startTimer() | L279-299 | E4,E5 | 상태 처리 | 업무 |
| public sendMessage() | L301-335 | E4 | 상태 처리 | 업무 |
| public sendMessageAll() | L337-346 | E5 | 상태 처리 | 업무 |
| public sendForceLogout() | L348-382 | E6,E7 | 상태 처리 | 업무 |
| public sendForceLogoutAll() | L384-392 | E8,E9 | 상태 처리 | 업무 |
| private settings() | L116-234 | 생성자 | 확인창 표시, 이벤트 연결, 초기값: companyName="전체"("sys.Sys00_Common.selectCompanyName") | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L236-248 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L394-396 | 미사용 후보 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L398-400 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| public setHtmlCheckBoxStyle() | L402-404 | 공개 메서드 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L406-408 | startTimer,필드 초기화 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L410-412 | 미사용 후보 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('companyNm', 300, '고객사'),  // L239 SQL 계산 컬럼(selectByLoginUserPaging: sys01_company_nm)
  gb.textCenter('korNm', 100, '사원명'),  // L240
  gb.textCenter('empNo', 150, '사번'),  // L241
  gb.textCenter('posNm', 100, '직위'),  // L242 SQL 계산 컬럼(selectByLoginUserPaging: f_get_empTrans(emp01_person_id, f_sysda…)
  gb.text('officeTelno', 120, '사무실'),  // L244
  gb.text('mobileTelno', 120, '휴대폰'),  // L245
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="send" onClick={() => /* sendMessage(), startTimer() */}>개별전송</Button>
3. <Button type="send" onClick={() => /* sendMessageAll(), startTimer() */}>전체전송</Button>
4. <Button type="cancel" onClick={sendForceLogout}>개별로그아웃</Button>
5. <Button type="cancel" onClick={sendForceLogoutAll}>전체로그아웃</Button>

