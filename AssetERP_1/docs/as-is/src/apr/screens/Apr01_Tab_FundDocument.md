# Apr01_Tab_FundDocument

- 종류: 화면
- 메뉴: 문서작성 > 02. 문서검색 > 펀드별 문서검색 (#1005)
- 파일: `client/vi/apr/Apr01_Tab_FundDocument.java`
- 함께 쓰는 클래스 1개:
  - `Apr01_Grid_FundDocList` `client/vi/apr/Apr01_Grid_FundDocList.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectByFundDocList` | Apr01_Grid_FundDocList:65 | [`Apr01_Appr.java:1149`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectByFundDocList`](../../apr/sql/apr01_appr.md) |
| `fnd.Fnd01_FundCode.selectByFundOrgAuth` | Apr01_Tab_FundDocument:189 | [`Fnd01_FundCode.java:56`](../../fnd/services/Fnd01_FundCode.md) | [`fnd01_fund_code.selectByFundOrgAuth`](../../fnd/sql/fnd01_fund_code.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr03_relate_fund`](../../../db/tables/apr.md), [`apr04_appr_step`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`apr13_person_auth`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr03_org_auth`](../../../db/tables/dcr.md), [`dcr04_emp_auth`](../../../db/tables/dcr.md), [`fnd00_fund`](../../../db/views.md), [`fnd01_fund_code`](../../../db/tables/fnd.md), [`fnd02_fund_info`](../../../db/tables/fnd.md), [`fnd08_org_auth`](../../../db/tables/fnd.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md)

## DB 함수

`f_class_tree_nm_allpath`, `f_max_workdate`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Apr01_Tab_FundDocument (`client/vi/apr/Apr01_Tab_FundDocument.java`, 212줄)

- 레이아웃: north=vlc, center=hlc
- 툴바 `buttonBar`: 펀드유형: {fundTypeComboBox} 클래스구분: {classTypeComboBox} 펀드: {fundText} {closeYnCheckBox} {classFundExceptYnCheckBox} {retrieveButton}
- 입력·하위 화면: `fundTypeComboBox` ComboBoxField("IcamFundType", "%", "전체"), `classTypeComboBox` ComboBoxField("IcamClassType", "%", "전체"), `closeYnCheckBox` CheckBox, `classFundExceptYnCheckBox` CheckBox, `fundText` TextField 빈칸="전체", `receiveName` TextField 빈칸="미입력"
- 그리드 `grid` (buildGrid(), 체크박스):
  - fundCode 70 "코드" Text
  - fundName 500 "펀드명" Text
  - kofiaFundTypeName 150 "펀드유형" Text
  - startDate 90 "설정일" Date
  - endDate 90 "해지(예정)일" Date
  - closeName 60 "펀드상태" Text
  - kofiaTrustName 80 "신탁구분" Text
  - kofiaPublicName 40 "구분" Text
  - orgCodeName 150 "운용본부(팀)" Text
  - operator1 90 "운용역1" Text
  - operator2 90 "운용역2" Text
  - note 200 "비고" Text
  - apprCount 90 "생성문서" Long

#### 이벤트
[E0] 화면 열림 (생성자 L49-98) → settings()
[E1] fundText.KeyPress [Enter] (L115) → retrieveFundList()
[E2] receiveName.KeyPress [Enter] (L126) → retrieveFundList()
[E3] retrieveButton[조회].Select (L134) → retrieveFundList()
[E4] grid.SelectionChanged [선택>0] (L140) → retrieveDocList()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieveFundList() | L172-198 | E1,E2,E3 | 서비스 fnd.Fnd01_FundCode.selectByFundOrgAuth(companyId, orgId, empId, closeYn, classFundExceptYn, startDate, fundName, fundTypeCode, classTypeCode, planYn, receiveName) | 업무 |
| private retrieveDocList() | L200-203 | E4 | 상태 처리 | 업무 |
| private settings() | L100-148 | 생성자 | 이벤트 연결, 초기값: fundTypeComboBox="전체"("IcamFundType"), classTypeComboBox="전체"("IcamClassType"), closeYnCheckBox=false("해지펀드포함"), classFundExceptYnCheckBox=true("클래스펀드&차등분배형 제외") | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L150-170 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L205-207 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L209-211 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('fundCd', 70, '코드'),  // L155
  gb.text('fundNm', 500, '펀드명'),  // L156
  gb.text('kofiaFundTypeNm', 150, '펀드유형'),  // L157
  gb.date('startDate', 90, '설정일'),  // L158
  gb.date('endDate', 90, '해지(예정)일'),  // L159
  gb.text('closeNm', 60, '펀드상태'),  // L160
  gb.text('kofiaTrustNm', 80, '신탁구분'),  // L161
  gb.text('kofiaPublicNm', 40, '구분'),  // L162
  gb.text('orgCodeNm', 150, '운용본부(팀)'),  // L163
  gb.text('operator1', 90, '운용역1'),  // L164
  gb.text('operator2', 90, '운용역2'),  // L165
  gb.text('note', 200, '비고'),  // L166
  gb.long('apprCount', 90, '생성문서'),  // L167
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieveFundList}>조회</Button>

### Apr01_Grid_FundDocList (`client/vi/apr/Apr01_Grid_FundDocList.java`, 73줄)

- 입력·하위 화면: `apprEditor` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid(), 체크박스):
  - regDate 100 "상신일" Date
  - effectDate 100 "시행일" Date
  - classTreeNameAllPath 500 "문서분류" Text
  - title 500 "상신제목" Text
  - receiveName 150 "수신처" Text
  - actionCell 60 "상세보기" Cell 편집:detailCell
  - fileName 500 "첨부파일" Text

#### 이벤트
[E0] 화면 열림 (생성자 L22-25) → 초기화

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L57-71 | 공개 메서드 | 서비스 apr.Apr01_Appr.selectByFundDocList(companyId, orgId, fundCodeId, empId) | 업무 |
| public buildGrid() | L27-55 | 필드 초기화 | 팝업 Apr01_Edit_ApprDoc 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('regDate', 100, '상신일'),  // L46
  gb.date('effectDate', 100, '시행일'),  // L47
  gb.text('treeNmAllpath', 500, '문서분류'),  // L48
  gb.text('title', 500, '상신제목'),  // L49
  gb.text('receiveNm', 150, '수신처'),  // L50
  // ⚠ 대응 없음 (GridBuilder L51) addCell
  gb.text('fileNm', 500, '첨부파일'),  // L52
];
```

#### 사용된 버튼들
버튼 사용하지 않음

