# Emp54_Tab_ErrandManager

- 종류: 화면
- 메뉴: 경영관리 > 02. 휴가/출장 관리 > 외출관리 (#1465)
- 파일: `client/vi/emp/Emp54_Tab_ErrandManager.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectById` | Emp54_Tab_ErrandManager:123 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `emp.Emp54_Errand.selectByManager` | Emp54_Tab_ErrandManager:185 | [`Emp54_Errand.java:51`](../../emp/services/Emp54_Errand.md) | [`emp54_errand.selectByManager`](../../emp/sql/emp54_errand.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp54_errand`](../../../db/tables/emp.md), [`emp56_share`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys12_calendar`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_get_dcr_no`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_today`, `getperson`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Emp54_Tab_ErrandManager (`client/vi/emp/Emp54_Tab_ErrandManager.java`, 196줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 조회기간: {startDate} ~: {closeDate} {searchText} {retrieveButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `searchText` TextField 빈칸="외출자/구분/사유/주최자", `editor` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - date 100 "일자" Date
  - weekday 70 "요일" TextCenter
  - personInfo 200 "외출자" Text
  - errandName 100 "구분" Text
  - departTime 120 "외출시각" TextCenter
  - returnTime 120 "복귀시각" TextCenter
  - reason 400 "사유" Text
  - venue 150 "장소" Text
  - host 150 "주최자" Text
  - note 150 "비고" Text
  - actionCell 70 "이익수령<br>제외신청" Cell 편집:actionCell01
  - aprStatusName 80 "결재상태" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L53-79) → settings(), retrieve()
[E1] searchText.KeyPress [Enter] (L93) → retrieve()
[E2] retrieveButton[조회].Select (L102) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L177-191 | 생성자,E1,E2,buildGrid | 서비스 emp.Emp54_Errand.selectByManager(companyId, startDate, closeDate, searchText) | 업무 |
| private settings() | L81-108 | 생성자 | 이벤트 연결, 초기값: startDate=LoginUser.getToday(, closeDate=cDate | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L110-175 | 필드 초기화 | 팝업 Apr01_Edit_ApprDoc 열기, 미선택 시 alert "상신문서가 존재하지 않습니다", 서비스 apr.Apr01_Appr.selectById, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L193-195 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('date', 100, '일자'),  // L158
  gb.textCenter('weekday', 70, '요일'),  // L159
  gb.text('personInfo', 200, '외출자'),  // L160
  gb.text('errandNm', 100, '구분'),  // L161
  gb.textCenter('departTime', 120, '외출시각'),  // L162
  gb.textCenter('returnTime', 120, '복귀시각'),  // L163
  gb.text('reason', 400, '사유'),  // L164
  gb.text('venue', 150, '장소'),  // L165
  gb.text('host', 150, '주최자'),  // L166
  gb.text('note', 150, '비고'),  // L167
  // ⚠ 대응 없음 (GridBuilder L168) addCell
  gb.textCenter('aprStatusNm', 80, '결재상태'),  // L169
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

