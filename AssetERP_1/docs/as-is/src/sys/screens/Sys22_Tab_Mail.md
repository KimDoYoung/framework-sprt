# Sys22_Tab_Mail

- 종류: 화면
- 파일: `client/vi/sys/Sys22_Tab_Mail.java`
- 함께 쓰는 클래스 2개:
  - `Sys23_Page_MailRole` `client/vi/sys/Sys23_Page_MailRole.java`
  - `Sys22_Lookup_Mail` `client/vi/sys/Sys22_Lookup_Mail.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Emp01_Lookup_PersonModel`](../../emp/components/Emp01_Lookup_PersonModel.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys22_Mail.delete` | Sys22_Tab_Mail:195 | [`Sys22_Mail.java:41`](../../sys/services/Sys22_Mail.md) | `UpdateDataModel(sys22_mail)` 동적 DELETE |
| `sys.Sys22_Mail.modelUpdate` | Sys22_Lookup_Mail:136 | [`Sys22_Mail.java:22`](../../sys/services/Sys22_Mail.md) | [`dbConfig.getEncrypts`](../../utils/sql/dbConfig.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(sys22_mail)` 동적 INSERT/UPDATE → [`sys22_mail.selectById`](../../sys/sql/sys22_mail.md) |
| `sys.Sys22_Mail.selectByCompanyId` | Sys22_Tab_Mail:140 | [`Sys22_Mail.java:17`](../../sys/services/Sys22_Mail.md) | [`sys22_mail.selectByCompanyId`](../../sys/sql/sys22_mail.md) |
| `sys.Sys23_MailRole.delete` | Sys23_Page_MailRole:153 | [`Sys23_MailRole.java:27`](../../sys/services/Sys23_MailRole.md) | `UpdateDataModel(sys23_mail_role)` 동적 DELETE |
| `sys.Sys23_MailRole.selectByMailId` | Sys23_Page_MailRole:107 | [`Sys23_MailRole.java:16`](../../sys/services/Sys23_MailRole.md) | [`sys23_mail_role.selectByMailId`](../../sys/sql/sys23_mail_role.md) |
| `sys.Sys23_MailRole.update` | Sys23_Page_MailRole:147 | [`Sys23_MailRole.java:22`](../../sys/services/Sys23_MailRole.md) | `UpdateDataModel(sys23_mail_role)` 동적 INSERT/UPDATE → [`sys23_mail_role.selectById`](../../sys/sql/sys23_mail_role.md) |
| `utils.mail.SendMailSMTP.checkCompanyMail` | Sys22_Lookup_Mail:106 | [`SendMailSMTP.java:780`](../../utils/services/mail.SendMailSMTP.md) | [`sys01_company.selectById`](../../sys/sql/sys01_company.md) |

## 테이블

[`emp01_person`](../../../db/tables/emp.md), [`sys01_company`](../../../db/tables/sys.md), [`sys22_mail`](../../../db/tables/sys.md), [`sys23_mail_role`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_sysdate`, `f_today`, `to_decrypts`, `to_encrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sys22_Tab_Mail (`client/vi/sys/Sys22_Tab_Mail.java`, 197줄)

- 레이아웃: west=cp, center=userMailPage
- 툴바 `buttonBar`: {retrieveButton} {insertButton} {deleteButton}
- 입력·하위 화면: `userMailPage` Sys23_Page_MailRole, `lookup` Sys22_Lookup_Mail
- 그리드 `grid` (buildGrid()):
  - mailAddress 300 "메일주소" Text
  - note 300 "비고" Text
  - actionCell 60 "상세보기" Cell 편집:viewCell

#### 이벤트
[E0] 화면 열림 (생성자 L44-76) → settings(), retrieve()
[E1] retrieveButton[조회].Select (L79) → retrieve()
[E2] insertButton[등록].Select (L85) → insertRow()
[E3] deleteButton[삭제].Select (L91) → deleteCheck()
       └ [E5] msgBox.DialogHide [YES] (L174) → deleteRow()
[E4] grid.SelectionChanged (L97) → retrieveUserRole()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieveUserRole() | L130-135 | E4 | 상태 처리 | 업무 |
| private retrieve() | L137-148 | 생성자,E1,buildGrid,insertRow | 서비스 sys.Sys22_Mail.selectByCompanyId(companyId) | 업무 |
| private insertRow() | L150-169 | E2 | 조회창 Sys22_Lookup_Mail 열기 | 업무 |
| private deleteCheck() | L171-190 | E3 | ConfirmBox → E5 | 업무 |
| private deleteRow() | L192-196 | E5 | GridDeleteData sys.Sys22_Mail.delete(체크된 행 목록) | 업무 |
| private settings() | L78-103 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L105-128 | 필드 초기화 | 조회창 Sys22_Lookup_Mail 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('mailAddress', 300, '메일주소'),  // L123
  gb.text('note', 300, '비고'),  // L124
  // ⚠ 대응 없음 (GridBuilder L125) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="delete" onClick={deleteCheck}>삭제</Button>

### Sys23_Page_MailRole (`client/vi/sys/Sys23_Page_MailRole.java`, 160줄)

- 툴바 `buttonBar`: 회사메일별 사용권한정보: {retrieveButton} {insertButton} {updateButton} {deleteButton}
- 입력·하위 화면: `popup` Emp01_Lookup_PersonModel
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - empNo 150 "사번" TextCenter
  - empKorName 100 "성명" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L40-54) → settings()
[E1] retrieveButton[조회].Select (L57) → retrieve()
[E2] insertButton[등록].Select (L63) → insertRow()
[E3] updateButton[저장].Select (L69) → update()
[E4] deleteButton[삭제].Select (L75) → deleteRow()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieve() | L94-96 | E1 | 상태 처리 | 업무 |
| public retrieve() | L98-109 | E1 | 서비스 sys.Sys23_MailRole.selectByMailId(mailId) | 업무 |
| private insertRow() | L111-143 | E2 | 조회창 Emp01_Lookup_PersonModel 열기 | 업무 |
| public update() | L145-148 | E3 | 서비스 sys.Sys23_MailRole.update | 업무 |
| private deleteRow() | L150-154 | E4 | GridDeleteData sys.Sys23_MailRole.delete(체크된 행 목록) | 업무 |
| private settings() | L56-81 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L83-92 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlCheckBoxStyle() | L156-158 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('empNo', 150, '사번'),  // L88
  gb.textCenter('korNm', 100, '성명'),  // L89
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={deleteRow}>삭제</Button>

### Sys22_Lookup_Mail (`client/vi/sys/Sys22_Lookup_Mail.java`, 155줄)

- 입력·하위 화면: `mailAddress` TextField, `mailDecPassword` PasswordField, `note` TextField

#### 이벤트
[E0] 화면 열림 (생성자 L51-54) → init(), show()
[E1] closeButton[닫기].Select (L88) → hide()
[E2] confirmButton[저장(검증)].Select (L95) → update()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L44-49 | 공개 메서드 | 상태 처리 | 업무 |
| private init() | L56-59 | 생성자 | 상태 처리 | 업무 |
| private makeButtonEvent() | L87-102 | init | 상태 처리 | 업무 |
| private checkMail() | L104-122 | update | 상태 처리 | 업무 |
| private update() | L124-145 | E2 | 서비스 sys.Sys22_Mail.modelUpdate | 업무 |
| private makeLayout() | L61-85 | init | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlHeaderStyle() | L147-149 | makeLayout | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L151-153 | makeLayout | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={update}>저장(검증)</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

