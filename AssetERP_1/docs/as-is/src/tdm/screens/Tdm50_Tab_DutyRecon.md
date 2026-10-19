# Tdm50_Tab_DutyRecon

- 종류: 화면
- 메뉴: 책무 > 00. 대시보드 > 책무마감 검증 (#1497)
- 파일: `client/vi/tdm/Tdm50_Tab_DutyRecon.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys99_Print.insertReconTdm` | Tdm50_Tab_DutyRecon:96 | [`Sys99_Print.java:99`](../../sys/services/Sys99_Print.md) | [`sys99_print.insertReconTdm`](../../sys/sql/sys99_print.md) |
| `sys.Sys99_Print.selectByWindowClassName` | Tdm50_Tab_DutyRecon:117 | [`Sys99_Print.java:89`](../../sys/services/Sys99_Print.md) | [`sys99_print.selectByWindowClassName`](../../sys/sql/sys99_print.md) |

## 테이블

[`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_get_company_nm`, `f_recon_tdm`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Tdm50_Tab_DutyRecon (`client/vi/tdm/Tdm50_Tab_DutyRecon.java`, 133줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 기준년월: {quickMoveField} {retrieveButton}
- 입력·하위 화면: `quickMoveField` QuickMoveField
- 그리드 `grid` (buildGrid()):
  - string01 300 "점검항목" Text
  - string02 400 "점점결과" Text
  - string03 300 "참조" Text

#### 이벤트
[E0] 화면 열림 (생성자 L52-73) → settings()
[E1] retrieveButton[조회].Select (L76) → createData()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public execute() | L38-40 | retrieve | 상태 처리 | 업무 |
| public execute() | L44-46 | retrieve | 상태 처리 | 업무 |
| private createData() | L93-109 | E1,execute | 서비스 sys.Sys99_Print.insertReconTdm(windowClassName, baseDate, companyId, groupId) | 업무 |
| private retrieve() | L111-123 | createData | 서비스 sys.Sys99_Print.selectByWindowClassName(windowClassName, baseDate, companyId, groupId) | 업무 |
| private settings() | L75-82 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L84-91 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L125-127 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| public setHtmlGridStyle() | L129-132 | 공개 메서드 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('string01', 300, '점검항목'),  // L86
  gb.text('string02', 400, '점점결과'),  // L87
  gb.text('string03', 300, '참조'),  // L88
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={createData}>조회</Button>

