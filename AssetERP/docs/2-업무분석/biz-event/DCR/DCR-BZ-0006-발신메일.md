# DCR-BZ-0006 결재문서를 메일로 보내고 발신메일 기록을 본다

> **한 줄 요약** — 결재가 끝난 문서는 결재문서 창의 [메일발송]으로 외부에 보낸다. 원본(2026-10-29~)은 [메일발송]을 누르면 "새로운 메일 시스템을 테스트 중입니다…"를 묻고, [예]면 새 메일 시스템(`AssetMailSend`, TOBE `POST /dcr/mail-sender/asset-mail`), [아니오]면 옛 발송 창(`Dcr10_Lookup_MailSender_20261027`)을 연다. 옛 창은 회사 메일서버(`sys01_mail_info`)·내 메일 계정(또는 공용 계정)으로 SMTP 발송하고, **성공하면 화면이 발신 기록(`dcr10_mail_history`)을 따로 저장**한다. 직원은 #1023 발신메일목록에서 내가 보낸 메일을, 관리자는 #1024에서 회사 전체를 본다(조회 전용, 행 클릭 → 메일 내용·첨부).

| 항목 | 내용 |
|:---|:---|
| 누가 | 직원(발송·#1023), 관리자(#1024) |
| 언제 | 결재 완료 문서를 외부(거래처·감독기관)에 보낼 때 |
| 먼저 있어야 하는 것 | 결재 완료 문서(APR-BZ-0002), 회사 메일서버 설정(`sys01_mail_info`)과 사원 메일 계정·비밀번호(사원정보), 공용 메일을 쓰면 공용 계정 |
| 다음 이벤트 | — (DCR 마지막) |
| 실제 실행 | kalpa, 2026-11-14, API. kalpa 발신메일 기록 0건(전체 123건은 다른 회사). ① 401 `GET /dcr/mail-sender/init?apprId=<401 완료 문서>` → 발신 `401@kalpa.test`, 메일서버 NULL, 공용메일 불가. ② `POST /dcr/mail-sender/send` → **"메일서버( null )가 설정되지 않았습니다. 관리자에게 연락바랍니다."**(SMTP 전에 멈춤 — 실제 메일은 안 나감). ③ 발송 없이 `POST /dcr/mail-sender/history`에 회사 28000 완료 문서 ID·남의 발신 주소로 기록 → 200, `dcr10_mail_history` +1(⚠#215). ④ #1023(401) 1행 AS-IS 1 = 1, #1024(관리자) 1행 AS-IS 1 = 1. 위조 행은 아래 정리 SQL로 지운다(사용자 실행) |
| 메뉴 | #1023 문서작성 > 05. 메일관리 > 발신메일목록, #1024 관리자 > 04. 전자결재 > 발신메일 목록(관리자). 발송은 결재문서 창(APR) [메일발송]. kalpa 메뉴 없음. 화면 눈 확인 `대기(일괄)` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 직원 | 결재문서 창(완료 문서) | [메일발송] → "새로운 메일 시스템…" [아니오] → 발송 창 (`GET /dcr/mail-sender/init?apprId=`) | 발신 주소·연락처·첨부 후보 |
| 2 | 〃 | 발송 창 | 수신·참조(주소록 `GET /dcr/mail-sender/public-mails`)·제목·본문·첨부·공용메일·개인정보 문구 → [발송] (`POST /dcr/mail-sender/send`) | 성공하면 기록 저장(`POST /dcr/mail-sender/history`). 회사 메일로그 설정이면 발신자에게 사본 |
| 3 | 〃 | [예]를 고르면 | 새 메일 시스템 (`POST /dcr/mail-sender/asset-mail`) | 새 메일 작성 창 |
| 4 | 직원 | #1023 | 기간·제목·펀드 → [조회] (`GET /dcr/mail-histories`) | 내가 보낸 메일(발송일시·수신·제목), 행 → 내용·첨부(`…/{id}/files`) |
| 5 | 관리자 | #1024 | 같은 조건 (`GET /dcr/mail-histories/manager`) | 회사 전체 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `dcr10_mail_history` | 발신 기록(결재문서 ID·사원·발신·수신·참조·제목·본문·발송시각) — 회사 열 없음(사원으로 회사를 찾음) | +1(위조 시험 행, 정리 대기) |
| 첨부 기록 | 기록 ID·파일 ID | 0 |

## 업무 규칙 · 주의

- 발송 성공·실패와 기록 저장이 **다른 호출**이다(원본 옛 창도 같음). 그래서 발송 없이 기록만 만들 수 있고, 반대로 발송은 됐는데 화면이 꺼지면 기록이 빠질 수 있다 → [의심 #215](../../보안_및_버그_의심.md).
- 실패 문구는 원본 그대로: 메일서버 없음 "메일서버( … )가 설정되지 않았습니다. 관리자에게 연락바랍니다.", 받는 주소 오류 "받는 메일주소가 올바르지 않습니다", 인증 실패 "…사용자 이름과 비밀번호가 허용되지 않습니다. 웹메일 비밀번호를 확인하세요."
- 시험 환경 주의: kalpa는 메일서버가 없어 발송이 늘 실패한다. 메일서버를 설정하면 **실제 외부 메일이 나가므로** 시험하지 않는다.
- 로컬 DB 시간대가 UTC라 `f_sysdate()`가 9시간 이르게 찍힌다(발송시각 03:33 = 한국 12:33). 원본도 같은 함수를 쓰고 운영 DB 시간대에 따르므로 코드 문제는 아니다.
- #1023의 그리드 열 이름이 원본은 `sendTimeStr`, TOBE 응답은 `sendTimeString`(이름만 다름, 화면은 TOBE 이름으로 맞춤).

<details>
<summary>정리 SQL (사용자 실행 — 먼저 tools/db_dump_backup.sh)</summary>

`yunhee sql -f … --rollback`으로 `DELETE 1` 확인.

```sql
DELETE FROM dcr10_mail_history WHERE dcr10_mail_history_id = 202611149150113;
```
</details>

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: DCR-BZ-0006
needs: [APR-BZ-0002]
steps:
  - no: 1
    actor: { company: kalpa, user: "401", password: "1111" }
    api: GET /api/v1/dcr/mail-sender/init?apprId={401 완료 문서}
    expect: { fields: [senderEmail, mailInfo, publicMailAllowed, files] }
  - no: 2
    api: POST /api/v1/dcr/mail-sender/send
    body: { apprId: "{401 완료 문서}", receptor: "bz-test@example.invalid", header: "BZ시험", content: "<p>시험</p>", testYn: "true", fileIds: [] }
    expect: { ok: false, message: "메일서버( null )가 설정되지 않았습니다. 관리자에게 연락바랍니다." }
  - no: 3
    api: GET /api/v1/dcr/mail-histories?startDate=2026-11-01&endDate=2026-11-14
    expect: { rows: "AS-IS selectBySenderEmail과 같음" }
```
</details>

<details>
<summary>근거</summary>

- AS-IS: `Dcr10_Tab_MailHistory`(#1023 `Dcr10_MailHistory.selectBySenderEmail` L55)·`Dcr10_Tab_MailHistory_Manager`(#1024 `selectByTitleText` L41)·`Dcr10_Lookup_MailViwer`(`Sys10_File.selectMailFileHistory`), 발송 `Dcr10_Lookup_MailSender.open` L12 → `showMessage01` L24-45(새 시스템 `AssetMailSend` / 옛 창 `Dcr10_Lookup_MailSender_20261027` — 발송 뒤 `dcr.Dcr10_MailHistory.insertMailHistory`), 원본 커밋 `886486134`(2026-10-29).
- TOBE: `DcrMailSenderController`(`/api/v1/dcr/mail-sender/init`·`/send`·`/history`·`/asset-mail`·`/public-mails`), `DcrMailSenderService.send` L85-165·`saveHistory` L168-179, `DcrMailSenderMapper.xml` `insertMailHistory` L101(`f_sysdate()`), `DcrMailHistoryController`(`/api/v1/dcr/mail-histories`·`/manager`·`/{id}/files`).
</details>
