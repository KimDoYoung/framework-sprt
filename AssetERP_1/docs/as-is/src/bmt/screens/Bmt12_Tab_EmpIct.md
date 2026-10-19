# Bmt12_Tab_EmpIct

- 종류: 화면
- 메뉴: 경영관리 > 20. 대외보고서 > 임직원 정보통신수단 (#1361)
- 파일: `client/vi/bmt/Bmt12_Tab_EmpIct.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `bmt.Bmt12_PcHistory.selectEmpICT` | Bmt12_Tab_EmpIct:193 | [`Bmt12_PcHistory.java:43`](../../bmt/services/Bmt12_PcHistory.md) | [`bmt12_pc_history.selectEmpICT`](../../bmt/sql/bmt12_pc_history.md) |
| `sys.Sys99_Print.insertRdEmplct` | Bmt12_Tab_EmpIct:133 | [`Sys99_Print.java:3956`](../../sys/services/Sys99_Print.md) | [`bmt12_pc_history.selectEmpICT`](../../bmt/sql/bmt12_pc_history.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |

## 테이블

[`ast01_class_tree`](../../../db/tables/ast.md), [`bmt10_info`](../../../db/tables/bmt.md), [`bmt11_history`](../../../db/tables/bmt.md), [`bmt12_pc_history`](../../../db/tables/bmt.md), [`sys09_code`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md), [`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_emp_kor_nm`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Bmt12_Tab_EmpIct (`client/vi/bmt/Bmt12_Tab_EmpIct.java`, 204줄)

- 레이아웃: center=vlc
- 툴바 `buttonBarL`: 기준일자: {stdDate} 검색: {searchText} {retrieveButton} {downLoadButton}
- 툴바 `buttonBarR`: {bmtInfoButton}
- 입력·하위 화면: `stdDate` MyDateField, `searchText` TextField 빈칸="사원명/메신저/웹사이트/.."
- 그리드 `grid` (buildGrid()):
  - personName 100 "사원명" TextCenter
  - messenger 250 "메신저" TextArea
  - website 250 "웹사이트" TextArea
  - internalIp 120 "IP주소" Text
  - astClassTreeName 200 "PC명" Text
  - spec 400 "세부사양" TextArea
  - etc 200 "기타사항" TextArea

#### 이벤트
[E0] 화면 열림 (생성자 L55-90) → settings(), retrieve()
[E1] searchText.KeyPress [Enter] (L98) → retrieve()
[E2] retrieveButton[조회].Select (L107) → retrieve()
[E3] bmtInfoButton[전산장비관리 바로가기].Select (L114) → 인라인 L114-125 (new SelectHandler() { @Override publi…)
[E4] downLoadButton[출력/다운로드].Select [result.getStatus() == 1] (L127) → 서비스 sys.Sys99_Print.insertRdEmplct(companyId, personId, windowClassName, stdDate, searchText)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieve() | L185-199 | 생성자,E1,E2 | 서비스 bmt.Bmt12_PcHistory.selectEmpICT(companyId, stdDate, searchText) | 업무 |
| private settings() | L92-168 | 생성자 | 서비스 sys.Sys99_Print.insertRdEmplct(companyId, personId, windowClassName, stdDate, searchText), 이벤트 연결, 초기값: stdDate=LoginUser.getToday( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L170-183 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L201-203 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('personNm', 100, '사원명'),  // L174 SQL 계산 컬럼(selectEmpICT: f_emp_kor_nm(bmt11_person_id))
  gb.textArea('messenger', 250, '메신저'),  // L175 SQL 계산 컬럼(selectEmpICT: bmt11_messenger)
  gb.textArea('website', 250, '웹사이트'),  // L176 SQL 계산 컬럼(selectEmpICT: bmt11_website)
  gb.text('internalIp', 120, 'IP주소'),  // L177
  gb.text('astClassTreeNm', 200, 'PC명'),  // L178 SQL 계산 컬럼(selectEmpICT: ast01_class_tree_nm)
  gb.textArea('spec', 400, '세부사양'),  // L179 SQL 계산 컬럼(selectEmpICT: bmt10_spec)
  gb.textArea('etc', 200, '기타사항'),  // L180
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="goto" onClick={() => /* 인라인 L114-125 (new SelectHandler() { @Override publi…) */}>전산장비관리 바로가기</Button>
3. <Button type="download" onClick={() => /* 서비스 sys.Sys99_Print.insertRdEmplct(companyId, personId, windowClassName, stdDate, searchText) */}>출력/다운로드</Button>

