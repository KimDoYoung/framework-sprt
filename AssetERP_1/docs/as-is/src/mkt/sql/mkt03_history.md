# mkt03_history

`server/mkt/mapper/mkt03_history.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectShareInfo` | sql | 25 | [`mkt05_share`](../../../db/tables/mkt.md) | `f_emp_kor_nm`, `f_org_nm`, `f_today` |  |
| `selectFundInfoByCompanyId` | sql | 40 | [`fnd02_fund_info`](../../../db/tables/fnd.md), [`mkt04_relate_fund`](../../../db/tables/mkt.md) | `f_today` |  |
| `selectById` | select | 55 | [`fnd02_fund_info`](../../../db/tables/fnd.md), [`mkt01_target_company`](../../../db/tables/mkt.md), [`mkt03_history`](../../../db/tables/mkt.md), [`mkt04_relate_fund`](../../../db/tables/mkt.md), [`mkt05_share`](../../../db/tables/mkt.md), [`sys10_file`](../../../db/tables/sys.md) | `f_emp_kor_nm`, `f_get_emptrans`, `f_org_nm`, `f_today` | `mkt.Mkt03_History.selectById` |
| `selectByTargetCompanyId` | select | 82 | [`fnd02_fund_info`](../../../db/tables/fnd.md), [`mkt01_target_company`](../../../db/tables/mkt.md), [`mkt03_history`](../../../db/tables/mkt.md), [`mkt04_relate_fund`](../../../db/tables/mkt.md), [`mkt05_share`](../../../db/tables/mkt.md), [`sys10_file`](../../../db/tables/sys.md) | `f_emp_kor_nm`, `f_get_emptrans`, `f_org_nm`, `f_today` | `mkt.Mkt03_History.selectByTargetCompanyId` |
| `selectActivityHistory` | sql | 128 | [`fnd02_fund_info`](../../../db/tables/fnd.md), [`mkt01_target_company`](../../../db/tables/mkt.md), [`mkt03_history`](../../../db/tables/mkt.md), [`mkt04_relate_fund`](../../../db/tables/mkt.md), [`mkt05_share`](../../../db/tables/mkt.md), [`sys10_file`](../../../db/tables/sys.md) | `f_emp_kor_nm`, `f_get_emptrans`, `f_org_nm`, `f_today` |  |
| `selectByRegDate` | select | 166 | [`fnd02_fund_info`](../../../db/tables/fnd.md), [`mkt01_target_company`](../../../db/tables/mkt.md), [`mkt03_history`](../../../db/tables/mkt.md), [`mkt04_relate_fund`](../../../db/tables/mkt.md), [`mkt05_share`](../../../db/tables/mkt.md), [`sys10_file`](../../../db/tables/sys.md) | `f_emp_kor_nm`, `f_get_emptrans`, `f_org_nm`, `f_today` | `mkt.Mkt03_History.selectByRegDate` |
| `checkByTargetCompanyId` | select | 177 | [`mkt03_history`](../../../db/tables/mkt.md) |  | `mkt.Mkt03_History.checkByTargetCompanyId` |
