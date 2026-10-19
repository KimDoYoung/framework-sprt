# Emp20_Tab_LeaveList

- 종류: 화면
- 메뉴: 신청 > 01. 외출/출장/휴가 > 휴가신청조회 (#1034)
- 파일: `client/vi/emp/Emp20_Tab_LeaveList.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Emp00_Lookup_SelectSingle`](../../emp/components/Emp00_Lookup_SelectSingle.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `emp.Emp20_Leave.selectByPersonName` | Emp20_Tab_LeaveList:258 | [`Emp20_Leave.java:64`](../../emp/services/Emp20_Leave.md) | [`emp20_leave.selectByPersonName`](../../emp/sql/emp20_leave.md) |
| `sys.Sys99_Print.insertRdLeaveList` | Emp20_Tab_LeaveList:140 | [`Sys99_Print.java:4387`](../../sys/services/Sys99_Print.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`emp20_leave.selectByPersonName`](../../emp/sql/emp20_leave.md), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`emp20_leave`](../../../db/tables/emp.md), [`emp24_joint_leave`](../../../db/tables/emp.md), [`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_emp_kor_nm`, `f_get_biz_days`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Emp20_Tab_LeaveList (`client/vi/emp/Emp20_Tab_LeaveList.java`, 265줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 조회기간: {startDate} ~: {closeDate} 사원명: {personName} {retrieveButton} {rdButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `personId` LongField, `personName` LookupTriggerField, `lookupEmpTransInfo` Emp00_Lookup_SelectSingle, `editor` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid(), 체크박스):
  - startDate 100 "휴가시작일" Date
  - closeDate 100 "휴가종료일" Date
  - personName 120 "성명" TextCenter
  - leaveCount 60 "휴가기간" Double
  - leaveName 150 "휴가구분" Text
  - actionCell 80 "상세보기" Cell 편집:actionCell
  - managerName 150 "대직자" Text
  - emergencyTelno 150 "비상망" Text

#### 이벤트
[E0] 화면 열림 (생성자 L65-84) → buttonBarSetting(), retrieve()
[E1] personName.TriggerClick (L114) → 인라인 L114-128 (new TriggerClickHandler(){ @Override …)
[E2] retrieveButton[조회].Select (L129) → retrieve()
[E3] rdButton[출력/다운로드].Select [result.getStatus() == 1] (L135) → 서비스 sys.Sys99_Print.insertRdLeaveList(companyId, personId, windowClassName, personName, startDate, closeDate)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private buttonBarSetting() | L86-176 | 생성자 | 조회창 Emp00_Lookup_SelectSingle 열기 → 콜백: unmask, 서비스 sys.Sys99_Print.insertRdLeaveList(companyId, personId, windowClassName, personName, startDate, closeDate) | 업무 |
| public retrieve() | L251-260 | 생성자,E2 | 서비스 emp.Emp20_Leave.selectByPersonName(personName, startDate, closeDate, companyId) | 업무 |
| public buildGrid() | L178-248 | 필드 초기화 | 팝업 Apr01_Edit_ApprDoc 열기, 미선택 시 alert "해당문서의 열람권한이 없습니다", 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L262-264 | buttonBarSetting | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('startDate', 100, '휴가시작일'),  // L237
  gb.date('closeDate', 100, '휴가종료일'),  // L238
  gb.textCenter('personNm', 120, '성명'),  // L239
  gb.double('leaveCount', 60, '휴가기간'),  // L240
  gb.text('leaveNm', 150, '휴가구분'),  // L241
  // ⚠ 대응 없음 (GridBuilder L243) addCell
  gb.text('managerNm', 150, '대직자'),  // L244
  gb.text('emergencyTelno', 150, '비상망'),  // L245
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="download" onClick={() => /* 서비스 sys.Sys99_Print.insertRdLeaveList(companyId, personId, windowClassName, personName, startDate, closeDate) */}>출력/다운로드</Button>

