# Org00_Lookup_SelectMulti

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `adv`, `ast`, `bbs`, `crm`, `dcr`, `emp`, `fnd`, `ics`, `mkt`, `sch`, `tdm`
- 파일: `client/vi/org/Org00_Lookup_SelectMulti.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `org.Org00_OrgInfo.selectByKorName` | Org00_Lookup_SelectMulti:171 | [`Org00_OrgInfo.java:53`](../../org/services/Org00_OrgInfo.md) | [`org00_org_info.selectByKorName`](../../org/sql/org00_org_info.md) |

## 테이블

[`org00_org_info`](../../../db/views.md)

## DB 함수

`f_cdnm`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Org00_Lookup_SelectMulti (`client/vi/org/Org00_Lookup_SelectMulti.java`, 215줄)

- 툴바 `searchBar`: 기준일: {baseDateField} 조직명: {korName} {retrieveButton}
- 입력·하위 화면: `korName` TextField, `baseDateField` MyDateField
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - orgCode 80 "조직코드" TextCenter
  - parentFullName 270 "본부(실)명" Text
  - korName 350 "본부(실)명" Text

#### 이벤트
[E1] korName.KeyPress [Enter] (L84) → retrieve()
[E2] retrieveButton[조회].Select (L93) → retrieve()
[E3] oKButton[확인].Select (L100) → confirm()
[E4] allButton[전체].Select [callback != null] (L106) → hide()
[E5] cancelButton[닫기].Select (L115) → hide()
[E6] grid.CellDoubleClick (L143) → confirm()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L55-58 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L60-64 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L66-151 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L165-177 | E1,E2,open | 서비스 org.Org00_OrgInfo.selectByKorName(companyId, korName, baseDate) | 업무 |
| public confirm() | L179-194 | E3,E6 | 미선택 시 alert "하나의 조직만 선택하세요" | 업무 |
| public getServiceResult() | L197-205 | 공개 메서드 | 상태 처리 | 업무 |
| private buildGrid() | L153-163 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L207-209 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L211-213 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('orgCd', 80, '조직코드'),  // L158
  gb.text('parentFullNm', 270, '본부(실)명'),  // L159
  gb.text('korNm', 350, '본부(실)명'),  // L160
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="unknown" onClick={hide}>전체</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

