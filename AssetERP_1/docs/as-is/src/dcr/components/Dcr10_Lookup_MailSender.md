# Dcr10_Lookup_MailSender

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `apr`, `biz`, `emp`
- 파일: `client/vi/dcr/Dcr10_Lookup_MailSender.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Cmp10_Lookup_MailBookList`](../../cmp/components/Cmp10_Lookup_MailBookList.md), [`Emp10_Lookup_MailAddress`](../../emp/components/Emp10_Lookup_MailAddress.md), [`Emp10_Lookup_MailRetrieve`](../../emp/components/Emp10_Lookup_MailRetrieve.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `cmp.Cmp10_MailBook.selectByPersonId` | Dcr10_Lookup_MailSender:393 | [`Cmp10_MailBook.java:32`](../../cmp/services/Cmp10_MailBook.md) | [`cmp10_mail_book.selectByPersonId`](../../cmp/sql/cmp10_mail_book.md) |
| `dcr.Dcr10_MailHistory.insertMailHistory` | Dcr10_Lookup_MailSender:568 | [`Dcr10_MailHistory.java:94`](../../dcr/services/Dcr10_MailHistory.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`dcr10_mail_history.insertMailHistory`](../../dcr/sql/dcr10_mail_history.md), [`dcr11_mail_file_history.insertMailFileHistory`](../../dcr/sql/dcr11_mail_file_history.md) |
| `emp.Emp01_Person.selectByPersonId` | Dcr10_Lookup_MailSender:411 | [`Emp01_Person.java:81`](../../emp/services/Emp01_Person.md) | [`emp01_person.selectByPersonId`](../../emp/sql/emp01_person.md) |
| `sys.Sys10_File.selectApprRelateDoc` | Dcr10_Lookup_MailSender:226 | [`Sys10_File.java:155`](../../sys/services/Sys10_File.md) | [`sys10_file.selectApprRelateDoc`](../../sys/sql/sys10_file.md) |
| `utils.mail.SendMailSMTP.sendMailSession` | Dcr10_Lookup_MailSender:507 | [`SendMailSMTP.java:73`](../../utils/services/mail.SendMailSMTP.md) | [`cmp10_mail_book.selectByEmailAddress`](../../cmp/sql/cmp10_mail_book.md), [`emp00_trans_info.getPersonInfo`](../../emp/sql/emp00_trans_info.md), [`sys01_company.selectById`](../../sys/sql/sys01_company.md), [`sys01_company.selectByPersonId`](../../sys/sql/sys01_company.md), [`sys10_file.selectByFileId`](../../sys/sql/sys10_file.md) |
| `utils.mail.SendMailSMTP.sendMailSessionTest` | Dcr10_Lookup_MailSender:507 | [`SendMailSMTP.java:101`](../../utils/services/mail.SendMailSMTP.md) | [`cmp10_mail_book.selectByEmailAddress`](../../cmp/sql/cmp10_mail_book.md), [`emp00_trans_info.getPersonInfo`](../../emp/sql/emp00_trans_info.md), [`sys01_company.selectById`](../../sys/sql/sys01_company.md), [`sys01_company.selectByPersonId`](../../sys/sql/sys01_company.md), [`sys10_file.selectByFileId`](../../sys/sql/sys10_file.md) |

## 테이블

[`apr05_relate_doc`](../../../db/tables/apr.md), [`cmp10_mail_book`](../../../db/tables/cmp.md), [`cmp11_mail_role`](../../../db/tables/cmp.md), [`dcr10_mail_history`](../../../db/tables/dcr.md), [`dcr11_mail_file_history`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys01_company`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_create_seq`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_org_parent_info_nm`, `f_sysdate`, `f_today`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Dcr10_Lookup_MailSender (`client/vi/dcr/Dcr10_Lookup_MailSender.java`, 609줄)

- 입력·하위 화면: `mailInfo` TextField, `sender1` TextField, `sender2` TextField, `receiver` TextField, `ccReceiver` TextField, `title` TextField, `privacyInfoBox` CheckBox, `radio1` Radio, `radio2` Radio, `mail` Emp10_Lookup_MailRetrieve
- 그리드 `fileGrid` (buildGrid(), 체크박스):
  - fileName 500 "첨부파일" Text
  - actionCell 70 "받기" Cell 편집:downloadCell
  - actionCell 70 "삭제" Cell 편집:deleteCell

#### 이벤트
[E0] 화면 열림 (생성자 L154-237) → settings(), show()
[E1] toggle.ValueChange (L268) → 메시지 "공용메일 사용권한이 없습니다"
[E2] sender1Button[본인메일].Select (L301) → retrieve()
[E3] sender2Button[공용메일].Select (L313) → 인라인 L313-325 (new SelectHandler() { @Override publi…)
[E4] receiverButton[주소록].Select (L326) → setReceiver()
[E5] ccReceiverButton[주소록].Select (L338) → setReceiver()
[E6] confirmButton[보내기].Select (L349) → privacyInfoChk()
[E7] closeButton[닫기].Select (L355) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L111-115 | 공개 메서드 | 상태 처리 | 업무 |
| public certOpen() | L117-128 | 공개 메서드 | 상태 처리 | 업무 |
| public erpFeeChargeOpen() | L130-151 | 공개 메서드 | 상태 처리 | 업무 |
| private checkSender2() | L392-408 | open,certOpen,erpFeeChargeOpen | 서비스 cmp.Cmp10_MailBook.selectByPersonId(personId) | 업무 |
| private retrieve() | L410-426 | E2,open,certOpen,erpFeeChargeOpen | 서비스 emp.Emp01_Person.selectByPersonId(personId) | 업무 |
| private setReceiver() | L428-437 | E4,E5 | 상태 처리 | 업무 |
| private setReceiver() | L439-444 | E4,E5 | 상태 처리 | 업무 |
| private privacyInfoChk() | L446-464 | E6 | 상태 처리 | 업무 |
| private sendMailSMTP() | L466-535 | privacyInfoChk | 상태 처리 | 업무 |
| private sendMail() | L537-541 | sendMailSMTP | 상태 처리 | 업무 |
| private failMail() | L543-547 | sendMailSMTP | 상태 처리 | 업무 |
| private addLog() | L549-586 | sendMailSMTP | 서비스 dcr.Dcr10_MailHistory.insertMailHistory(fileList) | 업무 |
| private settings() | L239-361 | 생성자 | 조회창 Emp10_Lookup_MailRetrieve 열기, 조회창 Cmp10_Lookup_MailBookList 열기, 조회창 Emp10_Lookup_MailAddress 열기, 이벤트 연결, 초기값: privacyInfoBox=false("전자서명에 내선/휴대폰 번호 추가"), radio1=true("1"), radio2=false("2"), privacyInfoBox=false("전자서명에 내선/휴대폰 번호 추가"), radio1=true("1"), radio2=false("2"), sender2=resultModel.getEmailAddr( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L363-390 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlStyle() | L598-600 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L602-604 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L606-608 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('fileNm', 500, '첨부파일'),  // L385
  // ⚠ 대응 없음 (GridBuilder L386) addCell
  // ⚠ 대응 없음 (GridBuilder L387) addCell
];
```

#### 사용된 버튼들
1. <Button type="unknown" onClick={privacyInfoChk}>보내기</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>
3. <Button type="unknown" onClick={retrieve}>본인메일</Button>
4. <Button type="unknown" onClick={() => /* 인라인 L313-325 (new SelectHandler() { @Override publi…) */}>공용메일</Button>
5. <Button type="unknown" onClick={setReceiver}>주소록</Button>
6. <Button type="unknown" onClick={setReceiver}>주소록</Button>

