# Sms10_Lookup_AlarmList

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `frm`
- 파일: `client/vi/sms/Sms10_Lookup_AlarmList.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sms.Sms10_AlarmHistory.selectByText` | Sms10_Lookup_AlarmList:182 | [`Sms10_AlarmHistory.java:27`](../../sms/services/Sms10_AlarmHistory.md) | [`sms10_alarm_history.selectByText`](../../sms/sql/sms10_alarm_history.md) |

## 테이블

[`sms10_alarm_history`](../../../db/tables/sms.md)

## DB 함수

`f_emp_kor_nm`, `f_trunc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sms10_Lookup_AlarmList (`client/vi/sms/Sms10_Lookup_AlarmList.java`, 197줄)

- 툴바 `buttonBar`: 구분: {inOutName} 조회기간: {startDate} ~: {closeDate} 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `searchText` TextField 빈칸="수신(발신)자/내용", `inOutName` StringComboBox
- 그리드 `grid` (buildGrid()):
  - sendTimeStr 140 "수신(발신)일" TextCenter
  - targetPersonName 90 "수신(발신)자 " TextCenter
  - content 350 "내용" TextHtml
  - actionCell 50 " " Cell 편집:actionCell
  - sendYn 60 "성공여부" BooleanYn

#### 이벤트
[E0] 화면 열림 (생성자 L58-94) → settings(), show(), retrieve()
[E1] inOutName[수신].ValueChange (L111) → retrieve()
[E2] searchText.KeyPress [Enter] (L120) → retrieve()
[E3] retrieveButton[조회].Select (L128) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L54-56 | 공개 메서드 | 상태 처리 | 업무 |
| private retrieve() | L158-188 | 생성자,E1,E2,E3,open | 서비스 sms.Sms10_AlarmHistory.selectByText(personId, inOutYn, searchText, startDate, closeDate) | 업무 |
| private settings() | L96-134 | 생성자 | 이벤트 연결, 초기값: startDate=closeDate1, closeDate=LoginUser.getToday( | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L136-156 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L190-192 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L194-196 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('sendTimeStr', 140, '수신(발신)일'),  // L149 SQL 계산 컬럼(selectByText: to_char(sms10_send_date,'yyyy-mm-dd hh2…)
  gb.textCenter('targetPersonNm', 90, '수신(발신)자 '),  // L150 SQL 계산 컬럼(selectByText: f_emp_kor_nm(sms10_target_person_id))
  // ⚠ 대응 없음 (GridBuilder L151) addTextHtml
  // ⚠ 대응 없음 (GridBuilder L152) addCell
  gb.booleanYn('sendYn', 60, '성공여부'),  // L153
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

