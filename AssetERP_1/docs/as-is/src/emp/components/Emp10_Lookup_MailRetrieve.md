# Emp10_Lookup_MailRetrieve

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `dcr`
- 파일: `client/vi/emp/Emp10_Lookup_MailRetrieve.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `emp.Emp01_Person.changeMail` | Emp10_Lookup_MailRetrieve:186 | [`Emp01_Person.java:177`](../../emp/services/Emp01_Person.md) | [`emp01_person.changeMail`](../../emp/sql/emp01_person.md), [`emp01_person.selectByPersonId`](../../emp/sql/emp01_person.md) |
| `emp.Emp01_Person.resetMail` | Emp10_Lookup_MailRetrieve:200 | [`Emp01_Person.java:209`](../../emp/services/Emp01_Person.md) | [`emp01_person.resetMail`](../../emp/sql/emp01_person.md) |
| `emp.Emp01_Person.selectByPersonId` | Emp10_Lookup_MailRetrieve:110 | [`Emp01_Person.java:81`](../../emp/services/Emp01_Person.md) | [`emp01_person.selectByPersonId`](../../emp/sql/emp01_person.md) |
| `utils.mail.SendMailSMTP.checkMail` | Emp10_Lookup_MailRetrieve:128 | [`SendMailSMTP.java:721`](../../utils/services/mail.SendMailSMTP.md) | [`sys01_company.selectById`](../../sys/sql/sys01_company.md) |

## 테이블

[`emp01_person`](../../../db/tables/emp.md), [`sys01_company`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_sysdate`, `to_decrypts`, `to_encrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Emp10_Lookup_MailRetrieve (`client/vi/emp/Emp10_Lookup_MailRetrieve.java`, 222줄)

- 입력·하위 화면: `mailAddress` TextField, `password` PasswordField

#### 이벤트
[E0] 화면 열림 (생성자 L47-49) → init()
[E1] closeButton[닫기].Select (L88) → hide()
[E2] checkButton[검증].Select (L94) → checkMail()
       └ [E4] msgBox.DialogHide [YES] (L147) → update()
[E3] resetButton[초기화].Select (L100) → resetMail()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L51-54 | 공개 메서드 | 상태 처리 | 업무 |
| private init() | L56-60 | 생성자 | 상태 처리 | 업무 |
| private makeButtonEvent() | L87-106 | init | 상태 처리 | 업무 |
| private retrieve() | L108-124 | init | 서비스 emp.Emp01_Person.selectByPersonId(personId) | 업무 |
| private checkMail() | L126-182 | E2 | ConfirmBox → E4 | 업무 |
| private update() | L184-196 | E4 | 서비스 emp.Emp01_Person.changeMail(personId, mailAddress, password) | 업무 |
| private resetMail() | L198-209 | E3 | 서비스 emp.Emp01_Person.resetMail(personId) | 업무 |
| private makeLayout() | L62-85 | init | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlHeaderStyle() | L211-213 | makeLayout | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L215-217 | makeLayout | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlButtonBottomStyle() | L219-221 | checkMail | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="reset" onClick={resetMail}>초기화</Button>
2. <Button type="unknown" onClick={checkMail}>검증</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

