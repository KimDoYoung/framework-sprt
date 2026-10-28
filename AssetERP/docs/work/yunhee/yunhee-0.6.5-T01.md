# yunhee 0.6.5 사용 기록 (T01·T02, 2026-10-28)

0.5.9 → 0.6.5(changelog 0.5.10~0.6.5). 새 것은 `trace-*` 업무파악 명령 18개(0.5.10 껍질 → 0.6.0~0.6.5 구현)이고, 기존 `analysis`·`api`·`compare`·`run` 등은 그대로 동작했다. T01·T02(인사평가 대상자·수행, 클래스 6개)에서 쓴 것과 한계를 적는다. 쓰는 방법은 05 §7 "`trace-*` 업무파악 명령".

## 쓸 만했던 것
| 명령 | 어디에 | 결과 |
|:---|:---|:---|
| `yunhee mapper-run "<매퍼.xml>#<id>" --compare <ns.id> -p k=v --count` | 확인 — 평가자 계정으로 로그인할 수 없어 `compare`(API)를 못 쓴 조회 SQL | TOBE 매퍼 문장을 DB에서 실행해 AS-IS SQL과 행 수·열 대조(`TOBE rows=4, AS-IS rows=4 ✅ 열 포함`). 로그인 사원 ID를 파라미터로 직접 줄 수 있어 API보다 낫다 |
| `yunhee mapper-run … --rollback -p …` | 확인 — 쓰기 문장 | `INSERT 1 (롤백됨)`. 실데이터를 안 바꾸고 INSERT·UPDATE가 도는지 본다(03 원칙 2) |
| `yunhee analysis sql <ns.id> --section where --no-cte -o sql --param …` | 분석 — 300줄짜리 공통 CTE(`common.emp00_trans_info`)가 든 SQL | CTE를 생략하고 WHERE 이후만 낸다. `-o sql` 전체는 CTE 때문에 출력이 1,000줄이 된다 |
| `yunhee analysis sql <ns.id> -o sql --param …` 를 스크래치 파일로 | 분석 — 큰 SQL을 매퍼로 옮길 때 | 파라미터에 실제 값을 주면 분기 가지가 펼쳐진다. 값을 `#{…}`로 되돌리는 치환은 파이썬 한 번(CDATA로 통째로 넣기) |
| `yunhee analysis method <Cls>.<m1> <Cls>.<m2> … -o code`(`--server`) | 분석 | 여러 메서드를 한 번에. **오버로드가 있으면 `Exit 2` + 후보**(`insertRow#1`·`#2`로 다시) |
| `yunhee cat <파일>:<시작>-<끝>` | 분석 | 훅에 막히는 `sed -n`을 대신해 원본 몇 줄(툴바 `add(` 순서, `getSumGrid` 정의 등)만 본다 |
| `yunhee trace-pair '#<메뉴번호>'` | 끝낼 때 | 화면·서비스(RPC)·SQL 짝과 ASIS에만 있는 것을 낸다. **TOBE 컨트롤러·매퍼 주석에 `emp.Emp43_EvalTarget.selectByTermCode`·`emp43_eval_target.selectById`처럼 AS-IS 키를 쓰면** 근거로 잡힌다 |
| `yunhee analysis ui <화면> --tobe frontend/src/pages/emp` | 확인 항목 10 | 평소처럼. 새 이벤트 주석 `[E5]`을 빠뜨리면 `5/4 · 없음: E5`로 곧바로 잡힌다 |
| `yunhee page-style --compare` | 확인 항목 13 | SGP(T01)·SG(T02) 일치 |

## 한계·주의 (제안 후보)
1. `trace-pair`가 **같은 AS-IS 서비스 키를 쓴 모든 컨트롤러**를 짝으로 낸다 — `sys.Sys01_Company.selectById`가 회사 관리 컨트롤러 7개와 짝지어져 출력이 길다(근거는 "컨트롤러 주석의 AS-IS 서비스 키"). `--max`는 facts를 자를 뿐 같은 키 묶음을 줄이지 못한다. 키를 한 컨트롤러 메서드에만 쓰고 나머지는 "AS-IS" 주석으로 적는 편이 낫다.
2. 한 줄 주석에 서비스 키를 `update / updateList`처럼 슬래시로 이으면 앞의 것만 짝이 되고 뒤는 `ASIS에만 있음`으로 나온다 → 각각 전체 키로 적는다(`emp.Emp43_EvalTarget.update · emp.Emp43_EvalTarget.updateList`).
3. `trace-crud --screen`의 TOBE 쪽은 서비스 메서드 본문이 **직접** 부른 mapper 문장만 본다. private 헬퍼(`deleteChangedWrites`)를 거치면 `emp44_eval_write: ASIS RD / TOBE R ⚠ TOBE에 D 없음`으로 오탐한다.
4. `trace-crud`가 AS-IS `sys.Sys01_Company.selectById`의 부수 효과(`updateMainImageId` U)와 공통 코드 조회가 건드리는 sys04·05·06·07 테이블까지 낸다 → 화면 변환 범위 밖(조회 API로는 옮기지 않은 것)이라 ⚠는 읽고 판단한다.
5. `trace-flow`는 **메서드 오버로드 중 하나만** 따라간다: E5가 `insertRow()`(L368, `getEvalListStdId`)를 거쳐 `insertRow(Long)`(L426, `getHighInfo`)를 부르는데 사슬에는 뒤쪽만 나왔다. 이벤트 → 호출 메서드 → 서비스를 `analysis method`로 다시 확인한다.
6. `⚠ 색인이 오래됨 — yunhee index-src … 다시 실행`이 모든 `trace-*` 첫 줄에 나온다(원본이 매일 바뀌므로). 원본 변경 점검은 변환을 끝낸 뒤 일괄(CLAUDE.md)이라 이번에는 무시했다.
7. `trace-crud` 출력에 `⚠ bind 식 건너뜀: stdDateType='regDate'`가 8줄 반복된다(다른 SQL의 `<bind>`). 내용은 같은 경고 반복이라 `2>&1 | grep -v 'bind 식'`로 거른다.
8. `trace-*`의 TOBE 쪽 사슬(`trace-flow`)은 아직 없다(`trace-pair`·`trace-crud`로 대조하라고 안내). `trace-doc`·`trace-rule`·`trace-code` 등은 이번 화면에서 쓰지 않았다.

## 안 쓴 것
`trace-map/menu/term/column/code/state/branch/dblogic/diff/gap/rule/doc/guide`(구현은 모두 됨). 필요가 생기면 05 §7 "`trace-*`" 표의 용도로 먼저 `--help`.
