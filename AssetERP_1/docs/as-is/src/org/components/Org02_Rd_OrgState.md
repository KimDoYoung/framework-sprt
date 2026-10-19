# Org02_Rd_OrgState

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `rpt`
- 파일: `client/vi/org/Org02_Rd_OrgState.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Rpt10_Lookup_WriteGuide`](../../rpt/components/Rpt10_Lookup_WriteGuide.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `rpt.Rpt10_FssSubmit.selectByReportCode` | Org02_Rd_OrgState:137 | [`Rpt10_FssSubmit.java:32`](../../rpt/services/Rpt10_FssSubmit.md) | [`rpt10_fss_submit.selectByReportCode`](../../rpt/sql/rpt10_fss_submit.md) |
| `sys.Sys99_Print.insertRdOrgState` | Org02_Rd_OrgState:183 | [`Sys99_Print.java:2591`](../../sys/services/Sys99_Print.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`org01_code.selectByRdBaseDate`](../../org/sql/org01_code.md), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |

## 테이블

[`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`rpt10_fss_submit`](../../../db/tables/rpt.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md), [`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_today`, `f_trunc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Org02_Rd_OrgState (`client/vi/org/Org02_Rd_OrgState.java`, 210줄)

- 툴바 `buttonBar`: 기준년월: {yyyyMM} {retrieveButton} {writeWayButton}
- 입력·하위 화면: `yyyyMM` TextField 빈칸="YYYY.MM", `lookup` Rpt10_Lookup_WriteGuide

#### 이벤트
[E0] 화면 열림 (생성자 L54-95) → 초기화
[E1] yyyyMM.KeyPress [Enter] (L61) → retrieve()
[E2] retrieveButton[조회].Select (L79) → retrieve()
[E3] writeWayButton[작성요령].Select (L86) → writeGuide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public rdRetrieve() | L98-130 | retrieve | 상태 처리 | 업무 |
| public rdClear() | L132-134 | 공개 메서드 | 상태 처리 | 업무 |
| private writeGuide() | L136-154 | E3 | 조회창 Rpt10_Lookup_WriteGuide 열기, 서비스 rpt.Rpt10_FssSubmit.selectByReportCode | 업무 |
| private getCloseDate1() | L156-162 | retrieve | 서비스 yyyy.MM.dd | 업무 |
| private getCloseDate() | L164-171 | rdRetrieve | 서비스 yyyy.MM.dd | 업무 |
| public init() | L178-179 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L182-201 | E1,E2 | 서비스 sys.Sys99_Print.insertRdOrgState(companyId, personId, windowClassName, baseDate) | 업무 |
| public getGrid() | L204-207 | 공개 메서드 | 상태 처리 | 업무 |
| private setHtmlBarStyle() | L173-175 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="view" onClick={writeGuide}>작성요령</Button>

