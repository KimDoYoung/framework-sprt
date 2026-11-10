# SYS-BZ-0013 개선사항·오류를 알리고 KFS가 처리한다

> **한 줄 요약** — 고객사 사용자가 #1066에 오류·개선·건의를 올리면(`sys90_after_service`), KFS 관리자가 #1121에서 담당자·완료예정일·수행여부·처리방안을 적는다. 처리가 끝나면 요청자가 #1066에서 **확인**을 체크해 닫는다. 요청자와 KFS는 같은 행의 **서로 다른 칸만** 고칠 수 있다.

| 항목 | 내용 |
|:---|:---|
| 누가 | ① 요청: 고객사 사용자(관리자 `kalpa/admin/1111` 또는 직원) ② 처리: KFS 관리자 `admin/admin/1111` ③ 확인: 요청자 |
| 언제 | 수시 |
| 먼저 있어야 하는 것 | SYS-BZ-0003(#1066 메뉴) |
| 실제 실행 | kalpa(회사ID 202611109046432), 2026-11-10 — **API로**(아래 "메뉴 없음"), ②까지(`진행중`) |

## 따라 하기

### ① 요청자 — 통보

| 단계 | 화면 | 누르는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|
| 1 | **#1066** 커뮤니티 > 90. 기타 > 개선사항 및 오류 통보 | [등록] | 아래 입력란: 요청자 `관리자`(고객사 관리자면 "관리자", 직원이면 본인 이름), 발생일 오늘 |
| 2 | 〃 | 구분 `오류`, 개선 및 오류내용 입력(필요하면 [파일등록]) → [저장] | 목록에 한 줄. 수행여부·담당자는 빈칸 |

이번 내용(SYS-BZ-0008에서 찾은 실제 문제): "2026년 휴일표에 5월 25일(부처님오신날 대체공휴일)과 6월 3일(전국동시지방선거일)이 없어 일자관리(#1080) 달력에 영업일로 나옵니다."

### ② KFS 관리자 — 처리

| 단계 | 화면 | 누르는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|
| 3 | **#1121** 관리자 > 02. 시스템관리 > 개선사항 및 오류 통보 | (기본: 올해 1월 1일~오늘, "미완료건만 보기"·"미확인건만 보기" 체크) [조회] | `(주)칼파테크 · 관리자 · 오류 · …` |
| 4 | 〃 행 선택 → 아래 입력란 | 담당자 `KFS 관리자`, 완료예정일 `2026-11-20`, 수행여부 `진행중`, 처리방안 입력 → [저장] | 요청자 #1066에도 `진행중 · KFS 관리자 · 2026-11-20`, 처리방안이 보임 |
| 5 | (처리가 끝나면) | 수행여부 `완료` → [저장] | "미완료건만 보기"에서 빠짐 |

### ③ 요청자 — 확인 (이번엔 안 함)

| 단계 | 화면 | 누르는 것 | 결과 |
|:---:|:---|:---|:---|
| 6 | #1066 | 행 선택 → **확인** 체크 → [저장] | #1121의 "고객사 확인" `Y`, "미확인건만 보기"에서 빠짐 |

이번에는 KFS 휴일표를 실제로 고치지 않았으므로 4단계 `진행중`에서 멈췄다. 휴일표를 고칠지는 KFS(사용자)가 정한다 — 고치면 5·6단계를 이어서 한다.

## DB에 남는 것

| 테이블 | 무엇 | 추가·변경 | 행 |
|:---|:---|:---|---:|
| `sys90_after_service` | 통보 한 건: 회사·요청자·구분 `10`·발생일·내용(HTML) (①) / 담당자·완료예정일·상태 `20`·처리방안 (②) / 확인 (③) | 추가(①), 변경(②) | 1 |

## 업무 규칙 · 주의

- **칸을 나눠 고친다.** 요청자 저장(`userUpdate`)은 요청자·구분·발생일·내용·확인만, KFS 저장(`adminUpdate`)은 담당자·완료예정일·수행여부·처리방안·비고만 바꾼다(SQL이 그 칸만 SET). 요청자 화면에서 KFS 칸은 읽기 전용이다.
- 수행여부(`AfterStateCode`): `00` 신규 · `10` 이행불가 · `20` 진행중 · `90` 완료. 새 통보는 수행여부가 **빈칸**으로 들어간다(신규 `00`이 자동으로 붙지 않음). #1121 "미완료건만 보기"에는 빈칸도 나온다(실행으로 확인).
- 구분(`AfterServiceCode`): `10` 오류 · `20` 개선 · `30` 건의 · `40` 추가 · `90` 기타.
- 발생일은 필수("발생일자를 입력해주세요"). 내용의 작은따옴표는 저장 전에 두 개로 바꾼다(AS-IS `updateRow` L337).
- 고객사 관리자가 올리면 요청자가 `관리자`로만 남아 누가 올렸는지 알 수 없다(AS-IS `insertRow` L237-239 그대로).
- **메뉴 없음:** 칼파테크(`prod_s1` 상품)에는 #1066이 열려 있지 않다. 그래서 이번에는 화면 대신 API로 했다. 화면으로 하려면 KFS가 #1076에서 #1066을 열어 줘야 한다(SYS-BZ-0003).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: SYS-BZ-0013
needs: [SYS-BZ-0001, SYS-BZ-0002]
steps:
  - no: 1
    actor: { company: kalpa, user: admin, password: "1111" }
    screen: 1066
    api: POST /api/v1/sys/after-services/new        # 새 ID·요청자·발생일만, DB에 쓰지 않음
  - no: 2
    actor: { company: kalpa, user: admin }
    screen: 1066
    api: PUT /api/v1/sys/after-services
    body: { afterServiceId: "<1의 ID>", regEmpNm: "관리자", typeYn: "10", happenDate: "2026-11-10", happenReason: "<p>…</p>", confirmYn: "false" }
  - no: 4
    actor: { company: admin, user: admin, password: "1111" }
    screen: 1121
    api: PUT /api/v1/sys/after-services/admin
    body: { afterServiceId: "<1의 ID>", worker: "KFS 관리자", dueDate: "2026-11-20", stateCd: "20", happenRemedy: "<p>…</p>", remarks: null }
expect:
  - { table: sys90_after_service, where: "sys90_company_id = :cid and sys90_type_yn = '10' and sys90_state_cd = '20' and sys90_worker = 'KFS 관리자'", rows: 1 }
```
</details>

<details>
<summary>확인 SQL</summary>

```sql
select sys90_happen_date::date, sys90_reg_emp_nm,
       f_cdnm('AfterServiceCode', sys90_type_yn, 0, f_sysdate()) 구분,
       f_cdnm('AfterStateCode', sys90_state_cd, 0, f_sysdate()) 수행여부,
       sys90_worker, sys90_due_date::date, sys90_confirm_yn
  from sys90_after_service where sys90_company_id = :cid;
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS 화면: `Sys90_Tab_AfterService`(#1066. `insertRow` L233-251), `Sys90_Edit_Board`(KFS 칸 읽기 전용 `buttonSetting` L178-184, `updateRow` L333-357), `Sys90_Tab_AfterServiceAdmin`(#1121. 기본 조건 `settings` L119-153), `Sys90_Edit_BoardAdmin`(`adminUpdate`)
- AS-IS 서버: `sys.Sys90_AfterService.userUpdate`(Sys90_AfterService.java:229 → `sys90_after_service.userUpdate` upsert), `adminUpdate`(L248 → UPDATE 다섯 칸), `selectByAdmin`·`selectByIncomplete`
- TOBE: `/api/v1/sys/after-services`(`GET`·`POST /new`·`PUT`·`DELETE /{id}`), `/admin`(`GET`·`PUT`), `PUT /{id}/remarks`
- TOBE 상태(2026-11-10): **실행** — kalpa 관리자 통보 → KFS `진행중` 처리까지 API로. 요청자 확인·첨부파일·자동 시험·화면 눈 확인은 아직.
</details>
