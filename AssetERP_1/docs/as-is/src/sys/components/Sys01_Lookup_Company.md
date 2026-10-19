# Sys01_Lookup_Company

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `act`, `ast`, `bbs`, `biz`, `dcr`, `emp`, `flt`, `icam`, `pay`, `tdm`
- 파일: `client/vi/sys/Sys01_Lookup_Company.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys01_Company.selectCompany` | Sys01_Lookup_Company:159 | [`Sys01_Company.java:58`](../../sys/services/Sys01_Company.md) | [`sys01_company.selectCompany`](../../sys/sql/sys01_company.md) |

## 테이블

[`sys01_company`](../../../db/tables/sys.md)

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sys01_Lookup_Company (`client/vi/sys/Sys01_Lookup_Company.java`, 205줄)

- 툴바 `searchBar`: {searchField} {retrieveButton}
- 입력·하위 화면: `korName` TextField
- 그리드 `grid` (buildGrid(), 체크박스(다중), 체크박스):
  - companyName 200 "고객명" Text
  - locationName 100 "고객코드" Text
  - icamCompanyCode 80 "ICAM" TextCenter

#### 이벤트
[E1] korName[고객명].KeyPress [Enter] (L91) → retrieve()
[E2] retrieveButton[조회].Select (L99) → retrieve()
[E3] grid.CellDoubleClick (L105) → confirm()
[E4] oKButton[확인].Select (L112) → confirm()
[E5] selectNotButton[선택안함].Select (L124) → confirmAll()
[E6] cancelButton[취소].Select (L130) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L50-53 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L55-84 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L155-164 | E1,E2,open | 서비스 sys.Sys01_Company.selectCompany(companyName, useYn) | 업무 |
| public confirm() | L166-183 | E3,E4 | 미선택 시 alert "고객사를 선택하세요" | 업무 |
| public confirmAll() | L185-188 | E5 | 상태 처리 | 업무 |
| public getServiceResult() | L191-199 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L86-136 | open | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L138-153 | settings | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L201-203 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('companyNm', 200, '고객명'),  // L148
  gb.text('locNm', 100, '고객코드'),  // L149
  gb.textCenter('icamCompanyCd', 80, 'ICAM'),  // L150
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="unknown" onClick={confirmAll}>선택안함</Button>
4. <Button type="cancel" onClick={hide}>취소</Button>

