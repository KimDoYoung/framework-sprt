# Tdm50_Tab_DutyReconAdmin

- 종류: 화면
- 메뉴: 기초자료 > 10. 책무 > 책무마감 검증 (#1512)
- 파일: `client/vi/tdm/Tdm50_Tab_DutyReconAdmin.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Sys01_Lookup_SelectSingle`](../../sys/components/Sys01_Lookup_SelectSingle.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys99_Print.insertReconTdm` | Tdm50_Tab_DutyReconAdmin:134 | [`Sys99_Print.java:99`](../../sys/services/Sys99_Print.md) | [`sys99_print.insertReconTdm`](../../sys/sql/sys99_print.md) |
| `sys.Sys99_Print.selectByWindowClassName` | Tdm50_Tab_DutyReconAdmin:156 | [`Sys99_Print.java:89`](../../sys/services/Sys99_Print.md) | [`sys99_print.selectByWindowClassName`](../../sys/sql/sys99_print.md) |

## 테이블

[`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_get_company_nm`, `f_recon_tdm`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Tdm50_Tab_DutyReconAdmin (`client/vi/tdm/Tdm50_Tab_DutyReconAdmin.java`, 172줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 기준년월: {quickMoveField} 고객사: {companyName} {retrieveButton}
- 입력·하위 화면: `quickMoveField` QuickMoveField, `companyName` LookupTriggerField, `lookup` Sys01_Lookup_SelectSingle
- 그리드 `grid` (buildGrid()):
  - companyName 200 "회사명" Text
  - string01 300 "점검항목" Text
  - string02 400 "점점결과" Text
  - string03 300 "참조" Text

#### 이벤트
[E0] 화면 열림 (생성자 L61-84) → settings()
[E1] retrieveButton[조회].Select (L87) → createData()
[E2] companyName.TriggerClick [result != null] (L101) → execute(), createData()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public execute() | L44-46 | E2,retrieve | 상태 처리 | 업무 |
| public execute() | L50-52 | E2,retrieve | 상태 처리 | 업무 |
| private createData() | L131-148 | E1,E2,execute | 서비스 sys.Sys99_Print.insertReconTdm(windowClassName, baseDate, companyId, groupId) | 업무 |
| private retrieve() | L150-162 | createData | 서비스 sys.Sys99_Print.selectByWindowClassName(windowClassName, baseDate, companyId, groupId) | 업무 |
| private settings() | L86-119 | 생성자 | 조회창 Sys01_Lookup_SelectSingle 열기, 이벤트 연결, 초기값: companyName="선택해주세요" | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L121-129 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L164-166 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| public setHtmlGridStyle() | L168-171 | 공개 메서드 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('companyNm', 200, '회사명'),  // L123 SQL 계산 컬럼(selectByWindowClassName: CASE WHEN sys99_company_id = 0 THEN '-'…)
  gb.text('string01', 300, '점검항목'),  // L124
  gb.text('string02', 400, '점점결과'),  // L125
  gb.text('string03', 300, '참조'),  // L126
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={createData}>조회</Button>

