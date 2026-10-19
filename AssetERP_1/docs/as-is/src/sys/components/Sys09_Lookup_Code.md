# Sys09_Lookup_Code

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `dcr`, `pln`, `rpt`
- 파일: `client/vi/sys/Sys09_Lookup_Code.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `dcr.Dcr05_DocType.checkDocFormClassCode` | Sys09_Lookup_Code:260 | [`Dcr05_DocType.java:104`](../../dcr/services/Dcr05_DocType.md) | [`dcr05_doc_type.checkDocFormClassCode`](../../dcr/sql/dcr05_doc_type.md) |
| `emp.Emp20_Leave.checkSpcLeaveCode` | Sys09_Lookup_Code:240 | [`Emp20_Leave.java:115`](../../emp/services/Emp20_Leave.md) | [`emp20_leave.checkSpcLeaveCode`](../../emp/sql/emp20_leave.md) |
| `rpt.Rpt03_Week.checkWeekBizType` | Sys09_Lookup_Code:280 | [`Rpt03_Week.java:76`](../../rpt/services/Rpt03_Week.md) | [`rpt03_week.checkWeekBizType`](../../rpt/sql/rpt03_week.md) |
| `sys.Sys08_CodeKind.selectByKindCode` | Sys09_Lookup_Code:102 | [`Sys08_CodeKind.java:55`](../../sys/services/Sys08_CodeKind.md) | [`sys08_code_kind.selectByKindCode`](../../sys/sql/sys08_code_kind.md) |
| `sys.Sys09_Code.checkCode` | Sys09_Lookup_Code:371 | [`Sys09_Code.java:317`](../../sys/services/Sys09_Code.md) | [`dcr05_doc_type.checkDocFormClassCode`](../../dcr/sql/dcr05_doc_type.md), [`emp20_leave.checkSpcLeaveCode`](../../emp/sql/emp20_leave.md), [`rpt03_week.checkWeekBizType`](../../rpt/sql/rpt03_week.md), [`sys09_code.checkByCode`](../../sys/sql/sys09_code.md), [`sys09_code.selectById`](../../sys/sql/sys09_code.md), [`sys95_manual.checkManualType`](../../sys/sql/sys95_manual.md) |
| `sys.Sys09_Code.delete` | Sys09_Lookup_Code:414 | [`Sys09_Code.java:391`](../../sys/services/Sys09_Code.md) | `UpdateDataModel(sys09_code)` 동적 DELETE |
| `sys.Sys09_Code.selectByCodeKind` | Sys09_Lookup_Code:208 | [`Sys09_Code.java:82`](../../sys/services/Sys09_Code.md) | [`sys09_code.selectByCodeKind`](../../sys/sql/sys09_code.md) |
| `sys.Sys09_Code.update` | Sys09_Lookup_Code:402 | [`Sys09_Code.java:386`](../../sys/services/Sys09_Code.md) | `UpdateDataModel(sys09_code)` 동적 INSERT/UPDATE → [`sys09_code.selectById`](../../sys/sql/sys09_code.md) |
| `sys.Sys95_Manual.checkManualType` | Sys09_Lookup_Code:300 | [`Sys95_Manual.java:40`](../../sys/services/Sys95_Manual.md) | [`sys95_manual.checkManualType`](../../sys/sql/sys95_manual.md) |

## 테이블

[`dcr05_doc_type`](../../../db/tables/dcr.md), [`emp20_leave`](../../../db/tables/emp.md), [`rpt03_week`](../../../db/tables/rpt.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys95_manual`](../../../db/tables/sys.md)

## DB 함수

`f_trunc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sys09_Lookup_Code (`client/vi/sys/Sys09_Lookup_Code.java`, 442줄)

- 툴바 `buttonBar`: {insertButton} {deleteButton} {anchor}
- 그리드 `grid` (buildGrid()):
  - code 70 "코드" Text
  - name 350 "코드명" Text
  - code 70 "코드" Text 편집:TextField
  - name 400 "코드명" Text 편집:TextField
  - seq 70 "조회순서" Text 편집:TextField

#### 이벤트
[E1] anchor.MouseDown (L88) → retrieve()
[E2] grid.CellDoubleClick (L136) → hide()
[E3] insertButton[행 추가].Select (L144) → insertRow()
[E4] deleteButton[행 삭제].Select (L150) → deleteRow()
[E5] updateButton[저장].Select (L156) → preUpdate()
[E6] okButton[확인].Select [codeModel != null] (L162) → hide()
[E7] cancelButton[닫기].Select (L172) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public edit() | L76-112 | 공개 메서드 | 서비스 sys.Sys08_CodeKind.selectByKindCode(kindCode) | 업무 |
| public open() | L114-128 | 공개 메서드 | 상태 처리 | 업무 |
| private setting() | L130-184 | edit,open | 상태 처리 | 업무 |
| private retrieve() | L198-215 | E1,setting | 서비스 sys.Sys09_Code.selectByCodeKind(companyId, kindCode, applyDate) | 업무 |
| private insertRow() | L217-232 | E3 | 상태 처리 | 업무 |
| private deleteRow() | L234-324 | E4 | 서비스 emp.Emp20_Leave.checkSpcLeaveCode, dcr.Dcr05_DocType.checkDocFormClassCode, rpt.Rpt03_Week.checkWeekBizType, sys.Sys95_Manual.checkManualType(companyId, spcLeaveCode, companyId, docFormClassCode, companyId, weekBizType, companyId, manualType) | 업무 |
| private preUpdate() | L326-368 | E5 | 상태 처리 | 업무 |
| private checkCode() | L370-388 | preUpdate | 서비스 sys.Sys09_Code.checkCode(companyId, codeKind) | 업무 |
| private update() | L390-425 | preUpdate,checkCode | GridDeleteData sys.Sys09_Code.update, sys.Sys09_Code.delete | 업무 |
| private updateEnd() | L427-436 | update | 상태 처리 | 업무 |
| private buildGrid() | L186-196 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L438-440 | edit,open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('code', 70, '코드'),  // L189
  gb.text('name', 350, '코드명'),  // L190
  gb.text('code', 70, '코드', { editor: 'text' }),  // L191
  gb.text('name', 400, '코드명', { editor: 'text' }),  // L192
  gb.text('seq', 70, '조회순서', { editor: 'text' }),  // L193
];
```

#### 사용된 버튼들
1. <Button type="addRow" onClick={insertRow}>행 추가</Button>
2. <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>
3. <Button type="save" onClick={preUpdate}>저장</Button>
4. <Button type="save" onClick={hide}>확인</Button>
5. <Button type="unknown" onClick={hide}>닫기</Button>

