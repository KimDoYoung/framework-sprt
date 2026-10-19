# Emp01_Rd_FinanceProState

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `rpt`
- 파일: `client/vi/emp/Emp01_Rd_FinanceProState.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Rpt10_Lookup_WriteGuide`](../../rpt/components/Rpt10_Lookup_WriteGuide.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `rpt.Rpt10_FssSubmit.selectByReportCode` | Emp01_Rd_FinanceProState:138 | [`Rpt10_FssSubmit.java:32`](../../rpt/services/Rpt10_FssSubmit.md) | [`rpt10_fss_submit.selectByReportCode`](../../rpt/sql/rpt10_fss_submit.md) |

## 테이블

[`rpt10_fss_submit`](../../../db/tables/rpt.md)

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Emp01_Rd_FinanceProState (`client/vi/emp/Emp01_Rd_FinanceProState.java`, 186줄)

- 툴바 `buttonBar`: 기준년월: {yyyyMM} {retrieveButton} {writeWayButton}
- 입력·하위 화면: `yyyyMM` TextField 빈칸="YYYY.MM", `lookup` Rpt10_Lookup_WriteGuide

#### 이벤트
[E0] 화면 열림 (생성자 L53-96) → 초기화
[E1] yyyyMM.KeyPress [Enter] (L60) → retrieve()
[E2] retrieveButton[조회].Select (L78) → retrieve()
[E3] writeWayButton[작성요령].Select (L85) → writeGuide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L99-131 | E1,E2 | 상태 처리 | 업무 |
| public rdClear() | L133-135 | 공개 메서드 | 상태 처리 | 업무 |
| private writeGuide() | L137-155 | E3 | 조회창 Rpt10_Lookup_WriteGuide 열기, 서비스 rpt.Rpt10_FssSubmit.selectByReportCode | 업무 |
| private getCloseDate() | L157-164 | retrieve | 서비스 yyyy.MM.dd | 업무 |
| public init() | L171-172 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L175-177 | E1,E2 | 상태 처리 | 업무 |
| public getGrid() | L180-183 | 공개 메서드 | 상태 처리 | 업무 |
| private setHtmlBarStyle() | L166-168 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="view" onClick={writeGuide}>작성요령</Button>

