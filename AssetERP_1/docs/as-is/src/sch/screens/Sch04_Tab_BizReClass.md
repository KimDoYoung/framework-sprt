# Sch04_Tab_BizReClass

- 종류: 화면
- 메뉴: 준법감시 > 01. 법규관리 > 법규 담당자 변경(일회성) (#1015, 미사용)
- 파일: `client/vi/sch/Sch04_Tab_BizReClass.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Emp00_Lookup_SelectSingle`](../../emp/components/Emp00_Lookup_SelectSingle.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sch.Sch04_List.selectByBizReClass` | Sch04_Tab_BizReClass:155 | [`Sch04_List.java:147`](../../sch/services/Sch04_List.md) | [`sch04_list.selectByBizReClass`](../../sch/sql/sch04_list.md) |
| `sch.Sch04_List.update` | Sch04_Tab_BizReClass:164 | [`Sch04_List.java:462`](../../sch/services/Sch04_List.md) | `UpdateDataModel(sch04_list)` 동적 INSERT/UPDATE → [`sch04_list.selectById`](../../sch/sql/sch04_list.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr20_relate_ics`](../../../db/tables/apr.md), [`emp03_trans`](../../../db/tables/emp.md), [`ics01_class_tree`](../../../db/tables/ics.md), [`ics03_company_info`](../../../db/tables/ics.md), [`sch01_info`](../../../db/tables/sch.md), [`sch03_deadline`](../../../db/tables/sch.md), [`sch04_list`](../../../db/tables/sch.md)

## DB 함수

`f_cdnm`, `f_emp_kor_nm`, `f_get_appr_close_date`, `f_get_ics_manager`, `f_get_ics_nm`, `f_get_std_date`, `f_org_nm`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sch04_Tab_BizReClass (`client/vi/sch/Sch04_Tab_BizReClass.java`, 170줄)

- 레이아웃: center=vlc01
- 툴바 `buttonBar01`: 조회기간: {startDate} ~: {endDate} 주기구분: {cycleComboBox} 처리현황: {statusComboBox} {searchButton} {updateButton}
- 입력·하위 화면: `cycleComboBox` ComboBoxField("CycleCode", "%", "전체"), `statusComboBox` ComboBoxField("ScheduleStatusCode", "%", "전체"), `startDate` MyDateField, `endDate` MyDateField, `lookupEmpInfo` LookupTriggerField, `lookupEmpTransInfo` Emp00_Lookup_SelectSingle
- 그리드 `grid` (buildGrid(), 체크박스):
  - closeDate 120 "처리기한" Date
  - cycleName 100 "주기구분" Text
  - title 600 "업무명" Text
  - managerName 100 "공시담당자" Text
  - orgName 150 "업무담당부서" Text
  - personName 100 "업무담당자" Text 편집:lookupEmpInfo
  - statusName 100 "처리현황" Text

#### 이벤트
[E0] 화면 열림 (생성자 L49-98) → setInitData()
[E1] searchButton[조회].Select (L51) → retrieve()
[E2] updateButton[저장].Select (L57) → update()
[E3] lookupEmpInfo.TriggerClick (L106) → 인라인 L106-123 (new TriggerClickHandler(){ @Override …)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setInitData() | L136-146 | 생성자 | 상태 처리 | 업무 |
| private retrieve() | L148-160 | E1 | 서비스 sch.Sch04_List.selectByBizReClass(companyId, startDate, endDate, statusCode, cycleCode) | 업무 |
| private update() | L162-165 | E2 | 서비스 sch.Sch04_List.update | 업무 |
| public buildGrid() | L100-134 | 필드 초기화 | 조회창 Emp00_Lookup_SelectSingle 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L167-169 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('closeDate', 120, '처리기한'),  // L125
  gb.text('cycleNm', 100, '주기구분'),  // L126
  gb.text('title', 600, '업무명'),  // L127
  gb.text('managerNm', 100, '공시담당자'),  // L128
  gb.text('orgNm', 150, '업무담당부서'),  // L129
  gb.text('personNm', 100, '업무담당자'),  // L130
  gb.text('statusNm', 100, '처리현황'),  // L131
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>

