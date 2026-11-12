# EMP-BZ-0024 인사평가를 진행한다(대상자 → 평가 → 인사부 보고 → 대표이사 최종보고)

> **한 줄 요약** — 경영관리가 **평가 대상자와 1차·2차 평가자(비중 합 100%)** 를 정하면(#1392), 평가자가 각자 #1393에서 **항목마다 등급을 매기고 평가완료**한다. 인사부가 #1394에서 상점·벌점·평정사유 가감을 넣고 **1차 보고(A70)를 상신·결재**, 대표이사가 #1395에서 **가점·감점을 넣고 최종 보고(A71)를 상신·결재**하면 #1396에서 최종 점수·등급을 본다. 점수는 `항목 가중치 × 등급 가중치`의 합이다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 경영관리(과장 `kalpa/301/Kalpa1234!`) → 평가자(301·302 과장, 202 부장) → 인사부(301) → 임원(201 상신, 사장 100 결재) |
| 언제 | 해마다(기간코드 `10` 전체, 반기별 회사는 `20` 상반기·`30` 하반기) |
| 먼저 있어야 하는 것 | EMP-BZ-0023(확정된 기준 적용일·항목·등급), EMP-BZ-0001(직원), 결재 문서분류(kalpa는 A70·A71 분류 미지정 → **휴가신청서** 분류로 대신 씀) |
| 다음 이벤트 | 결과 조회(#1396). 다음 해에 다시 |
| 실제 실행 | kalpa, 2026-11-12, API(T3600 DB). 2026년 전체 · 대상 김사원(1차 301 100%), 최사원(1차 302 60%·2차 202 40%) → 평가 → 가감 → A70 상신·승인 → 가점·감점 → A71 상신·승인 |
| 메뉴 | #1392 경영관리 > 05. 인사평가 > 인사평가 대상자(`경영 관리자`) · #1393 인사평가수행(평가자)(`경영 관리자`·`임원`) · #1394 인사평가결과(인사부)(`경영 관리자`) · #1395 인사평가보고(대표이사)(`임원`) · #1396 인사평가 결과조회(`경영 관리자`·`임원`). 화면 눈 확인 `대기` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 과장 | **#1392** | 평가기간 `2026` 년·`전체`(회사 설정이 반기별이 아니면 콤보 꺼짐) → [조회] | 대상자 그리드(구분·직위·성명·부서·1차/2차 평가자·비중·진행상태). 최종 결재가 완료(30)면 [저장]·[등록]·[삭제] 꺼짐 |
| 2 | 〃 | 〃 | [등록] → 사원 조회창(`GET /candidates`)에서 `김사원` `최사원` 선택 → 행마다 1차 평가자(직책·성명 조회창)·비중, 2차 평가자·비중 입력 → [저장] | 행이 저장됨. 비중 합이 100이 아니면 "평가비중 합계는 100(%)이어야합니다", 1차 평가자 비면 "1차 평가자는 필수선택항목입니다" |
| 3 | 평가자 | **#1393** | 평가기간 → [조회](로그인 사원이 1·2차 평가자인 대상자만) → 행의 인사평가표 아이콘 | 평가 작성창(항목 11개, 항목별 등급 콤보) |
| 4 | 〃 | 평가 작성창 | 항목마다 등급 선택(→ 항목 가중치×등급 가중치가 점수로) → (등급이 평정사유 필수면 사유 입력 [저장]) → [평가완료] | "인사평가처리가 완료되었습니다". 점수·등급 열이 채워지고 상태 `완료`. 빠진 항목이 있으면 "평가처리하지 않은 항목이 존재합니다" |
| 5 | 인사부(과장) | **#1394** | [조회] → 행의 수정 아이콘 → 상점·벌점·평정사유 가감 [저장] | "평가결과 합계 + 상점 − 벌점 + 가감"이 변경결과 열에 나옴 |
| 6 | 〃 | 〃 | 문서분류 선택 → [상신] | 1차 보고 결재문서 `2026년도 전체 인사평가 수행결과 보고`(링크코드 A70, 본문에 대상자별 결과표). 상신상태 `상신` |
| 7 | 결재자(부장 201) | 결재할 문서함 | [승인] | 상신상태 `완료`. 이때부터 #1393 평가취소·#1394 점수 수정은 화면에서 "1차보고 상신문서가 존재하여 수정이 불가능합니다" |
| 8 | 대표이사(임원) | **#1395** | [조회] → 행의 수정 아이콘 → 대표이사 가점·감점 [저장] | 최종결과 열(점수·등급)이 바뀜 |
| 9 | 〃 | 〃 | 문서분류 → [상신] → 결재 | 최종 보고 `2026년도 전체 인사평가결과 최종보고`(A71). 승인되면 #1392 [저장]·[등록]·[삭제] 꺼짐 |
| 10 | 누구나 권한 있는 사람 | **#1396** | 평가기간·사원명·검색 → [조회](기간조건 제외 켜면 전체 기간) | 평가기간·1차·2차·합계·가감·대표이사·최종결과 열 |

## DB에 남는 것

| 테이블 | 무엇 | 단계 |
|:---|:---|:---|
| `emp43_eval_target` | 대상자(기간·적용일·1차/2차 평가자·비중·점수·평정사유·완료여부·상점·벌점·가감·대표이사 가점·감점) | 2 +2, 4 점수·완료 갱신, 5·8 가감 |
| `emp44_eval_write` | 평가자가 매긴 항목별 등급·환산점수(평가자·대상자·항목당 1행) | 4 +11(301→김사원) +11(302→최사원) +11(202→최사원) |
| `emp45_eval_relate_appr` | 기간별 1차·최종 보고 문서 연결(1행, 1차 문서 ID·최종 문서 ID) | 6 +1, 9 최종 ID |
| `apr01_appr`·`apr04_appr_step` | 1차 보고·최종 보고 문서(상신→완료)·결재선 | 6, 7, 9 |

## 결과를 볼 수 있는 화면

- #1396 결과조회, #1394·#1395 그리드(상신상태 `완료`), 결재 문서함·완료함, #1392 진행상태 열.

## 업무 규칙 · 주의

- **점수 계산**(실행 확인): 항목 가중치(조직원 열 사용, 11개 합 100) × 등급 가중치(A 0.9)의 합 = **90.0 → 등급 A**(기준점수 이상). 최사원: 1차 302 B(80.0)·2차 202 A(90.0) → 합계 `80×0.6 + 90×0.4 = 84.0`(B). 김사원: 합계 90.0 + 상점 3 − 벌점 1 + 가감 2 = **94.0**(A) → 대표이사 가점 2 → **96.0 → S**. 최사원: 84 → 대표이사 감점 4 → **80.0**(B).
- **진행상태 열**: 대상자에게 평가 작성 행(`emp44`)이 하나라도 있으면 늘 `진행중`이고, 없을 때만 그 기간의 1차보고 문서에 따라 `상신중`·`완료`가 나온다(원본 SQL `emp43_eval_target.selectByTermCode` 같음). 그래서 #1392 [저장]이 막는 "상신중/완료건이 포함되어있습니다"는 평가가 시작된 대상자에게는 사실상 작동하지 않는다(실제 막는 곳은 `appr-status`/`final-appr-status`로 읽는 최종 결재 상태뿐) → [보안_및_버그_의심] 후보 F.
- **서버 규칙이 거의 없다 — 화면에서만 막는다**(원본·TOBE 같음). 실제 호출 결과:
  - 비중 합 50% + 자기 자신을 평가자로 한 중복 대상자 행 저장 → 200(후보 B).
  - 평가자가 작성하지 않은 항목이 있어도 [평가완료] 호출 → 200, 3개 항목(27.0점)만으로 완료 처리됨(원본 L396 "평가처리하지 않은 항목이 존재합니다"는 화면 검사)(후보 C).
  - 1차 보고 결재가 완료(30)된 뒤에도 평가취소·재완료(302)·가감 수정·대표이사 가점 → 200. 결재문서에 적힌 점수와 DB 점수가 어긋날 수 있다(후보 D).
  - **권한 없는 사원 401이 `PUT /eval-targets/{id}/ceo-score`로 자기 평가에 대표이사 가점 10을 넣어 저장됨**(곧바로 사장이 2로 덮어씀), 같은 사원이 `GET /eval-targets/admin`으로 회사 전체 대상자의 점수·등급·평정사유를 조회(200, 행 2). 가감·상신 연결·평가자 변경도 로그인 사원이 누구든 서버가 막지 않는다(메뉴 권한은 화면 메뉴에만 있음, 후보 E).
  - 평가 작성 `PUT /eval-writes/grade`는 대상자가 같은 회사인지만 보고 **로그인 사원이 그 대상자의 평가자인지는 보지 않는다**(`EmpEvalWriteService.updateGrade` L38-48, 코드로 확인 — 시험 데이터가 남을까 봐 호출은 안 함)(후보 E).
- **평가자가 바뀌면**(대상자 [저장]) 이전 평가자의 작성 내역(`emp44`)을 지우고, [삭제]도 같다(`deleteChangedWrites`). 2차는 DB에 2차 평가자가 있을 때만.
- **A70·A71 본문**은 서버가 그 기간 전체 대상자를 다시 읽어 만든다. 결재 저장 `PUT /apr/apprs/{id}`는 `effectDate`·`regDate`를 `2026-11-12T00:00:00`(날짜+시각)로 받는다(날짜만 보내면 500 `DateTimeParseException`, 상신일 없으면 "상신일은 필수입력 항목입니다" — 링크 시드가 돌려주는 `effectDate`는 날짜만이라 호출 쪽이 시각을 붙여야 한다).
- 최종 보고 상신(`createRelateAppr`, finalAppr=true)은 이미 있는 연결 행의 **최종 문서 ID만** 비운다(원본은 행 번호를 넣어 두는 이상한점 #88).
- 안 한 것: 평가자 변경(선택) [평가자 변경]·삭제 흐름, 평가 작성 때 평정사유 필수 등급(S·D) 확인, 상신 반려·재상신, 반기별(`05`) 회사 설정, #1396 `기간조건 제외`·사원명 조건, A70·A71 문서 본문 화면 확인, 화면 눈 확인.

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: EMP-BZ-0024
needs: [EMP-BZ-0001, EMP-BZ-0023]
steps:
  - no: 2
    actor: { company: kalpa, user: "301", password: "Kalpa1234!" }
    api: PUT /api/v1/emp/eval-targets
    body: { deleteWrites: false, rows: [
      { evalTargetId: 0, personId: "<401>", stdYear: "2026", stdTermCd: "10", evalListStdId: "<확정 적용일>", evalStartDate: "2026-01-01", evalCloseDate: "2026-12-31", firstEvaluatorId: "<301>", firstEvalWeight: 100 },
      { evalTargetId: 0, personId: "<402>", stdYear: "2026", stdTermCd: "10", evalListStdId: "<확정 적용일>", evalStartDate: "2026-01-01", evalCloseDate: "2026-12-31", firstEvaluatorId: "<302>", firstEvalWeight: 60, secondEvaluatorId: "<202>", secondEvalWeight: 40 } ] }
    expect: { table: emp43_eval_target, delta: +2 }
  - no: 4
    actor: { user: "301" }
    api: PUT /api/v1/emp/eval-writes/grade   # 항목 11개 각각 { evalTargetId, evalListId, evalGradeId(A), orgHead: false }
    expect: { table: emp44_eval_write, delta: +11, grade: "A", sum: 90.0 }
    then:
      - PUT /api/v1/emp/eval-targets/{id}/reason   # { reason, orderEvalName: "1차" }
      - PUT /api/v1/emp/eval-targets/{id}/end      # { endYn: true, orderEvalName: "1차" }  → emp43_first_eval_score 90.0
  - no: 4b
    actor: { user: "302" }  # 402의 1차 B(80.0), 202가 2차 A(90.0) → 합계 84.0
  - no: 5
    actor: { user: "301" }
    api: PUT /api/v1/emp/eval-targets/{401 대상자}/score   # { plusScore: 3, minusScore: 1, reasonAdjustScore: 2 } → adjustEvalScore 94.0
  - no: 6~7
    actor: { user: "301" }
    api:
      - POST /api/v1/emp/eval-targets/relate-appr?stdYear=2026&stdTermCode=10&finalAppr=false
      - GET /api/v1/apr/apprs/link-seed?classTreeId=<휴가신청서>&linkCode=A70&refId=<relateApprId>&stdYear=2026&stdTermCode=10
      - GET /api/v1/apr/apprs/new?classTreeId=…
      - PUT /api/v1/apr/apprs/{apprId}   # mode request, linkCode A70, steps 001 상신 301 / 002 결재(10) 201, effectDate·regDate 시각 포함
      - PUT /api/v1/emp/eval-targets/relate-appr/{relateApprId}/appr-id?finalAppr=false   # { apprId }
    then: { actor: { user: "201" }, api: POST /api/v1/apr/apprs/{apprId}/confirm, expect: { appr-status: "30" } }
  - no: 8~9
    actor: { user: "100" }
    api: [PUT /api/v1/emp/eval-targets/{id}/ceo-score  # 401 { ceoEvalBonus: 2 } → 96.0 S / 402 { ceoEvalPenalty: 4 } → 80.0 B,
          "A71 상신(201 상신·100 결재) → confirm"]
    expect: { final-appr-status: "30" }
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS 화면: `Emp43_Tab_EvalTarget`(#1392, `updateChk` L551-630) + `Emp43_Lookup_SelectSingle`·`Emp43_Lookup_SelectMulti`·`Emp43_Edit_ChangeEval`, `Emp43_Tab_EvalExecute`(#1393) + `Emp44_Lookup_Write`(평가 작성, 메시지 L208·L223·L386·L396), `Emp43_Tab_FirstAppr`(#1394) + `Emp43_Edit_Score`, `Emp43_Tab_FinalAppr`(#1395) + `Emp43_Edit_CeoScore`, `Emp43_Tab_EvalResult`(#1396).
- AS-IS 서버: `emp.Emp43_EvalTarget`(`selectByTermCode`·`selectByText`·`selectByTextAdmin`·`selectByTextAdminAll`·`update`·`updateList`·`deleteList`·`updateEval`·`updateReason`·`updateEndYn`·`modelUpdate`), `emp.Emp44_EvalWrite`(`getEvalTargetList`·`updateEvalGradeId`), `emp.Emp45_EvalRelateAppr`(`insert`·`insertFinal`·`updateApprId`·`updateFinalApprId`), 결재 `Apr01_Edit_ApprDoc.insertLinkApprovals`(A70·A71).
- TOBE: `/api/v1/emp/eval-targets`(`GET`·`/mine`·`/admin`·`/admin-all`·`/candidates`·`/setting`·`/appr-status`·`/final-appr-status`·`/relate-appr`·`/{id}/score`·`/{id}/ceo-score`·`/{id}/reason`·`/{id}/end`·`PUT`·`DELETE`·`/evaluators`), `/api/v1/emp/eval-writes`(`GET`·`/grade`·`PUT /grade`), `EmpEvalTargetService`, `EvalLinkSeedProvider`(A70·A71).
- `yunhee trace-crud -s '#1392'`~`#1396`: `emp43`·`emp44`·`emp45` 쓰기 짝은 같다. 표의 `emp44 D 없음`·`sys01_company U 없음`은 도구 판정이다(TOBE `deleteWriteByPersonId`가 있어 emp44 D는 있다. `sys01_company`는 인사평가 설정을 읽기만 한다).
- TOBE 상태(2026-11-12): 실행(API). 화면 눈 확인 `대기`.
</details>
