# Apr17_Tab_CorpDocApp

- 종류: 화면
- 메뉴: 신청 > 90. 기타신청 > 구)법인서류 및 날인 신청 (#1510)
- 파일: `client/vi/apr/Apr17_Tab_CorpDocApp.java`
- 함께 쓰는 클래스 2개:
  - `Apr19_Grid_RelateStamp` `client/vi/apr/Apr19_Grid_RelateStamp.java`
  - `Apr18_Lookup_RelateAppr` `client/vi/apr/Apr18_Lookup_RelateAppr.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Apr05_Lookup_LoadDoc`](../../apr/components/Apr05_Lookup_LoadDoc.md), [`Apr10_Lookup_Stamp`](../../apr/components/Apr10_Lookup_Stamp.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr17_CorpDoc.copyUpdate` | Apr17_Tab_CorpDocApp:378 | [`Apr17_CorpDoc.java:95`](../../apr/services/Apr17_CorpDoc.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(apr17_corp_doc)` 동적 INSERT/UPDATE → [`apr17_corp_doc.selectById`](../../apr/sql/apr17_corp_doc.md) |
| `apr.Apr17_CorpDoc.delete` | Apr17_Tab_CorpDocApp:393 | [`Apr17_CorpDoc.java:122`](../../apr/services/Apr17_CorpDoc.md) | `UpdateDataModel(apr17_corp_doc)` 동적 DELETE |
| `apr.Apr17_CorpDoc.selectByAppDate` | Apr17_Tab_CorpDocApp:255 | [`Apr17_CorpDoc.java:41`](../../apr/services/Apr17_CorpDoc.md) | [`apr17_corp_doc.selectByAppDate`](../../apr/sql/apr17_corp_doc.md) |
| `apr.Apr17_CorpDoc.selectById` | Apr17_Tab_CorpDocApp:208, Apr17_Tab_CorpDocApp:68 | [`Apr17_CorpDoc.java:20`](../../apr/services/Apr17_CorpDoc.md) | [`apr17_corp_doc.selectById`](../../apr/sql/apr17_corp_doc.md) |
| `apr.Apr17_CorpDoc.update` | Apr17_Tab_CorpDocApp:299 | [`Apr17_CorpDoc.java:117`](../../apr/services/Apr17_CorpDoc.md) | `UpdateDataModel(apr17_corp_doc)` 동적 INSERT/UPDATE → [`apr17_corp_doc.selectById`](../../apr/sql/apr17_corp_doc.md) |
| `apr.Apr18_RelateCorpDoc.delete` | Apr18_Lookup_RelateAppr:199 | [`Apr18_RelateCorpDoc.java:67`](../../apr/services/Apr18_RelateCorpDoc.md) | `UpdateDataModel(apr18_relate_corp_doc)` 동적 DELETE |
| `apr.Apr18_RelateCorpDoc.modelUpdate` | Apr18_Lookup_RelateAppr:176 | [`Apr18_RelateCorpDoc.java:34`](../../apr/services/Apr18_RelateCorpDoc.md) | [`apr17_corp_doc.checkByApprId`](../../apr/sql/apr17_corp_doc.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(apr18_relate_corp_doc)` 동적 INSERT/UPDATE → [`apr18_relate_corp_doc.selectById`](../../apr/sql/apr18_relate_corp_doc.md) |
| `apr.Apr18_RelateCorpDoc.selectByCorpDocId` | Apr18_Lookup_RelateAppr:162 | [`Apr18_RelateCorpDoc.java:26`](../../apr/services/Apr18_RelateCorpDoc.md) | [`apr18_relate_corp_doc.selectByCorpDocId`](../../apr/sql/apr18_relate_corp_doc.md) |
| `apr.Apr19_RelateStamp.delete` | Apr19_Grid_RelateStamp:223 | [`Apr19_RelateStamp.java:68`](../../apr/services/Apr19_RelateStamp.md) | `UpdateDataModel(apr19_relate_stamp)` 동적 DELETE |
| `apr.Apr19_RelateStamp.selectByCorpDocId` | Apr19_Grid_RelateStamp:126 | [`Apr19_RelateStamp.java:24`](../../apr/services/Apr19_RelateStamp.md) | [`apr19_relate_stamp.selectByCorpDocId`](../../apr/sql/apr19_relate_stamp.md) |
| `apr.Apr19_RelateStamp.update` | Apr19_Grid_RelateStamp:159 | [`Apr19_RelateStamp.java:63`](../../apr/services/Apr19_RelateStamp.md) | `UpdateDataModel(apr19_relate_stamp)` 동적 INSERT/UPDATE → [`apr19_relate_stamp.selectById`](../../apr/sql/apr19_relate_stamp.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`apr17_corp_doc`](../../../db/tables/apr.md), [`apr18_relate_corp_doc`](../../../db/tables/apr.md), [`apr19_relate_stamp`](../../../db/tables/apr.md)

## DB 함수

`f_cdnm`, `f_emp_kor_nm`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Apr17_Tab_CorpDocApp (`client/vi/apr/Apr17_Tab_CorpDocApp.java`, 409줄)

- 레이아웃: west=cp, center=relateStampList
- 툴바 `buttonBar`: 신청일자: {startDate} ~: {closeDate} 검색: {searchText} {resultCheckBox} {retrieveButton} {copyButton} {insertButton} {updateButton} {deleteButton}
- 입력·하위 화면: `resultCheckBox` CheckBox, `startDate` MyDateField, `closeDate` MyDateField, `searchText` TextField 빈칸="제공처/목적", `lookup` Apr18_Lookup_RelateAppr
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - callDate 100 "신청일자" Date 편집:MyDateField
  - provideCo 200 "제공처" Text 편집:TextField
  - purpose 200 "목적" Text 편집:TextField
  - note 200 "비고<br>(날인요청서류)" Text 편집:TextField
  - requester 100 "요청자" Text 편집:TextField
  - stampCertCallCnt 100 "법인인감증명서<br>신청매수" LongCenter 편집:LongField
  - corpRegCallCnt 100 "법인등기부등본<br>신청매수" LongCenter 편집:LongField
  - apprCntStr 60 "연관문서" TextCenter
  - actionCell 25 " " Cell 편집:actionCell

#### 이벤트
[E0] 화면 열림 (생성자 L93-133) → settings(), retrieve()
[E1] grid.SelectionChanged [corpDocModel != null] (L146) → 인라인 L146-154 (new SelectionChangedHandler<Apr17_Cor…)
[E2] searchText.KeyPress [Enter] (L158) → retrieve()
[E3] retrieveButton[조회].Select (L167) → retrieve()
[E4] copyButton[등록(복사)].Select (L173) → copyInsertRow()
[E5] insertButton[등록].Select (L179) → insert()
[E6] updateButton[저장].Select (L185) → update()
[E7] deleteButton[삭제].Select (L191) → deleteChk()
       └ [E8] msgBox.DialogHide [YES] (L332) → delete()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public execute() | L64-79 | buildGrid,retrieve,update,copyInsertRow | 서비스 apr.Apr17_CorpDoc.selectById(corpDocId) | 업무 |
| private retrieve() | L237-261 | 생성자,E2,E3,update | 서비스 apr.Apr17_CorpDoc.selectByAppDate(searchText, startDate, closeDate, companyId, personId, procResult) | 업무 |
| public insert() | L263-270 | E5 | 상태 처리 | 업무 |
| private update() | L272-310 | E6 | 서비스 apr.Apr17_CorpDoc.update | 업무 |
| private deleteChk() | L312-347 | E7 | 미선택 시 alert "삭제할 정보를 먼저 선택해주세요" → 확인창 E8 | 업무 |
| public copyInsertRow() | L349-375 | E4 | 상태 처리 | 업무 |
| public copyUpdateRow() | L377-388 | copyInsertRow | 서비스 apr.Apr17_CorpDoc.copyUpdate | 업무 |
| public delete() | L390-394 | E8 | GridDeleteData apr.Apr17_CorpDoc.delete(체크된 행 목록) | 업무 |
| private settings() | L135-197 | 생성자 | 이벤트 연결, 초기값: resultCheckBox=true("미처리만 조회"), startDate=ClientDateUtil.toDate(DateTimeFormat.getFormat("yyyy-01-01", closeDate=LoginUser.getToday( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L199-235 | 필드 초기화 | 조회창 Apr18_Lookup_RelateAppr 열기, 서비스 apr.Apr17_CorpDoc.selectById(corpDocId), 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| public setHtmlGridStyle() | L396-399 | 공개 메서드 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L401-403 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L405-407 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('callDate', 100, '신청일자', { editor: 'date' }),  // L224
  gb.text('provideCo', 200, '제공처', { editor: 'text' }),  // L225
  gb.text('purpose', 200, '목적', { editor: 'text' }),  // L226
  gb.text('note', 200, '비고<br>(날인요청서류)', { editor: 'text' }),  // L227
  gb.text('requester', 100, '요청자', { editor: 'text' }),  // L228
  gb.longCenter('stampCertCallCnt', 100, '법인인감증명서<br>신청매수', { editor: 'number' }),  // L229
  gb.longCenter('corpRegCallCnt', 100, '법인등기부등본<br>신청매수', { editor: 'number' }),  // L230
  gb.textCenter('apprCntStr', 60, '연관문서'),  // L231
  // ⚠ 대응 없음 (GridBuilder L232) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={copyInsertRow}>등록(복사)</Button>
3. <Button type="register" onClick={insert}>등록</Button>
4. <Button type="save" onClick={update}>저장</Button>
5. <Button type="delete" onClick={deleteChk}>삭제</Button>

### Apr19_Grid_RelateStamp (`client/vi/apr/Apr19_Grid_RelateStamp.java`, 226줄)

- 툴바 `buttonBar`: {insertButton} {updateButton} {deleteButton}
- 입력·하위 화면: `stampName` LookupTriggerField, `lookupStamp` Apr10_Lookup_Stamp
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - stampName 150 "날인인감" Text 편집:stampName
  - stampCnt 70 "날인부수" LongCenter 편집:LongField
  - outYn 60 "반출" Boolean
  - stampDate 100 "날인일자" Date

#### 이벤트
[E0] 화면 열림 (생성자 L53-66) → settings(), retrieve()
[E1] insertButton[등록].Select (L69) → insertRow()
[E2] updateButton[저장].Select (L75) → update()
[E3] deleteButton[삭제].Select (L81) → deleteChk()
       └ [E5] msgBox.DialogHide [YES] (L203) → delete()
[E4] stampName.TriggerClick (L92) → findStamp()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L109-111 | 생성자,update | 상태 처리 | 업무 |
| public retrieve() | L113-130 | 생성자,update | 서비스 apr.Apr19_RelateStamp.selectByCorpDocId(corpDocId) | 업무 |
| private insertRow() | L132-137 | E1 | 상태 처리 | 업무 |
| public update() | L139-170 | E2 | 서비스 apr.Apr19_RelateStamp.update | 업무 |
| public findStamp() | L172-186 | E4 | 조회창 Apr10_Lookup_Stamp 열기 | 업무 |
| private deleteChk() | L188-218 | E3 | 미선택 시 alert "삭제할 정보를 먼저 선택해주세요" → 확인창 E5 | 업무 |
| public delete() | L220-224 | E5 | GridDeleteData apr.Apr19_RelateStamp.delete(체크된 행 목록) | 업무 |
| private settings() | L68-87 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L89-107 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('stampNm', 150, '날인인감'),  // L101
  gb.longCenter('stampCnt', 70, '날인부수', { editor: 'number' }),  // L102
  gb.boolean('outYn', 60, '반출'),  // L103
  gb.date('stampDate', 100, '날인일자'),  // L104
];
```

#### 사용된 버튼들
1. <Button type="register" onClick={insertRow}>등록</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="delete" onClick={deleteChk}>삭제</Button>

### Apr18_Lookup_RelateAppr (`client/vi/apr/Apr18_Lookup_RelateAppr.java`, 206줄)

- 툴바 `buttonBar`: {retrieveButton} {insertButton} {deleteButton}
- 입력·하위 화면: `editor` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - title 370 "제목" Text
  - regDate 90 "등록일" Date
  - effectDate 90 "시행일" Date
  - regEmpName 80 "등록자" TextCenter
  - statusName 80 "상신상태" TextCenter
  - actionCell 70 "상세보기" Cell 편집:actionCell

#### 이벤트
[E0] 화면 열림 (생성자 L96-114) → show()
[E1] retrieveButton[조회].Select (L66) → retrieve()
[E2] insertButton[불러오기].Select (L72) → insert()
[E3] deleteButton[연결제거].Select (L78) → delete()
[E4] closeButton[닫기].Select [callback != null] (L84) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L53-56 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L58-63 | 공개 메서드 | 상태 처리 | 업무 |
| private retrieve() | L158-164 | E1,open,insert | 서비스 apr.Apr18_RelateCorpDoc.selectByCorpDocId(companyId, corpDocId) | 업무 |
| private insert() | L166-194 | E2 | 조회창 Apr05_Lookup_LoadDoc 열기, 서비스 apr.Apr18_RelateCorpDoc.modelUpdate | 업무 |
| private delete() | L196-200 | E3 | GridDeleteData apr.Apr18_RelateCorpDoc.delete(체크된 행 목록) | 업무 |
| private settings() | L65-94 | open | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L116-156 | 필드 초기화 | 팝업 Apr01_Edit_ApprDoc 열기, 미선택 시 alert "해당문서의 열람권한이 없습니다", 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L202-204 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('title', 370, '제목'),  // L148 SQL 계산 컬럼(selectByCorpDocId: b.apr01_title)
  gb.date('regDate', 90, '등록일'),  // L149 SQL 계산 컬럼(selectByCorpDocId: b.apr01_reg_date)
  gb.date('effectDate', 90, '시행일'),  // L150 SQL 계산 컬럼(selectByCorpDocId: b.apr01_effect_date)
  gb.textCenter('regEmpNm', 80, '등록자'),  // L151 SQL 계산 컬럼(selectByCorpDocId: f_emp_kor_nm(b.apr01_reg_emp_id))
  gb.textCenter('statusNm', 80, '상신상태'),  // L152 SQL 계산 컬럼(selectByCorpDocId: f_cdnm('AprStatusCode', b.apr01_status_…)
  // ⚠ 대응 없음 (GridBuilder L153) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insert}>불러오기</Button>
3. <Button type="delete" onClick={delete}>연결제거</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

