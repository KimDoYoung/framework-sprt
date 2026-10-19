# Dcr01_Lookup_SelectMulti

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `tdm`
- 파일: `client/vi/dcr/Dcr01_Lookup_SelectMulti.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `dcr.Dcr01_ClassTree.selectByText` | Dcr01_Lookup_SelectMulti:135 | [`Dcr01_ClassTree.java:40`](../../dcr/services/Dcr01_ClassTree.md) | [`dcr01_class_tree.selectByText`](../../dcr/sql/dcr01_class_tree.md) |

## 테이블

[`dcr01_class_tree`](../../../db/tables/dcr.md), [`tdm47_manl_relate_dcr`](../../../db/tables/tdm.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Dcr01_Lookup_SelectMulti (`client/vi/dcr/Dcr01_Lookup_SelectMulti.java`, 164줄)

- 툴바 `buttonBar`: 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `searchText` TextField 빈칸="분류코드/문서분류명"
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - classTreeCode 100 "분류코드" TextCenter
  - classTreeFullName 550 "문서분류명" TextArea

#### 이벤트
[E0] 화면 열림 (생성자 L47-52) → 초기화
[E1] searchText.KeyPress [Enter] (L84) → retrieve()
[E2] retrieveButton[조회].Select (L93) → retrieve()
[E3] confirmButton[확인].Select (L99) → confirm()
[E4] closeButton[닫기].Select (L105) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L54-79 | 공개 메서드 | 상태 처리 | 업무 |
| public setting() | L81-112 | open | 상태 처리 | 업무 |
| private retrieve() | L125-141 | E1,E2,open | 서비스 dcr.Dcr01_ClassTree.selectByText(companyId, typeCode, searchText, relateTable, relateId, useYn) | 업무 |
| private confirm() | L143-155 | E3 | 미선택 시 alert "선택한 문서분류가 없습니다" | 업무 |
| private buildGrid() | L114-123 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L157-159 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L160-162 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('classTreeCd', 100, '분류코드'),  // L119
  gb.textArea('classTreeFNm', 550, '문서분류명'),  // L120
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

