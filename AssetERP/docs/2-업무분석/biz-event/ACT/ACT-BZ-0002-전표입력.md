# ACT-BZ-0002 전표를 직접 입력·수정·삭제한다

> **한 줄 요약** — 회계 담당이 카드·급여처럼 자동으로 만들어지지 않는 거래를 **전표**(날짜·거래처·적요 + 차변/대변 줄)로 직접 넣는다. 차변 합계와 대변 합계가 같아야 저장되고, 승인(0003) 전에는 고치거나 지울 수 있다. 저장하면 전표번호가 붙고 임시분개(`act06`)와 분개장(`act03`)이 같이 쓰인다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 회계 담당 |
| 언제 | 자동 전표가 없는 거래가 생길 때 |
| 먼저 있어야 하는 것 | ACT-BZ-0001 계정과목, 마감되지 않은 날짜 |
| 다음 이벤트 | ACT-BZ-0003 전표 승인 |
| 실제 실행 | kalpa, 2026-11-13, API(관리자). 전표 0건에서 시작 → 차변 접대비 50,000 / 대변 현금 50,000 전표 생성(전표번호 261113014) → 열기 → 금액 70,000으로 수정(분개장도 70,000) → 차/대 금액 다름·계정코드 없음 거절 → 사원 402가 생성·삭제(⚠#196) → 전표 2건 삭제(`act02`·`act03`·`act06` 모두 0). 외화 전표(#1176)·엑셀 올리기·연관문서는 안 함. 화면 눈 확인 `대기(일괄)` |
| 메뉴 | #1148 관리회계 > 10. 전표입력 > 전표입력, #1176 전표입력(외화). kalpa 메뉴 없음 |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 | 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 회계 담당 | #1148 | 기간·검색으로 [조회] (`GET /act/journals`) | 전표 목록(승인·마감 여부) |
| 2 | 〃 | #1148 | [등록] → 전표창에 일자·거래처·적요, 줄(차/대·계정·금액·적요) 입력 → 저장 (`POST /act/journals`) | `act02_journal` +1, `act06_journal_tmp` +줄 수, `act03_journal_dtl` +차·대 짝 수 |
| 3 | 〃 | #1148 | 행의 [변경] 셀 → 전표창 (`GET /act/journals/{id}/edit`) → 고쳐서 저장 (`PUT /act/journals/{id}`) | 임시분개·분개장을 지우고 다시 씀 |
| 4 | 〃 | #1148 | 행 체크 → [삭제] (`POST /act/journals/delete`) | 전표·분개·연관문서 삭제 |
| 5 | 〃 | #1148 | [템플릿] → 엑셀 작성 → [엑셀업로드] (`/act/journals/excel`, `/excel/work`) | (안 함) |

## DB에 남는 것

| 테이블 | 무엇 | kalpa 실행 |
|:---|:---|:---|
| `act02_journal` | 전표 머리(번호·일자·거래처·적요·통화 KRW) | +1 → 삭제 −1 |
| `act06_journal_tmp` | 입력한 줄(순번 10·20…, 실계정·대표계정 4자리·차대·금액) | +2 → 삭제 −2 |
| `act03_journal_dtl` | 분개장(차변 n번째·대변 n번째를 한 줄로 짝지음) | +1(수정 후에도 1행, 70,000/70,000) → 삭제 −1 |

## 업무 규칙 · 주의

- 줄마다 차/대 구분·실계정코드·금액 필수. 차변 합계 = 대변 합계(원화, 외화 전표는 외화도). 아니면 "차/대 원화 금액이 다릅니다."(400).
- 대표계정코드(`reprAccountCode`)는 **4자리**(실계정 앞 4자리). 10자리를 보내면 DB 오류로 500이 나고 전표 머리까지 롤백된다(남는 행 없음). 화면은 맞춰 보내서 못 만나는 API 계약 문제다.
- 마감한 날짜(`act05_gen_ledger_close`)에는 만들기·수정이 막힌다(`checkClose`). 승인완료 전표는 수정 불가("승인완료 전표입니다.").
- 목록의 등록자 칸이 `EMP_NAME을 찾을 수 없습니다.`로 보인다 — 사원이 아닌 관리자(`admin`)가 입력한 전표라서다(DB 함수 `f_emp_kor_nm`). 직원이 입력하면 이름이 나온다.
- **메뉴 권한 없는 사원이 전표를 만들고 지운다** → [의심 #196](../../보안_및_버그_의심.md).
- `yunhee biz-endpoints act --screen 1148`: 전표 목록·삭제·엑셀 템플릿 중 `excel-template`만 검사 없음(양식 파일이라 무해), 나머지는 '회사'.

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: ACT-BZ-0002
needs: [ACT-BZ-0001]
steps:
  - no: 1
    actor: { company: kalpa, user: admin, password: "1111" }
    api: POST /api/v1/act/journals
    body: { date: "2026-11-13", note: "BZ시험 접대비", lines: [ { drcrType: D, realAccountCode: "0407080000", reprAccountCode: "0407", amt: 50000 }, { drcrType: C, realAccountCode: "3101010000", reprAccountCode: "3101", amt: 50000 } ] }
    expect: { track: { act02_journal: +1, act06_journal_tmp: +2, act03_journal_dtl: +1 } }
  - no: 2
    api: POST /api/v1/act/journals/delete
    body: { journalIds: ["{journalId}"] }
    expect: { track: { act02_journal: -1, act06_journal_tmp: -2, act03_journal_dtl: -1 } }
```
</details>

<details>
<summary>근거</summary>

- AS-IS: `Act02_Tab_CreateJournal`(#1148), `Act02_Lookup_CreateJournal`, 서버 `Act02_Journal`(selectByDate·updateAll·delete).
- TOBE: `ActJournalListController`(조회·삭제·등록)·`ActJournalEditController`(열기·저장)·`ActJournalEditService.checkLines/writeLines`.
</details>
