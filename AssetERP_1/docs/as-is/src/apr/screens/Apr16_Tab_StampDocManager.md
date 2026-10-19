# Apr16_Tab_StampDocManager

- 종류: 화면
- 메뉴: 경영관리 > 91. 법인서류 > 법인서류 매수관리 (#1328)
- 파일: `client/vi/apr/Apr16_Tab_StampDocManager.java`
- 함께 쓰는 클래스 4개:
  - `Apr16_Lookup_StampReprCorp` `client/vi/apr/Apr16_Lookup_StampReprCorp.java`
  - `Apr16_Lookup_StampDocReg` `client/vi/apr/Apr16_Lookup_StampDocReg.java`
  - `Apr15_Lookup_ReprCorp` `client/vi/apr/Apr15_Lookup_ReprCorp.java`
  - `Apr16_Lookup_GetDocAppl` `client/vi/apr/Apr16_Lookup_GetDocAppl.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Apr05_Lookup_LoadDoc2`](../../apr/components/Apr05_Lookup_LoadDoc2.md), [`Apr10_Lookup_Stamp`](../../apr/components/Apr10_Lookup_Stamp.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr10_Stamp.selectCorpStampYn` | Apr16_Lookup_StampDocReg:438 | [`Apr10_Stamp.java:137`](../../apr/services/Apr10_Stamp.md) | [`apr10_stamp.selectCorpStampYn`](../../apr/sql/apr10_stamp.md) |
| `apr.Apr15_ReprCorp.selectByCompanyId` | Apr15_Lookup_ReprCorp:156 | [`Apr15_ReprCorp.java:23`](../../apr/services/Apr15_ReprCorp.md) | [`apr15_repr_corp.selectByCompanyId`](../../apr/sql/apr15_repr_corp.md) |
| `apr.Apr15_ReprCorp.selectCorpRegYn` | Apr16_Lookup_StampDocReg:457 | [`Apr15_ReprCorp.java:28`](../../apr/services/Apr15_ReprCorp.md) | [`apr15_repr_corp.selectCorpRegYn`](../../apr/sql/apr15_repr_corp.md) |
| `apr.Apr16_StampDoc.deleteReg` | Apr16_Tab_StampDocManager:439 | [`Apr16_StampDoc.java:125`](../../apr/services/Apr16_StampDoc.md) | [`apr16_stamp_doc.deleteById`](../../apr/sql/apr16_stamp_doc.md), [`apr16_stamp_doc.selectSimpleById`](../../apr/sql/apr16_stamp_doc.md), [`apr16_stamp_doc.updateRegDate`](../../apr/sql/apr16_stamp_doc.md) |
| `apr.Apr16_StampDoc.selectApplDocByRegDateIsNull` | Apr16_Lookup_GetDocAppl:133, Apr16_Tab_StampDocManager:375 | [`Apr16_StampDoc.java:36`](../../apr/services/Apr16_StampDoc.md) | [`apr16_stamp_doc.selectApplDocByRegDateIsNull`](../../apr/sql/apr16_stamp_doc.md) |
| `apr.Apr16_StampDoc.selectByApplType` | Apr16_Lookup_StampReprCorp:166 | [`Apr16_StampDoc.java:31`](../../apr/services/Apr16_StampDoc.md) | [`apr16_stamp_doc.selectByApplType`](../../apr/sql/apr16_stamp_doc.md) |
| `apr.Apr16_StampDoc.selectDocByRegDate` | Apr16_Tab_StampDocManager:365 | [`Apr16_StampDoc.java:41`](../../apr/services/Apr16_StampDoc.md) | [`apr16_stamp_doc.selectDocByRegDate`](../../apr/sql/apr16_stamp_doc.md) |
| `apr.Apr16_StampDoc.selectDocGroupSum` | Apr16_Tab_StampDocManager:472 | [`Apr16_StampDoc.java:46`](../../apr/services/Apr16_StampDoc.md) | [`apr16_stamp_doc.selectDocGroupSum`](../../apr/sql/apr16_stamp_doc.md) |
| `apr.Apr16_StampDoc.update` | Apr16_Lookup_StampDocReg:329, Apr16_Tab_StampDocManager:405 | [`Apr16_StampDoc.java:120`](../../apr/services/Apr16_StampDoc.md) | `UpdateDataModel(apr16_stamp_doc)` 동적 INSERT/UPDATE → [`apr16_stamp_doc.selectById`](../../apr/sql/apr16_stamp_doc.md) |
| `apr.Apr16_StampDoc.updateRegDate` | Apr16_Lookup_GetDocAppl:152 | [`Apr16_StampDoc.java:71`](../../apr/services/Apr16_StampDoc.md) | `UpdateDataModel(apr16_stamp_doc)` 동적 INSERT/UPDATE → [`apr16_stamp_doc.selectById`](../../apr/sql/apr16_stamp_doc.md) |
| `sys.Sys00_Common.selectByKindGroupCode` | Apr16_Lookup_StampDocReg:59, Apr16_Tab_StampDocManager:84 | [`Sys00_Common.java:106`](../../sys/services/Sys00_Common.md) | [`sys09_code.selectByKindGroupCode`](../../sys/sql/sys09_code.md) |
| `sys.Sys99_Print.insertRdStampDocManager` | Apr16_Tab_StampDocManager:254 | [`Sys99_Print.java:3126`](../../sys/services/Sys99_Print.md) | [`apr16_stamp_doc.selectDocByRegDate`](../../apr/sql/apr16_stamp_doc.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`apr15_repr_corp`](../../../db/tables/apr.md), [`apr16_stamp_doc`](../../../db/tables/apr.md), [`emp01_person`](../../../db/tables/emp.md), [`sys01_company`](../../../db/tables/sys.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md), [`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_today`, `f_trunc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Apr16_Tab_StampDocManager (`client/vi/apr/Apr16_Tab_StampDocManager.java`, 521줄)

- 레이아웃: north=northVlc, center=centerVlc
- 툴바 `buttonBar`: 등록일: {startDate} ~: {closeDate} 구분: {applTypeName} {stampReprCorpName} {retrieveButton} {insertButton} {updateButton} {deleteButton} {downLoadButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `stampReprCorpId` LongField, `stampReprCorpName` LookupTriggerField 빈칸="전체", `applTypeName` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode", "%", "전체", "전체"), `popup` Apr16_Lookup_StampReprCorp, `lookup` Apr16_Lookup_GetDocAppl, `editor` Apr01_Edit_ApprDoc
- 그리드 `totalGrid` (buildTotalGrid(), 행번호숨김):
  - applTypeName 150 "구분" TextCenter
  - stampReprCorpName 250 "인감 및 대표명의" Text
  - docIssueQty 100 "발급매수" LongCenter
  - docUseQty 100 "사용매수" LongCenter
  - docRemainQty 100 "잔여매수" LongCenter
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - actionCell 45 "수정" Cell 편집:modiCell
  - regDate 90 "등록일" Date
  - applTypeName 120 "구분" Text
  - stampReprCorpName 200 "인감 및 대표명의" Text
  - docIssueQty 70 "발급매수" LongCenter 편집:"0069B4"
  - docApplQty 70 "신청매수" LongCenter
  - docUseQty 70 "사용매수" LongCenter 편집:"CE4242"
  - provideCo 200 "제공처" Text
  - purpose 200 "목적" Text
  - requester 100 "요청자" Text
  - note 200 "비고" Text
  - applDate 90 "신청일" Date
  - applEmpName 100 "신청자" TextCenter
  - apprName 250 "문서명" Text
  - apprStatusName 70 "상태" TextStatus
  - apprStatusName 35 " " DynamicCell 편집:apprCell

#### 이벤트
[E0] 화면 열림 (생성자 L92-138) → settings(), retrieve()
[E1] applTypeName[sys.Sys00_Common.selectByKindGroupCode].Collapse (L150) → retrieve()
[E2] stampReprCorpName.TriggerClick (L162) → execute(), retrieve()
[E3] hiperLink[<font style='font-size:14px;'><b>※ 법인서류 신청내역이 존재합니다. <a href=# style=\"color:#0078D7;\">신청내역 가져오기</a></b></font>].Click (L210) → execute(), retrieve()
[E4] retrieveButton[조회].Select (L223) → retrieve()
[E5] insertButton[등록].Select (L229) → insert()
[E6] updateButton[저장].Select (L235) → update()
[E7] deleteButton[삭제].Select (L241) → deleteChk()
       └ [E9] messageBox.DialogHide (L421) → delete()
[E8] downLoadButton[출력/다운로드].Select [result.getStatus() == 1] (L248) → 서비스 sys.Sys99_Print.insertRdStampDocManager(companyId, personId, windowClassName, startDate, closeDate)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public execute() | L86-89 | E2,E3,buildGrid,retrieve,insert,update,retrieveTotal,lookupDetail,lookupAppr | 상태 처리 | 업무 |
| public buildTotalGrid() | L291-302 | 필드 초기화 | 상태 처리 | 업무 |
| private retrieve() | L345-372 | 생성자,E1,E2,E3,E4,execute,delete | 서비스 apr.Apr16_StampDoc.selectDocByRegDate(companyId, startDate, closeDate, applType, stampReprCorpId) | 업무 |
| private checkAppl() | L374-391 | retrieve | 서비스 apr.Apr16_StampDoc.selectApplDocByRegDateIsNull | 업무 |
| private insert() | L393-401 | E5 | 조회창 Apr16_Lookup_StampDocReg 열기 | 업무 |
| private update() | L403-412 | E6 | 서비스 apr.Apr16_StampDoc.update | 업무 |
| private deleteChk() | L414-431 | E7 | ConfirmBox → E9 | 업무 |
| private delete() | L433-455 | E9 | 서비스 apr.Apr16_StampDoc.deleteReg | 업무 |
| private retrieveTotal() | L457-478 | retrieve,insert,update,lookupDetail | 서비스 apr.Apr16_StampDoc.selectDocGroupSum(companyId, applType, stampReprCorpId) | 업무 |
| private lookupDetail() | L480-488 | buildGrid | 조회창 Apr16_Lookup_StampDocReg 열기 | 업무 |
| private lookupAppr() | L490-512 | buildGrid | 팝업 Apr01_Edit_ApprDoc 열기, 미선택 시 alert "해당문서의 열람권한이 없습니다" | 업무 |
| private settings() | L140-289 | 생성자 | 조회창 Apr16_Lookup_StampReprCorp 열기 → 콜백: unmask, 조회창 Apr16_Lookup_GetDocAppl 열기 → 콜백: unmask, 서비스 sys.Sys99_Print.insertRdStampDocManager(companyId, personId, windowClassName, startDate, closeDate), 이벤트 연결, 초기값: stampReprCorpId=null, stampReprCorpName=null, stampReprCorpId=null, stampReprCorpName=null, stampReprCorpId=resultModel.getStampId(, stampReprCorpName=resultModel.getStampReprCorpName(, stampReprCorpId=resultModel.getReprCorpId(, stampReprCorpName=resultModel.getStampReprCorpName(, startDate=ClientDateUtil.toDate(DateTimeFormat.getFormat("yyyy-01-01", closeDate=LoginUser.getToday( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L304-343 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L514-516 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L518-520 | checkAppl | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildTotalGrid = () => [
  gb.textCenter('applTypeNm', 150, '구분'),  // L295 SQL 계산 컬럼(selectDocByRegDate: f_cdnm('CorpDocStampApplType', apr16_ap…)
  gb.text('stampReprCorpNm', 250, '인감 및 대표명의'),  // L296 SQL 계산 컬럼(selectDocByRegDate: CASE WHEN apr16_appl_type = '2' THEN CO…)
  gb.longCenter('docIssueQty', 100, '발급매수'),  // L297
  gb.longCenter('docUseQty', 100, '사용매수'),  // L298
  gb.longCenter('docRemainQty', 100, '잔여매수'),  // L299 SQL 계산 컬럼(selectDocGroupSum: SUM(apr16_doc_remain_qty))
];

const buildGrid = () => [
  // ⚠DB없음 L322 newHeaderGroupMap015newHeaderGroupConfig13 100 "연관문서" (apr16_new_header_group_map015new_header_group_config13 컬럼 없음)
  // ⚠ 대응 없음 (GridBuilder L325) addCell
  gb.date('regDate', 90, '등록일'),  // L326
  gb.text('applTypeNm', 120, '구분'),  // L327 SQL 계산 컬럼(selectDocByRegDate: f_cdnm('CorpDocStampApplType', apr16_ap…)
  gb.text('stampReprCorpNm', 200, '인감 및 대표명의'),  // L328 SQL 계산 컬럼(selectDocByRegDate: CASE WHEN apr16_appl_type = '2' THEN CO…)
  gb.longCenter('docIssueQty', 70, '발급매수', { editor: 'number' }),  // L329
  gb.longCenter('docApplQty', 70, '신청매수'),  // L330
  gb.longCenter('docUseQty', 70, '사용매수', { editor: 'number' }),  // L331
  gb.text('provideCo', 200, '제공처'),  // L332
  gb.text('purpose', 200, '목적'),  // L333
  gb.text('requester', 100, '요청자'),  // L334
  gb.text('note', 200, '비고'),  // L335
  gb.date('applDate', 90, '신청일'),  // L336
  gb.textCenter('applEmpNm', 100, '신청자'),  // L337 SQL 계산 컬럼(selectDocByRegDate: emp01_kor_nm)
  gb.text('apprNm', 250, '문서명'),  // L338 SQL 계산 컬럼(selectDocByRegDate: apr01_title)
  gb.textStatus('apprStatusNm', 70, '상태'),  // L339 SQL 계산 컬럼(selectDocByRegDate: CASE WHEN apr01_appr_id IS NULL THEN nu…)
  // ⚠ 대응 없음 (GridBuilder L340) addDynamicCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insert}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={deleteChk}>삭제</Button>
5. <Button type="download" onClick={() => /* 서비스 sys.Sys99_Print.insertRdStampDocManager(companyId, personId, windowClassName, startDate, closeDate) */}>출력/다운로드</Button>

### Apr16_Lookup_StampReprCorp (`client/vi/apr/Apr16_Lookup_StampReprCorp.java`, 207줄)

- 툴바 `buttonBar`: 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `searchText` TextField
- 그리드 `grid` (buildGrid(), 체크박스):
  - applTypeName 150 "구분" Text
  - stampReprCorpName 350 "인감 및 대표명의" Text

#### 이벤트
[E0] 화면 열림 (생성자 L68-99) → settings(), show()
[E1] grid.CellDoubleClick (L92) → confirm()
[E2] searchText.KeyPress [Enter] (L103) → retrieve()
[E3] retrieveButton[조회].Select (L111) → retrieve()
[E4] allButton[전체].Select (L118) → confirmAll()
[E5] oKButton[확인].Select (L124) → confirm()
[E6] cancelButton[닫기].Select (L130) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L54-66 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L149-172 | E2,E3,open | 서비스 apr.Apr16_StampDoc.selectByApplType(companyId, personId, applType, startDate, closeDate, searchText) | 업무 |
| public confirmAll() | L174-177 | E4 | 상태 처리 | 업무 |
| public confirm() | L179-187 | E1,E5 | 상태 처리 | 업무 |
| public getServiceResult() | L190-198 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L101-136 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L138-147 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L200-202 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L203-205 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('applTypeNm', 150, '구분'),  // L143 SQL 계산 컬럼(selectByApplType: f_cdnm('CorpDocStampApplType', apr16_ap…)
  gb.text('stampReprCorpNm', 350, '인감 및 대표명의'),  // L144 SQL 계산 컬럼(selectByApplType: CASE WHEN apr16_appl_type = '2' THEN CO…)
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="unknown" onClick={confirmAll}>전체</Button>
3. <Button type="save" onClick={confirm}>확인</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

### Apr16_Lookup_StampDocReg (`client/vi/apr/Apr16_Lookup_StampDocReg.java`, 481줄)

- 입력·하위 화면: `applType` TextField, `applTypeName` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode") 빈칸="(선택하세요)", `stampReprCorpName` LookupTriggerField 빈칸="법인인감을 선택하세요", `stampId` LongField, `reprCorpId` LongField, `regDate` MyDateField, `docIssueQty` LongField, `docUseQty` LongField, `provideCo` TextField, `purpose` TextField, `note` TextField, `apprName` LookupTriggerField, `apprId` LongField, `apprStatusName` TextField, `lookup` Apr10_Lookup_Stamp, `editor` Apr01_Edit_ApprDoc

#### 이벤트
[E0] 화면 열림 (생성자 L93-95) → 초기화
[E1] applTypeName[구분].Collapse (L145) → 인라인 L145-170 (new CollapseHandler() { @Override pub…)
[E2] stampReprCorpName.TriggerClick (L174) → lookupStamp(), lookupReprCorp()
[E3] apprName[연관상신문서].TriggerClick [apprId.getValue() == null] (L186) → lookupApprRelate()
[E4] apprViewButton[문서보기].Select (L201) → lookupApprView()
[E5] apprRelateButton[문서연결].Select (L207) → lookupApprRelate()
[E6] apprdeleteButton[연결제거].Select (L213) → 인라인 L213-220 (new SelectHandler() { @Override publi…)
[E7] updateButton[저장].Select (L222) → preUpdate()
[E8] closeButton[닫기].Select [isNew] (L228) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public openNew() | L97-110 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L112-135 | openNew | 상태 처리 | 업무 |
| private setting() | L137-238 | open | 팝업 SettingPopup 열기 | 업무 |
| private getEditor() | L240-287 | open | 상태 처리 | 업무 |
| public preUpdate() | L289-325 | E7 | 상태 처리 | 업무 |
| private update() | L327-346 | preUpdate | 서비스 apr.Apr16_StampDoc.update | 업무 |
| private lookupStamp() | L348-363 | E2 | 조회창 Apr10_Lookup_Stamp 열기 | 업무 |
| private lookupReprCorp() | L365-385 | E2 | 조회창 Apr15_Lookup_ReprCorp 열기 | 업무 |
| private lookupApprView() | L387-415 | E4 | 팝업 Apr01_Edit_ApprDoc 열기 | 업무 |
| private lookupApprRelate() | L417-434 | E3,E5 | 조회창 Apr05_Lookup_LoadDoc2 열기 | 업무 |
| private setInitStampId() | L436-472 | open | 서비스 apr.Apr10_Stamp.selectCorpStampYn, apr.Apr15_ReprCorp.selectCorpRegYn(companyId, stdDate, companyId) | 업무 |
| private setHtmlStyle() | L474-476 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L477-479 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={preUpdate}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>
3. <Button type="search" onClick={lookupApprView}>문서보기</Button>
4. <Button type="unknown" onClick={lookupApprRelate}>문서연결</Button>
5. <Button type="delete" onClick={() => /* 인라인 L213-220 (new SelectHandler() { @Override publi…) */}>연결제거</Button>

### Apr15_Lookup_ReprCorp (`client/vi/apr/Apr15_Lookup_ReprCorp.java`, 184줄)

- 툴바 `buttonBar`: 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `searchText` TextField
- 그리드 `grid` (buildGrid(), 체크박스):
  - corpTypeName 80 "구분" TextCenter
  - corpName 250 "대표회사" Text
  - reprName 170 "대표자" Text

#### 이벤트
[E0] 화면 열림 (생성자 L49-54) → 초기화
[E1] searchText.KeyPress [Enter] (L84) → retrieve()
[E2] retrieveButton[조회].Select (L93) → retrieve()
[E3] confirmButton[확인].Select (L99) → confirm()
[E4] nullButton[해당사항 없음].Select [callback != null] (L105) → hide()
[E5] closeButton[닫기].Select (L114) → hide()
[E6] grid.CellDoubleClick (L121) → confirm()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L56-80 | 공개 메서드 | 상태 처리 | 업무 |
| private setting() | L82-127 | open | 상태 처리 | 업무 |
| private retrieve() | L141-162 | E1,E2,open | 서비스 apr.Apr15_ReprCorp.selectByCompanyId(companyId, searchText, corpRegYn, useYn, companyAddYn) | 업무 |
| private confirm() | L164-175 | E3,E6 | 미선택 시 alert "선택된 대표회사가 없습니다" | 업무 |
| private buildGrid() | L129-139 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L177-179 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L181-183 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('corpTypeNm', 80, '구분'),  // L134 SQL 계산 컬럼(selectByCompanyId: f_cdnm('ReprCorpType', apr15_corp_type,…)
  gb.text('corpNm', 250, '대표회사'),  // L135
  gb.text('reprNm', 170, '대표자'),  // L136
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="unknown" onClick={hide}>해당사항 없음</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

### Apr16_Lookup_GetDocAppl (`client/vi/apr/Apr16_Lookup_GetDocAppl.java`, 183줄)

- 툴바 `buttonBar`: {retrieveButton}
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - applDate 90 "신청일자" Date
  - applEmpName 80 "신청자" TextCenter
  - provideCo 180 "제공처" Text
  - purpose 180 "목적" Text
  - applTypeName 130 "구분" TextCenter
  - stampReprCorpName 250 "인감 및 대표명의" Text
  - docApplQty 70 "신청매수" LongCenter

#### 이벤트
[E0] 화면 열림 (생성자 L60-81) → settings()
[E1] retrieveButton[조회].Select (L84) → retrieve()
[E2] updateButton[확인].Select (L90) → update()
       └ [E5] messageBox.DialogHide (L156) → hide()
[E3] cancleButton[닫기].Select (L96) → hide()
[E4] grid.CellDoubleClick (L104) → update()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L53-58 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L127-139 | E1,open | 서비스 apr.Apr16_StampDoc.selectApplDocByRegDateIsNull(companyId) | 업무 |
| public update() | L141-178 | E2,E4 | ConfirmBox → E5 | 업무 |
| private settings() | L83-110 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L112-125 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L180-182 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('applDate', 90, '신청일자'),  // L116
  gb.textCenter('applEmpNm', 80, '신청자'),  // L117 SQL 계산 컬럼(selectApplDocByRegDateIsNull: emp01_kor_nm)
  gb.text('provideCo', 180, '제공처'),  // L118
  gb.text('purpose', 180, '목적'),  // L119
  gb.textCenter('applTypeNm', 130, '구분'),  // L120 SQL 계산 컬럼(selectApplDocByRegDateIsNull: f_cdnm('CorpDocStampApplType', apr16_ap…)
  gb.text('stampReprCorpNm', 250, '인감 및 대표명의'),  // L121 SQL 계산 컬럼(selectApplDocByRegDateIsNull: CASE WHEN apr16_appl_type = '2' THEN CO…)
  gb.longCenter('docApplQty', 70, '신청매수'),  // L122
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>확인</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

