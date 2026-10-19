# MyInfoPopup

- 종류: 프레임 (로그인·메인 화면 등, 메뉴로 열지 않음)
- 파일: `client/vi/MyInfoPopup.java`
- 함께 쓰는 클래스 2개:
  - `Sys25_Lookup_Password` `client/vi/sys/Sys25_Lookup_Password.java`
  - `LoginUser` `client/vi/LoginUser.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Emp10_Lookup_MailRetrieve`](../../emp/components/Emp10_Lookup_MailRetrieve.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `emp.Emp02_Others.updatePerson` | MyInfoPopup:251 | [`Emp02_Others.java:30`](../../emp/services/Emp02_Others.md) | [`emp02_others.upsert`](../../emp/sql/emp02_others.md) |
| `sys.Sys01_Company.selectById` | MyInfoPopup:175 | [`Sys01_Company.java:20`](../../sys/services/Sys01_Company.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys01_company.selectById`](../../sys/sql/sys01_company.md), [`sys01_company.updateMainImageId`](../../sys/sql/sys01_company.md) |
| `sys.Sys25_Password.checkPassword` | Sys25_Lookup_Password:206 | [`Sys25_Password.java:57`](../../sys/services/Sys25_Password.md) | [`sys25_password.checkPassword`](../../sys/sql/sys25_password.md) |
| `sys.Sys25_Password.checkPasswordRule` | Sys25_Lookup_Password:222, Sys25_Lookup_Password:254 | [`Sys25_Password.java:67`](../../sys/services/Sys25_Password.md) | [`sys25_password.checkPasswordRule`](../../sys/sql/sys25_password.md) |
| `sys.Sys25_Password.extension` | Sys25_Lookup_Password:306 | [`Sys25_Password.java:118`](../../sys/services/Sys25_Password.md) | [`sys25_password.extension`](../../sys/sql/sys25_password.md), [`sys25_password.getPersonId`](../../sys/sql/sys25_password.md) |
| `sys.Sys25_Password.insert` | Sys25_Lookup_Password:285 | [`Sys25_Password.java:79`](../../sys/services/Sys25_Password.md) | [`emp01_person.selectByCompanyCode`](../../emp/sql/emp01_person.md), [`sys25_password.checkInsert`](../../sys/sql/sys25_password.md), [`sys25_password.insert`](../../sys/sql/sys25_password.md), [`sys25_password.updatePassword`](../../sys/sql/sys25_password.md) |

## 테이블

[`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`sys01_company`](../../../db/tables/sys.md), [`sys25_password`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_create_seq`, `f_password_rule`, `f_sysdate`, `f_today`, `to_decrypts`, `to_encrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### MyInfoPopup (`client/vi/MyInfoPopup.java`, 276줄)

- 입력·하위 화면: `emailOther` TextField, `chnName` TextField, `engName` TextField, `homeTelNo` TextField, `decCtzNo` TextField, `familyDscr` TextField, `zipCode` TextField, `zipAddress` TextField, `zipDetail` TextField, `lunarCode` TextField, `militaryCode` TextField, `marriageCode` TextField, `birthday` MyDateField, `lunarName` ComboBoxField("EmpLunarCode"), `militaryName` ComboBoxField("EmpMilitaryCode"), `marriageName` ComboBoxField("EmpMaritalStatus"), `mail` Emp10_Lookup_MailRetrieve, `pwdModifyLookup` Sys25_Lookup_Password

#### 이벤트
[E0] 화면 열림 (생성자 L81-116) → settings(), getEditor(), getEditor2(), editMyInfo(), show()
[E1] image.Click (L120) → 인라인 L120-138 (new ClickHandler() { @Override public…)
[E2] fileUploadField.Change (L130) → 인라인 L130-135 (new ChangeHandler() { @Override publi…)
[E3] picUploadForm.SubmitComplete (L142) → 인라인 L142-147 (new SubmitCompleteHandler() { @Overri…)
[E4] updateButton[저장].Select (L148) → update()
[E5] closeButton[닫기].Select (L154) → hide()
[E6] mailButton[회사메일].Select (L160) → 인라인 L160-171 (new SelectHandler(){ @Override public…)
[E7] passwdButton[비밀번호].Select (L172) → getServiceResult()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private editMyInfo() | L192-196 | 생성자 | 상태 처리 | 업무 |
| private getEditor() | L198-215 | 생성자 | 상태 처리 | 업무 |
| private getEditor2() | L217-243 | 생성자 | 상태 처리 | 업무 |
| public update() | L245-255 | E4 | 서비스 emp.Emp02_Others.updatePerson(empOthersModel) | 업무 |
| public getServiceResult() | L258-267 | E7 | 상태 처리 | 업무 |
| private settings() | L118-190 | 생성자 | 조회창 Emp10_Lookup_MailRetrieve 열기, 조회창 Sys25_Lookup_Password 열기, 서비스 sys.Sys01_Company.selectById(companyId), 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L269-271 | getEditor,getEditor2 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L273-275 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>
3. <Button type="unknown" onClick={() => /* 인라인 L160-171 (new SelectHandler(){ @Override public…) */}>회사메일</Button>
4. <Button type="unknown" onClick={getServiceResult}>비밀번호</Button>

### Sys25_Lookup_Password (`client/vi/sys/Sys25_Lookup_Password.java`, 354줄)

- 입력·하위 화면: `beforePassword` PasswordField, `afterPassword1` PasswordField, `afterPassword2` PasswordField

#### 이벤트
[E0] 화면 열림 (생성자 L76-90) → getEditor(), show()
[E1] beforePassword[현재 비밀번호].KeyPress [checkCapsLock(event)] (L99) → checkCapsLock()
[E2] afterPassword1[변경 비밀번호].KeyPress [checkCapsLock(event)] (L111) → checkCapsLock()
[E3] afterPassword2[비밀번호 확인].KeyPress [checkCapsLock(event)] (L123) → checkCapsLock()
[E4] updateButton[확인].Select (L135) → insertChcek()
[E5] extensionButton[3개월 후 변경].Select [YES] (L141) → extension()
[E6] msgBox.DialogHide [YES] (L146) → extension()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public openNoExtension() | L58-65 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L67-74 | 공개 메서드 | 상태 처리 | 업무 |
| private setting() | L92-164 | openNoExtension,open | 확인창 표시 | 업무 |
| private getEditor() | L166-202 | 생성자 | 상태 처리 | 업무 |
| public insertChcek() | L205-281 | E4 | 서비스 sys.Sys25_Password.checkPassword, sys.Sys25_Password.checkPasswordRule, sys.Sys25_Password.checkPasswordRule(companyCode, loginId, password, password, password) | 업무 |
| public insert() | L283-303 | insertChcek | 서비스 sys.Sys25_Password.insert(companyCode, loginId, password) | 업무 |
| public extension() | L305-322 | E5,E6 | 서비스 sys.Sys25_Password.extension(companyCode, loginId) | 업무 |
| private checkCapsLock() | L324-336 | E1,E2,E3 | 상태 처리 | 업무 |
| private checkUpperCase() | L338-340 | checkCapsLock | 상태 처리 | 업무 |
| private checkLowerCase() | L342-344 | checkCapsLock | 상태 처리 | 업무 |
| private setHtmlHeaderStyle() | L346-348 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L350-352 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={insertChcek}>확인</Button>
2. <Button type="unknown" onClick={extension}>3개월 후 변경</Button>

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

