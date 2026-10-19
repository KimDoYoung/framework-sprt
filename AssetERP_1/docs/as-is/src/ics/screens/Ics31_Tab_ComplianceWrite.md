# Ics31_Tab_ComplianceWrite

- 종류: 화면
- 메뉴: 준법감시 > 20. 임직원 내부통제 준수 > 내부통제 준수확인서 작성 (#1310)
- 파일: `client/vi/ics/Ics31_Tab_ComplianceWrite.java`
- 함께 쓰는 클래스 1개:
  - `Ics31_Edit_Reason` `client/vi/ics/Ics31_Edit_Reason.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `ics.Ics30_Compliance.selectByPersonId` | Ics31_Tab_ComplianceWrite:185 | [`Ics30_Compliance.java:27`](../../ics/services/Ics30_Compliance.md) | [`ics30_compliance.selectByPersonId`](../../ics/sql/ics30_compliance.md) |
| `ics.Ics31_ComplianceWrite.deleteByPersonId` | Ics31_Tab_ComplianceWrite:535 | [`Ics31_ComplianceWrite.java:146`](../../ics/services/Ics31_ComplianceWrite.md) | [`ics31_compliance_write.selectWrite`](../../ics/sql/ics31_compliance_write.md), `UpdateDataModel(ics31_compliance_write)` 동적 DELETE |
| `ics.Ics31_ComplianceWrite.modelUpdate` | Ics31_Edit_Reason:90, Ics31_Tab_ComplianceWrite:371 | [`Ics31_ComplianceWrite.java:133`](../../ics/services/Ics31_ComplianceWrite.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(ics31_compliance_write)` 동적 INSERT/UPDATE → [`ics31_compliance_write.selectById`](../../ics/sql/ics31_compliance_write.md) |
| `ics.Ics31_ComplianceWrite.selectById` | Ics31_Tab_ComplianceWrite:392 | [`Ics31_ComplianceWrite.java:22`](../../ics/services/Ics31_ComplianceWrite.md) | [`ics31_compliance_write.selectById`](../../ics/sql/ics31_compliance_write.md) |
| `ics.Ics31_ComplianceWrite.updateAnswerCode` | Ics31_Tab_ComplianceWrite:275 | [`Ics31_ComplianceWrite.java:45`](../../ics/services/Ics31_ComplianceWrite.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`ics31_compliance_write.selectByPersonId`](../../ics/sql/ics31_compliance_write.md), [`ics31_compliance_write.updateAnswerCode`](../../ics/sql/ics31_compliance_write.md), `UpdateDataModel(ics31_compliance_write)` 동적 INSERT/UPDATE → [`ics31_compliance_write.selectById`](../../ics/sql/ics31_compliance_write.md) |
| `ics.Ics31_ComplianceWrite.updateFixYn` | Ics31_Tab_ComplianceWrite:488 | [`Ics31_ComplianceWrite.java:95`](../../ics/services/Ics31_ComplianceWrite.md) | [`ics31_compliance_write.updateFixYn`](../../ics/sql/ics31_compliance_write.md) |
| `sys.Sys01_Company.selectById` | Ics31_Tab_ComplianceWrite:113 | [`Sys01_Company.java:20`](../../sys/services/Sys01_Company.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys01_company.selectById`](../../sys/sql/sys01_company.md), [`sys01_company.updateMainImageId`](../../sys/sql/sys01_company.md) |
| `sys.Sys99_Print.insertRdComplianceWrite` | Ics31_Tab_ComplianceWrite:559 | [`Sys99_Print.java:5153`](../../sys/services/Sys99_Print.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`ics30_compliance.selectByPersonId`](../../ics/sql/ics30_compliance.md), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |

## 테이블

[`ics30_compliance`](../../../db/tables/ics.md), [`ics31_compliance_write`](../../../db/tables/ics.md), [`sys01_company`](../../../db/tables/sys.md), [`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_emp_kor_nm`, `f_get_emptrans`, `f_sysdate`, `f_today`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ics31_Tab_ComplianceWrite (`client/vi/ics/Ics31_Tab_ComplianceWrite.java`, 644줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 기준 분기(월): {yyyyText} {periodComboBox} {checkBox} {retrieveButton} {fixButton} {cancleButton} {deleteButton} {excelDownloadButton}
- 입력·하위 화면: `periodComboBox` ComboBoxField("MonthsCode"), `checkBox` CheckBox, `yyyyText` TextField, `lookup` Ics31_Edit_Reason

#### 이벤트
[E0] 화면 열림 (생성자 L82-110) → settings()
[E1] yyyyText.ValueChange (L137) → 인라인 L137-143 (new ValueChangeHandler<String>() { @O…)
[E2] periodComboBox[MonthsCode].ValueChange (L147) → 인라인 L147-153 (new ValueChangeHandler<String>() { @O…)
[E3] retrieveButton[조회].Select (L158) → retrieve()
[E4] fixButton[제출].Select (L164) → fixChk()
[E5] cancleButton[제출취소].Select (L170) → fixChk()
[E6] deleteButton[새로작성].Select (L176) → preDelete()
       └ [E9] msgBox.DialogHide [YES] (L517) → delete()
[E7] excelDownloadButton[엑셀다운로드].Select (L182) → getDate(), downLoad()
[E8] grid.getStore().StoreRecordChange [chkModel.getConfirmYn()] (L214) → getDate()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| protected enable() | L300-348 | settings | 상태 처리 | 업무 |
| public retrieve() | L431-454 | E3,fixChk,preFixCheck,delete | 서비스 ics.Ics30_Compliance.selectByPersonId(companyId, personId, stdDate, searchText, checkBox, cycleType) | 업무 |
| private fixChk() | L456-506 | E4,E5 | 서비스 ics.Ics31_ComplianceWrite.updateFixYn(fixYn) | 업무 |
| private preFixCheck() | L508-512 | fixChk | 상태 처리 | 업무 |
| private preDelete() | L514-532 | E6 | ConfirmBox → E9 | 업무 |
| private delete() | L534-554 | E9 | 서비스 ics.Ics31_ComplianceWrite.deleteByPersonId(companyId, personId, stdDate, cycleType) | 업무 |
| private downLoad() | L556-607 | E7 | 서비스 sys.Sys99_Print.insertRdComplianceWrite(companyId, personId, windowClassName, stdDate, searchText, checkBox, cycleType) | 업무 |
| private getDate() | L609-630 | E7,E8,buildGrid,retrieve,delete,downLoad | 상태 처리 | 업무 |
| private settings() | L112-298 | 생성자 | 서비스 sys.Sys01_Company.selectById, ics.Ics30_Compliance.selectByPersonId, ics.Ics31_ComplianceWrite.updateAnswerCode(companyId, companyId, personId, stdDate, searchText, checkBox, cycleType, complianceId, companyId, personId, answerCode, yyyymm, cycleType), 이벤트 연결, 초기값: yyyyText=startYear, checkBox=false("미체크 보기") | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L350-429 | 필드 초기화 | 팝업 Ics31_Edit_Reason 열기, 미선택 시 alert "담당자가 확인처리한 체크리스트로 수정이 불가능합니다", 서비스 ics.Ics31_ComplianceWrite.modelUpdate, ics.Ics31_ComplianceWrite.selectById(complianceWriteId), 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| public setHtmlGridStyle() | L632-635 | buildGrid | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L637-639 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L641-643 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={fixChk}>제출</Button>
3. <Button type="cancel" onClick={fixChk}>제출취소</Button>
4. <Button type="view" onClick={preDelete}>새로작성</Button>
5. <Button type="download" onClick={() => /* getDate(), downLoad() */}>엑셀다운로드</Button>

### Ics31_Edit_Reason (`client/vi/ics/Ics31_Edit_Reason.java`, 106줄)

- 입력·하위 화면: `reason` MyTextArea

#### 이벤트
[E0] 화면 열림 (생성자 L50-70) → settings(), show()
[E1] updateButton[저장].Select (L73) → update()
[E2] closeButton[닫기].Select (L79) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public edit() | L40-48 | 공개 메서드 | 상태 처리 | 업무 |
| private update() | L87-101 | E1 | 서비스 ics.Ics31_ComplianceWrite.modelUpdate | 업무 |
| private settings() | L72-85 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlHeaderStyle() | L103-105 | edit | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

