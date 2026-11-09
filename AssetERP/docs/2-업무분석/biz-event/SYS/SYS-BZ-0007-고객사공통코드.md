# SYS-BZ-0007 고객사 공통코드를 갖춘다

> **한 줄 요약** — 회사를 등록하면 공통코드 대부분이 자동으로 복사되지만 **사원구분 같은 "시스템코드"는 복사되지 않는다.** KFS 관리자가 [코드복사]로 칼파테크에 사원구분 코드를 넣어 줘야 직원을 등록할 수 있다. (이후 고객사 관리자가 회사 고유 코드를 추가·수정한다.)

| 항목 | 내용 |
|:---|:---|
| 누가 | KFS 관리자 `admin/admin/1111` (코드복사). 고객사 관리자는 자기 회사 코드 수정 |
| 언제 | 회사 등록 직후(직원 등록 전), 코드가 바뀔 때 |
| 먼저 있어야 하는 것 | SYS-BZ-0001 |
| 다음 이벤트 | EMP-BZ-0001 직원 입사 등록 ([목록](../README.md)) |
| 실제 실행 | kalpa, 2026-11-09 (사원구분 5건) |

## 따라 하기 — 사원구분 코드복사

| 단계 | 누가 | 화면 | 누르는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | KFS 관리자 | **#1079** 관리자 > 03. 코드관리 > 고객사 공통코드 (또는 #1248) | 회사 `ADMIN`(기본), 코드구분명 `사원구분` 조회 → 위쪽 목록에서 **사원구분 행 선택** | 아래에 정규직·계약직·수습직(인턴)·임시직·기타직 |
| 2 | 〃 | #1079 | [코드복사] → 회사 선택 창에서 `(주)칼파테크` 선택 | "1개의 회사에 복사하시겠습니까?" |
| 3 | 〃 | 〃 | [예] | "코드 복사가 완료되었습니다" |

※ 코드구분을 **한 개만** 선택해야 한다("복사할 코드를 한개만 선택해주세요" / "…선택해주세요").

## DB에 남는 것

| 테이블 | 무엇 | 추가 | 행 |
|:---|:---|:---|---:|
| `sys09_code` | 칼파테크의 사원구분 코드 | 추가 | 5 (종류 29: 10 정규직·20 계약직·30 수습직(인턴)·40 임시직·99 기타직) |

## 왜 따로 복사하나

- 회사 등록(SYS-BZ-0001)의 회사 초기화는 `sys08_sys_yn = 'false'`인 종류의 코드만 복사한다(`sys09_code.insertFromSys09`: "시스템코드가 아닌 코드들을 일괄추가"). 사원구분(종류 29)은 시스템코드라 빠진다.
- 직위(종류 27)·직책(종류 28)·채용구분(종류 32)은 시스템코드가 아니라 등록 때 이미 들어 있다.
- 사원구분이 없으면 직원 등록의 "사원구분" 선택이 비어 필수 검사("사원구분은 필수선택 항목입니다")에서 막힌다.

## 결과를 볼 수 있는 화면

- #1079(회사를 칼파테크로 바꿔 조회), 고객사 관리자 `kalpa/admin`의 공통코드 화면, #1029 등록 창의 사원구분 선택.

## 업무 규칙 · 주의

- KFS 관리자만 복사한다(출발지 회사는 기본 ADMIN = 회사 0).
- 같은 코드구분을 같은 회사에 두 번 복사했을 때의 동작은 확인하지 않았다(복사 전에 도착 회사의 코드를 조회해 본다).
- 이 문서는 사원구분만 다룬다. 회사 고유 코드를 추가·수정하는 쪽은 고객사 관리자가 상세를 쓸 때 보강한다.

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: SYS-BZ-0007
needs: [SYS-BZ-0001]
actor: { company: admin, user: admin, password: "1111" }
steps:
  - no: 3
    screen: 1079
    action: '사원구분 선택 → [코드복사] → 칼파테크 → [예]'
    api: POST /api/v1/sys/code-kinds/29/codes/copy
    body: { companyId: 0, companyIds: ["<칼파테크 회사ID>"] }
expect:
  - { table: sys09_code, where: "sys09_company_id = :cid and sys09_code_kind_id = 29", rows: 5 }
```
</details>

<details>
<summary>확인 SQL</summary>

```sql
select sys09_code, sys09_name from sys09_code
 where sys09_company_id = :cid and sys09_code_kind_id = 29 order by 1;
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS 화면: `Sys08_Tab_CodeKindClient`(#1079·#1248, [코드복사] E2 `copyChk` L225-263 → `codeCopy` L265-280)
- AS-IS 서버: `sys.Sys09_Code.codeInsert`, 회사 초기화 `sys09_code.insertFromSys09`(`sys08_sys_yn='false'`만)
- TOBE: `POST /api/v1/sys/code-kinds/{codeKindId}/codes/copy`(`SysCodeKindController.copyCodes`) → 복사한 행 수
- TOBE 상태(2026-11-09): **실행** — kalpa에서 API로 5건 복사. 자동 시험·화면 눈 확인은 아직(`대기`).
</details>
