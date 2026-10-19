# Com50_Lookup_StkItem

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `adv`, `flt`, `fnd`, `sch`
- 파일: `client/vi/com/Com50_Lookup_StkItem.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `com.Com50_Item.delete` | Com50_Lookup_StkItem:296 | [`Com50_Item.java:57`](../../com/services/Com50_Item.md) | `UpdateDataModel(com50_item)` 동적 DELETE |
| `com.Com50_Item.selectByTextPaging` | Com50_Lookup_StkItem:113 | [`Com50_Item.java:30`](../../com/services/Com50_Item.md) | [`com50_item.selectByTextPaging`](../../com/sql/com50_item.md), [`com50_item.selectByTextPagingTotal`](../../com/sql/com50_item.md) |
| `com.Com50_Item.update` | Com50_Lookup_StkItem:280 | [`Com50_Item.java:37`](../../com/services/Com50_Item.md) | [`com50_item.checkItemCode`](../../com/sql/com50_item.md), `UpdateDataModel(com50_item)` 동적 INSERT/UPDATE → [`com50_item.selectById`](../../com/sql/com50_item.md) |

## 테이블

[`com50_item`](../../../db/tables/com.md)

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Com50_Lookup_StkItem (`client/vi/com/Com50_Lookup_StkItem.java`, 329줄)

- 툴바 `buttonBar`: 검색: {searchText} {retrieveButton} {insertButton} {updateButton} {deleteButton}
- 입력·하위 화면: `searchText` TextField 빈칸="종목코드/명"
- 그리드 `grid` (buildGrid()):
  - itemCode 120 "종목코드" TextCenter
  - itemName 350 "종목명" Text
  - itemCode 120 "종목코드" TextCenter 편집:TextField
  - itemName 350 "종목명" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L66-71) → 초기화
[E1] searchText.KeyPress [Enter] (L141) → retrieve()
[E2] grid.CellDoubleClick (L152) → confirm()
[E3] retrieveButton[조회].Select (L159) → retrieve()
[E4] insertButton[등록].Select (L165) → insertRow()
[E5] updateButton[저장].Select (L171) → update()
[E6] deleteButton[삭제].Select (L177) → delete()
       └ [E9] msgBox.DialogHide [YES] (L290) → 서비스 com.Com50_Item.delete
[E7] oKButton[선택].Select (L183) → confirm()
[E8] cancelButton[닫기].Select (L189) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public view() | L73-78 | 공개 메서드 | 상태 처리 | 업무 |
| public view() | L80-85 | 공개 메서드 | 상태 처리 | 업무 |
| public edit() | L87-92 | 공개 메서드 | 상태 처리 | 업무 |
| private open() | L94-136 | view,edit | 서비스 com.Com50_Item.selectByTextPaging | 업무 |
| private setGridColumnHidden() | L197-209 | settings | 상태 처리 | 업무 |
| private retrieve() | L223-242 | E1,E3,open | 상태 처리 | 업무 |
| private insertRow() | L244-250 | E4 | 상태 처리 | 업무 |
| private update() | L252-281 | E5 | 서비스 com.Com50_Item.update | 업무 |
| private delete() | L283-306 | E6 | ConfirmBox → E9 | 업무 |
| private confirm() | L308-319 | E2,E7 | 미선택 시 alert "선택된 종목이 없습니다" | 업무 |
| private settings() | L138-195 | open | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L211-221 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L321-323 | view,edit | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L325-327 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('itemCd', 120, '종목코드'),  // L215
  gb.text('itemNm', 350, '종목명'),  // L216
  gb.textCenter('itemCd', 120, '종목코드', { editor: 'text' }),  // L217
  gb.text('itemNm', 350, '종목명', { editor: 'text' }),  // L218
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={delete}>삭제</Button>
5. <Button type="select" onClick={confirm}>선택</Button>
6. <Button type="unknown" onClick={hide}>닫기</Button>

