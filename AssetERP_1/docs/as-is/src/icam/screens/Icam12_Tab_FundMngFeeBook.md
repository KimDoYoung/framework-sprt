# Icam12_Tab_FundMngFeeBook

- 종류: 화면
- 메뉴: 관리회계 > 30. 펀드운용보수관리 > ICAM 운용보수 월말잔액 (#1215)
- 파일: `client/vi/icam/Icam12_Tab_FundMngFeeBook.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Icam10_Lookup_FundCode`](../../icam/components/Icam10_Lookup_FundCode.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `icam.Icam12_FeeBook.selectByStdDatePaging` | Icam12_Tab_FundMngFeeBook:73 | [`Icam12_FeeBook.java:20`](../../icam/services/Icam12_FeeBook.md) | [`icam12_fee_book.selectByStdDatePaging`](../../icam/sql/icam12_fee_book.md), [`icam12_fee_book.selectByStdDatePagingTotal`](../../icam/sql/icam12_fee_book.md) |

## 테이블

[`icam12_fee_book`](../../../db/tables/icam.md)

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Icam12_Tab_FundMngFeeBook (`client/vi/icam/Icam12_Tab_FundMngFeeBook.java`, 224줄)

- 레이아웃: center=vlc01
- 툴바 `buttonBar`: 기준년월: {yyyyMM} 펀드: {fundName} 검색: {searchTextField} {retrieveButton}
- 입력·하위 화면: `yyyyMM` TextField 빈칸="YYYY.MM", `searchTextField` TextField 빈칸="펀드/수탁사", `fundCode` TextField, `fundName` LookupTriggerField 빈칸="전체", `lookupFund` Icam10_Lookup_FundCode
- 그리드 `grid` (buildGrid(), 체크박스):
  - stdDate 100 "기준일" Date
  - fundCode 70 "펀드코드" TextCenter
  - fundName 400 "펀드명" Text
  - fee 120 "누적보수" Long
  - consignmentName 150 "수탁사" Text
  - workDateString 150 "생성일시" TextCenter
  - worker 150 "생성자" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L53-89) → setting()
[E1] yyyyMM.KeyPress [Enter] (L100) → retrieve()
[E2] fundName.TriggerClick [result != null] (L112) → getDate()
[E3] searchTextField.KeyPress [Enter] (L134) → retrieve()
[E4] retrieveButton[조회].Select (L143) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setting() | L91-149 | 생성자 | 조회창 Icam10_Lookup_FundCode 열기 | 업무 |
| public retrieve() | L168-194 | E1,E3,E4 | 상태 처리 | 업무 |
| public update() | L197-198 | 공개 메서드 | 상태 처리 | 업무 |
| public insertRow() | L201-202 | 공개 메서드 | 상태 처리 | 업무 |
| public deleteRow() | L205-206 | 공개 메서드 | 상태 처리 | 업무 |
| private getDate() | L208-218 | E2,retrieve | 서비스 yyyy.MM.dd | 업무 |
| public buildGrid() | L151-165 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L220-222 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('stdDate', 100, '기준일'),  // L156
  gb.textCenter('fundCd', 70, '펀드코드'),  // L157
  gb.text('fundNm', 400, '펀드명'),  // L158
  gb.long('fee', 120, '누적보수'),  // L159
  gb.text('consignmentNm', 150, '수탁사'),  // L160
  gb.textCenter('workDateString', 150, '생성일시'),  // L161 SQL 계산 컬럼(selectByStdDatePaging: to_char(icam12_work_date,'yyyy-mm-dd HH…)
  gb.textCenter('worker', 150, '생성자'),  // L162
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

