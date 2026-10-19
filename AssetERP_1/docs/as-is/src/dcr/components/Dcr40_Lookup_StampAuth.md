# Dcr40_Lookup_StampAuth

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `apr`
- 파일: `client/vi/dcr/Dcr40_Lookup_StampAuth.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `dcr.Dcr01_ClassTree.selectByAllWithStampAuth` | Dcr40_Lookup_StampAuth:191 | [`Dcr01_ClassTree.java:84`](../../dcr/services/Dcr01_ClassTree.md) | [`dcr01_class_tree.selectByAllWithStampAuth`](../../dcr/sql/dcr01_class_tree.md) |
| `dcr.Dcr40_StampAuth.updateList` | Dcr40_Lookup_StampAuth:223 | [`Dcr40_StampAuth.java:35`](../../dcr/services/Dcr40_StampAuth.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`dcr40_stamp_auth.selectByStampId`](../../dcr/sql/dcr40_stamp_auth.md), `UpdateDataModel(dcr40_stamp_auth)` 동적 INSERT/UPDATE → [`dcr40_stamp_auth.selectById`](../../dcr/sql/dcr40_stamp_auth.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr40_stamp_auth`](../../../db/tables/dcr.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_sysdate`, `f_to_number`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Dcr40_Lookup_StampAuth (`client/vi/dcr/Dcr40_Lookup_StampAuth.java`, 286줄)

- 툴바 `buttonBar`: 검색: {dcrSearch} {retrieveButton}
- 툴바 `buttonBarBottom`: 미사용 적용 시, 하위 문서분류(가장 세부 항목)를 선택해야 적용됩니다.:
- 입력·하위 화면: `dcrSearch` TextField
- 그리드 `treeGrid` (buildTreeGrid(), 트리):
  - classTreeName 410 "문서분류" Text
  - stampExceptYn 80 "미사용" Boolean

#### 이벤트
[E0] 화면 열림 (생성자 L64-109) → show()
[E1] treeGrid.CellMouseDown [event.getRowIndex() >= 0] (L94) → getColumn()
[E2] dcrSearch.KeyPress [Enter] (L113) → search()
[E3] retrieveButton[조회].Select (L121) → search()
[E4] updateButton[저장].Select (L127) → update()
[E5] cancleButton[닫기].Select (L133) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L56-62 | 공개 메서드 | 상태 처리 | 업무 |
| private getColumn() | L142-169 | E1 | 상태 처리 | 업무 |
| public buildTreeGrid() | L171-176 | 필드 초기화 | 상태 처리 | 업무 |
| private addChildItem() | L178-187 | getServiceResult | 상태 처리 | 업무 |
| public retrieve() | L189-198 | open,update | 서비스 dcr.Dcr01_ClassTree.selectByAllWithStampAuth(companyId, stampId, typeCode) | 업무 |
| public getServiceResult() | L201-215 | update | 상태 처리 | 업무 |
| private update() | L217-235 | E4 | 서비스 dcr.Dcr40_StampAuth.updateList(stampId) | 업무 |
| private search() | L237-273 | E2,E3 | 상태 처리 | 업무 |
| private settings() | L111-140 | open | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlBarStyle() | L275-277 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L279-281 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L283-285 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildTreeGrid = () => [
  gb.text('classTreeNm', 410, '문서분류'),  // L173
  gb.boolean('stampExceptYn', 80, '미사용'),  // L174
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={search}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

