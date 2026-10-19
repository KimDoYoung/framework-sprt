# Tdm40_Tab_ManlJob

- 종류: 화면
- 메뉴: 책무 > 03. 부서책무매뉴얼 > 매뉴얼 작업대상 선정 (#1420)
- 파일: `client/vi/tdm/Tdm40_Tab_ManlJob.java`
- 함께 쓰는 클래스 1개:
  - `Tdm20_Lookup_SelectRole` `client/vi/tdm/Tdm20_Lookup_SelectRole.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Org00_Lookup_SelectSingle`](../../org/components/Org00_Lookup_SelectSingle.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `tdm.Tdm20_Role.selectByDate` | Tdm20_Lookup_SelectRole:193 | [`Tdm20_Role.java:33`](../../tdm/services/Tdm20_Role.md) | [`tdm20_role.selectByDate`](../../tdm/sql/tdm20_role.md) |
| `tdm.Tdm20_Role.selectCheckTargetRole` | Tdm20_Lookup_SelectRole:188 | [`Tdm20_Role.java:38`](../../tdm/services/Tdm20_Role.md) | [`tdm20_role.selectCheckTargetRole`](../../tdm/sql/tdm20_role.md) |
| `tdm.Tdm40_ManlJob.createDirectManl` | Tdm40_Tab_ManlJob:630 | [`Tdm40_ManlJob.java:76`](../../tdm/services/Tdm40_ManlJob.md) | [`tdm40_manl_job.createDirectManl`](../../tdm/sql/tdm40_manl_job.md) |
| `tdm.Tdm40_ManlJob.createDuty` | Tdm40_Tab_ManlJob:582 | [`Tdm40_ManlJob.java:55`](../../tdm/services/Tdm40_ManlJob.md) | [`tdm40_manl_job.createDuty`](../../tdm/sql/tdm40_manl_job.md), [`tdm44_manl_duty_org.createDutyOrg`](../../tdm/sql/tdm44_manl_duty_org.md) |
| `tdm.Tdm40_ManlJob.delete` | Tdm40_Tab_ManlJob:456 | [`Tdm40_ManlJob.java:107`](../../tdm/services/Tdm40_ManlJob.md) | `UpdateDataModel(tdm40_manl_job)` 동적 DELETE |
| `tdm.Tdm40_ManlJob.deleteAll` | Tdm40_Tab_ManlJob:439, Tdm40_Tab_ManlJob:559 | [`Tdm40_ManlJob.java:44`](../../tdm/services/Tdm40_ManlJob.md) | [`tdm41_manl_duty.deleteByManlJobId`](../../tdm/sql/tdm41_manl_duty.md), [`tdm42_manl_org.deleteByManlJobId`](../../tdm/sql/tdm42_manl_org.md), [`tdm43_manl.deleteByManlJobId`](../../tdm/sql/tdm43_manl.md), [`tdm44_manl_duty_org.deleteByManlJobId`](../../tdm/sql/tdm44_manl_duty_org.md) |
| `tdm.Tdm40_ManlJob.selectByText` | Tdm40_Tab_ManlJob:321 | [`Tdm40_ManlJob.java:24`](../../tdm/services/Tdm40_ManlJob.md) | [`tdm40_manl_job.selectByText`](../../tdm/sql/tdm40_manl_job.md) |
| `tdm.Tdm40_ManlJob.update` | Tdm40_Tab_ManlJob:371 | [`Tdm40_ManlJob.java:102`](../../tdm/services/Tdm40_ManlJob.md) | `UpdateDataModel(tdm40_manl_job)` 동적 INSERT/UPDATE → [`tdm40_manl_job.selectById`](../../tdm/sql/tdm40_manl_job.md) |
| `tdm.Tdm41_ManlDuty.selectByManlJobId` | Tdm40_Tab_ManlJob:295 | [`Tdm41_ManlDuty.java:25`](../../tdm/services/Tdm41_ManlDuty.md) | [`tdm41_manl_duty.selectByManlJobId`](../../tdm/sql/tdm41_manl_duty.md) |
| `tdm.Tdm43_Manl.countByManlJobId` | Tdm40_Tab_ManlJob:526 | [`Tdm43_Manl.java:73`](../../tdm/services/Tdm43_Manl.md) | [`tdm43_manl.countByManlJobId`](../../tdm/sql/tdm43_manl.md) |

## 테이블

[`tdm10_task`](../../../db/tables/tdm.md), [`tdm20_role`](../../../db/tables/tdm.md), [`tdm21_role_relate_task`](../../../db/tables/tdm.md), [`tdm22_role_relate_cncl`](../../../db/tables/tdm.md), [`tdm23_role_relate_org`](../../../db/tables/tdm.md), [`tdm35_role_allc_task`](../../../db/tables/tdm.md), [`tdm40_manl_job`](../../../db/tables/tdm.md), [`tdm41_manl_duty`](../../../db/tables/tdm.md), [`tdm42_manl_org`](../../../db/tables/tdm.md), [`tdm43_manl`](../../../db/tables/tdm.md), [`tdm44_manl_duty_org`](../../../db/tables/tdm.md), [`tdm51_chck_org`](../../../db/tables/tdm.md), [`tdm52_chck_manl`](../../../db/tables/tdm.md), [`tdm58_chck_appr_step`](../../../db/tables/tdm.md)

## DB 함수

`f_cdnm`, `f_create_seq`, `f_create_tdm_manual`, `f_get_tdmorg_id2`, `f_org_nm`, `f_sysdate`, `f_today`, `getorg`, `gettdm30roleallc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Tdm40_Tab_ManlJob (`client/vi/tdm/Tdm40_Tab_ManlJob.java`, 660줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 검색: {searchText} {writingYn} {retrieveButton} {insertButton} {updateButton} {deleteButton} {makeButton} {redefineButton} {copyButton}
- 입력·하위 화면: `searchText` TextField 빈칸="매뉴얼작업명/직책", `writingYn` CheckBox, `lookup01` LookupTriggerField, `lookup` Tdm20_Lookup_SelectRole, `lookup02` LookupTriggerField
- 그리드 `grid` (buildGrid(), 체크박스):
  - regDate 90 "등록일" Date
  - jobName 250 "매뉴얼작업명" Text 편집:TextField
  - manlApplyStartDate 90 "매뉴얼<br>적용시작일" Date 편집:MyDateField
  - roleName 150 "직책<br>(조건1)" Text 편집:lookup01
  - orgName 150 "부서<br>(조건2)" Text 편집:lookup02
  - jobReason 200 "사유" Text 편집:TextField
  - startDate 90 "작성시작일" Date 편집:MyDateField
  - endDate 90 "작성마감일" Date 편집:MyDateField
  - dutyCntStr 150 "작성현황<br>(완료부서/전체부서)" TextCenter
  - dutyEndYn 90 "완료여부" BooleanYn2
  - dutyEndDate 90 "완료일" Date

#### 이벤트
[E0] 화면 열림 (생성자 L72-105) → settings(), retrieve()
[E1] searchText.KeyPress [Enter] (L110) → retrieve()
[E2] retrieveButton[조회].Select (L121) → retrieve()
[E3] insertButton[등록].Select (L127) → insertRow()
[E4] updateButton[저장].Select (L133) → updateChk()
[E5] deleteButton[삭제].Select (L139) → deleteChk()
       └ [E11] msgBox.DialogHide [YES] (L388) → deleteChk2()
[E6] makeButton[관리의무생성].Select (L145) → checkPreCreateDuty()
[E7] redefineButton[매뉴얼 작성].Select (L151) → createDirectManl()
[E8] copyButton[매뉴얼 복제].Select (L157) → createDirectManl()
[E9] lookup01.TriggerClick (L168) → tdm41Chk()
[E10] lookup02.TriggerClick (L222) → tdm41Chk()
[E13] msgBox.DialogHide [YES] (L499) → checkPreCreateDuty2()
[E14] msgBox.DialogHide [YES] (L554) → createDuty()
[E15] messageBox.DialogHide (L626) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private tdm41Chk() | L294-309 | E9,E10,deleteChk2,checkPreCreateDuty2 | 서비스 tdm.Tdm41_ManlDuty.selectByManlJobId(manlJobId) | 업무 |
| private retrieve() | L311-327 | 생성자,E1,E2,E15,createDuty | 서비스 tdm.Tdm40_ManlJob.selectByText(companyId, orgId, searchText, writingYn, checkYn, createDutyYn) | 업무 |
| private insertRow() | L329-340 | E3 | 상태 처리 | 업무 |
| private updateChk() | L342-367 | E4 | 상태 처리 | 업무 |
| private update() | L369-372 | updateChk | 서비스 tdm.Tdm40_ManlJob.update | 업무 |
| private deleteChk() | L374-403 | E5 | ConfirmBox → E11 | 업무 |
| private deleteChk2() | L405-436 | E11 | ConfirmBox → E12 | 업무 |
| private deleteAll() | L438-450 | E12 | 서비스 tdm.Tdm40_ManlJob.deleteAll(manlJobId, userName) | 업무 |
| private deleteRow() | L452-466 | deleteChk2,deleteAll | GridDeleteData tdm.Tdm40_ManlJob.delete(체크된 행 목록) | 업무 |
| private checkPreCreateDuty() | L468-514 | E6 | 확인창 표시 | 업무 |
| private checkPreCreateDuty2() | L516-547 | E13 | 서비스 tdm.Tdm43_Manl.countByManlJobId(manlJobId) | 업무 |
| private checkPreCreateDuty3() | L549-579 | checkPreCreateDuty2 | 확인창 표시, 서비스 tdm.Tdm40_ManlJob.deleteAll(manlJobId, userName) | 업무 |
| private createDuty() | L581-598 | E14,checkPreCreateDuty2 | 서비스 tdm.Tdm40_ManlJob.createDuty | 업무 |
| private createDirectManl() | L600-651 | E7,E8 | 확인창 표시, 서비스 tdm.Tdm40_ManlJob.createDirectManl(actionName) | 업무 |
| private settings() | L107-163 | 생성자 | 이벤트 연결, 초기값: writingYn=false("작성중만 조회") | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L165-292 | 필드 초기화 | 조회창 Tdm20_Lookup_SelectRole 열기, 조회창 Org00_Lookup_SelectSingle 열기, 미선택 시 alert "완료된 매뉴얼은 수정이 불가능합니다", 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L653-655 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L657-659 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('regDate', 90, '등록일'),  // L279
  gb.text('jobNm', 250, '매뉴얼작업명', { editor: 'text' }),  // L280
  gb.date('manlApplyStartDate', 90, '매뉴얼<br>적용시작일', { editor: 'date' }),  // L281
  gb.text('roleNm', 150, '직책<br>(조건1)'),  // L282 SQL 계산 컬럼(selectByText: tdm20_role_nm)
  gb.text('orgNm', 150, '부서<br>(조건2)'),  // L283 SQL 계산 컬럼(selectByText: org00_kor_nm)
  gb.text('jobReason', 200, '사유', { editor: 'text' }),  // L284
  gb.date('startDate', 90, '작성시작일', { editor: 'date' }),  // L285
  gb.date('endDate', 90, '작성마감일', { editor: 'date' }),  // L286
  gb.textCenter('dutyCntStr', 150, '작성현황<br>(완료부서/전체부서)'),  // L287 SQL 계산 컬럼(selectByText: CASE WHEN tdm41_manl_job_id IS NULL THE…)
  gb.booleanYn2('dutyEndYn', 90, '완료여부'),  // L288 SQL 계산 컬럼(selectByText: CASE WHEN tdm41_end_cnt = tdm41_org_cnt…)
  gb.date('dutyEndDate', 90, '완료일'),  // L289 SQL 계산 컬럼(selectByText: CASE WHEN tdm41_end_cnt = tdm41_org_cnt…)
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={updateChk}>저장</Button>
4. <Button type="delete" onClick={deleteChk}>삭제</Button>
5. <Button type="save" onClick={checkPreCreateDuty}>관리의무생성</Button>
6. <Button type="unknown" onClick={createDirectManl}>매뉴얼 작성</Button>
7. <Button type="unknown" onClick={createDirectManl}>매뉴얼 복제</Button>

### Tdm20_Lookup_SelectRole (`client/vi/tdm/Tdm20_Lookup_SelectRole.java`, 225줄)

- 툴바 `buttonBar`: 기준일: {baseDate} 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `baseDate` MyDateField, `searchText` TextField 빈칸="직책"
- 그리드 `grid` (buildGrid(), 체크박스):
  - roleName 420 "직책" Text

#### 이벤트
[E0] 화면 열림 (생성자 L60-65) → 초기화
[E1] searchText.KeyPress [Enter] (L130) → retrieve()
[E2] grid.CellDoubleClick (L138) → confirm()
[E3] retrieveButton[조회].Select (L144) → retrieve()
[E4] updateButton[확인].Select (L150) → confirm()
[E5] closeButton[닫기].Select (L156) → hide()
[E6] allButton[전체].Select (L162) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public openAll() | L67-70 | 공개 메서드 | 상태 처리 | 업무 |
| public openAll() | L72-78 | 공개 메서드 | 상태 처리 | 업무 |
| public openTarget() | L80-88 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L90-120 | openAll,openTarget | 상태 처리 | 업무 |
| public retrieve() | L179-206 | E1,E3,open | 서비스 tdm.Tdm20_Role.selectCheckTargetRole, tdm.Tdm20_Role.selectByDate(companyId, searchText, checkYm, personId, baseDate, orgId) | 업무 |
| public confirm() | L208-216 | E2,E4 | 미선택 시 alert "선택된 직책이 없습니다" | 업무 |
| private settings() | L122-169 | open | 이벤트 연결, 초기값: baseDate=stdDate | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L171-177 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L218-220 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L222-224 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('roleNm', 420, '직책'),  // L174
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>
4. <Button type="unknown" onClick={hide}>전체</Button>

