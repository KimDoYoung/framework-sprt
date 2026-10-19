# apr90_disposal_list

`server/apr/mapper/apr90_disposal_list.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 26 | [`apr01_appr`](../../../db/tables/apr.md), [`apr90_disposal_list`](../../../db/tables/apr.md), [`apr99_appr_del`](../../../db/tables/apr.md) | `f_cdnm`, `f_emp_kor_nm` | `apr.Apr90_DisposalList.selectById` |
| `selectByCompanyId` | select | 53 | [`apr01_appr`](../../../db/tables/apr.md), [`apr90_disposal_list`](../../../db/tables/apr.md), [`apr99_appr_del`](../../../db/tables/apr.md) | `f_cdnm`, `f_emp_kor_nm` | `apr.Apr90_DisposalList.selectByCompanyId` |
| `selectByPersonId` | select | 88 | [`apr01_appr`](../../../db/tables/apr.md), [`apr90_disposal_list`](../../../db/tables/apr.md), [`apr99_appr_del`](../../../db/tables/apr.md) | `f_cdnm`, `f_emp_kor_nm` | `apr.Apr90_DisposalList.selectByPersonId` |
| `checkDisposal` | select | 117 | [`apr90_disposal_list`](../../../db/tables/apr.md) |  | `apr.Apr90_DisposalList.checkDisposal` |
| `deleteByApprId` | delete | 125 | [`apr90_disposal_list`](../../../db/tables/apr.md) |  | `apr.Apr99_ApprDel.restore` |
| `updateDisposalCode` | update | 131 | [`apr90_disposal_list`](../../../db/tables/apr.md) |  | `apr.Apr90_DisposalList.updateAppr` |
