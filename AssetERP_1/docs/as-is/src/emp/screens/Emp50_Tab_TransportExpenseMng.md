# Emp50_Tab_TransportExpenseMng

- 종류: 화면
- 메뉴: 자금관리 > 20. 사업비관리 > 여비교통비 관리 (#1348)
- 파일: `client/vi/emp/Emp50_Tab_TransportExpenseMng.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Dcr30_Move_DcrClass`](../../dcr/components/Dcr30_Move_DcrClass.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `act.Act13_RealAccountMap.getAccountName` | Emp50_Tab_TransportExpenseMng:601 | [`Act13_RealAccountMap.java:37`](../../act/services/Act13_RealAccountMap.md) | [`act13_real_account_map.getAccountName`](../../act/sql/act13_real_account_map.md) |
| `apr.Apr01_Appr.selectById` | Emp50_Tab_TransportExpenseMng:164, Emp50_Tab_TransportExpenseMng:253, Emp50_Tab_TransportExpenseMng:426 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `dcr.Dcr30_Link.selectByLinkCode` | Emp50_Tab_TransportExpenseMng:368 | [`Dcr30_Link.java:46`](../../dcr/services/Dcr30_Link.md) | [`dcr01_class_tree.selectByLinkCode`](../../dcr/sql/dcr01_class_tree.md) |
| `emp.Emp51_RelateAppr.selectByCompanyId` | Emp50_Tab_TransportExpenseMng:295 | [`Emp51_RelateAppr.java:42`](../../emp/services/Emp51_RelateAppr.md) | [`emp51_relate_appr.selectByCompanyId`](../../emp/sql/emp51_relate_appr.md) |
| `emp.Emp51_RelateAppr.updateCloseYn` | Emp50_Tab_TransportExpenseMng:533 | [`Emp51_RelateAppr.java:130`](../../emp/services/Emp51_RelateAppr.md) | [`emp51_relate_appr.updateCloseYn`](../../emp/sql/emp51_relate_appr.md) |
| `emp.Emp52_RelateAppr.insert` | Emp50_Tab_TransportExpenseMng:450 | [`Emp52_RelateAppr.java:53`](../../emp/services/Emp52_RelateAppr.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`emp52_relate_appr.deleteByApprId`](../../emp/sql/emp52_relate_appr.md), [`emp52_relate_appr.insert`](../../emp/sql/emp52_relate_appr.md), [`emp52_relate_appr.selectByCompanyId`](../../emp/sql/emp52_relate_appr.md) |
| `emp.Emp52_RelateAppr.selectApprId` | Emp50_Tab_TransportExpenseMng:416 | [`Emp52_RelateAppr.java:39`](../../emp/services/Emp52_RelateAppr.md) | [`emp52_relate_appr.selectByCompanyId`](../../emp/sql/emp52_relate_appr.md) |
| `emp.Emp52_RelateAppr.selectByCompanyId` | Emp50_Tab_TransportExpenseMng:307 | [`Emp52_RelateAppr.java:25`](../../emp/services/Emp52_RelateAppr.md) | [`emp52_relate_appr.selectByCompanyId`](../../emp/sql/emp52_relate_appr.md) |
| `emp.Emp52_RelateAppr.updateApprId` | Emp50_Tab_TransportExpenseMng:487 | [`Emp52_RelateAppr.java:86`](../../emp/services/Emp52_RelateAppr.md) | [`emp52_relate_appr.updateApprId`](../../emp/sql/emp52_relate_appr.md) |

## 테이블

[`act13_real_account_map`](../../../db/tables/act.md), [`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp51_relate_appr`](../../../db/tables/emp.md), [`emp52_relate_appr`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_get_account_nm`, `f_get_dcr_no`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Emp50_Tab_TransportExpenseMng (`client/vi/emp/Emp50_Tab_TransportExpenseMng.java`, 623줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 기준년월: {yyyyText} {periodComboBox} {retrieveButton} {closeButton} {closeCancelButton}
- 입력·하위 화면: `periodComboBox` ComboBoxField("MonthsCode"), `yyyyText` TextField, `classTreeFullName` LookupTriggerField 빈칸="문서분류가 미지정 상태입니다. 관리자에게 문의해주세요", `apprStepCode` TextField, `apprStepName` TextField, `editor` Apr01_Edit_ApprDoc, `apprDoc` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid()):
  - closeName 80 "마감여부" TextCenter
  - regDate 100 "신청일" Date
  - regNo 80 "신청번호" TextCenter
  - orgName 100 "부서" TextCenter
  - posName 100 "직위" TextCenter
  - personName 100 "성명" TextCenter
  - apprTitle 300 "문서명" Text
  - regAmt 120 "금액" Long
  - statusName 100 "결재상태" TextCenter
  - actionCell 80 "문서보기" Cell 편집:viewCell

#### 이벤트
[E0] 화면 열림 (생성자 L90-239) → retrieve(), defaultName(), setAccountName()
[E1] yyyyText.ValueChange (L101) → retrieve()
[E2] periodComboBox[MonthsCode].Collapse (L112) → retrieve()
[E3] yyyyText.KeyPress [Enter] (L131) → retrieve()
[E4] periodComboBox[MonthsCode].ValueChange (L140) → retrieve()
[E5] retrieveButton[조회].Select (L147) → retrieve()
[E6] apprButton[상신].Select (L154) → insertLinkApproval()
[E7] apprViewButton[문서보기].Select (L161) → apprChk()
[E8] closeButton[마감].Select (L187) → closeYn()
[E9] closeCancelButton[취소].Select (L194) → closeYn()
[E10] classTreeFullName[문서분류].TriggerClick (L201) → openLookupDoc()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L290-303 | 생성자,E1,E2,E3,E4,E5,insertLinkApproval,updateApprId,closeYn | 서비스 emp.Emp51_RelateAppr.selectByCompanyId(yyyymm, companyId) | 업무 |
| private apprChk() | L305-353 | E7,retrieve | 서비스 emp.Emp52_RelateAppr.selectByCompanyId | 업무 |
| private openLookupDoc() | L356-365 | E10 | 상태 처리 | 업무 |
| private defaultName() | L367-386 | 생성자 | 서비스 dcr.Dcr30_Link.selectByLinkCode | 업무 |
| private insertLinkApproval() | L388-483 | E6 | 팝업 Apr01_Edit_ApprDoc 열기, 서비스 emp.Emp52_RelateAppr.selectApprId, apr.Apr01_Appr.selectById, emp.Emp52_RelateAppr.insert | 업무 |
| private updateApprId() | L486-498 | insertLinkApproval | 서비스 emp.Emp52_RelateAppr.updateApprId(relateApprId, apprId) | 업무 |
| private closeYn() | L500-551 | E8,E9 | 서비스 emp.Emp51_RelateAppr.updateCloseYn | 업무 |
| private getGridList() | L553-559 | insertLinkApproval | 상태 처리 | 업무 |
| private getYYYYMM() | L561-576 | retrieve,apprChk,insertLinkApproval,closeYn,getStdDate,getCloseDate | 상태 처리 | 업무 |
| private getStdDate() | L578-582 | insertLinkApproval | 서비스 yyyy.MM.dd | 업무 |
| private getCloseDate() | L584-590 | insertLinkApproval | 서비스 yyyy.MM.dd | 업무 |
| private getTotalRegAmt() | L592-598 | insertLinkApproval | 상태 처리 | 업무 |
| private setAccountName() | L600-613 | 생성자 | 서비스 act.Act13_RealAccountMap.getAccountName(companyId, reprAccountCode, accountMap) | 업무 |
| public buildGrid() | L241-288 | 필드 초기화 | 팝업 Apr01_Edit_ApprDoc 열기, 미선택 시 alert "해당 문서가 없습니다. 결재상태를 확인해주세요.", 서비스 apr.Apr01_Appr.selectById, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L615-617 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L619-621 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('closeNm', 80, '마감여부'),  // L276 SQL 계산 컬럼(selectById: CASE WHEN COALESCE(emp51_close_yn, 'fal…)
  gb.date('regDate', 100, '신청일'),  // L277
  gb.textCenter('regNo', 80, '신청번호'),  // L278
  gb.textCenter('orgNm', 100, '부서'),  // L279 SQL 계산 컬럼(selectById: f_get_empTrans(emp51_person_id, emp51_r…)
  gb.textCenter('posNm', 100, '직위'),  // L280 SQL 계산 컬럼(selectById: f_get_empTrans(emp51_person_id, emp51_r…)
  gb.textCenter('personNm', 100, '성명'),  // L281 SQL 계산 컬럼(selectById: f_emp_kor_nm(emp51_person_id))
  gb.text('apprTitle', 300, '문서명'),  // L282 SQL 계산 컬럼(selectById: apr01_title)
  gb.long('regAmt', 120, '금액'),  // L283
  gb.textCenter('statusNm', 100, '결재상태'),  // L284 SQL 계산 컬럼(selectById: f_cdnm('AprStatusCode', apr01_status_cd…)
  // ⚠ 대응 없음 (GridBuilder L285) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={closeYn}>마감</Button>
3. <Button type="cancel" onClick={closeYn}>취소</Button>
4. <Button type="register" onClick={insertLinkApproval}>상신</Button>
5. <Button type="search" onClick={apprChk}>문서보기</Button>

