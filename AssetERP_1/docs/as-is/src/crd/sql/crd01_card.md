# crd01_card

`server/crd/mapper/crd01_card.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 29 | [`crd01_card`](../../../db/tables/crd.md) | `f_ast_class_tree_nm`, `f_cdnm`, `f_sysdate` | `crd.Crd01_Card.selectById` |
| `selectByCardNo` | select | 38 | [`crd01_card`](../../../db/tables/crd.md) | `f_ast_class_tree_nm` | `biz.Biz01_Promo.insert` |
| `selectCardManager` | select | 46 | [`crd01_card`](../../../db/tables/crd.md), [`crd03_trans`](../../../db/tables/crd.md) | `f_ast_class_tree_nm`, `f_emp_kor_nm` | `biz.Biz01_Promo.insertList` |
| `selectCardManagerCombox` | select | 59 | [`crd01_card`](../../../db/tables/crd.md), [`crd03_trans`](../../../db/tables/crd.md) | `f_ast_class_tree_nm`, `f_emp_kor_nm`, `f_sysdate` | - |
| `selectByText` | select | 77 | [`crd01_card`](../../../db/tables/crd.md), [`crd03_trans`](../../../db/tables/crd.md) | `f_ast_class_tree_nm`, `f_cdnm`, `f_emp_kor_nm`, `f_sysdate` | `crd.Crd01_Card.selectByText` |
| `excelInsert` | insert | 104 | [`crd01_card`](../../../db/tables/crd.md) | `f_create_seq` | - |
