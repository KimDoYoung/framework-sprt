# BBS-BZ-0004 직원이 업무를 공유한다

> **한 줄 요약** — 직원이 #1254 업무공유에서 [등록] → 날짜·구분(`BizShareType`)·내용·키워드·비고를 [저장]하면(`bbs10_biz_share`, 등록자 = 나) 회사 직원 모두가 기간·구분·검색어로 본다. 고치고 지우는 것은 등록자만.

| 항목 | 내용 |
|:---|:---|
| 누가 | 직원 |
| 언제 | 수시 |
| 먼저 있어야 하는 것 | 코드 `BizShareType`(kalpa: 98 테스트·99 기타) |
| 다음 이벤트 | — |
| 실제 실행 | 2026-11-14, kalpa API. 401 `거래처 A사 미팅…`(기타) `bbs10` +1 → 402 목록에 보임. 402가 401 글 수정 → 200이지만 바뀌지 않음(등록자 조건), 삭제 → "등록자만 삭제가능합니다" |
| 메뉴 | #1254 커뮤니티 > 03. 업무활동 > 업무공유 (8곳). 화면 눈 확인 `대기(일괄)` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 직원 | #1254 | [등록] → 날짜·구분·내용·키워드 → [저장] (`PUT /bbs/biz-shares`) | 목록 |
| 2 | 다른 직원 | 〃 | 기간·구분·검색 → [조회] (`GET /bbs/biz-shares`) | 회사 전체 공유 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `bbs10_biz_share` | 업무공유 | +1 |

## 업무 규칙 · 주의

- 남의 글 수정 요청은 200으로 끝나지만 실제로는 안 바뀐다(오류를 안 알림 — 작은 차이, 의심으로 적지 않음).

<details><summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: BBS-BZ-0004
company: kalpa
steps:
  - {no: 1, user: 401, api: PUT /api/v1/bbs/biz-shares, body: {date: 2026-11-14, bizShareType: "99", content: "거래처 A사 미팅: 12월 계약 갱신 조건 협의", keyword: "A사,계약"}, expect: "bbs10 +1"}
  - {no: 2, user: 402, api: GET /api/v1/bbs/biz-shares?startDate=2026-11-01&closeDate=2026-11-30, expect: rows 1}
  - {no: 3, user: 402, api: DELETE /api/v1/bbs/biz-shares, body: ["{id}"], expect: "400 등록자만 삭제가능합니다"}
```
</details>

<details><summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Bbs10_Tab_BizShare`·`Bbs10_Edit_BizShare`.
- TOBE: `BbsBizShareController`·`BbsBizShareService`, 화면 `pages/bbs/Bbs10_Tab_BizShare.tsx`.
</details>
