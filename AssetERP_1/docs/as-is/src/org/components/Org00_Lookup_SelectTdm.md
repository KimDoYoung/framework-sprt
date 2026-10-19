# Org00_Lookup_SelectTdm

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `tdm`
- 파일: `client/vi/org/Org00_Lookup_SelectTdm.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `org.Org00_OrgInfo.selectByTdmYn` | Org00_Lookup_SelectTdm:181 | [`Org00_OrgInfo.java:167`](../../org/services/Org00_OrgInfo.md) | [`org00_org_info.selectByTdmYn`](../../org/sql/org00_org_info.md) |

## 테이블

[`tdm23_role_relate_org`](../../../db/tables/tdm.md)

## DB 함수

`getorg`, `getsuborg`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Org00_Lookup_SelectTdm (`client/vi/org/Org00_Lookup_SelectTdm.java`, 219줄)

- 툴바 `searchBar`: 기준일: {stdDate} 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `stdDate` MyDateField, `searchText` TextField 빈칸="조직코드/조직명"
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - orgCode 80 "조직코드" TextCenter
  - korNameWithSubOrg 420 "조직명" Text

#### 이벤트
[E0] 화면 열림 (생성자 L54-59) → 초기화
[E1] searchText.KeyPress [Enter] (L116) → retrieve()
[E2] retrieveButton[조회].Select (L125) → retrieve()
[E3] oKButton[확인].Select (L131) → confirm()
[E4] allButton[전체].Select [callback != null] (L137) → hide()
[E5] cancelButton[닫기].Select (L146) → hide()
[E6] grid.CellDoubleClick (L153) → confirm()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public openAll() | L60-63 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L65-68 | openAll | 상태 처리 | 업무 |
| public open() | L70-73 | openAll | 상태 처리 | 업무 |
| public open() | L75-109 | openAll | 상태 처리 | 업무 |
| private setting() | L111-159 | open | 상태 처리 | 업무 |
| public retrieve() | L172-187 | E1,E2,open | 서비스 org.Org00_OrgInfo.selectByTdmYn(companyId, stdDate, searchText, roleId) | 업무 |
| public confirm() | L189-209 | E3,E6 | 미선택 시 alert "조직을 선택해주세요" | 업무 |
| private buildGrid() | L161-170 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L211-213 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L215-217 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('orgCd', 80, '조직코드'),  // L166
  gb.text('korNmWithSuborg', 420, '조직명'),  // L167
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="unknown" onClick={hide}>전체</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

