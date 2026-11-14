# BBS-BZ-0002 KFS가 고객사에 공지를 올린다

> **한 줄 요약** — ADMIN이 #1246 KFS공지등록에서 법령(10)·경영(20)·책무(30)·시스템(90) 공지를 쓰고 **전체고객사** 또는 **고른 고객사**(`bbs04_target_company`)에 보낸다(공지는 회사 0, 공지번호 `YYMM-NNNS`, 상태·본문을 바꿀 때마다 `bbs09_notice_history`). 고객사 직원은 #1065 공지사항과 #1259 경영공지(20)·#1258 법규공지(10)에서 보고, ADMIN은 공지별 열람 기록을 본다.

| 항목 | 내용 |
|:---|:---|
| 누가 | ADMIN(`admin/admin/1111` — KFS 104는 KFS관리자가 아니어서 403) |
| 언제 | 법령 개정·서비스 안내 때 |
| 먼저 있어야 하는 것 | — |
| 다음 이벤트 | — |
| 실제 실행 | 2026-11-14, API. 경영공지 `[KFS] 연말 결산 일정 안내(시험)`(대상 kalpa만) → `bbs02` +1·`bbs04` +1·`bbs09` +1. kalpa 401 #1065(`GET /bbs/notices/mine`)에는 **나옴** → 읽음 → ADMIN 열람기록 1행. 그런데 #1259(`GET /bbs/notices?noticeType=20`)에는 **안 나옴** — AS-IS `selectByNoticeDetailCodePaging` 5 = 5(같이 빠짐) → 원인 SQL 행 검사(⚠#257) |
| 메뉴 | #1246 (5곳), #1259 (5곳), #1258 (6곳). 화면 눈 확인 `대기(일괄)` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | ADMIN | #1246 | [등록] (`GET /bbs/notice-admin/next-id`) → 창 → 구분 `경영공지`·전체공지·고객사 [등록] → [저장] (`PUT /bbs/notice-admin {…, publicCompanyYn:false, newTargetCompanyIds:[kalpa]}`) | 공지번호 `…S` |
| 2 | 직원 | #1065 / #1259 / #1258 | [조회] (`GET /bbs/notices/mine` / `GET /bbs/notices?noticeType=20·10`) | KFS 공지 |
| 3 | ADMIN | #1246 | 행 → 열람기록 (`GET /bbs/notice-admin/{id}/histories`) | 읽은 사람 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `bbs02_notice` | KFS 공지(회사 0) | +1 |
| `bbs04_target_company` · `bbs09_notice_history` | 대상 고객사 · 변경 기록 | +1 · +1 |
| `bbs05_history` | 고객사 직원 읽음 | +1 |

## 업무 규칙 · 주의

- **고객사를 골라 보낸 공지는 #1259·#1258에 안 나온다**(전체고객사 공지만 나옴) — 원본 SQL `bbs04_target_company IS NOT NULL`(행 전체 검사) → [#257](../../보안_및_버그_의심.md).
- 열람기록의 이름이 `EMP_NAME을 찾을 수 없습니다.`로 나온다(고객사 직원 이름을 회사 0에서 찾음 — 원본 함수 그대로로 보임, 미확인).

<details><summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: BBS-BZ-0002
company: admin (회사 0)
steps:
  - {no: 1, user: admin, api: PUT /api/v1/bbs/notice-admin, body: {noticeId: "{next-id}", title: "[KFS] 연말 결산 일정 안내(시험)", fromDate: 2026-11-14, toDate: 2026-12-31, openYn: 알림, noticeType: "20", noticeDetailCode: "2001", publicYn: true, publicCompanyYn: false, newTargetCompanyIds: ["{kalpa}"]}, expect: "bbs04 +1"}
  - {no: 2, user: "kalpa 401", api: GET /api/v1/bbs/notices/mine…, expect: "KFS 공지 있음"}
  - {no: 3, user: "kalpa 401", api: "GET /api/v1/bbs/notices?noticeType=20&noticeDetailCode=%25&offset=0&limit=50", expect: "KFS 공지 없음(#257)"}
```
</details>

<details><summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Bbs02_Tab_NoticeAdmin`·`Bbs02_Edit_NoticeAdmin.update`, `Bbs02_Tab_NoticeViewMgt.retrieve` L154-175(noticeType "20"), `Bbs02_Tab_NoticeViewLaw`("10"), SQL `bbs02_notice.xml` L732-769.
- TOBE: `BbsNoticeAdminController`, `BbsNoticeMapper.xml` L33(행 검사)·L115·L238(`_id` 검사).
</details>
