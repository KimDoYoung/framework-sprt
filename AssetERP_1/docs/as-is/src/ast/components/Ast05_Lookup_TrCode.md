# Ast05_Lookup_TrCode

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `act`
- 파일: `client/vi/ast/Ast05_Lookup_TrCode.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `ast.Ast05_TrCode.delete` | Ast05_Lookup_TrCode:307 | [`Ast05_TrCode.java:94`](../../ast/services/Ast05_TrCode.md) | `UpdateDataModel(ast05_tr_code)` 동적 DELETE |
| `ast.Ast05_TrCode.selectBySearchText` | Ast05_Lookup_TrCode:356 | [`Ast05_TrCode.java:37`](../../ast/services/Ast05_TrCode.md) | [`ast05_tr_code.selectBySearchText`](../../ast/sql/ast05_tr_code.md) |
| `ast.Ast05_TrCode.update` | Ast05_Lookup_TrCode:315 | [`Ast05_TrCode.java:66`](../../ast/services/Ast05_TrCode.md) | [`ast05_tr_code.checkTrCode`](../../ast/sql/ast05_tr_code.md), `UpdateDataModel(ast05_tr_code)` 동적 INSERT/UPDATE → [`ast05_tr_code.selectById`](../../ast/sql/ast05_tr_code.md) |

## 테이블

[`act11_tr_map`](../../../db/tables/act.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast05_tr_code`](../../../db/tables/ast.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ast05_Lookup_TrCode (`client/vi/ast/Ast05_Lookup_TrCode.java`, 393줄)

- 툴바 `buttonBar`: {label} {searchText} {rcvPayCodeCombo} {retrieveButton} {insertButton} {deleteButton}
- 입력·하위 화면: `searchText` TextField 빈칸="거래코드/명", `rcvPayCodeCombo` ComboBoxField("RcvPayCode", "%", "전체"), `RcvPayComboBox` ComboBoxField("RcvPayCode")
- 그리드 `grid` (buildGrid()):
  - trCode 80 "거래코드" Text
  - trName 240 "거래명" Text
  - rcvPayName 120 "수령/지급" Text
  - trCode 80 "거래코드" Text 편집:TextField
  - trName 240 "거래명" Text 편집:TextField
  - rcvPayName 120 "수령/지급" Text 편집:RcvPayComboBox
  - useYn 100 "사용여부" Boolean

#### 이벤트
[E0] 화면 열림 (생성자 L112-131) → show()
[E1] grid.CellDoubleClick [callbackResult != null] (L134) → hide()
[E2] confirmButton[확인].Select [callbackResult != null] (L150) → hide()
[E3] selectAllButton[전체].Select (L170) → hide()
[E4] cancleButton[닫기].Select (L177) → hide()
[E5] retrieveButton[조회].Select (L183) → retrieve()
[E6] updateButton[저장].Select (L189) → update()
[E7] insertButton[행 추가].Select (L195) → insertRow()
[E8] deleteButton[행 삭제].Select (L201) → deleteRow()
[E9] searchText.KeyPress [Enter] (L214) → retrieve()
[E10] RcvPayComboBox[RcvPayCode].Collapse (L261) → 인라인 L261-268 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L72-75 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L77-80 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L82-84 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L86-99 | 공개 메서드 | 상태 처리 | 업무 |
| public edit() | L101-110 | 공개 메서드 | 상태 처리 | 업무 |
| public setting() | L133-254 | open,edit | 미선택 시 alert "저장 후 선택해주세요." | 업무 |
| private update() | L280-327 | E6 | GridDeleteData ast.Ast05_TrCode.delete, ast.Ast05_TrCode.update | 업무 |
| public retrieve() | L329-363 | E5,E9,open,edit,update | 서비스 ast.Ast05_TrCode.selectBySearchText(companyId, useYn, searchText, rcvPayCode, assetType, financeYn) | 업무 |
| private insertRow() | L365-375 | E7 | 상태 처리 | 업무 |
| private deleteRow() | L377-383 | E8 | 상태 처리 | 업무 |
| public buildGrid() | L256-278 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L385-387 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L389-391 | 필드 초기화 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('trCd', 80, '거래코드'),  // L270
  gb.text('trNm', 240, '거래명'),  // L271
  gb.text('rcvPayNm', 120, '수령/지급'),  // L272
  gb.text('trCd', 80, '거래코드', { editor: 'text' }),  // L273
  gb.text('trNm', 240, '거래명', { editor: 'text' }),  // L274
  gb.text('rcvPayNm', 120, '수령/지급', { editor: 'select' }),  // L275
  gb.boolean('useYn', 100, '사용여부'),  // L276
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="addRow" onClick={insertRow}>행 추가</Button>
3. <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>
4. <Button type="save" onClick={update}>저장</Button>
5. <Button type="save" onClick={hide}>확인</Button>
6. <Button type="unknown" onClick={hide}>전체</Button>
7. <Button type="unknown" onClick={hide}>닫기</Button>

