# Adv02_Lookup_SelectSingle

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `fnd`
- 파일: `client/vi/adv/Adv02_Lookup_SelectSingle.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `adv.Adv02_Account.selectByOrgAuthPaging` | Adv02_Lookup_SelectSingle:73 | [`Adv02_Account.java:38`](../../adv/services/Adv02_Account.md) | [`adv02_account.selectByOrgAuthPaging`](../../adv/sql/adv02_account.md), [`adv02_account.selectByOrgAuthPagingTotal`](../../adv/sql/adv02_account.md) |

## 테이블

[`adv02_account`](../../../db/tables/adv.md), [`adv05_org_auth`](../../../db/tables/adv.md)

## DB 함수

`to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Adv02_Lookup_SelectSingle (`client/vi/adv/Adv02_Lookup_SelectSingle.java`, 192줄)

- 툴바 `buttonBar`: 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `searchText` TextField 빈칸="관리코드/계좌명"
- 그리드 `grid` (buildGrid(), 체크박스):
  - manageCode 100 "관리코드" TextCenter
  - manageName 150 "계좌명" Text
  - trCorpCode 100 "증권사코드" Text
  - trCorpName 100 "증권사명" Text
  - accountNoDec 150 "계좌번호" Text

#### 이벤트
[E1] searchText.KeyPress [Enter] (L93) → retrieve()
[E2] retrieveButton[조회].Select (L102) → retrieve()
[E3] oKButton[확인].Select (L108) → confirm()
[E4] cancelButton[취소].Select (L114) → hide()
[E5] grid.CellDoubleClick (L120) → confirm()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L53-89 | 공개 메서드 | 서비스 adv.Adv02_Account.selectByOrgAuthPaging | 업무 |
| public retrieve() | L140-158 | E1,E2,open | 상태 처리 | 업무 |
| public confirm() | L160-171 | E3,E5 | 미선택 시 alert "선택된 일임계좌가 없습니다" | 업무 |
| public getServiceResult() | L174-182 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L91-126 | open | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L128-138 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L184-186 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L188-190 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('manageCd', 100, '관리코드'),  // L131
  gb.text('manageNm', 150, '계좌명'),  // L132
  gb.text('trCorpCd', 100, '증권사코드'),  // L133
  gb.text('trCorpNm', 100, '증권사명'),  // L134
  gb.text('accountNoDec', 150, '계좌번호'),  // L135 SQL 계산 컬럼(selectByOrgAuthPaging: TO_DECRYPTS(adv02_account_no))
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="cancel" onClick={hide}>취소</Button>

