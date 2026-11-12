# EMP-BZ-0023 인사평가 항목(평가표·등급)을 정한다

> **한 줄 요약** — 해마다(또는 평가표가 바뀔 때) 회사가 인사평가에 쓸 **평가 항목(평가요소·가중치)과 평가등급(S~D)** 을 "기준 적용일" 단위로 정한다. 새 적용일을 [등록]하면 **그 회사의 가장 최근 항목·등급을 복사**(회사에 없으면 KFS가 #1398에서 관리하는 회사 0의 것)하고, 고친 뒤 [확정]하면 인사평가(EMP-BZ-0024)가 그 적용일을 쓴다. 확정·수정 제한은 거의 **화면에만** 있다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 고객사 경영관리(과장 `kalpa/301/Kalpa1234!`, 권한그룹 `경영 관리자`). 기본값(회사 0)은 KFS 관리자 `admin/admin/1111`(#1398) |
| 언제 | 해마다 / 평가표가 바뀔 때 |
| 먼저 있어야 하는 것 | 회사 0의 기본 항목·등급(KFS #1398) — 고객사에 아직 적용일이 없으면 여기서 복사한다 |
| 다음 이벤트 | EMP-BZ-0024 인사평가 진행(대상자를 등록할 때 평가 종료일 기준으로 적용일을 찾는다) |
| 실제 실행 | kalpa, 2026-11-12, API(T3600 DB). 새 적용일 2027-01-01 만들기 → 항목 추가·수정 → 확정·확정취소 → 지우기. 실제 평가는 이미 있던 적용일 2026-01-01(확정)로 EMP-BZ-0024에서 진행 |
| 메뉴 | #1391 경영관리 > 05. 인사평가 > 인사평가 항목 (kalpa 있음, `경영 관리자`) · #1398 기초자료 > 30. 자산&경영 > 인사평가 항목(Admin) (같은 화면, KFS). 화면 눈 확인 `대기` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | KFS 관리자 | **#1398** | 회사 0의 기준 적용일을 고르고 항목·등급을 정한다(처음 한 번) | 적용일 목록: `2026-09-01`(미확정) `2025-01-01` `2024-01-01`(확정) |
| 2 | 과장 | **#1391** | 화면이 열리면 [조회] → 왼쪽 "기준 적용일" 목록(적용일·평가등급 아이콘·확정) | kalpa는 `2026-01-01`(확정) 1건 |
| 3 | 〃 | 〃 | [등록] → 적용년도·월 입력 → [생성] | 새 적용일(그 달 1일)이 생기고 항목 11개·등급 5개가 복사됨. 같은 적용일이면 "이미 생성된 기준 적용일입니다" |
| 4 | 〃 | 〃 | 적용일 행 선택 → 오른쪽 항목 그리드에서 평가항목(콤보)·내용·가중치(조직원/조직장)·조회순번 입력, [행 추가]·[행 삭제] → [저장] | 가중치 합계 행. 조직원·조직장 각각 합이 100이 아니면 "조직원(조직장) 가중치의 합계는 100(%)이어야합니다" |
| 5 | 〃 | 〃 | 평가등급 아이콘 → 등급 조회창에서 등급(S·A·B·C·D)·등급가중치·기준점수·이상/미만·평정사유 필수 여부 편집 → [저장] | 등급표 |
| 6 | 〃 | 〃 | [확정] → [예] | 확정 열 `true`. 확정되면 [삭제]·[행 추가]·[행 삭제]·[저장]이 꺼진다. 이전 적용일로 평가 중인 내역이 있으면 "이전 기준적용일로 평가중인 내역이 존재합니다." |
| 7 | 〃 | 〃 | [확정취소] / [삭제] | 취소: 확정 `false`. 삭제: 항목·등급까지 지워짐. 이미 평가 대상자가 쓰는 적용일은 "이미 사용중인 적용일입니다" |

## DB에 남는 것

| 테이블 | 무엇 | 단계 |
|:---|:---|:---|
| `emp40_eval_list_std` | 기준 적용일(회사·시작일·확정여부) | 3 +1, 6 확정 `true`, 7 삭제 −1 |
| `emp41_eval_list` | 평가항목 11행(분류·내용·가중치·순번) — 적용일에 딸림, 회사 열 없음 | 3 +11, 4 +1/수정 |
| `emp42_eval_grade` | 평가등급 5행(S 100%·95점, A 90%·90점, B 80%·80, C 70%·70, D 60%·70미만) | 3 +5 |

## 결과를 볼 수 있는 화면

- #1391·#1398 자신, 인사평가 대상자 #1392(적용일 자동 선택), 평가 작성창(항목·등급), 인사평가 결과(#1393~#1396).

## 업무 규칙 · 주의

- **복사 규칙**(서버 `create`): 그 회사의 최근 항목·등급을 먼저, 없으면 회사 0의 것을 복사한다. kalpa 2027-01-01 생성 → 항목 +11·등급 +5. 같은 적용일을 다시 만들면 409 `DUPLICATE_DATA`. 평가기간이 걸친 대상자가 있는 날짜면 "해당 적용일 범위에 등록된 인사평가 내역이 존재합니다…"(`countDateChk`).
- **조회는 로그인 회사만**: 서비스가 `companyId`로 거른다. kalpa가 다른 회사 적용일 ID로 항목 조회 → 404, 삭제 → 404. KFS(회사 0)는 자기 3건만 본다.
- **가중치 합 100·확정 뒤 수정 금지는 화면에만 있다**(원본 `updateFormChk` L411-451, TOBE도 같음). API를 직접 부르면 ① 가중치 합 150 저장됨 ② 확정된 적용일의 항목 수정·삭제·추가가 `200`. 실제로 평가에 쓰이는 확정 적용일(2026-01-01)의 항목 하나를 지우는 호출이 통과해 그 항목의 작성 내역(`emp44_eval_write` 3행)이 고아가 됐다(항목을 다시 넣어 총 11개·합 100으로 되돌렸으나 옛 ID는 못 되살림) → [보안_및_버그_의심] 후보 A.
- 삭제(`DELETE /{id}`)는 서버가 사용 중(`emp43` 대상자 있음)이면 막는다(정상).
- 확정 때 "이전 적용일로 평가 중인 내역" 검사도 서버에 있다.
- 안 한 것: KFS #1398에서 회사 0 항목을 고쳐 보기(모든 신규 회사의 출발점이라 읽기만), 평가등급 조회창 저장·삭제(`PUT /eval-grades`), 항목 평가기간 설정(`sys01` 인사평가 평가기간 05 반기별) 켜기, 화면 눈 확인.
- 확인한 것: kalpa는 회사 설정 `sys01_emp_eval_cycle_cd`가 비어 있어 평가기간 콤보가 꺼지고 기간코드는 `10`(전체).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: EMP-BZ-0023
needs: []
steps:
  - no: 3
    actor: { company: kalpa, user: "301", password: "Kalpa1234!" }
    api: POST /api/v1/emp/eval-list-stds
    body: { startDate: "2027-01-01" }
    expect: { tables: { emp40_eval_list_std: +1, emp41_eval_list: +11, emp42_eval_grade: +5 }, again: 409 DUPLICATE_DATA }
  - no: 4
    api: PUT /api/v1/emp/eval-lists
    body: { evalListStdId: "<3>", rows: [{ evalListId: 0, evalClassCode: "010", content: "(업무분석 시험) 추가 항목", weightMember: 50, weightLeader: 50, seq: 99 }], deleteIds: [] }
    expect: { table: emp41_eval_list, delta: +1 }
  - no: 6
    api: PUT /api/v1/emp/eval-list-stds/fix
    body: { startDate: "2027-01-01", fixYn: true }
    note: 확정 뒤에도 PUT /eval-lists 가 200 (후보 A)
  - no: 7
    api: [PUT /api/v1/emp/eval-list-stds/fix { fixYn: false }, DELETE /api/v1/emp/eval-list-stds/{id}]
    expect: { tables: { emp40_eval_list_std: -1, emp41_eval_list: -12, emp42_eval_grade: -5 } }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS 화면: `Emp41_Tab_EvalList`(#1391·#1398) + `Emp40_Lookup_Insert`(적용일 생성) + `Emp42_Lookup_EvalGrade`(평가등급). 이벤트 E0~E16(`updateFormChk` L411-451, 확정 `confirm`).
- AS-IS 서버: `emp.Emp40_EvalListStd`(`insert`·`updateFixYn`·`deleteByEvalListStdId`·`selectByCompanyId`), `emp.Emp41_EvalList`(`selectByEvalListStdId`·`updateList`), `emp.Emp42_EvalGrade`(`selectByEvalListStdId`·`updateList`), `emp.Emp43_EvalTarget.getEventChk·getEventChk2·getDateChk`.
- TOBE: `/api/v1/emp/eval-list-stds`(`GET`·`POST`·`PUT /fix`·`DELETE /{id}`·`GET /{id}/in-use`·`GET /applied`), `/api/v1/emp/eval-lists`, `/api/v1/emp/eval-grades`; `EmpEvalListStdService.create` L44-80, `EmpEvalListService.update` L36-51.
- `yunhee trace-crud -s '#1391'`: `emp40`·`emp41`·`emp42` ASIS CRUD / TOBE CRUD 같음.
- TOBE 상태(2026-11-12): 실행(API). 화면 눈 확인 `대기`.
</details>
