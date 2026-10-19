# crm01_item

`server/crm/mapper/crm01_item.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 37 | [`crm01_item`](../../../db/tables/crm.md), [`crm11_count`](../../../db/tables/crm.md), [`emp01_person`](../../../db/tables/emp.md) | `f_cdnm`, `f_org_nm`, `f_sysdate` | `crm.Crm01_Item.selectById` |
| `selectByText` | select | 58 | [`crm01_item`](../../../db/tables/crm.md), [`crm11_count`](../../../db/tables/crm.md), [`emp01_person`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md) | `f_cdnm`, `f_org_nm`, `f_sysdate` | `crm.Crm01_Item.selectByText` |
| `selectByParentId` | select | 132 | [`crm01_item`](../../../db/tables/crm.md), [`crm11_count`](../../../db/tables/crm.md), [`emp01_person`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md) | `f_cdnm`, `f_org_nm`, `f_sysdate` | `crm.Crm01_Item.delete`, `crm.Crm01_Item.selectByText` |
