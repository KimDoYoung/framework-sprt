# yunhee 수정사항 018 검증 절차

새 세션에서 yunhee 018(`yunhee analysis`, MyBatis 펼치기 통합, C-1~C-5)이 반영됐는지 확인하는 방법이다.
- 요청 문서: `~/work/yunhee-cli/docs/수정사항018.md` — 항목별 증상·원인·수정·검증
- 검증 스크립트: `tools/yunhee-018-check.sh` — 018의 검증 항목을 그대로 돌려 ✅/❌ 한 줄씩 낸다
- 배경: C01·A03 세션(2026-10-08) 토큰의 약 32%가 같은 모양의 `sed`·`grep`·`cat`이었다(C01·A03 작업기록, 08 교훈)

## 1. 준비 (세션 시작)
1. `yunhee --version` → 0.2.1보다 높으면 `yunhee changelog --since 0.2.1`에서 018 항목(analysis, 렌더러 통합, port-save `--company-via` …)이 무엇이 들어왔는지 본다.
2. Tomcat 배포본(`http://admin.localhost:8082/AssetERP_1`)이 떠 있는지 본다: `yunhee api GET /api/v1/sys/roles -c kfstest` → Rows 11.
   - 스크립트가 기대값(48/66/3/15, 8, 24)을 TOBE API로 다시 세서 데이터 변경을 걸러 낸다. API가 없으면 기대값을 그대로 쓴다.
3. 원본 위치는 `~/oms-data/src/Asset-ERP`(다르면 `SRC=… tools/yunhee-018-check.sh`), 색인은 `docs/as-is/src`.

## 2. 실행 (AssetERP_1 폴더에서)
```bash
tools/yunhee-018-check.sh                   # 전체. C-3(gradle test) 포함 약 1~2분
tools/yunhee-018-check.sh B A-2             # 들어온 절만 골라서
tools/yunhee-018-check.sh --reindex A-3 A-9 # 색인을 다시 만든 뒤(index-src) Grid Spec·_index.json 확인
```
- 출력은 항목마다 한 줄이다. ❌면 끝에 적힌 파일(`.yunhee/018-check/NN-….txt`, git-ignored)만 열어 본다. 통째로 다시 실행하지 않는다.
- A-8은 화면 확인 스크립트(`tools/screens/A03.js`)를 돌린다. playwright-core 폴더를 `PW=<…/node_modules>`로 준다(없으면 건너뜀). 이전 세션 경로 예: `/tmp/claude-1000/-home-kdy987-work-framework-sprt/e24a5230-d5a8-4e89-aa0f-1865aa12aeb2/scratchpad/pw/node_modules`.
- 데이터를 바꾸지 않는다(조회·EXPLAIN·`@MybatisTest` 롤백만, 03 원칙 2).

## 3. 0.2.1 기준선 (2026-10-08, 018 반영 전)
`tools/yunhee-018-check.sh A-0 A-2 B C-2 C-5` → ✅ 0 / ❌ 18. 018 이전 상태를 그대로 재현한다.
- A-0·A-2: `analysis` 명령 없음(exit 2)
- B: `compare … --sql emp00_trans_info.selectByText` → `syntax error at or near ","` (`, org00 as ()`), `port-sql` → `LicenseRes`(엉뚱한 조각)
- C-2: `compare … sys05_user_role.selectByRoleId` → `grid cols ⚠️ (missing: note, roleName)`
- C-5: `outline` 경로 2개 → `Got unexpected extra argument`

## 4. 판정과 기록
- 출력이 018 예시와 모양만 다르고 값이 맞으면 통과로 본다. 스크립트는 핵심 값·문자열만 grep한다. 형식이 크게 달라 스크립트 정규식이 안 맞으면 스크립트를 고치고 그 사실을 기록한다.
- 결과를 `~/work/yunhee-cli/docs/수정사항019.md`(018 시험 결과) 형식으로 남긴다: 통과한 것, 남은 ❌(증상·원인 추정·재현 명령).
- 통과한 유형은 `docs/05-작업방법.md` §7 명령표의 분석 행을 `yunhee analysis <type>`으로 바꾸고 "한계(0.2.1, C01)" 줄을 지운다. `../CLAUDE.md` yunhee 절에도 `yunhee analysis --list`를 넣는다(03 원칙 10, 작업기록에 남김).
- 그다음 화면 작업(A04 또는 C01 2단계)에서 `sed`·`grep`·`cat` 대신 `analysis`를 실제로 쓰고, 토큰(`/context`의 Bash·파일 읽기 비율)을 C01·A03(약 32%)과 비교해 08 교훈에 적는다.

## 5. 결과 기록
| 날짜 | 버전 | 결과 | 문서 | 반영 |
|:---|:---|:---|:---|:---|
| 2026-10-08 | 0.2.2 | ✅27 / ❌19 (+재색인 ❌1) | yunhee-cli `docs/수정사항019.md` | — |
| 2026-10-08 | 0.2.3 | ✅47 / ❌0. 스크립트 밖 남은 문제 6개(tobe 렌더 트리 중첩, grid 조건부 숨김 표시, method 값식 괄호·mapperName, addBoolean 렌더, index-src 4분) | yunhee-cli `docs/수정사항020.md` | 05 §7 명령표·한계, `CLAUDE.md`·`../CLAUDE.md` yunhee 절 |
| 2026-10-08 | 0.2.4 | ✅46 / ❌0, 재색인 후 Grid Spec ⚠DB없음 0. 020 6개 모두 해결(tobe 렌더 트리 중첩, grid 정적/조건부 숨김 분리, method 괄호·`addChange prop ← 값`·mapperName → `emp00_trans_info.selectById`, addBoolean 체크박스). index-src 4:06 → 1:47 | 이 표 | 05 §7 기준 0.2.4·한계 정리, 06 항목 6, `CLAUDE.md` 단서 삭제 |

- 검증 스크립트 수정(0.2.2 시험 때): `--reindex`의 로그 폴더를 절대 경로로, `/usr/bin/time` 대신 bash `TIMEFORMAT`.
- 다음 화면 작업에서 `analysis`를 실제로 쓰고, 토큰(Bash·파일 읽기 비율)을 C01·A03의 약 32%와 비교해 08 교훈에 적는다(§4 마지막 항목, 아직 안 함).
