# Fnd25_Tab_FundTerms

- 종류: 화면
- 메뉴: 펀드관리 > 02. 펀드관리 > 펀드규약 (#1504)
- 파일: `client/vi/fnd/Fnd25_Tab_FundTerms.java`
- 함께 쓰는 클래스 1개:
  - `Fnd25_Lookup_Content` `client/vi/fnd/Fnd25_Lookup_Content.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Com01_Lookup_RelateFile`](../../com/components/Com01_Lookup_RelateFile.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `fnd.Fnd25_Terms.selectBySearchTextManager` | Fnd25_Tab_FundTerms:131 | [`Fnd25_Terms.java:22`](../../fnd/services/Fnd25_Terms.md) | [`fnd25_terms.selectBySearchTextManager`](../../fnd/sql/fnd25_terms.md) |
| `sys.Sys10_File.selectByParentId` | Fnd25_Lookup_Content:94 | [`Sys10_File.java:51`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |

## 테이블

[`fnd25_terms`](../../../db/tables/fnd.md), [`fnd26_terms_detail`](../../../db/tables/fnd.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Fnd25_Tab_FundTerms (`client/vi/fnd/Fnd25_Tab_FundTerms.java`, 149줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 구분: {fundTermsName} 검색: {searchTextField} {retrieveButton}
- 입력·하위 화면: `searchTextField` TextField 빈칸="펀드규약명", `fundTermsName` ComboBoxField("FundTermsType", "%", "전체", "전체"), `popup` Fnd25_Lookup_Content
- 그리드 `grid` (buildGrid()):
  - termsTypeName 150 "구분" Text
  - termsName 650 "펀드규약명" Text
  - actionCell 55 "상세보기" Cell 편집:editCell
  - note 350 "비고" Text
  - revisionDate 100 "제개정일" Date
  - revisionNo 70 "개정회차" LongCenter
  - fileCnt 80 "첨부파일 갯수" LongCenter

#### 이벤트
[E0] 화면 열림 (생성자 L49-72) → settings(), retrieve()
[E1] searchTextField.KeyPress [Enter] (L77) → retrieve()
[E2] fundTermsName[FundTermsType].Collapse (L88) → retrieve()
[E3] retrieveButton[조회].Select (L95) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public execute() | L43-46 | buildGrid,retrieve | 상태 처리 | 업무 |
| private retrieve() | L124-137 | 생성자,E1,E2,E3,execute | 서비스 fnd.Fnd25_Terms.selectBySearchTextManager(companyId, termsType, searchText) | 업무 |
| private viewContent() | L139-143 | buildGrid | 조회창 Fnd25_Lookup_Content 열기 | 업무 |
| public settings() | L74-101 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L103-122 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L145-147 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('termsTypeNm', 150, '구분'),  // L113 SQL 계산 컬럼(selectBySearchTextManager: f_cdnm('FundTermsType', fnd25_terms_typ…)
  gb.text('termsNm', 650, '펀드규약명'),  // L114 SQL 계산 컬럼(selectBySearchTextManager: fnd26.fnd26_terms_nm)
  // ⚠ 대응 없음 (GridBuilder L115) addCell
  gb.text('note', 350, '비고'),  // L116 SQL 계산 컬럼(selectBySearchTextManager: fnd26.fnd26_note)
  gb.date('revisionDate', 100, '제개정일'),  // L117 SQL 계산 컬럼(selectBySearchTextManager: fnd26.fnd26_revision_date)
  gb.longCenter('revisionNo', 70, '개정회차'),  // L118 SQL 계산 컬럼(selectBySearchTextManager: fnd26.fnd26_revision_no)
  gb.longCenter('fileCnt', 80, '첨부파일 갯수'),  // L119 SQL 계산 컬럼(selectBySearchTextManager: ( SELECT COUNT(*) FROM sys10_file WHERE…)
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

### Fnd25_Lookup_Content (`client/vi/fnd/Fnd25_Lookup_Content.java`, 123줄)

- 입력·하위 화면: `lookupFile` Com01_Lookup_RelateFile

#### 이벤트
[E0] 화면 열림 (생성자 L38-58) → settings()
[E1] closeButton[닫기].Select (L61) → hide()
[E2] fileButton[첨부파일(0건)].Select (L67) → 인라인 L67-73 (new SelectHandler(){ @Override public…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L76-91 | 공개 메서드 | 상태 처리 | 업무 |
| private setFileButtonText() | L93-104 | open | 서비스 sys.Sys10_File.selectByParentId(parentId) | 업무 |
| private settings() | L60-74 | 생성자 | 조회창 Com01_Lookup_RelateFile 열기, 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlHeaderStyle() | L111-121 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={() => /* 인라인 L67-73 (new SelectHandler(){ @Override public…) */}>첨부파일(0건)</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

