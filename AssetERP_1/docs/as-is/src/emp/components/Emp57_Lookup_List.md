# Emp57_Lookup_List

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `bbs`, `sms`
- 파일: `client/vi/emp/Emp57_Lookup_List.java`
- 함께 쓰는 클래스 1개:
  - `Emp57_Lookup_DetailList` `client/vi/emp/Emp57_Lookup_DetailList.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `emp.Emp57_AddrBookGroup.getList` | Emp57_Lookup_List:209 | [`Emp57_AddrBookGroup.java:46`](../../emp/services/Emp57_AddrBookGroup.md) | [`emp57_addr_book_group.getList`](../../emp/sql/emp57_addr_book_group.md) |
| `emp.Emp57_AddrBookGroup.selectByParentId` | Emp57_Lookup_DetailList:68, Emp57_Lookup_List:115 | [`Emp57_AddrBookGroup.java:26`](../../emp/services/Emp57_AddrBookGroup.md) | [`emp57_addr_book_group.selectByParentId`](../../emp/sql/emp57_addr_book_group.md) |

## 테이블

[`emp01_person`](../../../db/tables/emp.md), [`emp10_addr_book`](../../../db/tables/emp.md), [`emp57_addr_book_group`](../../../db/tables/emp.md)

## DB 함수

`f_get_emptrans`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Emp57_Lookup_List (`client/vi/emp/Emp57_Lookup_List.java`, 224줄)

- 툴바 `buttonBar`: {publicYn}
- 입력·하위 화면: `publicYn` CheckBox, `lookup` Emp57_Lookup_DetailList
- 그리드 `grid` (buildGrid(), 체크박스):
  - groupName 200 "그룹명" Text
  - actionCell 35 " " Cell 편집:actionCell

#### 이벤트
[E1] publicYn[전체공개 포함].ValueChange (L85) → retrieve()
[E2] confirmButton[확인].Select (L92) → selectItem()
[E3] cancelButton[닫기].Select (L100) → hide()
[E4] grid.RowDoubleClick (L106) → selectItem()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L54-80 | 공개 메서드 | 상태 처리 | 업무 |
| private selectItem() | L114-184 | E2,E4 | 서비스 emp.Emp57_AddrBookGroup.selectByParentId(parentId) | 업무 |
| public retrieve() | L204-215 | E1,open | 서비스 emp.Emp57_AddrBookGroup.getList(companyId, personId, publicYn) | 업무 |
| private settings() | L82-112 | open | 이벤트 연결, 초기값: publicYn=false("전체공개 포함") | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L186-202 | 필드 초기화 | 조회창 Emp57_Lookup_DetailList 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L217-219 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L221-223 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('groupNm', 200, '그룹명'),  // L199
  // ⚠ 대응 없음 (GridBuilder L200) addCell
];
```

#### 사용된 버튼들
1. <Button type="save" onClick={selectItem}>확인</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Emp57_Lookup_DetailList (`client/vi/emp/Emp57_Lookup_DetailList.java`, 79줄)

- 그리드 `grid` (buildGrid()):
  - parentGubun 50 "구분" TextCenter
  - parentName 250 "담당자/사원명" Text
  - emailAddress 220 "이메일" Text
  - mobileTelNo 120 "핸드폰 번호" Text
  - note 500 "비고" Text

#### 이벤트
[E1] cancelButton[닫기].Select (L46) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L27-43 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L65-74 | open | 서비스 emp.Emp57_AddrBookGroup.selectByParentId(parentId) | 업무 |
| private settings() | L45-52 | open | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L54-63 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L76-78 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('parentGubun', 50, '구분'),  // L56 SQL 계산 컬럼(selectByParentId: emp57.parent_gubun)
  gb.text('parentNm', 250, '담당자/사원명'),  // L57 SQL 계산 컬럼(selectByParentId: emp57.parent_nm)
  gb.text('emailAddr', 220, '이메일'),  // L58 SQL 계산 컬럼(selectByParentId: emp57.email_addr)
  gb.text('mobileTelno', 120, '핸드폰 번호'),  // L59 SQL 계산 컬럼(selectByParentId: emp57.mobile_telno)
  gb.text('note', 500, '비고'),  // L60
];
```

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>

