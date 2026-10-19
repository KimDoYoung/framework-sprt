# Pay34_Tab_WorkTimeConfig

- 종류: 화면
- 메뉴: 기초자료 > 30. 자산&경영 > 근로시간기준관리 (#1489)
- 파일: `client/vi/pay/Pay34_Tab_WorkTimeConfig.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `pay.Pay34_WorkTimeConfig.delete` | Pay34_Tab_WorkTimeConfig:181 | [`Pay34_WorkTimeConfig.java:49`](../../pay/services/Pay34_WorkTimeConfig.md) | `UpdateDataModel(pay34_work_time_config)` 동적 DELETE |
| `pay.Pay34_WorkTimeConfig.selectByCompanyId` | Pay34_Tab_WorkTimeConfig:135 | [`Pay34_WorkTimeConfig.java:24`](../../pay/services/Pay34_WorkTimeConfig.md) | [`pay34_work_time_config.selectByCompanyId`](../../pay/sql/pay34_work_time_config.md) |
| `pay.Pay34_WorkTimeConfig.update` | Pay34_Tab_WorkTimeConfig:146 | [`Pay34_WorkTimeConfig.java:44`](../../pay/services/Pay34_WorkTimeConfig.md) | `UpdateDataModel(pay34_work_time_config)` 동적 INSERT/UPDATE → [`pay34_work_time_config.selectById`](../../pay/sql/pay34_work_time_config.md) |

## 테이블

[`pay34_work_time_config`](../../../db/tables/pay.md)

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Pay34_Tab_WorkTimeConfig (`client/vi/pay/Pay34_Tab_WorkTimeConfig.java`, 188줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: {retrieveButton} {insertButton} {updateButton} {deleteButton}
- 입력·하위 화면: `startHour` TextField 빈칸="00:00", `endHour` TextField 빈칸="00:00"
- 그리드 `grid` (buildGrid(), 체크박스):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - startDate 100 "적용시작일" Date 편집:MyDateField
  - dayWorkHours 120 "일일<br>법정근로시간<br>(A)" LongCenter 편집:LongField
  - weekMaxAddHours 120 "주 최대<br>추가근로시간" LongCenter 편집:LongField
  - ntStartTime 120 "시작시간(시)" TextCenter 편집:"456EA6"
  - ntEndTime 120 "종료시간(시)" TextCenter 편집:"456EA6"
  - otMultRate 120 "연장" DoubleCenter 편집:DoubleField
  - ntMultRate 120 "야간" DoubleCenter 편집:DoubleField
  - holiStdMultRate 120 "휴일<br>(A)이내" DoubleCenter 편집:DoubleField
  - holiOverMultRate 120 "휴일<br>(A)초과" DoubleCenter 편집:DoubleField

#### 이벤트
[E0] 화면 열림 (생성자 L51-73) → settings(), retrieve()
[E1] retrieveButton[조회].Select (L76) → retrieve()
[E2] insertButton[등록].Select (L82) → insertRow()
[E3] updateButton[저장].Select (L88) → update()
[E4] deleteButton[삭제].Select (L94) → deleteChk()
       └ [E5] msgBox.DialogHide [YES] (L160) → deleteRow()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L130-141 | 생성자,E1 | 서비스 pay.Pay34_WorkTimeConfig.selectByCompanyId(companyId) | 업무 |
| public update() | L144-147 | E3 | 서비스 pay.Pay34_WorkTimeConfig.update | 업무 |
| public insertRow() | L150-155 | E2 | 상태 처리 | 업무 |
| private deleteChk() | L157-175 | E4 | ConfirmBox → E5 | 업무 |
| public deleteRow() | L178-182 | E5 | GridDeleteData pay.Pay34_WorkTimeConfig.delete(체크된 행 목록) | 업무 |
| private settings() | L75-100 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L102-127 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| public setHtmlGridStyle() | L184-187 | buildGrid | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L110 newHeaderGroupMap05newHeaderGroupConfigsetHtmlGridStyle12 100 "야간근로" (pay34_new_header_group_map05new_header_group_configset_html_grid_style12 컬럼 없음)
  // ⚠DB없음 L111 newHeaderGroupMap07newHeaderGroupConfig14 100 "가산 배수" (pay34_new_header_group_map07new_header_group_config14 컬럼 없음)
  gb.date('startDate', 100, '적용시작일', { editor: 'date' }),  // L114
  gb.longCenter('dayWorkHours', 120, '일일<br>법정근로시간<br>(A)', { editor: 'number' }),  // L115
  gb.longCenter('weekMaxAddHours', 120, '주 최대<br>추가근로시간', { editor: 'number' }),  // L116
  gb.textCenter('ntStartTime', 120, '시작시간(시)'),  // L118
  gb.textCenter('ntEndTime', 120, '종료시간(시)'),  // L119
  gb.doubleCenter('otMultRate', 120, '연장', { editor: 'number' }),  // L121
  gb.doubleCenter('ntMultRate', 120, '야간', { editor: 'number' }),  // L122
  gb.doubleCenter('holiStdMultRate', 120, '휴일<br>(A)이내', { editor: 'number' }),  // L123
  gb.doubleCenter('holiOverMultRate', 120, '휴일<br>(A)초과', { editor: 'number' }),  // L124
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={deleteChk}>삭제</Button>

