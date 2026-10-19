# Bbs20_Edit_FloralRequest

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `frm`
- 파일: `client/vi/bbs/Bbs20_Edit_FloralRequest.java`
- 함께 쓰는 클래스 3개:
  - `Bbs21_Lookup_FloralRequestShare` `client/vi/bbs/Bbs21_Lookup_FloralRequestShare.java`
  - `Bbs20_Lookup_OccasionsOption` `client/vi/bbs/Bbs20_Lookup_OccasionsOption.java`
  - `Bbs20_Grid_RelateFile` `client/vi/bbs/Bbs20_Grid_RelateFile.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Emp00_Lookup_SelectMulti`](../../emp/components/Emp00_Lookup_SelectMulti.md), [`Emp00_Lookup_SelectSingle`](../../emp/components/Emp00_Lookup_SelectSingle.md), [`Mkt01_Lookup_Select`](../../mkt/components/Mkt01_Lookup_Select.md), [`Org00_Lookup_SelectMulti`](../../org/components/Org00_Lookup_SelectMulti.md), [`Sys10_Lookup_FileViewer`](../../sys/components/Sys10_Lookup_FileViewer.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `bbs.Bbs20_FloralRequest.modelUpdate` | Bbs20_Edit_FloralRequest:615 | [`Bbs20_FloralRequest.java:75`](../../bbs/services/Bbs20_FloralRequest.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(bbs20_floral_request)` 동적 INSERT/UPDATE → [`bbs20_floral_request.selectById`](../../bbs/sql/bbs20_floral_request.md) |
| `bbs.Bbs20_FloralRequest.selectById` | Bbs20_Edit_FloralRequest:178 | [`Bbs20_FloralRequest.java:23`](../../bbs/services/Bbs20_FloralRequest.md) | [`bbs20_floral_request.selectById`](../../bbs/sql/bbs20_floral_request.md) |
| `bbs.Bbs21_FloralRequestShare.delete` | Bbs21_Lookup_FloralRequestShare:249 | [`Bbs21_FloralRequestShare.java:52`](../../bbs/services/Bbs21_FloralRequestShare.md) | `UpdateDataModel(bbs21_floral_request_share)` 동적 DELETE |
| `bbs.Bbs21_FloralRequestShare.deleteDefaultShare` | Bbs20_Edit_FloralRequest:552 | [`Bbs21_FloralRequestShare.java:42`](../../bbs/services/Bbs21_FloralRequestShare.md) | [`bbs21_floral_request_share.deleteByFloralRequestId`](../../bbs/sql/bbs21_floral_request_share.md) |
| `bbs.Bbs21_FloralRequestShare.insertDefaultShare` | Bbs20_Edit_FloralRequest:536 | [`Bbs21_FloralRequestShare.java:33`](../../bbs/services/Bbs21_FloralRequestShare.md) | [`bbs21_floral_request_share.insertDefaultShare`](../../bbs/sql/bbs21_floral_request_share.md), [`bbs21_floral_request_share.selectShareInfo`](../../bbs/sql/bbs21_floral_request_share.md) |
| `bbs.Bbs21_FloralRequestShare.selectByFloralRequestId` | Bbs21_Lookup_FloralRequestShare:310 | [`Bbs21_FloralRequestShare.java:22`](../../bbs/services/Bbs21_FloralRequestShare.md) | [`bbs21_floral_request_share.selectByFloralRequestId`](../../bbs/sql/bbs21_floral_request_share.md) |
| `bbs.Bbs21_FloralRequestShare.selectShareInfo` | Bbs21_Lookup_FloralRequestShare:277 | [`Bbs21_FloralRequestShare.java:28`](../../bbs/services/Bbs21_FloralRequestShare.md) | [`bbs21_floral_request_share.selectShareInfo`](../../bbs/sql/bbs21_floral_request_share.md) |
| `bbs.Bbs21_FloralRequestShare.update` | Bbs21_Lookup_FloralRequestShare:263 | [`Bbs21_FloralRequestShare.java:47`](../../bbs/services/Bbs21_FloralRequestShare.md) | `UpdateDataModel(bbs21_floral_request_share)` 동적 INSERT/UPDATE → [`bbs21_floral_request_share.selectById`](../../bbs/sql/bbs21_floral_request_share.md) |
| `bbs.Bbs22_FloralMessage.getMessage` | Bbs20_Edit_FloralRequest:507 | [`Bbs22_FloralMessage.java:30`](../../bbs/services/Bbs22_FloralMessage.md) | [`bbs22_floral_message.getMessage`](../../bbs/sql/bbs22_floral_message.md) |
| `emp.Emp00_TransInfo.selectByTitleCode` | Bbs20_Edit_FloralRequest:110 | [`Emp00_TransInfo.java:98`](../../emp/services/Emp00_TransInfo.md) | [`emp00_trans_info.selectByTitleCode`](../../emp/sql/emp00_trans_info.md) |
| `sys.Sys10_File.selectByParentId` | Bbs20_Grid_RelateFile:201 | [`Sys10_File.java:51`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |
| `sys.Sys11_RelateFile.checkFileDelete` | Bbs20_Grid_RelateFile:229 | [`Sys11_RelateFile.java:59`](../../sys/services/Sys11_RelateFile.md) | [`sys11_relate_file.checkFileDelete01`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete02`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete03`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.deleteRelateFile`](../../sys/sql/sys11_relate_file.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr99_appr_del`](../../../db/tables/apr.md), [`bbs20_floral_request`](../../../db/tables/bbs.md), [`bbs21_floral_request_share`](../../../db/tables/bbs.md), [`bbs22_floral_message`](../../../db/tables/bbs.md), [`crm14_share_default`](../../../db/tables/crm.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md), [`sys01_company`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_create_seq`, `f_emp_kor_nm`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Bbs20_Edit_FloralRequest (`client/vi/bbs/Bbs20_Edit_FloralRequest.java`, 762줄)

- 입력·하위 화면: `privateYn` CheckBox, `floralRequestId` LongField, `companyId` LongField, `personId` LongField, `personName` TextField, `occasionsCode` TextField, `message` TextField, `sendCompany` TextField, `sendEmp` TextField, `rcvCompany` TextField 빈칸="ABC자산운용", `rcvEmp` TextField 빈칸="홍길동", `rcvPos` TextField, `rcvDept` TextField, `rcvTel` TextField, `rcvAddr` TextField, `shareInfo` TextField, `reason` TextField, `addInfo` TextField 빈칸="구분값에 따라 자동으로 입력됩니다", `requests` TextField 빈칸="예, 동양난으로 보내주세요", `sendRequestTime` TextField 빈칸="오전/오후/즉시/특정시간", `regDate` MyDateField, `sendRequestDate` MyDateField, `occasionsName` ComboBoxField("OccasionsCode") 빈칸="선택하세요", `lookup` Bbs20_Lookup_OccasionsOption

#### 이벤트
[E0] 화면 열림 (생성자 L387-504) → show()
[E1] sendRequestDate[발송요청일].ValueChange (L240) → getDayKor()
[E2] occasionsName[경조구분].Collapse (L249) → getMessage(), setReasonEmpty()
[E3] loadButton[불러오기].Select (L305) → setHtmlHeaderStyle(), setHtmlContentStyle(), empLoad(), lookupTargetCompany()
[E4] button01[임직원].Select (L320) → empLoad()
[E5] button02[거래처].Select (L327) → lookupTargetCompany()
[E6] shareButton[설정].Select (L336) → lookupShare()
[E7] updateButton[저장].Select (L342) → update()
[E8] closeButton[닫기].Select (L348) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public insert() | L107-161 | 공개 메서드 | 서비스 emp.Emp00_TransInfo.selectByTitleCode(companyId, titleCode) | 업무 |
| public edit() | L163-175 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L177-187 | insert,edit,view | 서비스 bbs.Bbs20_FloralRequest.selectById(floralRequestId) | 업무 |
| public view() | L189-192 | open | 상태 처리 | 업무 |
| public open() | L194-235 | insert,edit,view | 상태 처리 | 업무 |
| private setReasonEmpty() | L356-385 | E2 | 상태 처리 | 업무 |
| private getMessage() | L506-521 | E2 | 서비스 bbs.Bbs22_FloralMessage.getMessage(companyId, code) | 업무 |
| private lookupShare() | L523-533 | E6 | 조회창 Bbs21_Lookup_FloralRequestShare 열기 | 업무 |
| private insertDefaultShare() | L535-549 | lookupTargetCompany | 서비스 bbs.Bbs21_FloralRequestShare.insertDefaultShare(contactId, floralRequestId) | 업무 |
| private deleteDefaultShare() | L551-563 | empLoad,lookupTargetCompany | 서비스 bbs.Bbs21_FloralRequestShare.deleteDefaultShare(contactId, floralRequestId) | 업무 |
| private update() | L565-628 | E7 | 서비스 bbs.Bbs20_FloralRequest.modelUpdate | 업무 |
| private getDayKor() | L630-657 | E1,open | 상태 처리 | 업무 |
| private disabled() | L659-680 | open | 상태 처리 | 업무 |
| private empLoad() | L682-700 | E3,E4 | 조회창 Emp00_Lookup_SelectSingle 열기 | 업무 |
| private lookupTargetCompany() | L702-741 | E3,E5 | 조회창 Mkt01_Lookup_Select 열기 | 업무 |
| private settings() | L237-354 | open | 조회창 Bbs20_Lookup_OccasionsOption 열기, 확인창 표시, 이벤트 연결, 초기값: addInfo=(String, addInfo=null, addInfo=(String, addInfo=null, addInfo=null, occasionsCode=occasionsName.getCode( | UI구성 (이벤트 절로 대체) |
| private setHtmlContentStyle() | L743-745 | E3 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlNonBold() | L747-749 | getDayKor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L751-753 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L755-757 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L759-761 | E3,open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={empLoad}>임직원</Button>
2. <Button type="unknown" onClick={lookupTargetCompany}>거래처</Button>
3. <Button type="register" onClick={() => /* setHtmlHeaderStyle(), setHtmlContentStyle(), empLoad(), lookupTargetCompany() */}>불러오기</Button>
4. <Button type="register" onClick={lookupShare}>설정</Button>
5. <Button type="save" onClick={update}>저장</Button>
6. <Button type="unknown" onClick={hide}>닫기</Button>

### Bbs21_Lookup_FloralRequestShare (`client/vi/bbs/Bbs21_Lookup_FloralRequestShare.java`, 317줄)

- 툴바 `buttonBar`: {hlc}
- 입력·하위 화면: `radio01` Radio, `radio02` Radio, `orgSearch` Org00_Lookup_SelectMulti, `lookupEmpTransInfo` Emp00_Lookup_SelectMulti
- 그리드 `grid` (grid(), 체크박스(다중)):
  - shareName 70 "구분" TextCenter
  - orgName 250 "부서" Text
  - personName 100 "성명" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L76-106) → show()
[E1] updateButton[저장].Select (L83) → update()
[E2] closeButton[닫기].Select (L89) → hide()
[E3] anchor.MouseDown (L122) → retrieve()
[E4] insertButton[행 추가].Select (L136) → insertRow()
[E5] deleteButton[행 삭제].Select (L142) → deleteRow()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L108-111 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L113-117 | 공개 메서드 | 상태 처리 | 업무 |
| private ButtonSetting() | L119-158 | open | 상태 처리 | 업무 |
| package grid() | L160-169 | 필드 초기화 | 상태 처리 | 업무 |
| private openLookupOrgInfo() | L171-196 | insertRow | 조회창 Org00_Lookup_SelectMulti 열기 | 업무 |
| private openLookupEmpInfo() | L198-225 | insertRow | 조회창 Emp00_Lookup_SelectMulti 열기 | 업무 |
| private insertRow() | L227-235 | E4 | 상태 처리 | 업무 |
| private update() | L237-272 | E1 | GridDeleteData bbs.Bbs21_FloralRequestShare.delete, bbs.Bbs21_FloralRequestShare.update | 업무 |
| private updateEnd() | L274-295 | update | 서비스 bbs.Bbs21_FloralRequestShare.selectShareInfo(floralRequestId) | 업무 |
| private deleteRow() | L297-303 | E5 | 상태 처리 | 업무 |
| private retrieve() | L305-311 | E3,open | 서비스 bbs.Bbs21_FloralRequestShare.selectByFloralRequestId(floralRequestId) | 업무 |
| private setHtmlHeaderStyle() | L313-315 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const grid = () => [
  gb.textCenter('shareNm', 70, '구분'),  // L164 SQL 계산 컬럼(selectByFloralRequestId: f_cdnm('ShareCode', bbs21_share_cd, 0, …)
  gb.text('orgNm', 250, '부서'),  // L165 SQL 계산 컬럼(selectByFloralRequestId: f_org_nm(bbs21_org_id, COALESCE(bbs20_r…)
  gb.textCenter('personNm', 100, '성명'),  // L166 SQL 계산 컬럼(selectByFloralRequestId: f_emp_kor_nm(bbs21_person_id))
];
```

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>
3. <Button type="addRow" onClick={insertRow}>행 추가</Button>
4. <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>

### Bbs20_Lookup_OccasionsOption (`client/vi/bbs/Bbs20_Lookup_OccasionsOption.java`, 177줄)

- 툴바 `buttonBar`: {checkBox01} {checkBox02} 상주: {textField01} 발인일: {dateField01}
- 입력·하위 화면: `checkBox01` CheckBox, `checkBox02` CheckBox, `textField01` TextField, `dateField01` MyDateField

#### 이벤트
[E0] 화면 열림 (생성자 L79-86) → settings()
[E1] checkBox01[신랑측].ValueChange [event.getValue()] (L93) → 인라인 L93-110 (new ValueChangeHandler<Boolean>() { @…)
[E2] checkBox02[신부측].ValueChange [event.getValue()] (L113) → 인라인 L113-130 (new ValueChangeHandler<Boolean>() { @…)
[E3] updateButton[확인].Select (L136) → hide()
[E4] cancelButton[닫기].Select (L162) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L42-77 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L88-168 | 생성자 | 이벤트 연결, 초기값: checkBox01=false("신랑측"), checkBox02=false("신부측"), dateField01=LoginUser.getToday( | UI구성 (이벤트 절로 대체) |
| private setHtmlHeaderStyle() | L170-172 | 생성자,settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L174-176 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={hide}>확인</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Bbs20_Grid_RelateFile (`client/vi/bbs/Bbs20_Grid_RelateFile.java`, 261줄)

- 툴바 `buttonBar`: {updateButton} {fileUploadForm}
- 입력·하위 화면: `viewer` Sys10_Lookup_FileViewer
- 그리드 `fileGrid` (buildApprFileGrid(), 체크박스):
  - fileName 300 "첨부파일명" Text
  - actionCell 40 "받기" Cell 편집:downloadCell
  - actionCell 40 "삭제" Cell 편집:deleteCell
  - actionCell 40 "보기" Cell 편집:viewCell

#### 이벤트
[E0] 화면 열림 (생성자 L53-101) → settings()
[E1] fileUploadForm.SubmitComplete (L63) → resetFileUpload(), retrieve()
[E2] fileUpload.Change (L71) → 인라인 L71-78 (new ChangeHandler() { @Override publi…)
[E3] fileDeleteForm.SubmitComplete (L81) → retrieve()
[E4] updateButton[파일업로드].Select (L105) → 인라인 L105-110 (new SelectHandler(){ @Override public…)
[E5] fileUpload.Change (L216) → 인라인 L216-223 (new ChangeHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private buildApprFileGrid() | L113-148 | 필드 초기화 | 조회창 Sys10_Lookup_FileViewer 열기 | 업무 |
| public setButtonName() | L150-188 | 공개 메서드 | LabelHtml 래퍼 | 업무 |
| public disabled() | L190-193 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L195-207 | E1,E3,checkFileDelete | 서비스 sys.Sys10_File.selectByParentId(parentId) | 업무 |
| private resetFileUpload() | L209-224 | E1 | 상태 처리 | 업무 |
| private checkFileDelete() | L226-251 | buildApprFileGrid | 서비스 sys.Sys11_RelateFile.checkFileDelete(fileId, parentId) | 업무 |
| public getServiceResult() | L254-260 | checkFileDelete | 상태 처리 | 업무 |
| private settings() | L103-111 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |

#### Grid Spec
```javascript
const buildApprFileGrid = () => [
  gb.text('fileNm', 300, '첨부파일명'),  // L142
  // ⚠ 대응 없음 (GridBuilder L143) addCell
  // ⚠ 대응 없음 (GridBuilder L144) addCell
  // ⚠ 대응 없음 (GridBuilder L145) addCell
];
```

#### 사용된 버튼들
1. <Button type="upload" onClick={() => /* 인라인 L105-110 (new SelectHandler(){ @Override public…) */}>파일업로드</Button>

