# 도메인: rpt

화면 7개, 컴포넌트 1개, 서버 클래스 6개, 매퍼 6개.

## 화면

| 화면 | 메뉴 | 클래스 | 서비스 |
|:---|:---|---:|---:|
| [`Rpt01_Tab_DailyConfirm`](screens/Rpt01_Tab_DailyConfirm.md) | 커뮤니티 > 04. 업무보고 > 기간별 업무확인 | 3 | 4 |
| [`Rpt01_Tab_DailyWrite`](screens/Rpt01_Tab_DailyWrite.md) | 커뮤니티 > 04. 업무보고 > 일일업무 입력 | 2 | 3 |
| [`Rpt02_Tab_MonthWrite`](screens/Rpt02_Tab_MonthWrite.md) | 커뮤니티 > 04. 업무보고 > 월간회의자료 | 4 | 6 |
| [`Rpt03_Tab_WeekWrite`](screens/Rpt03_Tab_WeekWrite.md) | 커뮤니티 > 04. 업무보고 > 주간업무보고 | 5 | 17 |
| [`Rpt04_Tab_WeekConfirm`](screens/Rpt04_Tab_WeekConfirm.md) | 커뮤니티 > 04. 업무보고 > 주간업무보고 확인 | 2 | 11 |
| [`Rpt10_Tab_FssOrg`](screens/Rpt10_Tab_FssOrg.md) | 경영관리 > 20. 대외보고서 > 업무보고서 | 1 | 0 |
| [`Rpt10_Tab_FssSubmit`](screens/Rpt10_Tab_FssSubmit.md) | 기초자료 > 30. 자산&경영 > 금감원 업무보고서 | 2 | 4 |

## 컴포넌트

다른 도메인 화면에서도 쓰는 클래스. 화면 파일은 여기까지만 적고 링크한다.

| 컴포넌트 | 사용 도메인 | 클래스 | 서비스 |
|:---|:---|---:|---:|
| [`Rpt10_Lookup_WriteGuide`](components/Rpt10_Lookup_WriteGuide.md) | emp, org, sys | 1 | 0 |

## 서버 클래스

| 클래스 | 서비스 메서드 |
|:---|---:|
| [`rpt.Rpt01_Daily`](../rpt/services/Rpt01_Daily.md) | 8 |
| [`rpt.Rpt02_Month`](../rpt/services/Rpt02_Month.md) | 5 |
| [`rpt.Rpt03_Week`](../rpt/services/Rpt03_Week.md) | 14 |
| [`rpt.Rpt04_WeekConfirm`](../rpt/services/Rpt04_WeekConfirm.md) | 8 |
| [`rpt.Rpt05_WeekBizClass`](../rpt/services/Rpt05_WeekBizClass.md) | 3 |
| [`rpt.Rpt10_FssSubmit`](../rpt/services/Rpt10_FssSubmit.md) | 6 |

## 매퍼

| namespace | SQL 수 |
|:---|---:|
| [`rpt01_daily`](sql/rpt01_daily.md) | 5 |
| [`rpt02_month`](sql/rpt02_month.md) | 2 |
| [`rpt03_week`](sql/rpt03_week.md) | 10 |
| [`rpt04_week_confirm`](sql/rpt04_week_confirm.md) | 6 |
| [`rpt05_week_biz_class`](sql/rpt05_week_biz_class.md) | 3 |
| [`rpt10_fss_submit`](sql/rpt10_fss_submit.md) | 3 |

