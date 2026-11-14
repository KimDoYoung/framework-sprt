# SCH-BZ-0002 업무일정 담당자를 바꾼다(복사·이동)

> **한 줄 요약** — #1042 **[담당자 변경]** 창(`Sch01_Lookup_ManagerModi`)에서 바꿀 사람의 일정을 고르고 **[변경]** → 다음 창에서 **변경 후 담당자**와 처리구분(복사·이동)을 정해 **[변경하기]** → "담당자 변경 처리를 하시겠습니까?" [예]. 서버가 고른 일정을 새 담당자 것으로 **통째로 복사**한다: 분류(새로 만듦, 비고 "담당자 변경 작업으로 자동생성") → 일정 → 공유자 → 기한(트리거로 기한일도) → 연관법규 → 알람(사용 중) → 첨부 연결. **이동**이면 원래 일정을 사용 안 함으로 바꾼다. 다른 사람의 일정을 고르는 것은 관리자 역할이 있는 직원만 된다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 직원 본인(내 일정) · 관리자 역할 직원(남의 일정 — 인수인계) |
| 언제 | 업무 인수인계·발령 때 |
| 먼저 있어야 하는 것 | 0001 |
| 다음 이벤트 | 0003 (새 담당자가 처리) |
| 실제 실행 | 2026-11-14, kalpa API. 401 `GET /sch/infos/by-manager?managerId=401` 1행 → `POST /sch/infos/copy {managerId:402, procType:"COPY", infoIds:[…502]}` → `sch08` +1 · `sch01` +1(`…528`) · `sch02` +1 · `sch03` +2 · `sch09` +15 · `sch06` +1. 김과장(공유자) 기간별 조회에 김사원·최사원 일정이 둘 다 보임. 402(관리자 아님)가 401 일정을 `MOVE` → 403, 401 목록 조회 → 403 |
| 메뉴 | #1042 → [담당자 변경]. 화면 눈 확인 `대기(일괄)` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 직원 | #1042 | [담당자 변경] → 담당자(관리자만 바꿈)·분류 → [조회] (`GET /sch/infos/by-manager`) | 그 사람의 일정 |
| 2 | 〃 | 〃 | 체크 → [변경] → 변경 후 담당자·복사/이동 → [변경하기] → [예] (`POST /sch/infos/copy`) | 새 담당자 일정 생김 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `sch08_class`·`sch01_info`·`sch02_share`·`sch03_deadline`·`sch05_relate_ics`·`sch06_alarm`·`sys11_relate_file` | 새 담당자 몫 복사 | +1·+1·+1·+2·0·+1·0 |
| `sch09_deadline_day` | 복사한 기한의 기한일(트리거) | +15 |
| `sch01_info.sch01_use_yn` | 이동이면 원래 일정 false | (복사라 안 바뀜) |

## 업무 규칙 · 주의

- 분류는 일정이 이어지는 순서대로 하나씩 새로 만든다(같은 분류가 연달아 오면 한 번만).
- 복사본은 시험 뒤 401이 `DELETE /sch/infos`로 지웠다 — **남의(402) 일정을 지울 수 있고, 지워도 분류·공유·기한·알람·기한일이 남는다** → [#247](../../보안_및_버그_의심.md). 정리 SQL은 [흐름도](SCH-업무흐름.md#남긴-것--정리-2026-11-14).

<details><summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: SCH-BZ-0002
company: kalpa
user: 401
pre: [SCH-BZ-0001]
steps:
  - {no: 1, api: GET /api/v1/sch/infos/by-manager?managerId=401, expect: rows 1}
  - {no: 2, api: POST /api/v1/sch/infos/copy, body: {managerId: 402, procType: COPY, infoIds: ["{infoId}"]}, expect: "sch01_info +1, sch03_deadline +2"}
  - {no: 3, user: 402, api: POST /api/v1/sch/infos/copy, body: {managerId: 402, procType: MOVE, infoIds: ["{infoId}"]}, expect: 403}
```
</details>

<details><summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Sch01_Lookup_ManagerModi`(E5 조회·E6 변경), `Sch01_Lookup_ManagerModiRun.preUpdate` L162-179 → `Sch01_Info.copySchedule` L92-197.
- TOBE: `SchInfoService.copy` L188-230·`requireOwnOrUserManager` L233-237(관리자 = `sys04_admin_yn` 역할), `searchByManager` L98-101.
</details>
