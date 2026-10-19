# tdm63_chck_insuff_record

`server/tdm/mapper/tdm63_chck_insuff_record.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 20 | [`tdm63_chck_insuff_record`](../../../db/tables/tdm.md) | `f_emp_kor_nm`, `f_get_tdmevidcount` | `tdm.Tdm63_ChckInsuffRecord.selectById` |
| `selectBychckInsuffId` | select | 28 | [`tdm63_chck_insuff_record`](../../../db/tables/tdm.md) | `f_emp_kor_nm`, `f_get_tdmevidcount` | `tdm.Tdm63_ChckInsuffRecord.selectBychckInsuffId` |
| `countEvid` | select | 37 | [`tdm63_chck_insuff_record`](../../../db/tables/tdm.md) | `f_get_tdmevidcount` | `tdm.Tdm54_ChckInsuff.updateComplete` |
