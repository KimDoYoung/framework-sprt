# emp93_sms_notice_target

`server/emp/mapper/emp93_sms_notice_target.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 17 | [`emp93_sms_notice_target`](../../../db/tables/emp.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_emptrans`, `f_today` | `emp.Emp93_SmsNoticeTarget.selectById` |
| `selectBySmsNoticeCode` | select | 29 | [`emp93_sms_notice_target`](../../../db/tables/emp.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_emptrans`, `f_today` | `emp.Emp93_SmsNoticeTarget.selectBySmsNoticeCode` |
| `getSmsNoticeList` | select | 43 | [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md) |  | `emp.Emp93_SmsNoticeTarget.getSmsNoticeList` |
