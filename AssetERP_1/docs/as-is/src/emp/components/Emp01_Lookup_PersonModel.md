# Emp01_Lookup_PersonModel

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `bbs`, `cmp`, `sys`, `tdm`
- 파일: `client/vi/emp/Emp01_Lookup_PersonModel.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `emp.Emp03_Trans.selectByText` | Emp01_Lookup_PersonModel:147 | [`Emp03_Trans.java:35`](../../emp/services/Emp03_Trans.md) | [`emp03_trans.selectByText`](../../emp/sql/emp03_trans.md) |

## 테이블

[`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md)

## DB 함수

`f_cdnm`, `f_code_seq`, `f_get_emptrans`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Emp01_Lookup_PersonModel (`client/vi/emp/Emp01_Lookup_PersonModel.java`, 174줄)

- 툴바 `buttonBar`: 조직/직무/성명: {korName} {retrieveButton}
- 입력·하위 화면: `korName` TextField
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - orgName 140 "조직" Text
  - empNo 80 "사번" Text
  - empKorName 80 "성명" Text
  - titleName 100 "직책" Text

#### 이벤트
[E1] korName.KeyPress [Enter] (L76) → retrieve()
[E2] grid.RowDoubleClick (L84) → confirm()
[E3] retrieveButton[조회].Select (L90) → retrieve()
[E4] oKButton[확인].Select (L96) → confirm()
[E5] cancelButton[취소].Select (L102) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L50-53 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L55-57 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L59-64 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L140-153 | E1,E3,settings | 서비스 emp.Emp03_Trans.selectByText(companyId, searchText, isSeparateAddTitle) | 업무 |
| public confirm() | L155-164 | E2,E4 | 상태 처리 | 업무 |
| private settings() | L66-126 | open | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L128-138 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L166-168 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L170-172 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('korNm', 140, '조직'),  // L132
  gb.text('empNo', 80, '사번'),  // L133
  gb.text('korNm', 80, '성명'),  // L134
  gb.text('titleNm', 100, '직책'),  // L135 SQL 계산 컬럼(selectByText: f_get_empTrans(emp03_person_id, emp03_t…)
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="cancel" onClick={hide}>취소</Button>

