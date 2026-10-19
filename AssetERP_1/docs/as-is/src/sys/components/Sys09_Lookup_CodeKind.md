# Sys09_Lookup_CodeKind

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `tdm`
- 파일: `client/vi/sys/Sys09_Lookup_CodeKind.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys08_CodeKind.selectByKindCode` | Sys09_Lookup_CodeKind:70 | [`Sys08_CodeKind.java:55`](../../sys/services/Sys08_CodeKind.md) | [`sys08_code_kind.selectByKindCode`](../../sys/sql/sys08_code_kind.md) |
| `sys.Sys09_Code.selectByCodeKindId` | Sys09_Lookup_CodeKind:179 | [`Sys09_Code.java:32`](../../sys/services/Sys09_Code.md) | [`sys09_code.selectByCodeKindId`](../../sys/sql/sys09_code.md) |

## 테이블

[`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`tdm11_task_relate_rule`](../../../db/tables/tdm.md)

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sys09_Lookup_CodeKind (`client/vi/sys/Sys09_Lookup_CodeKind.java`, 206줄)

- 툴바 `buttonBar`: 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `searchText` TextField
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - code 100 "코드" TextCenter
  - name 200 "코드명" Text

#### 이벤트
[E1] searchText.KeyPress [Enter] (L127) → retrieve()
[E2] retrieveButton[조회].Select (L136) → retrieve()
[E3] confirmButton[확인].Select (L143) → confirm()
[E4] cancelButton[닫기].Select (L149) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L56-59 | tdmLawOpen | 상태 처리 | 업무 |
| public tdmLawOpen() | L61-65 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L67-81 | tdmLawOpen | 서비스 sys.Sys08_CodeKind.selectByKindCode(kindCode) | 업무 |
| public open() | L83-124 | tdmLawOpen | 상태 처리 | 업무 |
| private setting() | L126-155 | open | 상태 처리 | 업무 |
| private retrieve() | L169-185 | E1,E2,open | 서비스 sys.Sys09_Code.selectByCodeKindId(codeKindId, companyId, searchText, taskId) | 업무 |
| private confirm() | L187-197 | E3 | 상태 처리 | 업무 |
| private buildGrid() | L157-167 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L199-201 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L202-204 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('code', 100, '코드'),  // L163
  gb.text('name', 200, '코드명'),  // L164
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

