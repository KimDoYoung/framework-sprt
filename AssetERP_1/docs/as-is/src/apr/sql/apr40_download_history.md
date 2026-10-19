# apr40_download_history

`server/apr/mapper/apr40_download_history.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 22 | [`apr01_appr`](../../../db/tables/apr.md), [`apr40_download_history`](../../../db/tables/apr.md) | `f_cdnm`, `f_emp_kor_nm` | `apr.Apr40_DownloadHistory.selectById` |
| `selectByText` | select | 34 | [`apr01_appr`](../../../db/tables/apr.md), [`apr40_download_history`](../../../db/tables/apr.md) | `f_cdnm`, `f_emp_kor_nm`, `f_trunc` | `apr.Apr40_DownloadHistory.selectByText` |
| `selectByTextPaging` | select | 48 | [`apr01_appr`](../../../db/tables/apr.md), [`apr40_download_history`](../../../db/tables/apr.md) | `f_cdnm`, `f_emp_kor_nm`, `f_trunc` | `apr.Apr40_DownloadHistory.selectByTextPaging` |
| `selectByTextPagingTotal` | select | 64 | [`apr01_appr`](../../../db/tables/apr.md), [`apr40_download_history`](../../../db/tables/apr.md) | `f_emp_kor_nm`, `f_trunc` | `apr.Apr40_DownloadHistory.selectByTextPaging` |
| `insert` | insert | 73 | [`apr40_download_history`](../../../db/tables/apr.md) | `f_create_seq`, `f_sysdate` | `apr.Apr40_DownloadHistory.updateList` |
