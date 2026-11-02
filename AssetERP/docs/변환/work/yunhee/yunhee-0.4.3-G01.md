# yunhee 0.4.3 — G01(`Apr01_Tab_MyApproveList`) 변환에서 쓴 평가 (2026-10-20)

범위: 화면 1개(본 화면 1단계, 새 API 2개, SQL 1개, 클래스 1개). 일부러 쓴 0.4.3 신기능: `sql-check --only/--summary`, `mapper-run --compare`, `api --wait-deploy`, `-u`, `analysis method`의 `<패키지>.<클래스>` 지정/공용 클래스(`GridBuilder.addApprStep`).

## 잘 된 것 (그대로 업무에 쓸 만함)
| 기능 | 결과 |
|:---|:---|
| `analysis screen --list/--section` | 클래스·버튼·이벤트·그리드 수와 서비스→서버→SQL 표가 한 번에 나옴. 원본 359줄 중 읽은 줄 0 |
| `analysis method <클래스>.<메서드>` / `-o code` | 요약으로 분기·서비스 파라미터 값까지 보이고 필요한 메서드(`retrieve`·`settings`·`buildGrid`)만 원문. 공용 클래스(`GridBuilder.addApprStep`, `Apr01_ApprModel.getKeyId`)도 같은 방식으로 열림 |
| `analysis grid` | 실제 열 순서·폭·제목·렌더러·선택 모드(`SINGLE` 체크박스) 정확. 14열 대조에 그대로 사용 |
| `analysis sql -o sql --param …` | 파라미터 대입·include 펼침·if 분기 평가(`-- 분기 제외`) 정확, `--count`로 AS-IS 행 수 |
| `sql-check --only <glob> --summary` | 새 매퍼만 한 줄 요약(`AprApprMapper: ✅ 10 / ❌ 0`) — 컴파일 전 확인에 편함 |
| `mapper-run … --compare <ns.id> --count` | **가장 쓸모 있었음**. TOBE 매퍼를 DB에서 직접 돌려 AS-IS와 행 수·열 대조(`TOBE rows=41, AS-IS rows=41 ✅ … TOBE ⊇ 그리드 열`). 사원 계정으로 로그인하지 않고 사원 ID를 파라미터로 줘서 5가지 조건을 비교 |
| `run`, `api --log`, `log errors --since 15m` | 배포 실패(`SAXParseException`)를 로그 한 줄로 바로 찾음. `api --log`는 호출된 매퍼·파라미터 표시 |
| `analysis ui --tobe <파일>` | 6/6·2/2·1/1을 그대로 대조표에 옮김 |
| `analysis tobe`, `outline` | F05 구조 참고에 통째 읽기 없이 충분 |

## 한계·버그 (재현 정보 포함)
| # | 명령 | 증상 | 영향 | 우회 |
|---:|:---|:---|:---|:---|
| 1 | `sql-check --tobe` | 매퍼 XML에 `<=`가 이스케이프 없이 들어가 XML이 깨졌는데 **✅ 10/0 통과**. Tomcat 기동 실패(`org.xml.sax.SAXParseException`)로 한 번 배포가 헛돎 | 큼 — 컴파일 전 확인이 이 오류를 못 잡음 | 매퍼 수정 뒤 `python3 -c "xml.dom.minidom.parse(…)"`로 직접 확인. 제안: sql-check가 XML 정형 검사를 먼저 하고 ❌ 처리 |
| 2 | `port-sql … --cols` | 결과 열 별칭이 속성 이름과 다르면(`statusName`→`apr01_status_nm` 등) 12열 중 7열이 `SQL 열 없음`. `SELECT a.*, b.*` 같은 와일드카드 서브쿼리는 `x.*` 이후 열을 찾지 못함. 출력 안에 `<sql id="dcr_tree_down">`가 `<select>` 안으로 들어가 XML이 유효하지 않고 `${empId}`가 그대로 남음 | 중 — 이 SQL은 직접 옮겨야 했음 | 앞 절 `analysis model --sql` 표(속성→resultMap 열)를 보고 직접 작성. 제안: resultMap/별칭 매핑 반영, 중첩 include는 F05처럼 WITH RECURSIVE 본문으로 펼치기 |
| 3 | `analysis screen` 이벤트 | `[E1] classTreeName.TriggerClick [result == null] (L152) → execute()` — 콜백 안 `if (result == null)`을 이벤트 조건으로, 상위 `execute()`를 호출 메서드로 잘못 읽음 | 소 — 이벤트 번호·수는 맞음, 설명만 틀림 | `analysis method …settings -o code`로 확인 |
| 4 | `analysis screen` Grid Spec 블록 | 같은 출력의 `Grid Spec`이 필드 이름을 틀리게 냄(`regEmpNm`·`apprNm`·`classTreeNm`; 실제는 `regEmpName`·`NextApprName`·`classTreeName`)이고 `addApprStep`·`addTextHtml`·`addCell`은 `⚠ 대응 없음` | 소 — `analysis grid`가 정확하므로 그쪽만 신뢰 | `analysis grid`만 사용 |
| 5 | `analysis model --sql` | 속성 `inOutTypeName`·`statusName`의 "SQL 존재"가 ❌/✅로 갈림(SQL에는 `apr01_inout_nm`이 있음). 모델→열 매핑이 resultMap 별칭을 따라가는 곳과 못 따라가는 곳이 섞임 | 소 | SQL 원문과 같이 봄 |
| 6 | `compare` | 앱이 아직 올라오는 중이라 Tomcat 404 HTML이 오면 **`API rows=1, SQL rows=0 ❌`** 로 보임(404 본문을 1행으로 셈). `--wait-deploy`는 `api`에는 있지만 `compare` 결과에는 "404"가 안 나옴 | 중 — 잘못된 불일치로 오인 | 먼저 `yunhee api GET … --wait-deploy`로 200 확인. 제안: HTTP 오류면 rows 대신 오류로 중단 |
| 7 | `api --wait-deploy 90` | 앱 기동이 **실패**한 경우에도 90초 기다리고 `ℹ 배포 후 앱이 아직 올라오는 중일 수 있음 (… 기동 기록 없음)`만 냄 | 소 — 실패와 지연을 구분 못 함 | `yunhee log errors --since 15m`. 제안: 대기 후에도 404면 배포 이후 ERROR 요약을 같이 출력 |
| 8 | `log errors --since-deploy` | `docker exec 실패 (t3600-tomcat): sh: 0: cannot open -c: No such file` — 이 PC(셸 fish)에서만의 문제일 수 있음. `--since 15m`은 동작 | 소 | `--since 15m` 사용 |
| 9 | `api -u 29049` | 사원 ID를 주면 사원번호(104)로 바꿔 `admin:104`로 로그인을 시도하다 401 `없는 아이디`, 서버 로그에 WARN 남음. 이 DB의 로그인 ID가 사원번호가 아님 | 중 — 사원 가장 로그인 못 씀 | `mapper-run`으로 사원 ID를 SQL 파라미터에 직접 줌. 제안: 로그인 ID 테이블(사용자·권한)에서 찾기 |
| 10 | `mapper-run` | ① AS-IS와 TOBE 파라미터 이름이 달라(`empId` / `c.empId`) 두 벌을 다 줘야 함 ② `status=30`처럼 숫자로 보이는 값은 따옴표 없이 들어가 `LIKE 30` 오류 → `'30%'`로 우회 ③ null을 줄 수 없고 값이 없으면 `<if test="c.x != null">`을 참으로 평가(`-- 필요: c.classTreeId`)하며 `null` 문자열은 `'null'`이 됨 ④ 오류 때 실행 SQL 전체를 출력해 매우 김 | 중 — 쓸 수는 있으나 매번 우회 | 위 우회. 제안: `--param-as-is`/접두어 자동, 문자열 강제(`k:s=30`), `null` 지원, 오류 출력 줄이기 |
| 11 | `analysis ui --later "다음 단계=A,B"` | `Dcr10_Lookup_MailSender`(다른 도메인 연결)가 표에 안 나옴. 연결 클래스의 `E0~E34 미구현` 나열이 길어 잡음 | 소 | 연결 클래스는 `--done`만 쓰고 "다음 단계"는 결과확인에 손으로 적음. 제안: 미구현 나열을 개수로 줄이기 |
| 12 | PreToolUse 훅 (`hook_guard.py`) | `tail -3 docs/08-회차인계.md`(AssetERP/CLAUDE.md가 시키는 방법)와 `sed -n … docs/05-작업방법.md`가 "AS-IS·TOBE 직접 읽기"로 **차단**됨. AS-IS 색인(`docs/as-is/…`)이 아닌 설계 문서도 막음 | 소 — Read로 대체 가능하지만 CLAUDE.md와 모순 | `Read`(offset/limit). 제안: `docs/as-is/`·`frontend/`·`backend/`·AS-IS 소스만 막기 |

## 한 줄 평가
- 분석(screen·method·grid·sql)은 정확하고 토큰을 크게 아낀다. 이번 화면에서 원본 Java·매퍼 XML은 한 번도 `Read`하지 않았다.
- 새 기능 중 **`mapper-run --compare`와 `sql-check --only/--summary`가 가장 도움이 됐다**. 대신 한계 #1(sql-check가 XML 깨짐을 못 잡음)이 실제 재배포 한 번을 만들었다.
- `port-sql`은 단순 SELECT에서만 믿을 수 있다. 서브쿼리·별칭이 많은 SQL은 직접 옮기는 편이 빠르다.
- 사원 계정 검증은 여전히 막혀 있다(#9). `mapper-run`으로 SQL 수준의 동일성은 확인했고, 화면·권한은 일괄 시험으로 남긴다.

## 벤치마크 (`tools/yunhee-benchmark.sh`, 약 175초 — `yunhee run`의 기본 120초 타임아웃에 걸려 `-t 500`이 필요했다)
- 0.4.3: 시나리오 17개, 토큰 810,437 → 12,603(절감 98.4%), 정확성 83.8%. 0.4.0과 비교 가능한 11개는 모두 100%·비율 변화 ±0.005 이내.
- 정확성이 내려간 것은 새로 들어간 "취약"(15~20, 알려진 한계 확인용) 시나리오가 아직 통과하지 않기 때문이다 — 회귀는 아니다. 설계 문서의 "수정사항036 반영 시 100%" 기준에 맞춰 036 반영 여부를 yunhee 쪽에 확인할 것.
