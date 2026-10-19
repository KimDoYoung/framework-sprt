# Tdm36_Tab_RoleReport

- 종류: 화면
- 메뉴: 책무 > 02. 책무구조도 > 책무구조도 제출 (#1480)
- 파일: `client/vi/tdm/Tdm36_Tab_RoleReport.java`
- 함께 쓰는 클래스 1개:
  - `Tdm36_TabPage_RoleReport` `client/vi/tdm/Tdm36_TabPage_RoleReport.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Sys10_Lookup_FileViewer`](../../sys/components/Sys10_Lookup_FileViewer.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys10_File.selectByParentId` | Tdm36_TabPage_RoleReport:181, Tdm36_TabPage_RoleReport:213, Tdm36_TabPage_RoleReport:244 | [`Sys10_File.java:51`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |
| `sys.Sys99_Print.CreateTdmRoleDesc` | Tdm36_TabPage_RoleReport:280 | [`Sys99_Print.java:122`](../../sys/services/Sys99_Print.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys99_print.deleteByPJobTp`](../../sys/sql/sys99_print.md), [`sys99_print.tdmCreateData`](../../sys/sql/sys99_print.md) |
| `tdm.Tdm33_RoleDigmFile.selectByRoleDigmId` | Tdm36_TabPage_RoleReport:202, Tdm36_TabPage_RoleReport:233 | [`Tdm33_RoleDigmFile.java:27`](../../tdm/services/Tdm33_RoleDigmFile.md) | [`tdm33_role_digm_file.selectByRoleDigmId`](../../tdm/sql/tdm33_role_digm_file.md) |
| `tdm.Tdm36_RoleReport.delete` | Tdm36_Tab_RoleReport:247 | [`Tdm36_RoleReport.java:48`](../../tdm/services/Tdm36_RoleReport.md) | `UpdateDataModel(tdm36_role_report)` 동적 DELETE |
| `tdm.Tdm36_RoleReport.getAttachList` | Tdm36_TabPage_RoleReport:157 | [`Tdm36_RoleReport.java:35`](../../tdm/services/Tdm36_RoleReport.md) | [`tdm36_role_report.getAttachList`](../../tdm/sql/tdm36_role_report.md) |
| `tdm.Tdm36_RoleReport.selectByDate` | Tdm36_Tab_RoleReport:196 | [`Tdm36_RoleReport.java:23`](../../tdm/services/Tdm36_RoleReport.md) | [`tdm36_role_report.selectByDate`](../../tdm/sql/tdm36_role_report.md) |
| `tdm.Tdm36_RoleReport.update` | Tdm36_Tab_RoleReport:212 | [`Tdm36_RoleReport.java:43`](../../tdm/services/Tdm36_RoleReport.md) | `UpdateDataModel(tdm36_role_report)` 동적 INSERT/UPDATE → [`tdm36_role_report.selectById`](../../tdm/sql/tdm36_role_report.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md), [`sys99_print`](../../../db/tables/sys.md), [`tdm01_hr`](../../../db/tables/tdm.md), [`tdm20_role`](../../../db/tables/tdm.md), [`tdm30_role_allc`](../../../db/tables/tdm.md), [`tdm31_role_desc`](../../../db/tables/tdm.md), [`tdm32_role_digm`](../../../db/tables/tdm.md), [`tdm33_role_digm_file`](../../../db/tables/tdm.md), [`tdm36_role_report`](../../../db/tables/tdm.md)

## DB 함수

`f_cdnm`, `f_sysdate`, `f_today`, `tdm_create_data`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Tdm36_Tab_RoleReport (`client/vi/tdm/Tdm36_Tab_RoleReport.java`, 256줄)

- 레이아웃: center=vlc, south=tabPage
- 툴바 `buttonBar`: 조회기간: {startDate} ~: {closeDate} {checkYn01} {checkYn02} {retrieveButton} {insertButton} {updateButton} {deleteButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `checkYn01` CheckBox, `checkYn02` CheckBox, `tabPage` Tdm36_TabPage_RoleReport
- 그리드 `grid` (buildGrid()):
  - boardOpenDate 100 "이사회<br>개최일" Date 편집:MyDateField
  - allcStdDate 100 "책무배분<br>기준일" Date 편집:MyDateField
  - reportDate 100 "보고서<br>제출일" Date 편집:MyDateField
  - boardOpenLoc 200 "이사회<br>장소" Text 편집:TextField
  - membTotCnt 100 "이사회<br>이사 수" Long 편집:LongField
  - membAttendCnt 100 "출석이사 수" Long 편집:LongField
  - boardOpenAgenda 400 "안건" Text 편집:TextField
  - membYesName 400 "찬성이사" Text 편집:TextField
  - updName 100 "등록자" TextCenter
  - updDateStr 150 "등록일" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L61-98) → settings(), retrieve()
[E1] checkYn01[전체보기].ValueChange [checkYn01.getValue()] (L110) → retrieve()
[E2] checkYn02[미처리건만 조회].ValueChange (L125) → retrieve()
[E3] retrieveButton[조회].Select (L131) → retrieve()
[E4] insertButton[등록].Select (L137) → insertRow()
[E5] updateButton[저장].Select (L143) → update()
[E6] deleteButton[삭제].Select (L149) → deleteChk()
       └ [E8] msgBox.DialogHide [YES] (L226) → deleteRow()
[E7] grid.RowClick (L155) → retrieveEditPage()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieveEditPage() | L163-166 | E7 | 상태 처리 | 업무 |
| public retrieve() | L185-207 | 생성자,E1,E2,E3 | 서비스 tdm.Tdm36_RoleReport.selectByDate(companyId, startDate, closeDate, checkYn01, checkYn02) | 업무 |
| public update() | L209-213 | E5 | 서비스 tdm.Tdm36_RoleReport.update(updName) | 업무 |
| public insertRow() | L215-221 | E4 | 상태 처리 | 업무 |
| private deleteChk() | L223-241 | E6 | ConfirmBox → E8 | 업무 |
| public deleteRow() | L243-248 | E8 | GridDeleteData tdm.Tdm36_RoleReport.delete(체크된 행 목록) | 업무 |
| private settings() | L100-161 | 생성자 | 이벤트 연결, 초기값: startDate=ClientDateUtil.toDate(DateTimeFormat.getFormat("yyyy-01-01", closeDate=LoginUser.getToday(, checkYn01=true("전체보기"), checkYn02=false("미처리건만 조회") | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L168-183 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L250-252 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L253-255 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('boardOpenDate', 100, '이사회<br>개최일', { editor: 'date' }),  // L171
  gb.date('allcStdDate', 100, '책무배분<br>기준일', { editor: 'date' }),  // L172
  gb.date('reportDate', 100, '보고서<br>제출일', { editor: 'date' }),  // L173
  gb.text('boardOpenLoc', 200, '이사회<br>장소', { editor: 'text' }),  // L174
  gb.long('membTotCnt', 100, '이사회<br>이사 수', { editor: 'number' }),  // L175
  gb.long('membAttendCnt', 100, '출석이사 수', { editor: 'number' }),  // L176
  gb.text('boardOpenAgenda', 400, '안건', { editor: 'text' }),  // L177
  gb.text('membYesNm', 400, '찬성이사', { editor: 'text' }),  // L178
  gb.textCenter('updNm', 100, '등록자'),  // L179
  gb.textCenter('updDateStr', 150, '등록일'),  // L180 SQL 계산 컬럼(selectByDate: COALESCE(TO_CHAR(tdm36_upd_date, 'yyyy-…)
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={deleteChk}>삭제</Button>

### Tdm36_TabPage_RoleReport (`client/vi/tdm/Tdm36_TabPage_RoleReport.java`, 366줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: {retrieveButton}
- 입력·하위 화면: `editor` Apr01_Edit_ApprDoc, `lookupViewer` Sys10_Lookup_FileViewer
- 그리드 `grid` (buildGrid()):
  - rptTitle 300 "첨부의 종류" Text
  - rptSubTitle 300 "내용" Text
  - rdCode 60 "보기" DynamicCell 편집:actionCell01
  - relateApprStatusCode 60 "문서" DynamicCell 편집:actionCell02

#### 이벤트
[E0] 화면 열림 (생성자 L55-69) → settings()
[E1] retrieveButton[조회].Select (L72) → retrieve()
[E2] updateButton[상신].Select (L78) → 인라인 L78-83 (new SelectHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L150-163 | E1 | 서비스 tdm.Tdm36_RoleReport.getAttachList(roleReportId) | 업무 |
| public insertRow() | L165-170 | 공개 메서드 | 상태 처리 | 업무 |
| public gridClear() | L172-174 | 공개 메서드 | 상태 처리 | 업무 |
| private viewFile() | L176-274 | buildGrid | 조회창 Sys10_Lookup_FileViewer 열기, 서비스 sys.Sys10_File.selectByParentId, tdm.Tdm33_RoleDigmFile.selectByRoleDigmId, sys.Sys10_File.selectByParentId, tdm.Tdm33_RoleDigmFile.selectByRoleDigmId, sys.Sys10_File.selectByParentId(parentId, roleDigmId, fileType, parentId, roleDigmId, fileType, parentId) | 업무 |
| private viewRd() | L276-330 | buildGrid | 서비스 sys.Sys99_Print.CreateTdmRoleDesc(companyId, personId, windowClassName, pJobTp, regDate, pId) | 업무 |
| private downloadRd() | L332-364 | buildGrid | 상태 처리 | 업무 |
| private settings() | L71-84 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L86-148 | 필드 초기화 | 팝업 Apr01_Edit_ApprDoc 열기, 미선택 시 alert "해당문서의 열람권한이 없습니다", 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('rptTitle', 300, '첨부의 종류'),  // L142 SQL 계산 컬럼(getAttachList: '표지')
  gb.text('rptSubTitle', 300, '내용'),  // L143 SQL 계산 컬럼(getAttachList: '')
  // ⚠ 대응 없음 (GridBuilder L144) addDynamicCell
  // ⚠ 대응 없음 (GridBuilder L145) addDynamicCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={() => /* 인라인 L78-83 (new SelectHandler() { @Override publi…) */}>상신</Button>

