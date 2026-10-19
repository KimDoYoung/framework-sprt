# Bmt01_Tab_Buy

- 종류: 화면
- 메뉴: 준법감시 > 40. 이익제공(수령)현황 > 판촉물 구매 및 제공내역 (#1135)
- 파일: `client/vi/bmt/Bmt01_Tab_Buy.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Biz01_TabPage_List`](../../biz/components/Biz01_TabPage_List.md), [`Dcr01_Lookup_Class`](../../dcr/components/Dcr01_Lookup_Class.md), [`Emp00_Lookup_SelectSingle`](../../emp/components/Emp00_Lookup_SelectSingle.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectById` | Bmt01_Tab_Buy:266 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `bmt.Bmt01_Buy.delete` | Bmt01_Tab_Buy:432 | [`Bmt01_Buy.java:40`](../../bmt/services/Bmt01_Buy.md) | `UpdateDataModel(bmt01_buy)` 동적 DELETE |
| `bmt.Bmt01_Buy.selectByCompanyId` | Bmt01_Tab_Buy:391 | [`Bmt01_Buy.java:23`](../../bmt/services/Bmt01_Buy.md) | [`bmt01_buy.selectByCompanyId`](../../bmt/sql/bmt01_buy.md) |
| `bmt.Bmt01_Buy.update` | Bmt01_Tab_Buy:343 | [`Bmt01_Buy.java:35`](../../bmt/services/Bmt01_Buy.md) | `UpdateDataModel(bmt01_buy)` 동적 INSERT/UPDATE → [`bmt01_buy.selectById`](../../bmt/sql/bmt01_buy.md) |
| `dcr.Dcr30_Link.selectByLinkCode` | Bmt01_Tab_Buy:292 | [`Dcr30_Link.java:46`](../../dcr/services/Dcr30_Link.md) | [`dcr01_class_tree.selectByLinkCode`](../../dcr/sql/dcr01_class_tree.md) |
| `sys.Sys00_Common.selectByKindGroupCode` | Bmt01_Tab_Buy:187 | [`Sys00_Common.java:106`](../../sys/services/Sys00_Common.md) | [`sys09_code.selectByKindGroupCode`](../../sys/sql/sys09_code.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`biz01_promo`](../../../db/tables/biz.md), [`biz02_person`](../../../db/tables/biz.md), [`bmt01_buy`](../../../db/tables/bmt.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_get_dcr_no`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`, `f_trunc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Bmt01_Tab_Buy (`client/vi/bmt/Bmt01_Tab_Buy.java`, 486줄)

- 레이아웃: center=vlc, south=promoList
- 툴바 `buttonBar`: 조회기간: {startDate} ~: {closeDate} {checkBox} {retrieveButton} {insertButton} {updateButton} {deleteButton}
- 입력·하위 화면: `promoList` Biz01_TabPage_List, `startDate` MyDateField, `closeDate` MyDateField, `checkBox` CheckBox, `provideContentComboBox` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode"), `lookupEmpInfo` LookupTriggerField, `lookupEmpTransInfo` Emp00_Lookup_SelectSingle, `editor` Apr01_Edit_ApprDoc, `popup` Dcr01_Lookup_Class
- 그리드 `grid` (buildGrid()):
  - buyDate 100 "구매일자" Date 편집:MyDateField
  - provideContentName 200 "구매품목" TextCenter 편집:provideContentCombo…
  - buyQty 100 "구매수량" Long 편집:LongField
  - buyAmt 200 "구입금액" Long 편집:LongField
  - totalPeple 100 "인원" Long
  - averagePrice 200 "인당 경제적가치" Long
  - leftQty 100 "재고량" Long
  - personName 100 "담당자" TextCenter 편집:lookupEmpInfo
  - apprStatusName 100 "상신상태" TextCenter
  - actionCell 80 "결재요청" Cell 편집:actionCell

#### 이벤트
[E0] 화면 열림 (생성자 L90-126) → setting(), retrieve()
[E1] grid.SelectionChanged [선택>0] (L144) → retrieveTabpage()
[E2] retrieveButton[조회].Select (L152) → retrieve()
[E3] insertButton[등록].Select (L158) → insertRow()
[E4] updateButton[저장].Select (L164) → update()
[E5] deleteButton[삭제].Select (L170) → deleteRow()
       └ [E8] msgBox.DialogHide [YES] (L425) → 서비스 bmt.Bmt01_Buy.delete
[E6] provideContentComboBox[sys.Sys00_Common.selectByKindGroupCode].Collapse (L188) → 인라인 L188-194 (new CollapseHandler() { @Override pub…)
[E7] lookupEmpInfo.TriggerClick (L197) → openLookupEmpInfo()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setting() | L128-176 | 생성자 | 상태 처리 | 업무 |
| private openLookupEmpInfo() | L225-238 | E7 | 조회창 Emp00_Lookup_SelectSingle 열기 | 업무 |
| private updateCheck() | L240-258 | buildGrid | 미선택 시 alert "수정한 판촉물 구매내역을 저장 후 결재요청을 진행해주세요" | 업무 |
| private checkAppr() | L260-289 | updateCheck | 팝업 Apr01_Edit_ApprDoc 열기, 서비스 apr.Apr01_Appr.selectById | 업무 |
| private checkdcr() | L291-323 | checkAppr | 조회창 Dcr01_Lookup_Class 열기, 서비스 dcr.Dcr30_Link.selectByLinkCode | 업무 |
| private insertLinkApproval() | L325-336 | checkdcr | 팝업 Apr01_Edit_ApprDoc 열기 | 업무 |
| private updateApprId() | L338-355 | insertLinkApproval | 서비스 bmt.Bmt01_Buy.update | 업무 |
| private retrieveTabpage() | L357-380 | E1,retrieve | 상태 처리 | 업무 |
| public retrieve() | L382-400 | 생성자,E2,checkAppr,updateApprId,retrieveTabpage | 서비스 bmt.Bmt01_Buy.selectByCompanyId(companyId, personId, startDate, closeDate, leftYn) | 업무 |
| private insertRow() | L402-413 | E3 | 상태 처리 | 업무 |
| public deleteRow() | L415-443 | E5 | ConfirmBox → E8 | 업무 |
| public update() | L445-477 | E4 | 서비스 bmt.Bmt01_Buy.update | 업무 |
| public buildGrid() | L178-223 | 필드 초기화 | 서비스 sys.Sys00_Common.selectByKindGroupCode, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L479-481 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L483-485 | setting | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('buyDate', 100, '구매일자', { editor: 'date' }),  // L211
  gb.textCenter('provideContentNm', 200, '구매품목', { editor: 'select' }),  // L212
  gb.long('buyQty', 100, '구매수량', { editor: 'number' }),  // L213
  gb.long('buyAmt', 200, '구입금액', { editor: 'number' }),  // L214
  gb.long('totalPeple', 100, '인원'),  // L215
  gb.long('averagePrice', 200, '인당 경제적가치'),  // L216
  gb.long('leftQty', 100, '재고량'),  // L217
  gb.textCenter('personNm', 100, '담당자'),  // L218
  gb.textCenter('apprStatusNm', 100, '상신상태'),  // L219
  // ⚠ 대응 없음 (GridBuilder L220) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={deleteRow}>삭제</Button>

