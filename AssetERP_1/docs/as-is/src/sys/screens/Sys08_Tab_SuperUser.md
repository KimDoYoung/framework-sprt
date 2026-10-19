# Sys08_Tab_SuperUser

- 종류: 화면
- 파일: `client/vi/sys/Sys08_Tab_SuperUser.java`
- 함께 쓰는 클래스 2개:
  - `Sys09_Grid_SuperUser` `client/vi/sys/Sys09_Grid_SuperUser.java`
  - `Sys09_Grid_CodeList` `client/vi/sys/Sys09_Grid_CodeList.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Sys01_Lookup_Company`](../../sys/components/Sys01_Lookup_Company.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys08_CodeKind.selectByAll` | Sys08_Tab_SuperUser:292 | [`Sys08_CodeKind.java:50`](../../sys/services/Sys08_CodeKind.md) | [`sys08_code_kind.selectByAll`](../../sys/sql/sys08_code_kind.md) |
| `sys.Sys09_Code.delete` | Sys09_Grid_SuperUser:136 | [`Sys09_Code.java:391`](../../sys/services/Sys09_Code.md) | `UpdateDataModel(sys09_code)` 동적 DELETE |
| `sys.Sys09_Code.insert` | Sys08_Tab_SuperUser:230, Sys08_Tab_SuperUser:259 | [`Sys09_Code.java:141`](../../sys/services/Sys09_Code.md) | [`sys09_code.delete`](../../sys/sql/sys09_code.md), [`sys09_code.insert`](../../sys/sql/sys09_code.md), [`sys09_code.selectByCompanyId`](../../sys/sql/sys09_code.md) |
| `sys.Sys09_Code.selectByAll` | Sys09_Grid_CodeList:63 | [`Sys09_Code.java:27`](../../sys/services/Sys09_Code.md) | [`sys09_code.selectByAll`](../../sys/sql/sys09_code.md) |
| `sys.Sys09_Code.selectByCodeKindId` | Sys09_Grid_SuperUser:123 | [`Sys09_Code.java:32`](../../sys/services/Sys09_Code.md) | [`sys09_code.selectByCodeKindId`](../../sys/sql/sys09_code.md) |
| `sys.Sys09_Code.selectByCompanyId` | Sys08_Tab_SuperUser:214 | [`Sys09_Code.java:42`](../../sys/services/Sys09_Code.md) | [`sys09_code.selectByCompanyId`](../../sys/sql/sys09_code.md) |
| `sys.Sys09_Code.update` | Sys09_Grid_SuperUser:129 | [`Sys09_Code.java:386`](../../sys/services/Sys09_Code.md) | `UpdateDataModel(sys09_code)` 동적 INSERT/UPDATE → [`sys09_code.selectById`](../../sys/sql/sys09_code.md) |

## 테이블

[`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`tdm11_task_relate_rule`](../../../db/tables/tdm.md)

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sys08_Tab_SuperUser (`client/vi/sys/Sys08_Tab_SuperUser.java`, 306줄)

- 레이아웃: center=vlc, south=hlc02
- 입력·하위 화면: `companyField` LookupTriggerField 빈칸="회사를 선택해주세요.", `targetCompanyField` LookupTriggerField 빈칸="회사를 선택해주세요.", `lookupCompany` Sys01_Lookup_Company
- 그리드 `grid` (buildGrid()):
  - kindCode 150 "*코드구분" Text
  - kindName 150 "*코드구분명" Text
  - sysYnFlag 60 "시스템" Boolean
  - note 475 "상세설명" Text
  - makeCodeId 70 "생성ID" Text 편집:TextField
  - increase 40 "증가" Text 편집:TextField
  - date 100 "시작일자" Date 편집:MyDateField
  - note 60 "실행" Cell 편집:actionCell

#### 이벤트
[E0] 화면 열림 (생성자 L60-131) → retrieve()
[E1] companyField[선택회사].TriggerClick (L70) → findComapanyName()
[E2] targetCompanyField[대상회사].TriggerClick (L83) → findTargetComapanyName()
[E3] searchBarBuilder[조회].Retrieve (L90) → retrieve()
[E4] grid.SelectionChanged (L121) → 인라인 L121-128 (new SelectionChangedHandler<Sys08_Cod…)
[E5] msgBox.DialogHide [YES] (L225) → 서비스 sys.Sys09_Code.insert(codeKindId, makeCodeId, increase, companyId, targetCompanyId, date), 메시지 "오류 / 동일한 KeyId가 있습니다"

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private findComapanyName() | L163-179 | E1 | 조회창 Sys01_Lookup_Company 열기 | 업무 |
| private findTargetComapanyName() | L181-197 | E2 | 조회창 Sys01_Lookup_Company 열기 | 업무 |
| public makeCode() | L199-287 | buildGrid | 확인창 표시, 서비스 sys.Sys09_Code.selectByCompanyId, sys.Sys09_Code.insert, sys.Sys09_Code.insert(codeKindId, targetCompanyId, codeKindId, makeCodeId, increase, companyId, targetCompanyId, date, codeKindId, makeCodeId, increase, companyId, targetCompanyId, date) | 업무 |
| public retrieve() | L290-293 | 생성자,E3 | 서비스 sys.Sys08_CodeKind.selectByAll | 업무 |
| public update() | L296-297 | 공개 메서드 | 상태 처리 | 업무 |
| public insertRow() | L300-301 | 공개 메서드 | 상태 처리 | 업무 |
| public deleteRow() | L304-305 | 공개 메서드 | 상태 처리 | 업무 |
| private buildGrid() | L133-161 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('kindCd', 150, '*코드구분'),  // L151
  gb.text('kindNm', 150, '*코드구분명'),  // L152
  // ⚠DB없음 L153 sysYnFlag 60 "시스템" (sys08_sys_yn_flag 컬럼 없음)
  gb.text('note', 475, '상세설명'),  // L154
  // ⚠DB없음 L155 makeCodeId 70 "생성ID" (sys08_make_code_id 컬럼 없음)
  // ⚠DB없음 L156 increase 40 "증가" (sys08_increase 컬럼 없음)
  gb.date('date', 100, '시작일자', { editor: 'date' }),  // L157 SQL 계산 컬럼(selectByAll: ( SELECT sys09_apply_date FROM sys09_co…)
  // ⚠ 대응 없음 (GridBuilder L158) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

### Sys09_Grid_SuperUser (`client/vi/sys/Sys09_Grid_SuperUser.java`, 142줄)

- 그리드 `grid` (buildGrid()):
  - codeId 80 "*코드ID" Long
  - code 60 "*코드" Text
  - name 150 "*코드명" Text
  - seq 60 "*조회순서" Text
  - closeYn 60 "미사용" Boolean
  - applyDate 100 "*시작일자" Date
  - closeDate 100 "종료일자" Date
  - note 150 "상세설명" Text

#### 이벤트
[E0] 화면 열림 (생성자 L35-64) → 초기화
[E1] retrieveButton[조회].Select (L38) → retrieve()
[E2] updateButton[저장].Select (L46) → update()
[E3] deleteButton[삭제].Select (L54) → deleteRow()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieveCode() | L85-90 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieveCode() | L92-114 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L117-124 | E1,retrieveCode | 서비스 sys.Sys09_Code.selectByCodeKindId(codeKindId, companyId) | 업무 |
| public update() | L127-130 | E2 | 서비스 sys.Sys09_Code.update | 업무 |
| public deleteRow() | L133-137 | E3 | GridDeleteData sys.Sys09_Code.delete(체크된 행 목록) | 업무 |
| public insertRow() | L140-141 | 공개 메서드 | 상태 처리 | 업무 |
| private buildGrid() | L66-83 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.long('codeId', 80, '*코드ID'),  // L71
  gb.text('code', 60, '*코드'),  // L72
  gb.text('name', 150, '*코드명'),  // L73
  gb.text('seq', 60, '*조회순서'),  // L74
  gb.boolean('closeYn', 60, '미사용'),  // L75
  gb.date('applyDate', 100, '*시작일자'),  // L76
  gb.date('closeDate', 100, '종료일자'),  // L77
  gb.text('note', 150, '상세설명'),  // L78
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="delete" onClick={deleteRow}>삭제</Button>

### Sys09_Grid_CodeList (`client/vi/sys/Sys09_Grid_CodeList.java`, 78줄)

- 툴바 `buttonBar`: 코드 List: {anchor}
- 그리드 `grid` (buildGrid()):
  - codeId 80 "*코드ID" Long
  - code 80 "*코드" Text
  - name 200 "*코드명" Text
  - seq 80 "*조회순서" Text

#### 이벤트
[E0] 화면 열림 (생성자 L25-42) → 초기화
[E1] anchor.MouseDown (L32) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L59-64 | E1 | 서비스 sys.Sys09_Code.selectByAll | 업무 |
| public insertRow() | L67-68 | 공개 메서드 | 상태 처리 | 업무 |
| public update() | L70-71 | 공개 메서드 | 상태 처리 | 업무 |
| public deleteRow() | L73-74 | 공개 메서드 | 상태 처리 | 업무 |
| private buildGrid() | L44-56 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L75-77 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.long('codeId', 80, '*코드ID'),  // L49
  gb.text('code', 80, '*코드'),  // L50
  gb.text('name', 200, '*코드명'),  // L51
  gb.text('seq', 80, '*조회순서'),  // L52
];
```

#### 사용된 버튼들
버튼 사용하지 않음

