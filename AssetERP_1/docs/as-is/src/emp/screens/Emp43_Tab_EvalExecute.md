# Emp43_Tab_EvalExecute

- 종류: 화면
- 메뉴: 경영관리 > 05. 인사평가 > 인사평가수행(평가자) (#1393)
- 파일: `client/vi/emp/Emp43_Tab_EvalExecute.java`
- 함께 쓰는 클래스 1개:
  - `Emp44_Lookup_Write` `client/vi/emp/Emp44_Lookup_Write.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `emp.Emp42_EvalGrade.selectByEvalListStdId` | Emp44_Lookup_Write:180 | [`Emp42_EvalGrade.java:24`](../../emp/services/Emp42_EvalGrade.md) | [`emp42_eval_grade.selectByEvalListStdId`](../../emp/sql/emp42_eval_grade.md) |
| `emp.Emp43_EvalTarget.getWrite` | Emp44_Lookup_Write:431 | [`Emp43_EvalTarget.java:56`](../../emp/services/Emp43_EvalTarget.md) | [`emp43_eval_target.getWrite`](../../emp/sql/emp43_eval_target.md) |
| `emp.Emp43_EvalTarget.selectByText` | Emp43_Tab_EvalExecute:200 | [`Emp43_EvalTarget.java:38`](../../emp/services/Emp43_EvalTarget.md) | [`emp43_eval_target.selectByText`](../../emp/sql/emp43_eval_target.md) |
| `emp.Emp43_EvalTarget.updateEndYn` | Emp44_Lookup_Write:401 | [`Emp43_EvalTarget.java:78`](../../emp/services/Emp43_EvalTarget.md) | [`emp43_eval_target.updateEndYn`](../../emp/sql/emp43_eval_target.md) |
| `emp.Emp43_EvalTarget.updateReason` | Emp44_Lookup_Write:342 | [`Emp43_EvalTarget.java:68`](../../emp/services/Emp43_EvalTarget.md) | [`emp43_eval_target.updateReason`](../../emp/sql/emp43_eval_target.md) |
| `emp.Emp44_EvalWrite.getEmpEvalGrade` | Emp44_Lookup_Write:318 | [`Emp44_EvalWrite.java:58`](../../emp/services/Emp44_EvalWrite.md) | [`emp44_eval_write.getEmpEvalGrade`](../../emp/sql/emp44_eval_write.md) |
| `emp.Emp44_EvalWrite.getEvalTargetList` | Emp44_Lookup_Write:307 | [`Emp44_EvalWrite.java:52`](../../emp/services/Emp44_EvalWrite.md) | [`emp44_eval_write.getEvalTargetList`](../../emp/sql/emp44_eval_write.md) |
| `emp.Emp44_EvalWrite.updateEvalGradeId` | Emp44_Lookup_Write:268 | [`Emp44_EvalWrite.java:64`](../../emp/services/Emp44_EvalWrite.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`emp41_eval_list.selectById`](../../emp/sql/emp41_eval_list.md), [`emp42_eval_grade.selectById`](../../emp/sql/emp42_eval_grade.md), [`emp44_eval_write.checkEvalTarget`](../../emp/sql/emp44_eval_write.md), [`emp44_eval_write.updateEvalGradeId`](../../emp/sql/emp44_eval_write.md), `UpdateDataModel(emp44_eval_write)` 동적 INSERT/UPDATE → [`emp44_eval_write.selectById`](../../emp/sql/emp44_eval_write.md) |
| `emp.Emp45_EvalRelateAppr.selectByTermCode` | Emp44_Lookup_Write:357 | [`Emp45_EvalRelateAppr.java:25`](../../emp/services/Emp45_EvalRelateAppr.md) | [`emp45_eval_relate_appr.selectByTermCode`](../../emp/sql/emp45_eval_relate_appr.md) |
| `sys.Sys00_Common.selectByKindGroupCode` | Emp43_Tab_EvalExecute:133 | [`Sys00_Common.java:106`](../../sys/services/Sys00_Common.md) | [`sys09_code.selectByKindGroupCode`](../../sys/sql/sys09_code.md) |
| `sys.Sys00_Common.selectEvalGrade` | Emp44_Lookup_Write:154 | [`Sys00_Common.java:56`](../../sys/services/Sys00_Common.md) | [`sys09_code.selectEvalGrade`](../../sys/sql/sys09_code.md) |
| `sys.Sys01_Company.selectById` | Emp43_Tab_EvalExecute:101 | [`Sys01_Company.java:20`](../../sys/services/Sys01_Company.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys01_company.selectById`](../../sys/sql/sys01_company.md), [`sys01_company.updateMainImageId`](../../sys/sql/sys01_company.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp40_eval_list_std`](../../../db/tables/emp.md), [`emp41_eval_list`](../../../db/tables/emp.md), [`emp42_eval_grade`](../../../db/tables/emp.md), [`emp43_eval_target`](../../../db/tables/emp.md), [`emp44_eval_write`](../../../db/tables/emp.md), [`emp45_eval_relate_appr`](../../../db/tables/emp.md), [`sys01_company`](../../../db/tables/sys.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_emp_kor_nm`, `f_get_datediff`, `f_get_empevalgradeid`, `f_get_emptrans`, `f_sysdate`, `f_today`, `f_trunc`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Emp43_Tab_EvalExecute (`client/vi/emp/Emp43_Tab_EvalExecute.java`, 220줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 평가기간: {dataYearText} 년: {termComboBox} 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `dataYearText` TextField, `searchText` TextField 빈칸="조직/직위/성명", `termComboBox` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode"), `lookup` Emp44_Lookup_Write
- 그리드 `grid` (buildGrid()):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - orderEvalName 80 "평가구분" TextCenter
  - orgHeadName 80 "구분" TextCenter
  - posName 80 "직위" TextCenter
  - personName 120 "성명" TextCenter
  - orgName 180 "부서" Text
  - actionCell 100 "인사평가표" Cell 편집:actionCell
  - orderScore 80 "점수" TextCenter
  - orderGrade 80 "등급" TextCenter
  - orderStatus 100 "평가상태" TextCenter
  - orderReason 100 "평정사유" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L59-85) → settings(), retrieve()
[E1] dataYearText.ValueChange (L94) → retrieve()
[E2] termComboBox[sys.Sys00_Common.selectByKindGroupCode].Collapse (L143) → retrieve()
[E3] retrieveButton[조회].Select (L149) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieve() | L187-206 | 생성자,E1,E2,E3,buildGrid | 서비스 emp.Emp43_EvalTarget.selectByText(companyId, stdYear, searchText, personId, stdTermCode, stdTermCode) | 업무 |
| private settings() | L87-155 | 생성자 | 서비스 sys.Sys01_Company.selectById, sys.Sys00_Common.selectByKindGroupCode, 이벤트 연결, 초기값: dataYearText=startYear, dataYearText=DateTimeFormat.getFormat("yyyy" | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L157-185 | 필드 초기화 | 조회창 Emp44_Lookup_Write 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| public setHtmlGridStyle() | L208-211 | buildGrid | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L213-215 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L217-219 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L171 newHeaderGroupMap01newHeaderGroupConfig15 100 "인사평가 대상자" (emp03_new_header_group_map01new_header_group_config15 컬럼 없음)
  // ⚠DB없음 L172 newHeaderGroupMap06newHeaderGroupConfigsetHtmlGridStyle15 100 "인사평가결과" (emp03_new_header_group_map06new_header_group_configset_html_grid_style15 컬럼 없음)
  gb.textCenter('orderEvalNm', 80, '평가구분'),  // L173
  gb.textCenter('orgHeadNm', 80, '구분'),  // L174
  gb.textCenter('posNm', 80, '직위'),  // L175
  gb.textCenter('personNm', 120, '성명'),  // L176
  gb.text('orgNm', 180, '부서'),  // L177
  // ⚠ 대응 없음 (GridBuilder L178) addCell
  gb.textCenter('orderScore', 80, '점수'),  // L179
  gb.textCenter('orderGrade', 80, '등급'),  // L180
  gb.textCenter('orderStatus', 100, '평가상태'),  // L181
  gb.textCenter('orderReason', 100, '평정사유'),  // L182
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

### Emp44_Lookup_Write (`client/vi/emp/Emp44_Lookup_Write.java`, 465줄)

- 툴바 `buttonBar01`: {label01}
- 툴바 `buttonBar02`: {label02}
- 입력·하위 화면: `reason` MyTextArea, `evalGradeComboBox` CommonComboBoxField("sys.Sys00_Common.selectEvalGrade")
- 그리드 `grid` (buildGrid()):
  - evalClassName 100 "평가항목" TextCenter
  - content 550 "평가요소" TextArea
  - weightLeader 80 "가중치" LongCenter
  - weightMember 80 "가중치" LongCenter
  - evalGrade 80 "평가등급" TextCenter 편집:evalGradeComboBox
  - evalGradeScore 80 "환산점수" DoubleCenter

#### 이벤트
[E1] updateButton[저장].Select (L204) → updateReason()
[E2] excuteConfirmButton[평가완료].Select [(boolean)result] (L214) → eventChk(), updateEndYn()
[E3] excuteCancleButton[평가취소].Select [(boolean)result] (L231) → eventChk(), updateEndYn()
[E4] closeButton[닫기].Select (L248) → hide()
[E5] evalGradeComboBox[sys.Sys00_Common.selectEvalGrade].Collapse (L262) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L71-147 | 공개 메서드 | 상태 처리 | 업무 |
| private retrieve() | L300-315 | E5,open | 서비스 emp.Emp44_EvalWrite.getEvalTargetList(evalListStdId, evalTargetId, personId) | 업무 |
| private getEvalGrade() | L317-339 | retrieve | 서비스 emp.Emp44_EvalWrite.getEmpEvalGrade(evalListStdId, evalTargetId, personId) | 업무 |
| private updateReason() | L341-354 | E1,updateEndYn | 서비스 emp.Emp43_EvalTarget.updateReason(evalTargetId, reason, orderEvalName) | 업무 |
| private eventChk() | L356-380 | E2,E3 | 서비스 emp.Emp45_EvalRelateAppr.selectByTermCode(companyId, stdYear, stdTermCode) | 업무 |
| private updateEndYn() | L382-428 | E2,E3 | 서비스 emp.Emp43_EvalTarget.updateEndYn(personId, evalTargetId, endYn, orderEvalName) | 업무 |
| private refresh() | L430-444 | updateEndYn | 서비스 emp.Emp43_EvalTarget.getWrite(evalTargetId, personId) | 업무 |
| private enableComboBox() | L446-452 | retrieve,refresh | 상태 처리 | 업무 |
| private settings() | L149-255 | open | 서비스 sys.Sys00_Common.selectEvalGrade, emp.Emp42_EvalGrade.selectByEvalListStdId(evalListStdId), 이벤트 연결, 초기값: reason=this.evalTargetModel.getFirstEvalReason(, reason=this.evalTargetModel.getSecondEvalReason( | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L257-298 | 필드 초기화 | 서비스 sys.Sys00_Common.selectEvalGrade, emp.Emp44_EvalWrite.updateEvalGradeId(companyId, personId, evalTargetId, evalListId, evalGradeId, orgHeadYn, orgHeadYn), 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlStyle() | L454-456 | open,settings,getEvalGrade,필드 초기화 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L458-460 | open,settings,getEvalGrade,필드 초기화 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L462-464 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('evalClassNm', 100, '평가항목'),  // L290
  gb.textArea('content', 550, '평가요소'),  // L291
  gb.longCenter('weightLeader', 80, '가중치'),  // L292
  gb.longCenter('weightMember', 80, '가중치'),  // L293
  gb.textCenter('evalGrade', 80, '평가등급', { editor: 'select' }),  // L294
  gb.doubleCenter('evalGradeScore', 80, '환산점수'),  // L295
];
```

#### 사용된 버튼들
1. <Button type="save" onClick={updateReason}>저장</Button>
2. <Button type="unknown" onClick={() => /* eventChk(), updateEndYn() */}>평가완료</Button>
3. <Button type="cancel" onClick={() => /* eventChk(), updateEndYn() */}>평가취소</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

