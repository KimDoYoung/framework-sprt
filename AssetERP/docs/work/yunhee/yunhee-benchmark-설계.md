# yunhee-benchmark.sh 설계 (1단계 MVP + 2단계 핵심 구현됨, 2026-10-17)

## 구현 현황 (2026-10-17, yunhee 0.3.8)

사용자 위임("가장 현명한 방법으로 판단")에 따라 아래로 정했고 구현했다. 아래 8절의 질문은 이 결정으로 닫는다.
- **기준선**: 보수적 — "그 정보를 얻으려면 열어야 하는 파일 전체"(화면 클래스 + 색인 source 절 의존 파일, 매퍼 XML 전체, 도메인 DBML 파일 전체, drift는 구간 diff 전체). 절감률이 높게(98%대) 나오므로 **절대값보다 버전 간 추세**로 읽는다.
- **누적**: `docs/work/yunhee/yunhee-benchmark/results.tsv`를 git에 올려 두 PC가 공유(`union` 병합), 실행마다 `runs/<일시>-<버전>.md` 리포트.
- **3단계(훅 차단 횟수·세션 토큰)**: 이번 범위에서 제외. 필요해지면 추가.
- **시나리오 11개**(`--list`): 01a·01b 화면 구성(작은/큰), 01c 화면 구성 JSON(0.4.0~), 03 그리드, 06 SQL, 06j SQL JSON(0.4.0~), 07 테이블, 08 outline, 12 drift, 13 `sql -o` 형식(0.3.9~), 14 가드 훅. 나머지(02 method, 04 model, 05 ui, 09 run, 10 compare, 11 log)는 추가 예정.
- **0.4.0 확인(2026-10-17)**: 033·034가 대부분 기대대로 동작한다. 벤치마크가 `analysis sql -o json` 실패(`PosixPath is not JSON serializable`)를 잡았다(06j 0%) → 수정사항035.
- **교훈**: 0.4.0이 표에 `줄(UI절)` 열을 넣어 열 위치가 밀렸고, 열 번호로 읽던 버튼 검사가 **조용히 무의미해졌다**(100% 유지). 표는 **머리글 이름으로** 읽는다(`_list_rows`). 점수가 그대로여도 yunhee 출력 형식이 바뀌었으면 검사가 아직 의미 있는지 본다.
- 실행: 전체 약 20초(고정 소스 색인이 없으면 처음 1분 추가), `--fast`는 drift 제외. 고정 소스 `PIN`(`tools/yunhee-benchmark/PIN`)은 `~/.cache/yunhee-bench/<PIN>/`에 `git archive`로 풀어 색인한다(**저장소 밖** — 안에 두면 yunhee가 바깥 저장소의 git 정보를 읽는다. 수정사항034).
- **정확성 점수의 의미**: 정답표(`expect`/`forbid`)와 독립 계산(`indep`: 소스·DB·git에서 yunhee와 다른 경로로 센 값)을 섞는다. 지금은 8개 모두 100%이므로 변별력이 낮다 — 가치는 **yunhee가 나빠졌을 때(회귀) 숫자가 떨어지는 것**과 시나리오가 늘 때 드러나는 약점이다. 시험 중 독립 계산이 두 번 실패했고(버튼 수 등호 비교, drift 표 파싱) 둘 다 시나리오 쪽 오류여서 고쳤다.
- 시험 중 발견한 yunhee 쪽 사항은 `yunhee-cli/docs/수정사항034.md`에 적었다.

---

# (원 설계 초안)

- 작성: 2026-10-16 (초안). 사무실에서 논의한 내용을 사용자 설명(2026-10-16)대로 옮겼다. 저장소에는 이전 기록이 없었다.
- 위치: `AssetERP/tools/yunhee-benchmark.sh` (+ `tools/yunhee-benchmark/` 아래 시나리오·정답표). 결과는 누적한다.
- 목적: GWT/GXT → Spring Boot/React 변환의 **작업 효율**을 높이는 것. yunhee가 ① 토큰을 얼마나 아끼는지 ② 작업을 얼마나 정밀·정확하게 돕는지를 숫자로 재서, 어디를 고칠지(`수정사항NNN`) 정하는 근거로 쓴다.
- 기존 `tools/yunhee-018-check.sh`·`yunhee-0.2.5-check.sh`와의 구분: check는 "수정사항이 반영됐나(✅/❌)"의 **회귀 시험**이고, benchmark는 "쓸 만한가, 얼마나 아끼나"의 **가치 측정**이다. 실행 틀(`chk` 함수, 로그 폴더, 절 선택)은 그대로 이어 쓴다.

## 1. 무엇을 재나

### 1-1. 토큰 절감 (추정)
같은 일을 **yunhee 없이 하면 읽었을 것**과 **yunhee로 하면 받는 것**의 크기를 비교한다. LLM을 부르지 않으므로 결정적이고 반복 가능하다.

| 값 | 정의 |
|:---|:---|
| `base_tokens` | 수작업 기준선. 시나리오마다 "yunhee 없이 이 정보를 얻으려면 열어야 하는 파일/구간"을 **규칙으로 정의**해 크기를 센다. 예: 화면 분석 = 색인 화면 파일 전체 + 색인이 가리키는 원본 Java·매퍼 XML 전체 |
| `yh_tokens` | yunhee 명령 출력(stdout+stderr)의 크기 |
| `saved` / `ratio` | `base - yh`, `yh / base` (낮을수록 좋음) |
| `secs` | 명령 실행 시간(wall-clock). Qwen을 부르는 명령은 따로 표시(`llm=1`) |

- 토큰 추정: 글자 수 기반 근사로 일관되게 센다. `tokens ≈ ascii글자/4 + 비ASCII(한글 등)글자/1.5`. 절대값이 아니라 **비율과 추세**가 목적이다(같은 추정식으로 버전 간 비교).
- 기준선 모델은 시나리오 파일(`cases/NN-*.sh`)의 `BASE_FILES` 규칙으로 고정한다. 기준선 규칙을 바꾸면 시나리오 `rev`를 올리고 누적 그래프에서 구분한다(5절).
- 하지 않는 것: 실제 LLM 세션의 토큰 계량(별도 3단계, 6절)과 Qwen이 쓰는 로컬 토큰 계산.

### 1-2. 정확성
yunhee 출력이 **사실과 맞는지** 정답표로 채점한다.

| 방식 | 내용 | 안정성 |
|:---|:---|:---|
| 정답표(golden) | 시나리오마다 `expect` 목록: 꼭 있어야 하는 사실(클래스·이벤트 수·그리드 컬럼 순서·SQL ID·테이블·분기 조건·메시지 문자열). 손으로 원본을 보고 만든다 | **소스 커밋을 고정**해야 한다(2-2) |
| 독립 계산 | 같은 사실을 yunhee와 **다른 경로**로 센다: `tools/ui-count.sh`, DB 행 수(`yunhee sql`) vs API 행 수(`yunhee compare`), 원본에서 단순 정규식으로 센 이벤트 수 vs `analysis ui` | 소스가 바뀌어도 유효 |
| 금지 항목 | `!` 정규식: 있으면 안 되는 오류(옛 버그 재발 방지: `테이블: upsert` 같은 오표시) | |

- 채점: 시나리오 점수 = 통과 expect / 전체 expect. 범주별(분석·SQL·그리드·로그·drift …) 평균과 전체 평균을 낸다. **정밀도**(틀린 사실을 내지 않았나, `!` 항목)와 **재현율**(있어야 할 사실을 다 냈나, `expect` 항목)을 따로 센다.
- 실제 작업 연결: 정확성은 "원본 줄을 다시 열어야 했는가"로 환산해 해석한다 — 점수가 낮은 범주는 `수정사항`의 우선순위가 된다.

## 2. 구조

```
AssetERP/tools/
  yunhee-benchmark.sh              # 실행기 (check 스크립트의 chk 틀 재사용)
  yunhee-benchmark/
    cases/NN-<범주>-<이름>.sh      # 시나리오 1개 = 파일 1개 (명령·기준선·정답표)
    golden/<case>.expect           # (선택) 길어지는 정답표
    lib.sh                         # 토큰 추정, 시간 측정, 채점, 결과 쓰기
docs/work/yunhee/yunhee-benchmark/
  results.tsv                      # 누적 결과 (git 추적, 한 줄 = 시나리오 한 번 실행)
  runs/<yyyymmdd-hhmm>-<버전>.md   # 실행 1회 요약 리포트 (git 추적)
.yunhee/bench/                     # 원문 출력, 고정 소스 색인 (git-ignored)
```

### 2-1. 실행기 사용 (예정)
```bash
tools/yunhee-benchmark.sh                  # 전체 (예상 3~5분, Qwen 시나리오 포함)
tools/yunhee-benchmark.sh --fast           # Qwen·gradle 제외 (30초 안팎)
tools/yunhee-benchmark.sh analysis grid    # 범주/시나리오 선택
tools/yunhee-benchmark.sh --no-save        # 결과 파일에 쓰지 않음(시험 실행)
tools/yunhee-benchmark.sh --history        # 버전별 추세 표
tools/yunhee-benchmark.sh --compare 0.3.7 0.3.8   # 두 버전 비교 (시나리오별 ratio·점수 차이)
tools/yunhee-benchmark.sh --list           # 시나리오 목록과 rev
```
- 사용자 데이터를 바꾸지 않는다(조회·EXPLAIN·롤백만, check 스크립트와 같은 원칙).
- 끝에 한 줄 요약: `토큰 ratio 평균 0.12 (절감 88%) · 정확성 94% (분석 100 · SQL 92 · 로그 88 · drift 100) · 시나리오 14개 · yunhee 0.3.8 · 소스 546a87d`.

### 2-2. 소스 고정 (소스가 매일 바뀌는 문제)
- 정답표가 어긋나지 않도록 **고정 커밋**의 소스로 별도 색인을 만든다: `git -C ~/work/IDMS-IC archive <PIN> | tar -x -C .yunhee/bench/src` → `yunhee index-src … -t .yunhee/bench/index`. `PIN`은 `tools/yunhee-benchmark/PIN`(파일)에 적고 커밋한다. 작업 색인(`docs/as-is/src`)은 건드리지 않는다.
- 고정 색인은 `PIN`·yunhee 버전이 같으면 재사용하고, 바뀌면 다시 만든다(약 1분).
- `PIN`을 올리면(예: 새 시나리오 추가·원본에 필요한 화면이 생김) 정답표를 다시 확인해야 하므로 `suite_rev`를 올린다(5절).
- 소스에 의존하지 않는 시나리오(DB·API·로그·drift 임시 저장소 등)는 고정이 필요 없다.

## 3. 초기 시나리오 (작업 단계 → 05 §7 표 기준)

| ID | 범주 | 하려는 일 | yunhee | 기준선(수작업) | 정확성 채점 |
|:---|:---|:---|:---|:---|:---|
| 01 | 분석 | 화면 구성 파악(대형: `Emp00_Tab_TransInfo`) | `analysis screen --list` → `--class … --section events` | 색인 화면 파일 + 원본 Java 클래스들 | 클래스·이벤트·그리드 수가 `ui-count.sh`와 같음 |
| 02 | 분석 | 메서드 로직(분기·메시지·서비스 호출) | `analysis method <클래스>.<메서드>` | 그 메서드가 든 Java 파일 전체 | `if` 조건·메시지 문자열·서비스 호출이 정답표와 일치 |
| 03 | 분석 | 그리드 모양 | `analysis grid <클래스>` | GridBuilder + 화면 Java | 컬럼 순서·헤더·폭이 정답표와 일치, `compare`의 컬럼 수와 같음 |
| 04 | 분석 | 모델 → SQL 컬럼 매핑 | `analysis model <모델> --sql <ns.id>` | 모델 + 매퍼 XML + resultMap | 매핑 컬럼 전부, 누락 0 |
| 05 | 분석 | UI 대조표(06 항목 10) | `analysis ui <화면> --tobe …` | 손으로 세기(원본·TOBE 둘 다 읽음) | 합계가 독립 계산(`ui-count.sh`)과 같음 |
| 06 | SQL | 매퍼 SQL 펼치기·행 수 | `analysis sql <ns.id> [--count]` | 매퍼 XML + include 대상 | 펼친 SQL의 테이블·조건, `--count`가 `yunhee sql`의 같은 쿼리 행 수와 같음 |
| 07 | DB | 테이블 구조 | `table <이름>` | DBML 전체 파일 | 컬럼·주석 정답표 |
| 08 | TOBE | 기존 TOBE 코드 위치 | `outline <컨트롤러·서비스·tsx>` | 해당 파일 전체 | 메서드 시그니처·줄 번호가 실제 파일과 일치(`grep -n`으로 독립 확인) |
| 09 | 빌드 | 컴파일·타입체크 요약 | `run "./bm.sh compile"` (성공/실패 픽스처) | 원시 gradle/tsc 로그 | 실패 픽스처에서 오류 위치(파일:줄)가 요약에 있음 |
| 10 | 확인 | 조회 API = AS-IS SQL | `compare GET … --sql … --grid …` | API 응답 + psql 결과 + 그리드 정의 | `API rows == SQL rows`, `fields ⊇ cols` |
| 11 | 로그 | 배포 후 오류·요청 추적 | `log errors --since-deploy`, `log req … --trace` | `docker logs` 구간 | 일부러 낸 400/예외(픽스처)가 요약에 있고, 마스킹 규칙이 지켜짐 |
| 12 | drift | 원본 변경 감지 | `drift --all --base <커밋>` | `git log`/`git diff` 구간 | `git diff --name-only`로 센 변경 화면 수와 같음(독립 계산), 이동·삭제 상태 |
| 13 | sql | 파일로 받기(033) | `sql … -o tsv --out` | `psql` 출력 | 행 수·이스케이프 (수정사항033 반영 후 활성) |
| 14 | 훅 | 직접 읽기 차단 | `yunhee-guard.test.sh` (15건) | — | 통과율 (기존 시험을 점수로 편입) |

- 시나리오는 **실제로 일어난 작업**에서 가져온다(A21·A30·C01 등). 03·05는 큰 화면(`C01`)과 작은 화면(`A31`)을 한 쌍씩 둬서 규모에 따른 절감 폭을 본다.
- 최종적으로 20~30개까지 늘리되, 한 번에 5분을 넘기지 않는다(`--fast` 분리).

## 4. 결과 누적 (핵심 요구)

`docs/work/yunhee/yunhee-benchmark/results.tsv` — 한 줄 = 시나리오 1회 실행, **추가만 한다**(줄을 고치지 않는다).

| 열 | 뜻 |
|:---|:---|
| `ts` | 실행 시각(KST) |
| `host` | OMEN / T3600 (PC별 시간 차이 구분) |
| `yunhee` | 버전 (0.3.8 …) |
| `src` | 고정 소스 커밋(`PIN`) 또는 `none` |
| `suite_rev` | 전체 스위트 개정 번호 |
| `case` / `case_rev` | 시나리오 ID와 그 개정 번호 |
| `base_tok` / `yh_tok` / `ratio` | 토큰 추정 |
| `secs` / `llm` | 시간 / Qwen 사용 여부 |
| `exp_ok` / `exp_total` / `score` | 정확성 (통과 expect / 전체) |
| `note` | ❌ 항목 이름 요약 |

- `runs/<ts>-<버전>.md`는 사람이 읽는 1회 리포트(표 + 전 실행 대비 ▲▼). `--history`는 `results.tsv`를 `case_rev`가 같은 것끼리 묶어 버전별 추세를 낸다.
- 같은 `yunhee` 버전을 여러 번 돌려도 줄이 쌓이고, 비교는 최신 줄을 쓴다(`--compare`가 `ts` 최대 줄 선택).
- PC마다 파일이 갈라지면 git 병합 충돌이 날 수 있다 → 줄 단위 추가만 하므로 `git merge`가 대부분 자동 해결한다. 충돌이 나면 두 쪽을 모두 남긴다(`union` 병합: `.gitattributes`에 `results.tsv merge=union`).

## 5. 유지보수 규칙 (yunhee가 좋아짐에 따라)

1. **수정사항 반영 때마다**: `yunhee-0.x.y-check.sh`(회귀)를 만들 때 대응하는 benchmark 시나리오 후보도 같이 정한다. 새 기능은 시나리오를 **추가**(새 `case`), 출력 형식이 바뀐 기능은 정답표를 고치고 `case_rev`를 올린다.
2. **`case_rev`가 다르면 같은 열에서 비교하지 않는다.** 기준선 규칙·정답표·명령이 바뀌면 rev를 올려 추세선이 끊기게 한다(옛 숫자와 억지로 비교하지 않는다). 옛 rev는 지우지 않는다.
3. **시나리오는 닫을 수 있다**: 기능이 사라지면(예: `prepare` 삭제) 파일에 `RETIRED=<버전>`을 적고 실행에서 뺀다. 결과 줄은 남긴다.
4. **소스 `PIN` 갱신**은 분기에 한 번 또는 새 화면 시나리오가 필요할 때. 올릴 때 정답표를 다시 맞추고 `suite_rev`를 올린다.
5. **정답표는 사람이 확인한 것만** 넣는다. yunhee 출력을 그대로 복사해 정답으로 삼지 않는다(그러면 항상 100%). 정답표 변경은 작업기록에 이유를 한 줄 남긴다.
6. `docs/05-작업방법.md` §7 "세션 시작"에 한 줄: yunhee 버전이 바뀌면 `tools/yunhee-benchmark.sh --fast`로 추세를 본다.
7. 점수가 내려간 항목은 그대로 `yunhee-cli/docs/수정사항NNN.md` 후보다(재현 명령 = 시나리오의 명령).

## 6. 단계

| 단계 | 내용 | 규모 |
|:---|:---|:---|
| 1 (MVP) | `lib.sh`(토큰 추정·시간·채점·결과 쓰기), 시나리오 01·03·06·07·08·12, `results.tsv`·`runs/` 쓰기, `--fast`·`--list` | 하루 |
| 2 | 소스 고정(`PIN`, `git archive`), 시나리오 전부, `--history`·`--compare`, `.gitattributes` union 병합, 05 §7 한 줄 | 하루 |
| 3 | **실사용 지표**: 가드 훅이 막은 횟수를 `.yunhee/hook-denials.log`에 남기고(`yunhee-guard.sh`에 한 줄), 세션 끝에 "yunhee 대신 직접 읽기 시도 N회"를 집계 → 도입률/위반율을 benchmark에 포함. 실제 LLM 세션 토큰은 세션 로그(`~/.claude/projects/*/*.jsonl`)의 사용량으로 ID별 합계 | 선택 |

## 7. 한계와 가정

- 토큰은 **추정**이다. 절대값 신뢰보다 같은 식으로 잰 버전 간 상대 비교가 목적.
- 기준선은 "수작업 에이전트가 이만큼 읽었을 것"이라는 **모델**이다. 실제로는 일부만 읽을 수도 있어 절감률이 과대일 수 있다 → 기준선을 보수적으로(필요한 파일 전체, 불필요한 탐색은 제외) 정의하고, 규칙을 시나리오 파일에 적는다.
- 정확성은 시나리오에 넣은 사실만 잰다. 정답표 밖의 오류는 못 본다 → 작업 중 yunhee가 틀린 것이 발견되면 시나리오로 편입한다("발견 → 시나리오 → 수정사항" 순환).
- Qwen 의존 출력(`run` 실패 요약, `ask`)은 비결정적이다 → 3회 실행해 최소 점수를 쓰거나 `llm=1`로 표시하고 `--fast`에서 뺀다.
- 소스·DB·테넌트 데이터에 의존하는 시나리오(10·11)는 환경이 다르면 건너뜀(`SKIP`)으로 처리하고 점수에서 뺀다.

## 8. 결정이 필요한 것 (사용자)

1. 기준선 모델: "필요한 파일 전체를 읽는다"(보수적, 권장)로 갈지, "색인이 가리키는 줄 범위만 읽는다"(현재 05 규칙대로의 수작업)로 갈지. 후자는 yunhee 없이도 이미 토큰을 아끼는 상태라 절감률이 낮게 나온다.
2. `results.tsv`를 git에 올려 두 PC(OMEN·T3600)가 공유할지(권장) — 시간(`secs`) 열은 PC마다 다르므로 `host`로 구분.
3. 3단계(훅 차단 횟수·세션 토큰)를 이번 범위에 넣을지.
4. 시나리오 후보 14개 중 먼저 만들 우선순위(제안: 01·03·06·08·12가 가장 자주 쓰는 작업).
