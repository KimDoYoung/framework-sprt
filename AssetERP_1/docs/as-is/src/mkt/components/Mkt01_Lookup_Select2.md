# Mkt01_Lookup_Select2

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `biz`
- 파일: `client/vi/mkt/Mkt01_Lookup_Select2.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `mkt.Mkt01_TargetCompany.selectManagerPaging` | Mkt01_Lookup_Select2:79 | [`Mkt01_TargetCompany.java:46`](../../mkt/services/Mkt01_TargetCompany.md) | [`mkt01_target_company.selectManagerPaging`](../../mkt/sql/mkt01_target_company.md), [`mkt01_target_company.selectManagerTotal`](../../mkt/sql/mkt01_target_company.md) |
| `mkt.Mkt01_TargetCompany.selectTargetCompanyPaging` | Mkt01_Lookup_Select2:77 | [`Mkt01_TargetCompany.java:40`](../../mkt/services/Mkt01_TargetCompany.md) | [`mkt01_target_company.selectTargetCompanyPaging`](../../mkt/sql/mkt01_target_company.md), [`mkt01_target_company.selectTargetCompanyTotal`](../../mkt/sql/mkt01_target_company.md) |

## 테이블

[`mkt01_target_company`](../../../db/tables/mkt.md), [`mkt02_manager`](../../../db/tables/mkt.md), [`mkt06_favorite`](../../../db/tables/mkt.md)

## DB 함수

`f_cdnm`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Mkt01_Lookup_Select2 (`client/vi/mkt/Mkt01_Lookup_Select2.java`, 223줄)

- 툴바 `buttonBar`: 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `searchText` TextField
- 그리드 `grid` (buildGrid(), 체크박스):
  - targetCompanyName 250 "회사명" Text
  - managerName 100 "담당자" Text
  - managerOrgName 150 "부서" Text

#### 이벤트
[E0] 화면 열림 (생성자 L51-57) → 초기화
[E1] searchText.KeyPress [Enter] (L119) → retrieve()
[E2] grid.RowDoubleClick (L128) → confirm()
[E3] retrieveButton[조회].Select (L135) → retrieve()
[E4] oKButton[확인].Select (L141) → confirm()
[E5] allButton[전체].Select [callback != null] (L147) → hide()
[E6] cancelButton[취소].Select (L156) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L59-104 | 공개 메서드 | 서비스 mkt.Mkt01_TargetCompany.selectTargetCompanyPaging, mkt.Mkt01_TargetCompany.selectManagerPaging | 업무 |
| private setting() | L106-162 | open | 상태 처리 | 업무 |
| public retrieve() | L176-199 | E1,E3,open | 상태 처리 | 업무 |
| public confirm() | L201-213 | E2,E4 | 미선택 시 alert "선택된 내역이 없습니다" | 업무 |
| private buildGrid() | L164-174 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L215-217 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L219-221 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('targetCompanyNm', 250, '회사명'),  // L169
  gb.text('managerNm', 100, '담당자'),  // L170
  gb.text('managerOrgNm', 150, '부서'),  // L171
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="unknown" onClick={hide}>전체</Button>
4. <Button type="cancel" onClick={hide}>취소</Button>

