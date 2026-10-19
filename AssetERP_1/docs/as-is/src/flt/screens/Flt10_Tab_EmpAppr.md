# Flt10_Tab_EmpAppr

- 종류: 화면
- 메뉴: 준법감시 > 11. 임직원매매(준감인) > 정기보고현황 (#1152)
- 파일: `client/vi/flt/Flt10_Tab_EmpAppr.java`
- 함께 쓰는 클래스 1개:
  - `Flt10_Grid_EmpAppr` `client/vi/flt/Flt10_Grid_EmpAppr.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectById` | Flt10_Grid_EmpAppr:57 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `flt.Flt10_Tr.deleteAppr` | Flt10_Grid_EmpAppr:115 | [`Flt10_Tr.java:621`](../../flt/services/Flt10_Tr.md) | [`apr01_appr.deleteAppr`](../../apr/sql/apr01_appr.md), [`apr01_appr.insertApprDel`](../../apr/sql/apr01_appr.md), [`flt10_tr.updateByApprId`](../../flt/sql/flt10_tr.md) |
| `flt.Flt10_Tr.selectByApprId` | Flt10_Grid_EmpAppr:189 | [`Flt10_Tr.java:177`](../../flt/services/Flt10_Tr.md) | [`flt10_tr.selectByApprId`](../../flt/sql/flt10_tr.md) |
| `flt.Flt10_Tr.selectEmpAppr` | Flt10_Tab_EmpAppr:173 | [`Flt10_Tr.java:80`](../../flt/services/Flt10_Tr.md) | [`flt10_tr.selectEmpAppr`](../../flt/sql/flt10_tr.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`apr99_appr_del`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md), [`flt02_emp`](../../../db/tables/flt.md), [`flt04_oath`](../../../db/tables/flt.md), [`flt10_tr`](../../../db/tables/flt.md), [`flt14_relate_appr`](../../../db/tables/flt.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_create_seq`, `f_get_dcr_no`, `f_get_emptrans`, `f_get_floortrappr`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`, `getorg`, `getperson`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Flt10_Tab_EmpAppr (`client/vi/flt/Flt10_Tab_EmpAppr.java`, 190줄)

- 레이아웃: north=buttonBar, center=grid, east=gridEmpAppr
- 툴바 `buttonBar`: 기준년월: {dataYMText} 검색: {searchText} {unApprYn} {retrieveButton}
- 입력·하위 화면: `dataYMText` TextField, `unApprYn` CheckBox, `searchText` TextField 빈칸="본부(부서)/사원명"
- 그리드 `grid` (buildGrid()):
  - orgName 150 "본부(부서)" Text
  - personName 120 "사원명" TextCenter
  - oathYnName 120 "서약서 서명유무" TextCenter
  - checkCycleName 120 "점검주기" TextCenter
  - checkApprName 150 "상신상태" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L49-83) → settings(), retrieve()
[E1] dataYMText.KeyPress [Enter] (L97) → retrieve()
[E2] unApprYn[미보고건만 보기].ValueChange (L108) → retrieve()
[E3] searchText.KeyPress [Enter] (L117) → retrieve()
[E4] retrieveButton[조회].Select (L126) → retrieve()
[E5] grid.SelectionChanged [선택>0] (L138) → 인라인 L138-145 (new SelectionChangedHandler<Flt10_TrM…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L159-182 | 생성자,E1,E2,E3,E4 | 서비스 yyyy.MM.dd, flt.Flt10_Tr.selectEmpAppr(companyId, stdDate, unApprYn, searchText) | 업무 |
| private settings() | L85-146 | 생성자 | 이벤트 연결, 초기값: dataYMText=startDay, unApprYn=false("미보고건만 보기") | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L148-157 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L184-186 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L187-189 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('orgNm', 150, '본부(부서)'),  // L150
  gb.textCenter('personNm', 120, '사원명'),  // L151
  gb.textCenter('oathYnNm', 120, '서약서 서명유무'),  // L152
  gb.textCenter('checkCycleNm', 120, '점검주기'),  // L153
  gb.textCenter('checkApprNm', 150, '상신상태'),  // L154
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

### Flt10_Grid_EmpAppr (`client/vi/flt/Flt10_Grid_EmpAppr.java`, 199줄)

- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `editor` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid(), 체크박스):
  - apprRegDate 100 "상신일" Date
  - apprStatusName 100 "상신상태" Text
  - apprTitle 400 "상신제목" Text
  - actionCell 55 "상세보기" Cell 편집:detailCell
  - actionCell 55 "삭제" Cell 편집:deleteCell

#### 이벤트
[E0] 화면 열림 (생성자 L46-48) → 초기화
[E1] msgBox.DialogHide [YES] (L84) → deleteAppr()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private deleteAppr() | L112-131 | E1 | 서비스 flt.Flt10_Tr.deleteAppr(apprId, userId) | 업무 |
| public init() | L133-135 | retrieve | 상태 처리 | 업무 |
| public retrieve() | L137-198 | deleteAppr | 서비스 flt.Flt10_Tr.selectByApprId(companyId, personId, startDate, closeDate) | 업무 |
| public buildGrid() | L50-110 | 필드 초기화 | 팝업 Apr01_Edit_ApprDoc 열기, 확인창 표시, 서비스 apr.Apr01_Appr.selectById, 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('apprRegDate', 100, '상신일'),  // L103
  gb.text('apprStatusNm', 100, '상신상태'),  // L104
  gb.text('apprTitle', 400, '상신제목'),  // L105
  // ⚠ 대응 없음 (GridBuilder L106) addCell
  // ⚠ 대응 없음 (GridBuilder L107) addCell
];
```

#### 사용된 버튼들
버튼 사용하지 않음

