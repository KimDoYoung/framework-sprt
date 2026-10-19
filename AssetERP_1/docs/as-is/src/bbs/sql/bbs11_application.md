# bbs11_application

`server/bbs/mapper/bbs11_application.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 25 | [`bbs11_application`](../../../db/tables/bbs.md) | `f_cdnm`, `f_emp_kor_nm`, `f_sysdate` | `bbs.Bbs11_Application.selectById` |
| `selectByPersonId` | select | 36 | [`bbs11_application`](../../../db/tables/bbs.md), [`bbs12_application_form`](../../../db/tables/bbs.md) | `f_cdnm`, `f_emp_kor_nm`, `f_sysdate` | `bbs.Bbs11_Application.selectByPersonId` |
| `selectByResultCheck` | select | 59 | [`bbs11_application`](../../../db/tables/bbs.md) | `f_cdnm`, `f_emp_kor_nm`, `f_sysdate` | `bbs.Bbs11_Application.selectByResultCheck` |
| `selectByAppStatus` | select | 81 | [`bbs11_application`](../../../db/tables/bbs.md) | `f_cdnm`, `f_emp_kor_nm`, `f_sysdate` | `bbs.Bbs11_Application.selectByAppStatus` |
| `updateAppStatus` | update | 94 | [`bbs11_application`](../../../db/tables/bbs.md) |  | `bbs.Bbs11_Application.updateAppStatus` |
