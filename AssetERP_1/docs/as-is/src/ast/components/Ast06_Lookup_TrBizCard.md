# Ast06_Lookup_TrBizCard

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `biz`
- 파일: `client/vi/ast/Ast06_Lookup_TrBizCard.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Ast01_Lookup_Info`](../../ast/components/Ast01_Lookup_Info.md), [`Sys15_Lookup_Corp`](../../sys/components/Sys15_Lookup_Corp.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `act.Act04_GenLedger.checkClose` | Ast06_Lookup_TrBizCard:259 | [`Act04_GenLedger.java:168`](../../act/services/Act04_GenLedger.md) | [`act04_gen_ledger.checkCloseCount`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.selectCloseDateCount`](../../act/sql/act04_gen_ledger.md) |
| `ast.Ast06_Tr.selectByCardApprovalNo` | Ast06_Lookup_TrBizCard:196 | [`Ast06_Tr.java:233`](../../ast/services/Ast06_Tr.md) | [`ast06_tr.selectByCardApprovalNo`](../../ast/sql/ast06_tr.md) |
| `ast.Ast06_Tr.updateDepn` | Ast06_Lookup_TrBizCard:282 | [`Ast06_Tr.java:574`](../../ast/services/Ast06_Tr.md) | [`ast09_book.createDepnBook`](../../ast/sql/ast09_book.md), `UpdateDataModel(ast06_tr)` 동적 INSERT/UPDATE → [`ast06_tr.selectById`](../../ast/sql/ast06_tr.md) |
| `getSeq` | Ast06_Lookup_TrBizCard:231 | (공통) 채번 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`) |
| `sys.Sys00_Common.selectWindowUseTrCode` | Ast06_Lookup_TrBizCard:101 | [`Sys00_Common.java:101`](../../sys/services/Sys00_Common.md) | [`sys00_common.selectWindowUseTrCode`](../../sys/sql/sys00_common.md) |

## 테이블

[`act05_gen_ledger_close`](../../../db/tables/act.md), [`ast05_tr_code`](../../../db/tables/ast.md), [`ast06_tr`](../../../db/tables/ast.md), [`ast15_tr_code_window`](../../../db/tables/ast.md), [`sys09_code`](../../../db/tables/sys.md)

## DB 함수

`f_ast_class_tree_nm_allpath`, `f_cdnm`, `f_create_depnbook`, `f_create_seq`, `f_get_corp_nm`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ast06_Lookup_TrBizCard (`client/vi/ast/Ast06_Lookup_TrBizCard.java`, 331줄)

- 입력·하위 화면: `date` MyDateField, `trCode` TextField, `corpId` LongField, `astClassTreeId` LongField, `note` TextField, `corpName` LookupTriggerField, `classTreeFullName` LookupTriggerField, `trName` CommonComboBoxField("sys.Sys00_Common.selectWindowUseTrCode"), `lookupCorp` Sys15_Lookup_Corp, `lookupInfo` Ast01_Lookup_Info

#### 이벤트
[E0] 화면 열림 (생성자 L71-85) → setting(), getEditor(), show()
[E1] trName[거래유형].Collapse (L102) → 인라인 L102-107 (new CollapseHandler() { @Override pub…)
[E2] corpName[거래처].TriggerClick (L110) → 인라인 L110-123 (new TriggerClickHandler(){ @Override …)
[E3] classTreeFullName.TriggerClick [trName.getCode() == null] (L126) → 메시지 "거래유형을 선택하세요"
[E4] updateButton[저장].Select (L148) → preUpdate()
[E5] closeButton[닫기].Select (L154) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L87-93 | 공개 메서드 | 상태 처리 | 업무 |
| private setting() | L95-160 | 생성자 | 조회창 Sys15_Lookup_Corp 열기, 조회창 Ast01_Lookup_Info 열기, 서비스 sys.Sys00_Common.selectWindowUseTrCode | 업무 |
| private getEditor() | L162-193 | 생성자 | 상태 처리 | 업무 |
| private retrieve() | L195-212 | open | 서비스 ast.Ast06_Tr.selectByCardApprovalNo(companyId, cardApprovalNo) | 업무 |
| private insertRow() | L214-241 | retrieve | 상태 처리 | 업무 |
| public preUpdate() | L243-276 | E4 | 서비스 act.Act04_GenLedger.checkClose(companyId, stdDate) | 업무 |
| private update() | L278-302 | preUpdate | 서비스 ast.Ast06_Tr.updateDepn(personId) | 업무 |
| private setHtmlStyle() | L324-326 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L328-330 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={preUpdate}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

