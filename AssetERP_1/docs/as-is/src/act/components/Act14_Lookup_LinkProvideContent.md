# Act14_Lookup_LinkProvideContent

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `biz`
- 파일: `client/vi/act/Act14_Lookup_LinkProvideContent.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Act01_Lookup_AccountCode`](../../act/components/Act01_Lookup_AccountCode.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `act.Act14_Link.delete` | Act14_Lookup_LinkProvideContent:339 | [`Act14_Link.java:66`](../../act/services/Act14_Link.md) | `UpdateDataModel(act14_link)` 동적 DELETE |
| `act.Act14_Link.modelUpdate` | Act14_Lookup_LinkProvideContent:312 | [`Act14_Link.java:41`](../../act/services/Act14_Link.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(act14_link)` 동적 INSERT/UPDATE → [`act14_link.selectById`](../../act/sql/act14_link.md) |
| `act.Act14_Link.selectByProvideContentCode` | Act14_Lookup_LinkProvideContent:247 | [`Act14_Link.java:30`](../../act/services/Act14_Link.md) | [`act14_link.selectByProvideContentCode`](../../act/sql/act14_link.md) |
| `act.Act14_Link.updateList` | Act14_Lookup_LinkProvideContent:293 | [`Act14_Link.java:54`](../../act/services/Act14_Link.md) | `UpdateDataModel(act14_link)` 동적 INSERT/UPDATE → [`act14_link.selectById`](../../act/sql/act14_link.md) |
| `sys.Sys00_Common.selectByKindGroupCode` | Act14_Lookup_LinkProvideContent:59 | [`Sys00_Common.java:106`](../../sys/services/Sys00_Common.md) | [`sys09_code.selectByKindGroupCode`](../../sys/sql/sys09_code.md) |
| `sys.Sys09_Code.selectByKindCode` | Act14_Lookup_LinkProvideContent:60 | [`Sys09_Code.java:128`](../../sys/services/Sys09_Code.md) | [`sys09_code.selectByKindCode`](../../sys/sql/sys09_code.md) |

## 테이블

[`act14_link`](../../../db/tables/act.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md)

## DB 함수

`f_get_account_nm`, `f_today`, `f_trunc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Act14_Lookup_LinkProvideContent (`client/vi/act/Act14_Lookup_LinkProvideContent.java`, 359줄)

- 툴바 `buttonBar`: 제공목적: {providePurName} 제공내역: {provideContentName} {retrieveButton} {insertButton} {deleteButton}
- 입력·하위 화면: `providePurName` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode") 빈칸="선택", `provideContentName` CommonComboBoxField("sys.Sys09_Code.selectByKindCode") 빈칸="선택", `lookupAccount` Act01_Lookup_AccountCode
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - accountCode 130 "계정과목코드" Text
  - accountName 530 "계정과목명" TextArea
  - actionCell 30 "" CellNotSort 편집:upButton
  - actionCell 30 "" CellNotSort 편집:downButton

#### 이벤트
[E1] providePurName[sys.Sys00_Common.selectByKindGroupCode].Collapse [preValue == null] (L110) → 서비스 sys.Sys09_Code.selectByKindCode
[E2] provideContentName[sys.Sys09_Code.selectByKindCode].Collapse [preValue == null] (L137) → retrieve()
[E3] retrieveButton[조회].Select (L158) → retrieve()
[E4] insertButton[등록].Select (L165) → insertAccount()
[E5] deleteButton[삭제].Select (L188) → deleteRow()
       └ [E7] msgBox.DialogHide [YES] (L332) → 서비스 act.Act14_Link.delete
[E6] closeButton[닫기].Select (L195) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L69-100 | 공개 메서드 | 상태 처리 | 업무 |
| private setting() | L102-201 | open | 조회창 Act01_Lookup_AccountCode 열기, 서비스 sys.Sys09_Code.selectByKindCode | 업무 |
| public retrieve() | L229-253 | E2,E3,insertAccount | 서비스 act.Act14_Link.selectByProvideContentCode(companyId, provideContentCode) | 업무 |
| public changeRow() | L255-274 | buildGrid | 상태 처리 | 업무 |
| public getSeq() | L276-303 | changeRow | 서비스 act.Act14_Link.updateList(updateList) | 업무 |
| public insertAccount() | L305-322 | E4 | 서비스 act.Act14_Link.modelUpdate(updateModel) | 업무 |
| private deleteRow() | L324-350 | E5 | ConfirmBox → E7 | 업무 |
| public buildGrid() | L203-227 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L352-354 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L356-358 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('accountCd', 130, '계정과목코드'),  // L221
  gb.textArea('accountNm', 530, '계정과목명'),  // L222 SQL 계산 컬럼(selectByProvideContentCode: f_get_account_nm(act14_company_id, act1…)
  // ⚠ 대응 없음 (GridBuilder L223) addCellNotSort
  // ⚠ 대응 없음 (GridBuilder L224) addCellNotSort
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertAccount}>등록</Button>
3. <Button type="delete" onClick={deleteRow}>삭제</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

