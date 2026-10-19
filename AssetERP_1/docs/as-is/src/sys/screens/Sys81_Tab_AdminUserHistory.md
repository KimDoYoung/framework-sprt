# Sys81_Tab_AdminUserHistory

- 종류: 화면
- 메뉴: 관리자 > 02. 시스템관리 > Admin 로그인내역 조회 (#1198)
- 파일: `client/vi/sys/Sys81_Tab_AdminUserHistory.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys81_AdminUserHistory.selectByDate` | Sys81_Tab_AdminUserHistory:93 | [`Sys81_AdminUserHistory.java:25`](../../sys/services/Sys81_AdminUserHistory.md) | [`sys81_admin_user_history.selectByDate`](../../sys/sql/sys81_admin_user_history.md) |

## 테이블

[`sys81_admin_user_history`](../../../db/tables/sys.md)

## DB 함수

`f_trunc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sys81_Tab_AdminUserHistory (`client/vi/sys/Sys81_Tab_AdminUserHistory.java`, 104줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 조회일자: {startDate} ~: {closeDate} {retrieveButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - regDate 100 "로그인 일자" Date
  - regTime 100 "로그인 시간" TextCenter
  - user 200 "사용자 정보" TextCenter
  - smsContent 500 "SMS 수신내용" Text

#### 이벤트
[E0] 화면 열림 (생성자 L38-67) → settings()
[E1] retrieveButton[조회].Select (L50) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L88-99 | E1 | 서비스 sys.Sys81_AdminUserHistory.selectByDate(startDate, closeDate) | 업무 |
| private settings() | L69-75 | 생성자 | 이벤트 연결, 초기값: startDate=ClientDateUtil.toDate(DateTimeFormat.getFormat("yyyy-01-01", closeDate=LoginUser.getToday( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L77-86 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L101-103 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('regDate', 100, '로그인 일자'),  // L80
  gb.textCenter('regTime', 100, '로그인 시간'),  // L81 SQL 계산 컬럼(selectByDate: TO_CHAR(sys81_reg_date, 'HH24:MI'))
  gb.textCenter('user', 200, '사용자 정보'),  // L82
  gb.text('smsContent', 500, 'SMS 수신내용'),  // L83
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

