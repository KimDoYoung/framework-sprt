# Emp01_Lookup_TransDate

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `pay`
- 파일: `client/vi/emp/Emp01_Lookup_TransDate.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `emp.Emp03_Trans.selectByText` | Emp01_Lookup_TransDate:136 | [`Emp03_Trans.java:35`](../../emp/services/Emp03_Trans.md) | [`emp03_trans.selectByText`](../../emp/sql/emp03_trans.md) |

## 테이블

[`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md)

## DB 함수

`f_cdnm`, `f_code_seq`, `f_get_emptrans`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Emp01_Lookup_TransDate (`client/vi/emp/Emp01_Lookup_TransDate.java`, 163줄)

- 툴바 `buttonBar`: 조회일자: {transDate} 검색: {korName} {retrieveButton}
- 입력·하위 화면: `korName` TextField, `transDate` MyDateField
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - orgName 140 "조직" Text
  - empNo 80 "사번" Text
  - empKorName 80 "성명" Text
  - titleName 100 "직책" Text

#### 이벤트
[E1] korName.KeyPress [Enter] (L67) → retrieve()
[E2] retrieveButton[조회].Select (L75) → retrieve()
[E3] oKButton[확인].Select (L81) → confirm()
[E4] cancelButton[취소].Select (L87) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L49-52 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L54-114 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L128-142 | E1,E2,open | 서비스 emp.Emp03_Trans.selectByText(companyId, searchText, transDate, isSeparateAddTitle) | 업무 |
| public confirm() | L144-153 | E3 | 상태 처리 | 업무 |
| private buildGrid() | L116-126 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L155-157 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L159-161 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('korNm', 140, '조직'),  // L120
  gb.text('empNo', 80, '사번'),  // L121
  gb.text('korNm', 80, '성명'),  // L122
  gb.text('titleNm', 100, '직책'),  // L123 SQL 계산 컬럼(selectByText: f_get_empTrans(emp03_person_id, emp03_t…)
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="cancel" onClick={hide}>취소</Button>

