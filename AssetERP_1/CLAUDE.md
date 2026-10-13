# AssetERP_1/CLAUDE.md

실제 AssetERP 원본의 **sys 메뉴 화면**을 Spring Boot + React로 변환하는 작업 폴더(브랜치 `AssetERP_1`).
OMS(`../OMS`, AssetERP subset)에서 해 본 변환을 실제 원본으로 다시 해 보고, AssetERP 전체 전환에 드는 비용을 가늠하는 것이 목적이다.
상위 `../CLAUDE.md`(저장소 공통 규칙, yunhee 사용 규칙)도 함께 적용된다.

## 읽는 순서

세션 시작에 **통째로 읽는 것은 `docs/03-절대원칙.md` 하나**다(어떤 지시보다 우선한다). 나머지는 단계에 맞춰 **필요한 절만** 연다 — 절 위치는 `grep -n '^#' docs/0X-*.md`로 찾고 그 줄 범위만 Read(offset/limit)로 읽는다. (사용자 결정 2026-10-12: 세션마다 문서 전체를 다시 읽는 비용을 줄인다)

| 언제 | 읽을 것 | 읽지 않는 것 |
|:---|:---|:---|
| 세션 시작 | `03-절대원칙.md` 전체 | — |
| 세션 시작 | `01-변환목록.md`: 머리 설명(상태 값) + "우선 순서" 표의 첫 `대기` 행(`grep -n '대기' docs/01-변환목록.md \| head`)과 그 ID의 A표 행. **다음 작업은 01 "우선 순서" 표에서 상태가 `대기`인 첫 줄**, 표가 끝나면 상태가 `대기`인 첫 ID(04의 순서) | 끝난 ID 행, B표 |
| 세션 시작 | `05-작업방법.md` §0(시작·끝), §7 "세션 시작"·"A 작업 단계별 명령" 표 | §1 B 작업, §7의 버전별 한계 문단(막힐 때만) |
| 분석 | 05 §2 표·§3 템플릿·§6 대응표, 비슷한 완료 ID의 `docs/work/{id}-작업방법.md` 1개 | 다른 ID의 작업기록·결과확인 |
| 백엔드·프론트 | 05 §5 공통 부품표, §8(그리드 CRUD를 쓸 때) | |
| 확인 | `06-결과확인.md` 확인 항목 표·템플릿 | |
| 끝낼 때 | 05 §4 템플릿. `08-회차인계.md`는 교훈 표 형식만(`tail -3`) 보고 한 줄 추가 | 08 전체 |
| 필요할 때만 | `04-작업순서.md`(순서·상태 흐름을 바꿀 때), `09-업무흐름.md`(권한·메뉴·회사의 업무 조건이 궁금할 때), `07-기반이식.md`(B04~B08) | |

- `docs/work/{id}-*.md`는 지금 하는 ID의 파일만 읽는다. 다른 ID 파일은 필요할 때만 연다.
- 앞에서 읽은 절은 다시 읽지 않는다. 참고할 TOBE 파일은 `yunhee analysis tobe`·`outline`으로 본 뒤 필요한 줄만 읽는다.

## 원본 화면이 정답 (03 원칙 12)

AssetERP는 오래 다듬어진 상용 서비스다. 테이블 CRUD는 이미 원본에서 동작하고, 화면은 그리드 중심(보기 그리드 + 편집 CRUD 그리드)이다.
TOBE는 새로 설계하지 않고 원본의 레이아웃·버튼·이벤트·그리드·메시지·SQL을 그대로 따라간다. 결과확인에서 클래스마다(탭·팝업 포함) 버튼·이벤트·그리드 수를 `yunhee analysis ui <화면> --tobe …`로 세어 대조한다(06 항목 10, `tools/ui-count.sh`는 교차 확인용).

## yunhee 적극 사용 (토큰 절약)

사용자 지시(2026-10-07): yunhee 사용법을 충분히 익히고 작업에 적극 활용해 토큰을 아낀다. 자세한 명령표는 `docs/05-작업방법.md` §7.

- 세션 시작에 `yunhee --version` → 05 §7 기준 버전보다 높으면 `yunhee changelog --since <기준>`으로 바뀐 것만 본다.
- AS-IS 분석은 **`yunhee analysis`**(screen·method·grid·model·sql·ui, `yunhee analysis --list`)로 필요한 것만 뽑는다. 원본 Java·매퍼 XML·긴 색인을 통째로 읽거나 `sed`·`grep`으로 자르지 않는다. 원문은 `analysis method … -o code`로 그 메서드만.
- 테이블은 `yunhee table`, DB 데이터는 `yunhee sql`(읽기 전용, 쓰기 시험은 `--rollback`), TOBE 코드는 `yunhee outline`·`yunhee analysis tobe` → 필요한 줄만, 빌드·테스트·배포는 `yunhee run`.
- 백엔드: SQL은 `yunhee port-sql`·`port-save`로 옮기고, 매퍼는 컴파일 전에 `yunhee sql-check --tobe backend/src/main/resources/mapper`.
- 확인: API는 `yunhee api`(SQL·예외까지 보려면 `--log`), 조회 API와 AS-IS SQL 비교는 `yunhee compare`. 서버 로그는 `docker logs` 대신 `yunhee log`(errors·tail·req·trace, 05 §7 "서버 로그") — 배포 후 `log errors --since-deploy`, 사용자 신고 오류는 재현 전에 `log req … --trace`. 기본 주소는 `.env.local`(AssetERP_1 Tomcat), 고객사 관리자는 `-c <회사코드>`.
- yunhee로 안 되는 것(브라우저 확인)만 `tools/`로 하고, 출력은 몇 줄로 줄인다. 다른 방법을 쓴 사유는 `{id}-작업기록`에 한 줄 남긴다.

## 고정 사항

- AS-IS 원본: `~/work/IDMS-IC` (`application/src/main/java/myApp`, `yunhee config`의 Source(ASIS) = `YUNHEE_ASIS_SRC_DIR`). 2026-10-13에 `~/oms-data/src/Asset-ERP`(옛 버전)에서 바꿨다 — 그 전에 끝낸 ID의 원본 줄 번호는 옛 소스 기준이다.
- DB: docker localhost의 `asseterpdb` (환경변수 `LOCAL_DB`). 다른 DB는 쓰지 않는다.
- 색인(git-ignored, 다시 만들 수 있음):
  - 소스 `docs/as-is/src/` — `menus.md` → `sys/screens/{클래스}.md`
  - DB `docs/as-is/db/` — `tables/{도메인}.md`, `functions/{이름}.md`
  - 메뉴 `docs/as-is/menus.tsv`
  - 저장소 루트의 `../docs/as-is/`는 OMS 색인이다. **섞어 쓰지 않는다.**
- 색인 다시 만들기 (저장소 루트에서. 명령과 menus.tsv SQL은 `docs/05-작업방법.md` B01):
  ```bash
  yunhee index-db .yunhee/asseterp-dbml.md -t AssetERP_1/docs/as-is/db
  yunhee index-src -t AssetERP_1/docs/as-is/src      # 원본은 YUNHEE_ASIS_SRC_DIR
  yunhee sql-check --src-index AssetERP_1/docs/as-is/src -t AssetERP_1/docs/as-is/sql-check.md
  ```
- 패키지·네이밍: `../docs/TOBE-Framework.md` (`kr.co.kfs.asseterp`).
- OMS 결과(`../OMS`, `../docs/OMS-convert.md`)는 **비교만** 한다. 코드를 복사하지 않는다.
- ID 1개 = 세션 1개. 끝나면 01의 상태와 `{id}-작업기록`을 갱신하고 세션을 끝낸다(`/clear`).
