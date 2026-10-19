# Cmp10_Lookup_MailBookList

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `dcr`
- 파일: `client/vi/cmp/Cmp10_Lookup_MailBookList.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `cmp.Cmp10_MailBook.selectByText` | Cmp10_Lookup_MailBookList:125 | [`Cmp10_MailBook.java:54`](../../cmp/services/Cmp10_MailBook.md) | [`cmp10_mail_book.selectByText`](../../cmp/sql/cmp10_mail_book.md) |

## 테이블

[`cmp10_mail_book`](../../../db/tables/cmp.md), [`cmp11_mail_role`](../../../db/tables/cmp.md)

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Cmp10_Lookup_MailBookList (`client/vi/cmp/Cmp10_Lookup_MailBookList.java`, 165줄)

- 툴바 `buttonBar`: 검색: {searhTextField} {retrieveButton}
- 입력·하위 화면: `searhTextField` TextField
- 그리드 `grid` (buildGrid(), 체크박스):
  - emailAddr 220 "이메일" Text
  - note 340 "비고" Text

#### 이벤트
[E1] searhTextField.KeyPress [Enter] (L76) → retrieve()
[E2] retrieveButton[조회].Select (L84) → retrieve()
[E3] confirmButton[확인].Select (L90) → confirm()
[E4] cancelButton[취소].Select (L96) → hide()
[E5] grid.CellDoubleClick (L102) → confirm()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L45-72 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L120-131 | E1,E2,open | 서비스 cmp.Cmp10_MailBook.selectByText(personId, searchText) | 업무 |
| public confirm() | L133-144 | E3,E5 | 미선택 시 alert "공용메일을 선택해주세요" | 업무 |
| public getServiceResult() | L147-155 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L74-108 | open | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L110-118 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L157-159 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L161-163 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('emailAddr', 220, '이메일'),  // L114
  gb.text('note', 340, '비고'),  // L115
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="cancel" onClick={hide}>취소</Button>

