# Ast06_Tab_AccruedManagement

- 종류: 화면
- 메뉴: 펀드관리 > 80. 펀드자산 > 펀드자산 미수/미지급 (#1129, 미사용)
- 파일: `client/vi/ast/Ast06_Tab_AccruedManagement.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Ast01_Lookup_Info`](../../ast/components/Ast01_Lookup_Info.md), [`Ast07_Grid_History`](../../ast/components/Ast07_Grid_History.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `ast.Ast06_Tr.selectByAccrued` | Ast06_Tab_AccruedManagement:179 | [`Ast06_Tr.java:174`](../../ast/services/Ast06_Tr.md) | [`ast06_tr.selectByAccrued`](../../ast/sql/ast06_tr.md) |
| `ast.Ast07_Settle.insert` | Ast06_Tab_AccruedManagement:222 | **(없음)** | - |

## 테이블

[`act02_journal`](../../../db/tables/act.md), [`act03_journal_dtl`](../../../db/tables/act.md), [`act13_real_account_map`](../../../db/tables/act.md), [`apr01_appr`](../../../db/tables/apr.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast05_tr_code`](../../../db/tables/ast.md), [`ast06_tr`](../../../db/tables/ast.md), [`ast07_settle`](../../../db/tables/ast.md), [`ast10_manager`](../../../db/tables/ast.md), [`pay50_expense`](../../../db/tables/pay.md), [`sys15_corp`](../../../db/tables/sys.md)

## DB 함수

`f_ast_class_tree_nm`, `f_ast_class_tree_nm_allpath`, `f_cdnm`, `f_emp_kor_nm`, `f_get_corp_nm`, `f_get_emptrans`, `f_get_journal_note`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ast06_Tab_AccruedManagement (`client/vi/ast/Ast06_Tab_AccruedManagement.java`, 241줄)

- 레이아웃: center=vlc, south=gridSettle
- 툴바 `buttonBar01`: 수령/지급: {payName} 종목: {classTreeName} {refreshButton} {updateButton}
- 입력·하위 화면: `payName` ComboBoxField("RcvPayCode", "%", "전체"), `classTreeId` LongField, `classTreeName` LookupTriggerField 빈칸="전체", `lookupInfo` Ast01_Lookup_Info
- 그리드 `grid` (buildGrid()):
  - date 100 "일자" Date
  - classTreeFullName 450 "종목" Text
  - trName 200 "거래유형" Text
  - amt 150 "예정금액" Long
  - accruedAmt 150 "미수/미지급액" Double
  - inputAmt 150 "수령/지급액" Long 편집:LongField
  - inputNote 400 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L62-90) → setting(), retrieve()
[E1] retrieveButton[조회].Select (L93) → retrieve()
[E2] classTreeName.TriggerClick [result != null] (L106) → 인라인 L106-124 (new TriggerClickHandler(){ @Override …)
[E3] refreshButton[조회].Select (L125) → retrieve()
[E4] updateButton[저장].Select (L131) → insertCheck()
       └ [E5] msgBox.DialogHide [YES] (L203) → insert()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setting() | L92-143 | 생성자 | 조회창 Ast01_Lookup_Info 열기 | 업무 |
| public retrieve() | L160-185 | 생성자,E1,E3,insert | 서비스 ast.Ast06_Tr.selectByAccrued(companyId, userId, orgId, assetType, payCode, payCode, classTreeId, classTreeId) | 업무 |
| private insertCheck() | L187-219 | E4 | ConfirmBox → E5 | 업무 |
| private insert() | L221-236 | E5 | 서비스 ast.Ast07_Settle.insert | 업무 |
| public buildGrid() | L145-158 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L238-240 | setting | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('date', 100, '일자'),  // L149
  gb.text('classTreeFullNm', 450, '종목'),  // L150
  gb.text('trNm', 200, '거래유형'),  // L151
  gb.long('amt', 150, '예정금액'),  // L152
  gb.double('accruedAmt', 150, '미수/미지급액'),  // L153
  gb.long('inputAmt', 150, '수령/지급액', { editor: 'number' }),  // L154
  gb.text('inputNote', 400, '비고', { editor: 'text' }),  // L155
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="search" onClick={retrieve}>조회</Button>
3. <Button type="save" onClick={insertCheck}>저장</Button>

