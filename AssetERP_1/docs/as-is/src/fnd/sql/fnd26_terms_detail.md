# fnd26_terms_detail

`server/fnd/mapper/fnd26_terms_detail.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 31 | [`fnd26_terms_detail`](../../../db/tables/fnd.md) |  | `fnd.Fnd26_TermsDetail.selectById` |
| `selectBySearchText` | select | 37 | [`fnd25_terms`](../../../db/tables/fnd.md), [`fnd26_terms_detail`](../../../db/tables/fnd.md) | `f_cdnm`, `f_sysdate` | `fnd.Fnd26_TermsDetail.selectBySearchText` |
| `selectBySearchTextManager` | select | 63 | [`fnd25_terms`](../../../db/tables/fnd.md), [`fnd26_terms_detail`](../../../db/tables/fnd.md), [`sys10_file`](../../../db/tables/sys.md) | `f_cdnm`, `f_sysdate` | `fnd.Fnd26_TermsDetail.selectBySearchTextManager` |
| `RevisionNoCheck` | select | 85 | [`fnd25_terms`](../../../db/tables/fnd.md), [`fnd26_terms_detail`](../../../db/tables/fnd.md) |  | `fnd.Fnd26_TermsDetail.update` |
| `deleteByTermsId` | delete | 99 | [`fnd26_terms_detail`](../../../db/tables/fnd.md) |  | `fnd.Fnd26_TermsDetail.deleteAll` |
