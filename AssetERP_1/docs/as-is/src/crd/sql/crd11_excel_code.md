# crd11_excel_code

`server/crd/mapper/crd11_excel_code.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 18 | [`crd11_excel_code`](../../../db/tables/crd.md) | `f_cdnm`, `f_sysdate` | `crd.Crd11_ExcelCode.selectById` |
| `selectByCompanyId` | select | 26 | [`crd11_excel_code`](../../../db/tables/crd.md) | `f_cdnm`, `f_sysdate` | `crd.Crd11_ExcelCode.selectByCompanyId` |
| `selectByBankCode` | select | 36 | [`crd11_excel_code`](../../../db/tables/crd.md) |  | - |
| `copyData` | update | 51 | [`crd11_excel_code`](../../../db/tables/crd.md) | `f_create_seq` | `crd.Crd11_ExcelCode.copyData` |
