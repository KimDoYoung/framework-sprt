# Rpt01_Tab_DailyConfirm

- 종류: 화면
- 메뉴: 커뮤니티 > 04. 업무보고 > 기간별 업무확인 (#1237)
- 파일: `client/vi/rpt/Rpt01_Tab_DailyConfirm.java`
- 함께 쓰는 클래스 2개:
  - `Rpt01_Lookup_Rd_Daily` `client/vi/rpt/Rpt01_Lookup_Rd_Daily.java`
  - `Rpt01_Edit_DailyConfirm` `client/vi/rpt/Rpt01_Edit_DailyConfirm.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `rpt.Rpt01_Daily.confirmModelUpdate` | Rpt01_Edit_DailyConfirm:105 | [`Rpt01_Daily.java:69`](../../rpt/services/Rpt01_Daily.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(rpt01_daily)` 동적 INSERT/UPDATE → [`rpt01_daily.selectById`](../../rpt/sql/rpt01_daily.md) |
| `rpt.Rpt01_Daily.confirmUpdate` | Rpt01_Tab_DailyConfirm:297 | [`Rpt01_Daily.java:83`](../../rpt/services/Rpt01_Daily.md) | [`rpt01_daily.confirmUpdate`](../../rpt/sql/rpt01_daily.md) |
| `rpt.Rpt01_Daily.selectByConfirmText` | Rpt01_Tab_DailyConfirm:325 | [`Rpt01_Daily.java:39`](../../rpt/services/Rpt01_Daily.md) | [`rpt01_daily.selectByConfirmText`](../../rpt/sql/rpt01_daily.md) |
| `sys.Sys99_Print.insertRdDaily` | Rpt01_Tab_DailyConfirm:156 | [`Sys99_Print.java:1269`](../../sys/services/Sys99_Print.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`rpt01_daily.selectByConfirmText`](../../rpt/sql/rpt01_daily.md), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |

## 테이블

[`rpt01_daily`](../../../db/tables/rpt.md), [`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_emp_kor_nm`, `f_get_emptrans`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Rpt01_Tab_DailyConfirm (`client/vi/rpt/Rpt01_Tab_DailyConfirm.java`, 356줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 조회기간: {startDate} ~: {closeDate} 검색: {searchText} {checkBox} {retrieveButton} {downLoadButton} {confirmButton} {cancleButton}
- 입력·하위 화면: `checkBox` CheckBox, `searchText` TextField 빈칸="본부(부서)/사원/업무내용/확인자비고", `startDate` MyDateField, `closeDate` MyDateField, `lookupRdDaily` Rpt01_Lookup_Rd_Daily, `lookup` Rpt01_Edit_DailyConfirm
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - personOrg 100 "본부(부서)" TextCenter
  - personName 100 "사원" TextCenter
  - date 100 "일자" Date
  - content 600 "업무내용" TextLimitArea
  - confirmNote 300 "확인자 비고" TextLimitArea
  - actionCell 30 " " Cell 편집:editCell
  - confirmYnName 100 "확인여부" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L71-108) → settings(), retrieve()
[E1] searchText.KeyPress [Enter] (L138) → retrieve()
[E2] retrieveButton[조회].Select (L146) → retrieve()
[E3] downLoadButton[출력/다운로드].Select [result.getStatus() == 1] (L153) → 서비스 sys.Sys99_Print.insertRdDaily(windowClassName, companyId, personId, confirmYn, startDate, closeDate, orgCodeId, searchText)
[E4] confirmButton[확인].Select (L182) → updateConfirmYnChk()
       └ [E6] msgBox.DialogHide [YES] (L236) → updateConfirmYn()
       └ [E7] msgBox.DialogHide [YES] (L254) → updateConfirmYn()
[E5] cancleButton[확인취소].Select (L188) → updateConfirmYnChk()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private updateConfirmYnChk() | L227-270 | E4,E5 | ConfirmBox → E6 | 업무 |
| private updateConfirmYn() | L272-312 | E6,E7 | 미선택 시 alert "이미 확인완료된 업무가 있습니다.", 서비스 rpt.Rpt01_Daily.confirmUpdate | 업무 |
| public retrieve() | L314-331 | 생성자,E1,E2,buildGrid,updateConfirmYn | 서비스 rpt.Rpt01_Daily.selectByConfirmText(companyId, confirmYn, startDate, closeDate, orgCodeId, searchText) | 업무 |
| private settings() | L110-194 | 생성자 | 조회창 Rpt01_Lookup_Rd_Daily 열기, 서비스 sys.Sys99_Print.insertRdDaily(windowClassName, companyId, personId, confirmYn, startDate, closeDate, orgCodeId, searchText), 이벤트 연결, 초기값: startDate=start, closeDate=close, checkBox=false("미확인건만 조회") | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L196-225 | 필드 초기화 | 팝업 Rpt01_Edit_DailyConfirm 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L350-352 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L353-355 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('personOrg', 100, '본부(부서)'),  // L216 SQL 계산 컬럼(selectByConfirmText: f_get_emptrans(rpt01_person_id, rpt01_d…)
  gb.textCenter('personNm', 100, '사원'),  // L217 SQL 계산 컬럼(selectByConfirmText: f_emp_kor_nm(rpt01_person_id))
  gb.date('date', 100, '일자'),  // L218
  // ⚠ 대응 없음 (GridBuilder L219) addTextLimitArea
  // ⚠ 대응 없음 (GridBuilder L220) addTextLimitArea
  // ⚠ 대응 없음 (GridBuilder L221) addCell
  gb.textCenter('confirmYnNm', 100, '확인여부'),  // L222 SQL 계산 컬럼(selectByConfirmText: CASE WHEN COALESCE(rpt01_confirm_yn,'fa…)
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="download" onClick={() => /* 서비스 sys.Sys99_Print.insertRdDaily(windowClassName, companyId, personId, confirmYn, startDate, closeDate, orgCodeId, searchText) */}>출력/다운로드</Button>
3. <Button type="save" onClick={updateConfirmYnChk}>확인</Button>
4. <Button type="cancel" onClick={updateConfirmYnChk}>확인취소</Button>

### Rpt01_Lookup_Rd_Daily (`client/vi/rpt/Rpt01_Lookup_Rd_Daily.java`, 86줄)


#### 이벤트
[E0] 화면 열림 (생성자 L31-52) → show()
[E1] closeButton[닫기].Select (L41) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L54-80 | 공개 메서드 | 상태 처리 | 업무 |
| private setHtmlHeaderStyle() | L82-84 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>

### Rpt01_Edit_DailyConfirm (`client/vi/rpt/Rpt01_Edit_DailyConfirm.java`, 127줄)

- 입력·하위 화면: `content` MyTextArea, `confirmNote` MyTextArea

#### 이벤트
[E0] 화면 열림 (생성자 L53-83) → settings(), show()
[E1] updateButton[저장].Select (L87) → update()
[E2] closeButton[닫기].Select (L93) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public edit() | L44-51 | 공개 메서드 | 상태 처리 | 업무 |
| private update() | L102-117 | E1 | 서비스 rpt.Rpt01_Daily.confirmModelUpdate | 업무 |
| private settings() | L86-100 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L120-122 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L124-126 | edit | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

