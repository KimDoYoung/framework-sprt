# BBS-BZ-0001 경영관리팀이 사내공지를 올리고 직원이 본다

> **한 줄 요약** — 경영관리팀이 #1064 사내공지등록에서 [등록] → 공지 창에 제목·본문·게시기간·상태(**알림**/대기)·구분(**(회사)전체공지 01** / **(회사)개별공지 02**)·구분상세·댓글 허용·상단고정을 넣고, 개별공지면 대상 직원을 더해 [저장](`bbs02_notice`, 공지번호 `YYMM-NNNA` 자동, 대상 `bbs03_target`). 직원은 #1065 공지사항에서 전체공지와 자기가 대상인 개별공지를 보고, 열면 읽음(`bbs05_history`)이 남고, 댓글(`bbs07_comment`)을 단다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 경영관리팀(시험 김과장 301) → 직원 |
| 언제 | 수시 |
| 먼저 있어야 하는 것 | 코드 `NoticeType001`(01·02)·`NoticeDetailCode` |
| 다음 이벤트 | — |
| 실제 실행 | 2026-11-14, kalpa API(메뉴 없음). 개별공지 `11월 경비 정산 안내(개별)`(대상 401, 공지번호 `2611-001A`) `bbs02` +1·`bbs03` +1, 전체공지 `연말 사무실 대청소`(상단고정 ~12-26) +1. 처음에 상태를 `true`로 넣어 목록에 안 나옴 → **상태는 글자 `알림`/`대기`**(고침). #1065: 401 3행(개별 포함)·402 2행 — AS-IS `bbs02_notice.selectByPersonIdPaging` 3 = 3 · 2 = 2. 401 읽음 +1·댓글 +1 |
| 메뉴 | #1064 (11곳)·#1065 (13곳). 화면 눈 확인 `대기(일괄)` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 경영관리 | #1064 | [등록] (`GET /bbs/notices/next-id`) → 공지 창 | 빈 공지 |
| 2 | 〃 | 공지 창 | 제목·본문·기간·상태 `알림`·구분 `개별공지`·대상 [등록] → [저장] (`PUT /bbs/notices/manage {…, newTargetPersonIds}`) | 공지번호 |
| 3 | 직원 | #1065 | 구분·기간 → [조회] (`GET /bbs/notices/mine`) | 전체 + 내 개별공지 |
| 4 | 〃 | 〃 | 행 열기 (`POST /bbs/notices/{id}/history`) → 댓글 [등록] (`POST /bbs/notices/{id}/comments`) | 댓글 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `bbs02_notice` | 공지(구분·상태·공지번호·상단고정) | +2 |
| `bbs03_target` | 개별공지 대상 | +1 |
| `bbs05_history` · `bbs07_comment` | 읽음 · 댓글 | +1 · +2 |

## 업무 규칙 · 주의

- 상태가 `알림`이어야 보인다. 상단고정은 종료일이 필수.
- **남의 댓글을 지우고(내 댓글만 ✕는 화면), 다른 회사 사원이 개별공지 대상자를 지운다**. 대상이 아닌 직원도 개별공지에 댓글을 쓴다 → [#256](../../보안_및_버그_의심.md).

<details><summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: BBS-BZ-0001
company: kalpa
steps:
  - {no: 1, user: 301, api: GET /api/v1/bbs/notices/next-id}
  - {no: 2, user: 301, api: PUT /api/v1/bbs/notices/manage, body: {noticeId: "{id}", title: "11월 경비 정산 안내(개별)", fromDate: 2026-11-14, toDate: 2026-11-30, openYn: 알림, noticeType: "02", noticeDetailCode: "2020", commentYn: true, topNoticeYn: false, newTargetPersonIds: [401]}, expect: "bbs02 +1, bbs03 +1"}
  - {no: 3, user: 401, api: "GET /api/v1/bbs/notices/mine?noticeType=%25&noticeDetailCode=%25&startDate=2026-08-14&closeDate=2026-11-14&offset=0&limit=50", expect: "개별공지 포함"}
  - {no: 4, user: 402, api: 같은 조회, expect: "개별공지 없음"}
  - {no: 5, user: 401, api: "POST /api/v1/bbs/notices/{id}/comments", body: {comment: "확인했습니다."}}
```
</details>

<details><summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Bbs02_Tab_NoticeManager`·`Bbs02_Edit_Notice.update` L648-680, `Bbs02_Tab_NoticeView.retrieve` L244-280(`selectByPersonIdPaging`), `Bbs07_TapPage_Comment`.
- TOBE: `BbsNoticeService.save` L87-114·`updatePersonId` L57-64·`deleteTargets` L129-137, 화면 `pages/bbs/Bbs02_Edit_Notice.tsx`(상태 `알림`/`대기`).
</details>
