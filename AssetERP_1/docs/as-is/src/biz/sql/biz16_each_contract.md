# biz16_each_contract

`server/biz/mapper/biz16_each_cont.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 28 | [`biz16_each_contract`](../../../db/tables/biz.md) |  | `biz.Biz16_EachCont.selectById` |
| `selectByCorpId` | select | 34 | [`apr01_appr`](../../../db/tables/apr.md), [`biz16_each_contract`](../../../db/tables/biz.md) | `f_cdnm`, `f_sysdate` | `biz.Biz16_EachCont.selectByCorpId` |
| `selectByContCorpId` | select | 45 | [`apr01_appr`](../../../db/tables/apr.md), [`biz11_cont_history`](../../../db/tables/biz.md), [`biz16_each_contract`](../../../db/tables/biz.md) | `f_cdnm`, `f_sysdate` | `biz.Biz16_EachCont.selectByContCorpId` |
| `getContCorpId` | select | 59 | [`apr01_appr`](../../../db/tables/apr.md), [`biz11_cont_history`](../../../db/tables/biz.md), [`biz16_each_contract`](../../../db/tables/biz.md) |  | - |
| `updateApprId` | update | 73 | [`biz16_each_contract`](../../../db/tables/biz.md) |  | `biz.Biz16_EachCont.updateApprId` |
| `deleteContCorpId` | delete | 79 | [`biz16_each_contract`](../../../db/tables/biz.md) |  | - |
