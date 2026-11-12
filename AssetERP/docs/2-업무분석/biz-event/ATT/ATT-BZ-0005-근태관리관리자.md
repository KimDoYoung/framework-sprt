# ATT-BZ-0005 경영관리팀이 근태를 관리한다(일괄생성·시간 수정·근로시간 일괄조정·확인필요 해제)

> **한 줄 요약** — #1485 근태관리(관리자)에서 하루(근무일자) 또는 기간의 전 직원 출퇴근을 보고, 기록이 없는 직원·기간은 [일괄생성](정책 시각으로, 휴가·휴일 제외)하고, 잘못된 시각은 행의 수정 아이콘(개별수정)이나 [일괄수정]으로 **보정 시각**을 넣고, [근로시간 일괄조정]으로 실제 시각을 보정 시각에 그대로 옮기고, 직원이 낸 퇴근시간(관리자 확인필요)은 확인 아이콘으로 해제한다. 원래 시각은 바뀌지 않고 보정 시각과 변경 이력이 `att04_commute_hist`에 남는다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 경영관리팀(kalpa 과장 301) |
| 언제 | 매일·월말 마감 전 |
| 먼저 있어야 하는 것 | ATT-BZ-0001, 0002(직원 기록), SYS-BZ-0008(달력), EMP-BZ-0014(휴가 — 일괄생성에서 뺀다) |
| 다음 이벤트 | ATT-BZ-0007(현황), PAY(연장근로수당) |
| 실제 실행 | kalpa, 2026-11-12, API(301): 401·402 `2026-11-02~08` 일괄생성(+10, 주말 11-07·08 빠짐) → 402 11-12 개별수정 08:55~18:30 → 401 11-03·04 일괄수정 퇴근 20:00 → 401 11-02 근로시간 일괄조정 → 401 11-05 확인필요 해제. 조회는 AS-IS SQL과 행 수 일치(13 = 13) |
| 메뉴 | #1485 경영관리 > 06. 근태관리 > 근태관리(관리자). kalpa 메뉴 없음. 화면 눈 확인 `대기` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 경영관리 | #1485 | `근무일자`(하루) 또는 `근무기간` 고르고, 검색(사원번호·이름·부서)·사원 → [조회] | 줄: 근무일자·근무형태·상태·사원·요일·구분(근무일/휴일)·출근·퇴근·근로시간 + 녹색 보정 출근·퇴근·근로시간 |
| 2 | 〃 | 〃 | [일괄생성](근무일자 라디오일 때) → 사원 여러 명·시작일·종료일 → [저장] | 기록이 없는 근무일에 정책 출근·퇴근 시각으로 행이 생긴다(`batch_yn=true`) |
| 3 | 〃 | 〃 | 줄의 수정 아이콘 → 출근·퇴근 날짜·시각 → [저장] | 보정 시각이 바뀌고 이력 사유 `개별수정` |
| 4 | 〃 | 〃 | 여러 줄 체크 → [일괄수정] → 출근(또는 퇴근) 날짜·시각 → [저장] | 고른 줄 모두 같은 값, 이력 사유 `일괄수정` |
| 5 | 〃 | 〃 | 줄 체크 → [근로시간 일괄조정] → [예] | 실제 출근·퇴근 시각이 보정 시각으로 복사, 사유 `근로시간 일괄조정` |
| 6 | 〃 | 〃 | 상태 `관리자 확인필요` 줄의 확인 아이콘 → [예] | 확인필요 해제, 상태가 시각대로 다시 계산(`연장근무(미신청)` 등) |
| 7 | 〃 | 〃 | 출퇴근 사유 아이콘 | 직원이 쓴 출근·퇴근 사유 창(읽기) |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `att02_commute` | 일괄생성 행, 확인필요 해제(`admin_check_yn` NULL) | +10 |
| `att04_commute_hist` | 행마다 1줄(전·후 출퇴근, 사유, 등록자) — 다시 고치면 같은 줄을 갱신 | +5(402 11-02 줄은 아래 사원 시험) |

## 결과를 볼 수 있는 화면

- #1485 보정 열, #1487·#1492 현황.

## 업무 규칙 · 주의

- 일괄생성은 **이미 행이 있는 날, 그 직원 휴가(취소 아님) 기간, 회사 휴일(`sys12_working_yn=false`)**을 뺀다. 정책이 없는 날은 만들지 않는다.
- ⚠ [일괄수정]은 날짜를 **하나** 받아 고른 모든 줄에 넣는다(원본 `Att02_Edit_CommuteBatch` L181-197 · `Att04_CommuteHist.insertList` L85-110도 같음). 실행: 11-03·11-04 두 줄을 퇴근 `2026-11-03 20:00`으로 고치자 11-04 줄의 퇴근이 전날 20:00이 되어 상태 `조기퇴근`, 근로시간 빈칸 → [의심 #71](../../보안_및_버그_의심.md). 화면에서 근무일자(하루) 조회일 때만 쓰는 게 안전하다.
- ⚠ **#1485 API 전체에 권한 검사가 없다**(회사만 본다). 실행: 사원 402가 관리자용 `PUT /api/v1/att/commutes/{본인 11-02 행}/time`으로 퇴근을 23:00으로 고쳤고(→ 근로시간·연장근무 판정이 바뀜), `GET /admin`으로 전 직원 13줄을 받았다 → [의심 #62](상).
- ⚠ 일괄생성이 사원 ID의 회사를 보지 않는다(원본 `att02_commute.insertBatch`도 같음). 실행: 402가 `POST /api/v1/att/commutes/batch {personIds:[29035(회사 28000 사원)]}` → kalpa 회사로 그 사원의 11-09 행 +1(시험 뒤 SQL로 지움) → [의심 #63].
- 원본 `deleteRow`(행 삭제)는 단추에 연결돼 있지 않다(공개 메서드만). TOBE에도 삭제 API가 없다.

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: ATT-BZ-0005
needs: [ATT-BZ-0001, ATT-BZ-0002]
steps:
  - no: 1
    actor: { company: kalpa, user: "301", password: "1111" }
    api: GET /api/v1/att/commutes/admin?startDate=2026-11-01&closeDate=2026-11-12
    compare: att02_commute.selectByTextAdmin   # 13 = 13
  - no: 2
    api: POST /api/v1/att/commutes/batch
    body: { startDate: "2026-11-02", closeDate: "2026-11-08", personIds: [<401>, <402>] }
    expect: { data: 2, track: { att02_commute: +10 } }
  - no: 3
    api: PUT /api/v1/att/commutes/{402 11-12}/time
    body: { checkInTime: "2026-11-12", checkInTimeStr: "08:55", checkOutTime: "2026-11-12", checkOutTimeStr: "18:30" }
    expect: { track: { att04_commute_hist: +1 }, calcWorkTimeStr: "8시간 35분" }
  - no: 4
    api: PUT /api/v1/att/commutes/time
    body: { commuteIds: [<401 11-03>, <401 11-04>], checkOutTime: "2026-11-03", checkOutTimeStr: "20:00" }
    expect: { track: { att04_commute_hist: +2 } }   # 11-04 줄 → 조기퇴근(의심 #71)
  - no: 5
    api: PUT /api/v1/att/commutes/auto-adjust
    body: { commuteIds: [<401 11-02>] }
  - no: 6
    api: PUT /api/v1/att/commutes/{401 11-05}/admin-check
    expect: { statusName: "연장근무(미신청)" }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Att02_Tab_CommuteAdmin`(E0~E12, retrieve L382-405, update L407-415, updateAuto L417-435, adminCheck L369-380, deleteRow L437-441), `Att02_Lookup_InsertBatch`(L196), `Att02_Edit_Commute`(L178), `Att02_Edit_CommuteBatch`(L180-213), `Att02_Edit_InOutReason`, 서버 `Att02_Commute.selectByTextAdmin`·`insertBatch`·`adminCheck`, `Att04_CommuteHist.insert`·`insertList`·`updateAuto`.
- TOBE: `AttCommuteController` `/admin`·`/{id}/admin-check`·`/batch`·`/auto-adjust`·`/{id}/time`·`/time`, `AttCommuteService`, `AttCommuteHistService`, `AttCommuteMapper.xml` `insertBatch` L313-367, `Att02_Tab_CommuteAdmin.tsx` 외 창 4개.
</details>
