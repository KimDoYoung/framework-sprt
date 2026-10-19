# AlarmPopup

- 종류: 프레임 (로그인·메인 화면 등, 메뉴로 열지 않음)
- 파일: `client/vi/AlarmPopup.java`
- 함께 쓰는 클래스 1개:
  - `LoginUser` `client/vi/LoginUser.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Emp10_Lookup_MailAddress`](../../emp/components/Emp10_Lookup_MailAddress.md), [`Emp10_Lookup_MailRetrieve`](../../emp/components/Emp10_Lookup_MailRetrieve.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `emp.Emp01_Person.selectByPersonId` | AlarmPopup:184 | [`Emp01_Person.java:81`](../../emp/services/Emp01_Person.md) | [`emp01_person.selectByPersonId`](../../emp/sql/emp01_person.md) |
| `utils.mail.SendAlarm.insertMailHistory` | AlarmPopup:286 | [`SendAlarm.java:275`](../../utils/services/mail.SendAlarm.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`dcr10_mail_history.insertMailHistory`](../../dcr/sql/dcr10_mail_history.md) |
| `utils.mail.SendAlarm.sendMailSession` | AlarmPopup:245 | [`SendAlarm.java:42`](../../utils/services/mail.SendAlarm.md) | [`emp00_trans_info.getPersonInfo`](../../emp/sql/emp00_trans_info.md), [`sys01_company.selectById`](../../sys/sql/sys01_company.md), [`sys01_company.selectByPersonId`](../../sys/sql/sys01_company.md) |

## 테이블

[`dcr10_mail_history`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys01_company`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_org_parent_info_nm`, `f_sysdate`, `f_today`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### AlarmPopup (`client/vi/AlarmPopup.java`, 315줄)

- 입력·하위 화면: `sender` TextField, `receiver` TextField, `referencer` TextField, `title` TextField, `content` MyTextArea, `privacyInfoBox` CheckBox, `mail` Emp10_Lookup_MailRetrieve

#### 이벤트
[E0] 화면 열림 (생성자 L74-126) → settings(), show()
[E1] senderButton[본인메일].Select (L134) → retrieve()
[E2] receiverButton[주소록].Select (L146) → setReceiver()
[E3] referencerButton[주소록].Select (L158) → setReceiver()
[E4] confirmButton[보내기].Select (L169) → privacyInfoChk()
[E5] closeButton[닫기].Select (L175) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L61-72 | 공개 메서드 | 상태 처리 | 업무 |
| private retrieve() | L183-199 | E1,open | 서비스 emp.Emp01_Person.selectByPersonId(personId) | 업무 |
| private setReceiver() | L201-206 | E2,E3 | 상태 처리 | 업무 |
| private privacyInfoChk() | L208-222 | E4 | 상태 처리 | 업무 |
| private sendMailSMTP() | L224-271 | privacyInfoChk | 상태 처리 | 업무 |
| private sendMail() | L273-277 | sendMailSMTP | 상태 처리 | 업무 |
| private failMail() | L279-283 | sendMailSMTP | 상태 처리 | 업무 |
| private addLog() | L285-302 | sendMailSMTP | 상태 처리 | 업무 |
| private settings() | L128-181 | 생성자 | 조회창 Emp10_Lookup_MailRetrieve 열기, 조회창 Emp10_Lookup_MailAddress 열기, 이벤트 연결, 초기값: privacyInfoBox=false("전자서명에 내선/휴대폰 번호 추가") | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L304-306 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L308-310 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L312-314 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={privacyInfoChk}>보내기</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>
3. <Button type="unknown" onClick={retrieve}>본인메일</Button>
4. <Button type="unknown" onClick={setReceiver}>주소록</Button>
5. <Button type="unknown" onClick={setReceiver}>주소록</Button>

### LoginUser (`client/vi/LoginUser.java`, 331줄)


#### 이벤트

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public getMobile() | L38-40 | 공개 메서드 | 상태 처리 | 업무 |
| public setMobile() | L42-44 | 공개 메서드 | 상태 처리 | 업무 |
| public setToDoDate() | L46-48 | 공개 메서드 | 상태 처리 | 업무 |
| public getToDoDate() | L50-52 | 공개 메서드 | 상태 처리 | 업무 |
| public setSubDomain() | L54-56 | 공개 메서드 | 상태 처리 | 업무 |
| public getSubDomain() | L58-60 | 공개 메서드 | 상태 처리 | 업무 |
| public setMacAddress() | L62-64 | 공개 메서드 | 상태 처리 | 업무 |
| public getMacAddress() | L66-68 | 공개 메서드 | 상태 처리 | 업무 |
| public setIpAddress() | L70-72 | 공개 메서드 | 상태 처리 | 업무 |
| public getIpAddress() | L74-76 | 공개 메서드 | 상태 처리 | 업무 |
| public setMode() | L78-80 | 공개 메서드 | 상태 처리 | 업무 |
| public getMode() | L82-84 | 공개 메서드 | 상태 처리 | 업무 |
| public setSelectDate() | L86-88 | 공개 메서드 | 상태 처리 | 업무 |
| public getSelectDate() | L90-92 | 공개 메서드 | 상태 처리 | 업무 |
| public setConfirmTransId() | L94-96 | 공개 메서드 | 상태 처리 | 업무 |
| public getConfirmTransId() | L98-100 | 공개 메서드 | 상태 처리 | 업무 |
| public setIsManager() | L102-104 | 공개 메서드 | 상태 처리 | 업무 |
| public getIsManager() | L106-108 | 공개 메서드 | 상태 처리 | 업무 |
| public setIsUserManager() | L110-112 | 공개 메서드 | 상태 처리 | 업무 |
| public getIsUserManager() | L114-116 | 공개 메서드 | 상태 처리 | 업무 |
| public setMenuFixYn() | L118-120 | 공개 메서드 | 상태 처리 | 업무 |
| public getMenuFixYn() | L122-124 | 공개 메서드 | 상태 처리 | 업무 |
| public getIsIcam() | L126-132 | 공개 메서드 | 상태 처리 | 업무 |
| public setManagerModel() | L134-137 | 공개 메서드 | 상태 처리 | 업무 |
| public getManagerModel() | L139-141 | 공개 메서드 | 상태 처리 | 업무 |
| public setUserModel() | L143-147 | 공개 메서드 | 상태 처리 | 업무 |
| public getUserModel() | L149-151 | 공개 메서드 | 상태 처리 | 업무 |
| public getCompanyId() | L153-161 | 공개 메서드 | 상태 처리 | 업무 |
| public getUserId() | L163-170 | 공개 메서드 | 상태 처리 | 업무 |
| public getUserIdStr() | L172-179 | 공개 메서드 | 상태 처리 | 업무 |
| public getThemeCode() | L181-183 | 공개 메서드 | 상태 처리 | 업무 |
| public getThemeName() | L185-187 | 공개 메서드 | 상태 처리 | 업무 |
| public getIconColor() | L189-191 | 공개 메서드 | 상태 처리 | 업무 |
| public getUserName() | L193-200 | 공개 메서드 | 상태 처리 | 업무 |
| public getEmpNo() | L202-209 | 공개 메서드 | 상태 처리 | 업무 |
| public getUserInfoString() | L211-224 | 공개 메서드 | 상태 처리 | 업무 |
| public getOrgCodeId() | L226-233 | 공개 메서드 | 상태 처리 | 업무 |
| public getParentCodeId() | L235-237 | 공개 메서드 | 상태 처리 | 업무 |
| public getParentCodeName() | L239-241 | 공개 메서드 | 상태 처리 | 업무 |
| public getMailInfo() | L243-245 | 공개 메서드 | 상태 처리 | 업무 |
| public getSmsId() | L247-249 | 공개 메서드 | 상태 처리 | 업무 |
| public getSmsAPIKey() | L251-253 | 공개 메서드 | 상태 처리 | 업무 |
| public getYear() | L255-257 | getNewYearDay | 상태 처리 | 업무 |
| public getYearMonth() | L259-261 | getMonthFirstDay | 상태 처리 | 업무 |
| public getTodayString() | L263-265 | 공개 메서드 | 상태 처리 | 업무 |
| public getTodayInt() | L267-269 | 공개 메서드 | 상태 처리 | 업무 |
| public getToday() | L271-274 | 공개 메서드 | 상태 처리 | 업무 |
| public getNewYearDay() | L276-278 | 공개 메서드 | 상태 처리 | 업무 |
| public getMonthFirstDay() | L280-282 | 공개 메서드 | 상태 처리 | 업무 |
| public getMenuInfoNoticeList() | L284-286 | 공개 메서드 | 상태 처리 | 업무 |
| public setMenuInfoNoticeList() | L288-290 | 공개 메서드 | 상태 처리 | 업무 |
| public getMenuInfoYn() | L292-294 | 공개 메서드 | 상태 처리 | 업무 |
| public setMenuInfoYn() | L296-298 | 공개 메서드 | 상태 처리 | 업무 |
| public getCompanyModel() | L300-302 | 공개 메서드 | 상태 처리 | 업무 |
| public setCompanyModel() | L304-306 | 공개 메서드 | 상태 처리 | 업무 |
| public getLogoutYn() | L308-310 | 공개 메서드 | 상태 처리 | 업무 |
| public setLogoutYn() | L312-314 | 공개 메서드 | 상태 처리 | 업무 |
| public getMenuList() | L316-318 | 공개 메서드 | 상태 처리 | 업무 |
| public setMenuList() | L320-322 | 공개 메서드 | 상태 처리 | 업무 |
| public getLoginId() | L324-326 | 공개 메서드 | 상태 처리 | 업무 |
| public setLoginId() | L328-330 | 공개 메서드 | 상태 처리 | 업무 |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
버튼 사용하지 않음

