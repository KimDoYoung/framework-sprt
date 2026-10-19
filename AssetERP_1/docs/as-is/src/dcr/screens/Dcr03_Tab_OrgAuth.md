# Dcr03_Tab_OrgAuth

- 종류: 화면
- 메뉴: 관리자 > 02. 문서권한관리 > 조직별 문서분류 맵핑 (#1074)
- 파일: `client/vi/dcr/Dcr03_Tab_OrgAuth.java`
- 함께 쓰는 클래스 1개:
  - `Dcr03_TabPage_OrgAuth` `client/vi/dcr/Dcr03_TabPage_OrgAuth.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Dcr30_Lookup_Link`](../../dcr/components/Dcr30_Lookup_Link.md), [`Org00_Lookup_SelectMulti`](../../org/components/Org00_Lookup_SelectMulti.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `dcr.Dcr03_OrgAuth.selectByOrgCodeId` | Dcr03_TabPage_OrgAuth:205 | [`Dcr03_OrgAuth.java:27`](../../dcr/services/Dcr03_OrgAuth.md) | [`dcr01_class_tree.selectByOrgCodeId_1Bang`](../../dcr/sql/dcr01_class_tree.md) |
| `dcr.Dcr03_OrgAuth.update` | Dcr03_TabPage_OrgAuth:246 | [`Dcr03_OrgAuth.java:99`](../../dcr/services/Dcr03_OrgAuth.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`dcr03_org_auth.selectByDcrOrgId`](../../dcr/sql/dcr03_org_auth.md), [`dcr30_link.selectByClassTreeId`](../../dcr/sql/dcr30_link.md), [`sys01_company.selectById`](../../sys/sql/sys01_company.md), `UpdateDataModel(dcr03_org_auth)` 동적 INSERT/UPDATE → [`dcr03_org_auth.selectById`](../../dcr/sql/dcr03_org_auth.md) |
| `org.Org01_Code.copyDcrRight` | Dcr03_Tab_OrgAuth:166 | [`Org01_Code.java:523`](../../org/services/Org01_Code.md) | [`dcr01_class_tree.selectByOrgCodeId_1Bang`](../../dcr/sql/dcr01_class_tree.md), [`dcr03_org_auth.inUpdateRight`](../../dcr/sql/dcr03_org_auth.md) |
| `org.Org01_Code.selectByCompanyId` | Dcr03_Tab_OrgAuth:145 | [`Org01_Code.java:64`](../../org/services/Org01_Code.md) | [`org01_code.selectByParentId_1Bang`](../../org/sql/org01_code.md) |
| `sys.Sys01_Company.selectById` | Dcr03_TabPage_OrgAuth:82 | [`Sys01_Company.java:20`](../../sys/services/Sys01_Company.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys01_company.selectById`](../../sys/sql/sys01_company.md), [`sys01_company.updateMainImageId`](../../sys/sql/sys01_company.md) |

## 테이블

[`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr03_org_auth`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys01_company`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_create_seq`, `f_emp_kor_nm`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`, `f_today`, `f_trunc`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Dcr03_Tab_OrgAuth (`client/vi/dcr/Dcr03_Tab_OrgAuth.java`, 217줄)

- 레이아웃: west=vlc, center=orgAuthPage
- 툴바 `buttonBar`: {copyButton} {retrieveButton}
- 입력·하위 화면: `orgAuthPage` Dcr03_TabPage_OrgAuth, `orgSearch` Org00_Lookup_SelectMulti

#### 이벤트
[E0] 화면 열림 (생성자 L81-141) → retrieve()
[E1] retrieveButton[조회].Select (L82) → retrieve()
[E2] copyButton[권한복사].Select (L88) → copy()
[E3] orgCodeTree.SelectionChanged [선택>0] (L111) → 인라인 L111-125 (new SelectionChangedHandler<Org01_Cod…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private getMenuTree() | L43-74 | 미사용 후보 | 상태 처리 | 업무 |
| private retrieve() | L144-150 | 생성자,E1,copy | 서비스 org.Org01_Code.selectByCompanyId | 업무 |
| private copy() | L152-184 | E2 | 조회창 Org00_Lookup_SelectMulti 열기, 미선택 시 alert "선택된 조직이 없습니다.", 서비스 org.Org01_Code.copyDcrRight | 업무 |
| private addChild() | L186-195 | getServiceResult | 상태 처리 | 업무 |
| public getServiceResult() | L198-213 | copy | 상태 처리 | 업무 |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="change" onClick={copy}>권한복사</Button>
2. <Button type="search" onClick={retrieve}>조회</Button>

### Dcr03_TabPage_OrgAuth (`client/vi/dcr/Dcr03_TabPage_OrgAuth.java`, 300줄)

- 입력·하위 화면: `lookup` Dcr30_Lookup_Link
- 그리드 `treeGrid` (buildTreeGrid(), 트리):
  - classTreeName 300 "문서분류" Text
  - retrieveYnCheck 60 "조회" Boolean
  - updateYnCheck 60 "작성" Boolean
  - seq 80 "조회순서" Text
  - note 400 "상세설명" Text

#### 이벤트
[E0] 화면 열림 (생성자 L55-79) → settings()
[E1] hiperLink.Click (L98) → 인라인 L98-109 (new ClickHandler() { @Override public…)
[E2] selectAllButton[전체선택].Select (L116) → selectAll()
[E3] selectAllFalseButton[전체해제].Select (L122) → selectAll()
[E4] updateButton[저장].Select (L128) → update()
[E5] treeGrid.CellMouseDown [event.getRowIndex() >= 0] (L134) → getColumn()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private getColumn() | L146-191 | E5 | 상태 처리 | 업무 |
| public buildTreeGrid() | L193-202 | 필드 초기화 | 상태 처리 | 업무 |
| public retrieve() | L204-211 | 공개 메서드 | 서비스 dcr.Dcr03_OrgAuth.selectByOrgCodeId | 업무 |
| private addChildItem() | L213-223 | getServiceResult | 상태 처리 | 업무 |
| public getServiceResult() | L226-240 | settings | 상태 처리 | 업무 |
| private update() | L242-263 | E4 | 서비스 dcr.Dcr03_OrgAuth.update(orgCodeId, companyId) | 업무 |
| private selectAll() | L265-273 | E2,E3 | 상태 처리 | 업무 |
| public retrieve() | L276-279 | 공개 메서드 | 상태 처리 | 업무 |
| public init() | L282-285 | 공개 메서드 | 상태 처리 | 업무 |
| public treeClear() | L287-289 | 공개 메서드 | 상태 처리 | 업무 |
| public getGrid() | L296-299 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L81-144 | 생성자 | 조회창 Dcr30_Lookup_Link 열기, 서비스 sys.Sys01_Company.selectById(companyId), 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlCheckBoxStyle() | L291-293 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildTreeGrid = () => [
  gb.text('classTreeNm', 300, '문서분류'),  // L196
  // ⚠DB없음 L197 retrieveYnCheck 60 "조회" (apr10_retrieve_yn_check 컬럼 없음)
  // ⚠DB없음 L198 updateYnCheck 60 "작성" (apr10_update_yn_check 컬럼 없음)
  gb.text('seq', 80, '조회순서'),  // L199
  gb.text('note', 400, '상세설명'),  // L200
];
```

#### 사용된 버튼들
1. <Button type="addRow" onClick={selectAll}>전체선택</Button>
2. <Button type="removeRow" onClick={selectAll}>전체해제</Button>
3. <Button type="save" onClick={update}>저장</Button>

