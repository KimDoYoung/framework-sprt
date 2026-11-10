# EMP-BZ-0008 임원 정보를 관리한다 (선임·임기·해임)

> **한 줄 요약** — 임원은 **직원 발령에서 "임원"이나 "등기임원"으로 표시된 사람**이다. 그 사람들이 #1294에 자동으로 나타나고, 고객사 관리자가 **선임일·임기만료일·보유 주식·겸직·자격요건·해임일** 같은 임원만의 정보를 붙인다. 임원 선임/해임 보고서(RD)를 뽑는 근거 자료다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 고객사 관리자 — `kalpa/admin/1111` |
| 언제 | 임원 선임·임기 갱신·해임 때 |
| 먼저 있어야 하는 것 | EMP-BZ-0002(발령에 임원·등기임원 표시). 직원이 없으면 목록이 비어 있다 |
| 다음 이벤트 | 임원 선임/해임 보고(RD 출력), 문서분류 지정(DCR) |
| 실제 실행 | kalpa, 2026-11-10 — `100 김사장`에 등기임원 발령을 넣어 목록에 나타낸 뒤 임원 정보 저장·해임 → 발령 삭제, 정보 비움 |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 고객사 관리자 | **#1294** 경영관리 > 01. 조직 및 사원관리 > 임원정보 관리 | 화면을 연다 | **kalpa는 목록이 비어 있다**(임원 표시된 발령이 없음) |
| 2 | 〃 | **#1029** 일반발령 탭 | `김사장` 새 발령: 등기임원 체크 → [저장] | (EMP-BZ-0002와 같은 방법) |
| 3 | 〃 | #1294 | [조회] | `김사장 · 사장 · 등기` 한 줄. 주민번호는 "미입력"(인적사항에 넣으면 앞 6자리) |
| 4 | 〃 | 〃 | 최초선임일 `2020-03-02`, 최근선임일, 임기만료일 `2029-03-26`, 선임횟수 `2`, 겸직사항, 자격요건확인, 우선주·보통주, 비고 → [저장] | 저장 후 다시 조회 |
| 5 | 〃 | 〃 | 해(사)임일 `2026-11-01`, 해(사)임 사유 → [저장] → [조회] | **목록에서 사라진다** |
| 6 | 〃 | 〃 | "해임임원 포함" 체크 → [조회] | 해임한 임원이 다시 보인다 |
| 7 | 〃 | 〃 | [문서분류지정] (행 선택 필요 없음) | 문서분류 지정 창(DCR, 연결코드 `LinkCode0005`) — 이 보고서를 어느 문서분류로 올릴지 회사 단위로 정한다 |
| 8 | 〃 | 〃 | 행 선택(여러 명 가능) → [임원 선임/해임 보고] | 안 고르면 "선임(해임)보고 대상을 선택해주세요". 고른 사람 중 최근선임일이 비면 "○○님의 최근선임일을 입력해주세요.", 임기만료일이 비면 "○○님의 임기만료일을 입력해주세요." 통과하면 출력 자료 두 벌(고른 임원 · 전체 현임 임원)을 `sys99_print`에 만들고 RD `Emp31_Rd_Director` 창을 연다 |

## DB에 남는 것

| 테이블 | 무엇 | 변화 |
|:---|:---|---|
| `emp31_director` | 임원 정보(선임일·임기·주식·겸직·해임) — 사원당 한 줄 | 처음 저장하면 +1, 다음부터 고침 |
| `sys99_print` | 선임/해임 보고서 출력 자료(로그인 사용자별 임시) | 단계 8에서 그 사용자 것을 지우고 다시 넣음 → 행 수 그대로 |

- 임원 목록 자체(`성명·직위·등기여부·주민번호·경력`)는 **직원 정보에서 읽어 온다**(`emp01`·`emp02`·`emp03`·`emp07_career`의 주요경력). 이 화면에서 고치는 것은 선임일~비고, 해임 칸뿐이다.

## 결과를 볼 수 있는 화면

- #1294, 임원 선임/해임 보고서(RD), 책무구조도 쪽 임원 배정(TDM — 이 테이블들을 읽는다).

## 업무 규칙 · 주의

- **목록에 나타나는 조건**(원본 `emp31_director.selectByText`): 그 사원의 **가장 늦은 발령**에서 `임원(emp03_director_yn)=true` 또는 `등기임원(emp03_officer_yn)=true`, 임시직(40)·기타직(99)·겸직(800)·겸직용 사원은 제외, 해임일이 지났으면 "해임임원 포함"을 켜야 보인다. 정렬은 등기 먼저 → 최초선임일 → 직위.
- TOBE 목록은 원본 SQL과 행 수가 같다(`yunhee compare`: 해임임원 포함 끔 0 = 0, 켬 1 = 1; 열 19개 포함).
- ⚠ **TOBE 부족(EMP-BZ-0002의 [임원] 열 없음)이 여기로 이어진다.** 임원(`emp03_director_yn`)은 일반발령 탭의 [임원] 열에서만 정하는데 TOBE에는 그 열이 없다. 그래서 TOBE에서 **새로 임원으로 올릴 수 있는 길은 "등기임원" 하나뿐**이고, 비등기 임원은 원본에서 넘어온 데이터(실제 DB에 259건)로만 존재한다. 비등기 임원을 새로 선임하려면 원본 화면을 써야 한다.
- 저장은 값을 **그대로 덮어쓴다**: 일부 칸만 보내면 나머지는 비워진다(실행에서 확인). 화면은 그리드의 전체 행을 보내므로 보통 문제 없지만 API로 부분 값만 넣으면 지워진다(원본 `updateList`도 같은 방식).
- 원본에는 [행 추가]·[삭제] 버튼이 없다(`insertRow`·`deleteRow`는 호출하는 곳이 없다) — TOBE에 삭제가 없는 것이 맞다. 그래서 `emp31_director` 행은 한 번 만들어지면 **지울 수 없다**(kalpa에 `김사장` 행 1줄이 값이 비워진 채 남았다).
- 보고서 출력 자료 API는 확인했다(2026-11-10 Opus 재검토, kfstest 관리자): `POST /api/v1/emp/directors/rd-print-senior`(고른 2명 → 그룹 ID, 21행) · `rd-print-total`(전체 현임 → 그룹 ID, 10행), 둘 다 200. TOBE 화면의 세 검사(대상 선택·최근선임일·임기만료일)는 `Emp31_Tab_Director.tsx` L71-80에 원본 문구 그대로 있다. RD 창 자체(시뮬레이터)와 문서분류 지정 창은 확인하지 않았다.
- "비등기 임원 259건"은 asseterpdb 전체의 `emp03_director_yn = 'true'` **발령 행** 수다(사람 수가 아니다).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: EMP-BZ-0008
needs: [EMP-BZ-0002]
actor: { company: kalpa, user: admin, password: "1111" }
setup:
  - api: PUT /api/v1/emp/trans
    body: [{ personId: "<김사장>", transDate: "2026-11-10", transCd: "200", kindCd: "10", orgCodeId: "<루트>",
             titleCd: "100", posCd: "100", officerYn: "true", transReason: "등기임원 선임" }]
steps:
  - no: 3
    api: GET /api/v1/emp/directors?searchText=%
    expect: { rows: 1, row: { personName: "김사장", officerYn: "true", ctzNo: "미입력" } }
  - no: 4
    api: PUT /api/v1/emp/directors
    body: [{ personId: "<김사장>", initAssignDate: "2020-03-02", rcntAssingDate: "2026-03-27", expireDate: "2029-03-26",
             assignCnt: 2, qualified: "적격", preferStock: 0, commonStock: 1000, note: "시험" }]
    expect: { table: emp31_director, delta: "+1(처음이면)" }
  - no: 5
    api: PUT /api/v1/emp/directors
    body: [{ personId: "<김사장>", ..., endDate: "2026-11-01", endReason: "시험 해임" }]
    then: [{ api: "GET /api/v1/emp/directors?endCheck=false", expect: { rows: 0 } },
           { api: "GET /api/v1/emp/directors?endCheck=true",  expect: { rows: 1 } }]
cleanup: DELETE /api/v1/emp/trans [<등기임원 발령>] ; PUT directors {personId} (값 비움)
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS 화면: `Emp31_Tab_Director`(#1294) — [조회] E2 `retrieve` L189-201 · [저장] E3 `update` L204-230 · [문서분류지정] E4(`Dcr30_Lookup_Link`) · [임원 선임/해임 보고] E5 `createPrint` L246-315. 그리드 16열(성명·한자명·직위·등기여부·주민번호·선임일들·임기만료일·선임횟수·겸직사항·자격요건확인·우선주·보통주·해(사)임일·사유·비고)
- AS-IS 서버: `emp.Emp31_Director.selectByText`(`emp31_director.selectByText`), `updateList` L36-55, `sys.Sys99_Print.insertRdDirector01·02`
- TOBE: `GET·PUT /api/v1/emp/directors`(`EmpDirectorService`), `POST /api/v1/emp/directors/rd-print-senior·rd-print-total`
- TOBE 상태(2026-11-10): **실행** — 목록(임원 조건·해임임원 포함), 저장, 해임, 보고서 출력 자료 API. RD 창·문서분류지정은 안 함. 화면 눈 확인은 `대기`.
</details>
