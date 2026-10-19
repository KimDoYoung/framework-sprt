# Ast01_Tab_InfoManager

- 종류: 화면
- 메뉴: 기초자료 > 30. 자산&경영 > 자산상세 항목관리 (#1089)
- 파일: `client/vi/ast/Ast01_Tab_InfoManager.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `ast.Ast02_Detail.delete` | Ast01_Tab_InfoManager:172 | [`Ast02_Detail.java:57`](../../ast/services/Ast02_Detail.md) | `UpdateDataModel(ast02_detail)` 동적 DELETE |
| `ast.Ast02_Detail.selectByCompanyId0` | Ast01_Tab_InfoManager:139 | [`Ast02_Detail.java:31`](../../ast/services/Ast02_Detail.md) | [`ast02_detail.selectByCompanyId0`](../../ast/sql/ast02_detail.md) |
| `ast.Ast02_Detail.update` | Ast01_Tab_InfoManager:169 | [`Ast02_Detail.java:52`](../../ast/services/Ast02_Detail.md) | `UpdateDataModel(ast02_detail)` 동적 INSERT/UPDATE → [`ast02_detail.selectById`](../../ast/sql/ast02_detail.md) |

## 테이블

[`ast02_detail`](../../../db/tables/ast.md)

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ast01_Tab_InfoManager (`client/vi/ast/Ast01_Tab_InfoManager.java`, 208줄)

- 레이아웃: center=vlc01
- 툴바 `buttonBar`: 검색: {searchText} {retrieveButton} {updateButton} {addRowButton} {deleteRowButton} {useYnBox}
- 입력·하위 화면: `searchText` TextField 빈칸="연관태그를 입력해주세요", `useYnBox` CheckBox
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - seq 60 "조회순번" Long 편집:LongField
  - title 200 "항목" Text 편집:TextField
  - tag 280 "연관태그" Text 편집:TextField
  - useYn 60 "사용여부" Boolean

#### 이벤트
[E0] 화면 열림 (생성자 L54-117) → 초기화
[E1] searchText.KeyPress [Enter] (L55) → retrieve()
[E2] retrieveButton[조회].Select (L63) → retrieve()
[E3] updateButton[저장].Select (L69) → update()
[E4] addRowButton[행 추가].Select (L75) → insertRow()
[E5] deleteRowButton[행 삭제].Select (L81) → deleteRow()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L130-148 | E1,E2 | 서비스 ast.Ast02_Detail.selectByCompanyId0(defaultYn, companyId, searchText, useYn) | 업무 |
| public update() | L151-178 | E3 | GridDeleteData ast.Ast02_Detail.update, ast.Ast02_Detail.delete | 업무 |
| public insertRow() | L181-189 | E4 | 상태 처리 | 업무 |
| public deleteRow() | L192-199 | E5 | 상태 처리 | 업무 |
| private buildGrid() | L119-127 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L201-203 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L205-207 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.long('seq', 60, '조회순번', { editor: 'number' }),  // L122
  gb.text('title', 200, '항목', { editor: 'text' }),  // L123
  gb.text('tag', 280, '연관태그', { editor: 'text' }),  // L124
  gb.boolean('useYn', 60, '사용여부'),  // L125
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="addRow" onClick={insertRow}>행 추가</Button>
4. <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>

