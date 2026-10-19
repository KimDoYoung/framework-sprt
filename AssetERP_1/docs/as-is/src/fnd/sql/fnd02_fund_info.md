# fnd02_fund_info

`server/fnd/mapper/fnd02_fund_info.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 71 | [`fnd02_fund_info`](../../../db/tables/fnd.md) |  | `fnd.Fnd02_FundInfo.selectById` |
| `selectByFundCodeId` | select | 77 | [`fnd01_fund_code`](../../../db/tables/fnd.md), [`fnd02_fund_info`](../../../db/tables/fnd.md) |  | - |
| `selectByFundCode` | select | 86 | [`fnd01_fund_code`](../../../db/tables/fnd.md), [`fnd02_fund_info`](../../../db/tables/fnd.md), [`fnd03_consignment`](../../../db/tables/fnd.md), [`fnd06_office_work`](../../../db/tables/fnd.md), [`fnd09_trust_bank`](../../../db/tables/fnd.md) | `f_cdnm`, `f_emp_kor_nm` | `fnd.Fnd02_FundInfo.selectByFundCode` |
| `selectOneByWorkDate` | select | 120 | [`fnd02_fund_info`](../../../db/tables/fnd.md) |  | - |
| `selectByNamePaging` | select | 129 | [`fnd01_fund_code`](../../../db/tables/fnd.md), [`fnd02_fund_info`](../../../db/tables/fnd.md), [`fnd03_consignment`](../../../db/tables/fnd.md), [`fnd06_office_work`](../../../db/tables/fnd.md), [`fnd09_trust_bank`](../../../db/tables/fnd.md), [`icam06_fund_book`](../../../db/tables/icam.md), [`ifi29_am_corp_mapping`](../../../db/tables/ifi.md), [`ifi32_fund_price`](../../../db/tables/ifi.md), [`sys01_company`](../../../db/tables/sys.md) | `f_cdnm`, `f_emp_kor_nm` | `fnd.Fnd02_FundInfo.selectByPaging` |
| `selectByNameTotal` | select | 184 | [`fnd01_fund_code`](../../../db/tables/fnd.md), [`fnd02_fund_info`](../../../db/tables/fnd.md) |  | `fnd.Fnd02_FundInfo.selectByPaging` |
| `insertUpdate` | insert | 193 | [`fnd02_fund_info`](../../../db/tables/fnd.md) |  | - |
| `insert` | insert | 358 | [`fnd02_fund_info`](../../../db/tables/fnd.md) | `f_create_seq`, `f_sysdate` | - |
| `deleteByWorkDate` | delete | 407 | [`fnd01_fund_code`](../../../db/tables/fnd.md), [`fnd02_fund_info`](../../../db/tables/fnd.md) | `f_trunc` | - |
| `excelInsert` | insert | 421 | [`fnd02_fund_info`](../../../db/tables/fnd.md) |  | - |
| `excelDelete` | delete | 459 | [`fnd02_fund_info`](../../../db/tables/fnd.md) | `f_trunc` | - |
| `deleteByWorkDateAndFundCodeId` | delete | 466 | [`fnd02_fund_info`](../../../db/tables/fnd.md) | `f_trunc` | - |
