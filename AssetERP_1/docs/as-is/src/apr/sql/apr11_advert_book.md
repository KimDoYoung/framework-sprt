# apr11_advert_book

`server/apr/mapper/apr11_advert_book.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 33 | [`apr01_appr`](../../../db/tables/apr.md), [`apr04_appr_step`](../../../db/tables/apr.md), [`apr11_advert_book`](../../../db/tables/apr.md), [`emp00_trans_info`](../../../db/views.md) |  | - |
| `selectByApprDate` | select | 54 | [`apr01_appr`](../../../db/tables/apr.md), [`apr04_appr_step`](../../../db/tables/apr.md), [`apr11_advert_book`](../../../db/tables/apr.md), [`emp00_trans_info`](../../../db/views.md) | `f_trunc` | `apr.Apr11_AdvertBook.selectByApprDate` |
| `getAdvertSeq` | select | 77 | [`apr11_advert_book`](../../../db/tables/apr.md) |  | `apr.Apr01_Appr.update`, `apr.Apr04_ApprStep.confirmUpdate` |
| `insertAdvertHistory` | insert | 88 | [`apr11_advert_book`](../../../db/tables/apr.md) | `f_create_seq` | `apr.Apr01_Appr.update`, `apr.Apr04_ApprStep.confirmUpdate` |
| `deleteByApprId` | delete | 113 | [`apr11_advert_book`](../../../db/tables/apr.md) |  | `apr.Apr01_Appr.deleteByApprId`, `apr.Apr90_DisposalList.updateAppr` |
