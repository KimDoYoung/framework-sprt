# Tdm50_Tab_DutyProgressAdmin

- 종류: 화면
- 메뉴: 기초자료 > 10. 책무 > 책무진행 상태 (#1511)
- 파일: `client/vi/tdm/Tdm50_Tab_DutyProgressAdmin.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Sys01_Lookup_SelectSingle`](../../sys/components/Sys01_Lookup_SelectSingle.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys99_Print.insertReconTdm` | Tdm50_Tab_DutyProgressAdmin:213 | [`Sys99_Print.java:99`](../../sys/services/Sys99_Print.md) | [`sys99_print.insertReconTdm`](../../sys/sql/sys99_print.md) |
| `sys.Sys99_Print.selectByWindowClassName` | Tdm50_Tab_DutyProgressAdmin:235 | [`Sys99_Print.java:89`](../../sys/services/Sys99_Print.md) | [`sys99_print.selectByWindowClassName`](../../sys/sql/sys99_print.md) |

## 테이블

[`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_get_company_nm`, `f_recon_tdm`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Tdm50_Tab_DutyProgressAdmin (`client/vi/tdm/Tdm50_Tab_DutyProgressAdmin.java`, 251줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 기준년월: {quickMoveField} 고객사: {companyName} {retrieveButton}
- 입력·하위 화면: `quickMoveField` QuickMoveField, `companyName` LookupTriggerField, `lookup` Sys01_Lookup_SelectSingle
- 그리드 `grid` (buildGrid()):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - string01 130 "회사" TextFrozen 편집:"left"
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
[E0] 화면 열림 (생성자 L71-94) → settings()
[E1] retrieveButton[조회].Select (L97) → createData()
[E2] companyName.TriggerClick [result != null] (L111) → execute(), createData()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public execute() | L45-53 | E2,retrieve | 상태 처리 | 업무 |
| public execute() | L57-59 | E2,retrieve | 상태 처리 | 업무 |
| private changeMonthHeader() | L182-206 | execute,createData | 상태 처리 | 업무 |
| private createData() | L208-227 | E1,E2,execute | 서비스 sys.Sys99_Print.insertReconTdm(windowClassName, baseDate, companyId, groupId) | 업무 |
| private retrieve() | L229-241 | createData | 서비스 sys.Sys99_Print.selectByWindowClassName(windowClassName, baseDate, companyId, groupId) | 업무 |
| private settings() | L96-129 | 생성자 | 조회창 Sys01_Lookup_SelectSingle 열기, 이벤트 연결, 초기값: companyName="선택해주세요" | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L131-180 | 공개 메서드 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L243-245 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| public setHtmlGridStyle() | L247-250 | buildGrid,changeMonthHeader | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L133 newHeaderGroupMap07newHeaderGroupConfigsetHtmlGridStyle14 100 "메뉴얼 확정(1424)" (sys99_new_header_group_map07new_header_group_configset_html_grid_style14 컬럼 없음)
  // ⚠DB없음 L134 newHeaderGroupMap011newHeaderGroupConfig17 100 "점검주기별 항목수" (sys99_new_header_group_map011new_header_group_config17 컬럼 없음)
  // ⚠DB없음 L135 newHeaderGroupMap018newHeaderGroupConfigsetHtmlGridStyle12 100 "점검대상 여부" (sys99_new_header_group_map018new_header_group_configset_html_grid_style12 컬럼 없음)
  // ⚠DB없음 L136 newHeaderGroupMap020newHeaderGroupConfigsetHtmlGridStyle112 100 "월별점검항목수" (sys99_new_header_group_map020new_header_group_configset_html_grid_style112 컬럼 없음)
  // ⚠ 대응 없음 (GridBuilder L139) addTextFrozen
  // ⚠ 대응 없음 (GridBuilder L140) addTextFrozen
  // ⚠ 대응 없음 (GridBuilder L141) addTextFrozen
  // ⚠ 대응 없음 (GridBuilder L142) addTextFrozen
  gb.text('string05', 110, '1454<br>부서담당자'),  // L143
  gb.text('string06', 110, '1463<br>승인선'),  // L144
  // ⚠ 대응 없음 (GridBuilder L145) addLongNull
  // ⚠ 대응 없음 (GridBuilder L146) addLongNull
  // ⚠ 대응 없음 (GridBuilder L147) addLongNull
  // ⚠ 대응 없음 (GridBuilder L148) addLongNull
  // ⚠ 대응 없음 (GridBuilder L149) addLongNull
  // ⚠ 대응 없음 (GridBuilder L150) addLongNull
  // ⚠ 대응 없음 (GridBuilder L151) addLongNull
  // ⚠ 대응 없음 (GridBuilder L152) addLongNull
  // ⚠ 대응 없음 (GridBuilder L153) addLongNull
  // ⚠ 대응 없음 (GridBuilder L154) addLongNull
  // ⚠ 대응 없음 (GridBuilder L155) addLongNull
  gb.textCenter('string07', 50, '금월'),  // L156
  gb.textCenter('string08', 50, '익월'),  // L157
  // ⚠ 대응 없음 (GridBuilder L158) addLongNull
  // ⚠ 대응 없음 (GridBuilder L159) addLongNull
  // ⚠ 대응 없음 (GridBuilder L160) addLongNull
  // ⚠ 대응 없음 (GridBuilder L161) addLongNull
  // ⚠ 대응 없음 (GridBuilder L162) addLongNull
  // ⚠ 대응 없음 (GridBuilder L163) addLongNull
  // ⚠ 대응 없음 (GridBuilder L164) addLongNull
  // ⚠ 대응 없음 (GridBuilder L165) addLongNull
  // ⚠ 대응 없음 (GridBuilder L166) addLongNull
  // ⚠ 대응 없음 (GridBuilder L167) addLongNull
  // ⚠ 대응 없음 (GridBuilder L168) addLongNull
  // ⚠ 대응 없음 (GridBuilder L169) addLongNull
  // ⚠ 대응 없음 (GridBuilder L170) addLongNull
  gb.text('string11', 100, '1456<br>점검자'),  // L171
  gb.text('string12', 100, '1456<br>승인선'),  // L172
  gb.textStatus('string13', 100, '1458<br>승인상태'),  // L173
  gb.text('string14', 100, '1455<br>승인완료'),  // L174
  gb.text('string15', 100, '1455<br>잠금'),  // L175
  gb.text('string16', 100, '1455<br>마감'),  // L176
  gb.text('string17', 100, '1455<br>마감결재'),  // L177
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={createData}>조회</Button>

