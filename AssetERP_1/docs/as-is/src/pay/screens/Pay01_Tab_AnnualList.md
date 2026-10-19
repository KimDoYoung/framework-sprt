# Pay01_Tab_AnnualList

- 종류: 화면
- 메뉴: 경영관리 > 03. 연봉관리 > 연봉계약현황 (#1082)
- 파일: `client/vi/pay/Pay01_Tab_AnnualList.java`
- 함께 쓰는 클래스 1개:
  - `Pay01_Lookup_Rd_AnnualList` `client/vi/pay/Pay01_Lookup_Rd_AnnualList.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Emp00_Lookup_SelectSingle`](../../emp/components/Emp00_Lookup_SelectSingle.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectById` | Pay01_Tab_AnnualList:264 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `emp.Emp00_TransInfo.selectByText` | Pay01_Tab_AnnualList:160 | [`Emp00_TransInfo.java:33`](../../emp/services/Emp00_TransInfo.md) | [`emp00_trans_info.selectByText`](../../emp/sql/emp00_trans_info.md) |
| `pay.Pay01_Annual.selectByAll` | Pay01_Tab_AnnualList:345 | [`Pay01_Annual.java:24`](../../pay/services/Pay01_Annual.md) | [`pay01_annual.selectByAll`](../../pay/sql/pay01_annual.md) |
| `pay.Pay01_Annual.selectByPersonId` | Pay01_Tab_AnnualList:354 | [`Pay01_Annual.java:39`](../../pay/services/Pay01_Annual.md) | [`pay01_annual.selectByPersonId`](../../pay/sql/pay01_annual.md) |
| `sys.Sys99_Print.insertRdAnnualList` | Pay01_Tab_AnnualList:219 | [`Sys99_Print.java:2306`](../../sys/services/Sys99_Print.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`pay01_annual.selectByPersonId`](../../pay/sql/pay01_annual.md), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |
| `sys.Sys99_Print.insertRdAnnualListAll` | Pay01_Tab_AnnualList:195 | [`Sys99_Print.java:2386`](../../sys/services/Sys99_Print.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`pay01_annual.selectByAll`](../../pay/sql/pay01_annual.md), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md), [`emp08_license`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`pay01_annual`](../../../db/tables/pay.md), [`sys01_company`](../../../db/tables/sys.md), [`sys04_role`](../../../db/tables/sys.md), [`sys05_user_role`](../../../db/tables/sys.md), [`sys06_menu`](../../../db/tables/sys.md), [`sys07_role_menu`](../../../db/tables/sys.md), [`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_get_dcr_no`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_org_parent_info_nm`, `f_sysdate`, `f_today`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Pay01_Tab_AnnualList (`client/vi/pay/Pay01_Tab_AnnualList.java`, 370줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 사원명: {personName} {radioHlc} {retireCheckBox} {retrieveButton} {downLoadButton}
- 입력·하위 화면: `personName` LookupTriggerField, `personId` LongField, `radio01` Radio, `radio02` Radio, `radio03` Radio, `yearText` TextField 빈칸="YYYY", `retireCheckBox` CheckBox, `lookupAnnualList` Pay01_Lookup_Rd_AnnualList, `editor` Apr01_Edit_ApprDoc, `lookupEmpTransInfo` Emp00_Lookup_SelectSingle
- 그리드 `grid` (buildGrid(), 행번호숨김):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - posName 80 "직급" TextFrozen 편집:"center"
  - personNo 50 "사번" TextFrozen 편집:"center"
  - personName 80 "성명" TextFrozen 편집:"center"
  - startDate 100 "적용시작일" Date
  - closeDate 100 "적용종료일" Date
  - startTime 80 "시업시간" TextCenter
  - closeTime 80 "종업시간" TextCenter
  - monthOtHours 80 "월연장<br>근로시간" LongCenter
  - annualPay 100 "기본연봉" Long 편집:"456EA6"
  - retirePay 100 "퇴직금" Long 편집:"456EA6"
  - yearPay 100 "총연봉" Long 편집:"456EA6"
  - etcAgreement 100 "기타약정사항" Text 편집:"456EA6"
  - basicPay 100 "기본급여" Long
  - mealPay 100 "중식대" Long
  - carMt 100 "차량유지비" Long
  - childcareAllowance 100 "양육수당" Long
  - overPay 100 "연장근로" Long
  - etc01Pay 100 "기타급여1" Long
  - etc02Pay 100 "기타급여2" Long
  - monthPay 100 "합계" Long
  - apprStatusName 100 "상신상태" Text
  - actionCell 60 "" Cell 편집:actionCell

#### 이벤트
[E0] 화면 열림 (생성자 L75-89) → settings()
[E1] toggleGroup.ValueChange (L106) → 인라인 L106-123 (new ValueChangeHandler<HasValue<Boole…)
[E2] personName.TriggerClick (L146) → openLookupPerson()
[E3] personName.ValueChange (L152) → retrieve(), openLookupPerson()
[E4] retrieveButton[조회].Select (L184) → retrieve()
[E5] downLoadButton[출력/다운로드].Select (L190) → 서비스 sys.Sys99_Print.insertRdAnnualListAll, sys.Sys99_Print.insertRdAnnualList(companyId, personId, windowClassName, radioOption, yearStr, retireYn, apprCheckYn, companyId, loginUserId, windowClassName, personId, radioOption, yearStr, retireYn, apprCheckYn)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public openLookupPerson() | L320-335 | E2,E3 | 조회창 Emp00_Lookup_SelectSingle 열기 | 업무 |
| public retrieve() | L337-356 | E3,E4 | 서비스 pay.Pay01_Annual.selectByAll, pay.Pay01_Annual.selectByPersonId(companyId, radioOption, yearStr, retireYn, apprCheckYn, companyId, personId, radioOption, yearStr, retireYn, apprCheckYn) | 업무 |
| private settings() | L91-247 | 생성자 | 조회창 Pay01_Lookup_Rd_AnnualList 열기 → 콜백: unmask, 서비스 emp.Emp00_TransInfo.selectByText, sys.Sys99_Print.insertRdAnnualListAll, sys.Sys99_Print.insertRdAnnualList(companyId, searchText, transDate, transCode, companyId, personId, windowClassName, radioOption, yearStr, retireYn, apprCheckYn, companyId, loginUserId, windowClassName, personId, radioOption, yearStr, retireYn, apprCheckYn), 이벤트 연결, 초기값: radio01=true("최근등록내역"), radio02=false("년도별"), radio03=false("전체"), retireCheckBox=false("퇴사자 포함"), personName=null, personId=null, personName=empTransInfoModel.getEmpPersonModel(, personId=empTransInfoModel.getPersonId( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L249-318 | 필드 초기화 | 팝업 Apr01_Edit_ApprDoc 열기, 미선택 시 alert "상신문서가 없습니다", 서비스 apr.Apr01_Appr.selectById, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlCheckBoxLabelStyle() | L358-360 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L362-364 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| public setHtmlGridStyle() | L366-369 | buildGrid | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L284 newHeaderGroupMap01newHeaderGroupConfig18 100 "기본정보" (pay01_new_header_group_map01new_header_group_config18 컬럼 없음)
  // ⚠DB없음 L285 newHeaderGroupMap09newHeaderGroupConfigsetHtmlGridStyle14 100 "연봉 구성" (pay01_new_header_group_map09new_header_group_configset_html_grid_style14 컬럼 없음)
  // ⚠DB없음 L286 newHeaderGroupMap013newHeaderGroupConfig17 100 "월급여 구성" (pay01_new_header_group_map013new_header_group_config17 컬럼 없음)
  // ⚠ 대응 없음 (GridBuilder L290) addTextFrozen
  // ⚠ 대응 없음 (GridBuilder L291) addTextFrozen
  // ⚠ 대응 없음 (GridBuilder L292) addTextFrozen
  gb.date('startDate', 100, '적용시작일'),  // L297
  gb.date('closeDate', 100, '적용종료일'),  // L298
  gb.textCenter('startTime', 80, '시업시간'),  // L299
  gb.textCenter('closeTime', 80, '종업시간'),  // L300
  gb.longCenter('monthOtHours', 80, '월연장<br>근로시간'),  // L301
  gb.long('annualPay', 100, '기본연봉'),  // L302
  gb.long('retirePay', 100, '퇴직금'),  // L303
  gb.long('yearPay', 100, '총연봉'),  // L304 SQL 계산 컬럼(selectByAll: COALESCE(pay01_annual_pay, 0) + COALESC…)
  gb.text('etcAgreement', 100, '기타약정사항'),  // L305
  gb.long('basicPay', 100, '기본급여'),  // L306
  gb.long('mealPay', 100, '중식대'),  // L307
  gb.long('carMt', 100, '차량유지비'),  // L308
  gb.long('childcareAllowance', 100, '양육수당'),  // L309
  gb.long('overPay', 100, '연장근로'),  // L310
  gb.long('etc01Pay', 100, '기타급여1'),  // L311
  gb.long('etc02Pay', 100, '기타급여2'),  // L312
  gb.long('monthPay', 100, '합계'),  // L313 SQL 계산 컬럼(selectByAll: COALESCE(pay01_basic_pay,0) + COALESCE(…)
  gb.text('apprStatusNm', 100, '상신상태'),  // L314 SQL 계산 컬럼(selectByAll: f_cdnm('AprStatusCode', apr01_status_cd…)
  // ⚠ 대응 없음 (GridBuilder L315) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="download" onClick={() => /* 서비스 sys.Sys99_Print.insertRdAnnualListAll, sys.Sys99_Print.insertRdAnnualList(companyId, personId, windowClassName, radioOption, yearStr, retireYn, apprCheckYn, companyId, loginUserId, windowClassName, personId, radioOption, yearStr, retireYn, apprCheckYn) */}>출력/다운로드</Button>

### Pay01_Lookup_Rd_AnnualList (`client/vi/pay/Pay01_Lookup_Rd_AnnualList.java`, 86줄)


#### 이벤트
[E0] 화면 열림 (생성자 L31-51) → show()
[E1] closeButton[닫기].Select (L40) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L53-80 | 공개 메서드 | 상태 처리 | 업무 |
| private setHtmlHeaderStyle() | L82-84 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>

