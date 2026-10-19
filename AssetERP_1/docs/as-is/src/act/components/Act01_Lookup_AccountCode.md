# Act01_Lookup_AccountCode

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `biz`, `emp`, `pay`
- 파일: `client/vi/act/Act01_Lookup_AccountCode.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `act.Act01_AccountCode.selectBySlipYn` | Act01_Lookup_AccountCode:210 | [`Act01_AccountCode.java:40`](../../act/services/Act01_AccountCode.md) | [`act01_account_code.selectBySlipYn`](../../act/sql/act01_account_code.md) |

## 테이블

[`act01_account_code`](../../../db/tables/act.md)

## DB 함수

`f_cdnm`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Act01_Lookup_AccountCode (`client/vi/act/Act01_Lookup_AccountCode.java`, 242줄)

- 툴바 `buttonBar`: 계정속성: {attributeComboBox} 계정코드/명: {searchText} {retrieveButton}
- 입력·하위 화면: `searchText` TextField, `attributeComboBox` ComboBoxField("AccountAttributeCode", "%", "전체", "전체")
- 그리드 `grid` (buildGrid(), 체크박스(다중), 체크박스):
  - attributeName 80 "속성" TextCenter
  - accountCode 100 "계정코드" TextCenter
  - accountName 500 "계정과목" TextArea

#### 이벤트
[E1] grid.CellDoubleClick (L104) → confirm()
[E2] attributeComboBox[AccountAttributeCode].Collapse (L127) → retrieve()
[E3] searchText.KeyPress [Enter] (L135) → retrieve()
[E4] retrieveButton[조회].Select (L144) → retrieve()
[E5] oKButton[확인].Select (L150) → confirm()
[E6] cancelButton[취소].Select (L156) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L53-56 | openCompanyId,openMulti | 상태 처리 | 업무 |
| public openCompanyId() | L58-61 | 공개 메서드 | 상태 처리 | 업무 |
| public openCompanyId() | L63-66 | 공개 메서드 | 상태 처리 | 업무 |
| public openMulti() | L68-71 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L73-111 | openCompanyId,openMulti | 상태 처리 | 업무 |
| public retrieve() | L181-216 | E2,E3,E4,settings | 서비스 act.Act01_AccountCode.selectBySlipYn(companyId, searchText, attributeCode), 건수 표시 | 업무 |
| public confirm() | L218-232 | E1,E5 | 미선택 시 alert "계정과목을 선택하세요" | 업무 |
| private settings() | L113-162 | open | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L164-179 | open | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L234-236 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L238-240 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('attributeNm', 80, '속성'),  // L174 SQL 계산 컬럼(selectBySlipYn: f_cdnm('AccountAttributeCode', act01_at…)
  gb.textCenter('accountCd', 100, '계정코드'),  // L175
  gb.textArea('accountNm', 500, '계정과목'),  // L176
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="cancel" onClick={hide}>취소</Button>

