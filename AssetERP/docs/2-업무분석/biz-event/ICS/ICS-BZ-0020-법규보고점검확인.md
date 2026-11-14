# ICS-BZ-0020 부서장이 법규보고 처리 결과를 확인한다

> **한 줄 요약** — 직원이 처리한 법규보고(ICS-BZ-0019)를 부서장이 #1340 법규보고 점검(관리자)에서 **담당부서별로 모아 보고**, 처리결과를 읽은 뒤 **확인 처리**한다(확인자·확인일이 남음). 잘못 확인했으면 **확인취소**한다. 확인이 끝나면 화면에서 직원이 그 줄을 더 고칠 수 없다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 부서장·준법감시 담당 박부장 201 |
| 언제 | 직원이 처리한 뒤, 보고 주기마다 |
| 먼저 있어야 하는 것 | ICS-BZ-0019(처리한 줄) |
| 다음 이벤트 | 감독기관 보고·결재 문서 보관 |
| 실제 실행 | kalpa, 2026-11-13. 201이 #1340 목록(3줄)에서 직원이 처리한 재무건전성 줄을 확인(P) → `confirmYn`·확인일·확인자 박부장 → 확인 뒤에도 401이 처리구분·결과를 바꿀 수 있음(⚠ #151) → 402(타 부서)가 확인취소(C) 가능(⚠) → 401이 처리구분·결과를 원래대로 고치고 201이 다시 확인해 마무리. 일반 사원 402도 #1340 목록을 받음(⚠ #152) |
| 메뉴 | #1340 준법감시 > 01. 법규관리 > 법규보고 점검(관리자). kalpa 메뉴 없음(API). 화면 눈 확인 `대기` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 부서장 | #1340 | 마감월·**담당부서**(조회창, 비우면 전체)·발생구분·주기구분·검색어·[일임(자문)] → [조회] | 부서별 법규보고 줄(처리자·처리구분·처리일·확인여부) |
| 2 | 〃 | #1340 | 줄의 [처리결과 확인처리] 셀 | 처리결과 글을 보여주는 창(처리구분 저장 전이면 "처리구분을 저장한 후…") |
| 3 | 〃 | 처리결과 창 | [확인] | 확인여부 체크, 확인자·확인일 기록 |
| 4 | 〃 | 처리결과 창 | (잘못 확인했으면) [확인취소] | 확인여부가 풀림 |
| 5 | 〃 | #1340 | [출력/다운로드] | 같은 목록을 RD(TOBE는 엑셀)로 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `sch04_list` | `confirm_yn`=true·`confirm_date`·`confirmer_id` | 1줄 갱신(확인·취소·확인) |

## 업무 규칙 · 주의

- 담당부서를 비우면 회사 전체 부서가 나오고, 고르면 그 부서 줄만 나온다(서버 SQL의 `orgId` 조건).
- 확인자는 로그인한 사용자, 확인일은 오늘로 서버가 채운다.
- ⚠ **누가 확인해도 되는지·확인 뒤 변경 금지**를 서버가 검사하지 않는다(원본도 같음) → [의심 #151](../../보안_및_버그_의심.md). ⚠ 일반 사원도 #1340 목록을 받는다 → [의심 #152](../../보안_및_버그_의심.md).
- AS-IS 조회 SQL(관리자 모드) 대조 3 = 3.

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: ICS-BZ-0020
needs: [ICS-BZ-0019]
steps:
  - no: 1
    actor: { company: kalpa, user: "201", password: "1111" }
    api: GET /api/v1/sch/lists/ics/manager
    query: { startDate: "2026-10-01", closeDate: "2026-12-31", doneExceptYn: false, advisYn: false }
    expect: { rows: 3 }
  - no: 2
    actor: { company: kalpa, user: "201", password: "1111" }
    api: PUT /api/v1/sch/lists/{ICS-BZ-0019 listId}/result
    body: { type: P }
    expect: { confirmYn: true, confirmerName: 박부장 }
  - no: 3
    actor: { company: kalpa, user: "201", password: "1111" }
    api: PUT /api/v1/sch/lists/{listId}/result
    body: { type: C }
    expect: { confirmYn: false }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Sch04_Tab_IcsListManager`(#1340), 처리결과 창 `Sch04_Lookup_IcsMsg`(L174 `updateConfirm` — type U 결과저장 / P 확인 / C 확인취소), 서버 `Sch04_List.updateConfirm` L396-421, SQL `sch04_list.updateConfirm`·`updateNote`.
- TOBE: `SchListController` `/sch/lists/ics/manager`·`/sch/lists/{id}/result`, `SchListService.searchIcsManager`·`updateResult`.
</details>
