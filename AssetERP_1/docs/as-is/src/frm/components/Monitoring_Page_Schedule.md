# Monitoring_Page_Schedule

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `msc`
- 파일: `client/vi/frm/Monitoring_Page_Schedule.java`
- 함께 쓰는 클래스 1개:
  - `Monitoring_Page_DetailSchedule` `client/vi/frm/Monitoring_Page_DetailSchedule.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `msc.Msc01_Schedule.selectByDate` | Monitoring_Page_Schedule:156 | [`Msc01_Schedule.java:32`](../../msc/services/Msc01_Schedule.md) | [`msc01_schedule.selectByDate`](../../msc/sql/msc01_schedule.md) |

## 테이블

[`msc01_schedule`](../../../db/tables/msc.md), [`org00_org_info`](../../../db/views.md)

## DB 함수

`f_cdnm`, `f_org_nm`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Monitoring_Page_Schedule (`client/vi/frm/Monitoring_Page_Schedule.java`, 191줄)

- 툴바 `buttonBar`: {labelItem} {company} {sector} {central} {team}
- 입력·하위 화면: `editBoard` Monitoring_Page_DetailSchedule, `company` Radio, `sector` Radio, `central` Radio, `team` Radio, `levelCode` TextField
- 그리드 `grid` (buildGrid(), 행번호숨김):
  - orgLevelName 60 "구분" Text
  - orgCodeName 110 "조직명" Text
  - place 150 "장소" Text
  - content 240 "내용" Text

#### 이벤트
[E0] 화면 열림 (생성자 L54-110) → retrieve()
[E1] grid.SelectionChanged [선택>0] (L62) → retrieveEditPage()
[E2] toggleGroup.ValueChange (L80) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L124-128 | 생성자,E2 | 상태 처리 | 업무 |
| public retrieve() | L131-158 | 생성자,E2 | 서비스 msc.Msc01_Schedule.selectByDate(companyId, orgCodeId, orgCodeLevel, levelCode, scheduleDt, scheduleDt, scheduleDt) | 업무 |
| private retrieveEditPage() | L160-171 | E1 | 상태 처리 | 업무 |
| public update() | L174-176 | 공개 메서드 | 상태 처리 | 업무 |
| public insertRow() | L179-181 | 공개 메서드 | 상태 처리 | 업무 |
| public deleteRow() | L184-186 | 공개 메서드 | 상태 처리 | 업무 |
| private buildGrid() | L112-122 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlMonitoringStyle() | L188-190 | 필드 초기화 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('orgLevelNm', 60, '구분'),  // L115 SQL 계산 컬럼(selectByCompanyId: f_cdnm('OrgLevelCode', msc01_level_cd, …)
  gb.text('orgCodeNm', 110, '조직명'),  // L116 SQL 계산 컬럼(selectByOrgCodeId: a.org00_kor_nm)
  gb.text('place', 150, '장소'),  // L117
  gb.text('content', 240, '내용'),  // L118
];
```

#### 사용된 버튼들
버튼 사용하지 않음

### Monitoring_Page_DetailSchedule (`client/vi/frm/Monitoring_Page_DetailSchedule.java`, 121줄)

- 입력·하위 화면: `place` TextField, `attendance` TextField, `content` TextArea, `note` TextArea, `startHour` ComboBoxField("HourCode"), `startMin` ComboBoxField("MinuteCode"), `closeHour` ComboBoxField("HourCode"), `closeMin` ComboBoxField("MinuteCode")

#### 이벤트
[E0] 화면 열림 (생성자 L46-60) → getEditor(), show()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private getEditor() | L62-99 | 생성자 | 상태 처리 | 업무 |
| public retrieve() | L101-110 | 공개 메서드 | 상태 처리 | 업무 |
| public init() | L112-114 | 공개 메서드 | 상태 처리 | 업무 |
| public getServiceResult() | L117-119 | 공개 메서드 | 상태 처리 | 업무 |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
버튼 사용하지 않음

