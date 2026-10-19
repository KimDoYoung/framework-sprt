# Sys92_Tab_ManagementTeam

- 종류: 화면
- 메뉴: 커뮤니티 > 91. AssetERP > AssetERP 관리팀 (#1303)
- 메뉴: 관리자 > 09. 기타 > AssetERP 관리팀 등록 (#1304)
- 파일: `client/vi/sys/Sys92_Tab_ManagementTeam.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Emp00_Lookup_SelectSingle`](../../emp/components/Emp00_Lookup_SelectSingle.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys92_ManagementTeam.delete` | Sys92_Tab_ManagementTeam:210 | [`Sys92_ManagementTeam.java:33`](../../sys/services/Sys92_ManagementTeam.md) | `UpdateDataModel(sys92_management_team)` 동적 DELETE |
| `sys.Sys92_ManagementTeam.selectByAll` | Sys92_Tab_ManagementTeam:164 | [`Sys92_ManagementTeam.java:22`](../../sys/services/Sys92_ManagementTeam.md) | [`sys92_management_team.selectByAll`](../../sys/sql/sys92_management_team.md) |
| `sys.Sys92_ManagementTeam.update` | Sys92_Tab_ManagementTeam:175 | [`Sys92_ManagementTeam.java:28`](../../sys/services/Sys92_ManagementTeam.md) | `UpdateDataModel(sys92_management_team)` 동적 INSERT/UPDATE → [`sys92_management_team.selectById`](../../sys/sql/sys92_management_team.md) |

## 테이블

[`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`org00_org_info`](../../../db/views.md), [`sys92_management_team`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sys92_Tab_ManagementTeam (`client/vi/sys/Sys92_Tab_ManagementTeam.java`, 212줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: {retrieveButton} {insertButton} {updateButton} {deleteButton}
- 입력·하위 화면: `lookupEmpInfo` LookupTriggerField, `lookupEmpTransInfo` Emp00_Lookup_SelectSingle
- 그리드 `grid` (buildGrid()):
  - posName 100 "직위" TextCenter
  - personName 100 "성명" TextCenter 편집:lookupEmpInfo
  - chargePart 300 "현재 담당 업무" TextArea 편집:MyTextArea
  - officeTelNo 150 "내선번호" TextCenter
  - emailAddress 200 "이메일" Text
  - workYear 120 "관련업무<br>근속년수" TextCenter 편집:TextField
  - mainCareer 550 "주요경력" TextArea 편집:MyTextArea
  - posName 100 "직위" TextCenter
  - personName 100 "성명" TextCenter
  - chargePart 300 "현재 담당 업무" TextArea
  - officeTelNo 150 "내선번호" TextCenter
  - emailAddress 200 "이메일" Text
  - workYear 120 "관련업무<br>근속년수" TextCenter
  - mainCareer 550 "주요경력" TextArea

#### 이벤트
[E0] 화면 열림 (생성자 L51-74) → settings(), retrieve()
[E1] retrieveButton[조회].Select (L77) → retrieve()
[E2] insertButton[등록].Select (L83) → insertRow()
[E3] updateButton[저장].Select (L89) → update()
[E4] deleteButton[삭제].Select (L95) → deleteChk()
       └ [E6] msgBox.DialogHide [YES] (L189) → deleteRow()
[E5] lookupEmpInfo.TriggerClick (L118) → 인라인 L118-136 (new TriggerClickHandler(){ @Override …)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L161-170 | 생성자,E1 | 서비스 sys.Sys92_ManagementTeam.selectByAll | 업무 |
| public update() | L173-176 | E3 | 서비스 sys.Sys92_ManagementTeam.update | 업무 |
| public insertRow() | L179-184 | E2 | 상태 처리 | 업무 |
| private deleteChk() | L186-204 | E4 | ConfirmBox → E6 | 업무 |
| public deleteRow() | L207-211 | E6 | GridDeleteData sys.Sys92_ManagementTeam.delete(체크된 행 목록) | 업무 |
| private settings() | L76-113 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L115-158 | 필드 초기화 | 조회창 Emp00_Lookup_SelectSingle 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('posNm', 100, '직위'),  // L140 SQL 계산 컬럼(selectByAll: emp.emp01_pos_nm)
  gb.textCenter('personNm', 100, '성명'),  // L141 SQL 계산 컬럼(selectByAll: emp.emp01_kor_nm)
  gb.textArea('chargePart', 300, '현재 담당 업무', { editor: 'largeText' }),  // L142
  gb.textCenter('officeTelno', 150, '내선번호'),  // L143 SQL 계산 컬럼(selectByAll: emp.emp01_office_telno)
  gb.text('emailAddr', 200, '이메일'),  // L144 SQL 계산 컬럼(selectByAll: emp.emp01_email_addr)
  gb.textCenter('workYear', 120, '관련업무<br>근속년수', { editor: 'text' }),  // L145
  gb.textArea('mainCareer', 550, '주요경력', { editor: 'largeText' }),  // L146
  gb.textCenter('posNm', 100, '직위'),  // L148 SQL 계산 컬럼(selectByAll: emp.emp01_pos_nm)
  gb.textCenter('personNm', 100, '성명'),  // L149 SQL 계산 컬럼(selectByAll: emp.emp01_kor_nm)
  gb.textArea('chargePart', 300, '현재 담당 업무'),  // L150
  gb.textCenter('officeTelno', 150, '내선번호'),  // L151 SQL 계산 컬럼(selectByAll: emp.emp01_office_telno)
  gb.text('emailAddr', 200, '이메일'),  // L152 SQL 계산 컬럼(selectByAll: emp.emp01_email_addr)
  gb.textCenter('workYear', 120, '관련업무<br>근속년수'),  // L153
  gb.textArea('mainCareer', 550, '주요경력'),  // L154
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={deleteChk}>삭제</Button>

