# biz15_share

`server/biz/mapper/biz15_share.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 19 | [`biz15_share`](../../../db/tables/biz.md), [`sch01_info`](../../../db/tables/sch.md), [`sys01_company`](../../../db/tables/sys.md) | `f_cdnm`, `f_emp_kor_nm`, `f_org_nm`, `f_sysdate` | `biz.Biz15_Share.selectById` |
| `selectByContHistoryId` | select | 32 | [`biz11_cont_history`](../../../db/tables/biz.md), [`biz15_share`](../../../db/tables/biz.md), [`sys01_company`](../../../db/tables/sys.md) | `f_cdnm`, `f_emp_kor_nm`, `f_org_nm`, `f_sysdate` | `biz.Biz15_Share.selectByContHistoryId` |
| `insertUpdate` | insert | 44 | [`biz10_cont_corp`](../../../db/tables/biz.md), [`biz11_cont_history`](../../../db/tables/biz.md), [`biz15_share`](../../../db/tables/biz.md) | `f_create_seq` | `biz.Biz10_ContCorp.insertUpdate` |
| `insert` | insert | 64 | [`biz10_cont_corp`](../../../db/tables/biz.md), [`biz11_cont_history`](../../../db/tables/biz.md), [`biz15_share`](../../../db/tables/biz.md) | `f_create_seq` | `biz.Biz15_Share.insert` |
| `deleteContCorpId` | delete | 85 | [`biz11_cont_history`](../../../db/tables/biz.md), [`biz15_share`](../../../db/tables/biz.md) |  | `biz.Biz11_ContHistory.deleteContCorpId` |
