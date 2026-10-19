# fnd25_terms

`server/fnd/mapper/fnd25_terms.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 32 | [`fnd25_terms`](../../../db/tables/fnd.md) |  | `fnd.Fnd25_Terms.selectById` |
| `selectBySearchTextManager` | select | 38 | [`fnd25_terms`](../../../db/tables/fnd.md), [`fnd26_terms_detail`](../../../db/tables/fnd.md), [`sys10_file`](../../../db/tables/sys.md) | `f_cdnm`, `f_sysdate` | `fnd.Fnd25_Terms.selectBySearchTextManager` |
| `deleteByTermsId` | delete | 71 | [`fnd25_terms`](../../../db/tables/fnd.md) |  | `fnd.Fnd26_TermsDetail.deleteAll` |
