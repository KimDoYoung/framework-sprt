# Ast05_Tab_TrCodeManagement

- 종류: 화면
- 메뉴: 펀드관리 > 80. 펀드자산 > 거래코드 관리(운용) (#1120, 미사용)
- 파일: `client/vi/ast/Ast05_Tab_TrCodeManagement.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `ast.Ast05_TrCode.delete` | Ast05_Tab_TrCodeManagement:185 | [`Ast05_TrCode.java:94`](../../ast/services/Ast05_TrCode.md) | `UpdateDataModel(ast05_tr_code)` 동적 DELETE |
| `ast.Ast05_TrCode.selectByCompanyId` | Ast05_Tab_TrCodeManagement:134 | [`Ast05_TrCode.java:31`](../../ast/services/Ast05_TrCode.md) | [`ast05_tr_code.selectByCompanyId`](../../ast/sql/ast05_tr_code.md) |
| `ast.Ast05_TrCode.update` | Ast05_Tab_TrCodeManagement:167 | [`Ast05_TrCode.java:66`](../../ast/services/Ast05_TrCode.md) | [`ast05_tr_code.checkTrCode`](../../ast/sql/ast05_tr_code.md), `UpdateDataModel(ast05_tr_code)` 동적 INSERT/UPDATE → [`ast05_tr_code.selectById`](../../ast/sql/ast05_tr_code.md) |

## 테이블

[`act11_tr_map`](../../../db/tables/act.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast05_tr_code`](../../../db/tables/ast.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ast05_Tab_TrCodeManagement (`client/vi/ast/Ast05_Tab_TrCodeManagement.java`, 192줄)

- 레이아웃: center=vlc01
- 툴바 `buttonBar`: {retrieveButton} {updateButton} {addRowButton} {deleteRowButton} {useYnBox}
- 입력·하위 화면: `useYnBox` CheckBox, `rcvPayComboBox` ComboBoxField("RcvPayCode")
- 그리드 `grid` (buildGrid(), 체크박스):
  - trCode 100 "거래코드" Text 편집:TextField
  - trName 200 "거래명" Text 편집:TextField
  - rcvPayName 100 "수령/지급" Text 편집:rcvPayComboBox
  - useYn 70 "사용여부" Boolean
  - note 300 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L50-102) → 초기화
[E1] retrieveButton[조회].Select (L51) → retrieve()
[E2] updateButton[저장].Select (L57) → update()
[E3] addRowButton[행 추가].Select (L63) → insertRow()
[E4] deleteRowButton[행 삭제].Select (L69) → deleteRow()
[E5] rcvPayComboBox[RcvPayCode].Collapse (L108) → 인라인 L108-115 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L128-143 | E1 | 서비스 ast.Ast05_TrCode.selectByCompanyId(companyId, useYn) | 업무 |
| public update() | L146-169 | E2 | 서비스 ast.Ast05_TrCode.update | 업무 |
| public insertRow() | L172-179 | E3 | 상태 처리 | 업무 |
| public deleteRow() | L182-186 | E4 | GridDeleteData ast.Ast05_TrCode.delete(체크된 행 목록) | 업무 |
| private buildGrid() | L104-125 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlCheckBoxLabelStyle() | L188-190 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('trCd', 100, '거래코드', { editor: 'text' }),  // L118
  gb.text('trNm', 200, '거래명', { editor: 'text' }),  // L119
  gb.text('rcvPayNm', 100, '수령/지급', { editor: 'select' }),  // L120
  gb.boolean('useYn', 70, '사용여부'),  // L121
  gb.text('note', 300, '비고', { editor: 'text' }),  // L122
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="addRow" onClick={insertRow}>행 추가</Button>
4. <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>

