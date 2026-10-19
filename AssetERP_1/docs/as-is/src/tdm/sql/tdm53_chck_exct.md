# tdm53_chck_exct

`server/tdm/mapper/tdm53_chck_exct.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 29 | [`tdm20_role`](../../../db/tables/tdm.md), [`tdm53_chck_exct`](../../../db/tables/tdm.md) | `f_emp_kor_nm` | `tdm.Tdm53_ChckExct.selectById` |
| `selectByChckJobId` | select | 40 | [`tdm20_role`](../../../db/tables/tdm.md), [`tdm51_chck_org`](../../../db/tables/tdm.md), [`tdm52_chck_manl`](../../../db/tables/tdm.md), [`tdm53_chck_exct`](../../../db/tables/tdm.md) | `f_emp_kor_nm`, `f_today`, `getperson` | `tdm.Tdm53_ChckExct.selectByChckJobId` |
| `selectByExctId` | select | 62 | [`tdm20_role`](../../../db/tables/tdm.md), [`tdm51_chck_org`](../../../db/tables/tdm.md), [`tdm53_chck_exct`](../../../db/tables/tdm.md) |  | - |
| `countUnLockByExctAppr` | select | 83 | [`tdm53_chck_exct`](../../../db/tables/tdm.md) |  | `tdm.Tdm50_ChckJob.updateEndYn` |
| `insertByTmd51` | insert | 92 | [`tdm51_chck_org`](../../../db/tables/tdm.md), [`tdm53_chck_exct`](../../../db/tables/tdm.md) | `f_create_seq`, `f_sysdate` | `tdm.Tdm50_ChckJob.createCheckManl` |
| `updateExctApprYn` | update | 120 | [`tdm53_chck_exct`](../../../db/tables/tdm.md) | `f_sysdate` | `tdm.Tdm59_ChckApprCmnt.updateSubmit` |
| `deleteChckManl` | delete | 129 | [`tdm53_chck_exct`](../../../db/tables/tdm.md) |  | `tdm.Tdm50_ChckJob.deleteChckManl` |
