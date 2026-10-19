# Emp21_Tab_PersonList

- 종류: 화면
- 메뉴: 신청 > 01. 외출/출장/휴가 > 연월차휴가 지정통보 (#1184)
- 파일: `client/vi/emp/Emp21_Tab_PersonList.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Dcr01_Lookup_Class`](../../dcr/components/Dcr01_Lookup_Class.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectById` | Emp21_Tab_PersonList:124, Emp21_Tab_PersonList:154 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `dcr.Dcr30_Link.selectByLinkCode` | Emp21_Tab_PersonList:220 | [`Dcr30_Link.java:46`](../../dcr/services/Dcr30_Link.md) | [`dcr01_class_tree.selectByLinkCode`](../../dcr/sql/dcr01_class_tree.md) |
| `emp.Emp21_UnLeave.selectByPersonId` | Emp21_Tab_PersonList:202 | [`Emp21_UnLeave.java:49`](../../emp/services/Emp21_UnLeave.md) | [`emp21_un_leave.selectByPersonId`](../../emp/sql/emp21_un_leave.md) |
| `emp.Emp21_UnLeave.update` | Emp21_Tab_PersonList:269 | [`Emp21_UnLeave.java:674`](../../emp/services/Emp21_UnLeave.md) | `UpdateDataModel(emp21_un_leave)` 동적 INSERT/UPDATE → [`emp21_un_leave.selectById`](../../emp/sql/emp21_un_leave.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp21_un_leave`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys01_company`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_get_close_date`, `f_get_dcr_no`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Emp21_Tab_PersonList (`client/vi/emp/Emp21_Tab_PersonList.java`, 286줄)

- 레이아웃: north=buttonBar, center=grid
- 툴바 `buttonBar`: 해당 연도: {yearText} {retrieveButton}
- 입력·하위 화면: `yearText` TextField, `editor` Apr01_Edit_ApprDoc, `lookup` Dcr01_Lookup_Class
- 그리드 `grid` (buildGrid(), 체크박스):
  - startDate 100 "통지일자" Date
  - unLeaveName 240 "구분" Text
  - remainDays 60 "잔여휴가" Double
  - apprStatusName 180 "지정통보문서" TextCenter
  - actionCell 60 "상세보기" Cell 편집:actionCell2
  - actionCell 60 "상신" Cell 편집:actionCell1
  - expectApprStatusName 180 "결재상태" TextCenter
  - actionCell 60 "상세보기" Cell 편집:actionCell3

#### 이벤트
[E0] 화면 열림 (생성자 L55-78) → settings(), retrieve()
[E1] retrieveButton[조회].Select (L84) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private addDays() | L92-96 | buildGrid | 상태 처리 | 업무 |
| public retrieve() | L195-211 | 생성자,E1,updateApprId | 서비스 emp.Emp21_UnLeave.selectByPersonId(companyId, personId, stdYear) | 업무 |
| private findLinkCode() | L213-239 | buildGrid | 서비스 dcr.Dcr30_Link.selectByLinkCode | 업무 |
| private openLookupDoc() | L241-250 | findLinkCode | 조회창 Dcr01_Lookup_Class 열기 | 업무 |
| private insertAppr() | L252-263 | openLookupDoc | 팝업 Apr01_Edit_ApprDoc 열기 | 업무 |
| private updateApprId() | L265-281 | insertAppr | 서비스 emp.Emp21_UnLeave.update | 업무 |
| private settings() | L80-90 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L98-193 | 필드 초기화 | 팝업 Apr01_Edit_ApprDoc 열기, 서비스 apr.Apr01_Appr.selectById, apr.Apr01_Appr.selectById, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L283-285 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('startDate', 100, '통지일자'),  // L183
  gb.text('unLeaveNm', 240, '구분'),  // L184 SQL 계산 컬럼(selectById: f_cdnm('unLeaveCode', emp21_un_leave_cd…)
  gb.double('remainDays', 60, '잔여휴가'),  // L185
  gb.textCenter('apprStatusNm', 180, '지정통보문서'),  // L186 SQL 계산 컬럼(selectById: f_cdnm('AprStatusCode', apr01.apr01_sta…)
  // ⚠ 대응 없음 (GridBuilder L187) addCell
  // ⚠ 대응 없음 (GridBuilder L188) addCell
  gb.textCenter('expectApprStatusNm', 180, '결재상태'),  // L189 SQL 계산 컬럼(selectById: f_cdnm('AprStatusCode', apr02.apr01_sta…)
  // ⚠ 대응 없음 (GridBuilder L190) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

