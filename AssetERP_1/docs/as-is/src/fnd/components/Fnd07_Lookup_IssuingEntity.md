# Fnd07_Lookup_IssuingEntity

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `pln`
- 파일: `client/vi/fnd/Fnd07_Lookup_IssuingEntity.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `fnd.Fnd07_IssuingEntity.selectBysearchText` | Fnd07_Lookup_IssuingEntity:135 | [`Fnd07_IssuingEntity.java:41`](../../fnd/services/Fnd07_IssuingEntity.md) | [`fnd07_issuing_entity.selectBysearchText`](../../fnd/sql/fnd07_issuing_entity.md) |

## 테이블

[`fnd07_issuing_entity`](../../../db/tables/fnd.md)

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Fnd07_Lookup_IssuingEntity (`client/vi/fnd/Fnd07_Lookup_IssuingEntity.java`, 147줄)

- 툴바 `searchBar`: {searchField} {retrieveButton}
- 입력·하위 화면: `searchText` TextField 빈칸="기관명을 입력하여 주십시오"
- 그리드 `grid` (buildGrid(), 체크박스):
  - issuingEntityCode 70 "기관코드" Text
  - issuingEntityName 350 "기관명" Text

#### 이벤트
[E1] searchText[검색].KeyPress [Enter] (L62) → retrieve()
[E2] retrieveButton[조회].Select (L71) → retrieve()
[E3] grid.CellDoubleClick (L82) → hide()
[E4] okButton[확인].Select (L93) → hide()
[E5] cancelButton[취소].Select (L103) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L46-114 | 공개 메서드 | 상태 처리 | 업무 |
| private retrieve() | L126-141 | E1,E2 | 서비스 fnd.Fnd07_IssuingEntity.selectBysearchText(searchText) | 업무 |
| private buildGrid() | L116-124 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L143-145 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('issuingEntityCd', 70, '기관코드'),  // L120
  gb.text('issuingEntityNm', 350, '기관명'),  // L121
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={hide}>확인</Button>
3. <Button type="cancel" onClick={hide}>취소</Button>

