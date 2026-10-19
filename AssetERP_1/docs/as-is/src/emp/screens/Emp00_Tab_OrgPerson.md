# Emp00_Tab_OrgPerson

- 종류: 화면
- 메뉴: 경영관리 > 01. 조직 및 사원관리 > 조직별 사원조회 (#1030)
- 파일: `client/vi/emp/Emp00_Tab_OrgPerson.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Org01_Tree_OrgCode`](../../org/components/Org01_Tree_OrgCode.md), [`Org02_View_Chart`](../../org/components/Org02_View_Chart.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `emp.Emp00_TransInfo.selectByAllOrgCodeId` | Emp00_Tab_OrgPerson:117 | [`Emp00_TransInfo.java:514`](../../emp/services/Emp00_TransInfo.md) | [`emp00_trans_info.selectByAllOrgCodeId`](../../emp/sql/emp00_trans_info.md) |

## 테이블

[`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys01_company`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_org_parent_info_nm`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Emp00_Tab_OrgPerson (`client/vi/emp/Emp00_Tab_OrgPerson.java`, 193줄)

- 레이아웃: north=buttonBar, west=cp, center=grid
- 툴바 `buttonBar`: 기준일: {baseDate} {retrieveButton}
- 입력·하위 화면: `baseDate` MyDateField, `buildTree` Org01_Tree_OrgCode
- 그리드 `grid` (buildGrid()):
  - personIdString 110 "이미지" Cell 편집:EmpImageCell
  - empKorName 100 "성명" Text
  - posName 80 "직위" Text
  - orgKorName 150 "본부(부서)" Text
  - titleName2 100 "직책" Text
  - hireDate 100 "입사일" Date
  - emailAddress 200 "e-mail" Text
  - mobileTelNo 120 "H˙P" Text
  - officeTelNo 120 "전화" Text
  - empNo 80 "사번" Text

#### 이벤트
[E0] 화면 열림 (생성자 L77-154) → retrieve()
[E1] retrieveButton[조회].Select (L87) → retrieve()
[E2] viewOrgChartButton[조직도보기].Select (L96) → viewOrgChart()
[E3] orgTree.SelectionChanged [data != null] (L106) → 서비스 emp.Emp00_TransInfo.selectByAllOrgCodeId(orgCodeId, baseDate, companyId)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| protected viewOrgChart() | L156-165 | E2 | 상태 처리 | 업무 |
| private retrieve() | L186-188 | 생성자,E1 | 상태 처리 | 업무 |
| public buildGrid() | L167-183 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| public render() | L70-74 | 공개 메서드 | 상태 처리 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L190-192 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L170) addCell
  gb.text('korNm', 100, '성명'),  // L171
  gb.text('posNm', 80, '직위'),  // L173
  gb.text('korNm', 150, '본부(부서)'),  // L174
  gb.text('titleNm2', 100, '직책'),  // L175
  gb.date('hireDate', 100, '입사일'),  // L176
  gb.text('emailAddr', 200, 'e-mail'),  // L177
  gb.text('mobileTelno', 120, 'H˙P'),  // L178
  gb.text('officeTelno', 120, '전화'),  // L179
  gb.text('empNo', 80, '사번'),  // L180
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="org" onClick={viewOrgChart}>조직도보기</Button>

