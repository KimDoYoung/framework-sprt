# Pln03_Tab_Resrch

- 종류: 화면
- 파일: `client/vi/pln/Pln03_Tab_Resrch.java`
- 함께 쓰는 클래스 1개:
  - `Pln03_Lookup_ResrchDetail` `client/vi/pln/Pln03_Lookup_ResrchDetail.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Dcr01_Lookup_ClassTree`](../../dcr/components/Dcr01_Lookup_ClassTree.md), [`Emp00_Lookup_SelectSingle`](../../emp/components/Emp00_Lookup_SelectSingle.md), [`Fnd07_Lookup_IssuingEntity`](../../fnd/components/Fnd07_Lookup_IssuingEntity.md), [`Sys09_Lookup_Code`](../../sys/components/Sys09_Lookup_Code.md), [`Sys10_Lookup_SelectMulti`](../../sys/components/Sys10_Lookup_SelectMulti.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `pln.Pln03_Resrch.apprUpdate` | Pln03_Lookup_ResrchDetail:296 | [`Pln03_Resrch.java:122`](../../pln/services/Pln03_Resrch.md) | `pln03_resrch.apprUpdate`(없음) |
| `pln.Pln03_Resrch.closeUpdate` | Pln03_Lookup_ResrchDetail:276 | [`Pln03_Resrch.java:106`](../../pln/services/Pln03_Resrch.md) | `pln03_resrch.closeUpdate`(없음) |
| `pln.Pln03_Resrch.delete` | Pln03_Tab_Resrch:185 | [`Pln03_Resrch.java:147`](../../pln/services/Pln03_Resrch.md) | `UpdateDataModel(pln03_resrch)` 동적 DELETE |
| `pln.Pln03_Resrch.selectById` | Pln03_Lookup_ResrchDetail:140 | [`Pln03_Resrch.java:24`](../../pln/services/Pln03_Resrch.md) | `pln03_resrch.selectById`(없음) |
| `pln.Pln03_Resrch.selectBySearchText` | Pln03_Tab_Resrch:144 | [`Pln03_Resrch.java:30`](../../pln/services/Pln03_Resrch.md) | `pln03_resrch.selectBySearchText`(없음) |
| `pln.Pln03_Resrch.selectDetailInit` | Pln03_Lookup_ResrchDetail:140 | [`Pln03_Resrch.java:56`](../../pln/services/Pln03_Resrch.md) | `pln03_resrch.selectDetailInit`(없음) |
| `pln.Pln03_Resrch.update` | Pln03_Lookup_ResrchDetail:152 | [`Pln03_Resrch.java:140`](../../pln/services/Pln03_Resrch.md) | `pln03_resrch.insert`(없음) |

## 테이블

[`pln03_resrch`](../../../db/tables/pln.md)

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Pln03_Tab_Resrch (`client/vi/pln/Pln03_Tab_Resrch.java`, 211줄)

- 레이아웃: center=vlc
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `searchText` TextField, `closeCheckBox` CheckBox, `lookupResrch` Pln03_Lookup_ResrchDetail
- 그리드 `grid` (buildGrid(), 체크박스):
  - parentTreeNm 100 "문서분류" Text
  - classTreeNm 150 "문서구분" Text
  - issuingEntityNm 200 "조사대상" Text
  - regEmpNm 200 "등록자" Text
  - regDate 100 "등록일" Date
  - resrchStartDate 100 "조사시작일" Date
  - resrchCloseDate 100 "조사완료일" Date
  - actionCell 80 "상세보기" Cell 편집:lookupResrchDetail
  - docYn 80 "문서등록" Text
  - aprYn 80 "결재상태" Text
  - cfrmDate 100 "완료일" Date
  - note 250 "비고" Text

#### 이벤트
[E0] 화면 열림 (생성자 L51-93) → retrieve()
[E1] searchText.KeyPress [Enter] (L61) → retrieve()
[E2] searchbarBuilder[조회].Retrieve (L78) → retrieve()
[E3] searchbarBuilder[등록].Insert (L79) → insertRow()
[E4] searchbarBuilder[삭제].Delete (L80) → deleteRow()
       └ [E5] msgBox.DialogHide [YES] (L179) → 서비스 pln.Pln03_Resrch.delete

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L132-150 | 생성자,E1,E2,buildGrid,insertRow | 서비스 pln.Pln03_Resrch.selectBySearchText(resrchStartDate, resrchCloseDate, searchText, closeYn, regPersonId, orgId) | 업무 |
| public update() | L153-155 | 공개 메서드 | 상태 처리 | 업무 |
| public insertRow() | L158-166 | E3 | 조회창 Pln03_Lookup_ResrchDetail 열기 | 업무 |
| public deleteRow() | L169-196 | E4 | 미선택 시 alert "승인이 완료되어 삭제할 수 없습니다" → 확인창 E5 | 업무 |
| public getServiceResult() | L199-201 | 공개 메서드 | 상태 처리 | 업무 |
| private buildGrid() | L95-129 | 필드 초기화 | 조회창 Pln03_Lookup_ResrchDetail 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L203-205 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L207-209 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('parentTreeNm', 100, '문서분류'),  // L115
  gb.text('classTreeNm', 150, '문서구분'),  // L116
  gb.text('issuingEntityNm', 200, '조사대상'),  // L117
  gb.text('regEmpNm', 200, '등록자'),  // L118
  gb.date('regDate', 100, '등록일'),  // L119
  gb.date('resrchStartDate', 100, '조사시작일'),  // L120
  gb.date('resrchCloseDate', 100, '조사완료일'),  // L121
  // ⚠ 대응 없음 (GridBuilder L122) addCell
  gb.text('docYn', 80, '문서등록'),  // L123
  gb.text('aprYn', 80, '결재상태'),  // L124
  gb.date('cfrmDate', 100, '완료일'),  // L125
  gb.text('note', 250, '비고'),  // L126
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="delete" onClick={deleteRow}>삭제</Button>

### Pln03_Lookup_ResrchDetail (`client/vi/pln/Pln03_Lookup_ResrchDetail.java`, 683줄)

- 입력·하위 화면: `fileForm` Sys10_Lookup_SelectMulti("Y"), `regEmpNm` TextField, `classTreeNm` TextField, `issuingEntityNm` TextField, `resrchStartDate` MyDateField, `resrchCloseDate` MyDateField, `cfrmEmpNm` TextField, `cfrmDate` MyDateField, `visitReason` TextField, `note` TextField, `targetTypeCode` TextField, `targetTypeName` ComboBoxField("ResrchTargetTypeCode"), `lookupDcr` Dcr01_Lookup_ClassTree, `lookupIssuingEntity` Fnd07_Lookup_IssuingEntity, `lookupCode` Sys09_Lookup_Code, `popup` Emp00_Lookup_SelectSingle

#### 이벤트
[E3] classTreeSearch[찾기].Select (L469) → 인라인 L469-483 (new SelectHandler() { @Override publi…)
[E4] targetTypeName[ResrchTargetTypeCode].Collapse (L491) → 인라인 L491-506 (new CollapseHandler() { @Override pub…)
[E5] issuingEntitySearch[찾기].Select (L511) → 메시지 "조사대상구분 선택 후 [찾기]를 클릭해주세요"
[E6] cfrmEmpSearch[찾기].Select (L569) → findEmp()
[E7] updateButton[저장].Select (L600) → update()
[E8] apprButton[승인요청].Select (L609) → appr_check()
       └ [E1] msgBox.DialogHide [YES] (L220) → appr()
[E9] okButton[승인].Select (L619) → confirm_check()
       └ [E2] msgBox.DialogHide [YES] (L251) → confirm()
[E10] cancelButton[닫기].Select (L629) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L98-124 | 공개 메서드 | 상태 처리 | 업무 |
| private retrieve() | L126-146 | open | 서비스 pln.Pln03_Resrch.selectDetailInit, pln.Pln03_Resrch.selectById | 업무 |
| private update() | L148-157 | E7 | 서비스 pln.Pln03_Resrch.update | 업무 |
| private preUpdate() | L159-200 | update | 상태 처리 | 업무 |
| private appr_check() | L202-239 | E8 | ConfirmBox → E1 | 업무 |
| private confirm_check() | L241-271 | E9 | ConfirmBox → E2 | 업무 |
| private appr() | L273-289 | E1 | 서비스 pln.Pln03_Resrch.closeUpdate | 업무 |
| private confirm() | L292-308 | E2 | 서비스 pln.Pln03_Resrch.apprUpdate | 업무 |
| public getServiceResult() | L311-367 | 공개 메서드 | 상태 처리 | 업무 |
| private setEnabled() | L369-399 | getServiceResult | 상태 처리 | 업무 |
| private apprButtonEnabled() | L401-416 | getServiceResult,setEnabled | 상태 처리 | 업무 |
| private okButtonEnabled() | L418-426 | setEnabled,findEmp | 상태 처리 | 업무 |
| private getEditor() | L428-595 | open | 조회창 Dcr01_Lookup_ClassTree 열기, 조회창 Fnd07_Lookup_IssuingEntity 열기, 조회창 Sys09_Lookup_Code 열기 | 업무 |
| private setButton() | L597-637 | open | 상태 처리 | 업무 |
| private findEmp() | L639-653 | E6 | 조회창 Emp00_Lookup_SelectSingle 열기 | 업무 |
| private setHtmlStyle() | L675-677 | 미사용 후보 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L679-681 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="search" onClick={() => /* 인라인 L469-483 (new SelectHandler() { @Override publi…) */}>찾기</Button>
2. <Button type="search" onClick={() => /* 메시지 "조사대상구분 선택 후 [찾기]를 클릭해주세요" */}>찾기</Button>
3. <Button type="search" onClick={findEmp}>찾기</Button>
4. <Button type="save" onClick={update}>저장</Button>
5. <Button type="unknown" onClick={hide}>닫기</Button>
6. <Button type="save" onClick={confirm_check}>승인</Button>
7. <Button type="unknown" onClick={appr_check}>승인요청</Button>

