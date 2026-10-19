# mkt05_share

`server/mkt/mapper/mkt05_share.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 19 | [`mkt05_share`](../../../db/tables/mkt.md) | `f_cdnm`, `f_emp_kor_nm`, `f_org_nm`, `f_today` | `mkt.Mkt05_Share.selectById` |
| `selectByParentId` | select | 28 | [`mkt05_share`](../../../db/tables/mkt.md) | `f_cdnm`, `f_emp_kor_nm`, `f_org_nm`, `f_today` | `mkt.Mkt05_Share.selectByParentId` |
| `selectShareInfo` | select | 37 | [`mkt05_share`](../../../db/tables/mkt.md) | `f_emp_kor_nm`, `f_org_nm`, `f_today` | `mkt.Mkt05_Share.insertDefaultShare`, `mkt.Mkt05_Share.selectShareInfo` |
| `insertDefaultShare` | insert | 52 | [`mkt05_share`](../../../db/tables/mkt.md) | `f_create_seq` | `mkt.Mkt05_Share.insertDefaultShare` |
| `deleteByParentId` | delete | 65 | [`mkt05_share`](../../../db/tables/mkt.md) |  | `mkt.Mkt01_TargetCompany.delete`, `mkt.Mkt03_History.delete`, `mkt.Mkt05_Share.deleteDefaultShare` |
