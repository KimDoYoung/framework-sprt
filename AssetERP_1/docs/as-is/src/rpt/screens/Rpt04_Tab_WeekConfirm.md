# Rpt04_Tab_WeekConfirm

- 종류: 화면
- 메뉴: 커뮤니티 > 04. 업무보고 > 주간업무보고 확인 (#1355)
- 파일: `client/vi/rpt/Rpt04_Tab_WeekConfirm.java`
- 함께 쓰는 클래스 1개:
  - `Rpt04_Lookup_Rd_WeekConfirm` `client/vi/rpt/Rpt04_Lookup_Rd_WeekConfirm.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Org00_Lookup_SelectSingle`](../../org/components/Org00_Lookup_SelectSingle.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `rpt.Rpt03_Week.getLastWeek` | Rpt04_Tab_WeekConfirm:247 | [`Rpt03_Week.java:66`](../../rpt/services/Rpt03_Week.md) | [`rpt03_week.getLastWeek`](../../rpt/sql/rpt03_week.md) |
| `rpt.Rpt03_Week.getWeekDays` | Rpt04_Tab_WeekConfirm:309 | [`Rpt03_Week.java:161`](../../rpt/services/Rpt03_Week.md) | - |
| `rpt.Rpt03_Week.selectByCompanyId` | Rpt04_Tab_WeekConfirm:196 | [`Rpt03_Week.java:45`](../../rpt/services/Rpt03_Week.md) | [`rpt03_week.selectByCompanyId`](../../rpt/sql/rpt03_week.md) |
| `rpt.Rpt03_Week.selectByStartDate` | Rpt04_Lookup_Rd_WeekConfirm:260, Rpt04_Tab_WeekConfirm:338 | [`Rpt03_Week.java:33`](../../rpt/services/Rpt03_Week.md) | [`rpt03_week.selectByStartDate`](../../rpt/sql/rpt03_week.md) |
| `rpt.Rpt04_WeekConfirm.confirmUpdate` | Rpt04_Lookup_Rd_WeekConfirm:219 | [`Rpt04_WeekConfirm.java:46`](../../rpt/services/Rpt04_WeekConfirm.md) | [`rpt04_week_confirm.confirmUpdate`](../../rpt/sql/rpt04_week_confirm.md) |
| `rpt.Rpt04_WeekConfirm.selectByCompanyId` | Rpt04_Lookup_Rd_WeekConfirm:295 | [`Rpt04_WeekConfirm.java:25`](../../rpt/services/Rpt04_WeekConfirm.md) | [`rpt04_week_confirm.selectByCompanyId`](../../rpt/sql/rpt04_week_confirm.md) |
| `rpt.Rpt04_WeekConfirm.selectByConfirmerId` | Rpt04_Lookup_Rd_WeekConfirm:167 | [`Rpt04_WeekConfirm.java:35`](../../rpt/services/Rpt04_WeekConfirm.md) | [`rpt04_week_confirm.selectByConfirmerId`](../../rpt/sql/rpt04_week_confirm.md) |
| `rpt.Rpt04_WeekConfirm.updateByPersonId` | Rpt04_Lookup_Rd_WeekConfirm:242 | [`Rpt04_WeekConfirm.java:82`](../../rpt/services/Rpt04_WeekConfirm.md) | [`rpt04_week_confirm.updateByPersonId`](../../rpt/sql/rpt04_week_confirm.md) |
| `rpt.Rpt04_WeekConfirm.updateNote` | Rpt04_Lookup_Rd_WeekConfirm:197 | [`Rpt04_WeekConfirm.java:65`](../../rpt/services/Rpt04_WeekConfirm.md) | [`rpt04_week_confirm.updateNote`](../../rpt/sql/rpt04_week_confirm.md) |
| `sys.Sys00_Common.selectWeekListByMonth` | Rpt04_Tab_WeekConfirm:121 | [`Sys00_Common.java:186`](../../sys/services/Sys00_Common.md) | - |
| `sys.Sys99_Print.insertRdWeekConfirm` | Rpt04_Tab_WeekConfirm:265 | [`Sys99_Print.java:3900`](../../sys/services/Sys99_Print.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`rpt03_week.selectByLastStartDate`](../../rpt/sql/rpt03_week.md), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |

## 테이블

[`rpt03_week`](../../../db/tables/rpt.md), [`rpt04_week_confirm`](../../../db/tables/rpt.md), [`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_create_seq`, `f_emp_kor_nm`, `f_get_emptrans`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Rpt04_Tab_WeekConfirm (`client/vi/rpt/Rpt04_Tab_WeekConfirm.java`, 373줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 보고주간: {yyyyText} {monthComboBox} {weekComboBox} 부서: {orgField} {confirmCheck} {retrieveButton}
- 입력·하위 화면: `confirmCheck` CheckBox, `yyyyText` TextField, `monthComboBox` ComboBoxField("MonthsCode"), `orgField` LookupTriggerField, `weekComboBox` CommonComboBoxField("sys.Sys00_Common.selectWeekListByMonth"), `lookupOrg` Org00_Lookup_SelectSingle, `lookupRdWeekConfirm` Rpt04_Lookup_Rd_WeekConfirm
- 그리드 `grid` (buildGrid()):
  - orgName 180 "부서" Text
  - personName 100 "작성자" TextCenter
  - actionCell 80 "주간업무보기" Cell 편집:viewButton
  - confirmer 100 "확인자" TextCenter
  - confirmDateStr 200 "확인일시" Text
  - confirmNote 700 "확인자 메모" TextArea

#### 이벤트
[E0] 화면 열림 (생성자 L71-103) → settings(), getWeekDays()
[E1] monthComboBox[MonthsCode].Collapse (L123) → 인라인 L123-134 (new CollapseHandler() { @Override pub…)
[E2] weekComboBox[sys.Sys00_Common.selectWeekListByMonth].Collapse (L137) → retrieve()
[E3] orgField.TriggerClick (L153) → lookupOrg()
[E4] retrieveButton[조회].Select (L160) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieve() | L189-202 | E2,E4,lookUpRd,getWeekDays,fixCheck | 서비스 rpt.Rpt03_Week.selectByCompanyId(companyId, startDate, orgCodeId, confirmYn) | 업무 |
| private retrieve() | L204-217 | E2,E4,lookUpRd,getWeekDays,fixCheck | 서비스 rpt.Rpt03_Week.selectByCompanyId(companyId, startDate, orgCodeId, confirmYn) | 업무 |
| private lookupOrg() | L219-241 | E3 | 조회창 Org00_Lookup_SelectSingle 열기 | 업무 |
| private lookUpRd() | L243-306 | buildGrid | 조회창 Rpt04_Lookup_Rd_WeekConfirm 열기, 미선택 시 alert, 서비스 rpt.Rpt03_Week.getLastWeek, sys.Sys99_Print.insertRdWeekConfirm(companyId, personId, startDate, companyId, personId, windowClassName, startDate, lastStartDate) | 업무 |
| private getWeekDays() | L308-334 | 생성자 | 서비스 rpt.Rpt03_Week.getWeekDays(toDay) | 업무 |
| private fixCheck() | L336-365 | buildGrid | 미선택 시 alert "제출 취소된 보고입니다. 다시 확인해주세요.", 서비스 rpt.Rpt03_Week.selectByStartDate(companyId, personId, startDate, closeDate, weekBizTypeCode) | 업무 |
| private settings() | L105-166 | 생성자 | 서비스 sys.Sys00_Common.selectWeekListByMonth, 이벤트 연결, 초기값: confirmCheck=false("미확인건만 조회"), yyyyText=startYear, orgField=LoginUser.getUserModel( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L168-187 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L367-369 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L370-372 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('orgNm', 180, '부서'),  // L179 SQL 계산 컬럼(selectByCompanyId: f_get_empTrans(rpt03_person_id, rpt03_w…)
  gb.textCenter('personNm', 100, '작성자'),  // L180 SQL 계산 컬럼(selectByCompanyId: f_emp_kor_nm(rpt03_person_id))
  // ⚠ 대응 없음 (GridBuilder L181) addCell
  gb.textCenter('confirmer', 100, '확인자'),  // L182 SQL 계산 컬럼(selectByCompanyId: (SELECT f_emp_kor_nm(rpt04_confirmer_id…)
  gb.text('confirmDateStr', 200, '확인일시'),  // L183 SQL 계산 컬럼(selectByCompanyId: (SELECT to_char(rpt04_confirm_datetime,…)
  gb.textArea('confirmNote', 700, '확인자 메모'),  // L184 SQL 계산 컬럼(selectByCompanyId: (SELECT rpt04_note FROM rpt04_week_conf…)
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

### Rpt04_Lookup_Rd_WeekConfirm (`client/vi/rpt/Rpt04_Lookup_Rd_WeekConfirm.java`, 327줄)

- 입력·하위 화면: `confirmNote` TextArea, `cofirmPersonField` TextField

#### 이벤트
[E0] 화면 열림 (생성자 L64-122) → show()
[E1] closeButton[닫기].Select (L74) → hide()
[E2] updateButton[저장].Select (L82) → fixCheck(), update()
[E3] confirmButton[확인].Select (L90) → confirmCheck(), confirmUpdate()
[E4] cancelButton[확인취소].Select (L98) → confirmCancel()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L125-164 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L166-189 | confirmUpdate,confirmCancel | 서비스 rpt.Rpt04_WeekConfirm.selectByConfirmerId(companyId, personId, startDate, confirmerId) | 업무 |
| private update() | L191-211 | E2 | 서비스 rpt.Rpt04_WeekConfirm.updateNote(companyId, personId, startDate, confirmNote) | 업무 |
| private confirmUpdate() | L213-234 | E3 | 서비스 rpt.Rpt04_WeekConfirm.confirmUpdate(companyId, personId, startDate, confirmNote, confirmerId) | 업무 |
| private confirmCancel() | L236-256 | E4 | 서비스 rpt.Rpt04_WeekConfirm.updateByPersonId(companyId, personId, startDate, confirmNote) | 업무 |
| private fixCheck() | L258-291 | E2,confirmCheck | 서비스 rpt.Rpt03_Week.selectByStartDate(companyId, personId, startDate, closeDate, weekBizTypeCode) | 업무 |
| private confirmCheck() | L293-318 | E3 | 서비스 rpt.Rpt04_WeekConfirm.selectByCompanyId(companyId, personId, startDate) | 업무 |
| private setHtmlHeaderStyle() | L320-322 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L324-326 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={() => /* fixCheck(), update() */}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>
3. <Button type="save" onClick={() => /* confirmCheck(), confirmUpdate() */}>확인</Button>
4. <Button type="cancel" onClick={confirmCancel}>확인취소</Button>

