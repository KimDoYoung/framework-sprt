# Apr19_Tab_StampFileCheck

- 종류: 화면
- 메뉴: 경영관리 > 91. 법인서류 > 구)인감날인본 업로드확인 (#1509)
- 파일: `client/vi/apr/Apr19_Tab_StampFileCheck.java`
- 함께 쓰는 클래스 1개:
  - `Apr19_Lookup_RelateAppr` `client/vi/apr/Apr19_Lookup_RelateAppr.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Apr10_Lookup_Stamp`](../../apr/components/Apr10_Lookup_Stamp.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr18_RelateCorpDoc.selectByCorpDocId` | Apr19_Lookup_RelateAppr:152 | [`Apr18_RelateCorpDoc.java:26`](../../apr/services/Apr18_RelateCorpDoc.md) | [`apr18_relate_corp_doc.selectByCorpDocId`](../../apr/sql/apr18_relate_corp_doc.md) |
| `apr.Apr19_RelateStamp.selectByStampCheckList` | Apr19_Tab_StampFileCheck:176 | [`Apr19_RelateStamp.java:45`](../../apr/services/Apr19_RelateStamp.md) | [`apr19_relate_stamp.selectByStampCheckList`](../../apr/sql/apr19_relate_stamp.md) |
| `apr.Apr19_RelateStamp.update` | Apr19_Tab_StampFileCheck:283 | [`Apr19_RelateStamp.java:63`](../../apr/services/Apr19_RelateStamp.md) | `UpdateDataModel(apr19_relate_stamp)` 동적 INSERT/UPDATE → [`apr19_relate_stamp.selectById`](../../apr/sql/apr19_relate_stamp.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`apr17_corp_doc`](../../../db/tables/apr.md), [`apr18_relate_corp_doc`](../../../db/tables/apr.md), [`apr19_relate_stamp`](../../../db/tables/apr.md), [`sys10_file`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_emp_kor_nm`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Apr19_Tab_StampFileCheck (`client/vi/apr/Apr19_Tab_StampFileCheck.java`, 302줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 신청일자: {startDate} ~: {closeDate} 인감선택: {stampField} {checkYn} {retrieveButton} {confirmButton} {cancelButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `checkYn` CheckBox, `stampField` LookupTriggerField 빈칸="전체", `lookup` Apr19_Lookup_RelateAppr, `lookupStamp` Apr10_Lookup_Stamp
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - callDate 100 "신청일자" Date
  - callEmpName 100 "신청자" TextCenter
  - stampName 120 "날인인감" Text
  - stampCnt 70 "날인부수" LongCenter
  - provideCo 300 "제출처" Text
  - purpose 350 "내용" TextHtml
  - apprCntStr 80 "연관문서" Text
  - actionCell 30 " " Cell 편집:actionCell
  - stampDate 100 "날인일자" Date
  - stampFileYnStr 100 "날인본<br>첨부여부" TextCenter
  - confirmDate 100 "확인일자" Date
  - confirmerName 100 "확인자" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L67-97) → settings(), retrieve()
[E1] stampField.TriggerClick (L114) → findLookupStampSeq()
[E2] retrieveButton[조회].Select (L120) → retrieve()
[E3] confirmButton[확인].Select (L126) → confirmChk()
       └ [E5] msgBox.DialogHide [YES] (L220) → confirm()
       └ [E6] msgBox.DialogHide [YES] (L250) → confirm()
[E4] cancelButton[확인취소].Select (L132) → confirmChk()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieve() | L166-182 | 생성자,E2,findLookupStampSeq,confirm | 서비스 apr.Apr19_RelateStamp.selectByStampCheckList(companyId, startDate, closeDate, stampId, notStampFileYn) | 업무 |
| private findLookupStampSeq() | L184-202 | E1 | 조회창 Apr10_Lookup_Stamp 열기 | 업무 |
| private confirmChk() | L204-266 | E3,E4 | 미선택 시 alert "대상을 먼저 선택해주세요" → 확인창 E5 | 업무 |
| private confirm() | L268-293 | E5,E6 | 서비스 apr.Apr19_RelateStamp.update | 업무 |
| public settings() | L99-138 | 생성자 | 이벤트 연결, 초기값: checkYn=true("날인본 미첨부 내역만 조회"), startDate=ClientDateUtil.toDate(fromDateStr, closeDate=LoginUser.getToday( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L140-164 | 필드 초기화 | 조회창 Apr19_Lookup_RelateAppr 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L295-297 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L299-301 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('callDate', 100, '신청일자'),  // L150
  gb.textCenter('callEmpNm', 100, '신청자'),  // L151
  gb.text('stampNm', 120, '날인인감'),  // L152
  gb.longCenter('stampCnt', 70, '날인부수'),  // L153
  gb.text('provideCo', 300, '제출처'),  // L154
  // ⚠ 대응 없음 (GridBuilder L155) addTextHtml
  gb.text('apprCntStr', 80, '연관문서'),  // L156
  // ⚠ 대응 없음 (GridBuilder L157) addCell
  gb.date('stampDate', 100, '날인일자'),  // L158
  // ⚠DB없음 L159 stampFileYnStr 100 "날인본<br>첨부여부" (apr10_stamp_file_yn_str 컬럼 없음)
  gb.date('confirmDate', 100, '확인일자'),  // L160
  gb.textCenter('confirmerNm', 100, '확인자'),  // L161
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirmChk}>확인</Button>
3. <Button type="cancel" onClick={confirmChk}>확인취소</Button>

### Apr19_Lookup_RelateAppr (`client/vi/apr/Apr19_Lookup_RelateAppr.java`, 163줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: {retrieveButton}
- 입력·하위 화면: `editor` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid(), 체크박스):
  - title 370 "제목" Text
  - regDate 90 "등록일" Date
  - effectDate 90 "시행일" Date
  - regEmpName 80 "등록자" TextCenter
  - statusName 80 "상신상태" TextCenter
  - actionCell 70 "상세보기" Cell 편집:actionCell

#### 이벤트
[E0] 화면 열림 (생성자 L49-77) → settings()
[E1] retrieveButton[새로고침].Select (L80) → retrieve()
[E2] closeButton[닫기].Select (L86) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L43-47 | 공개 메서드 | 상태 처리 | 업무 |
| private retrieve() | L147-158 | E1,open | 서비스 apr.Apr18_RelateCorpDoc.selectByCorpDocId(corpDocId) | 업무 |
| private settings() | L79-92 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L94-145 | 필드 초기화 | 팝업 Apr01_Edit_ApprDoc 열기, 미선택 시 alert "연결문서가 없습니다.", 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L160-162 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('title', 370, '제목'),  // L134 SQL 계산 컬럼(selectByCorpDocId: b.apr01_title)
  gb.date('regDate', 90, '등록일'),  // L135 SQL 계산 컬럼(selectByCorpDocId: b.apr01_reg_date)
  gb.date('effectDate', 90, '시행일'),  // L136 SQL 계산 컬럼(selectByCorpDocId: b.apr01_effect_date)
  gb.textCenter('regEmpNm', 80, '등록자'),  // L137 SQL 계산 컬럼(selectByCorpDocId: f_emp_kor_nm(b.apr01_reg_emp_id))
  gb.textCenter('statusNm', 80, '상신상태'),  // L138 SQL 계산 컬럼(selectByCorpDocId: f_cdnm('AprStatusCode', b.apr01_status_…)
  // ⚠ 대응 없음 (GridBuilder L139) addCell
];
```

#### 사용된 버튼들
1. <Button type="reset" onClick={retrieve}>새로고침</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

