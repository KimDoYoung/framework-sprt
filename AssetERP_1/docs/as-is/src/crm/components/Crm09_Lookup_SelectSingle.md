# Crm09_Lookup_SelectSingle

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `biz`
- 파일: `client/vi/crm/Crm09_Lookup_SelectSingle.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `crm.Crm09_Contact.selectBiz02Company` | Crm09_Lookup_SelectSingle:171 | [`Crm09_Contact.java:93`](../../crm/services/Crm09_Contact.md) | [`crm09_contact.selectBiz02Company`](../../crm/sql/crm09_contact.md) |
| `crm.Crm09_Contact.selectBiz02Emp` | Crm09_Lookup_SelectSingle:184 | [`Crm09_Contact.java:98`](../../crm/services/Crm09_Contact.md) | [`crm09_contact.selectBiz02Emp`](../../crm/sql/crm09_contact.md) |
| `crm.Crm09_Contact.selectByName` | Crm09_Lookup_SelectSingle:190 | [`Crm09_Contact.java:59`](../../crm/services/Crm09_Contact.md) | [`crm09_contact.selectByName`](../../crm/sql/crm09_contact.md) |
| `crm.Crm09_Contact.selectKeyInCompanyName` | Crm09_Lookup_SelectSingle:177 | [`Crm09_Contact.java:88`](../../crm/services/Crm09_Contact.md) | [`crm09_contact.selectKeyInCompanyName`](../../crm/sql/crm09_contact.md) |

## 테이블

[`biz01_promo`](../../../db/tables/biz.md), [`biz02_person`](../../../db/tables/biz.md), [`crm09_contact`](../../../db/tables/crm.md), [`sys01_company`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_emp_kor_nm`, `f_get_emptrans`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Crm09_Lookup_SelectSingle (`client/vi/crm/Crm09_Lookup_SelectSingle.java`, 218줄)

- 툴바 `buttonBar`: 검색: {findTextField} {retrieveButton}
- 입력·하위 화면: `findTextField` TextField
- 그리드 `grid` (buildGrid(), 체크박스):
  - contactName 150 "회사명" Text
  - contactEmpName 100 "담당자명" Text
  - contactPos 80 "직위" Text
  - contactOrgName 150 "부서" Text
  - majorIssues 200 "주요 논의 사항" Text
  - note 200 "비고" Text

#### 이벤트
[E1] findTextField.KeyPress [Enter] (L68) → retrieve()
[E2] retrieveButton[조회].Select (L77) → retrieve()
[E3] oKButton[확인].Select (L83) → confirm()
[E4] cancelButton[취소].Select (L89) → hide()
[E5] grid.CellDoubleClick (L107) → confirm()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L49-120 | 공개 메서드 | 상태 처리 | 업무 |
| private setting() | L122-140 | open | 상태 처리 | 업무 |
| public retrieve() | L158-197 | E1,E2,open | 서비스 crm.Crm09_Contact.selectBiz02Company, crm.Crm09_Contact.selectKeyInCompanyName, crm.Crm09_Contact.selectBiz02Emp, crm.Crm09_Contact.selectByName(searchText, companyId, itemTypeCode) | 업무 |
| public confirm() | L199-208 | E3,E5 | 상태 처리 | 업무 |
| private buildGrid() | L142-156 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L210-212 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L214-216 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('contactNm', 150, '회사명'),  // L148
  gb.text('contactEmpNm', 100, '담당자명'),  // L149
  gb.text('contactPos', 80, '직위'),  // L150
  gb.text('contactOrgNm', 150, '부서'),  // L151
  gb.text('majorIssues', 200, '주요 논의 사항'),  // L152
  gb.text('note', 200, '비고'),  // L153
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="cancel" onClick={hide}>취소</Button>

