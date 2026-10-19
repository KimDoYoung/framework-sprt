# Emp15_Tab_Cert

- 종류: 화면
- 메뉴: 경영관리 > 01. 조직 및 사원관리 > 증명서 발급 (#1115)
- 파일: `client/vi/emp/Emp15_Tab_Cert.java`
- 함께 쓰는 클래스 3개:
  - `Emp15_Lookup_StampDocCert` `client/vi/emp/Emp15_Lookup_StampDocCert.java`
  - `Emp15_Lookup_GetCert` `client/vi/emp/Emp15_Lookup_GetCert.java`
  - `Emp15_Lookup_Cert` `client/vi/emp/Emp15_Lookup_Cert.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Dcr01_Lookup_Class`](../../dcr/components/Dcr01_Lookup_Class.md), [`Dcr10_Lookup_MailSender`](../../dcr/components/Dcr10_Lookup_MailSender.md), [`Dcr30_Lookup_Link`](../../dcr/components/Dcr30_Lookup_Link.md), [`Dcr30_Move_DcrClass`](../../dcr/components/Dcr30_Move_DcrClass.md), [`Emp00_Lookup_SelectSingle`](../../emp/components/Emp00_Lookup_SelectSingle.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectById` | Emp15_Tab_Cert:308 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `bbs.Bbs11_Application.selectByAppStatus` | Emp15_Lookup_GetCert:118, Emp15_Tab_Cert:397 | [`Bbs11_Application.java:50`](../../bbs/services/Bbs11_Application.md) | [`bbs11_application.selectByAppStatus`](../../bbs/sql/bbs11_application.md) |
| `bbs.Bbs11_Application.updateAppStatus` | Emp15_Lookup_StampDocCert:394 | [`Bbs11_Application.java:72`](../../bbs/services/Bbs11_Application.md) | [`bbs11_application.updateAppStatus`](../../bbs/sql/bbs11_application.md) |
| `dcr.Dcr30_Link.selectByLinkCode` | Emp15_Lookup_Cert:275, Emp15_Lookup_StampDocCert:355, Emp15_Tab_Cert:334 | [`Dcr30_Link.java:46`](../../dcr/services/Dcr30_Link.md) | [`dcr01_class_tree.selectByLinkCode`](../../dcr/sql/dcr01_class_tree.md) |
| `emp.Emp15_Cert.delete` | Emp15_Tab_Cert:246 | [`Emp15_Cert.java:67`](../../emp/services/Emp15_Cert.md) | `UpdateDataModel(emp15_cert)` 동적 DELETE |
| `emp.Emp15_Cert.modelUpdate` | Emp15_Lookup_Cert:226, Emp15_Lookup_StampDocCert:306 | [`Emp15_Cert.java:40`](../../emp/services/Emp15_Cert.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(emp15_cert)` 동적 INSERT/UPDATE → [`emp15_cert.selectById`](../../emp/sql/emp15_cert.md) |
| `emp.Emp15_Cert.selectByCompanyId` | Emp15_Tab_Cert:222 | [`Emp15_Cert.java:29`](../../emp/services/Emp15_Cert.md) | [`emp15_cert.selectByCompanyId`](../../emp/sql/emp15_cert.md) |
| `emp.Emp15_Cert.update` | Emp15_Tab_Cert:378 | [`Emp15_Cert.java:62`](../../emp/services/Emp15_Cert.md) | `UpdateDataModel(emp15_cert)` 동적 INSERT/UPDATE → [`emp15_cert.selectById`](../../emp/sql/emp15_cert.md) |
| `emp.Emp15_Cert.updateApprId` | Emp15_Lookup_Cert:300, Emp15_Lookup_StampDocCert:380 | [`Emp15_Cert.java:53`](../../emp/services/Emp15_Cert.md) | [`emp15_cert.updateApprId`](../../emp/sql/emp15_cert.md) |
| `sys.Sys00_Common.selectByKindGroupCode` | Emp15_Lookup_Cert:106, Emp15_Lookup_StampDocCert:162 | [`Sys00_Common.java:106`](../../sys/services/Sys00_Common.md) | [`sys09_code.selectByKindGroupCode`](../../sys/sql/sys09_code.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`bbs11_application`](../../../db/tables/bbs.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp11_reward`](../../../db/tables/emp.md), [`emp15_cert`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys01_company`](../../../db/tables/sys.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_get_dcr_no`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`, `f_today`, `f_trunc`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Emp15_Tab_Cert (`client/vi/emp/Emp15_Tab_Cert.java`, 483줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 조회기간: {startDate} ~: {closeDate} {retrieveButton} {insertButton} {deleteButton} {dcrLinkButton} {msgHlc}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `lookup` Dcr30_Lookup_Link, `popup` Emp15_Lookup_StampDocCert, `mailSender` Dcr10_Lookup_MailSender, `editor` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid(), 체크박스):
  - issueDate 100 "발급신청일" Date
  - linkName 120 "증명서종류" Text
  - personNo 80 "사원번호" TextCenter
  - personName 100 "사원명" TextCenter
  - certUseName 400 "용도" Text
  - stampSeqText 250 "발급번호" TextCenter
  - apprStatusName 80 "결재상태" TextColor
  - actionCell 100 "결재요청" Cell 편집:actionCell
  - actionCell 80 "메일보내기" Cell 편집:sendMailCell

#### 이벤트
[E0] 화면 열림 (생성자 L82-85) → init(), retrieve()
[E1] retrieveButton[조회].Select (L119) → retrieve()
[E2] insertButton[생성].Select (L125) → insertCert()
[E3] deleteButton[삭제].Select (L131) → deleteRow()
       └ [E6] messageBox.DialogHide [YES] (L240) → 서비스 emp.Emp15_Cert.delete
[E4] dcrLinkButton[문서분류지정].Select (L138) → 인라인 L138-149 (new SelectHandler() { @Override publi…)
[E5] hiperLink[<b><span style='color:#0078D7;font-size:14px;text-decoration:underline;'>신청내역 가져오기</span></b>].Click (L151) → retrieve()
[E7] msgBox.DialogHide [YES] (L284) → checkDcr(), apprView()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public init() | L87-182 | 생성자 | 조회창 Dcr30_Lookup_Link 열기, 조회창 Emp15_Lookup_GetCert 열기, 조회창 Emp15_Lookup_StampDocCert 열기 | 업무 |
| private retrieve() | L214-228 | 생성자,E1,E5,insertCert,apprView,updateApprId | 서비스 emp.Emp15_Cert.selectByCompanyId(companyId, startDate, closeDate) | 업무 |
| private deleteRow() | L230-253 | E3 | ConfirmBox → E6 | 업무 |
| public insertCert() | L255-263 | E2 | 조회창 Emp15_Lookup_Cert 열기 | 업무 |
| private sendMail() | L265-273 | buildGrid | 조회창 Dcr10_Lookup_MailSender 열기 | 업무 |
| private checkAppr() | L275-305 | buildGrid | 확인창 표시 | 업무 |
| private apprView() | L307-327 | E7,checkAppr | 팝업 Apr01_Edit_ApprDoc 열기, 서비스 apr.Apr01_Appr.selectById | 업무 |
| private checkDcr() | L329-357 | E7,checkAppr | 조회창 Dcr01_Lookup_Class 열기, 서비스 dcr.Dcr30_Link.selectByLinkCode | 업무 |
| private insertLinkApproval() | L359-370 | checkDcr | 팝업 Apr01_Edit_ApprDoc 열기 | 업무 |
| private updateApprId() | L373-390 | insertLinkApproval | 서비스 emp.Emp15_Cert.update | 업무 |
| private checkStampDoc() | L392-416 | retrieve | 서비스 bbs.Bbs11_Application.selectByAppStatus(companyId, appStatus) | 업무 |
| public createMapping() | L418-443 | checkDcr | 상태 처리 | 업무 |
| private checkStringNull() | L445-453 | createMapping | 상태 처리 | 업무 |
| private checkDate01Null() | L455-465 | createMapping | 상태 처리 | 업무 |
| private checkDate02Null() | L467-477 | createMapping | 상태 처리 | 업무 |
| public buildGrid() | L184-212 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L479-481 | init | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('issueDate', 100, '발급신청일'),  // L201
  gb.text('linkNm', 120, '증명서종류'),  // L202
  gb.textCenter('personNo', 80, '사원번호'),  // L203
  gb.textCenter('personNm', 100, '사원명'),  // L204
  gb.text('certUseNm', 400, '용도'),  // L205
  gb.textCenter('stampSeqText', 250, '발급번호'),  // L206
  // ⚠ 대응 없음 (GridBuilder L207) addTextColor
  // ⚠ 대응 없음 (GridBuilder L208) addCell
  // ⚠ 대응 없음 (GridBuilder L209) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="generate" onClick={insertCert}>생성</Button>
3. <Button type="delete" onClick={deleteRow}>삭제</Button>
4. <Button type="save" onClick={() => /* 인라인 L138-149 (new SelectHandler() { @Override publi…) */}>문서분류지정</Button>

### Emp15_Lookup_StampDocCert (`client/vi/emp/Emp15_Lookup_StampDocCert.java`, 503줄)

- 레이아웃: west=layout, center=viewHtmlLayoutContainer
- 입력·하위 화면: `linkCode` TextField, `certUseCode` TextField, `certUse` TextField, `certUseName` ComboBoxField("CertUseCode") 빈칸="선택", `dcrClassTreeId` LongField, `personId` LongField, `dcrClassTreeName` LookupTriggerField 빈칸="선택", `personName` LookupTriggerField, `linkName` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode") 빈칸="선택", `editor` Apr01_Edit_ApprDoc, `lookupEmpTransInfo` Emp00_Lookup_SelectSingle

#### 이벤트
[E0] 화면 열림 (생성자 L151-181) → show()
[E1] updateButton[상신].Select (L164) → update()
[E2] closeButton[닫기].Select (L170) → hide()
[E3] linkName[증명서종류].Collapse (L185) → 인라인 L185-190 (new CollapseHandler() { @Override pub…)
[E4] linkName[증명서종류].ValueChange (L191) → searchDcr()
[E5] certUseName[용도].Collapse (L198) → 인라인 L198-203 (new CollapseHandler() { @Override pub…)
[E6] certUseName[용도].ValueChange (L204) → 인라인 L204-213 (new ValueChangeHandler<String>() { @O…)
[E7] personName[사원].TriggerClick (L216) → openLookupEmpInfo()
[E8] dcrClassTreeName[문서분류].TriggerClick (L224) → openLookupDoc()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public insert() | L98-149 | 공개 메서드 | 상태 처리 | 업무 |
| private getEditor() | L183-282 | insert | 상태 처리 | 업무 |
| public update() | L284-328 | E1 | 팝업 Apr01_Edit_ApprDoc 열기, 서비스 emp.Emp15_Cert.modelUpdate | 업무 |
| private openLookupEmpInfo() | L330-340 | E7 | 조회창 Emp00_Lookup_SelectSingle 열기 | 업무 |
| private openLookupDoc() | L342-352 | E8 | 상태 처리 | 업무 |
| private searchDcr() | L354-377 | E4,insert | 서비스 dcr.Dcr30_Link.selectByLinkCode | 업무 |
| private updateApprId() | L379-391 | update | 서비스 emp.Emp15_Cert.updateApprId | 업무 |
| private updateApplication() | L393-405 | updateApprId | 서비스 bbs.Bbs11_Application.updateAppStatus | 업무 |
| public createMapping() | L407-432 | update | 상태 처리 | 업무 |
| private checkStringNull() | L434-442 | createMapping | 상태 처리 | 업무 |
| private checkDate01Null() | L444-454 | createMapping | 상태 처리 | 업무 |
| private checkDate02Null() | L456-466 | createMapping | 상태 처리 | 업무 |
| private setHtmlStyle() | L495-497 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L499-501 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="register" onClick={update}>상신</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Emp15_Lookup_GetCert (`client/vi/emp/Emp15_Lookup_GetCert.java`, 134줄)

- 툴바 `buttonBar`: {retrieveButton}
- 그리드 `grid` (buildGrid(), 체크박스):
  - appDate 90 "신청일" Date
  - appEmpName 80 "신청자" TextCenter
  - appTypeName 130 "신청구분" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L49-70) → settings()
[E1] retrieveButton[조회].Select (L73) → retrieve()
[E2] updateButton[확인].Select (L79) → update()
[E3] cancleButton[닫기].Select (L85) → hide()
[E4] grid.CellDoubleClick (L92) → update()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L42-47 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L111-124 | E1,open | 서비스 bbs.Bbs11_Application.selectByAppStatus(companyId, appStatus) | 업무 |
| public update() | L126-129 | E2,E4 | 상태 처리 | 업무 |
| private settings() | L72-98 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L100-109 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L131-133 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('appDate', 90, '신청일'),  // L104
  gb.textCenter('appEmpNm', 80, '신청자'),  // L105 SQL 계산 컬럼(selectByAppStatus: f_emp_kor_nm(bbs11_app_emp_id))
  gb.textCenter('appTypeNm', 130, '신청구분'),  // L106 SQL 계산 컬럼(selectByAppStatus: f_cdnm('ApplicationType', bbs11_app_typ…)
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>확인</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

### Emp15_Lookup_Cert (`client/vi/emp/Emp15_Lookup_Cert.java`, 383줄)

- 입력·하위 화면: `linkCode` TextField, `certUseCode` TextField, `certUse` TextField, `certUseName` ComboBoxField("CertUseCode") 빈칸="선택", `dcrClassTreeId` LongField, `personId` LongField, `dcrClassTreeName` LookupTriggerField 빈칸="선택", `personName` LookupTriggerField, `linkName` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode") 빈칸="선택", `editor` Apr01_Edit_ApprDoc, `lookupEmpTransInfo` Emp00_Lookup_SelectSingle

#### 이벤트
[E0] 화면 열림 (생성자 L95-125) → show()
[E1] updateButton[상신].Select (L108) → update()
[E2] closeButton[닫기].Select (L114) → hide()
[E3] linkName[증명서종류].Collapse (L129) → 인라인 L129-134 (new CollapseHandler() { @Override pub…)
[E4] linkName[증명서종류].ValueChange (L135) → searchDcr()
[E5] certUseName[용도].Collapse (L142) → 인라인 L142-147 (new CollapseHandler() { @Override pub…)
[E6] certUseName[용도].ValueChange (L148) → 인라인 L148-157 (new ValueChangeHandler<String>() { @O…)
[E7] personName[사원].TriggerClick (L160) → openLookupEmpInfo()
[E8] dcrClassTreeName[문서분류].TriggerClick (L168) → openLookupDoc()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public insert() | L81-93 | 공개 메서드 | 상태 처리 | 업무 |
| private getEditor() | L127-202 | insert | 상태 처리 | 업무 |
| public update() | L204-248 | E1 | 팝업 Apr01_Edit_ApprDoc 열기, 서비스 emp.Emp15_Cert.modelUpdate | 업무 |
| private openLookupEmpInfo() | L250-260 | E7 | 조회창 Emp00_Lookup_SelectSingle 열기 | 업무 |
| private openLookupDoc() | L262-272 | E8 | 상태 처리 | 업무 |
| private searchDcr() | L274-297 | E4 | 서비스 dcr.Dcr30_Link.selectByLinkCode | 업무 |
| private updateApprId() | L299-312 | update | 서비스 emp.Emp15_Cert.updateApprId | 업무 |
| public createMapping() | L314-339 | update | 상태 처리 | 업무 |
| private checkStringNull() | L341-349 | createMapping | 상태 처리 | 업무 |
| private checkDate01Null() | L351-361 | createMapping | 상태 처리 | 업무 |
| private checkDate02Null() | L363-373 | createMapping | 상태 처리 | 업무 |
| private setHtmlStyle() | L375-377 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L379-381 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="register" onClick={update}>상신</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

