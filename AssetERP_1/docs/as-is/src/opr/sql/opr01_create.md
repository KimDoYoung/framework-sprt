# opr01_create

`server/opr/mapper/opr01_create.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 33 | [`apr01_appr`](../../../db/tables/apr.md), [`apr04_appr_step`](../../../db/tables/apr.md), [`emp00_trans_info`](../../../db/views.md), [`opr01_create`](../../../db/tables/opr.md), [`opr03_reg`](../../../db/tables/opr.md) | `f_cdnm`, `f_sysdate`, `f_trunc` | `opr.Opr01_Create.insertAppr` |
| `selectByTitle` | select | 74 | [`apr01_appr`](../../../db/tables/apr.md), [`apr04_appr_step`](../../../db/tables/apr.md), [`emp00_trans_info`](../../../db/views.md), [`opr01_create`](../../../db/tables/opr.md), [`opr03_reg`](../../../db/tables/opr.md) | `f_cdnm`, `f_sysdate`, `f_trunc` | `opr.Opr01_Create.selectByTitle` |
| `selectByTitle1` | select | 134 | [`emp00_trans_info`](../../../db/views.md), [`opr01_create`](../../../db/tables/opr.md), [`opr03_reg`](../../../db/tables/opr.md) | `f_cdnm`, `f_sysdate`, `f_trunc` | `opr.Opr01_Create.selectByTitle1` |
| `selectByLookupTitle` | select | 164 | [`emp00_trans_info`](../../../db/views.md), [`opr01_create`](../../../db/tables/opr.md) | `f_cdnm`, `f_emp_kor_nm`, `f_sysdate`, `f_trunc` | `opr.Opr01_Create.selectByLookupTitle` |
| `updateApprId` | update | 180 | [`opr01_create`](../../../db/tables/opr.md) |  | `opr.Opr01_Create.insertAppr` |
| `updateApprIdByApprId` | update | 186 | [`opr01_create`](../../../db/tables/opr.md) |  | `apr.Apr01_Appr.deleteByApprId`, `apr.Apr90_DisposalList.updateAppr` |
