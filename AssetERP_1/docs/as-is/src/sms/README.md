# 도메인: sms

화면 3개, 컴포넌트 2개, 서버 클래스 4개, 매퍼 4개.

## 화면

| 화면 | 메뉴 | 클래스 | 서비스 |
|:---|:---|---:|---:|
| [`Sms02_Tab_TotalCount`](screens/Sms02_Tab_TotalCount.md) | 관리자 > 01. 고객관리 > 고객별 문자사용량 | 3 | 4 |
| [`Sms03_Tab_GroupSend`](screens/Sms03_Tab_GroupSend.md) | 커뮤니티 > 90. 기타 > 사원별 문자발송 | 3 | 5 |
| [`Sms03_Tab_SendAdmin`](screens/Sms03_Tab_SendAdmin.md) | 관리자 > 01. 고객관리 > 고객별 문자발송 | 4 | 7 |

## 컴포넌트

다른 도메인 화면에서도 쓰는 클래스. 화면 파일은 여기까지만 적고 링크한다.

| 컴포넌트 | 사용 도메인 | 클래스 | 서비스 |
|:---|:---|---:|---:|
| [`Sms03_Lookup_SendList`](components/Sms03_Lookup_SendList.md) | apr, tdm | 1 | 2 |
| [`Sms10_Lookup_AlarmList`](components/Sms10_Lookup_AlarmList.md) | frm | 1 | 1 |

## 서버 클래스

| 클래스 | 서비스 메서드 |
|:---|---:|
| [`sms.Sms02_History`](../sms/services/Sms02_History.md) | 9 |
| [`sms.Sms03_GroupSend`](../sms/services/Sms03_GroupSend.md) | 8 |
| [`sms.Sms04_GroupSendHistory`](../sms/services/Sms04_GroupSendHistory.md) | 6 |
| [`sms.Sms10_AlarmHistory`](../sms/services/Sms10_AlarmHistory.md) | 6 |

## 매퍼

| namespace | SQL 수 |
|:---|---:|
| [`sms02_history`](sql/sms02_history.md) | 7 |
| [`sms03_group_send`](sql/sms03_group_send.md) | 2 |
| [`sms04_group_send_history`](sql/sms04_group_send_history.md) | 3 |
| [`sms10_alarm_history`](sql/sms10_alarm_history.md) | 3 |

