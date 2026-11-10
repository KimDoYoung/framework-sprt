# SYS-BZ-0011 특정화면을 쓰겠다고 요청하고 KFS가 승인한다

> **한 줄 요약** — 급여(연봉)·인감처럼 민감한 화면은 "특정화면"(`sys50_specific_menu`)으로 묶여 **일반 메뉴·권한그룹에서 빠진다.** 고객사 직원이 #1409에서 요청을 등록하고 **전자결재(연결코드 A80)로 사내 승인**을 받으면, KFS 관리자가 #1410에서 결재가 끝난 요청을 보고 처리상태를 `완료`로 바꾼다. 실제로 화면을 열어 주는 것은 그다음 KFS가 #1075 특정매뉴 탭에서 한다(이번에는 안 함).

| 항목 | 내용 |
|:---|:---|
| 누가 | ① 요청: 고객사 직원 — #1409를 가진 권한그룹(`경영 관리자`·`내부통제 관리자`), 칼파테크는 과장 `kalpa/301/Kalpa1234!` ② 결재: 상신자가 고른 결재자, 이번엔 부장 `kalpa/201` ③ 처리: KFS 관리자 `admin/admin/1111` |
| 언제 | 특정화면(급여·인감 등)을 쓰고 싶을 때 |
| 먼저 있어야 하는 것 | SYS-BZ-0003(#1409 메뉴), EMP-BZ-0001·SYS-BZ-0012(직원 로그인), SYS-BZ-0006(과장에게 `경영 관리자`) |
| 다음 이벤트 | KFS가 특정메뉴·사용자 지정(#1075 특정매뉴 탭) — 목록에 아직 ID 없음 |
| 실제 실행 | kalpa(회사ID 202611109046432), 2026-11-10 — 특정업무 `인감관리` |

## 따라 하기

### ① 과장 — 요청 등록과 결재 상신

| 단계 | 화면 | 누르는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|
| 1 | **#1409** 관리자 > 01. 화면권한관리 > 특정화면 사용요청 | [등록] | 새 행: 신청일 오늘, 신청자 `경영지원본부 김과장` |
| 2 | 〃 | 특정업무 칸 → `인감관리` → [저장] | 저장됨. 문서상태·처리상태는 빈칸 |
| 3 | 〃 | 그 행의 **결재요청** 칸 | 문서분류 선택 창(회사에 A80 연결 분류가 없어서 직접 고름) → `총무/인장/법인인감 날인대장` |
| 4 | 결재문서 창 | 제목 `특정화면 사용요청_인감관리_(기준일:2026-11-10)`, 본문(요청 내용 표)이 미리 채워짐. 결재선에 **결재: 본부장 박부장** 추가 → [결재요청] | 상신 완료. #1409 행의 문서상태 `상신`(결재자가 여럿이면 중간에 `결재중`) |

※ 특정업무를 고르지 않으면 "특정업무 구분은 필수선택 항목입니다", 저장 전에 결재요청을 누르면 "저장 후에 결재요청을 진행해주세요".

### ② 부장 — 결재

| 단계 | 화면 | 누르는 것 | 결과 |
|:---:|:---|:---|:---|
| 5 | 결재할 문서함(전자결재) → 그 문서 | [승인] → 의견 `승인합니다` | 결재 완료. #1409 행의 문서상태 `완료` |

### ③ KFS 관리자 — 처리

| 단계 | 화면 | 누르는 것 | 결과 |
|:---:|:---|:---|:---|
| 6 | **#1410** 관리자 > 01. 고객관리 > 고객별 특정화면 관리 | 회사 `전체` → [조회] | **결재가 끝난 요청만** 나온다: `(주)칼파테크 · 경영지원본부 김과장 · 인감관리 · 완료` |
| 7 | 〃 | 처리자 `KFS 관리자`, 처리일 `2026-11-10`, 처리상태 `완료` → [저장] | #1409에서 과장에게 처리담당자 `KFS 관리자`, 처리상태 `완료`로 보인다 |

## DB에 남는 것

| 테이블 | 무엇 | 추가·변경 | 행 |
|:---|:---|:---|---:|
| `sys53_specific_menu_request` | 요청(회사·신청자·특정업무 `020`·결재문서ID·처리자·처리상태) | 추가(1·2), 결재문서ID(4), 처리(7) | 1 |
| `apr01_appr` | 결재문서(연결코드 A80, 분류 법인인감 날인대장) | 추가(4), 상태 `30 완료`(5) | 1 |
| `apr04_appr_step` | 결재선: 001 상신 김과장 · 002 결재 박부장 | 추가(4), 둘 다 `20 승인`(5) | 2 |

## 업무 규칙 · 주의

- **처리상태는 상신·결재로 바뀌지 않는다.** KFS가 #1410에서 손으로 `대기`·`완료`·`반려`를 넣는다(그 전에는 빈칸). 원본 kfstest의 요청 중에도 KFS가 `대기`로 둔 것이 있다.
- **`완료`로 바꿔도 화면이 열리지 않는다.** #1410은 기록만 한다. 화면을 쓰게 하려면 KFS가 #1075 고객별 시스템정보 관리의 특정매뉴 탭에서 ⓐ그 회사에 해당 메뉴를 특정메뉴로 지정(`sys50_specific_menu`)하고 ⓑ쓸 사람을 지정(`sys51_specific_menu_person`)해야 한다. 특정메뉴로 지정된 메뉴는 일반 메뉴 트리·권한그룹 메뉴에서 빠지고 지정된 사람에게만 보인다(`sys06_menu.xml` 메뉴 조회의 `NOT EXISTS sys50_specific_menu`). 예: kfstest는 `급여(연봉)관리`로 #1104·#1037·#1082를 묶어 3~4명에게 줬다.
- 칼파테크에는 인감 메뉴가 없어서(`prod_s1` 상품) 이번에는 ⓐⓑ를 하지 않았다.
- 결재가 진행 중이거나 끝난 요청은 특정업무를 바꿔 저장할 수 없다("진행중인 문서가 포함되어있습니다. 취소 후 진행해주세요"). **이 검사는 화면에만 있다**(AS-IS `update()` L284-291도 화면, TOBE `Sys53_Tab_SpecificMenuRequest.tsx`도 화면). API로 직접 보내면 저장된다 — 실행 중 확인했고 값은 원래대로 되돌렸다.
- 회사에 A80 연결 문서분류(`dcr30_link`)가 정해져 있지 않으면 상신자가 매번 문서분류를 고른다(회사 0·kfstest도 비어 있음).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: SYS-BZ-0011
needs: [SYS-BZ-0003, SYS-BZ-0006, SYS-BZ-0012]
steps:
  - no: 2
    actor: { company: kalpa, user: "301", password: "Kalpa1234!" }
    screen: 1409
    api: PUT /api/v1/sys/specific-menu-requests
    body: [{ specificMenuRequestId: null, specificWorkCd: "020", apprId: null }]
  - no: 4
    actor: { company: kalpa, user: "301" }
    action: '결재요청 → 문서분류 법인인감 날인대장 → 결재 박부장 → [결재요청]'
    api:
      - GET /api/v1/apr/apprs/new?classTreeId=<총무/인장/법인인감 날인대장>
      - GET /api/v1/apr/apprs/link-seed?classTreeId=…&linkCode=A80&refId=<요청ID>
      - PUT /api/v1/apr/apprs/{apprId}   # mode=request, linkCode=A80, steps: 001 상신 김과장 + 002 결재(10) 박부장
      - PUT /api/v1/sys/specific-menu-requests/{요청ID}/appr-id   # { apprId }
  - no: 5
    actor: { company: kalpa, user: "201", password: "Kalpa1234!" }
    api: POST /api/v1/apr/apprs/{apprId}/confirm
    body: { action: confirm, message: "승인합니다" }   # action이 confirm이 아니면 반려로 처리된다
  - no: 7
    actor: { company: admin, user: admin, password: "1111" }
    screen: 1410
    api: PUT /api/v1/sys/specific-menu-requests/admin
    body: [{ specificMenuRequestId: "<요청ID>", stateCd: "20", confirmNm: "KFS 관리자", confirmDate: "2026-11-10" }]
expect:
  - { table: sys53_specific_menu_request, where: "sys53_company_id = :cid and sys53_specific_work_cd = '020' and sys53_state_cd = '20'", rows: 1 }
  - { table: apr01_appr, where: "apr01_appr_id = :apprId and apr01_status_cd = '30'", rows: 1 }
```
</details>

<details>
<summary>확인 SQL</summary>

```sql
select r.sys53_reg_date::date, f_cdnm('SpecificWorkCode', r.sys53_specific_work_cd, 0, f_sysdate()) 업무,
       f_cdnm('AprStatusCode', a.apr01_status_cd, 0, f_sysdate()) 문서, r.sys53_confirm_nm,
       f_cdnm('SpecificStateCode', r.sys53_state_cd, 0, f_sysdate()) 처리
  from sys53_specific_menu_request r left join apr01_appr a on a.apr01_appr_id = r.sys53_appr_id
 where r.sys53_company_id = :cid;

select apr04_seq, apr04_step_type_cd, apr04_step_status_cd from apr04_appr_step where apr04_appr_id = :apprId order by 1;
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS 화면: `Sys53_Tab_SpecificMenuRequest`(#1409. `insertRow` L266-274 신청자=로그인 사원, `update` L276-295 필수·진행중 검사, 결재요청 칸 L140-171 → `checkdcr` L185-217(A80 연결 분류 없으면 분류 선택) → `insertLinkApproval` L219-230 → `updateApprId` L232-249), `Sys53_Tab_SpecificMenuRequestAdmin`(#1410. 처리자·처리일·처리상태 편집 L152-172, `selectByTextAdmin`), 결재문서 본문 `SpecificMenuRequestHtmlData`
- AS-IS 특정메뉴: `Sys50_TabPage_SpecificMenu`(#1075 탭), 메뉴 조회 `sys06_menu.xml` L84-89·L280-285·L457-461(`sys50`·`sys51` 제외)
- TOBE: `/api/v1/sys/specific-menu-requests`(`GET`·`GET /new-row`·`PUT`·`PUT /{id}/appr-id`·`DELETE`·`GET·PUT /admin`), 결재 `/api/v1/apr/apprs`(`/new`·`/link-seed`(`SpecificMenuRequestLinkSeedProvider`)·`PUT /{apprId}`·`/{apprId}/confirm`), 특정메뉴 `/api/v1/sys/companies/{companyId}/specific-menus`
- TOBE 상태(2026-11-10): **실행** — kalpa에서 API로 요청→상신→승인→KFS 완료까지. 결재문서 제목 형식은 원본 kfstest 문서와 같다. 앱알림은 시뮬레이터라 실패 경고만 남음. 특정메뉴 지정·자동 시험·화면 눈 확인은 아직.
</details>
