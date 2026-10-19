# Bbs15_Tab_CompanyRule

- 종류: 화면
- 메뉴: 준법감시 > 02. 회사규정 > 회사규정 (#1476)
- 메뉴: 커뮤니티 > 01. 회사규정 > 회사규정 (#1344)
- 파일: `client/vi/bbs/Bbs15_Tab_CompanyRule.java`
- 함께 쓰는 클래스 1개:
  - `Bbs15_Lookup_Content` `client/vi/bbs/Bbs15_Lookup_Content.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Bbs02_Lookup_File`](../../bbs/components/Bbs02_Lookup_File.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `bbs.Bbs15_CompanyRule.selectBySearchText` | Bbs15_Tab_CompanyRule:133 | [`Bbs15_CompanyRule.java:33`](../../bbs/services/Bbs15_CompanyRule.md) | [`bbs15_company_rule.selectBySearchText`](../../bbs/sql/bbs15_company_rule.md) |
| `sys.Sys10_File.selectByParentId` | Bbs15_Lookup_Content:93 | [`Sys10_File.java:51`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |

## 테이블

[`bbs15_company_rule`](../../../db/tables/bbs.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md), [`tdm11_task_relate_rule`](../../../db/tables/tdm.md)

## DB 함수

`f_cdnm`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Bbs15_Tab_CompanyRule (`client/vi/bbs/Bbs15_Tab_CompanyRule.java`, 151줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 구분: {companyRuleName} 검색: {searchTextField} {retrieveButton}
- 입력·하위 화면: `searchTextField` TextField 빈칸="규정명", `companyRuleName` ComboBoxField("CompanyRuleType", "%", "전체", "전체"), `popup` Bbs15_Lookup_Content
- 그리드 `grid` (buildGrid()):
  - ruleTypeName 150 "구분" Text
  - companyRuleCode 100 "규정코드" TextCenter
  - title 650 "회사규정명" Text
  - actionCell 55 "상세보기" Cell 편집:editCell
  - note 350 "비고" Text
  - revisionDate 100 "제개정일" Date
  - revisionNo 70 "개정회차" LongCenter
  - fileCnt 130 "규정 첨부파일 갯수" LongCenter

#### 이벤트
[E0] 화면 열림 (생성자 L49-72) → settings(), retrieve()
[E1] searchTextField.KeyPress [Enter] (L77) → retrieve()
[E2] companyRuleName[CompanyRuleType].Collapse (L88) → retrieve()
[E3] retrieveButton[조회].Select (L95) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public execute() | L43-46 | buildGrid,retrieve | 상태 처리 | 업무 |
| private retrieve() | L125-139 | 생성자,E1,E2,E3,execute | 서비스 bbs.Bbs15_CompanyRule.selectBySearchText(companyId, ruleType, stdDate, searchText) | 업무 |
| private viewContent() | L141-145 | buildGrid | 조회창 Bbs15_Lookup_Content 열기 | 업무 |
| public settings() | L74-101 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L103-123 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L147-149 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('ruleTypeNm', 150, '구분'),  // L113
  gb.textCenter('companyRuleCd', 100, '규정코드'),  // L114
  gb.text('title', 650, '회사규정명'),  // L115
  // ⚠ 대응 없음 (GridBuilder L116) addCell
  gb.text('note', 350, '비고'),  // L117
  gb.date('revisionDate', 100, '제개정일'),  // L118
  gb.longCenter('revisionNo', 70, '개정회차'),  // L119
  gb.longCenter('fileCnt', 130, '규정 첨부파일 갯수'),  // L120
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

### Bbs15_Lookup_Content (`client/vi/bbs/Bbs15_Lookup_Content.java`, 122줄)

- 입력·하위 화면: `lookupFile` Bbs02_Lookup_File

#### 이벤트
[E0] 화면 열림 (생성자 L37-57) → settings()
[E1] closeButton[닫기].Select (L60) → hide()
[E2] fileButton[첨부파일(0건)].Select (L66) → 인라인 L66-72 (new SelectHandler(){ @Override public…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L75-90 | 공개 메서드 | 상태 처리 | 업무 |
| private setFileButtonText() | L92-103 | open | 서비스 sys.Sys10_File.selectByParentId(parentId) | 업무 |
| private settings() | L59-73 | 생성자 | 조회창 Bbs02_Lookup_File 열기, 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlHeaderStyle() | L110-120 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={() => /* 인라인 L66-72 (new SelectHandler(){ @Override public…) */}>첨부파일(0건)</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

