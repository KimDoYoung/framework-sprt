# Apr10_Lookup_DocStamp

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `dcr`
- 파일: `client/vi/apr/Apr10_Lookup_DocStamp.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr10_Stamp.selectByOrgId2` | Apr10_Lookup_DocStamp:173 | [`Apr10_Stamp.java:47`](../../apr/services/Apr10_Stamp.md) | [`apr10_stamp.selectByOrgId2`](../../apr/sql/apr10_stamp.md) |
| `apr.Apr10_Stamp.selectBySearchText2` | Apr10_Lookup_DocStamp:171 | [`Apr10_Stamp.java:36`](../../apr/services/Apr10_Stamp.md) | [`apr10_stamp.selectBySearchText2`](../../apr/sql/apr10_stamp.md) |

## 테이블

[`apr10_stamp`](../../../db/tables/apr.md), [`dcr40_stamp_auth`](../../../db/tables/dcr.md), [`org10_role_stamp`](../../../db/tables/org.md), [`sys10_file`](../../../db/tables/sys.md)

## DB 함수

`f_org_nm`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Apr10_Lookup_DocStamp (`client/vi/apr/Apr10_Lookup_DocStamp.java`, 196줄)

- 툴바 `buttonBar`: 검색어: {searchText} {searchButton}
- 입력·하위 화면: `searchText` TextField
- 그리드 `grid` (buildGrid(), 체크박스):
  - stampId_string 80 "인감" Cell 편집:CustomImageCell
  - stampName 120 "인감이름" Text
  - useName 200 "사용용도" Text
  - orgName 100 "부서" Text

#### 이벤트
[E0] 화면 열림 (생성자 L81-97) → settings(), setLayoutData(), show()
[E1] searchText.KeyPress [Enter] (L101) → retrieve()
[E2] searchButton[검색].Select (L109) → retrieve()
[E3] confirmButton[확인].Select (L115) → confirm()
[E4] deleteButton[해당사항 없음].Select (L121) → delete()
[E5] closeButton[닫기].Select (L127) → hide()
[E6] grid.CellDoubleClick (L133) → confirm()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L75-79 | 공개 메서드 | 상태 처리 | 업무 |
| private setLayoutData() | L141-151 | 생성자 | 상태 처리 | 업무 |
| private retrieve() | L164-175 | E1,E2,open | 서비스 apr.Apr10_Stamp.selectBySearchText2, apr.Apr10_Stamp.selectByOrgId2(searchText, companyId, orgId, classTreeId) | 업무 |
| private confirm() | L177-181 | E3,E6 | 상태 처리 | 업무 |
| private delete() | L183-187 | E4 | 상태 처리 | 업무 |
| private settings() | L99-139 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L153-162 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| public render() | L66-72 | 공개 메서드 | 상태 처리 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L189-191 | setLayoutData | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L193-195 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L156) addCell
  gb.text('stampNm', 120, '인감이름'),  // L157
  gb.text('useNm', 200, '사용용도'),  // L158
  gb.text('orgNm', 100, '부서'),  // L159
];
```

#### 사용된 버튼들
1. <Button type="save" onClick={confirm}>확인</Button>
2. <Button type="unknown" onClick={delete}>해당사항 없음</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>
4. <Button type="search" onClick={retrieve}>검색</Button>

