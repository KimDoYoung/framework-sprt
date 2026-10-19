# Emp00_RDR_OrgPerson

- 종류: 화면
- 파일: `client/vi/emp/Emp00_RDR_OrgPerson.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Org01_Tree_OrgCode`](../../org/components/Org01_Tree_OrgCode.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `emp.Emp00_TransInfo.selectByOrgCodeId` | Emp00_RDR_OrgPerson:90 | [`Emp00_TransInfo.java:110`](../../emp/services/Emp00_TransInfo.md) | [`emp00_trans_info.selectByOrgCodeId`](../../emp/sql/emp00_trans_info.md) |

## 테이블

[`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys01_company`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_org_parent_info_nm`, `f_org_seq`, `f_sysdate`, `f_today`, `f_trunc`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Emp00_RDR_OrgPerson (`client/vi/emp/Emp00_RDR_OrgPerson.java`, 197줄)

- 레이아웃: north=buttonBar, west=cp, center=grid
- 툴바 `buttonBar`: 기준일: {baseDate} {retrieveButton}
- 입력·하위 화면: `baseDate` MyDateField, `buildTree` Org01_Tree_OrgCode
- 그리드 `grid` (buildGrid()):
  - empKorName 100 "성명" Text
  - birthday 100 "생년월일" Date
  - posName 80 "직위" Text
  - orgTitleName 200 "직책" Text
  - hireDate 100 "입사일" Date
  - emailAddress 200 "e-mail" Text
  - mobileTelNo 120 "H˙P" Text
  - officeTelNo 120 "전화" Text
  - empNo 80 "사번" Text
  - actionCell 80 "양식" Cell 편집:actionCell

#### 이벤트
[E0] 화면 열림 (생성자 L52-151) → retrieve()
[E1] retrieveButton[조회].Select (L62) → retrieve()
[E2] orgTree.SelectionChanged [data != null] (L81) → 서비스 emp.Emp00_TransInfo.selectByOrgCodeId(orgCodeId, baseDate)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieve() | L190-192 | 생성자,E1 | 상태 처리 | 업무 |
| public buildGrid() | L153-187 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L194-196 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('korNm', 100, '성명'),  // L175
  gb.date('birthday', 100, '생년월일'),  // L176
  gb.text('posNm', 80, '직위'),  // L177
  gb.text('orgTitleNm', 200, '직책'),  // L178
  gb.date('hireDate', 100, '입사일'),  // L179
  gb.text('emailAddr', 200, 'e-mail'),  // L180
  gb.text('mobileTelno', 120, 'H˙P'),  // L181
  gb.text('officeTelno', 120, '전화'),  // L182
  gb.text('empNo', 80, '사번'),  // L183
  // ⚠ 대응 없음 (GridBuilder L184) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

