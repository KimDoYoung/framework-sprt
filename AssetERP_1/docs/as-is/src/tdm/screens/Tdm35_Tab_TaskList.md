# Tdm35_Tab_TaskList

- 종류: 화면
- 메뉴: 책무 > 90. 책무관리현황 > 책무조회 (#1467)
- 파일: `client/vi/tdm/Tdm35_Tab_TaskList.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `tdm.Tdm35_RoleAllcTask.selectByDate` | Tdm35_Tab_TaskList:169 | [`Tdm35_RoleAllcTask.java:35`](../../tdm/services/Tdm35_RoleAllcTask.md) | [`tdm35_role_allc_task.selectByDate`](../../tdm/sql/tdm35_role_allc_task.md) |

## 테이블

[`tdm20_role`](../../../db/tables/tdm.md), [`tdm35_role_allc_task`](../../../db/tables/tdm.md)

## DB 함수

`getperson`, `gettdm30roleallc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Tdm35_Tab_TaskList (`client/vi/tdm/Tdm35_Tab_TaskList.java`, 289줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 기준일: {stdDate}
- 입력·하위 화면: `stdDate` MyDateField, `searchText` TextField 빈칸="직책/임원/책무"
- 그리드 `grid` (buildGrid(), 체크박스):
  - roleName 130 "직책" Text
  - personName 75 "임원" TextCenter
  - roleAllcDate 100 "책무배분일" Date
  - taskName 270 "책무" TextArea
  - taskRelateDetailName 350 "책무세부" TextArea
  - taskRelateDutySeq 35 "순번" LongCenter
  - taskRelateDutyName 520 "관리의무" TextArea

#### 이벤트
[E0] 화면 열림 (생성자 L57-103) → settings(), retrieve()
[E1] searchText.KeyPress [Enter] (L111) → retrieve()
[E2] retrieveButton[조회].Select (L120) → retrieve()
[E3] download01Button[엑셀다운로드].Select (L126) → createRdExcel01()
[E4] download02Button[엑셀다운로드].Select (L132) → createRdExcel02()
[E5] download03Button[엑셀다운로드].Select (L138) → createRdExcel03()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L161-178 | 생성자,E1,E2 | 서비스 tdm.Tdm35_RoleAllcTask.selectByDate(companyId, stdDate, searchText) | 업무 |
| private createRdExcel01() | L180-212 | E3 | 상태 처리 | 업무 |
| private createRdExcel02() | L214-246 | E4 | 상태 처리 | 업무 |
| private createRdExcel03() | L248-280 | E5 | 상태 처리 | 업무 |
| private getStdDateString() | L282-284 | createRdExcel01,createRdExcel02,createRdExcel03 | 상태 처리 | 업무 |
| private settings() | L105-144 | 생성자 | 이벤트 연결, 초기값: stdDate=LoginUser.getToday( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L146-159 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L286-288 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('roleNm', 130, '직책'),  // L150 SQL 계산 컬럼(selectByDate: tdm20_role_nm)
  gb.textCenter('personNm', 75, '임원'),  // L151 SQL 계산 컬럼(selectByDate: emp00_kor_nm)
  gb.date('roleAllcDate', 100, '책무배분일'),  // L152 SQL 계산 컬럼(selectByDate: tdm30_role_allc_date)
  gb.textArea('taskNm', 270, '책무'),  // L153
  gb.textArea('taskRelateDetailNm', 350, '책무세부'),  // L154
  gb.longCenter('taskRelateDutySeq', 35, '순번'),  // L155
  gb.textArea('taskRelateDutyNm', 520, '관리의무'),  // L156
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="download" onClick={createRdExcel01}>엑셀다운로드</Button>
3. <Button type="download" onClick={createRdExcel02}>엑셀다운로드</Button>
4. <Button type="download" onClick={createRdExcel03}>엑셀다운로드</Button>

