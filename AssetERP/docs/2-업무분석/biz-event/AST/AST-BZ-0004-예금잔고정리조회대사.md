# AST-BZ-0004 자금관리가 예금잔고를 정리·조회하고 은행 잔액과 대사한다

> **한 줄 요약** — 예금잔고(`ast09_book`)는 저장된 장부가 아니라 **전표에서 다시 만드는 표**다. [예금잔고정리](`f_create_depositBook`)가 기준일부터 **오늘까지** 계좌(소분류가 예금 그룹 `ItemSClassCode003`인 종목)별 일별 잔고를 전표(`act03`의 자산 ID)로 다시 계산한다. #1471(#1238) 예금잔고조회는 기간·계좌별 일별 잔고, #1473(#1159) 예금잔고대사는 그날 장부잔고와 **[잔고입력(대사용)]으로 넣은 은행 실제 잔액**(`ast12_book_real`)의 차이를 보여 준다. 차이가 없으면 [상신](링크 A39)으로 대사 결과를 결재받는다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 자금관리(kalpa 과장 301) |
| 언제 | 매일·월말 |
| 먼저 있어야 하는 것 | 오늘 이전 날짜의 예금 거래 — AST-BZ-0006(이체·이자) 또는 AST-BZ-0003(결제). 미래 날짜 거래는 그날이 되어야 보인다 |
| 다음 이벤트 | ACT 결산·마감 |
| 실제 실행 | kalpa, 2026-11-12, API: AST-BZ-0006 뒤 [예금잔고정리](2026-11-12) → #1471 11-01~11-30: 계좌 2개 × 19일(11-12~11-30) = 38줄, 우리은행 5,000,000·신한은행#011 −5,000,000(기초잔고 없음) → [잔고입력] 우리 5,000,000·신한 0 → #1473 차이 우리 0·신한 −5,000,000. AS-IS SQL 2 = 2. 이자(10,160) 뒤 다시 정리 → 우리 장부 5,010,160·차이 10,160. **[잔고입력] 새 줄 저장은 TOBE에서 실패**(아래 ⚠, 의심 #108) — ID를 직접 줘서 저장했다. [상신](A39)은 `대기` |
| 메뉴 | #1471 고유자산 > 40. 예금관리 > 예금잔고조회(#1238 자금관리 같은 화면), #1473 예금잔고대사(#1159 관리회계 > 20. 결산 같은 화면). kalpa 메뉴 없음. 화면 눈 확인 `대기` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 자금관리 | #1471 | 기간·계좌(조회창) → [조회] / [예금잔고정리] | 일자별 계좌 잔고. 정리는 회계마감·환평가 뒤 날짜면 거절 |
| 2 | 〃 | #1473 | 보유일자 → [조회] | 계좌별 장부잔고·실제잔고·차이 |
| 3 | 〃 | 〃 | [잔고입력(대사용)] → 계좌마다 실제 잔액(또는 [최근잔고 가져오기]) → [저장] | 차이 다시 계산 |
| 4 | 〃 | 〃 | [상신] → 문서분류(A39) → 결재 / [문서보기] | 그날 대사 결재(`ast80_relate_appr`) |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `ast09_book` | 계좌별 일별 잔고(기준일~오늘 지우고 다시 넣음) | 정리마다 다시 |
| `ast12_book_real` | 은행 실제 잔액(대사용) | +2(ID `202611129999001`·`…002`는 손으로 준 값) |
| `ast80_relate_appr` | 대사 결재 연결(일자·A39) | (대기) |

## 업무 규칙 · 주의

- 정리는 기준일 ~ `f_today()`. 결제일 2026-11-25인 미지급 결제(AST-BZ-0003)는 아직 잔고에 없다.
- 기초잔고(이월)를 넣지 않으면 출금 계좌 잔고가 마이너스가 된다(신한 −5,000,000). 기초잔고는 고유자산 거래(AST-BZ-0007)로 넣는 것으로 보인다(확인 안 함).
- 계좌에 거래처(은행)를 넣지 않으면 대사 화면의 "보관기관(계좌)" 칸이 빈다(우리은행 계좌).
- ⚠ **[잔고입력] 새 줄을 저장할 수 없다(TOBE만)**: 조회 SQL이 아직 없는 줄의 ID를 `COALESCE(id, f_create_seq())`로 만드는데, 서비스가 읽기 전용 트랜잭션이라 `nextval`이 실패하고 `f_create_seq`는 예외를 삼켜 **NULL**을 준다 → 저장이 "저장할 계좌 정보가 없습니다."로 거절 → [의심 #108](../../보안_및_버그_의심.md). 같은 모양이 감가상각·평가·환평가 조회에도 있다.
- ⚠ 대사 결재 연결 `PUT /ast/relate-apprs/{id}/appr-id`가 로그인·회사를 보지 않는다 — kalpa 사원이 회사 28000의 연결을 고쳤다(같은 값) → [의심 #107](../../보안_및_버그_의심.md)(상).
- 사원 401도 예금잔고대사(전 계좌 잔고)를 본다 — 담당 부서가 모든 부서라서(AST-BZ-0002 [가져오기]).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: AST-BZ-0004
needs: [AST-BZ-0006]
steps:
  - no: 1
    actor: { company: kalpa, user: "301", password: "1111" }
    api: [POST /api/v1/ast/books/deposits/clean, GET /api/v1/ast/books/deposits/period?startDate=2026-11-01&closeDate=2026-11-30]
    body: { stdDate: "2026-11-12" }
    expect: { rows: 38 }
  - no: 2
    api: PUT /api/v1/ast/book-reals?holdDate=2026-11-12
    body: [{ bookRealId: <조회 ID — 지금은 null이라 실패, 의심 #108>, astClassTreeId: <우리은행>, curCode: KRW, realAmt: 5000000 },
           { bookRealId: <…>, astClassTreeId: <신한은행#011>, curCode: KRW, realAmt: 0 }]
  - no: 3
    api: GET /api/v1/ast/books/deposits/diffs?holdDate=2026-11-12
    expect: { rows: 2, diff: { 우리은행: 0, 신한은행#011: -5000000 } }   # 이자 전
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Ast09_Tab_DepositBookPeriod`(#1471·#1238, retrieve L198-226 → `Ast09_Book.selectByHoldDatePeriod` L64, depositUpdate L228-269), `Ast09_Tab_DepositBook`(#1473·#1159, retrieve → `ast09_book.selectByHoldDate`(astType 1·depositDiffYn true), [상신] A39 `Ast80_RelateAppr.insert` L58·`updateApprId` L95), `Ast12_Lookup_RealDeposit`(`ast12_book_real.selectByHoldDate` — `COALESCE(id, f_create_seq())`), DB 함수 `f_create_depositBook`·`f_create_depositBook_run`(L32 `v_CLOSE_DATE := f_today()`), `f_create_seq`(`EXCEPTION WHEN OTHERS THEN RETURN NULL`).
- TOBE: `AstBookController`(`/api/v1/ast/books/deposits` · `/period` · `/diffs` · `/clean`), `AstBookRealController`·`AstBookRealService`(클래스 `@Transactional(readOnly = true)`, save L35-), `AstBookRealMapper.xml` L21, `AstRelateApprController` L47-50(`UserPrincipal` 없음)·`AstRelateApprMapper.updateApprId`(회사 조건 없음).
</details>
