# Apr16_Tab_StampDocAppl

- 종류: 화면
- 메뉴: 신청 > 90. 기타신청 > 법인서류 및 날인 신청 (#1330)
- 파일: `client/vi/apr/Apr16_Tab_StampDocAppl.java`
- 함께 쓰는 클래스 2개:
  - `Apr16_Lookup_StampDocAppl` `client/vi/apr/Apr16_Lookup_StampDocAppl.java`
  - `Apr15_Lookup_ReprCorp` `client/vi/apr/Apr15_Lookup_ReprCorp.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Apr05_Lookup_LoadDoc2`](../../apr/components/Apr05_Lookup_LoadDoc2.md), [`Apr10_Lookup_Stamp`](../../apr/components/Apr10_Lookup_Stamp.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr10_Stamp.selectCorpStampYn` | Apr16_Lookup_StampDocAppl:493 | [`Apr10_Stamp.java:137`](../../apr/services/Apr10_Stamp.md) | [`apr10_stamp.selectCorpStampYn`](../../apr/sql/apr10_stamp.md) |
| `apr.Apr15_ReprCorp.selectByCompanyId` | Apr15_Lookup_ReprCorp:156 | [`Apr15_ReprCorp.java:23`](../../apr/services/Apr15_ReprCorp.md) | [`apr15_repr_corp.selectByCompanyId`](../../apr/sql/apr15_repr_corp.md) |
| `apr.Apr15_ReprCorp.selectCorpRegYn` | Apr16_Lookup_StampDocAppl:512 | [`Apr15_ReprCorp.java:28`](../../apr/services/Apr15_ReprCorp.md) | [`apr15_repr_corp.selectCorpRegYn`](../../apr/sql/apr15_repr_corp.md) |
| `apr.Apr16_StampDoc.delete` | Apr16_Tab_StampDocAppl:293 | [`Apr16_StampDoc.java:147`](../../apr/services/Apr16_StampDoc.md) | `UpdateDataModel(apr16_stamp_doc)` 동적 DELETE |
| `apr.Apr16_StampDoc.selectByApplEmpId` | Apr16_Tab_StampDocAppl:191 | [`Apr16_StampDoc.java:26`](../../apr/services/Apr16_StampDoc.md) | [`apr16_stamp_doc.selectByApplEmpId`](../../apr/sql/apr16_stamp_doc.md) |
| `apr.Apr16_StampDoc.update` | Apr16_Lookup_StampDocAppl:387 | [`Apr16_StampDoc.java:120`](../../apr/services/Apr16_StampDoc.md) | `UpdateDataModel(apr16_stamp_doc)` 동적 INSERT/UPDATE → [`apr16_stamp_doc.selectById`](../../apr/sql/apr16_stamp_doc.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`apr15_repr_corp`](../../../db/tables/apr.md), [`apr16_stamp_doc`](../../../db/tables/apr.md), [`emp01_person`](../../../db/tables/emp.md), [`sys01_company`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Apr16_Tab_StampDocAppl (`client/vi/apr/Apr16_Tab_StampDocAppl.java`, 304줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 신청일자: {startDate} ~: {closeDate} 검색: {searchText} {resultCheckBox} {retrieveButton} {insertButton} {copyButton} {deleteButton}
- 입력·하위 화면: `resultCheckBox` CheckBox, `startDate` MyDateField, `closeDate` MyDateField, `searchText` TextField 빈칸="제공처/목적", `lookup` Apr16_Lookup_StampDocAppl, `editor` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - actionCell 45 "수정" Cell 편집:modiCell
  - applDate 90 "신청일자" Date
  - applTypeName 120 "신청구분" Text
  - stampReprCorpName 200 "인감 및 대표명의" Text
  - provideCo 200 "제공처" Text
  - purpose 200 "목적" Text
  - note 200 "비고<br>(날인요청서류)" Text
  - requester 100 "요청자" Text
  - applQty 70 "신청/날인<br>부수" LongCenter
  - stampOutYn 45 "인감<br>반출" BooleanYn2
  - stampDate 90 "날인일자" Date
  - apprName 250 "문서명" Text
  - apprStatusName 70 "상태" TextStatus
  - apprStatusName 35 " " DynamicCell 편집:apprCell

#### 이벤트
[E0] 화면 열림 (생성자 L61-92) → settings(), retrieve()
[E1] searchText.KeyPress [Enter] (L106) → retrieve()
[E2] retrieveButton[조회].Select (L115) → retrieve()
[E3] insertButton[등록].Select (L121) → insert()
[E4] copyButton[등록(복사)].Select (L127) → copy()
[E5] deleteButton[삭제].Select (L133) → deleteChk()
       └ [E6] messageBox.DialogHide (L278) → delete()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieve() | L180-197 | 생성자,E1,E2 | 서비스 apr.Apr16_StampDoc.selectByApplEmpId(companyId, personId, searchText, startDate, closeDate, procResult) | 업무 |
| private insert() | L199-206 | E3 | 조회창 Apr16_Lookup_StampDocAppl 열기 | 업무 |
| private copy() | L208-225 | E4 | 조회창 Apr16_Lookup_StampDocAppl 열기 | 업무 |
| private lookupDetail() | L227-234 | buildGrid | 조회창 Apr16_Lookup_StampDocAppl 열기 | 업무 |
| private lookupAppr() | L236-258 | buildGrid | 팝업 Apr01_Edit_ApprDoc 열기, 미선택 시 alert "해당문서의 열람권한이 없습니다" | 업무 |
| private deleteChk() | L260-288 | E5 | 미선택 시 alert "삭제할 내역을 선택하세요" → 확인창 E6 | 업무 |
| private delete() | L290-294 | E6 | GridDeleteData apr.Apr16_StampDoc.delete(체크된 행 목록) | 업무 |
| private settings() | L94-139 | 생성자 | 이벤트 연결, 초기값: resultCheckBox=true("미처리만 조회"), startDate=ClientDateUtil.toDate(DateTimeFormat.getFormat("yyyy-01-01", closeDate=LoginUser.getToday( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L141-178 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L296-298 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L300-302 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L159 newHeaderGroupMap013newHeaderGroupConfig13 100 "연관문서" (apr16_new_header_group_map013new_header_group_config13 컬럼 없음)
  // ⚠ 대응 없음 (GridBuilder L162) addCell
  gb.date('applDate', 90, '신청일자'),  // L163
  gb.text('applTypeNm', 120, '신청구분'),  // L164 SQL 계산 컬럼(selectByApplEmpId: f_cdnm('CorpDocStampApplType', apr16_ap…)
  gb.text('stampReprCorpNm', 200, '인감 및 대표명의'),  // L165 SQL 계산 컬럼(selectByApplEmpId: CASE WHEN apr16_appl_type = '2' THEN CO…)
  gb.text('provideCo', 200, '제공처'),  // L166
  gb.text('purpose', 200, '목적'),  // L167
  gb.text('note', 200, '비고<br>(날인요청서류)'),  // L168
  gb.text('requester', 100, '요청자'),  // L169
  gb.longCenter('applQty', 70, '신청/날인<br>부수'),  // L170 SQL 계산 컬럼(selectByApplEmpId: CASE WHEN apr16_appl_type = '3' THEN ap…)
  gb.booleanYn2('stampOutYn', 45, '인감<br>반출'),  // L171
  gb.date('stampDate', 90, '날인일자'),  // L172
  gb.text('apprNm', 250, '문서명'),  // L173 SQL 계산 컬럼(selectByApplEmpId: apr01_title)
  gb.textStatus('apprStatusNm', 70, '상태'),  // L174 SQL 계산 컬럼(selectByApplEmpId: CASE WHEN apr01_appr_id IS NULL THEN nu…)
  // ⚠ 대응 없음 (GridBuilder L175) addDynamicCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insert}>등록</Button>
3. <Button type="register" onClick={copy}>등록(복사)</Button>
4. <Button type="delete" onClick={deleteChk}>삭제</Button>

### Apr16_Lookup_StampDocAppl (`client/vi/apr/Apr16_Lookup_StampDocAppl.java`, 575줄)

- 입력·하위 화면: `stampDocId` LongField, `applDate` MyDateField, `applType` TextField, `applTypeName` ComboBoxField("CorpDocStampApplType") 빈칸="(선택하세요)", `stampName` LookupTriggerField, `stampId` LongField, `reprCorpName` LookupTriggerField, `reprCorpId` LongField, `applQty` LongField, `stampOutYn` CheckBox, `provideCo` TextField, `purpose` TextField, `note` TextField, `requester` TextField, `apprName` LookupTriggerField, `apprId` LongField, `apprStatusName` TextField, `lookup` Apr10_Lookup_Stamp, `editor` Apr01_Edit_ApprDoc

#### 이벤트
[E0] 화면 열림 (생성자 L93-95) → 초기화
[E1] applTypeName[신청구분].Collapse (L189) → setEnable()
[E2] stampName[인감].TriggerClick (L197) → lookupStamp()
[E3] reprCorpName[대표명의].TriggerClick (L207) → lookupReprCorp()
[E4] apprName[연관상신문서].TriggerClick [isReadOnly] (L215) → lookupApprView(), lookupApprRelate()
[E5] apprViewButton[문서보기].Select (L234) → lookupApprView()
[E6] apprRelateButton[문서연결].Select (L240) → lookupApprRelate()
[E7] apprDeleteButton[연결제거].Select (L246) → 인라인 L246-253 (new SelectHandler() { @Override publi…)
[E8] updateButton[저장].Select (L256) → preUpdate()
[E9] closeButton[닫기].Select [isNew] (L262) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public openNew() | L97-111 | 공개 메서드 | 상태 처리 | 업무 |
| public openCopy() | L113-142 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L144-175 | openNew,openCopy | 상태 처리 | 업무 |
| private setting() | L177-272 | open | 팝업 SettingPopup 열기 | 업무 |
| private getEditor() | L274-329 | open | 상태 처리 | 업무 |
| public preUpdate() | L331-383 | E8 | 상태 처리 | 업무 |
| private update() | L385-401 | preUpdate | 서비스 apr.Apr16_StampDoc.update | 업무 |
| private lookupStamp() | L403-418 | E2 | 조회창 Apr10_Lookup_Stamp 열기 | 업무 |
| private lookupReprCorp() | L420-440 | E3 | 조회창 Apr15_Lookup_ReprCorp 열기 | 업무 |
| private lookupApprView() | L442-470 | E4,E5 | 팝업 Apr01_Edit_ApprDoc 열기 | 업무 |
| private lookupApprRelate() | L472-489 | E4,E6 | 조회창 Apr05_Lookup_LoadDoc2 열기 | 업무 |
| private setInitStampId() | L491-527 | open | 서비스 apr.Apr10_Stamp.selectCorpStampYn, apr.Apr15_ReprCorp.selectCorpRegYn(companyId, stdDate, companyId) | 업무 |
| private setEnable() | L529-563 | E1,setting | 상태 처리 | 업무 |
| private setHtmlStyle() | L565-567 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L568-570 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L571-573 | setting | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={preUpdate}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>
3. <Button type="search" onClick={lookupApprView}>문서보기</Button>
4. <Button type="unknown" onClick={lookupApprRelate}>문서연결</Button>
5. <Button type="delete" onClick={() => /* 인라인 L246-253 (new SelectHandler() { @Override publi…) */}>연결제거</Button>

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

