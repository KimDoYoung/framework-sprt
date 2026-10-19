# emp16_cert_mapping

`server/emp/mapper/emp16_cert_mapping.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 17 | [`emp16_cert_mapping`](../../../db/tables/emp.md) | `f_cdnm`, `f_sysdate` | `emp.Emp16_CertMapping.selectById` |
| `selectByCompanyId` | select | 24 | [`emp16_cert_mapping`](../../../db/tables/emp.md) | `f_cdnm`, `f_sysdate` | `emp.Emp16_CertMapping.selectByCompanyId` |
| `selectByLinkCode` | select | 32 | [`emp16_cert_mapping`](../../../db/tables/emp.md) |  | `emp.Emp16_CertMapping.selectByLinkCode` |
