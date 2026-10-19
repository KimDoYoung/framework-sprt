# Apr01_Tab_StampSeq

- 종류: 화면
- 메뉴: 문서작성 > 04. 전자결재 > (X)인감대장 (#1020, 미사용)
- 파일: `client/vi/apr/Apr01_Tab_StampSeq.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Apr10_Lookup_Stamp`](../../apr/components/Apr10_Lookup_Stamp.md), [`Emp00_Lookup_SelectSingle`](../../emp/components/Emp00_Lookup_SelectSingle.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectByApprDate` | Apr01_Tab_StampSeq:285 | [`Apr01_Appr.java:1071`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectByApprDate`](../../apr/sql/apr01_appr.md) |
| `apr.Apr01_Appr.updatePutSealEmpId` | Apr01_Tab_StampSeq:260 | [`Apr01_Appr.java:1230`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.updatePutSeal`](../../apr/sql/apr01_appr.md) |
| `org.Org00_OrgInfo.selectByIgnoreStamp` | Apr01_Tab_StampSeq:140 | [`Org00_OrgInfo.java:154`](../../org/services/Org00_OrgInfo.md) | [`org00_org_info.selectByIgnoreStamp`](../../org/sql/org00_org_info.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr04_appr_step`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`apr99_appr_del`](../../../db/tables/apr.md), [`org00_org_info`](../../../db/views.md)

## DB 함수

`f_emp_kor_nm`, `f_sysdate`, `f_trunc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Apr01_Tab_StampSeq (`client/vi/apr/Apr01_Tab_StampSeq.java`, 314줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 조회구간: {startDate} ~: {endDate} 인감선택: {selectStampField} {retrieveButton}
- 입력·하위 화면: `startDate` MyDateField, `endDate` MyDateField, `selectStampField` LookupTriggerField, `editor` Apr01_Edit_ApprDoc, `lookupEmpInfo` LookupTriggerField, `lookupEmpTransInfo` Emp00_Lookup_SelectSingle, `lookupStamp` Apr10_Lookup_Stamp
- 그리드 `grid` (buildGrid(), 체크박스):
  - stampSeqText 70 "대장번호" Text
  - apprDate 100 "신청일자" Date
  - regEmpName 80 "신청자" Text
  - apprEmpName 80 "최종결재자" Text
  - title 500 "내용" TextHtml
  - stampName 200 "사용인감" Text
  - receiveName 300 "제출처" Text
  - actionCell 80 "문서확인" Cell 편집:editDocCell
  - actionCell 80 "확인자입력" Cell 편집:updateCell
  - putSealEmpName 80 "인감확인자" Text
  - putSealDate 160 "확인일시" DateTime

#### 이벤트
[E0] 화면 열림 (생성자 L79-110) → settings(), setGridColmun()
[E1] selectStampField.TriggerClick (L123) → findLookupStampSeq()
[E2] retrieveButton[조회].Select (L129) → retrieve()
[E3] lookupEmpInfo.TriggerClick (L208) → 인라인 L208-221 (new TriggerClickHandler(){ @Override …)
[E4] messageBox.DialogHide [YES] (L242) → updatePutSeal()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setGridColmun() | L137-161 | 생성자 | 서비스 org.Org00_OrgInfo.selectByIgnoreStamp(ignoreStamp, orgCodeId) | 업무 |
| private updatePutSealConfirm() | L239-251 | buildGrid | 확인창 표시 | 업무 |
| private updatePutSeal() | L253-274 | E4 | 서비스 apr.Apr01_Appr.updatePutSealEmpId(apprModel) | 업무 |
| private retrieve() | L276-291 | E2,setGridColmun | 서비스 apr.Apr01_Appr.selectByApprDate(startDate, endDate, stampId, companyId) | 업무 |
| private findLookupStampSeq() | L293-309 | E1 | 조회창 Apr10_Lookup_Stamp 열기 | 업무 |
| private settings() | L112-135 | 생성자 | 이벤트 연결, 초기값: startDate=fromDate, endDate=new Date( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L163-237 | 필드 초기화 | 팝업 Apr01_Edit_ApprDoc 열기, 조회창 Emp00_Lookup_SelectSingle 열기 → 콜백: unmask, 미선택 시 alert "해당문서는 폐기되어 열람이 불가능합니다", 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L311-313 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('stampSeqText', 70, '대장번호'),  // L224
  gb.date('apprDate', 100, '신청일자'),  // L225
  gb.text('regEmpNm', 80, '신청자'),  // L226
  gb.text('apprEmpName', 80, '최종결재자'),  // L227
  // ⚠ 대응 없음 (GridBuilder L228) addTextHtml
  gb.text('stampName', 200, '사용인감'),  // L229
  gb.text('receiveNm', 300, '제출처'),  // L230
  // ⚠ 대응 없음 (GridBuilder L231) addCell
  // ⚠ 대응 없음 (GridBuilder L232) addCell
  gb.text('putSealEmpName', 80, '인감확인자'),  // L233
  gb.dateTime('putSealDate', 160, '확인일시'),  // L234
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

