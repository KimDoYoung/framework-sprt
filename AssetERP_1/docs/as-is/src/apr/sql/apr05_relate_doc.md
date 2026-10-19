# apr05_relate_doc

`server/apr/mapper/apr05_relate_doc.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 33 | [`apr05_relate_doc`](../../../db/tables/apr.md) |  | - |
| `selectByApprId` | select | 39 | [`apr01_appr`](../../../db/tables/apr.md), [`apr05_relate_doc`](../../../db/tables/apr.md), [`emp00_trans_info`](../../../db/views.md), [`emp01_person`](../../../db/tables/emp.md), [`sys10_file`](../../../db/tables/sys.md) |  | `apr.Apr05_RelateDoc.selectByApprId` |
| `selectByClassTreeId` | select | 54 | [`apr01_appr`](../../../db/tables/apr.md), [`apr03_relate_fund`](../../../db/tables/apr.md), [`dcr03_org_auth`](../../../db/tables/dcr.md), [`dcr04_emp_auth`](../../../db/tables/dcr.md), [`emp00_trans_info`](../../../db/views.md), [`emp01_person`](../../../db/tables/emp.md), [`fnd00_fund`](../../../db/views.md), [`fnd01_fund_code`](../../../db/tables/fnd.md), [`fnd08_org_auth`](../../../db/tables/fnd.md), [`sys10_file`](../../../db/tables/sys.md) | `f_max_workdate`, `f_sysdate` | `apr.Apr05_RelateDoc.selectByClassTreeId` |
| `deleteByApprId` | delete | 108 | [`apr05_relate_doc`](../../../db/tables/apr.md) |  | - |
