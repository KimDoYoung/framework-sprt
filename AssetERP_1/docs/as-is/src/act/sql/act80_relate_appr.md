# act80_relate_appr

`server/act/mapper/act80_relate_appr.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 20 | [`act80_relate_appr`](../../../db/tables/act.md), [`apr01_appr`](../../../db/tables/apr.md) | `f_cdnm`, `f_emp_kor_nm` | `act.Act80_RelateAppr.selectById` |
| `selectByJournalId` | select | 33 | [`act02_journal`](../../../db/tables/act.md), [`act80_relate_appr`](../../../db/tables/act.md), [`apr01_appr`](../../../db/tables/apr.md), [`ast06_tr`](../../../db/tables/ast.md), [`ast07_settle`](../../../db/tables/ast.md), [`com01_relate_appr`](../../../db/tables/com.md), [`pay50_expense`](../../../db/tables/pay.md) | `f_cdnm`, `f_emp_kor_nm` | `act.Act80_RelateAppr.selectByJournalId` |
| `selectByTrId` | select | 149 | [`act02_journal`](../../../db/tables/act.md), [`act80_relate_appr`](../../../db/tables/act.md), [`apr01_appr`](../../../db/tables/apr.md), [`ast06_tr`](../../../db/tables/ast.md), [`ast07_settle`](../../../db/tables/ast.md) | `f_cdnm`, `f_emp_kor_nm` | `act.Act80_RelateAppr.selectByTrId` |
| `selectTrId` | select | 191 | [`act02_journal`](../../../db/tables/act.md) |  | `act.Act80_RelateAppr.modelUpdate` |
| `selectJournalId` | select | 197 | [`act02_journal`](../../../db/tables/act.md) |  | `act.Act80_RelateAppr.modelUpdate` |
| `insert` | insert | 203 | [`act80_relate_appr`](../../../db/tables/act.md) | `f_create_seq` | `act.Act02_Journal.createJournalBiz` |
| `deleteByJournalId` | delete | 212 | [`act80_relate_appr`](../../../db/tables/act.md) |  | `act.Act02_Journal.delete`, `act.Act02_Journal.deleteAllByJournalId` |
| `deleteByTrId` | delete | 218 | [`act80_relate_appr`](../../../db/tables/act.md) |  | `act.Act02_Journal.deleteJournalBiz`, `ast.Ast06_Tr.delete`, `ast.Ast06_Tr.deleteTrDeposit`, `ast.Ast33_FundTrans.delete` |
