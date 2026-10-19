# Apr19_Tab_StampList

- 종류: 화면
- 메뉴: 경영관리 > 91. 법인서류 > 구)인감날인대장 (#1508)
- 파일: `client/vi/apr/Apr19_Tab_StampList.java`
- 함께 쓰는 클래스 1개:
  - `Apr19_Edit_StampDate` `client/vi/apr/Apr19_Edit_StampDate.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Apr10_Lookup_Stamp`](../../apr/components/Apr10_Lookup_Stamp.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr19_RelateStamp.modelUpdate` | Apr19_Edit_StampDate:92 | [`Apr19_RelateStamp.java:50`](../../apr/services/Apr19_RelateStamp.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(apr19_relate_stamp)` 동적 INSERT/UPDATE → [`apr19_relate_stamp.selectById`](../../apr/sql/apr19_relate_stamp.md) |
| `apr.Apr19_RelateStamp.selectById` | Apr19_Tab_StampList:242 | [`Apr19_RelateStamp.java:18`](../../apr/services/Apr19_RelateStamp.md) | [`apr19_relate_stamp.selectById`](../../apr/sql/apr19_relate_stamp.md) |
| `apr.Apr19_RelateStamp.selectBySearchText` | Apr19_Tab_StampList:302 | [`Apr19_RelateStamp.java:35`](../../apr/services/Apr19_RelateStamp.md) | [`apr19_relate_stamp.selectBySearchText`](../../apr/sql/apr19_relate_stamp.md) |
| `sys.Sys99_Print.insertRdStampList` | Apr19_Tab_StampList:153 | [`Sys99_Print.java:3181`](../../sys/services/Sys99_Print.md) | [`apr19_relate_stamp.selectBySearchText`](../../apr/sql/apr19_relate_stamp.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`apr17_corp_doc`](../../../db/tables/apr.md), [`apr18_relate_corp_doc`](../../../db/tables/apr.md), [`apr19_relate_stamp`](../../../db/tables/apr.md), [`apr99_appr_del`](../../../db/tables/apr.md), [`sys10_file`](../../../db/tables/sys.md), [`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_emp_kor_nm`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Apr19_Tab_StampList (`client/vi/apr/Apr19_Tab_StampList.java`, 336줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 조회기간: {startDate} ~: {closeDate} 인감선택: {stampField} 검색: {searchText} {outCheckBox} {retrieveButton} {downloadButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `searchText` TextField 빈칸="신청자/제출처/내용/대외문서번호", `outCheckBox` CheckBox, `stampField` LookupTriggerField 빈칸="전체", `editor` Apr01_Edit_ApprDoc, `lookup` Apr19_Edit_StampDate, `lookupStamp` Apr10_Lookup_Stamp
- 그리드 `grid` (buildGrid()):
  - callDate 100 "신청일자" Date
  - callEmpName 100 "신청자" TextCenter
  - stampName 120 "날인인감" Text
  - stampCnt 70 "날인부수" LongCenter
  - outYn 60 "반출" BooleanYn2
  - provideCo 300 "제출처" Text
  - purpose 350 "내용" TextHtml
  - note 250 "비고<br>(날인요청서류)" Text 편집:"#404040"
  - actionCell 55 "문서확인" Cell 편집:actionCell
  - apprCntStr 80 "" Text
  - stampSeq 100 "대외문서번호" TextCenter
  - stampDate 100 "날인일자" Date
  - actionCell 27 " " Cell 편집:actionCell2

#### 이벤트
[E0] 화면 열림 (생성자 L68-101) → settings(), retrieve()
[E1] stampField.TriggerClick (L119) → findLookupStampSeq()
[E2] searchText.KeyPress [Enter] (L125) → retrieve()
[E3] retrieveButton[조회].Select (L133) → retrieve()
[E4] downloadButton[출력/다운로드].Select (L139) → 서비스 sys.Sys99_Print.insertRdStampList(companyId, personId, windowClassName, stampId, startDate, closeDate, outYn, searchText)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieve() | L284-308 | 생성자,E2,E3,buildGrid,findLookupStampSeq | 서비스 apr.Apr19_RelateStamp.selectBySearchText(companyId, startDate, closeDate, stampId, outYn, searchText) | 업무 |
| private findLookupStampSeq() | L310-328 | E1 | 조회창 Apr10_Lookup_Stamp 열기 | 업무 |
| public settings() | L103-191 | 생성자 | 서비스 sys.Sys99_Print.insertRdStampList(companyId, personId, windowClassName, stampId, startDate, closeDate, outYn, searchText), 이벤트 연결, 초기값: startDate=ClientDateUtil.toDate(fromDateStr, closeDate=LoginUser.getToday(, outCheckBox=false("반출만 조회") | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L193-282 | 필드 초기화 | 팝업 Apr01_Edit_ApprDoc 열기, 팝업 Apr19_Edit_StampDate 열기, 미선택 시 alert "연결문서가 없습니다.", 서비스 apr.Apr19_RelateStamp.selectById(relateStampId), 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L330-332 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L333-335 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('callDate', 100, '신청일자'),  // L266
  gb.textCenter('callEmpNm', 100, '신청자'),  // L267
  gb.text('stampNm', 120, '날인인감'),  // L268
  gb.longCenter('stampCnt', 70, '날인부수'),  // L269
  gb.booleanYn2('outYn', 60, '반출'),  // L270
  gb.text('provideCo', 300, '제출처'),  // L271
  // ⚠ 대응 없음 (GridBuilder L272) addTextHtml
  gb.text('note', 250, '비고<br>(날인요청서류)'),  // L273
  // ⚠ 대응 없음 (GridBuilder L274) addCell
  gb.text('apprCntStr', 80, ''),  // L275
  gb.textCenter('stampSeq', 100, '대외문서번호'),  // L277
  gb.date('stampDate', 100, '날인일자'),  // L278
  // ⚠ 대응 없음 (GridBuilder L279) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="download" onClick={() => /* 서비스 sys.Sys99_Print.insertRdStampList(companyId, personId, windowClassName, stampId, startDate, closeDate, outYn, searchText) */}>출력/다운로드</Button>

### Apr19_Edit_StampDate (`client/vi/apr/Apr19_Edit_StampDate.java`, 112줄)

- 입력·하위 화면: `stampDate` MyDateField

#### 이벤트
[E0] 화면 열림 (생성자 L49-73) → getEditor()
[E1] updateButton[저장].Select (L56) → update()
[E2] closeButton[닫기].Select (L62) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L41-47 | 공개 메서드 | 상태 처리 | 업무 |
| private getEditor() | L75-87 | 생성자 | 상태 처리 | 업무 |
| public update() | L89-103 | E1 | 서비스 apr.Apr19_RelateStamp.modelUpdate | 업무 |
| private setHtmlStyle() | L105-107 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L109-111 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

