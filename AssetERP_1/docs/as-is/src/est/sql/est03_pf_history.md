# est03_pf_history

`server/est/mapper/est03_pf_history.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 27 | [`est03_pf_history`](../../../db/tables/est.md), [`est04_pf_file`](../../../db/tables/est.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_emptrans`, `f_sysdate` | `est.Est03_PfHistory.selectById` |
| `selectByPfContractId` | select | 42 | [`est03_pf_history`](../../../db/tables/est.md), [`est04_pf_file`](../../../db/tables/est.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_emptrans`, `f_sysdate` | `est.Est03_PfHistory.selectByPfContractId` |
| `selectBySearchText` | select | 59 | [`est01_pf_fee_type`](../../../db/tables/est.md), [`est02_pf_contract`](../../../db/tables/est.md), [`est03_pf_history`](../../../db/tables/est.md), [`est04_pf_file`](../../../db/tables/est.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_emptrans`, `f_sysdate` | `est.Est03_PfHistory.selectBySearchText` |
| `selectByConfirmer01` | select | 85 | [`est01_pf_fee_type`](../../../db/tables/est.md), [`est02_pf_contract`](../../../db/tables/est.md), [`est03_pf_history`](../../../db/tables/est.md), [`est04_pf_file`](../../../db/tables/est.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_emptrans`, `f_sysdate` | `est.Est03_PfHistory.selectByConfirmer01` |
| `selectByConfirmer02` | select | 112 | [`est03_pf_history`](../../../db/tables/est.md), [`est04_pf_file`](../../../db/tables/est.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_emptrans`, `f_sysdate` | `est.Est03_PfHistory.selectByConfirmer02` |
| `checkNo` | select | 130 | [`est03_pf_history`](../../../db/tables/est.md) |  | `est.Est03_PfHistory.modelUpdate` |
| `checkList` | select | 138 | [`est03_pf_history`](../../../db/tables/est.md) |  | `est.Est03_PfHistory.checkList` |
| `getConfirmerParent` | select | 146 | - | `f_emp_kor_nm`, `f_get_confirmer_parent` | `est.Est03_PfHistory.getConfirmerParent` |
| `updateConfirm` | update | 152 | [`est03_pf_history`](../../../db/tables/est.md) | `f_sysdate` | `est.Est03_PfHistory.updateConfirm` |
