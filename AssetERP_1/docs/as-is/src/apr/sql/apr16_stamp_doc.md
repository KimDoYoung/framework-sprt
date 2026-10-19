# apr16_stamp_doc

`server/apr/mapper/apr16_stamp_doc.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 48 | [`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`apr15_repr_corp`](../../../db/tables/apr.md), [`apr16_stamp_doc`](../../../db/tables/apr.md), [`emp01_person`](../../../db/tables/emp.md), [`sys01_company`](../../../db/tables/sys.md) | `f_cdnm`, `f_today` | `apr.Apr16_StampDoc.selectById` |
| `selectByApplEmpId` | select | 72 | [`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`apr15_repr_corp`](../../../db/tables/apr.md), [`apr16_stamp_doc`](../../../db/tables/apr.md), [`emp01_person`](../../../db/tables/emp.md), [`sys01_company`](../../../db/tables/sys.md) | `f_cdnm` | `apr.Apr16_StampDoc.selectByApplEmpId` |
| `selectApplDocByRegDateIsNull` | select | 104 | [`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`apr15_repr_corp`](../../../db/tables/apr.md), [`apr16_stamp_doc`](../../../db/tables/apr.md), [`emp01_person`](../../../db/tables/emp.md), [`sys01_company`](../../../db/tables/sys.md) | `f_cdnm`, `f_today` | `apr.Apr16_StampDoc.selectApplDocByRegDateIsNull` |
| `selectDocByRegDate` | select | 125 | [`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`apr15_repr_corp`](../../../db/tables/apr.md), [`apr16_stamp_doc`](../../../db/tables/apr.md), [`emp01_person`](../../../db/tables/emp.md), [`sys01_company`](../../../db/tables/sys.md) | `f_cdnm` | `apr.Apr16_StampDoc.selectDocByRegDate`, `sys.Sys99_Print.insertRdStampDocManager` |
| `selectByApplType` | select | 162 | [`apr10_stamp`](../../../db/tables/apr.md), [`apr15_repr_corp`](../../../db/tables/apr.md), [`apr16_stamp_doc`](../../../db/tables/apr.md), [`sys01_company`](../../../db/tables/sys.md) | `f_cdnm`, `f_today` | `apr.Apr16_StampDoc.selectByApplType` |
| `selectDocGroupSum` | select | 192 | [`apr10_stamp`](../../../db/tables/apr.md), [`apr15_repr_corp`](../../../db/tables/apr.md), [`apr16_stamp_doc`](../../../db/tables/apr.md), [`sys01_company`](../../../db/tables/sys.md) | `f_cdnm`, `f_today` | `apr.Apr16_StampDoc.selectDocGroupSum` |
| `selectStampByCompanyId` | select | 228 | [`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`apr16_stamp_doc`](../../../db/tables/apr.md), [`apr99_appr_del`](../../../db/tables/apr.md), [`emp01_person`](../../../db/tables/emp.md), [`org10_role_stamp`](../../../db/tables/org.md), [`sys10_file`](../../../db/tables/sys.md) |  | `apr.Apr16_StampDoc.selectStampByCompanyId`, `sys.Sys99_Print.insertRdStampListApr16` |
| `selectStampCheck` | select | 343 | [`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`apr16_stamp_doc`](../../../db/tables/apr.md), [`emp01_person`](../../../db/tables/emp.md), [`sys10_file`](../../../db/tables/sys.md) |  | `apr.Apr16_StampDoc.selectStampCheck` |
| `selectByReprCorpId` | select | 382 | [`apr16_stamp_doc`](../../../db/tables/apr.md) |  | `apr.Apr15_ReprCorp.delete` |
| `selectSimpleById` | select | 388 | [`apr16_stamp_doc`](../../../db/tables/apr.md) |  | `apr.Apr16_StampDoc.deleteReg` |
| `selectProvideCoByApprId` | select | 394 | [`apr16_stamp_doc`](../../../db/tables/apr.md) |  | `apr.Apr16_StampDoc.selectProvideCoByApprId` |
| `selectByApprId` | select | 404 | [`apr10_stamp`](../../../db/tables/apr.md), [`apr15_repr_corp`](../../../db/tables/apr.md), [`apr16_stamp_doc`](../../../db/tables/apr.md), [`sys01_company`](../../../db/tables/sys.md) | `f_cdnm`, `f_today` | `apr.Apr16_StampDoc.selectByApprId` |
| `updateByApprId` | update | 424 | [`apr16_stamp_doc`](../../../db/tables/apr.md) |  | `apr.Apr01_Appr.update` |
| `updateRegDate` | update | 432 | [`apr16_stamp_doc`](../../../db/tables/apr.md) |  | `apr.Apr16_StampDoc.deleteReg` |
| `updateConfirmDate` | update | 438 | [`apr16_stamp_doc`](../../../db/tables/apr.md) |  | `apr.Apr16_StampDoc.updateConfirmDate` |
| `updateStampDate` | update | 445 | [`apr16_stamp_doc`](../../../db/tables/apr.md) |  | `apr.Apr16_StampDoc.updateStampDate` |
| `deleteById` | delete | 451 | [`apr16_stamp_doc`](../../../db/tables/apr.md) |  | `apr.Apr16_StampDoc.deleteReg` |
| `deleteByApprId` | delete | 457 | [`apr16_stamp_doc`](../../../db/tables/apr.md) |  | `apr.Apr16_StampDoc.deleteByApprId` |
