# flt06_account_close

`server/flt/mapper/flt06_account_close.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 26 | [`apr01_appr`](../../../db/tables/apr.md), [`flt03_account`](../../../db/tables/flt.md), [`flt06_account_close`](../../../db/tables/flt.md), [`sys15_corp`](../../../db/tables/sys.md) | `f_cdnm`, `f_get_itemtype_nm`, `f_sysdate`, `to_decrypts` | `flt.Flt06_AccountClose.selectById` |
| `selectByPersonId` | select | 45 | [`apr01_appr`](../../../db/tables/apr.md), [`flt03_account`](../../../db/tables/flt.md), [`flt06_account_close`](../../../db/tables/flt.md), [`sys15_corp`](../../../db/tables/sys.md) | `f_cdnm`, `f_get_itemtype_nm`, `f_sysdate`, `to_decrypts` | `flt.Flt06_AccountClose.selectByPersonId` |
| `updateApprId` | update | 67 | [`flt06_account_close`](../../../db/tables/flt.md) |  | `flt.Flt06_AccountClose.updateApprId` |
| `insert` | insert | 73 | [`flt06_account_close`](../../../db/tables/flt.md) | `f_create_seq` | `flt.Flt06_AccountClose.insert` |
