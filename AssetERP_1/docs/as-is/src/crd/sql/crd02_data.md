# crd02_data

`server/crd/mapper/crd02_data.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 46 | [`biz01_promo`](../../../db/tables/biz.md), [`crd02_data`](../../../db/tables/crd.md) | `f_cdnm`, `f_sysdate` | `crd.Crd02_Data.selectById` |
| `selectByText` | select | 56 | [`biz01_promo`](../../../db/tables/biz.md), [`crd02_data`](../../../db/tables/crd.md) | `f_cdnm`, `f_sysdate` | `crd.Crd02_Data.selectByText` |
| `selectByTextPaging` | select | 76 | [`biz01_promo`](../../../db/tables/biz.md), [`crd02_data`](../../../db/tables/crd.md) | `f_cdnm`, `f_sysdate` | `crd.Crd02_Data.selectByPaging` |
| `selectByTextTotal` | select | 98 | [`biz01_promo`](../../../db/tables/biz.md), [`crd02_data`](../../../db/tables/crd.md) | `f_cdnm`, `f_sysdate` | `crd.Crd02_Data.selectByPaging` |
| `selectByAmt` | select | 118 | [`biz01_promo`](../../../db/tables/biz.md), [`crd02_data`](../../../db/tables/crd.md) |  | `crd.Crd02_Data.selectByAmt` |
| `selectByCompanyId` | select | 135 | [`crd02_data`](../../../db/tables/crd.md) |  | `biz.Biz01_Promo.targetCheck`, `biz.Biz01_Promo.targetListCheck` |
| `selectByCardNo` | select | 143 | [`crd02_data`](../../../db/tables/crd.md) | `f_cdnm`, `f_sysdate` | `crd.Crd02_Data.selectByCardNo` |
| `selectByDataYm` | select | 151 | [`biz01_promo`](../../../db/tables/biz.md), [`crd02_data`](../../../db/tables/crd.md) |  | - |
| `selectByCompareAmt` | select | 167 | [`biz01_promo`](../../../db/tables/biz.md), [`crd02_data`](../../../db/tables/crd.md) |  | `biz.Biz01_Promo.compareCheck`, `crd.Crd02_Data.selectByCompareAmt` |
| `selectCancelData` | select | 244 | [`crd02_data`](../../../db/tables/crd.md) |  | - |
| `selectByApprovalNo` | select | 253 | [`crd02_data`](../../../db/tables/crd.md) |  | - |
| `KBCard` | select | 264 | [`crd01_card`](../../../db/tables/crd.md), [`crd02_data`](../../../db/tables/crd.md), [`sys01_company`](../../../db/tables/sys.md) |  | `biz.Biz01_Promo.insert` |
| `targetCheck` | select | 280 | [`crd02_data`](../../../db/tables/crd.md) |  | - |
| `getApprovalNo` | select | 288 | [`crd02_data`](../../../db/tables/crd.md) |  | - |
| `targetDelete` | delete | 300 | [`crd02_data`](../../../db/tables/crd.md) |  | `crd.Crd02_Data.targetDelete` |
| `deleteCancelData` | delete | 308 | [`crd02_data`](../../../db/tables/crd.md) |  | - |
| `updateApprovalNo` | update | 318 | [`crd02_data`](../../../db/tables/crd.md) |  | - |
| `insert` | insert | 325 | [`crd02_data`](../../../db/tables/crd.md) |  | - |
| `delete` | delete | 384 | [`crd02_data`](../../../db/tables/crd.md) |  | - |
| `deleteDataId` | delete | 391 | [`crd02_data`](../../../db/tables/crd.md) |  | - |
