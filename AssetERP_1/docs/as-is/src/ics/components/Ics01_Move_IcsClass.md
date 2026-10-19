# Ics01_Move_IcsClass

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `apr`
- 파일: `client/vi/ics/Ics01_Move_IcsClass.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.updateIcsParentId` | Ics01_Move_IcsClass:188 | **(없음)** | - |
| `dcr.Dcr01_ClassTree.selectByIcsCompanyId` | Ics01_Move_IcsClass:205 | [`Dcr01_ClassTree.java:96`](../../dcr/services/Dcr01_ClassTree.md) | [`dcr01_class_tree.selectByIcsParentId`](../../dcr/sql/dcr01_class_tree.md) |
| `ics.Ics01_ClassTree.selectByClassTreeId` | Ics01_Move_IcsClass:151 | [`Ics01_ClassTree.java:43`](../../ics/services/Ics01_ClassTree.md) | [`ics01_class_tree.selectByClassTreeId`](../../ics/sql/ics01_class_tree.md) |

## 테이블

[`apr10_stamp`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`ics01_class_tree`](../../../db/tables/ics.md), [`ics02_manager`](../../../db/tables/ics.md), [`ics03_company_info`](../../../db/tables/ics.md), [`ics05_relate_manager`](../../../db/tables/ics.md), [`ics19_revision_relate_ics`](../../../db/tables/ics.md), [`sch03_deadline`](../../../db/tables/sch.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md), [`tdm42_manl_org`](../../../db/tables/tdm.md), [`tdm43_manl`](../../../db/tables/tdm.md), [`tdm45_manl_relate_ics`](../../../db/tables/tdm.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_get_ics_nm`, `f_ics_class_tree_nm_allpath`, `f_sysdate`, `f_to_number`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ics01_Move_IcsClass (`client/vi/ics/Ics01_Move_IcsClass.java`, 252줄)

- 레이아웃: west=treeGrid, center=grid
- 그리드 `treeGrid` (buildTreeGrid()):
  - classTreeName 300 "분류명" Text
  - classTreeCode 80 "분류코드" Text
- 그리드 `grid` (buildGrid(), 체크박스):
  - classTreeCode 70 "분류코드" Text
  - classTreeName 400 " 내용" TextArea
  - submitTo 200 "제출처" TextArea
  - cycleName 100 "주기" Text
  - deadlineName 100 "기한" Text
  - relatedLaw 300 "관련조문" TextArea

#### 이벤트
[E0] 화면 열림 (생성자 L57-118) → show(), retrieve()
[E1] changeButton[변경].Select (L67) → updateCheck()
       └ [E5] msgBox.DialogHide [YES] (L167) → update()
[E2] cancleButton[닫기].Select (L73) → hide()
[E3] treeGrid.Selection (L79) → retrievePage()
[E4] grid.Selection (L87) → 인라인 L87-96 (new SelectionHandler<Ics01_ClassTreeM…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public buildTreeGrid() | L120-126 | 필드 초기화 | 상태 처리 | 업무 |
| private retrievePage() | L141-157 | E3 | 서비스 ics.Ics01_ClassTree.selectByClassTreeId(classTreeId, companyId, typeCode) | 업무 |
| private updateCheck() | L159-184 | E1 | 미선택 시 alert "좌측 법류를 선택해주세요" → 확인창 E5 | 업무 |
| private update() | L186-201 | E5 | 서비스 apr.Apr01_Appr.updateIcsParentId | 업무 |
| public retrieve() | L203-214 | 생성자 | 서비스 dcr.Dcr01_ClassTree.selectByIcsCompanyId | 업무 |
| private addChildItem() | L216-224 | getServiceResult | 상태 처리 | 업무 |
| public getServiceResult() | L227-246 | update | 상태 처리 | 업무 |
| public buildGrid() | L128-139 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L248-250 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildTreeGrid = () => [
  gb.text('classTreeNm', 300, '분류명'),  // L123
  gb.text('classTreeCd', 80, '분류코드'),  // L124
];

const buildGrid = () => [
  gb.text('classTreeCd', 70, '분류코드'),  // L132
  gb.textArea('classTreeNm', 400, ' 내용'),  // L133
  gb.textArea('submitTo', 200, '제출처'),  // L134
  gb.text('cycleNm', 100, '주기'),  // L135
  gb.text('deadlineNm', 100, '기한'),  // L136
  gb.textArea('relatedLaw', 300, '관련조문'),  // L137
];
```

#### 사용된 버튼들
1. <Button type="change" onClick={updateCheck}>변경</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

