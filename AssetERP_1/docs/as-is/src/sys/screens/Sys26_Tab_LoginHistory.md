# Sys26_Tab_LoginHistory

- 종류: 화면
- 메뉴: 관리자 > 02. 시스템관리 > 로그인내역 조회 (#1140)
- 파일: `client/vi/sys/Sys26_Tab_LoginHistory.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys00_Common.selectCompanyName` | Sys26_Tab_LoginHistory:42 | [`Sys00_Common.java:41`](../../sys/services/Sys00_Common.md) | [`sys00_common.selectCompanyName`](../../sys/sql/sys00_common.md) |
| `sys.Sys26_Login.delete` | Sys26_Tab_LoginHistory:112 | [`Sys26_Login.java:31`](../../sys/services/Sys26_Login.md) | `UpdateDataModel(sys26_login)` 동적 DELETE |
| `sys.Sys26_Login.selectByLoginDate` | Sys26_Tab_LoginHistory:158 | [`Sys26_Login.java:21`](../../sys/services/Sys26_Login.md) | [`sys26_login.selectByLoginDate`](../../sys/sql/sys26_login.md) |

## 테이블

[`emp01_person`](../../../db/tables/emp.md), [`sys01_company`](../../../db/tables/sys.md), [`sys02_user`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys26_login`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sys26_Tab_LoginHistory (`client/vi/sys/Sys26_Tab_LoginHistory.java`, 172줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 조회기간: {startDate} ~: {closeDate} 접속구분: {loginModeComboBox} 회사명: {companyComboBox} {retrieveButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `loginModeComboBox` ComboBoxField("LoginModeCode", "%", "전체"), `companyComboBox` CommonComboBoxField("sys.Sys00_Common.selectCompanyName", "%", "전체")
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - openDateString 200 "접속일시" TextCenter
  - companyName 200 "회사명" Text
  - personName 150 "성명" Text
  - statusName 150 "상태구분" Text
  - loginModeName 80 "접속경로" TextCenter
  - ipAddress 150 "IP 주소" Text
  - os 150 "OS" Text
  - browser 200 "Browser" Text

#### 이벤트
[E0] 화면 열림 (생성자 L47-78) → settings(), retrieve()
[E1] retrieveButton[조회].Select (L101) → retrieve()
[E2] deleteButton[삭제].Select (L107) → 서비스 sys.Sys26_Login.delete

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L133-167 | 생성자,E1 | 서비스 sys.Sys26_Login.selectByLoginDate(startDate, closeDate, companyId, loginMode) | 업무 |
| private settings() | L80-115 | 생성자 | GridDeleteData sys.Sys26_Login.delete(체크된 행 목록), 이벤트 연결, 초기값: startDate=toDay, closeDate=toDay, loginModeComboBox="전체"("LoginModeCode"), companyComboBox="전체"("sys.Sys00_Common.selectCompanyName") | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L117-131 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L169-171 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('openDateString', 200, '접속일시'),  // L120 SQL 계산 컬럼(selectByLoginDate: TO_CHAR(sys26_open_date, 'YYYY-MM-DD HH…)
  gb.text('companyNm', 200, '회사명'),  // L121 SQL 계산 컬럼(selectByLoginDate: ( SELECT sys01_company_nm FROM sys01_co…)
  gb.text('personNm', 150, '성명'),  // L122 SQL 계산 컬럼(selectByLoginDate: emp01_kor_nm ||'('||emp01_emp_no||')')
  gb.text('statusNm', 150, '상태구분'),  // L123 SQL 계산 컬럼(selectByLoginDate: f_cdnm('LoginStatusCode', sys26_status_…)
  gb.textCenter('loginModeNm', 80, '접속경로'),  // L124 SQL 계산 컬럼(selectByLoginDate: f_cdnm('LoginModeCode', sys26_login_mod…)
  gb.text('ipAddress', 150, 'IP 주소'),  // L125
  gb.text('os', 150, 'OS'),  // L126
  gb.text('browser', 200, 'Browser'),  // L127
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="delete" onClick={() => /* 서비스 sys.Sys26_Login.delete */}>삭제</Button>

