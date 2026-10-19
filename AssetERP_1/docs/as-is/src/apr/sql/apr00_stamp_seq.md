# apr00_stamp_seq

`server/apr/mapper/apr00_stamp_seq.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectByApprDate` | select | 28 | [`apr01_appr`](../../../db/tables/apr.md), [`apr04_appr_step`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`emp00_trans_info`](../../../db/views.md) | `f_emp_kor_nm` | `apr.Apr00_StampSeq.selectByApprDate` |
