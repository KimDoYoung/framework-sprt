# Rpt03_Tab_WeekWrite

- 종류: 화면
- 메뉴: 커뮤니티 > 04. 업무보고 > 주간업무보고 (#1354)
- 파일: `client/vi/rpt/Rpt03_Tab_WeekWrite.java`
- 함께 쓰는 클래스 4개:
  - `Rpt03_Page_WeekWrite` `client/vi/rpt/Rpt03_Page_WeekWrite.java`
  - `Rpt03_Lookup_WeekWrite` `client/vi/rpt/Rpt03_Lookup_WeekWrite.java`
  - `Rpt05_Lookup_WeekBizClass` `client/vi/rpt/Rpt05_Lookup_WeekBizClass.java`
  - `Rpt03_Lookup_Rd_WeekWrite` `client/vi/rpt/Rpt03_Lookup_Rd_WeekWrite.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Sys09_Lookup_Code`](../../sys/components/Sys09_Lookup_Code.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `rpt.Rpt03_Week.boldUpdate` | Rpt03_Tab_WeekWrite:674 | [`Rpt03_Week.java:187`](../../rpt/services/Rpt03_Week.md) | [`rpt03_week.boldUpdate`](../../rpt/sql/rpt03_week.md), [`rpt03_week.selectById`](../../rpt/sql/rpt03_week.md) |
| `rpt.Rpt03_Week.delete` | Rpt03_Page_WeekWrite:165, Rpt03_Tab_WeekWrite:496 | [`Rpt03_Week.java:209`](../../rpt/services/Rpt03_Week.md) | `UpdateDataModel(rpt03_week)` 동적 DELETE |
| `rpt.Rpt03_Week.getBeforeWeek` | Rpt03_Tab_WeekWrite:522 | [`Rpt03_Week.java:56`](../../rpt/services/Rpt03_Week.md) | [`rpt03_week.getBeforeWeek`](../../rpt/sql/rpt03_week.md) |
| `rpt.Rpt03_Week.getLastWeek` | Rpt03_Tab_WeekWrite:208 | [`Rpt03_Week.java:66`](../../rpt/services/Rpt03_Week.md) | [`rpt03_week.getLastWeek`](../../rpt/sql/rpt03_week.md) |
| `rpt.Rpt03_Week.getWeekDays` | Rpt03_Tab_WeekWrite:578 | [`Rpt03_Week.java:161`](../../rpt/services/Rpt03_Week.md) | - |
| `rpt.Rpt03_Week.inUpdateData` | Rpt03_Tab_WeekWrite:422 | [`Rpt03_Week.java:115`](../../rpt/services/Rpt03_Week.md) | [`rpt03_week.modelUpsert`](../../rpt/sql/rpt03_week.md) |
| `rpt.Rpt03_Week.insertBeforeWeek` | Rpt03_Tab_WeekWrite:561 | [`Rpt03_Week.java:91`](../../rpt/services/Rpt03_Week.md) | [`rpt03_week.insertBeforeWeek`](../../rpt/sql/rpt03_week.md) |
| `rpt.Rpt03_Week.modelUpsert` | Rpt03_Lookup_WeekWrite:182 | [`Rpt03_Week.java:110`](../../rpt/services/Rpt03_Week.md) | [`rpt03_week.modelUpsert`](../../rpt/sql/rpt03_week.md) |
| `rpt.Rpt03_Week.selectByStartDate` | Rpt03_Page_WeekWrite:170, Rpt03_Tab_WeekWrite:691 | [`Rpt03_Week.java:33`](../../rpt/services/Rpt03_Week.md) | [`rpt03_week.selectByStartDate`](../../rpt/sql/rpt03_week.md) |
| `rpt.Rpt03_Week.update` | Rpt03_Page_WeekWrite:138 | [`Rpt03_Week.java:204`](../../rpt/services/Rpt03_Week.md) | `UpdateDataModel(rpt03_week)` 동적 INSERT/UPDATE → [`rpt03_week.selectById`](../../rpt/sql/rpt03_week.md) |
| `rpt.Rpt03_Week.updateFixYn` | Rpt03_Tab_WeekWrite:620 | [`Rpt03_Week.java:138`](../../rpt/services/Rpt03_Week.md) | [`rpt03_week.modelUpsert`](../../rpt/sql/rpt03_week.md) |
| `rpt.Rpt04_WeekConfirm.selectByCompanyId` | Rpt03_Page_WeekWrite:200, Rpt03_Tab_WeekWrite:365, Rpt03_Tab_WeekWrite:721 | [`Rpt04_WeekConfirm.java:25`](../../rpt/services/Rpt04_WeekConfirm.md) | [`rpt04_week_confirm.selectByCompanyId`](../../rpt/sql/rpt04_week_confirm.md) |
| `rpt.Rpt05_WeekBizClass.selectByPersonId` | Rpt05_Lookup_WeekBizClass:117 | [`Rpt05_WeekBizClass.java:21`](../../rpt/services/Rpt05_WeekBizClass.md) | [`rpt05_week_biz_class.selectByPersonId`](../../rpt/sql/rpt05_week_biz_class.md) |
| `rpt.Rpt05_WeekBizClass.upsert` | Rpt05_Lookup_WeekBizClass:127 | [`Rpt05_WeekBizClass.java:26`](../../rpt/services/Rpt05_WeekBizClass.md) | [`rpt05_week_biz_class.upsert`](../../rpt/sql/rpt05_week_biz_class.md) |
| `sys.Sys00_Common.selectWeekBizClass` | Rpt03_Lookup_WeekWrite:101 | [`Sys00_Common.java:176`](../../sys/services/Sys00_Common.md) | [`sys09_code.selectWeekBizClass`](../../sys/sql/sys09_code.md) |
| `sys.Sys00_Common.selectWeekListByMonth` | Rpt03_Tab_WeekWrite:135 | [`Sys00_Common.java:186`](../../sys/services/Sys00_Common.md) | - |
| `sys.Sys99_Print.insertRdWeekWrite` | Rpt03_Tab_WeekWrite:232 | [`Sys99_Print.java:3844`](../../sys/services/Sys99_Print.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`rpt03_week.selectByLastStartDate`](../../rpt/sql/rpt03_week.md), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |

## 테이블

[`rpt03_week`](../../../db/tables/rpt.md), [`rpt04_week_confirm`](../../../db/tables/rpt.md), [`rpt05_week_biz_class`](../../../db/tables/rpt.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_create_seq`, `f_emp_kor_nm`, `f_get_emptrans`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Rpt03_Tab_WeekWrite (`client/vi/rpt/Rpt03_Tab_WeekWrite.java`, 754줄)

- 레이아웃: center=vlc, south=weekWritePage
- 툴바 `buttonBar`: 보고주간: {yyyyText} {monthComboBox} {weekComboBox} {retrieveButton} {lastWeekGetButton} {insertButton} {downLoadButton} {fixButton} {cancleButton} {confirmPerson}
- 입력·하위 화면: `yyyyText` TextField, `monthComboBox` ComboBoxField("MonthsCode"), `weekWritePage` Rpt03_Page_WeekWrite, `weekComboBox` CommonComboBoxField("sys.Sys00_Common.selectWeekListByMonth"), `lookupRdWeekWrite` Rpt03_Lookup_Rd_WeekWrite, `popup` Rpt03_Lookup_WeekWrite
- 그리드 `grid` (buildGrid(), 행번호숨김):
  - bizTypeName 150 "구분" TextFixCenter
  - htmlContent 500 "업무내용" TextAreaHtml
  - dueDate 150 "완료예정일 및 진행상태" Text
  - actionCell 60 "수정" Cell 편집:editCell
  - actionCell 40 " " Cell 편집:upButton
  - actionCell 40 " " Cell 편집:downButton
  - actionCell 40 "삭제" Cell 편집:deleteButton
  - bold 60 "굵게" Boolean
  - note 450 "비고" TextArea
  - fixYnStr 60 "제출여부" TextFixCenter

#### 이벤트
[E0] 화면 열림 (생성자 L81-117) → settings(), getWeekDays()
[E1] monthComboBox[MonthsCode].Collapse (L137) → 인라인 L137-148 (new CollapseHandler() { @Override pub…)
[E2] weekComboBox[sys.Sys00_Common.selectWeekListByMonth].Collapse (L151) → retrieve()
[E3] retrieveButton[조회].Select (L163) → retrieve()
[E4] insertButton[등록].Select (L169) → fixCheck(), insertRow()
[E5] lastWeekGetButton[직전 보고내용 가져오기].Select (L176) → fixCheck(), lastWeekCheck()
       └ [E11] msgBox.DialogHide [YES] (L539) → insertBeforeWeek()
[E6] fixButton[제출].Select (L183) → confirmCheck(), updateFix()
[E7] cancleButton[제출취소].Select (L190) → confirmCheck(), updateFix()
[E8] downLoadButton[출력/다운로드].Select (L198) → 서비스 rpt.Rpt03_Week.getLastWeek, sys.Sys99_Print.insertRdWeekWrite(companyId, personId, startDate, companyId, personId, windowClassName, startDate, lastStartDate), 메시지 "현재 주차의 데이터가 없습니다."
[E9] grid.getStore().StoreRecordChange (L271) → fixCheck(), boldSetting()
[E10] msgBox.DialogHide [YES] (L475) → delete()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieve() | L328-344 | E2,E3,insertRow,insertBeforeWeek,getWeekDays,updateFix,dataEdit,fixCheck | 서비스 rpt.Rpt03_Week.selectByStartDate(companyId, personId, startDate, closeDate, weekBizTypeCode) | 업무 |
| private retrieve() | L346-362 | E2,E3,insertRow,insertBeforeWeek,getWeekDays,updateFix,dataEdit,fixCheck | 서비스 rpt.Rpt03_Week.selectByStartDate(companyId, personId, startDate, closeDate, weekBizTypeCode) | 업무 |
| private confirmRetrieve() | L364-387 | retrieve,confirmCheck | 서비스 rpt.Rpt04_WeekConfirm.selectByCompanyId(companyId, personId, startDate) | 업무 |
| private insertRow() | L389-404 | E4 | 조회창 Rpt03_Lookup_WeekWrite 열기 | 업무 |
| private update() | L406-433 | changeRow | 서비스 rpt.Rpt03_Week.inUpdateData | 업무 |
| private changeRow() | L435-470 | buildGrid | 상태 처리 | 업무 |
| private deleteChk() | L472-491 | changeRow | 확인창 표시 | 업무 |
| private delete() | L493-497 | E10 | GridDeleteData rpt.Rpt03_Week.delete(체크된 행 목록) | 업무 |
| private getSeq() | L499-505 | changeRow | 상태 처리 | 업무 |
| private lastWeekCheck() | L507-558 | E5 | ConfirmBox → E11 | 업무 |
| private insertBeforeWeek() | L560-575 | E11 | 서비스 rpt.Rpt03_Week.insertBeforeWeek(companyId, personId, startDate, closeDate, beforeStartDate) | 업무 |
| private getWeekDays() | L577-603 | 생성자 | 서비스 rpt.Rpt03_Week.getWeekDays(toDay) | 업무 |
| private updateFix() | L605-638 | E6,E7 | 서비스 rpt.Rpt03_Week.updateFixYn(fixYn) | 업무 |
| private dataEdit() | L640-649 | buildGrid | 조회창 Rpt03_Lookup_WeekWrite 열기 | 업무 |
| private boldSetting() | L651-687 | E9 | 서비스 rpt.Rpt03_Week.boldUpdate(weekId, bold) | 업무 |
| private fixCheck() | L689-717 | E4,E5,E9,buildGrid | 서비스 rpt.Rpt03_Week.selectByStartDate(companyId, personId, startDate, closeDate, weekBizTypeCode) | 업무 |
| private confirmCheck() | L719-745 | E6,E7,fixCheck | 서비스 rpt.Rpt04_WeekConfirm.selectByCompanyId(companyId, personId, startDate) | 업무 |
| private settings() | L119-278 | 생성자 | 조회창 Rpt03_Lookup_Rd_WeekWrite 열기, 서비스 sys.Sys00_Common.selectWeekListByMonth, rpt.Rpt03_Week.getLastWeek, sys.Sys99_Print.insertRdWeekWrite(companyId, personId, startDate, companyId, personId, windowClassName, startDate, lastStartDate), 이벤트 연결, 초기값: yyyyText=startYear | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L280-326 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L747-749 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L751-753 | confirmRetrieve | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L314) addTextFixCenter
  // ⚠ 대응 없음 (GridBuilder L315) addTextAreaHtml
  gb.text('dueDate', 150, '완료예정일 및 진행상태'),  // L316
  // ⚠ 대응 없음 (GridBuilder L317) addCell
  // ⚠ 대응 없음 (GridBuilder L318) addCell
  // ⚠ 대응 없음 (GridBuilder L319) addCell
  // ⚠ 대응 없음 (GridBuilder L320) addCell
  gb.boolean('bold', 60, '굵게'),  // L321
  gb.textArea('note', 450, '비고'),  // L322
  // ⚠ 대응 없음 (GridBuilder L323) addTextFixCenter
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={() => /* fixCheck(), lastWeekCheck() */}>직전 보고내용 가져오기</Button>
3. <Button type="register" onClick={() => /* fixCheck(), insertRow() */}>등록</Button>
4. <Button type="download" onClick={() => /* 서비스 rpt.Rpt03_Week.getLastWeek, sys.Sys99_Print.insertRdWeekWrite(companyId, personId, startDate, companyId, personId, windowClassName, startDate, lastStartDate), 메시지 "현재 주차의 데이터가 없습니다." */}>출력/다운로드</Button>
5. <Button type="save" onClick={() => /* confirmCheck(), updateFix() */}>제출</Button>
6. <Button type="cancel" onClick={() => /* confirmCheck(), updateFix() */}>제출취소</Button>

### Rpt03_Page_WeekWrite (`client/vi/rpt/Rpt03_Page_WeekWrite.java`, 226줄)

- 툴바 `buttonBar`: {insertButton} {updateButton} {deleteButton}
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - seq 60 "순번" LongCenter 편집:LongField
  - content 1500 "건의사항 및 기타 요청사항 기재" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L53-67) → settings()
[E1] insertButton[등록].Select (L70) → fixCheck(), insert()
[E2] updateButton[저장].Select (L77) → fixCheck(), update()
[E3] deleteButton[삭제].Select (L84) → fixCheck(), deleteChk()
       └ [E4] msgBox.DialogHide [YES] (L144) → delete()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L102-120 | fixCheck,confirmCheck | 서비스 rpt.Rpt03_Week.selectByStartDate(companyId, personId, startDate, closeDate, weekBizTypeCode) | 업무 |
| private insert() | L122-133 | E1 | 상태 처리 | 업무 |
| private update() | L136-139 | E2 | 서비스 rpt.Rpt03_Week.update | 업무 |
| private deleteChk() | L141-160 | E3 | ConfirmBox → E4 | 업무 |
| private delete() | L162-166 | E4 | GridDeleteData rpt.Rpt03_Week.delete(체크된 행 목록) | 업무 |
| private fixCheck() | L168-196 | E1,E2,E3 | 서비스 rpt.Rpt03_Week.selectByStartDate(companyId, personId, startDate, closeDate, weekBizTypeCode) | 업무 |
| private confirmCheck() | L198-224 | fixCheck | 서비스 rpt.Rpt04_WeekConfirm.selectByCompanyId(companyId, personId, startDate) | 업무 |
| private settings() | L69-91 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L93-100 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.longCenter('seq', 60, '순번', { editor: 'number' }),  // L96
  gb.text('content', 1500, '건의사항 및 기타 요청사항 기재', { editor: 'text' }),  // L97
];
```

#### 사용된 버튼들
1. <Button type="register" onClick={() => /* fixCheck(), insert() */}>등록</Button>
2. <Button type="save" onClick={() => /* fixCheck(), update() */}>저장</Button>
3. <Button type="delete" onClick={() => /* fixCheck(), deleteChk() */}>삭제</Button>

### Rpt03_Lookup_WeekWrite (`client/vi/rpt/Rpt03_Lookup_WeekWrite.java`, 216줄)

- 입력·하위 화면: `bizType` TextField, `content` TextArea, `note` TextArea, `dueDate` TextField, `bold` CheckBox, `bizTypeComboBox` CommonComboBoxField("sys.Sys00_Common.selectWeekBizClass") 빈칸="선택", `lookup` Rpt05_Lookup_WeekBizClass

#### 이벤트
[E0] 화면 열림 (생성자 L87-126) → show()
[E1] bizTypeButton[업무구분 설정].Select (L103) → lookupBizType()
[E2] updateButton[저장].Select (L109) → update()
[E3] closeButton[닫기].Select (L115) → hide()
[E4] bizTypeComboBox[업무구분].Collapse (L130) → 인라인 L130-135 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public insert() | L62-75 | 공개 메서드 | 상태 처리 | 업무 |
| public update() | L77-85 | E2 | 상태 처리 | 업무 |
| private getEditor() | L128-170 | insert,update | 상태 처리 | 업무 |
| public update() | L172-192 | E2 | 서비스 rpt.Rpt03_Week.modelUpsert | 업무 |
| private lookupBizType() | L194-202 | E1 | 조회창 Rpt05_Lookup_WeekBizClass 열기 | 업무 |
| private setHtmlStyle() | L204-206 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L208-210 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L212-214 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>
3. <Button type="assign" onClick={lookupBizType}>업무구분 설정</Button>

### Rpt05_Lookup_WeekBizClass (`client/vi/rpt/Rpt05_Lookup_WeekBizClass.java`, 152줄)

- 툴바 `buttonBar`: {retrieveButton} {insertButton} {updateButton}
- 입력·하위 화면: `lookup` Sys09_Lookup_Code
- 그리드 `grid` (buildGrid()):
  - weekBizTypeName 250 "업무구분" Text
  - unUseYn 80 "미사용" Boolean

#### 이벤트
[E0] 화면 열림 (생성자 L41-66) → settings(), show()
[E1] retrieveButton[조회].Select (L74) → retrieve()
[E2] updateButton[저장].Select (L80) → update()
[E3] insertButton[등록].Select (L86) → lookupCode()
[E4] cancelButton[닫기].Select (L92) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L68-71 | 공개 메서드 | 상태 처리 | 업무 |
| private retrieve() | L109-123 | E1,open,update,lookupCode | 서비스 rpt.Rpt05_WeekBizClass.selectByPersonId(companyId, personId, stdDate, kindCode) | 업무 |
| private update() | L125-137 | E2 | 서비스 rpt.Rpt05_WeekBizClass.upsert | 업무 |
| private lookupCode() | L139-147 | E3 | 조회창 Sys09_Lookup_Code 열기 | 업무 |
| private settings() | L73-98 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L100-107 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L149-151 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('weekBizTypeNm', 250, '업무구분'),  // L103 SQL 계산 컬럼(selectByPersonId: sys09_name)
  gb.boolean('unUseYn', 80, '미사용'),  // L104
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={lookupCode}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

### Rpt03_Lookup_Rd_WeekWrite (`client/vi/rpt/Rpt03_Lookup_Rd_WeekWrite.java`, 90줄)


#### 이벤트
[E0] 화면 열림 (생성자 L33-54) → show()
[E1] closeButton[닫기].Select (L43) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L57-84 | 공개 메서드 | 상태 처리 | 업무 |
| private setHtmlHeaderStyle() | L86-88 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>

