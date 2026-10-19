# com01_relate_appr

`server/com/mapper/com01_relate_appr.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 21 | [`com01_relate_appr`](../../../db/tables/com.md) |  | `com.Com01_RelateAppr.selectById` |
| `selectByKeyTableId` | select | 27 | [`apr01_appr`](../../../db/tables/apr.md), [`com01_relate_appr`](../../../db/tables/com.md) | `f_cdnm`, `f_emp_kor_nm` | `com.Com01_RelateAppr.selectByKeyTableId` |
| `selectByExpenseIdList` | select | 39 | [`apr01_appr`](../../../db/tables/apr.md), [`com01_relate_appr`](../../../db/tables/com.md) |  | `com.Com01_RelateAppr.selectByExpenseIdList` |
| `checkUseRelateApprId` | select | 53 | - |  | `apr.Apr90_DisposalList.checkDisposal` |
| `deleteByKeyTableId` | delete | 57 | [`com01_relate_appr`](../../../db/tables/com.md) |  | `biz.Biz51_ErpContCorp.deleteList`, `pay.Pay50_Expense.deleteJournal`, `pay.Pay50_Expense.deleteRequest`, `tdm.Tdm52_ChckManl.batchCancelComplete`, `tdm.Tdm52_ChckManl.deleteTmpFile`, `tdm.Tdm52_ChckManl.updateCheckStatus` |
| `insertCopy` | insert | 63 | [`com01_relate_appr`](../../../db/tables/com.md) | `f_create_seq` | `tdm.Tdm52_ChckManl.batchCheckComplete` |
