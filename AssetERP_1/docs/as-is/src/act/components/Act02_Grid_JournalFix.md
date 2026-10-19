# Act02_Grid_JournalFix

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `ast`
- 파일: `client/vi/act/Act02_Grid_JournalFix.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Act02_Lookup_ModiForJournal`](../../act/components/Act02_Lookup_ModiForJournal.md), [`Act02_Lookup_ModiJournal`](../../act/components/Act02_Lookup_ModiJournal.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `act.Act02_Journal.selectById` | Act02_Grid_JournalFix:118 | [`Act02_Journal.java:31`](../../act/services/Act02_Journal.md) | [`act02_journal.selectById`](../../act/sql/act02_journal.md) |
| `act.Act03_JournalDtl.selectByJournalId` | Act02_Grid_JournalFix:147 | [`Act03_JournalDtl.java:32`](../../act/services/Act03_JournalDtl.md) | [`act03_journal_dtl.selectByJournalId`](../../act/sql/act03_journal_dtl.md) |

## 테이블

[`act02_journal`](../../../db/tables/act.md), [`act03_journal_dtl`](../../../db/tables/act.md), [`act80_relate_appr`](../../../db/tables/act.md), [`apr01_appr`](../../../db/tables/apr.md), [`ast06_tr`](../../../db/tables/ast.md), [`ast07_settle`](../../../db/tables/ast.md), [`biz01_promo`](../../../db/tables/biz.md)

## DB 함수

`f_ast_class_tree_nm`, `f_cdnm`, `f_emp_kor_nm`, `f_get_account_nm`, `f_get_journal_corp_nm`, `f_get_journal_note`, `f_get_journal_tr_cd`, `f_get_relate_dcr_count`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Act02_Grid_JournalFix (`client/vi/act/Act02_Grid_JournalFix.java`, 174줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: {modiButton}
- 입력·하위 화면: `lookupModiJournal` Act02_Lookup_ModiJournal, `lookupModiForJournal` Act02_Lookup_ModiForJournal
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - trName 150 "거래유형" TextArea
  - drAccountCode 100 "계정코드" TextCenter 편집:"456EA6"
  - drAstAccountName 300 "계정과목" TextArea2 편집:"456EA6"
  - drAmt 100 "금액" Long 편집:"456EA6"
  - drNote 200 "적요" TextArea2 편집:"456EA6"
  - crAccountCode 100 "계정코드" TextCenter 편집:"DD5E5E"
  - crAstAccountName 300 "계정과목" TextArea2 편집:"DD5E5E"
  - crAmt 100 "금액" Long 편집:"DD5E5E"
  - crNote 200 "적요" TextArea2 편집:"DD5E5E"

#### 이벤트
[E0] 화면 열림 (생성자 L41-58) → settings()
[E1] modiButton[변경].Select [journalModel == null] (L61) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L117-131 | E1 | 서비스 act.Act02_Journal.selectById(journalId) | 업무 |
| public retrieve() | L133-136 | E1 | 상태 처리 | 업무 |
| public gridClear() | L138-140 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L143-156 | E1 | 서비스 act.Act03_JournalDtl.selectByJournalId(journalId) | 업무 |
| public update() | L159-160 | 공개 메서드 | 상태 처리 | 업무 |
| public insertRow() | L163-164 | 공개 메서드 | 상태 처리 | 업무 |
| public deleteRow() | L167-168 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L60-87 | 생성자 | 조회창 Act02_Lookup_ModiJournal 열기, 조회창 Act02_Lookup_ModiForJournal 열기, 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L89-115 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| public setHtmlGridStyle() | L170-173 | buildGrid | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L94 newHeaderGroupMap03newHeaderGroupConfigsetHtmlGridStyle14 100 "차변" (act03_new_header_group_map03new_header_group_configset_html_grid_style14 컬럼 없음)
  // ⚠DB없음 L95 newHeaderGroupMap06newHeaderGroupConfigsetHtmlGridStyle15 100 "대변" (act03_new_header_group_map06new_header_group_configset_html_grid_style15 컬럼 없음)
  gb.textArea('trNm', 150, '거래유형'),  // L98
  gb.textCenter('drAccountCd', 100, '계정코드'),  // L99
  // ⚠ 대응 없음 (GridBuilder L100) addTextArea2
  gb.long('drAmt', 100, '금액'),  // L101
  // ⚠ 대응 없음 (GridBuilder L103) addTextArea2
  gb.textCenter('crAccountCd', 100, '계정코드'),  // L104
  // ⚠ 대응 없음 (GridBuilder L105) addTextArea2
  gb.long('crAmt', 100, '금액'),  // L106
  // ⚠ 대응 없음 (GridBuilder L108) addTextArea2
];
```

#### 사용된 버튼들
1. <Button type="change" onClick={retrieve}>변경</Button>

