# Apr16_Tab_StampList

- 종류: 화면
- 메뉴: 경영관리 > 91. 법인서류 > 인감날인대장 (#1329)
- 파일: `client/vi/apr/Apr16_Tab_StampList.java`
- 함께 쓰는 클래스 1개:
  - `Apr16_Lookup_UpdateStampDate` `client/vi/apr/Apr16_Lookup_UpdateStampDate.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Apr10_Lookup_Stamp`](../../apr/components/Apr10_Lookup_Stamp.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr16_StampDoc.selectById` | Apr16_Tab_StampList:244 | [`Apr16_StampDoc.java:21`](../../apr/services/Apr16_StampDoc.md) | [`apr16_stamp_doc.selectById`](../../apr/sql/apr16_stamp_doc.md) |
| `apr.Apr16_StampDoc.selectStampByCompanyId` | Apr16_Tab_StampList:300 | [`Apr16_StampDoc.java:51`](../../apr/services/Apr16_StampDoc.md) | [`apr16_stamp_doc.selectStampByCompanyId`](../../apr/sql/apr16_stamp_doc.md) |
| `apr.Apr16_StampDoc.updateStampDate` | Apr16_Lookup_UpdateStampDate:92 | [`Apr16_StampDoc.java:81`](../../apr/services/Apr16_StampDoc.md) | [`apr16_stamp_doc.updateStampDate`](../../apr/sql/apr16_stamp_doc.md) |
| `sys.Sys99_Print.insertRdStampListApr16` | Apr16_Tab_StampList:156 | [`Sys99_Print.java:3233`](../../sys/services/Sys99_Print.md) | [`apr16_stamp_doc.selectStampByCompanyId`](../../apr/sql/apr16_stamp_doc.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`apr15_repr_corp`](../../../db/tables/apr.md), [`apr16_stamp_doc`](../../../db/tables/apr.md), [`apr99_appr_del`](../../../db/tables/apr.md), [`emp01_person`](../../../db/tables/emp.md), [`org10_role_stamp`](../../../db/tables/org.md), [`sys01_company`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md), [`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Apr16_Tab_StampList (`client/vi/apr/Apr16_Tab_StampList.java`, 334줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 조회기간: {startDate} ~: {closeDate} 인감선택: {stampField} 검색: {searchText} {outCheckBox} {retrieveButton} {downloadButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `searchText` TextField 빈칸="신청자/제출처/내용/대외문서번호", `outCheckBox` CheckBox, `stampField` LookupTriggerField 빈칸="전체", `editor` Apr01_Edit_ApprDoc, `lookup` Apr16_Lookup_UpdateStampDate, `lookupStamp` Apr10_Lookup_Stamp
- 그리드 `grid` (buildGrid()):
  - applDate 100 "신청일자" Date
  - applEmpName 100 "신청자" TextCenter
  - stampName 120 "날인인감" Text
  - stampQty 70 "날인부수" LongCenter
  - stampOutYn 60 "반출" BooleanYn2
  - provideCo 300 "제출처" Text
  - purpose 350 "내용" TextHtml
  - note 250 "비고<br>(날인요청서류)" Text 편집:"#404040"
  - apprStatusName 50 "문서<br>보기" DynamicCell 편집:actionCell
  - stampSeq 100 "대외문서번호" TextCenter
  - stampDate 100 "날인일자" Date
  - actionCell 27 " " Cell 편집:actionCell2

#### 이벤트
[E0] 화면 열림 (생성자 L68-101) → settings(), retrieve()
[E1] stampField.TriggerClick (L123) → findLookupStampSeq()
[E2] searchText.KeyPress [Enter] (L129) → retrieve()
[E3] retrieveButton[조회].Select (L137) → retrieve()
[E4] downloadButton[출력/다운로드].Select (L143) → 서비스 sys.Sys99_Print.insertRdStampListApr16(companyId, personId, windowClassName, stampId, startDate, closeDate, outYn, searchText)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieve() | L284-306 | 생성자,E2,E3,buildGrid,findLookupStampSeq | 서비스 apr.Apr16_StampDoc.selectStampByCompanyId(companyId, startDate, closeDate, stampId, outYn, searchText) | 업무 |
| private findLookupStampSeq() | L308-326 | E1 | 조회창 Apr10_Lookup_Stamp 열기 | 업무 |
| public settings() | L103-194 | 생성자 | 서비스 sys.Sys99_Print.insertRdStampListApr16(companyId, personId, windowClassName, stampId, startDate, closeDate, outYn, searchText), 이벤트 연결, 초기값: startDate=fromDate, closeDate=LoginUser.getToday(, outCheckBox=false("반출만 조회") | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L196-282 | 필드 초기화 | 팝업 Apr01_Edit_ApprDoc 열기, 조회창 Apr16_Lookup_UpdateStampDate 열기 → 콜백: unmask, 미선택 시 alert "연결문서가 없습니다.", 서비스 apr.Apr16_StampDoc.selectById(stampDocId), 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L328-330 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L331-333 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('applDate', 100, '신청일자'),  // L268
  gb.textCenter('applEmpNm', 100, '신청자'),  // L269 SQL 계산 컬럼(selectStampByCompanyId: emp01_kor_nm)
  gb.text('stampNm', 120, '날인인감'),  // L270 SQL 계산 컬럼(selectStampByCompanyId: apr10_stamp_nm)
  gb.longCenter('stampQty', 70, '날인부수'),  // L271
  gb.booleanYn2('stampOutYn', 60, '반출'),  // L272
  gb.text('provideCo', 300, '제출처'),  // L273
  // ⚠ 대응 없음 (GridBuilder L274) addTextHtml
  gb.text('note', 250, '비고<br>(날인요청서류)'),  // L275
  // ⚠ 대응 없음 (GridBuilder L276) addDynamicCell
  gb.textCenter('stampSeq', 100, '대외문서번호'),  // L277 SQL 계산 컬럼(selectStampByCompanyId: apr01_stamp_seq)
  gb.date('stampDate', 100, '날인일자'),  // L278
  // ⚠ 대응 없음 (GridBuilder L279) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="download" onClick={() => /* 서비스 sys.Sys99_Print.insertRdStampListApr16(companyId, personId, windowClassName, stampId, startDate, closeDate, outYn, searchText) */}>출력/다운로드</Button>

### Apr16_Lookup_UpdateStampDate (`client/vi/apr/Apr16_Lookup_UpdateStampDate.java`, 112줄)

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
| public update() | L89-103 | E1 | 서비스 apr.Apr16_StampDoc.updateStampDate | 업무 |
| private setHtmlStyle() | L105-107 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L109-111 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

