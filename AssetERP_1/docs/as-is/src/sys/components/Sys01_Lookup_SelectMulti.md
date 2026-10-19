# Sys01_Lookup_SelectMulti

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `bbs`, `chk`
- 파일: `client/vi/sys/Sys01_Lookup_SelectMulti.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys01_Company.selectCompany` | Sys01_Lookup_SelectMulti:127 | [`Sys01_Company.java:58`](../../sys/services/Sys01_Company.md) | [`sys01_company.selectCompany`](../../sys/sql/sys01_company.md) |

## 테이블

[`sys01_company`](../../../db/tables/sys.md)

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sys01_Lookup_SelectMulti (`client/vi/sys/Sys01_Lookup_SelectMulti.java`, 167줄)

- 툴바 `searchBar`: {searchField} {retrieveButton}
- 입력·하위 화면: `korName` TextField
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - locationName 100 "고객코드" Text
  - companyName 200 "고객명" Text
  - erpProductCode 80 "상품구분" TextCenter

#### 이벤트
[E1] korName[고객명].KeyPress [Enter] (L77) → retrieve()
[E2] grid.RowDoubleClick (L85) → confirm()
[E3] retrieveButton[조회].Select (L91) → retrieve()
[E4] oKButton[확인].Select (L97) → confirm()
[E5] cancelButton[취소].Select (L103) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L46-74 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L123-132 | E1,E3,open | 서비스 sys.Sys01_Company.selectCompany(companyName, useYn) | 업무 |
| public confirm() | L134-146 | E2,E4 | 미선택 시 alert "선택된 고객이 없습니다" | 업무 |
| public confirmAll() | L148-151 | 공개 메서드 | 상태 처리 | 업무 |
| public getServiceResult() | L154-162 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L76-109 | open | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L111-121 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L164-166 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('locNm', 100, '고객코드'),  // L116
  gb.text('companyNm', 200, '고객명'),  // L117
  gb.textCenter('erpProductCd', 80, '상품구분'),  // L118
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="cancel" onClick={hide}>취소</Button>

