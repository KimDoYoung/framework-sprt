# Sys01_Lookup_SelectSingle

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `tdm`
- 파일: `client/vi/sys/Sys01_Lookup_SelectSingle.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys01_Company.selectCompany` | Sys01_Lookup_SelectSingle:124 | [`Sys01_Company.java:58`](../../sys/services/Sys01_Company.md) | [`sys01_company.selectCompany`](../../sys/sql/sys01_company.md) |

## 테이블

[`sys01_company`](../../../db/tables/sys.md)

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sys01_Lookup_SelectSingle (`client/vi/sys/Sys01_Lookup_SelectSingle.java`, 163줄)

- 툴바 `buttonBar`: 고객명: {korName} {retrieveButton}
- 입력·하위 화면: `korName` TextField
- 그리드 `grid` (buildGrid(), 체크박스):
  - locationName 100 "고객코드" Text
  - companyName 200 "고객명" Text
  - erpProductCode 80 "상품구분" TextCenter

#### 이벤트
[E1] korName.KeyPress [Enter] (L74) → retrieve()
[E2] grid.RowDoubleClick (L82) → confirm()
[E3] retrieveButton[조회].Select (L88) → retrieve()
[E4] oKButton[확인].Select (L94) → confirm()
[E5] cancelButton[취소].Select (L100) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L45-70 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L120-130 | E1,E3,open | 서비스 sys.Sys01_Company.selectCompany(companyName, useYn) | 업무 |
| public confirm() | L132-143 | E2,E4 | 미선택 시 alert "선택된 고객이 없습니다" | 업무 |
| public getServiceResult() | L146-154 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L72-107 | open | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L109-118 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L156-158 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L160-162 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('locNm', 100, '고객코드'),  // L113
  gb.text('companyNm', 200, '고객명'),  // L114
  gb.textCenter('erpProductCd', 80, '상품구분'),  // L115
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="cancel" onClick={hide}>취소</Button>

