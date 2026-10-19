# Act02_Grid_CreateJournal

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `pay`
- 파일: `client/vi/act/Act02_Grid_CreateJournal.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `act.Act03_JournalDtl.selectByJournalId` | Act02_Grid_CreateJournal:77 | [`Act03_JournalDtl.java:32`](../../act/services/Act03_JournalDtl.md) | [`act03_journal_dtl.selectByJournalId`](../../act/sql/act03_journal_dtl.md) |

## 테이블

[`act02_journal`](../../../db/tables/act.md), [`act03_journal_dtl`](../../../db/tables/act.md), [`ast06_tr`](../../../db/tables/ast.md), [`ast07_settle`](../../../db/tables/ast.md), [`biz01_promo`](../../../db/tables/biz.md)

## DB 함수

`f_ast_class_tree_nm`, `f_cdnm`, `f_get_account_nm`, `f_get_journal_corp_nm`, `f_get_journal_note`, `f_get_journal_tr_cd`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Act02_Grid_CreateJournal (`client/vi/act/Act02_Grid_CreateJournal.java`, 92줄)

- 레이아웃: center=vlc
- 그리드 `grid` (buildGrid()):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - drAccountCode 120 "계정코드" TextCenter 편집:"456EA6"
  - drAstAccountName 350 "계정과목" TextArea2 편집:"456EA6"
  - drAmt 120 "금액" Long 편집:"456EA6"
  - drNote 180 "적요" TextArea2 편집:"456EA6"
  - crAccountCode 120 "계정코드" TextCenter 편집:"DD5E5E"
  - crAstAccountName 350 "계정과목" TextArea2 편집:"DD5E5E"
  - crAmt 120 "금액" Long 편집:"DD5E5E"
  - crNote 180 "적요" TextArea2 편집:"DD5E5E"

#### 이벤트
[E0] 화면 열림 (생성자 L27-38) → 초기화

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L64-67 | 공개 메서드 | 상태 처리 | 업무 |
| public init() | L69-71 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L73-86 | 공개 메서드 | 서비스 act.Act03_JournalDtl.selectByJournalId(journalId) | 업무 |
| public buildGrid() | L40-62 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| public setHtmlGridStyle() | L88-91 | buildGrid | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L45 newHeaderGroupMap01newHeaderGroupConfigsetHtmlGridStyle14 100 "차변" (act03_new_header_group_map01new_header_group_configset_html_grid_style14 컬럼 없음)
  // ⚠DB없음 L46 newHeaderGroupMap04newHeaderGroupConfigsetHtmlGridStyle15 100 "대변" (act03_new_header_group_map04new_header_group_configset_html_grid_style15 컬럼 없음)
  gb.textCenter('drAccountCd', 120, '계정코드'),  // L48
  // ⚠ 대응 없음 (GridBuilder L49) addTextArea2
  gb.long('drAmt', 120, '금액'),  // L50
  // ⚠ 대응 없음 (GridBuilder L51) addTextArea2
  gb.textCenter('crAccountCd', 120, '계정코드'),  // L52
  // ⚠ 대응 없음 (GridBuilder L53) addTextArea2
  gb.long('crAmt', 120, '금액'),  // L54
  // ⚠ 대응 없음 (GridBuilder L55) addTextArea2
];
```

#### 사용된 버튼들
버튼 사용하지 않음

