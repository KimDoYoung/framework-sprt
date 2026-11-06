# code-health

`../code-health.sh`가 쓰는 설정·요약기. 사용법과 보고서 읽는 법은 `../../docs/5-테스트/정적분석/README.md`.

| 파일 | 용도 |
|:---|:---|
| `analysis.gradle` | Gradle init script. pmd·checkstyle·spotbugs(+findsecbugs)·CPD 태스크(`cpdJava`·`cpdTs`)와 도구 버전 |
| `pmd-ruleset.xml` | PMD 규칙 선별 |
| `checkstyle.xml` | TOBE 규칙(@Setter/@Data·com.asseterp 금지) + 최소한의 크기·명명 |
| `spotbugs-exclude.xml` | 확실한 오탐 제외(한 줄마다 이유) |
| `eslint/` | frontend ESLint. `package.json`(도구 전용 의존성, `node_modules/`는 gitignore)·`eslint.config.mjs`. `code-health.sh --front`가 frontend 폴더에서 돌려 `raw/eslint.json`을 만든다 |
| `report.py` | raw XML → 요약·목록·수정대장. 등급표 `RULE_GRADE`, 공통화 분류 `KINDS` |

- 도구 버전을 올리면 `analysis.gradle` 위쪽 상수를 고친다. SpotBugs를 올리면 그 pom의 commons-lang3 버전도 맞춘다(Spring Boot dependency-management가 낮춰 분석이 죽는다).
