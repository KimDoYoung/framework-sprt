# biz12_fee_info

`server/biz/mapper/biz12_fee_info.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 22 | [`biz10_cont_corp`](../../../db/tables/biz.md), [`biz11_cont_history`](../../../db/tables/biz.md), [`biz12_fee_info`](../../../db/tables/biz.md) | `f_cdnm`, `f_sysdate` | `biz.Biz12_FeeInfo.selectById` |
| `deleteContCorpId` | delete | 44 | [`biz11_cont_history`](../../../db/tables/biz.md), [`biz12_fee_info`](../../../db/tables/biz.md) |  | `biz.Biz11_ContHistory.deleteContCorpId` |
