# Dcr05_Lookup_FormView

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `apr`
- 파일: `client/vi/dcr/Dcr05_Lookup_FormView.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `dcr.Dcr05_DocType.selectByClassTreeId` | Dcr05_Lookup_FormView:224 | [`Dcr05_DocType.java:59`](../../dcr/services/Dcr05_DocType.md) | [`dcr05_doc_type.selectByClassTreeId`](../../dcr/sql/dcr05_doc_type.md) |
| `dcr.Dcr05_DocType.selectByName` | Dcr05_Lookup_FormView:212 | [`Dcr05_DocType.java:31`](../../dcr/services/Dcr05_DocType.md) | [`dcr05_doc_type.selectByName`](../../dcr/sql/dcr05_doc_type.md) |

## 테이블

[`dcr05_doc_type`](../../../db/tables/dcr.md), [`dcr06_relate_doc_type`](../../../db/tables/dcr.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md)

## DB 함수

`f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Dcr05_Lookup_FormView (`client/vi/dcr/Dcr05_Lookup_FormView.java`, 281줄)

- 레이아웃: north=vlc, center=cp, center=blc2
- 툴바 `buttonBar`: 구분: {docFormClassComboBox} 검색: {searchText} {checkBox} {searchButton}
- 입력·하위 화면: `docFormClassComboBox` ComboBoxField("DocFormClassCode", "%", "전체"), `searchText` TextField 빈칸="양식제목을 입력해주세요", `checkBox` CheckBox
- 그리드 `grid` (buildGrid()):
  - docFormClassName 150 "구분" Text
  - title 340 "양식 제목" Text
  - note 250 "비고" Text

#### 이벤트
[E0] 화면 열림 (생성자 L77-79) → init()
[E1] docFormClassComboBox[DocFormClassCode].Collapse (L103) → retrieve()
[E2] searchText.KeyPress [Enter] (L112) → retrieve()
[E3] searchButton[조회].Select (L120) → retrieve()
[E4] insertButton[확인].Select (L126) → insert()
[E5] closeButton[닫기].Select (L132) → hide()
[E6] grid.Selection (L138) → setHtml()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private init() | L87-187 | 생성자 | 상태 처리 | 업무 |
| public getServiceResult() | L190-193 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L204-231 | E1,E2,E3,init | 서비스 dcr.Dcr05_DocType.selectByName, dcr.Dcr05_DocType.selectByClassTreeId(companyId, searchText, formClassCode, companyId, searchText, classTreeId, formClassCode) | 업무 |
| private addChild() | L233-240 | 미사용 후보 | 상태 처리 | 업무 |
| private insert() | L247-255 | E4 | 미선택 시 alert "양식을 선택해주세요" | 업무 |
| public buildGrid() | L195-202 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtml() | L242-245 | E6 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L262-264 | 미사용 후보 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L266-268 | init | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L270-272 | 미사용 후보 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L274-276 | init | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L278-280 | init | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('docFormClassNm', 150, '구분'),  // L198 SQL 계산 컬럼(selectByName: b.sys09_name)
  gb.text('title', 340, '양식 제목'),  // L199
  gb.text('note', 250, '비고'),  // L200
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={insert}>확인</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

