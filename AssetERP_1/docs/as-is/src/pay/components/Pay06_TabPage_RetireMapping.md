# Pay06_TabPage_RetireMapping

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `sys`
- 파일: `client/vi/pay/Pay06_TabPage_RetireMapping.java`
- 함께 쓰는 클래스 1개:
  - `Pay06_Lookup_RetireMapping` `client/vi/pay/Pay06_Lookup_RetireMapping.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Pay06_Popup_Example`](../../pay/components/Pay06_Popup_Example.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `pay.Pay06_ActMapping.delete` | Pay06_TabPage_RetireMapping:219 | [`Pay06_ActMapping.java:82`](../../pay/services/Pay06_ActMapping.md) | `UpdateDataModel(pay06_act_mapping)` 동적 DELETE |
| `pay.Pay06_ActMapping.selectByLinkCode` | Pay06_TabPage_RetireMapping:169 | [`Pay06_ActMapping.java:51`](../../pay/services/Pay06_ActMapping.md) | [`pay06_act_mapping.selectByLinkCode`](../../pay/sql/pay06_act_mapping.md) |
| `pay.Pay06_ActMapping.update` | Pay06_TabPage_RetireMapping:215 | [`Pay06_ActMapping.java:77`](../../pay/services/Pay06_ActMapping.md) | `UpdateDataModel(pay06_act_mapping)` 동적 INSERT/UPDATE → [`pay06_act_mapping.selectById`](../../pay/sql/pay06_act_mapping.md) |

## 테이블

[`pay06_act_mapping`](../../../db/tables/pay.md)

## DB 함수

`f_cdnm`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Pay06_TabPage_RetireMapping (`client/vi/pay/Pay06_TabPage_RetireMapping.java`, 234줄)

- 툴바 `buttonBar`: {insertButton} {deleteButton}
- 툴바 `iconBar`: {anchor}
- 입력·하위 화면: `editor` Pay06_Lookup_RetireMapping, `kindNameComboBox` ComboBoxField("EmpKindCode")
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - linkName 150 "매뉴" TextCenter
  - kindName 100 "사원구분" Text 편집:kindNameComboBox
  - title 400 "제목" Text 편집:TextField
  - actionCell 60 "내용" Cell 편집:actionCell
  - note 400 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L59-102) → retrieve()
[E1] anchor.MouseDown (L62) → retrieve()
[E2] insertButton[행 추가].Select (L68) → insertRow()
[E3] deleteButton[행 삭제].Select (L74) → deleteRow()
[E4] kindNameComboBox[EmpKindCode].Collapse (L127) → 인라인 L127-133 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public insertRow() | L143-152 | E2 | 상태 처리 | 업무 |
| public deleteRow() | L154-160 | E3 | 상태 처리 | 업무 |
| public retrieve() | L162-170 | 생성자,E1 | 서비스 pay.Pay06_ActMapping.selectByLinkCode(companyId, linkCode, kindCode) | 업무 |
| public update() | L172-228 | updateCheck | GridDeleteData pay.Pay06_ActMapping.update, pay.Pay06_ActMapping.delete | 업무 |
| public updateCheck() | L230-233 | 공개 메서드 | 상태 처리 | 업무 |
| public buildGrid() | L104-141 | 필드 초기화 | 조회창 Pay06_Lookup_RetireMapping 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('linkNm', 150, '매뉴'),  // L134 SQL 계산 컬럼(selectByLinkCode: f_cdnm('LinkCode', pay06_link_cd, pay06…)
  gb.text('kindNm', 100, '사원구분', { editor: 'select' }),  // L135 SQL 계산 컬럼(selectByLinkCode: f_cdnm('EmpKindCode', pay06_kind_cd, pa…)
  gb.text('title', 400, '제목', { editor: 'text' }),  // L136
  // ⚠ 대응 없음 (GridBuilder L137) addCell
  gb.text('note', 400, '비고', { editor: 'text' }),  // L138
];
```

#### 사용된 버튼들
1. <Button type="addRow" onClick={insertRow}>행 추가</Button>
2. <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>

### Pay06_Lookup_RetireMapping (`client/vi/pay/Pay06_Lookup_RetireMapping.java`, 177줄)

- 입력·하위 화면: `content` TextField

#### 이벤트
[E0] 화면 열림 (생성자 L67-108) → getEditor(), show()
[E1] updateButton[저장].Select (L84) → update()
[E2] closeButton[닫기].Select (L90) → hide()
[E3] referenceLabel.Click (L96) → 인라인 L96-101 (new ClickHandler() { @Override public…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L61-65 | 공개 메서드 | 상태 처리 | 업무 |
| private getEditor() | L110-144 | 생성자 | 상태 처리 | 업무 |
| public update() | L146-157 | E1 | 상태 처리 | 업무 |
| private setHtmlStyle() | L169-171 | 미사용 후보 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L173-175 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

