# Dcr03_Tab_DcrAuth

- 종류: 화면
- 메뉴: 관리자 > 02. 문서권한관리 > 문서분류별 조직 맵핑 (#1073)
- 파일: `client/vi/dcr/Dcr03_Tab_DcrAuth.java`
- 함께 쓰는 클래스 1개:
  - `Dcr03_TabPage_DcrAuth` `client/vi/dcr/Dcr03_TabPage_DcrAuth.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Dcr30_Lookup_Link`](../../dcr/components/Dcr30_Lookup_Link.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `dcr.Dcr01_ClassTree.selectByCompanyId` | Dcr03_Tab_DcrAuth:158 | [`Dcr01_ClassTree.java:50`](../../dcr/services/Dcr01_ClassTree.md) | [`dcr01_class_tree.selectByParentId1Bang`](../../dcr/sql/dcr01_class_tree.md) |
| `org.Org01_Code.selectByDcrCodeId` | Dcr03_TabPage_DcrAuth:173 | [`Org01_Code.java:264`](../../org/services/Org01_Code.md) | [`org01_code.selectByDcrCodeId`](../../org/sql/org01_code.md) |
| `org.Org01_Code.updateDcrAuth` | Dcr03_TabPage_DcrAuth:211 | [`Org01_Code.java:443`](../../org/services/Org01_Code.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`dcr01_class_tree.selectByClasssTreeId`](../../dcr/sql/dcr01_class_tree.md), [`dcr03_org_auth.deleteByOrgAuthId`](../../dcr/sql/dcr03_org_auth.md), [`dcr03_org_auth.selectByDcrOrgId`](../../dcr/sql/dcr03_org_auth.md), [`dcr30_link.selectByClassTreeId`](../../dcr/sql/dcr30_link.md), [`sys01_company.selectById`](../../sys/sql/sys01_company.md), `UpdateDataModel(dcr03_org_auth)` 동적 INSERT/UPDATE → [`dcr03_org_auth.selectById`](../../dcr/sql/dcr03_org_auth.md) |
| `sys.Sys01_Company.selectById` | Dcr03_TabPage_DcrAuth:69 | [`Sys01_Company.java:20`](../../sys/services/Sys01_Company.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys01_company.selectById`](../../sys/sql/sys01_company.md), [`sys01_company.updateMainImageId`](../../sys/sql/sys01_company.md) |

## 테이블

[`apr10_stamp`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr03_org_auth`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys01_company`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_sysdate`, `f_to_number`, `f_today`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Dcr03_Tab_DcrAuth (`client/vi/dcr/Dcr03_Tab_DcrAuth.java`, 221줄)

- 레이아웃: west=vlc, center=dcrList
- 툴바 `buttonBar`: 문서분류: {docSearch} {searchButton}
- 입력·하위 화면: `dcrList` Dcr03_TabPage_DcrAuth, `docSearch` TextField

#### 이벤트
[E0] 화면 열림 (생성자 L49-116) → retrieve()
[E1] retrieveButton[조회].Select (L54) → retrieve()
[E2] docSearch.KeyPress [Enter] (L63) → search()
[E3] searchButton[찾기].Select (L73) → search()
[E4] tree.Selection (L90) → 인라인 L90-98 (new SelectionHandler<Dcr01_ClassTreeM…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| package getMenuTree() | L118-154 | 필드 초기화 | 상태 처리 | 업무 |
| public retrieve() | L156-166 | 생성자,E1 | 서비스 dcr.Dcr01_ClassTree.selectByCompanyId | 업무 |
| private addChild() | L168-176 | getServiceResult | 상태 처리 | 업무 |
| private search() | L178-198 | E2,E3 | 상태 처리 | 업무 |
| public getServiceResult() | L201-216 | 공개 메서드 | 상태 처리 | 업무 |
| private setHtmlBarStyle() | L218-220 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="search" onClick={search}>찾기</Button>
2. <Button type="search" onClick={retrieve}>조회</Button>

### Dcr03_TabPage_DcrAuth (`client/vi/dcr/Dcr03_TabPage_DcrAuth.java`, 227줄)

- 입력·하위 화면: `lookup` Dcr30_Lookup_Link
- 그리드 `treeGrid` (buildTreeGrid(), 트리):
  - korName 300 "조직명" Text
  - orgCode 100 "조직코드" TextCenter
  - retrieveYnCheck 60 "조회" Boolean
  - updateYnCheck 60 "작성" Boolean
  - note 400 "비고" Text

#### 이벤트
[E0] 화면 열림 (생성자 L47-66) → settings()
[E1] hiperLink.Click (L86) → 인라인 L86-97 (new ClickHandler() { @Override public…)
[E2] updateButton[저장].Select (L98) → update()
[E3] treeGrid.CellMouseDown [event.getRowIndex() >= 0] (L105) → getColumn()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private getColumn() | L117-158 | E3 | 상태 처리 | 업무 |
| public buildTreeGrid() | L160-169 | 필드 초기화 | 상태 처리 | 업무 |
| public retrieve() | L171-178 | update | 서비스 org.Org01_Code.selectByDcrCodeId | 업무 |
| private addChildItem() | L180-190 | getServiceResult | 상태 처리 | 업무 |
| public getServiceResult() | L193-206 | settings | 상태 처리 | 업무 |
| private update() | L208-217 | E2 | 서비스 org.Org01_Code.updateDcrAuth(dcrCodeId) | 업무 |
| public retrieve() | L219-222 | update | 상태 처리 | 업무 |
| private settings() | L68-115 | 생성자 | 조회창 Dcr30_Lookup_Link 열기, 서비스 sys.Sys01_Company.selectById(companyId), 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlCheckBoxStyle() | L224-226 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildTreeGrid = () => [
  gb.text('korNm', 300, '조직명'),  // L162
  gb.textCenter('orgCd', 100, '조직코드'),  // L163
  // ⚠DB없음 L164 retrieveYnCheck 60 "조회" (org01_retrieve_yn_check 컬럼 없음)
  // ⚠DB없음 L165 updateYnCheck 60 "작성" (org01_update_yn_check 컬럼 없음)
  gb.text('note', 400, '비고'),  // L166
];
```

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>

