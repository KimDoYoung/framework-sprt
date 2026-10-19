# Ast07_Lookup_SettleMulti

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `pay`
- 파일: `client/vi/ast/Ast07_Lookup_SettleMulti.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Ast01_Lookup_CorpAccount`](../../ast/components/Ast01_Lookup_CorpAccount.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `act.Act04_GenLedger.checkClose` | Ast07_Lookup_SettleMulti:137 | [`Act04_GenLedger.java:168`](../../act/services/Act04_GenLedger.md) | [`act04_gen_ledger.checkCloseCount`](../../act/sql/act04_gen_ledger.md), [`act04_gen_ledger.selectCloseDateCount`](../../act/sql/act04_gen_ledger.md) |
| `ast.Ast06_Tr.updateDeposit` | Ast07_Lookup_SettleMulti:187 | [`Ast06_Tr.java:491`](../../ast/services/Ast06_Tr.md) | [`ast09_book.createDepositBook`](../../ast/sql/ast09_book.md) |
| `ast.Ast07_Settle.updateMulti` | Ast07_Lookup_SettleMulti:162 | [`Ast07_Settle.java:277`](../../ast/services/Ast07_Settle.md) | [`act02_journal.createJournal`](../../act/sql/act02_journal.md), [`ast07_settle.insert`](../../ast/sql/ast07_settle.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`) |

## 테이블

[`act05_gen_ledger_close`](../../../db/tables/act.md), [`ast07_settle`](../../../db/tables/ast.md)

## DB 함수

`f_create_depositbook`, `f_create_journal`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ast07_Lookup_SettleMulti (`client/vi/ast/Ast07_Lookup_SettleMulti.java`, 219줄)

- 입력·하위 화면: `settleDate` MyDateField, `depositId` LongField, `depositName` LookupTriggerField, `lookupCorpAccount` Ast01_Lookup_CorpAccount

#### 이벤트
[E0] 화면 열림 (생성자 L50-66) → setting(), getEditor(), show()
[E1] depositName[예금계좌].TriggerClick [result == null] (L78) → 인라인 L78-96 (new TriggerClickHandler(){ @Override …)
[E2] updateButton[저장].Select (L98) → preUpdate()
[E3] closeButton[닫기].Select (L104) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L69-71 | 공개 메서드 | 상태 처리 | 업무 |
| private setting() | L73-110 | 생성자 | 조회창 Ast01_Lookup_CorpAccount 열기 | 업무 |
| private getEditor() | L112-123 | 생성자 | 상태 처리 | 업무 |
| public preUpdate() | L125-152 | E2 | 서비스 act.Act04_GenLedger.checkClose(companyId, stdDate) | 업무 |
| private update() | L154-181 | preUpdate | 서비스 ast.Ast07_Settle.updateMulti(personId, settleDate, depositId) | 업무 |
| private updateDepositBook() | L183-210 | update | 서비스 ast.Ast06_Tr.updateDeposit(companyId, stdDate) | 업무 |
| private setHtmlStyle() | L212-214 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L215-217 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={preUpdate}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

