# ICS-BZ-0019 담당 부서가 법규보고 점검을 처리한다

> **한 줄 요약** — 법규마다 정해진 **보고 마감**(분기·반기 등, `sch03_deadline`)이 오면, 그 법규를 맡은 **관리그룹의 부서**(ICS-BZ-0001·0002) 직원의 #1337 법규보고 점검 목록에 "미처리" 줄이 **저절로 나타난다**(DB에 행이 없고 조회 때 계산한다). 직원이 줄의 **처리구분**(완료·해당없음 등)과 **처리일**을 저장하면 그때서야 `sch04_list` 행이 만들어지고, [처리결과] 창에서 **처리결과 글**을 남긴다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 담당 부서(경영지원본부) 직원 김사원 401 |
| 언제 | 법규 보고 마감 때(분기·반기·연 등 법규마다 다름) |
| 먼저 있어야 하는 것 | ICS-BZ-0001(관리그룹·담당 부서), ICS-BZ-0002(법규에 관리그룹 지정·제외 안 함) |
| 다음 이벤트 | ICS-BZ-0020(부서장 확인) |
| 실제 실행 | kalpa, 2026-11-13. 401의 2026.10~12 목록에 3줄(재무건전성 11-14·자산건전성 11-14 분기, 자산건전성 12-31 반기, 모두 경영지원본부·미처리)이 보임 → 재무건전성 줄을 처리구분 `완료`·처리일 오늘로 저장 → `sch04_list` +1(`listId`가 가짜 2000001에서 새 ID로 바뀜) → 처리결과 글 저장. 타 부서 사원 402의 목록은 0줄. AS-IS 조회 SQL 대조 3 = 3 |
| 메뉴 | #1337 준법감시 > 00. 법규정보 > 법규보고 점검. kalpa 직원 메뉴에 없어 API로 실행. 화면 눈 확인 `대기` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 담당 부서 직원 | #1337 | 마감월(연·월 또는 시작~종료)·발생구분·주기구분 고르고 [조회] | 우리 부서의 법규보고 줄(마감일·담당부서·처리구분 `미처리`·법규명·관련조문·발생구분·주기구분) |
| 2 | 〃 | #1337 | 줄의 **처리구분** 선택, **처리일** 입력 → [저장] | 처리자(본인)·처리구분·처리일이 채워짐 |
| 3 | 〃 | #1337 | 줄의 **처리결과** 셀 → 창에서 글 입력 → [저장] | 처리결과 창에 글이 남음(처리구분을 먼저 저장하지 않으면 "처리구분을 저장한 후 결과를 입력하세요") |
| 4 | 〃 | #1337 | 법규명 옆 셀 | 법규 상세 조회창 |
| 5 | 〃 | #1337 | [출력/다운로드] | 같은 목록을 RD(TOBE는 엑셀)로 내려받음 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `sch04_list` | 처리한 줄(회사·일정구분 `2`·주기·법규 ID·담당부서·처리자·처리구분·처리일·메모) | +1 |

처리 전 줄은 DB에 없다 — 조회 SQL(`selectByIcs`)이 법규 마감(`sch03_deadline` 기준 `f_get_std_date`)과 관리그룹 부서(`ics04_share`)를 합쳐 만든다. ID가 `2000001`처럼 작은 수면 아직 처리 전 가짜 줄이다.

## 업무 규칙 · 주의

- 목록에 나오는 법규: 법규 마스터의 항목(`IT`)이며 회사가 **제외하지 않았고**(`ics03_except_yn`) **시스템 자동처리가 아니고**(`ics03_auto_yn`) 이 부서의 관리그룹에 지정된 것. kalpa는 법규 3건 중 2건이 그룹에 지정돼 2건(분기 2, 반기 1줄)이 나온다.
- 일별·수시 마감은 오늘(또는 조회 끝 영업일) 한 줄이고, 그 밖의 주기는 달력(`sys12_calendar`)으로 마감일을 계산한다.
- 처리구분 값: 0 미처리 · 1 완료 · 2 시스템(자동) · 5 해당없음.
- 처리자는 로그인한 사용자로 서버가 채운다(화면 값이 아님).
- ⚠ 확인이 끝난 줄을 못 바꾸게 하는 것은 화면뿐이다 → [의심 #151](../../보안_및_버그_의심.md).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: ICS-BZ-0019
needs: [ICS-BZ-0001, ICS-BZ-0002]
steps:
  - no: 1
    actor: { company: kalpa, user: "401", password: "1111" }
    api: GET /api/v1/sch/lists/ics
    query: { startDate: "2026-10-01", closeDate: "2026-12-31", doneExceptYn: false, advisYn: false }
    expect: { rows: 3 }
  - no: 2
    actor: { company: kalpa, user: "401", password: "1111" }
    api: PUT /api/v1/sch/lists
    body: [{ listId: 2000001, closeDate: "2026-11-14", manageDate: "2026-11-13", infoId: 24763, title: 재무건전성 보고, scheduleCode: "2", cycleCode: "04", statusCode: "1", deadlineId: 31541, mngOrgId: <경영지원본부> }]
    expect: { track: { sch04_list: +1 } }
  - no: 3
    actor: { company: kalpa, user: "401", password: "1111" }
    api: PUT /api/v1/sch/lists/{새 listId}/result
    body: { type: U, note: "2026년 3분기 재무건전성 보고를 금융감독원에 제출함" }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Sch04_Tab_IcsList`(#1337) — `setting`·`retrieve` L331-353·`update` L355-389·`editResult` L434-457, 서버 `Sch04_List.selectByIcs` L171·`upsert` L436, SQL `sch04_list.selectByIcs`(실제 행 + 문서작성 + 법규담당 합집합).
- TOBE: `SchListController`(`/sch/lists/ics`·`/sch/lists`·`/sch/lists/{id}/result`)·`SchListService.searchIcs`·`upsert`·`updateResult`, `SchListMapper.selectByIcs`(`yunhee mapper-run --compare` 3 = 3).
</details>
