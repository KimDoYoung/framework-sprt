# Act04_Tab_ReportFSS

- 종류: 화면
- 메뉴: 관리회계 > 22. 재무제표 > 금감원보고용 재무제표 (#1225)
- 파일: `client/vi/act/Act04_Tab_ReportFSS.java`
- 함께 쓰는 클래스 1개:
  - `Act04_Rd_ReportFSS` `client/vi/act/Act04_Rd_ReportFSS.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys99_Print.insertRdReportFSS` | Act04_Tab_ReportFSS:99 | [`Sys99_Print.java:1763`](../../sys/services/Sys99_Print.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |

## 테이블

[`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Act04_Tab_ReportFSS (`client/vi/act/Act04_Tab_ReportFSS.java`, 133줄)

- 레이아웃: north=buttonBar, center=rdForm
- 툴바 `buttonBar`: 기준년월: {yyyyMM} 구분: {codeComboBox} {retrieveButton}
- 입력·하위 화면: `yyyyMM` TextField 빈칸="YYYY.MM", `codeComboBox` ComboBoxField("FssGACode", "재무상태표(GA023)")

#### 이벤트
[E0] 화면 열림 (생성자 L39-95) → retrieve()
[E1] yyyyMM.KeyPress [Enter] (L47) → retrieve()
[E2] retrieveButton[조회].Select (L77) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L97-120 | 생성자,E1,E2 | 서비스 sys.Sys99_Print.insertRdReportFSS(companyId, personId, windowClassName, stdDate, code) | 업무 |
| private getCloseDate() | L122-128 | retrieve | 서비스 yyyy.MM.dd | 업무 |
| private setHtmlBarStyle() | L130-132 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

### Act04_Rd_ReportFSS (`client/vi/act/Act04_Rd_ReportFSS.java`, 54줄)


#### 이벤트
[E0] 화면 열림 (생성자 L24-26) → 초기화

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L29-31 | 공개 메서드 | 상태 처리 | 업무 |
| private setRd() | L34-51 | retrieve | 상태 처리 | 업무 |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
버튼 사용하지 않음

