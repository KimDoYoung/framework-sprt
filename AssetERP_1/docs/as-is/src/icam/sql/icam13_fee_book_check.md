# icam13_fee_book_check

`server/icam/mapper/icam13_fee_book_check.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 19 | [`icam13_fee_book_check`](../../../db/tables/icam.md) | `f_emp_kor_nm` | `icam.Icam13_FeeBookCheck.selectById` |
| `selectByStdDate` | select | 27 | [`icam13_fee_book_check`](../../../db/tables/icam.md) | `f_emp_kor_nm` | `icam.Icam13_FeeBookCheck.selectByStdDate` |
| `insert` | insert | 37 | [`icam13_fee_book_check`](../../../db/tables/icam.md) | `f_create_batchseq`, `f_sysdate` | `icam.Icam13_FeeBookCheck.checkFeeBook` |
| `delete` | delete | 49 | [`icam13_fee_book_check`](../../../db/tables/icam.md) |  | `icam.Icam13_FeeBookCheck.checkFeeBook` |
