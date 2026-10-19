# Icam10_Lookup_FundCode

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `ast`
- 파일: `client/vi/icam/Icam10_Lookup_FundCode.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `icam.Icam10_Fee.selectFundList` | Icam10_Lookup_FundCode:162 | [`Icam10_Fee.java:40`](../../icam/services/Icam10_Fee.md) | [`icam10_fee.selectFundList`](../../icam/sql/icam10_fee.md) |

## 테이블

[`fnd01_fund_code`](../../../db/tables/fnd.md), [`fnd02_fund_info`](../../../db/tables/fnd.md), [`icam10_fee`](../../../db/tables/icam.md)

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Icam10_Lookup_FundCode (`client/vi/icam/Icam10_Lookup_FundCode.java`, 178줄)

- 툴바 `buttonBar`: 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `stdDate` MyDateField, `searchText` TextField 빈칸="펀드코드/펀드명"
- 그리드 `grid` (buildGrid(), 체크박스):
  - fundCode 100 "펀드코드" Text
  - fundName 400 "펀드명" Text

#### 이벤트
[E0] 화면 열림 (생성자 L54-72) → show()
[E1] searchText.KeyPress [Enter] (L84) → retrieve()
[E2] grid.CellDoubleClick [callbackResult != null] (L98) → hide()
[E3] confirmButton[확인].Select [callbackResult != null] (L108) → hide()
[E4] selectAllButton[전체].Select (L122) → hide()
[E5] cancleButton[닫기].Select (L129) → hide()
[E6] retrieveButton[조회].Select (L135) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L74-79 | 공개 메서드 | 상태 처리 | 업무 |
| public setting() | L81-141 | open | 미선택 시 alert "펀드를 선택하세요" | 업무 |
| public retrieve() | L154-168 | E1,E6,open | 서비스 icam.Icam10_Fee.selectFundList(companyId, stdDate, searchText) | 업무 |
| public buildGrid() | L143-152 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L170-172 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L174-176 | setting | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('fundCd', 100, '펀드코드'),  // L148
  gb.text('fundNm', 400, '펀드명'),  // L149
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={hide}>확인</Button>
3. <Button type="unknown" onClick={hide}>전체</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

