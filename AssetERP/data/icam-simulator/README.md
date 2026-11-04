# ICAM 시뮬레이터 데이터

`asseterp.icam.mode=simulator`일 때 ICAM 읽기(`IcamReader`)가 이 폴더의 CSV를 읽는다. **전부 시험용 가짜 데이터**이며 실제 ICAM 값·접속 정보는 두지 않는다.

- 경로: `{icam|icam2}/{AS-IS 쿼리ID}.csv` — `icam`=운용 서버, `icam2`=자문 서버. 파일이 없으면 0행.
- 첫 줄은 헤더(UTF-8), 쉼표 구분. 값에 쉼표·큰따옴표가 있으면 `"..."`로 감싸고 큰따옴표는 `""`.
- 일반 열 = AS-IS 매퍼 SELECT의 **별칭**(예: `icam02_fund_cd`) 그대로. 빈 칸은 null.
- `@이름` 열 = 조건 전용 열. 같은 이름의 파라미터(`icamCompanyCode`, `stdDate` …)가 오면 값이 일치하는 행만 돌려준다(`%`가 있으면 LIKE). 결과에는 들어가지 않는다.
- 폴더 위치는 `asseterp.icam.simulator-dir`(환경변수 `ASSETERP_ICAM_SIMULATOR_DIR`)로 바꾼다. 개발 프로필 기본은 `../data/icam-simulator`(backend 기준).
- 맞추지 못하는 것: 실제 ICAM 데이터 값, Tibero 방언 차이. 운영 연동 전에 실 ICAM에 읽기 전용으로 한 번 대조한다.
