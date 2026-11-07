# tools/test — 브라우저 시험 도구

화면을 실제 브라우저(Playwright + 시스템 Chrome)로 열어 보는 시험 스크립트 모음. 시험 방법·계정은 `../../docs/5-테스트/README.md`와 `테스트용-회사-계정.md`.

| 파일 | 뜻 |
|:---|:---|
| `list.cjs` | 화면 **열기 + 조회** 연기 시험. 한 화면 또는 그 계정에 보이는 전체 |
| `lib.cjs` | 공용: 브라우저 띄우기, 로그인, 겸직 선택 창 통과, 메뉴 목록, 화면 열기 |

`.cjs`는 CommonJS 방식 Node 스크립트다(`frontend/package.json`이 `"type": "module"`이라 `.js`와 구분하려고 붙인다). 별도 설치 없이 `node 파일.cjs`로 돌린다. `frontend/node_modules`의 `playwright-core`를 빌려 쓰므로 `frontend/package.json`은 건드리지 않는다.

## ⚠ list.cjs 가 보는 것 / 보지 않는 것

**열기와 조회뿐이다. 통과는 "첫 번째 시험"일 뿐 "화면이 맞다"는 뜻이 아니다.**

예: 새 화면 `9999`를 만들어 `list.cjs --screen-no=9999`가 PASS 해도 확인된 것은 아래뿐이다.

| 본다 | 보지 않는다 |
|:---|:---|
| 메뉴에서 화면이 열린다(탭이 생긴다) | 조회 결과가 **맞는지**(값·필터·정렬) |
| 조회 버튼을 누르면 요청이 나간다 | **AS-IS 와 같은** 결과인지 |
| 페이지 예외·서버 5xx·콘솔 오류가 없다 | 저장·수정·삭제, 입력 검증, 버튼 조합 |
| 조회 중 쓰기 요청이 나가지 않는다 | 권한별로 보이는 것, 결재 같은 상태 전이 |
| | 조회창(모달), 다른 화면과의 연동 |

그래서 화면 하나를 끝냈다고 말하려면 `list.cjs` 다음에 이것들이 더 필요하다.

1. **AS-IS 대조** — `yunhee compare`로 조회 SQL 결과를 AS-IS 와 비교한다(데이터가 맞는지는 이쪽이 직접 답한다).
2. **쓰기 시험** — 등록·수정·삭제·저장이 서버에 반영되는지. 먼저 `../db_dump_backup.sh`로 DB 를 백업하고, 시험 행은 알아볼 수 있는 이름으로 만들어 끝에 지운다.
3. **백엔드 업무 로직** — `yunhee run "gradle test"`.
4. **핵심 업무 시나리오** — 결재 상신→승인 같은 흐름 몇 개를 화면으로 끝까지(`../../docs/2-업무분석/`).

`list.cjs`가 가치 있는 곳은 "큰 사고를 빨리 거르는 안전망"이다. 리팩터링 직후나 배포 전에 전체를 한 번 돌려 화면이 깨지거나 조회가 터지지 않았는지 본다. 개발 서버는 React StrictMode 때문에 요청이 두 번씩 나간다(배포본은 한 번).

## 사용

AssetERP 폴더에서. 5173(Vite `./fm.sh run`)과 8080(백엔드 `./bm.sh run`)이 떠 있어야 한다.

```bash
node tools/test/list.cjs --screen-no=1282                  # 한 화면
node tools/test/list.cjs --screen-no=1282,1100             # 여러 화면
node tools/test/list.cjs                                   # kfstest/104 에게 보이는 전체(약 380개, 수 분)
node tools/test/list.cjs --company=kfimtest --user=admin   # 다른 계정
node tools/test/list.cjs --out=/tmp/list.json --verbose    # 결과 파일, 통과 화면도 출력
node tools/test/list.cjs --help
```

옵션: `--screen-no` `--all` `--company` `--user` `--password`(생략하면 환경변수 `ASSETERP_TEST_PASSWORD`, 없으면 테스트 계정 공통 `1111`) `--base-url` `--out` `--concurrency` `--verbose`.

- 조회·출력용 POST(RD 출력 URL `/rd/urls`·`*-rd`·`rd-print`, 조회 본문을 받는 `/data`)는 "조회 중 쓰기 요청"에서 뺀다(`list.cjs`의 `READ_ONLY_POST`). 새 출력용 POST 가 생기면 거기에 더한다.
- 판정은 PASS · WARN(4xx·콘솔 오류·조회 중 쓰기 요청) · FAIL(안 열림·페이지 예외·5xx) · SKIP(그 계정에 없는 화면). FAIL 이 있으면 종료코드 1.
- 조회만 하며 데이터를 바꾸지 않는다.
- `kfstest/admin`은 사람이 손으로 쓰는 계정이다. 같은 계정으로 동시에 로그인하면 세션이 끊길 수 있어 시작할 때 경고를 띄운다. 시험은 `kfstest/104`를 기본으로 쓴다.
- 화면이 많은 계정은 안 보이는 메뉴가 있다. 전체 화면을 보려면 계정(`admin`, `kfimtest/admin` 등)을 바꿔 여러 번 돌린다.

## 알려진 한계

- 단순한 조회 화면 기준이다. 조회 버튼 이름이 `조회`가 아닌 화면은 조회 단계 없이 열기만 본다.
- 겸직 선택 창을 첫 행 체크박스로 통과한다. 창 모양이 바뀌면 `lib.cjs`의 `pass()`를 고친다.
- Chrome 경로는 `CHROME_PATH` 환경변수 또는 `/usr/bin/google-chrome-stable` 등을 찾는다.
