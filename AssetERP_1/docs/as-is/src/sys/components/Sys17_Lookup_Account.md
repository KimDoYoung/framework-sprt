# Sys17_Lookup_Account

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `pay`
- 파일: `client/vi/sys/Sys17_Lookup_Account.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys17_CorpAccount.selectByCorpId` | Sys17_Lookup_Account:154 | [`Sys17_CorpAccount.java:25`](../../sys/services/Sys17_CorpAccount.md) | [`sys17_corp_account.selectByCorpId`](../../sys/sql/sys17_corp_account.md) |
| `sys.Sys17_CorpAccount.update` | Sys17_Lookup_Account:200 | [`Sys17_CorpAccount.java:33`](../../sys/services/Sys17_CorpAccount.md) | [`dbConfig.getEncrypts`](../../utils/sql/dbConfig.md), `UpdateDataModel(sys17_corp_account)` 동적 INSERT/UPDATE → [`sys17_corp_account.selectById`](../../sys/sql/sys17_corp_account.md) |

## 테이블

[`sys17_corp_account`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_sysdate`, `to_decrypts`, `to_encrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sys17_Lookup_Account (`client/vi/sys/Sys17_Lookup_Account.java`, 233줄)

- 툴바 `buttonBar`: {hlc}
- 입력·하위 화면: `bankCodeComboBox` ComboBoxField("BankCode")
- 그리드 `grid` (buildGrid(), 체크박스):
  - bankName 150 "기관명" Text 편집:bankCodeComboBox
  - accountNoDec 200 "계좌번호" Text 편집:TextField
  - accountName 150 "예금주명" Text 편집:TextField
  - mainAccountYn 70 "대표계좌" Boolean

#### 이벤트
[E1] retrieveButton[조회].Select (L88) → retrieve()
[E2] updateButton[저장].Select (L94) → update()
[E3] insertButton[계좌추가].Select (L100) → insert()
[E4] selectButton[선택].Select (L106) → select()
[E5] closeButton[닫기].Select (L112) → hide()
[E6] bankCodeComboBox[BankCode].Collapse (L125) → 인라인 L125-133 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L57-78 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L146-161 | E1,open | 서비스 sys.Sys17_CorpAccount.selectByCorpId(corpId), 건수 표시 | 업무 |
| public update() | L163-202 | E2 | 서비스 sys.Sys17_CorpAccount.update | 업무 |
| public insert() | L204-210 | E3 | 상태 처리 | 업무 |
| public select() | L212-227 | E4 | 상태 처리 | 업무 |
| private settings() | L80-118 | open | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L120-144 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L229-231 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('bankNm', 150, '기관명', { editor: 'select' }),  // L137 SQL 계산 컬럼(selectByCorpId: f_cdnm('BankCode', sys17_bank_cd, 0, f_…)
  gb.text('accountNoDec', 200, '계좌번호', { editor: 'text' }),  // L138 SQL 계산 컬럼(selectByCorpId: TO_DECRYPTS(sys17_account_no))
  gb.text('accountNm', 150, '예금주명', { editor: 'text' }),  // L139
  gb.boolean('mainAccountYn', 70, '대표계좌'),  // L140
];
```

#### 사용된 버튼들
1. <Button type="select" onClick={select}>선택</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>
3. <Button type="search" onClick={retrieve}>조회</Button>
4. <Button type="save" onClick={update}>저장</Button>
5. <Button type="addRow" onClick={insert}>계좌추가</Button>

