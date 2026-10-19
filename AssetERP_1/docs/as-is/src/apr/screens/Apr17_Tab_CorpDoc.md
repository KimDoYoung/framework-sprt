# Apr17_Tab_CorpDoc

- 종류: 화면
- 메뉴: 경영관리 > 91. 법인서류 > 구)법인서류 매수관리 (#1507)
- 파일: `client/vi/apr/Apr17_Tab_CorpDoc.java`
- 함께 쓰는 클래스 2개:
  - `Apr18_Lookup_RelateAppr` `client/vi/apr/Apr18_Lookup_RelateAppr.java`
  - `Apr17_Lookup_CorpDoc` `client/vi/apr/Apr17_Lookup_CorpDoc.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Apr05_Lookup_LoadDoc`](../../apr/components/Apr05_Lookup_LoadDoc.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr17_CorpDoc.regDateUpdate` | Apr17_Lookup_CorpDoc:131, Apr17_Tab_CorpDoc:366 | [`Apr17_CorpDoc.java:74`](../../apr/services/Apr17_CorpDoc.md) | [`apr17_corp_doc.regDateUpdate`](../../apr/sql/apr17_corp_doc.md) |
| `apr.Apr17_CorpDoc.regDelete` | Apr17_Tab_CorpDoc:346 | [`Apr17_CorpDoc.java:87`](../../apr/services/Apr17_CorpDoc.md) | [`apr17_corp_doc.regDelete`](../../apr/sql/apr17_corp_doc.md) |
| `apr.Apr17_CorpDoc.selectByCompanyId` | Apr17_Lookup_CorpDoc:171, Apr17_Tab_CorpDoc:277 | [`Apr17_CorpDoc.java:33`](../../apr/services/Apr17_CorpDoc.md) | [`apr17_corp_doc.selectByCompanyId`](../../apr/sql/apr17_corp_doc.md) |
| `apr.Apr17_CorpDoc.selectByCorpRegDate` | Apr17_Tab_CorpDoc:303 | [`Apr17_CorpDoc.java:54`](../../apr/services/Apr17_CorpDoc.md) | [`apr17_corp_doc.selectByCorpRegDate`](../../apr/sql/apr17_corp_doc.md) |
| `apr.Apr17_CorpDoc.selectById` | Apr17_Tab_CorpDoc:236 | [`Apr17_CorpDoc.java:20`](../../apr/services/Apr17_CorpDoc.md) | [`apr17_corp_doc.selectById`](../../apr/sql/apr17_corp_doc.md) |
| `apr.Apr17_CorpDoc.selectByRegDate` | Apr17_Tab_CorpDoc:405 | [`Apr17_CorpDoc.java:64`](../../apr/services/Apr17_CorpDoc.md) | [`apr17_corp_doc.selectByRegDate`](../../apr/sql/apr17_corp_doc.md) |
| `apr.Apr17_CorpDoc.update` | Apr17_Tab_CorpDoc:314 | [`Apr17_CorpDoc.java:117`](../../apr/services/Apr17_CorpDoc.md) | `UpdateDataModel(apr17_corp_doc)` 동적 INSERT/UPDATE → [`apr17_corp_doc.selectById`](../../apr/sql/apr17_corp_doc.md) |
| `apr.Apr18_RelateCorpDoc.delete` | Apr18_Lookup_RelateAppr:199 | [`Apr18_RelateCorpDoc.java:67`](../../apr/services/Apr18_RelateCorpDoc.md) | `UpdateDataModel(apr18_relate_corp_doc)` 동적 DELETE |
| `apr.Apr18_RelateCorpDoc.modelUpdate` | Apr18_Lookup_RelateAppr:176 | [`Apr18_RelateCorpDoc.java:34`](../../apr/services/Apr18_RelateCorpDoc.md) | [`apr17_corp_doc.checkByApprId`](../../apr/sql/apr17_corp_doc.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(apr18_relate_corp_doc)` 동적 INSERT/UPDATE → [`apr18_relate_corp_doc.selectById`](../../apr/sql/apr18_relate_corp_doc.md) |
| `apr.Apr18_RelateCorpDoc.selectByCorpDocId` | Apr18_Lookup_RelateAppr:162 | [`Apr18_RelateCorpDoc.java:26`](../../apr/services/Apr18_RelateCorpDoc.md) | [`apr18_relate_corp_doc.selectByCorpDocId`](../../apr/sql/apr18_relate_corp_doc.md) |
| `sys.Sys99_Print.insertRdCorpDoc` | Apr17_Tab_CorpDoc:175 | [`Sys99_Print.java:3078`](../../sys/services/Sys99_Print.md) | [`apr17_corp_doc.selectByCorpRegDate`](../../apr/sql/apr17_corp_doc.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr17_corp_doc`](../../../db/tables/apr.md), [`apr18_relate_corp_doc`](../../../db/tables/apr.md), [`apr19_relate_stamp`](../../../db/tables/apr.md), [`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_emp_kor_nm`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Apr17_Tab_CorpDoc (`client/vi/apr/Apr17_Tab_CorpDoc.java`, 421줄)

- 레이아웃: north=northVlc, center=centerVlc
- 툴바 `buttonBar`: 조회구간: {startDate} ~: {closeDate} {retrieveButton} {insertButton} {updateButton} {deleteButton} {downLoadButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `lookup` Apr17_Lookup_CorpDoc
- 그리드 `totalGrid` (buildTotalGrid(), 행번호숨김):
  - typeName 150 "구분" TextCenter
  - issueSum 100 "발급매수" LongCenter
  - useSum 100 "사용매수" LongCenter
  - remain 100 "잔여매수" LongCenter
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - regDate 100 "등록일" Date 편집:MyDateField
  - stampCertIssueCnt 80 "발급매수" LongCenter 편집:"0069B4"
  - stampCertCallCnt 80 "신청매수" LongCenter 편집:"000000"
  - stampCertUseCnt 80 "사용매수" LongCenter 편집:"CE4242"
  - corpRegIssueCnt 80 "발급매수" LongCenter 편집:"0069B4"
  - corpRegCallCnt 80 "신청매수" LongCenter 편집:"000000"
  - corpRegUseCnt 80 "사용매수" LongCenter 편집:"CE4242"
  - provideCo 150 "제공처" Text 편집:TextField
  - purpose 200 "목적" Text 편집:TextField
  - requester 100 "요청자" Text 편집:TextField
  - note 200 "비고" Text 편집:TextField
  - callDate 90 "신청일" Date
  - callEmpName 100 "신청자" TextCenter
  - apprCntStr 55 "연관문서" Text
  - actionCell 25 " " Cell 편집:actionCell

#### 이벤트
[E0] 화면 열림 (생성자 L77-120) → settings()
[E1] hiperLink[<font style='font-size:14px;'><b>※ 법인서류 신청내역이 존재합니다. <a href=# style=\"color:#0078D7;\">신청내역 가져오기</a></b></font>].Click (L131) → check()
[E2] retrieveButton[조회].Select (L144) → check()
[E3] insertButton[등록].Select (L150) → insert()
[E4] updateButton[저장].Select (L156) → update()
[E5] deleteButton[삭제].Select (L162) → delete()
       └ [E7] msgBox.DialogHide [YES] (L371) → check()
[E6] downLoadButton[출력/다운로드].Select [result.getStatus() == 1] (L169) → 서비스 sys.Sys99_Print.insertRdCorpDoc(companyId, personId, windowClassName, startDate, closeDate)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public buildTotalGrid() | L214-224 | 필드 초기화 | 상태 처리 | 업무 |
| private check() | L276-294 | E1,E2,E7,settings,update | 서비스 apr.Apr17_CorpDoc.selectByCompanyId | 업무 |
| private retrieve() | L296-310 | check | 서비스 apr.Apr17_CorpDoc.selectByCorpRegDate(startDate, closeDate, companyId) | 업무 |
| public update() | L312-325 | E4 | 서비스 apr.Apr17_CorpDoc.update | 업무 |
| public insert() | L327-333 | E3 | 상태 처리 | 업무 |
| public delete() | L335-397 | E5 | 미선택 시 alert "선택된 항목이 없습니다" → 확인창 E7 | 업무 |
| private retrieveTotal() | L399-412 | retrieve | 서비스 apr.Apr17_CorpDoc.selectByRegDate(startDate, closeDate, companyId) | 업무 |
| private settings() | L122-212 | 생성자 | 조회창 Apr17_Lookup_CorpDoc 열기 → 콜백: unmask, 서비스 sys.Sys99_Print.insertRdCorpDoc(companyId, personId, windowClassName, startDate, closeDate), 이벤트 연결, 초기값: startDate=ClientDateUtil.toDate(DateTimeFormat.getFormat("yyyy-01-01", closeDate=LoginUser.getToday( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L226-274 | 필드 초기화 | 조회창 Apr18_Lookup_RelateAppr 열기, 서비스 apr.Apr17_CorpDoc.selectById(corpDocId), 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L414-416 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L418-420 | check | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildTotalGrid = () => [
  gb.textCenter('typeNm', 150, '구분'),  // L218
  gb.longCenter('issueSum', 100, '발급매수'),  // L219
  gb.longCenter('useSum', 100, '사용매수'),  // L220
  gb.longCenter('remain', 100, '잔여매수'),  // L221
];

const buildGrid = () => [
  // ⚠DB없음 L253 newHeaderGroupMap03newHeaderGroupConfig13 100 "법인인감증명서" (apr18_new_header_group_map03new_header_group_config13 컬럼 없음)
  // ⚠DB없음 L254 newHeaderGroupMap06newHeaderGroupConfig13 100 "법인등기부등본" (apr18_new_header_group_map06new_header_group_config13 컬럼 없음)
  gb.date('regDate', 100, '등록일', { editor: 'date' }),  // L257
  gb.longCenter('stampCertIssueCnt', 80, '발급매수', { editor: 'number' }),  // L258
  gb.longCenter('stampCertCallCnt', 80, '신청매수', { editor: 'number' }),  // L259
  gb.longCenter('stampCertUseCnt', 80, '사용매수', { editor: 'number' }),  // L260
  gb.longCenter('corpRegIssueCnt', 80, '발급매수', { editor: 'number' }),  // L261
  gb.longCenter('corpRegCallCnt', 80, '신청매수', { editor: 'number' }),  // L262
  gb.longCenter('corpRegUseCnt', 80, '사용매수', { editor: 'number' }),  // L263
  gb.text('provideCo', 150, '제공처', { editor: 'text' }),  // L264
  gb.text('purpose', 200, '목적', { editor: 'text' }),  // L265
  gb.text('requester', 100, '요청자', { editor: 'text' }),  // L266
  gb.text('note', 200, '비고', { editor: 'text' }),  // L267
  gb.date('callDate', 90, '신청일'),  // L268
  gb.textCenter('callEmpNm', 100, '신청자'),  // L269
  gb.text('apprCntStr', 55, '연관문서'),  // L270
  // ⚠ 대응 없음 (GridBuilder L271) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={check}>조회</Button>
2. <Button type="register" onClick={insert}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={delete}>삭제</Button>
5. <Button type="download" onClick={() => /* 서비스 sys.Sys99_Print.insertRdCorpDoc(companyId, personId, windowClassName, startDate, closeDate) */}>출력/다운로드</Button>

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

### Apr17_Lookup_CorpDoc (`client/vi/apr/Apr17_Lookup_CorpDoc.java`, 182줄)

- 툴바 `buttonBar`: {retrieveButton}
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - callDate 100 "신청일자" Date
  - callEmpName 80 "신청자" Text
  - provideCo 300 "제공처" Text
  - purpose 300 "목적" Text
  - stampCertCallCnt 100 "법인인감증명서<br>신청매수" Long
  - corpRegCallCnt 100 "법인등기부등본<br>신청매수" Long

#### 이벤트
[E0] 화면 열림 (생성자 L60-98) → 초기화
[E1] retrieveButton[조회].Select (L66) → retrieve()
[E2] updateButton[확인].Select (L72) → update()
       └ [E4] msgBox.DialogHide [YES] (L136) → hide()
[E3] cancleButton[닫기].Select (L78) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L53-58 | 공개 메서드 | 상태 처리 | 업무 |
| public update() | L114-163 | E2 | 미선택 시 alert "선택된 신청내역이 없습니다" → 확인창 E4 | 업무 |
| public retrieve() | L165-177 | E1,open | 서비스 apr.Apr17_CorpDoc.selectByCompanyId(companyId) | 업무 |
| public buildGrid() | L100-112 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L179-181 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('callDate', 100, '신청일자'),  // L104
  gb.text('callEmpNm', 80, '신청자'),  // L105
  gb.text('provideCo', 300, '제공처'),  // L106
  gb.text('purpose', 300, '목적'),  // L107
  gb.long('stampCertCallCnt', 100, '법인인감증명서<br>신청매수'),  // L108
  gb.long('corpRegCallCnt', 100, '법인등기부등본<br>신청매수'),  // L109
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>확인</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

