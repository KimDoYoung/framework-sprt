# Tdm50_Tab_DutyProgress

- 종류: 화면
- 메뉴: 책무 > 00. 대시보드 > 책무진행 상태 (#1496)
- 파일: `client/vi/tdm/Tdm50_Tab_DutyProgress.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys99_Print.insertReconTdm` | Tdm50_Tab_DutyProgress:175 | [`Sys99_Print.java:99`](../../sys/services/Sys99_Print.md) | [`sys99_print.insertReconTdm`](../../sys/sql/sys99_print.md) |
| `sys.Sys99_Print.selectByWindowClassName` | Tdm50_Tab_DutyProgress:196 | [`Sys99_Print.java:89`](../../sys/services/Sys99_Print.md) | [`sys99_print.selectByWindowClassName`](../../sys/sql/sys99_print.md) |

## 테이블

[`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_get_company_nm`, `f_recon_tdm`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Tdm50_Tab_DutyProgress (`client/vi/tdm/Tdm50_Tab_DutyProgress.java`, 212줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 기준년월: {quickMoveField} {retrieveButton}
- 입력·하위 화면: `quickMoveField` QuickMoveField
- 그리드 `grid` (buildGrid()):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - string02 130 "직책" TextFrozen 편집:"left"
  - string03 80 "임원" TextFrozen 편집:"center"
  - string04 160 "지원부서" TextFrozen 편집:"left"
  - string05 110 "1454<br>부서담당자" Text
  - string06 110 "1463<br>승인선" Text
  - long01 70 "전체항목" LongNull 편집:"456EA6"
  - long02 70 "작성완료" LongNull 편집:"456EA6"
  - long03 60 "Lock" LongNull 편집:"456EA6"
  - long04 60 "결재" LongNull 편집:"456EA6"
  - long05 60 "미사용" LongNull
  - long06 50 "년간" LongNull
  - long07 50 "반기" LongNull
  - long08 50 "분기" LongNull
  - long09 50 "월" LongNull
  - long10 50 "수시" LongNull
  - long11 60 "특정월" LongNull
  - string07 50 "금월" TextCenter 편집:"DD5E5E"
  - string08 50 "익월" TextCenter 편집:"DD5E5E"
  - long21 50 "1월" LongNull 편집:"456EA6"
  - long22 50 "2월" LongNull 편집:"456EA6"
  - long23 50 "3월" LongNull 편집:"456EA6"
  - long24 50 "4월" LongNull 편집:"456EA6"
  - long25 50 "5월" LongNull 편집:"456EA6"
  - long26 50 "6월" LongNull 편집:"456EA6"
  - long27 50 "7월" LongNull 편집:"456EA6"
  - long28 50 "8월" LongNull 편집:"456EA6"
  - long29 50 "9월" LongNull 편집:"456EA6"
  - long30 50 "10월" LongNull 편집:"456EA6"
  - long31 50 "11월" LongNull 편집:"456EA6"
  - long32 50 "12월" LongNull 편집:"456EA6"
  - long33 70 "1455<br>생성항목" LongNull
  - string11 100 "1456<br>점검자" Text
  - string12 100 "1456<br>승인선" Text
  - string13 100 "1458<br>승인상태" TextStatus
  - string14 100 "1455<br>승인완료" Text
  - string15 100 "1455<br>잠금" Text
  - string16 100 "1455<br>마감" Text
  - string17 100 "1455<br>마감결재" Text

#### 이벤트
[E0] 화면 열림 (생성자 L62-83) → settings()
[E1] retrieveButton[조회].Select (L86) → createData()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public execute() | L42-50 | retrieve | 상태 처리 | 업무 |
| public execute() | L54-56 | retrieve | 상태 처리 | 업무 |
| private changeMonthHeader() | L144-168 | execute,createData | 상태 처리 | 업무 |
| private createData() | L170-188 | E1,execute | 서비스 sys.Sys99_Print.insertReconTdm(windowClassName, baseDate, companyId, groupId) | 업무 |
| private retrieve() | L190-202 | createData | 서비스 sys.Sys99_Print.selectByWindowClassName(windowClassName, baseDate, companyId, groupId) | 업무 |
| private settings() | L85-92 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L94-142 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L204-206 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| public setHtmlGridStyle() | L208-211 | buildGrid,changeMonthHeader | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L96 newHeaderGroupMap06newHeaderGroupConfigsetHtmlGridStyle14 100 "메뉴얼 확정(1424)" (sys99_new_header_group_map06new_header_group_configset_html_grid_style14 컬럼 없음)
  // ⚠DB없음 L97 newHeaderGroupMap010newHeaderGroupConfig17 100 "점검주기별 항목수" (sys99_new_header_group_map010new_header_group_config17 컬럼 없음)
  // ⚠DB없음 L98 newHeaderGroupMap017newHeaderGroupConfigsetHtmlGridStyle12 100 "점검대상 여부" (sys99_new_header_group_map017new_header_group_configset_html_grid_style12 컬럼 없음)
  // ⚠DB없음 L99 newHeaderGroupMap019newHeaderGroupConfigsetHtmlGridStyle112 100 "월별점검항목수" (sys99_new_header_group_map019new_header_group_configset_html_grid_style112 컬럼 없음)
  // ⚠ 대응 없음 (GridBuilder L102) addTextFrozen
  // ⚠ 대응 없음 (GridBuilder L103) addTextFrozen
  // ⚠ 대응 없음 (GridBuilder L104) addTextFrozen
  gb.text('string05', 110, '1454<br>부서담당자'),  // L105
  gb.text('string06', 110, '1463<br>승인선'),  // L106
  // ⚠ 대응 없음 (GridBuilder L107) addLongNull
  // ⚠ 대응 없음 (GridBuilder L108) addLongNull
  // ⚠ 대응 없음 (GridBuilder L109) addLongNull
  // ⚠ 대응 없음 (GridBuilder L110) addLongNull
  // ⚠ 대응 없음 (GridBuilder L111) addLongNull
  // ⚠ 대응 없음 (GridBuilder L112) addLongNull
  // ⚠ 대응 없음 (GridBuilder L113) addLongNull
  // ⚠ 대응 없음 (GridBuilder L114) addLongNull
  // ⚠ 대응 없음 (GridBuilder L115) addLongNull
  // ⚠ 대응 없음 (GridBuilder L116) addLongNull
  // ⚠ 대응 없음 (GridBuilder L117) addLongNull
  gb.textCenter('string07', 50, '금월'),  // L118
  gb.textCenter('string08', 50, '익월'),  // L119
  // ⚠ 대응 없음 (GridBuilder L120) addLongNull
  // ⚠ 대응 없음 (GridBuilder L121) addLongNull
  // ⚠ 대응 없음 (GridBuilder L122) addLongNull
  // ⚠ 대응 없음 (GridBuilder L123) addLongNull
  // ⚠ 대응 없음 (GridBuilder L124) addLongNull
  // ⚠ 대응 없음 (GridBuilder L125) addLongNull
  // ⚠ 대응 없음 (GridBuilder L126) addLongNull
  // ⚠ 대응 없음 (GridBuilder L127) addLongNull
  // ⚠ 대응 없음 (GridBuilder L128) addLongNull
  // ⚠ 대응 없음 (GridBuilder L129) addLongNull
  // ⚠ 대응 없음 (GridBuilder L130) addLongNull
  // ⚠ 대응 없음 (GridBuilder L131) addLongNull
  // ⚠ 대응 없음 (GridBuilder L132) addLongNull
  gb.text('string11', 100, '1456<br>점검자'),  // L133
  gb.text('string12', 100, '1456<br>승인선'),  // L134
  gb.textStatus('string13', 100, '1458<br>승인상태'),  // L135
  gb.text('string14', 100, '1455<br>승인완료'),  // L136
  gb.text('string15', 100, '1455<br>잠금'),  // L137
  gb.text('string16', 100, '1455<br>마감'),  // L138
  gb.text('string17', 100, '1455<br>마감결재'),  // L139
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={createData}>조회</Button>

