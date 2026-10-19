# Biz13_Lookup_WithCorp

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `scm`
- 파일: `client/vi/biz/Biz13_Lookup_WithCorp.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `biz.Biz13_WithCorp.selectByText` | Biz13_Lookup_WithCorp:143 | [`Biz13_WithCorp.java:31`](../../biz/services/Biz13_WithCorp.md) | [`biz13_with_corp.selectByText`](../../biz/sql/biz13_with_corp.md) |

## 테이블

[`biz13_with_corp`](../../../db/tables/biz.md), [`sys15_corp`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Biz13_Lookup_WithCorp (`client/vi/biz/Biz13_Lookup_WithCorp.java`, 164줄)

- 툴바 `buttonBar`: 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `searchText` TextField 빈칸="운용사명"
- 그리드 `grid` (buildGrid(), 체크박스):
  - corpCode 80 "운용사코드" TextCenter
  - corpName 250 "운용사명" Text
  - manageTypeName 120 "운영구분" Text

#### 이벤트
[E1] searchText.KeyPress [Enter] (L83) → retrieve()
[E2] grid.RowDoubleClick (L92) → confirm()
[E3] retrieveButton[조회].Select (L99) → retrieve()
[E4] confirmButton[확인].Select (L106) → confirm()
[E5] cancelButton[닫기].Select (L112) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L48-78 | 공개 메서드 | 상태 처리 | 업무 |
| private setting() | L80-118 | open | 상태 처리 | 업무 |
| private retrieve() | L132-144 | E1,E3 | 서비스 biz.Biz13_WithCorp.selectByText(companyId, searchText) | 업무 |
| private confirm() | L146-155 | E2,E4 | 상태 처리 | 업무 |
| private buildGrid() | L120-130 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L157-159 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L161-163 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('corpCd', 80, '운용사코드'),  // L125 SQL 계산 컬럼(selectByText: sys15_corp_cd)
  gb.text('corpNm', 250, '운용사명'),  // L126 SQL 계산 컬럼(selectByText: sys15_corp_nm)
  gb.text('manageTypeNm', 120, '운영구분'),  // L127 SQL 계산 컬럼(selectByText: f_cdnm('ManageType', biz13_manage_type,…)
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

