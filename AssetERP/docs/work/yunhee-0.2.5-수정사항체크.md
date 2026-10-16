# yunhee-0.2.5 수정사항체크

yunhee 0.2.5(수정사항 021)가 반영됐는지 새 세션에서 확인하는 방법이다.
- 요청 문서: `~/work/yunhee-cli/docs/수정사항021.md` — 항목별 현상·원인·수정·기대 출력. 검증 ID가 스크립트 항목 이름과 같다
- 검증 스크립트: `tools/yunhee-0.2.5-check.sh`
- 배경: C01-2(기타정보 탭) 세션에서 yunhee로 못 해 원본·매퍼·서버 클래스를 직접 연 곳(C01-2 작업기록 "비용"), 그리고 서버 로그를 grep 없이 요청 단위로 보는 기능(`yunhee log`)

## 1. 준비 (세션 시작)
1. `yunhee --version` → `0.2.5`이면 `yunhee changelog --since 0.2.4`로 들어온 항목을 본다.
2. Tomcat 배포본이 떠 있는지 본다: `yunhee api GET /api/v1/emp/persons/202211220747066/others -c kfstest` → HTTP 200. (B 절이 이 API와 컨테이너 `t3600-tomcat`의 로그를 쓴다)
3. 원본은 `~/oms-data/src/Asset-ERP`(다르면 `SRC=… tools/yunhee-0.2.5-check.sh`), 색인은 `docs/as-is/src`.

## 2. 실행 (AssetERP_1 폴더에서)
```bash
tools/yunhee-0.2.5-check.sh              # 전체, 약 1분 (A-7에서 0.2.4는 Qwen을 불러 더 걸린다)
tools/yunhee-0.2.5-check.sh A-6 B        # 고른 절만 (A는 A-1…A-7 또는 A 전체, B, C)
tools/yunhee-0.2.5-check.sh --reindex    # A-5 색인 확인 포함 (index-src 다시 실행)
tools/yunhee-018-check.sh --reindex      # 회귀: ✅ 47 / ❌ 0 이어야 한다 (021 §C-3)
```
- 항목마다 한 줄. ❌면 끝의 파일(`.yunhee/0.2.5-check/NN-….txt`, git-ignored)만 열어 본다. 실행할 때마다 그 폴더를 지우고 다시 만든다.
- 데이터를 바꾸지 않는다: A는 정적 분석, A-7·B-5·B-6은 스크립트가 만든 임시 픽스처(가짜 주민번호 `900101-1234567`), B-1~B-4는 GET만(03 원칙 2).

## 3. 항목
| 검증 ID | 무엇을 | 021 |
|:---|:---|:---|
| A-1 ui 범위·중복·생략 (픽스처) / 실제 폴더 | `[E5]~[E9]` 범위, 같은 E-id 두 번, `[E1]~[E3 생략]` → `10/7 (생략 3)` | A-1 |
| A-2 sql DML 테이블 / select CTE·중복 | upsert의 테이블 `emp02_others`·CTE `upsert`·변경 대상, select의 CTE(`emp00`·`org00`)를 테이블에서 빼기 | A-2 |
| A-3 method 콜백 / 분기 / 회귀 | `editDriver.flush`·`callback: result.getResult(0)`·`getStore().update`, `if (… length() == 13)`·`else`·`genderCode = "M"`·`setValue("남")` | A-3 |
| A-4 server 결과 없음 / 결과 있음 회귀 | `Emp02_Others.updateOne`에 `⚠ 결과 없음`, `Emp00_TransInfo.selectByText`에는 없음 | A-4 |
| A-5 events 반복 호출 / 색인 반복 호출 | `update(), autodecCtzNo(), update()` (색인은 `--reindex` 때만) | A-5 |
| A-6 layout Others / Person / 그리드 화면 | `--section layout`: 라벨 폭, hlc, 줄별 `라벨{필드} 폭`, 읽기 전용·비활성 | A-6 |
| A-7 run 실패 메시지 | JUnit XML의 `message`·`at` 줄, Qwen 안 부름 | A-7 |
| B-1 api trace 표시 | `yunhee api` 첫 줄에 `trace=<16진 16자>` | B-3(5) |
| B-2 api --log | 응답 아래 요청·SQL 요약, 평문 주민번호 없음 | B-3(5), B-4 |
| B-3 log trace / B-4 log req | 컨테이너 로그에서 trace 요약, 경로로 최근 요청 찾기 | B-3(1)(2) |
| B-5 log 파일 픽스처 마스킹 / --no-mask | `--file`, 마스킹, `Updates 0`은 경고 아님, UTC → KST | B-3(1), B-4 |
| B-6 log errors 묶기 | 숫자만 다른 WARN 3줄 → `×3`, 스택의 `Caused by` | B-3(3) |
| B-9 시간 범위 --from/--to · 시작 옵션 둘 / B-10 --since-deploy · --since-run | KST 입력 → UTC 비교, 시작 옵션은 하나만, 마지막 배포·마지막 run 이후 | B-3(0) |
| B-7 없는 trace / B-8 컨테이너 없음 | Exit 1 "로그에 없음" / Exit 2, 호스트 파일로 대체하지 않음 | B-3(1), B-2 |
| C-1 버전 / C-2 changelog·agent-guide | 0.2.5, 새 명령 안내 | C |

## 4. 0.2.4 기준선 (2026-10-08, 021 반영 전)
`tools/yunhee-0.2.5-check.sh` → **✅ 2 / ❌ 28 (전체 30)**. 통과 2개는 회귀 항목(A-3 method 회귀, A-4 결과 있음 회귀)이다. 나머지는 021 전 상태를 그대로 보여 준다:
- A-1: 픽스처 `10/6`(범위 2개로 셈·중복 두 번 셈), 실제 폴더 `10/7`(생략 표시 없음)
- A-2: upsert `테이블: upsert`·`출력 별칭: f_create_seq, to_encrypts`, selectByText `테이블: …, org00, emp00, …, org00`
- A-3: update 요약이 `서비스 …updateOne (L165)` 한 줄, autodecCtzNo는 `if (decCtzNo == null)`과 메시지 2개만
- A-4: 경고 없음 / A-5: `→ update(), autodecCtzNo()` / A-6: `--section layout` 없음
- A-7: Qwen 요약, message 줄 없음 / B: `log` 명령 없음(exit 2), api에 trace 없음 / C: 0.2.4

## 5. 결과 기록
- 결과는 yunhee-cli `docs/수정사항022.md`(021 시험 결과)에 적는다(020이 019 결과를 적은 방식).
- 통과하면 `docs/05-작업방법.md` §7의 기준 버전을 0.2.5로 올리고, 명령표에 `--section layout`·`yunhee log`·`api --log`를 넣는다(그 세션 작업기록에 남김).
