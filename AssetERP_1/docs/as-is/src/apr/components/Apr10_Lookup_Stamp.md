# Apr10_Lookup_Stamp

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `dcr`
- 파일: `client/vi/apr/Apr10_Lookup_Stamp.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr10_Stamp.selectByOrgId` | Apr10_Lookup_Stamp:207 | [`Apr10_Stamp.java:58`](../../apr/services/Apr10_Stamp.md) | [`apr10_stamp.selectByOrgId`](../../apr/sql/apr10_stamp.md) |
| `apr.Apr10_Stamp.selectBySearchText` | Apr10_Lookup_Stamp:205 | [`Apr10_Stamp.java:97`](../../apr/services/Apr10_Stamp.md) | [`apr10_stamp.selectBySearchText`](../../apr/sql/apr10_stamp.md) |
| `apr.Apr10_Stamp.selectBySearchTextAdmin` | Apr10_Lookup_Stamp:59 | [`Apr10_Stamp.java:112`](../../apr/services/Apr10_Stamp.md) | [`apr10_stamp.selectBySearchTextAdmin`](../../apr/sql/apr10_stamp.md) |

## 테이블

[`apr10_stamp`](../../../db/tables/apr.md), [`org10_role_stamp`](../../../db/tables/org.md), [`sys10_file`](../../../db/tables/sys.md)

## DB 함수

`f_org_nm`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Apr10_Lookup_Stamp (`client/vi/apr/Apr10_Lookup_Stamp.java`, 251줄)

- 툴바 `buttonBar`: 검색어: {searchText} {searchButton}
- 입력·하위 화면: `searchText` TextField
- 그리드 `grid` (buildGrid(), 체크박스):
  - stampId_string 80 "인감" Cell 편집:CustomImageCell
  - stampName 200 "인감이름" Text
  - useName 250 "사용용도" Text
  - orgName 200 "부서" Text

#### 이벤트
[E0] 화면 열림 (생성자 L79-82) → 초기화
[E1] grid.CellDoubleClick (L126) → confirm()
[E2] confirmButton[확인].Select (L132) → confirm()
[E3] deleteButton.Select (L140) → delete()
[E4] closeButton[닫기].Select (L147) → hide()
[E5] searchText.KeyPress [Enter] (L162) → retrieve()
[E6] searchButton[검색].Select (L170) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L84-94 | openAdmin | 상태 처리 | 업무 |
| public openCert() | L96-107 | 공개 메서드 | 상태 처리 | 업무 |
| public openAdmin() | L109-112 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L114-116 | openAdmin | 상태 처리 | 업무 |
| private setGrid() | L160-186 | makeLayout | 상태 처리 | 업무 |
| private retrieve() | L202-223 | E5,E6,open,openCert | 서비스 apr.Apr10_Stamp.selectBySearchText, apr.Apr10_Stamp.selectByOrgId(companyId, orgId, searchText) | 업무 |
| private confirm() | L225-229 | E1,E2 | 상태 처리 | 업무 |
| private delete() | L231-242 | E3 | 상태 처리 | 업무 |
| private makeLayout() | L118-158 | open,openCert | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L188-199 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| public render() | L70-76 | 공개 메서드 | 상태 처리 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L244-246 | setGrid | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L248-250 | makeLayout | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L193) addCell
  gb.text('stampNm', 200, '인감이름'),  // L194
  gb.text('useNm', 250, '사용용도'),  // L195
  gb.text('orgNm', 200, '부서'),  // L196
];
```

#### 사용된 버튼들
1. <Button type="save" onClick={confirm}>확인</Button>
2. <Button type="unknown" onClick={delete}></Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>
4. <Button type="search" onClick={retrieve}>검색</Button>

