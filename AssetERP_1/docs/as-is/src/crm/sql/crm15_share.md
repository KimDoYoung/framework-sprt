# crm15_share

`server/crm/mapper/crm15_share.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 19 | [`crm12_work_detail`](../../../db/tables/crm.md), [`crm15_share`](../../../db/tables/crm.md) | `f_cdnm`, `f_emp_kor_nm`, `f_org_nm`, `f_today` | `crm.Crm15_Share.selectById` |
| `selectByWorkDetailId` | select | 29 | [`crm12_work_detail`](../../../db/tables/crm.md), [`crm15_share`](../../../db/tables/crm.md) | `f_cdnm`, `f_emp_kor_nm`, `f_org_nm`, `f_today` | `crm.Crm15_Share.selectByWorkDetailId` |
| `selectShareInfo` | select | 45 | [`crm15_share`](../../../db/tables/crm.md) | `f_emp_kor_nm`, `f_org_nm`, `f_today` | `crm.Crm15_Share.insertDefaultShare`, `crm.Crm15_Share.selectShareInfo` |
| `insertDefaultShare` | insert | 60 | [`crm14_share_default`](../../../db/tables/crm.md), [`crm15_share`](../../../db/tables/crm.md) | `f_create_seq` | `crm.Crm15_Share.insertDefaultShare` |
| `deleteByWorkDetailId` | delete | 73 | [`crm15_share`](../../../db/tables/crm.md) |  | `crm.Crm12_WorkDetail.modelUpdate`, `crm.Crm15_Share.deleteDefaultShare` |
