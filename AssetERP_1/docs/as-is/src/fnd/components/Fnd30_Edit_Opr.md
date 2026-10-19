# Fnd30_Edit_Opr

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `sch`
- 파일: `client/vi/fnd/Fnd30_Edit_Opr.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Sys15_Lookup_Corp`](../../sys/components/Sys15_Lookup_Corp.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `fnd.Fnd30_Opr.modelUpdate` | Fnd30_Edit_Opr:297 | [`Fnd30_Opr.java:146`](../../fnd/services/Fnd30_Opr.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`fnd31_opr_fund.demandSumQty`](../../fnd/sql/fnd31_opr_fund.md), [`fnd31_opr_fund.selectByOprId`](../../fnd/sql/fnd31_opr_fund.md), `UpdateDataModel(fnd31_opr_fund)` 동적 INSERT/UPDATE → [`fnd31_opr_fund.selectById`](../../fnd/sql/fnd31_opr_fund.md), `UpdateDataModel(fnd30_opr)` 동적 INSERT/UPDATE → [`fnd30_opr.selectById`](../../fnd/sql/fnd30_opr.md) |
| `fnd.Fnd30_Opr.multiUpdate` | Fnd30_Edit_Opr:297 | [`Fnd30_Opr.java:123`](../../fnd/services/Fnd30_Opr.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(fnd30_opr)` 동적 INSERT/UPDATE → [`fnd30_opr.selectById`](../../fnd/sql/fnd30_opr.md) |

## 테이블

[`adv02_account`](../../../db/tables/adv.md), [`fnd01_fund_code`](../../../db/tables/fnd.md), [`fnd02_fund_info`](../../../db/tables/fnd.md), [`fnd30_opr`](../../../db/tables/fnd.md), [`fnd31_opr_fund`](../../../db/tables/fnd.md)

## DB 함수

`f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Fnd30_Edit_Opr (`client/vi/fnd/Fnd30_Edit_Opr.java`, 335줄)

- 입력·하위 화면: `corpName` LookupTriggerField, `corpId` LongField, `subscriptionDate` MyDateField, `payDate` MyDateField, `itemName` TextField, `lockPeriod` TextField, `price` LongField, `feeRate` DoubleField, `qty` LongField, `note` MyTextArea, `insertCount` LongField, `lookupCorp` Sys15_Lookup_Corp

#### 이벤트
[E1] corpName[주간사].TriggerClick (L174) → openLookupOpr()
[E2] updateButton[저장].Select (L181) → update()
[E3] closeButton[닫기].Select (L187) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public insert() | L73-92 | 공개 메서드 | 상태 처리 | 업무 |
| public insert() | L94-111 | 공개 메서드 | 상태 처리 | 업무 |
| public demandOprInsert() | L113-137 | 공개 메서드 | 상태 처리 | 업무 |
| public edit() | L139-156 | 공개 메서드 | 상태 처리 | 업무 |
| private getEditor() | L195-250 | insert,demandOprInsert,edit | 상태 처리 | 업무 |
| private update() | L252-312 | E2 | 상태 처리 | 업무 |
| private openLookupOpr() | L314-326 | E1 | 조회창 Sys15_Lookup_Corp 열기 | 업무 |
| private settings() | L158-193 | insert,demandOprInsert,edit | 이벤트 연결, 초기값: insertCount=(long("등록건수") | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L328-330 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L332-334 | insert,demandOprInsert,edit | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

